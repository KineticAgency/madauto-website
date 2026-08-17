type LogoProps = {
  className?: string;
  iconClassName?: string;
  iconOnly?: boolean;
};

export default function Logo({ className = "", iconClassName = "h-9 w-auto", iconOnly = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 56 70" className={`shrink-0 ${iconClassName}`} aria-hidden="true">
        <path
          d="M28 2 L52 11 V34 C52 51 42 61 28 68 C14 61 4 51 4 34 V11 Z"
          fill="#0f172a"
          stroke="#dc2626"
          strokeWidth="3"
        />
        <text
          x="28"
          y="42"
          fontFamily="Arial Black, Helvetica Neue, sans-serif"
          fontSize="24"
          fill="#f8fafc"
          textAnchor="middle"
        >
          M
        </text>
        <rect x="14" y="48" width="28" height="3" rx="1.5" fill="#dc2626" />
      </svg>
      {!iconOnly && (
        <span className="font-display text-[26px] font-bold tracking-tight">
          <span className="text-accent-500">MAD</span>
          <span className="text-white">auto</span>
        </span>
      )}
    </span>
  );
}
