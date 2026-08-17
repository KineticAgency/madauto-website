import type { Metadata } from "next";
import ServicesFilter from "@/components/ServicesFilter";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Usluge — MADAuto",
  description:
    "Tehnički pregled, registracija vozila, auto dijagnostika i servis kočionog sistema u MADAuto Niš.",
};

export default function UslugePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-primary-900 sm:text-4xl">Naše usluge</h1>
        <p className="mt-3 text-gray-600">
          Od tehničkog pregleda i registracije, do dijagnostike i servisa kočionog sistema —
          sve na jednom mestu, uz stručan tim i savremenu opremu.
        </p>
      </div>

      <div className="mt-10">
        <ServicesFilter services={services} />
      </div>
    </section>
  );
}
