// src/assets/LangGlyphIcon.tsx
export function LangGlyphIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M12 2c3 3 3 7 3 10s0 7-3 10c-3-3-3-7-3-10s0-7 3-10z" />
      <path d="M2 12c3-3 7-3 10-3s7 0 10 3c-3 3-7 3-10 3s-7 0-10-3z" />
    </svg>
  );
}