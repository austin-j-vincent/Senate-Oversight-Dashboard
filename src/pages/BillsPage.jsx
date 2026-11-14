import { useState, useMemo, memo } from "react";
import meta from "../data/meta.json";
import BillFilterControls from "../components/BillFilterControls";
import CategoryLegend, { CategoryPill } from "../components/CategoryLegend";
import { BILLS, billLabel } from "../lib/bills";
import { getCategory } from "../lib/billCategories";
import { formatDate, formatDateNumeric } from "../lib/format";

const PAGE_SIZE = 50;

// Lowercase and strip accents, so "lujan" finds "Luján".
const fold = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

// "S. 5696" / "s5696" / "5696" all match: compare with spaces and periods stripped.
const numberKey = (s) => s.toLowerCase().replace(/[\s.]/g, "");

// Matches from the start of the number, so "S. 50" doesn't also find S. 150 or S.Res. 50.
function matchesNumber(bill, qNum) {
  if (!bill.number || !qNum) return false;
  return numberKey(`${bill.type}${bill.number}`).startsWith(qNum) || bill.number.startsWith(qNum);
}

function matchesSearch(bill, q) {
  if (!q) return true;
  const cat = getCategory(bill.category);
  const fq = fold(q);
  const text = [bill.title, bill.sponsor?.name, cat.name, cat.abbr]
    .filter(Boolean)
    .some((f) => fold(f).includes(fq));
  return text || matchesNumber(bill, numberKey(q));
}

// Collapsed bill row, styled after CommitteePanel. The expanded card is a placeholder until
// the card design pass. Memoized: bill objects never change, so rows only re-render when
// opened or closed.
const BillPanel = memo(function BillPanel({ bill }) {
  const [open, setOpen] = useState(false);
  const date = formatDateNumeric(bill.introducedDate);

  return (
    <div style={{
      marginBottom: "10px",
      border: "1px solid var(--border-gold)",
      borderRadius: "6px",
      overflow: "hidden",
      background: "var(--surface-panel)",
      boxShadow: open ? "0 4px 24px var(--shadow-panel)" : "none",
      transition: "box-shadow 0.3s",
    }}>
      <button
        className="bill-row-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          fontFamily: "inherit",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "14px 20px",
          background: open ? "var(--surface-panel-head-open)" : "var(--surface-panel-head)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderBottom: open ? "1px solid var(--border-gold-strong)" : "none",
          transition: "background 0.2s",
        }}
      >
        <div style={{ minWidth: 0 }}>
          {/* Flex-wrap so a date that drops below a long title starts flush left. */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: "14px", rowGap: "2px" }}>
            <span style={{
              color: bill.placeholder ? "var(--text-muted)" : "var(--gold)",
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "15px",
              fontWeight: "700",
              letterSpacing: "0.02em",
            }}>{billLabel(bill)}</span>
            {date && (
              <span style={{
                color: "var(--text-tertiary)",
                fontSize: "12px",
                fontFamily: "'Courier Prime', monospace",
                whiteSpace: "nowrap",
              }}>{date}</span>
            )}
          </div>
          <div style={{ marginTop: "7px" }}>
            <CategoryPill name={bill.category} />
          </div>
        </div>
        <span aria-hidden="true" style={{
          color: "var(--gold)",
          fontSize: "18px",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.25s",
          lineHeight: 1,
          flexShrink: 0,
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          padding: "14px 20px",
          background: "var(--surface-rows)",
          color: "var(--text-faint)",
          fontSize: "13px",
          fontStyle: "italic",
        }}>
          Bill details coming soon.
        </div>
      )}
    </div>
  );
});

// Memoized: it takes no props, so App's re-render on every route change skips it.
export default memo(function BillsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Any filter change starts the list back at the first 50.
  const updateSearch = (v) => { setSearch(v); setVisibleCount(PAGE_SIZE); };
  const updateCategory = (v) => { setCategory(v); setVisibleCount(PAGE_SIZE); };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BILLS.filter((b) => (!category || getCategory(b.category).name === category) && matchesSearch(b, q));
  }, [search, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <>
      <main style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "14px 16px 40px" }}>

        <BillFilterControls
          search={search} setSearch={updateSearch}
          category={category} setCategory={updateCategory}
        />
        <CategoryLegend hint="Newest first · tap to expand" />

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-faint)" }}>
            No bills match your filters.
          </div>
        ) : (
          <>
            {visible.map((b) => <BillPanel key={b.id} bill={b} />)}

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              marginTop: "16px",
            }}>
              <span aria-live="polite" style={{ color: "var(--text-tertiary)", fontSize: "11px", fontFamily: "'Courier Prime', monospace" }}>
                Showing {visible.length} of {filtered.length}
              </span>
              {hasMore && (
                <button
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  style={{
                    fontFamily: "inherit",
                    color: "var(--gold)",
                    background: "var(--overlay-light)",
                    border: "1px solid var(--border-gold)",
                    borderRadius: "8px",
                    padding: "8px 18px",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "0.04em",
                    cursor: "pointer",
                  }}
                >Load 50 More</button>
              )}
            </div>
          </>
        )}
      </main>

      <footer style={{
        borderTop: "1px solid var(--border-gold-faint)",
        padding: "20px 32px",
        textAlign: "center",
        color: "var(--text-faint)",
        fontSize: "11px",
        letterSpacing: "0.05em",
      }}>
        SOURCE: Congress.gov API · Bill data is placeholder
        <br />
        Last Updated: {formatDate(meta.lastUpdated)} · US Capitol Switchboard: 202-224-3121
      </footer>
    </>
  );
});
