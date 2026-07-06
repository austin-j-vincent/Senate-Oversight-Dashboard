import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";
import { CommitteesIcon } from "./icons";
import { getSenatorInfo, partyColor, partyLabel, committeesForSenator } from "../lib/senators";

// Senator photo with a graceful fallback: some records have no imageUrl (and remote
// images occasionally fail to load), so fall back to an initials monogram.
function Photo({ src, first, last, party }) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;
  const initials = `${first[0] || ""}${last[0] || ""}`.toUpperCase();
  return (
    <div style={{
      width: "104px",
      height: "128px",
      flexShrink: 0,
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid var(--border-gold-strong)",
      background: show ? "var(--surface-select)" : partyColor(party),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {show ? (
        <img
          src={src}
          alt={`${first} ${last}`}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span style={{
          fontFamily: "'Playfair Display', 'Times New Roman', serif",
          fontSize: "36px",
          fontWeight: 700,
          color: "var(--cream)",
          letterSpacing: "0.02em",
        }}>{initials}</span>
      )}
    </div>
  );
}

// Small uppercase field label used above the contact rows.
function FieldLabel({ children }) {
  return (
    <div style={{ color: "var(--text-tertiary)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "3px" }}>
      {children}
    </div>
  );
}

// Full-screen senator dashboard. Opened via #/senate/roster/<bioguide>; closes by
// dropping the detail segment (X, backdrop click, Escape, or browser back).
export default function SenatorModal({ bioguide, navigate }) {
  const close = () => navigate("senate", "roster");

  // Escape closes; lock body scroll while the modal is open.
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const info = getSenatorInfo(bioguide);
  if (!info) return null;
  const { first, last, party, state, phone, address, imageUrl, website, leadership, nextElection } = info;
  const committees = committeesForSenator(bioguide);

  const tagStyle = {
    display: "inline-block",
    padding: "2px 7px",
    borderRadius: "3px",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    background: partyColor(party),
    color: "var(--cream)",
    whiteSpace: "nowrap",
  };

  return (
    <div
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={`${first} ${last} dashboard`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(3, 8, 16, 0.72)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(680px, 92%)",
          maxHeight: "86vh",
          overflowY: "auto",
          background: "var(--bg-navy)",
          border: "1px solid var(--border-gold-strong)",
          borderRadius: "12px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
          padding: "22px",
          paddingBottom: "calc(22px + env(safe-area-inset-bottom))",
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          title="Close"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "30px",
            height: "30px",
            borderRadius: "999px",
            border: "1px solid var(--border-gold)",
            background: "var(--overlay-light)",
            color: "var(--parchment)",
            fontSize: "15px",
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >✕</button>

        {/* Header: photo (left) + identity (right) */}
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", paddingRight: "28px" }}>
          <Photo src={imageUrl} first={first} last={last} party={party} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--parchment)",
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}>{first} {last}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={tagStyle}>{partyLabel(party, state)}</span>
              {leadership && (
                <span style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "3px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--gold)",
                  border: "1px solid var(--border-gold-strong)",
                  background: "var(--surface-panel-head-open)",
                }}>{leadership}</span>
              )}
            </div>
            {nextElection && (
              <div style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "8px" }}>
                Next election {nextElection}
              </div>
            )}
            {website && (
              <a href={website} target="_blank" rel="noopener noreferrer" style={{
                color: "var(--link)",
                fontSize: "12px",
                textDecoration: "none",
                fontFamily: "'Courier Prime', 'Courier New', monospace",
              }}>Official website ↗</a>
            )}
          </div>
        </div>

        {/* Contact */}
        <div style={{ marginTop: "18px", borderTop: "1px solid var(--border-gold-faint)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <FieldLabel>Phone</FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <a href={`tel:${phone}`} style={{
                color: "var(--link)",
                textDecoration: "none",
                fontFamily: "'Courier Prime', 'Courier New', monospace",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}>{phone}</a>
              <CopyButton text={phone} label="phone" />
            </div>
          </div>
          <div>
            <FieldLabel>DC Mailing Address</FieldLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.4 }}>{address}</span>
              <CopyButton text={address} label="address" />
            </div>
          </div>
        </div>

        {/* Committee Assignments */}
        <div style={{ marginTop: "18px", borderTop: "1px solid var(--border-gold-faint)", paddingTop: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <button
              onClick={() => navigate("senate", "committees", { query: `${first} ${last}` })}
              aria-label={`View ${first} ${last}'s committees on the Committee Assignments tab`}
              title="Open in Committee Assignments"
              style={{ color: "var(--gold)", background: "transparent", border: "none", padding: 0, display: "inline-flex", cursor: "pointer" }}
            >
              <CommitteesIcon size={30} />
            </button>
            <h3 style={{
              fontFamily: "'Playfair Display', 'Times New Roman', serif",
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--gold)",
              margin: 0,
            }}>Committee Assignments</h3>
          </div>
          {committees.length === 0 ? (
            <div style={{ color: "var(--text-faint)", fontSize: "13px" }}>No current committee assignments.</div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
              {committees.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => navigate("senate", "committees", { committee: c.id, who: bioguide })}
                    title={`See ${c.name} — ${first} ${last} and everyone else on it`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      width: "100%",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      padding: "5px 4px",
                      borderRadius: "4px",
                      color: "var(--link)",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ color: "var(--text-tertiary)", fontSize: "11px", flexShrink: 0 }}>↗</span>
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
