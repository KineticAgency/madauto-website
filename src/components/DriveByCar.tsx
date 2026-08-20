export default function DriveByCar() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-2 z-[3] hidden sm:block"
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 70" className="animate-drive-by h-16 w-auto sm:h-20 lg:h-24">
        <g stroke="#f87171" strokeWidth="3" strokeLinecap="round" opacity="0.55">
          <line x1="198" y1="28" x2="235" y2="28" />
          <line x1="203" y1="38" x2="245" y2="38" />
          <line x1="200" y1="48" x2="230" y2="48" />
        </g>
        <path
          d="M15 55 Q10 40 30 38 L55 37 Q70 15 100 14 Q125 13 138 28 L165 30 Q185 31 195 45 L195 55 Q195 58 190 58 L20 58 Q15 58 15 55 Z"
          fill="#dc2626"
        />
        <path
          d="M60 36 Q75 20 98 18 Q118 17 130 27 L128 36 Z"
          fill="#0f172a"
          opacity="0.88"
        />
        <circle cx="45" cy="58" r="11" fill="#0f172a" />
        <circle cx="45" cy="58" r="5" fill="#94a3b8" />
        <circle cx="160" cy="58" r="11" fill="#0f172a" />
        <circle cx="160" cy="58" r="5" fill="#94a3b8" />
      </svg>
    </div>
  );
}
