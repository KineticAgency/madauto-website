import type { Metadata } from "next";
import RatingBadge from "@/components/RatingBadge";
import { companyInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "O nama — MADAuto",
  description: "Saznajte više o MADAuto stanici za tehnički pregled i auto servisu u Nišu.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold text-primary-900 sm:text-4xl">O nama</h1>

      <div className="mt-6">
        <RatingBadge />
      </div>

      <p className="mt-8 text-xl font-bold leading-snug text-primary-900 sm:text-2xl">
        Tehnički pregled i servis vozila zahtevaju poverenje —{" "}
        <span className="text-accent-500">mi ga gradimo već {new Date().getFullYear() - companyInfo.founded} godine.</span>
      </p>

      <p className="mt-5 text-gray-600">
        Od {companyInfo.founded}. godine rešavamo konkretan problem s kojim se suočava svaki
        vozač: dug proces tehničkog pregleda i servisa, praćen neizvesnošću oko troškova i
        kvaliteta izvedene usluge. Bez čekanja u redu, bez nejasnih dijagnoza i bez iznenađenja
        na računu — samo precizno objašnjenje svake izvršene usluge.
      </p>
      <p className="mt-4 text-gray-600">
        Tehnički pregled, registracija, dijagnostika i servis kočionog sistema dostupni su na
        jednoj adresi, kod tima kome već {new Date().getFullYear() - companyInfo.founded} godina
        veruju vozači iz Niša i okoline. Nije potrebno obilaziti više servisa u potrazi za
        pouzdanom uslugom — sve što vam je potrebno nalazi se na jednom mestu.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-primary-100 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
            Godina osnivanja
          </p>
          <p className="mt-2 text-2xl font-bold text-primary-900">{companyInfo.founded}</p>
        </div>
        <div className="rounded-lg border border-primary-100 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
            Odgovorno lice
          </p>
          <p className="mt-2 text-2xl font-bold text-primary-900">
            {companyInfo.responsiblePerson}
          </p>
        </div>
      </div>
    </section>
  );
}
