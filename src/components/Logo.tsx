type LogoProps = {
  className?: string;
  iconClassName?: string;
  iconOnly?: boolean;
};

export default function Logo({ className = "", iconClassName = "h-12 w-auto", iconOnly = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 140 100" className={`shrink-0 ${iconClassName}`} aria-hidden="true">
        <ellipse cx="70" cy="50" rx="66" ry="46" fill="#fdfcfb" stroke="#dc2626" strokeWidth="5" />
        <ellipse cx="70" cy="50" rx="58" ry="39" fill="none" stroke="#dc2626" strokeWidth="1.5" />
        <path id="madArc" d="M 30 44 A 44 22 0 0 1 110 44" fill="none" />
        <text
          fontFamily="Georgia, 'Times New Roman', serif"
          fontWeight="700"
          fontSize="16"
          letterSpacing="1.5"
          fill="#dc2626"
        >
          <textPath href="#madArc" startOffset="50%" textAnchor="middle">
            MAD
          </textPath>
        </text>
        <text
          x="70"
          y="72"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fontWeight="600"
          fontSize="21"
          fill="#0f172a"
          textAnchor="middle"
        >
          auto
        </text>
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
