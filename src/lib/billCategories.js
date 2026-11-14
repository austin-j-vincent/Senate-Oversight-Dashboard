// Bill categories = Congress.gov `policyArea.name` values (exact strings, so real API
// data maps straight in), plus "Unassigned" for bills with no policy area yet.
// Colors are from the user's category sheet (2026-11-14). Energy was re-picked by the user
// (it duplicated Education), and six were adjusted so no two pills are hard to tell apart:
// Crime, Finance, Health, Science, Taxation, Transportation. Environmental Protection and
// International Affairs were darkened slightly so their pill text meets 4.5:1 contrast.
export const UNASSIGNED = "Unassigned";

const RAW = [
  ["Agriculture and Food", "AGRI", "#149336"],
  ["Animals", "ANML", "#250E75"],
  ["Armed Forces and National Security", "DEF", "#8E0921"],
  ["Arts, Culture, Religion", "ARTS", "#800080"],
  ["Civil Rights and Liberties, Minority Issues", "CIVL", "#FC304A"],
  ["Commerce", "COMM", "#ABCF60"],
  ["Congress", "CONG", "#6C3082"],
  ["Crime and Law Enforcement", "CRIM", "#36454F"],
  ["Economics and Public Finance", "ECON", "#00693E"],
  ["Education", "EDU", "#FDEE00"],
  ["Emergency Management", "EMRG", "#FF0800"],
  ["Energy", "ENRG", "#F4A460"],
  ["Environmental Protection", "ENV", "#466902"],
  ["Families", "FAM", "#FF91AF"],
  ["Finance and Financial Sector", "FIN", "#008B8B"],
  ["Foreign Trade and International Finance", "TRAD", "#9F8170"],
  ["Geographic Areas, Entities, and Committees", "GEO", "#007FFF"],
  ["Government Operations and Politics", "GOV", "#964B00"],
  ["Health", "HLTH", "#FF6F61"],
  ["Housing and Community Development", "HOUS", "#6F00FF"],
  ["Immigration", "IMM", "#B284BE"],
  ["International Affairs", "INTL", "#B21B6C"],
  ["Labor and Employment", "LAB", "#CFB53B"],
  ["Law", "LAW", "#D1E231"],
  ["Native Americans", "NATV", "#A4DDED"],
  ["Private Legislation", "PRIV", "#3D0C02"],
  ["Public Lands and Natural Resources", "LAND", "#55DD33"],
  ["Science, Technology, Communications", "SCI", "#00CED1"],
  ["Social Sciences and History", "HIST", "#0F52BA"],
  ["Social Welfare", "WELF", "#FFF8DC"],
  ["Sports and Recreation", "SPRT", "#FFA000"],
  ["Taxation", "TAX", "#FF00FF"],
  ["Transportation and Public Works", "TRAN", "#DA70D6"],
  ["Water Resources Development", "WATR", "#7C9ED9"],
  [UNASSIGNED, "N/A", "#C0C0C0"],
];

// Pill text: whichever of cream or navy has the higher WCAG contrast on the pill color.
// Hex values mirror --cream and --bg-navy in index.css; keep them in sync.
const CREAM_HEX = "#e8d8b0";
const NAVY_HEX = "#060d18";

function luminance(hex) {
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function textColorFor(hex) {
  return contrast(hex, NAVY_HEX) > contrast(hex, CREAM_HEX) ? "var(--bg-navy)" : "var(--cream)";
}

// A→Z by name, with Unassigned always last (it's the dropdown's catch-all).
export const BILL_CATEGORIES = RAW
  .map(([name, abbr, color]) => ({ name, abbr, color, text: textColorFor(color) }))
  .sort((a, b) => (a.name === UNASSIGNED) - (b.name === UNASSIGNED) || a.name.localeCompare(b.name));

const BY_NAME = new Map(BILL_CATEGORIES.map((c) => [c.name, c]));

// Unknown or missing policy areas fall back to Unassigned rather than breaking the row.
// Expects the policyArea *name* string (policyArea?.name), not the API's object.
export function getCategory(name) {
  return BY_NAME.get(name) || BY_NAME.get(UNASSIGNED);
}
