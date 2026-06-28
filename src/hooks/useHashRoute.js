import { useEffect, useState } from "react";

// Hash route shape: #/<chamber>/<tab>  e.g. #/senate/committees
export const CHAMBERS = ["senate", "house"];
export const TABS = ["roster", "bills", "committees"];
export const CHAMBER_LABELS = { senate: "Senate", house: "House" };
export const TAB_LABELS = { roster: "Roster", bills: "Bills", committees: "Committees" };
const DEFAULT = { chamber: "senate", tab: "committees" };

function parseHash() {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/");
  const chamber = CHAMBERS.includes(parts[0]) ? parts[0] : DEFAULT.chamber;
  const tab = TABS.includes(parts[1]) ? parts[1] : DEFAULT.tab;
  return { chamber, tab };
}

const toHash = ({ chamber, tab }) => `#/${chamber}/${tab}`;

// Tiny dependency-free hash router. Returns { chamber, tab, navigate }.
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

  const navigate = (chamber, tab) => {
    window.location.hash = toHash({ chamber, tab });
  };

  return { ...route, navigate };
}
