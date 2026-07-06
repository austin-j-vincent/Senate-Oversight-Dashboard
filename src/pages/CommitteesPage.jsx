import { useState, useMemo, useEffect } from "react";
import committees from "../data/committees.json";
import meta from "../data/meta.json";
import CopyButton from "../components/CopyButton";
import FilterControls from "../components/FilterControls";
import PartyLegend from "../components/PartyLegend";
import { getSenatorInfo, partyColor, partyLabel } from "../lib/senators";
import { formatDate } from "../lib/format";

function SenatorRow({ bioguide, highlight }) {
  const info = getSenatorInfo(bioguide);
  if (!info) return null;
  const { first, last, party, state, phone, address } = info;
  const displayName = last;
  const tag = partyLabel(party, state);
  const color = partyColor(party);

  return (
    <div data-bioguide={bioguide} style={{
      padding: "10px 16px",
      borderBottom: "1px solid var(--overlay-light)",
      fontSize: "13px",
      // Highlight the senator we jumped in for ("who else is on this committee with them").
      background: highlight ? "rgba(var(--border-gold-rgb), 0.14)" : "transparent",
      boxShadow: highlight ? "inset 3px 0 0 var(--gold)" : "none",
      scrollMarginTop: "80px",
      transition: "background 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
        <span style={{
          display: "inline-block",
          padding: "2px 7px",
          borderRadius: "3px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.04em",
          background: color,
          color: "var(--cream)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>{tag}</span>
        <span style={{ color: "var(--parchment)", fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: "600" }}>
          {first} {displayName}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 12px", paddingLeft: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <a href={`tel:${phone}`} style={{
            color: "var(--link)",
            textDecoration: "none",
            fontFamily: "'Courier Prime', 'Courier New', monospace",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}>{phone}</a>
          <CopyButton text={phone} label="phone" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>·</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "12px", lineHeight: "1.4" }}>{address}</span>
          <CopyButton text={address} label="address" />
        </div>
      </div>
    </div>
  );
}

function CommitteePanel({ committee, forceOpen, highlightBioguide }) {
  const [open, setOpen] = useState(false);
  const allMembers = [...committee.majority, ...committee.minority];
  const uniqueMembers = [...new Set(allMembers)];

  // Open programmatically when this committee is the one requested via the URL
  // (e.g. jumped here from a senator's card). Manual toggling still works afterward.
  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <div id={`committee-${committee.id}`} style={{
      marginBottom: "10px",
      border: "1px solid var(--border-gold)",
      borderRadius: "6px",
      overflow: "hidden",
      background: "var(--surface-panel)",
      boxShadow: open ? "0 4px 24px var(--shadow-panel)" : "none",
      transition: "box-shadow 0.3s",
      scrollMarginTop: "72px",
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          background: open ? "var(--surface-panel-head-open)" : "var(--surface-panel-head)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderBottom: open ? "1px solid var(--border-gold-strong)" : "none",
          transition: "background 0.2s",
        }}
      >
        <div>
          <span style={{
            color: "var(--gold)",
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            fontSize: "15px",
            fontWeight: "700",
            letterSpacing: "0.02em",
          }}>{committee.name}</span>
          <span style={{
            marginLeft: "14px",
            color: "var(--text-tertiary)",
            fontSize: "12px",
            fontFamily: "'Courier Prime', monospace",
          }}>{uniqueMembers.length} senators</span>
        </div>
        <span style={{
          color: "var(--gold)",
          fontSize: "18px",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.25s",
          lineHeight: 1,
        }}>▾</span>
      </button>

      {open && (
        <div>
          <div style={{
            padding: "6px 16px 4px",
            borderBottom: "1px solid var(--border-gold-faint)",
            display: "flex",
            gap: "24px",
          }}>
            <span style={{ color: "var(--text-tertiary)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>Senator</span>
            <span style={{ color: "var(--text-tertiary)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase" }}>Phone · DC Mailing Address</span>
          </div>
          <div style={{ background: "var(--surface-rows)" }}>
            {committee.majority.map(b => <SenatorRow key={`maj-${b}`} bioguide={b} highlight={b === highlightBioguide} />)}
            <div style={{ height: "1px", background: "var(--border-gold-faint)", margin: "2px 0" }} />
            {committee.minority.map(b => <SenatorRow key={`min-${b}`} bioguide={b} highlight={b === highlightBioguide} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommitteesPage({ query = "", openCommittee = "", highlightWho = "", navigate = () => {} }) {
  const [search, setSearch] = useState("");
  const [filterParty, setFilterParty] = useState("all");
  const [filterState, setFilterState] = useState("");

  // Apply an incoming senator filter from the URL (e.g. the group icon on a roster
  // card) only when non-empty, so ordinary tab navigation never wipes the user's
  // in-progress committee filter.
  useEffect(() => {
    if (query) setSearch(query);
  }, [query]);

  // Jumped in from a committee name on a senator's card: show that committee's FULL
  // roster (clear filters), open it, and center + highlight the senator we came from
  // — "who else is on this committee with them?". Keyed on `who` too so re-jumping
  // for a different senator/committee re-centers.
  useEffect(() => {
    if (!highlightWho || !openCommittee) return;
    setSearch(""); setFilterParty("all"); setFilterState("");
    const t = setTimeout(() => {
      const panel = document.getElementById(`committee-${openCommittee}`);
      const row = panel?.querySelector(`[data-bioguide="${highlightWho}"]`);
      (row || panel)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 140);
    return () => clearTimeout(t);
  }, [highlightWho, openCommittee]);

  const filtered = useMemo(() => {
    if (!search && filterParty === "all" && !filterState) return committees;

    return committees.map(c => {
      const filterMember = (bioguide) => {
        const info = getSenatorInfo(bioguide);
        if (!info) return false;
        const { first, last, party, state } = info;
        const displayName = last;
        const fullName = `${first} ${displayName}`.toLowerCase();
        const matchSearch = !search || fullName.includes(search.toLowerCase()) || state.toLowerCase().includes(search.toLowerCase());
        const matchParty = filterParty === "all" || party === filterParty;
        const matchState = !filterState || state.toLowerCase() === filterState.toLowerCase();
        return matchSearch && matchParty && matchState;
      };
      const maj = c.majority.filter(filterMember);
      const min = c.minority.filter(filterMember);
      if (maj.length === 0 && min.length === 0) return null;
      return { ...c, majority: maj, minority: min };
    }).filter(Boolean);
  }, [search, filterParty, filterState]);

  return (
    <>
      <main style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "14px 16px 40px" }}>

        <FilterControls
          search={search} setSearch={setSearch}
          filterParty={filterParty} setFilterParty={setFilterParty}
          filterState={filterState} setFilterState={setFilterState}
          extraActive={!!highlightWho}
          onClear={() => navigate("senate", "committees")}
        />
        <PartyLegend hint="Majority first · tap to expand" />

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-faint)" }}>
            No results match your filters.
          </div>
        ) : (
          filtered.map(c => (
            <CommitteePanel
              key={c.id}
              committee={c}
              forceOpen={!!openCommittee && openCommittee === c.id}
              highlightBioguide={openCommittee === c.id ? highlightWho : ""}
            />
          ))
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
        SOURCE: Congress.gov API · congress-legislators · Committee membership subject to change
        <br />
        Last Updated: {formatDate(meta.lastUpdated)} · US Capitol Switchboard: 202-224-3121
      </footer>
    </>
  );
}
