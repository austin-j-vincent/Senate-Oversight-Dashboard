import { UNASSIGNED } from "./billCategories";

// PLACEHOLDER DATA for the Bills page frame. One real bill (S. 5696, from the Congress.gov
// API) plus "Bill TBD" rows so the list and "Load 50 More" can be exercised. Will be replaced
// by a bills.json written by scripts/fetch-congress.mjs once the bill cards are designed.
//
// S. 5696 has no policyArea in the API yet (it would really be Unassigned); it's filed under
// Armed Forces here only so the demo row shows a colored category pill.
const SAMPLE = [
  {
    id: "s5696",
    type: "S",
    number: "5696",
    title: "New PACT for Iran Veterans Act",
    introducedDate: "2026-11-10",
    sponsor: { name: "Tammy Duckworth", bioguide: "D000622", party: "D", state: "IL" },
    category: "Armed Forces and National Security",
  },
];

const PLACEHOLDER_COUNT = 199;

const PLACEHOLDERS = Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => ({
  id: `tbd-${i + 1}`,
  placeholder: true,
  type: "",
  number: "",
  title: "Bill TBD",
  introducedDate: "",
  sponsor: null,
  category: UNASSIGNED,
}));

// Newest-introduced first, then highest bill number within the same day. A missing date
// sorts last instead of throwing (a throw here would blank every tab, not just Bills).
const byNewest = (a, b) =>
  (b.introducedDate || "").localeCompare(a.introducedDate || "") ||
  (Number(b.number) || 0) - (Number(a.number) || 0);

export const BILLS = [...[...SAMPLE].sort(byNewest), ...PLACEHOLDERS];

// "S. 5696 — New PACT for Iran Veterans Act"; placeholders show just their title.
export function billLabel(bill) {
  return bill.number ? `${bill.type}. ${bill.number} — ${bill.title}` : bill.title;
}
