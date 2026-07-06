import { useEffect, useState } from "react";

// Hash route shape: #/<chamber>/<tab>[/<detail>][?q=<query>]
//   e.g. #/senate/committees, #/senate/roster/B001288, #/senate/committees?q=Tim+Scott
// `detail` is an optional third segment (the open senator card on the roster);
// `query` is an optional pre-applied filter (e.g. jumping to Committees for a senator).
export const CHAMBERS = ["senate", "house"];
export const TABS = ["roster", "bills", "committees"];
export const CHAMBER_LABELS = { senate: "Senate", house: "House" };
export const TAB_LABELS = { roster: "Roster", bills: "Bills", committees: "Committees" };
const DEFAULT = { chamber: "senate", tab: "committees" };

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [path, queryString = ""] = raw.split("?");
  const parts = path.split("/");
  const params = new URLSearchParams(queryString);
  const chamber = CHAMBERS.includes(parts[0]) ? parts[0] : DEFAULT.chamber;
  const tab = TABS.includes(parts[1]) ? parts[1] : DEFAULT.tab;
  const detail = parts[2] ? decodeURIComponent(parts[2]) : null;
  const query = params.get("q") || "";
  const committee = params.get("c") || "";   // committee panel to auto-open (Committees tab)
  const who = params.get("who") || "";       // bioguide to center + highlight within that panel
  return { chamber, tab, detail, query, committee, who };
}

function toHash({ chamber, tab, detail, query, committee, who }) {
  let h = `#/${chamber}/${tab}`;
  if (detail) h += `/${encodeURIComponent(detail)}`;
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (committee) params.set("c", committee);
  if (who) params.set("who", who);
  const qs = params.toString();
  if (qs) h += `?${qs}`;
  return h;
}

// Tiny dependency-free hash router. Returns { chamber, tab, detail, query, navigate }.
// Shareable/bookmarkable URLs, working back button, refresh-safe — no server config.
export function useHashRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    // Normalize a bare/invalid hash to the canonical default on first load.
    const canonical = toHash(parseHash());
    if (window.location.hash !== canonical) {
      window.history.replaceState(null, "", canonical);
    }
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  // navigate(chamber, tab, { detail, query }) — the third arg is optional so existing
  // two-arg callers keep emitting clean #/<chamber>/<tab> hashes.
  const navigate = (chamber, tab, opts = {}) => {
    window.location.hash = toHash({ chamber, tab, detail: opts.detail, query: opts.query, committee: opts.committee, who: opts.who });
  };

  return { ...route, navigate };
}
