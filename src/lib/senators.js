// Shared senator/committee helpers used by both the Committees and Roster pages.
// Senators are keyed by bioguideId; committee rosters reference those ids.
import senators from "../data/senators.json";
import committees from "../data/committees.json";

// Sorted, de-duped list of the states represented — static (data is fixed at build).
export const ALL_STATES = [...new Set(Object.values(senators).map((s) => s.state))].sort();

export function getSenatorInfo(bioguide) {
  return senators[bioguide] || null;
}

export function partyColor(party) {
  if (party === "R") return "var(--party-r)";
  if (party === "D") return "var(--party-d)";
  return "var(--party-i)";
}

export function partyLabel(party, state) {
  return `${party}-${state}`;
}

// Committees this senator sits on, in committees.json (UI display) order.
export function committeesForSenator(bioguide) {
  return committees.filter(
    (c) => c.majority.includes(bioguide) || c.minority.includes(bioguide)
  );
}
