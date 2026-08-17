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

      <p className="mt-6 text-gray-600">
        MADAuto je stanica za tehnički pregled vozila i auto servis sa sedištem u Nišu,
        osnovana {companyInfo.founded}. godine. Preko dve decenije pružamo pouzdane usluge
        tehničkog pregleda, registracije i održavanja vozila, uz stručan tim i savremenu
        dijagnostičku opremu.
      </p>
      <p className="mt-4 text-gray-600">
        Naš cilj je da svakom klijentu obezbedimo brzu, transparentnu i profesionalnu uslugu —
        jer bezbednost na putu počinje ispravnim vozilom.
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
