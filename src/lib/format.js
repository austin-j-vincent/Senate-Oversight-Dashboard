const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// "2026-06-21" -> "June 21, 2026"; returns the input unchanged if it isn't an ISO date.
export function formatDate(iso) {
  const [y, m, d] = String(iso || "").split("-").map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (iso || "");
}
