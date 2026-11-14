const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// "2026-06-21" -> "June 21, 2026"; returns the input unchanged if it isn't an ISO date.
export function formatDate(iso) {
  const [y, m, d] = String(iso || "").split("-").map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (iso || "");
}

// "2026-11-10" -> "11/10/2026"; empty string if it isn't an ISO date.
export function formatDateNumeric(iso) {
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(iso || "").trim());
  if (!match) return "";
  const [, y, m, d] = match;
  return `${m.padStart(2, "0")}/${d.padStart(2, "0")}/${y}`;
}
