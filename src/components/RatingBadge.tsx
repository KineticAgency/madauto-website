import { companyInfo } from "@/lib/data";

export default function RatingBadge({ light = false }: { light?: boolean }) {
  const full = Math.floor(companyInfo.rating);
  const hasHalf = companyInfo.rating - full >= 0.5;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
        light ? "bg-white/10 text-white" : "bg-primary-50 text-primary-800"
      }`}
    >
      <span className="flex text-accent-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>
            {i < full ? "★" : i === full && hasHalf ? "★" : "☆"}
          </span>
        ))}
      </span>
      <span className="font-semibold">{companyInfo.rating.toFixed(1)}/5</span>
      <span className={light ? "text-primary-200" : "text-primary-500"}>
        ({companyInfo.reviewsCount} recenzija)
      </span>
    </div>
  );
}
