// Build-time data fetch: makes the Congress.gov API the source of truth for the
// dashboard. Writes static JSON the app imports — the API key is used ONLY here
// (build env), never shipped to the browser. Run with: npm run fetch-data
//
// Sources:
//   - Members (roster, party, state, phone, DC office address, photo, official website,
//       leadership role): Congress.gov API  /member/congress/119  +  /member/{bioguideId}
//   - Committee rosters (majority/minority) — the Congress API has NO roster data,
//       so this comes from theunitedstates/congress-legislators (bioguideId-keyed).
//   - Senate class + next-election year: congress-legislators legislators-current.yaml
//       (the API terms carry neither class nor the term end year).
//
// Resilient by design: on any failure it leaves the committed JSON untouched so the
// build still succeeds with last-known-good data.
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { load as yamlLoad } from "js-yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "src", "data");
const API = "https://api.congress.gov/v3";
const KEY = process.env.CONGRESS_API_KEY;
const CONGRESS = 119;
const MEMBERSHIP_URL =
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/committee-membership-current.yaml";
const LEGISLATORS_URL =
  "https://raw.githubusercontent.com/unitedstates/congress-legislators/main/legislators-current.yaml";

// Senate committee code -> app slug + display name, in the order the UI lists them.
const COMMITTEES = [
  ["SSAF", "agriculture", "Agriculture, Nutrition & Forestry"],
  ["SSAP", "appropriations", "Appropriations"],
  ["SSAS", "armed-services", "Armed Services"],
  ["SSBK", "banking", "Banking, Housing & Urban Affairs"],
  ["SSBU", "budget", "Budget"],
  ["SSCM", "commerce", "Commerce, Science & Transportation"],
  ["SSEG", "energy", "Energy & Natural Resources"],
  ["SSEV", "environment", "Environment & Public Works"],
  ["SSFI", "finance", "Finance"],
  ["SSFR", "foreign-relations", "Foreign Relations"],
  ["SSHR", "help", "Health, Education, Labor & Pensions (HELP)"],
  ["SSGA", "homeland-security", "Homeland Security & Governmental Affairs"],
  ["SSJU", "judiciary", "Judiciary"],
  ["SSRA", "rules", "Rules & Administration"],
  ["SSSB", "small-business", "Small Business & Entrepreneurship"],
  ["SLIN", "intelligence", "Select Committee on Intelligence"],
  ["SSVA", "veterans", "Veterans' Affairs"],
];

const STATES = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA",
  Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
  Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO",
  Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH",
  Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url.replace(KEY, "***")}`);
  return r.json();
}

function normPhone(p) {
  const d = (String(p || "").match(/\d/g) || []).join("");
  return d.length === 10 ? `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}` : "";
}

// API officeAddress is "<building>  <City>, ST ZIP" (building separated by a double
// space). Recompose to the app's "<building>, Washington DC 20510" format.
// NOTE: the separate `zipCode` field is unreliable (sometimes 20515 for Senate
// offices), but the zip embedded in the officeAddress string is correct — use that.
function composeAddress(a) {
  if (!a) return "";
  const office = String(a.officeAddress || "");
  const building = office.split(/\s{2,}/)[0].trim();
  if (!building) return "";
  const city = a.city || "Washington";
  const dist = a.district || "DC";
  const zip = office.match(/(\d{5})(?:-\d{4})?\s*$/)?.[1] || a.zipCode || "";
  return `${building}, ${city} ${dist} ${zip}`.trim();
}

// bioguide -> { class, nextElection } from each senator's current term. Resilient:
// returns {} on failure so applyFallback can restore last-known-good values.
async function fetchClassMap() {
  try {
    const res = await fetch(LEGISLATORS_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} for legislators YAML`);
    const people = yamlLoad(await res.text());
    const map = {};
    for (const p of people) {
      const bio = p.id?.bioguide;
      const term = p.terms?.[p.terms.length - 1];
      if (!bio || term?.type !== "sen") continue;
      // Regular terms end early January, so the seat was last/next contested the prior
      // November (end 2027-01-03 -> 2026). Appointed senators' terms instead end ON their
      // special-election day in November (end 2026-11-03 -> up that same year, 2026).
      const end = String(term.end || "");
      const endYear = Number(end.slice(0, 4));
      const endMonth = Number(end.slice(5, 7));
      const nextElection = endYear ? (endMonth <= 6 ? endYear - 1 : endYear) : null;
      map[bio] = { class: term.class || null, nextElection };
    }
    return map;
  } catch (e) {
    console.warn(`[fetch-congress] class map unavailable: ${e.message}`);
    return {};
  }
}

