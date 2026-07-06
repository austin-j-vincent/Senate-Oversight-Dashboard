// Shared inline SVG icons for the tab bar, roster rows, and senator modal.
// All use currentColor so the surrounding element's text color drives them.

// Roster — a person silhouette inside an ID card.
export function RosterIcon({ size = 38 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.3" cy="10" r="2.2" fill="currentColor" />
      <path d="M4.6 16.2c0-2.1 1.7-3.3 3.7-3.3s3.7 1.2 3.7 3.3z" fill="currentColor" />
      <rect x="14" y="9.2" width="5.4" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="14" y="12.4" width="5.4" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

// Bills — a scroll with writing lines.
export function BillsIcon({ size = 38 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
      fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 5.5h8.5v11.5a2.5 2.5 0 0 1-2.5 2.5H8a2.5 2.5 0 0 1-2.5-2.5V7" />
      <path d="M15.5 5.5a2 2 0 0 1 2 2 1.6 1.6 0 0 1-1.6 1.6H15.5" />
      <path d="M5.5 7a1.5 1.5 0 0 1 1.5-1.5" />
      <line x1="8.5" y1="9.5" x2="13" y2="9.5" />
      <line x1="8.5" y1="12.3" x2="13" y2="12.3" />
      <line x1="8.5" y1="15.1" x2="11.4" y2="15.1" />
    </svg>
  );
}

// Committees — multiple overlapping people.
export function CommitteesIcon({ size = 38 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <circle cx="6.4" cy="9.4" r="2.1" />
      <circle cx="17.6" cy="9.4" r="2.1" />
      <path d="M2.4 17c0-2.2 1.7-3.5 4-3.5 0.7 0 1.3 0.12 1.9 0.35l-0.2 3.15z" />
      <path d="M21.6 17c0-2.2-1.7-3.5-4-3.5-0.7 0-1.3 0.12-1.9 0.35l0.2 3.15z" />
      <circle cx="12" cy="7.8" r="2.7" />
      <path d="M6 18c0-3.1 2.7-4.9 6-4.9s6 1.8 6 4.9z" />
    </svg>
  );
}
