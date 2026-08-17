import Link from "next/link";
import { companyInfo, workingHours } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-accent-400">MADAuto</p>
          <p className="mt-2 text-sm">
            Stanica za tehnički pregled vozila i auto servis u Nišu. Poverenje
            i bezbednost od {companyInfo.founded}. godine.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-300">
            Kontakt
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>{companyInfo.address}</li>
            <li>
              <a href={`tel:${companyInfo.phoneHref}`} className="hover:text-white">
                {companyInfo.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${companyInfo.email}`} className="hover:text-white">
                {companyInfo.email}
              </a>
            </li>
          </ul>
          <div className="mt-4 flex gap-4 text-sm">
            <Link href="/zakazivanje" className="text-accent-400 hover:text-accent-300">
              Zakaži termin →
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-300">
            Radno vreme
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            {workingHours.map((row) => (
              <li key={row.day} className="flex justify-between gap-4">
                <span>{row.day}</span>
                <span className="text-primary-200">{row.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-700">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-primary-300">
          © {companyInfo.founded}–{new Date().getFullYear()} {companyInfo.name}. Sva prava
          zadržana.
        </p>
      </div>
    </footer>
  );
}