async function fetchSenators(classMap) {
  const members = [];
  for (let offset = 0; ; offset += 250) {
    const j = await getJSON(
      `${API}/member/congress/${CONGRESS}?currentMember=true&limit=250&offset=${offset}&api_key=${KEY}&format=json`
    );
    members.push(...(j.members || []));
    if (!j.pagination?.next) break;
  }
  // The list endpoint exposes each member's CURRENT term, so this selects sitting
  // senators (a member can't currently serve in both chambers).
  const senators = members.filter((m) =>
    (m.terms?.item || []).some((t) => t.chamber === "Senate")
  );

  const out = {};
  const POOL = 8;
  for (let i = 0; i < senators.length; i += POOL) {
    const recs = await Promise.all(
      senators.slice(i, i + POOL).map(async (s) => {
        const m = (await getJSON(`${API}/member/${s.bioguideId}?api_key=${KEY}&format=json`)).member;
        const last = m.lastName || "";
        // Strip the (regex-escaped) last name off directOrderName to keep any middle
        // initial; fall back to firstName if that didn't strip cleanly (e.g. a suffix).
        const esc = last.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const stripped = String(m.directOrderName || "").replace(new RegExp(`\\s*${esc}\\s*$`), "").trim();
        const first = stripped && stripped !== m.directOrderName ? stripped : m.firstName || stripped;
        const abbr = m.partyHistory?.slice(-1)[0]?.partyAbbreviation || "";
        // A few depiction.imageUrl values are double-prefixed (CDN path + absolute URL); unwrap.
        let imageUrl = m.depiction?.imageUrl || "";
        const nested = imageUrl.lastIndexOf("https://");
        if (nested > 0) imageUrl = imageUrl.slice(nested);
        // Current leadership title, if any (e.g. "Majority Leader"); null for most.
        const leadEntry = Array.isArray(m.leadership)
          ? (m.leadership.find((l) => l.current) || m.leadership.find((l) => l.congress === CONGRESS))
          : null;
        const cls = classMap[s.bioguideId] || {};
        return {
          bioguide: s.bioguideId,
          first,
          last,
          party: abbr === "D" || abbr === "R" ? abbr : "I",
          state: STATES[m.state] || m.state || "",
          phone: normPhone(m.addressInformation?.phoneNumber),
          address: composeAddress(m.addressInformation),
          imageUrl,
          website: m.officialWebsiteUrl || "",
          leadership: leadEntry?.type || null,
          class: cls.class ?? null,
          nextElection: cls.nextElection ?? null,
        };
      })
    );
    recs.forEach((r) => (out[r.bioguide] = r));
  }
  return out;
}

