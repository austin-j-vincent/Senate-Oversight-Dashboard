import { useState } from "react";

// Copy-to-clipboard button with a transient "✓ Copied" state.
// Prefers the async Clipboard API (secure contexts); falls back to a
// temporary textarea + execCommand for http / older browsers.
export default function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  const markCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const handleCopy = () => {
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
