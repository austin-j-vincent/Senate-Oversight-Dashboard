import { useState, useMemo } from "react";
import senators from "./data/senators.json";
import committees from "./data/committees.json";
import meta from "./data/meta.json";

// Senators are keyed by bioguideId; committee rosters reference those ids.
function getSenatorInfo(bioguide) {
  return senators[bioguide] || null;
}

function partyColor(party) {
  if (party === "R") return "var(--party-r)";
  if (party === "D") return "var(--party-d)";
  return "var(--party-i)";
}

function partyLabel(party, state) {
  return `${party}-${state}`;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function formatDate(iso) {
  const [y, m, d] = String(iso || "").split("-").map(Number);
  return y && m && d ? `${MONTHS[m - 1]} ${d}, ${y}` : (iso || "");
}

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const markCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const handleCopy = () => {
    // Prefer the async Clipboard API (secure contexts), fall back to a
    // temporary textarea + execCommand for http / older browsers.
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  };
  const fallbackCopy = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      markCopied();
    } catch {
      /* clipboard unavailable — leave the button in its default state */
    }
  };
  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label}`}
      style={{
        background: copied ? "var(--success-bg)" : "var(--overlay-light)",
        border: `1px solid ${copied ? "var(--success-border)" : "var(--border-gold)"}`,
        borderRadius: "3px",
        color: copied ? "var(--success)" : "var(--text-tertiary)",
        fontSize: "10px",
        padding: "2px 6px",
        cursor: "pointer",
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "all 0.2s",
        lineHeight: "1.4",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function SenatorRow({ bioguide }) {
  const info = getSenatorInfo(bioguide);
  if (!info) return null;
  const { first, last, party, state, phone, address } = info;
  const displayName = last;
  const tag = partyLabel(party, state);
  const color = partyColor(party);

  return (
    <div style={{
      padding: "10px 16px",
      borderBottom: "1px solid var(--overlay-light)",
      fontSize: "13px",
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

function CommitteePanel({ committee, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  const allMembers = [...committee.majority, ...committee.minority];
  const uniqueMembers = [...new Set(allMembers)];

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
            {committee.majority.map(b => <SenatorRow key={`maj-${b}`} bioguide={b} />)}
            <div style={{ height: "1px", background: "var(--border-gold-faint)", margin: "2px 0" }} />
            {committee.minority.map(b => <SenatorRow key={`min-${b}`} bioguide={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [filterParty, setFilterParty] = useState("all");
  const [filterState, setFilterState] = useState("");

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

  const allStates = useMemo(() => {
    const states = new Set();
    Object.values(senators).forEach(s => states.add(s.state));
    return [...states].sort();
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-navy)",
      backgroundImage: "radial-gradient(ellipse at 20% 0%, var(--glow-top) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, var(--glow-bottom) 0%, transparent 60%)",
      fontFamily: "'Source Sans 3', 'Helvetica Neue', sans-serif",
      color: "var(--ink)",
    }}>
      {/* Slim sticky header */}
      <header style={{
        padding: "calc(10px + env(safe-area-inset-top)) 20px 10px",
        borderBottom: "1px solid var(--border-gold)",
        background: "var(--surface-header)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: "var(--container)", margin: "0 auto" }}>
          <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "var(--text-eyebrow)", fontWeight: "700", textTransform: "uppercase", marginBottom: "2px" }}>119th Congress · 2025–2026</div>
          <h1 style={{
            fontFamily: "'Playfair Display', 'Times New Roman', serif",
            fontSize: "clamp(14px, 2.5vw, 18px)",
            color: "var(--gold)",
            margin: 0,
            fontWeight: "700",
            lineHeight: 1.2,
          }}>
            Senate Oversight Contact Directory
          </h1>
        </div>
      </header>

      {/* Committees */}
      <main style={{ maxWidth: "var(--container)", margin: "0 auto", padding: "14px 16px 40px" }}>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Search senator or state…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: "7px 12px",
              background: "var(--overlay-light)",
              border: "1px solid var(--border-gold-strong)",
              borderRadius: "4px",
              color: "var(--parchment)",
              fontSize: "13px",
              outline: "none",
              flex: "1 1 140px",
              minWidth: "120px",
            }}
          />
          <select
            value={filterParty}
            onChange={e => setFilterParty(e.target.value)}
            style={{
              padding: "7px 10px",
              background: "var(--surface-select)",
              border: "1px solid var(--border-gold-strong)",
              borderRadius: "4px",
              color: "var(--parchment)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <option value="all">All Parties</option>
            <option value="R">Republican</option>
            <option value="D">Democrat</option>
            <option value="I">Independent</option>
          </select>
          <select
            value={filterState}
            onChange={e => setFilterState(e.target.value)}
            style={{
              padding: "7px 10px",
              background: "var(--surface-select)",
              border: "1px solid var(--border-gold-strong)",
              borderRadius: "4px",
              color: "var(--parchment)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <option value="">All States</option>
            {allStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(search || filterParty !== "all" || filterState) && (
            <button
              onClick={() => { setSearch(""); setFilterParty("all"); setFilterState(""); }}
              style={{
                padding: "7px 10px",
                background: "var(--danger-bg)",
                border: "1px solid var(--danger-border)",
                borderRadius: "4px",
                color: "var(--danger)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >✕ Clear</button>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", marginBottom: "12px" }}>
          {[["R","var(--party-r)","Republican"],["D","var(--party-d)","Democrat"],["I","var(--party-i)","Independent"]].map(([party, color, label]) => (
            <div key={party} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", width: "26px", padding: "2px 0", textAlign: "center", background: color, color: "var(--cream)", fontSize: "11px", fontWeight: "700", borderRadius: "3px" }}>{party}</span>
              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{label}</span>
            </div>
          ))}
          <span style={{ color: "var(--text-faint)", fontSize: "11px", marginLeft: "auto" }}>Majority first · tap to expand</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-faint)" }}>
            No results match your filters.
          </div>
        ) : (
          filtered.map(c => (
            <CommitteePanel key={c.id} committee={c} defaultOpen={false} />
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
    </div>
  );
}
