import { useState, useMemo } from "react";
import senators from "../data/senators.json";
import meta from "../data/meta.json";
import SenatorModal from "../components/SenatorModal";
import FilterControls from "../components/FilterControls";
import PartyLegend from "../components/PartyLegend";
import { RosterIcon } from "../components/icons";
import { getSenatorInfo, partyColor, partyLabel } from "../lib/senators";
import { formatDate } from "../lib/format";

// All senators sorted A→Z by last name (first name breaks ties). Static.
const ROSTER = Object.values(senators).sort(
  (a, b) => a.last.localeCompare(b.last) || a.first.localeCompare(b.first)
);

function RosterRow({ info, onOpen }) {
  const { first, last, party, state } = info;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      padding: "10px 16px",
      borderBottom: "1px solid var(--overlay-light)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <span style={{
          display: "inline-block",
          padding: "2px 7px",
          borderRadius: "3px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.04em",
          background: partyColor(party),
          color: "var(--cream)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>{partyLabel(party, state)}</span>
        <span style={{
          color: "var(--parchment)",
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontWeight: "600",
          fontSize: "14px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>{first} {last}</span>
      </div>
      <button
        onClick={onOpen}
        aria-label={`Open ${first} ${last} dashboard`}
        title="Open dashboard"
        style={{
          color: "var(--gold)",
          background: "var(--overlay-light)",
          border: "1px solid var(--border-gold)",
          borderRadius: "8px",
          padding: "4px 8px",
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <RosterIcon size={24} />
      </button>
    </div>
  );
}

export default function RosterPage({ detail, navigate }) {
  const [search, setSearch] = useState("");
  const [filterParty, setFilterParty] = useState("all");
  const [filterState, setFilterState] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const st = filterState.toLowerCase();
    return ROSTER.filter((s) => {
      const fullName = `${s.first} ${s.last}`.toLowerCase();
      const matchSearch = !q || fullName.includes(q) || s.state.toLowerCase().includes(q);
      const matchParty = filterParty === "all" || s.party === filterParty;
      const matchState = !st || s.state.toLowerCase() === st;
      return matchSearch && matchParty && matchState;
    });
  }, [search, filterParty, filterState]);

  const openSenator = detail && getSenatorInfo(detail) ? detail : null;

  return (
    <>
      <main style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "14px 16px 40px" }}>

        <FilterControls
          search={search} setSearch={setSearch}
          filterParty={filterParty} setFilterParty={setFilterParty}
          filterState={filterState} setFilterState={setFilterState}
        />
        <PartyLegend hint="Tap the ID card to open a senator" />

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-faint)" }}>
            No senators match your filters.
          </div>
        ) : (
          <div style={{
            border: "1px solid var(--border-gold)",
            borderRadius: "6px",
            overflow: "hidden",
            background: "var(--surface-rows)",
          }}>
            {filtered.map((s) => (
              <RosterRow
                key={s.bioguide}
                info={s}
                onOpen={() => navigate("senate", "roster", { detail: s.bioguide })}
              />
            ))}
          </div>
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
        SOURCE: Congress.gov API · congress-legislators · Roster subject to change
        <br />
        Last Updated: {formatDate(meta.lastUpdated)} · US Capitol Switchboard: 202-224-3121
      </footer>

      {openSenator && <SenatorModal bioguide={openSenator} navigate={navigate} />}
    </>
  );
}