async function fetchCommittees() {
  const res = await fetch(MEMBERSHIP_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status} for committee membership YAML`);
  const cm = yamlLoad(await res.text());
  return COMMITTEES.map(([code, id, name]) => {
    const members = cm[code] || [];
    if (!members.length) console.warn(`[fetch-congress] no membership for ${code} (${id})`);
    const side = (which) =>
      members
        .filter((x) => x.party === which)
        .sort((a, b) => (a.rank || 0) - (b.rank || 0))
        .map((x) => x.bioguide);
    return { id, name, majority: side("majority"), minority: side("minority") };
  });
}

// Surface a warning as a GitHub Actions annotation when running in CI, so a degraded-but-
// successful run is visible on the run summary instead of buried in the step log. No-op
// locally. Newlines would break the annotation format, so flatten them.
function annotate(title, message) {
  if (process.env.GITHUB_ACTIONS) console.log(`::warning title=${title}::${String(message).replace(/\s*\n\s*/g, " ")}`);
}

// Keep last-known-good values for any field the API left empty.
function applyFallback(fresh, prev) {
  if (!prev) return fresh;
  for (const rec of Object.values(fresh)) {
    const p = prev[rec.bioguide];
    if (!p) continue;
    // NOTE: `leadership` is intentionally excluded — null means "no current role" and
    // must not be restored from stale data if a senator steps down mid-cycle.
    for (const k of ["first", "last", "party", "state", "phone", "address", "imageUrl", "website", "class", "nextElection"]) {
      if (!rec[k] && p[k]) rec[k] = p[k];
    }
  }
  return fresh;
}

async function main() {
  if (!KEY) {
    console.warn("[fetch-congress] CONGRESS_API_KEY not set — keeping existing committed data.");
    process.exitCode = 1;
    return;
  }
  await mkdir(dataDir, { recursive: true });
  const senPath = join(dataDir, "senators.json");
  const cmPath = join(dataDir, "committees.json");
  const prev = existsSync(senPath) ? JSON.parse(await readFile(senPath, "utf8")) : null;
  const prevCommittees = existsSync(cmPath) ? JSON.parse(await readFile(cmPath, "utf8")) : null;

  const classMap = await fetchClassMap();
  const senators = applyFallback(await fetchSenators(classMap), prev);
  const committees = await fetchCommittees();

  // Sanity guards. These all throw BEFORE any write, so committed data survives a bad
  // fetch. That matters more than it used to: CI now commits this output back to main,
  // so anything written here becomes the new last-known-good and there is no recovering
  // the old values on the next run.
  const n = Object.keys(senators).length;
  if (n < 90) throw new Error(`only ${n} senators fetched — aborting to protect committed data`);

  // A flat floor can't catch losing a handful of records to a truncated pagination
  // response, and applyFallback only restores empty FIELDS — it cannot resurrect a
  // record that's missing entirely. So also require the count not to drop sharply.
  //
  // This compares against the count CI itself commits back, so a GENUINE drop of 4+
  // (an unusual run of vacancies) would otherwise wedge every future run permanently —
  // the baseline can never move down past its own guard. ALLOW_ROSTER_DROP=1 is the
  // escape hatch; the error says so, because whoever hits this will be reading it.
  const prevN = prev ? Object.keys(prev).length : 0;
  if (prevN && n < prevN - 3 && process.env.ALLOW_ROSTER_DROP !== "1")
    throw new Error(
      `senator count fell ${prevN} → ${n} — aborting to protect committed data. ` +
        `If this drop is real (vacancies, not a truncated fetch), re-run with ALLOW_ROSTER_DROP=1 to accept it.`
    );

  // Empty rosters mean the upstream YAML didn't have what we expected (a 200 with a
  // changed schema still parses fine). Distinguish the two shapes of that:
  //   - EVERY committee empty  -> the schema itself broke; abort, protect committed data.
  //   - a few empty            -> more likely a renamed/retired code in COMMITTEES, which
  //                               the pre-existing warn at fetchCommittees() anticipates.
  //                               Aborting the whole run for that would silently freeze
  //                               the senator refresh too, so keep last-known-good for
  //                               just those committees — the same philosophy as
  //                               applyFallback(), which committees otherwise lack.
  const empty = committees.filter((c) => !c.majority.length && !c.minority.length);
  if (empty.length === committees.length)
    throw new Error(
      `all ${committees.length} committee rosters came back empty — upstream schema likely changed; aborting to protect committed data`
    );
  if (empty.length && prevCommittees) {
    const prevById = new Map(prevCommittees.map((c) => [c.id, c]));
    for (const c of empty) {
      const p = prevById.get(c.id);
      // Optional-chain every hop: a prior entry missing majority/minority would
      // otherwise throw a TypeError inside the fallback meant to survive that break.
      if (p?.majority?.length || p?.minority?.length) {
        c.majority = p.majority ?? [];
        c.minority = p.minority ?? [];
        // A frozen roster produces byte-identical output forever: nothing to commit, a
        // green job, and a "Last Updated" date that keeps advancing over stale members.
        // console.warn alone would bury that in the log, so raise a real annotation.
        console.warn(`[fetch-congress] ${c.id}: empty upstream roster — kept last-known-good`);
        annotate(`Committee roster frozen`, `${c.id} came back empty upstream; serving last-known-good members. Check whether its code in COMMITTEES was renamed or retired.`);
      } else {
        console.warn(`[fetch-congress] ${c.id}: empty upstream roster and no fallback available`);
        annotate(`Committee roster empty`, `${c.id} came back empty upstream with no last-known-good to fall back on.`);
      }
    }
  }

  // Flag any committee member missing from the senator set (renders as nothing in the UI).
  const known = new Set(Object.keys(senators));
  for (const c of committees)
    for (const b of [...c.majority, ...c.minority])
      if (!known.has(b)) console.warn(`[fetch-congress] ${c.id}: member ${b} not in senator set`);

  const lastUpdated = new Date().toISOString().slice(0, 10);
  // Sort by bioguide before writing. JSON.stringify follows insertion order, which here
  // is whatever order the API paginated members in — if that ever shifts, every run would
  // produce a whole-file reorder diff and CI would commit + redeploy on every schedule.
  // Codepoint comparison, not localeCompare — the whole point is byte-stable output, and
  // localeCompare's ordering is locale/ICU-dependent. Moot for [A-Z]\d{6} bioguide ids
  // today, but this makes the determinism an actual guarantee rather than a coincidence.
  const sorted = Object.fromEntries(
    Object.entries(senators).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  );
  await writeFile(senPath, JSON.stringify(sorted, null, 2) + "\n");
  await writeFile(cmPath, JSON.stringify(committees, null, 2) + "\n");
  await writeFile(join(dataDir, "meta.json"), JSON.stringify({ lastUpdated }, null, 2) + "\n");
  console.log(`[fetch-congress] wrote ${n} senators, ${committees.length} committees (lastUpdated ${lastUpdated}).`);
}

main().catch((e) => {
  // Exit non-zero so CI can distinguish "upstream unchanged" from "fetch broke" — the
  // two look identical from the committed files alone. This does NOT break the build:
  // deploy.yml marks this step continue-on-error and reads steps.fetch.outcome, so a
  // failure surfaces as a warning and the build proceeds on committed JSON.
  console.error("[fetch-congress] failed:", e.message);
  process.exitCode = 1;
});
