// Build-time data fetch: makes the Congress.gov API the source of truth for the
// dashboard. Writes static JSON the app imports — the API key is used ONLY here
// (build env), never shipped to the browser. Run with: npm run fetch-data
//
// Sources:
//   - Members (roster, party, state, phone, DC office address, photo):
//       Congress.gov API  /member/congress/119  +  /member/{bioguideId}
//   - Committee rosters (majority/minority) — the Congress API has NO roster data,
//       so this comes from theunitedstates/congress-legislators (bioguideId-keyed).
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

async function fetchSenators() {
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
        return {
          bioguide: s.bioguideId,
          first,
          last,
          party: abbr === "D" || abbr === "R" ? abbr : "I",
          state: STATES[m.state] || m.state || "",
          phone: normPhone(m.addressInformation?.phoneNumber),
          address: composeAddress(m.addressInformation),
          imageUrl,
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

// Keep last-known-good values for any field the API left empty.
function applyFallback(fresh, prev) {
  if (!prev) return fresh;
  for (const rec of Object.values(fresh)) {
    const p = prev[rec.bioguide];
    if (!p) continue;
    for (const k of ["first", "last", "party", "state", "phone", "address", "imageUrl"]) {
      if (!rec[k] && p[k]) rec[k] = p[k];
    }
  }
  return fresh;
}

async function main() {
  if (!KEY) {
    console.warn("[fetch-congress] CONGRESS_API_KEY not set — keeping existing committed data.");
    return;
  }
  await mkdir(dataDir, { recursive: true });
  const senPath = join(dataDir, "senators.json");
  const prev = existsSync(senPath) ? JSON.parse(await readFile(senPath, "utf8")) : null;

  const senators = applyFallback(await fetchSenators(), prev);
  const committees = await fetchCommittees();

  const n = Object.keys(senators).length;
  if (n < 90) throw new Error(`only ${n} senators fetched — aborting to protect committed data`);

  // Flag any committee member missing from the senator set (renders as nothing in the UI).
  const known = new Set(Object.keys(senators));
  for (const c of committees)
    for (const b of [...c.majority, ...c.minority])
      if (!known.has(b)) console.warn(`[fetch-congress] ${c.id}: member ${b} not in senator set`);

  const lastUpdated = new Date().toISOString().slice(0, 10);
  await writeFile(senPath, JSON.stringify(senators, null, 2) + "\n");
  await writeFile(join(dataDir, "committees.json"), JSON.stringify(committees, null, 2) + "\n");
  await writeFile(join(dataDir, "meta.json"), JSON.stringify({ lastUpdated }, null, 2) + "\n");
  console.log(`[fetch-congress] wrote ${n} senators, ${committees.length} committees (lastUpdated ${lastUpdated}).`);
}

main().catch((e) => {
  // Never break the build — fall back to committed JSON.
  console.error("[fetch-congress] failed:", e.message);
});
