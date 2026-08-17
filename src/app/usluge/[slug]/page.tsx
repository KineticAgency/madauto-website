import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/data";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};
  return {
    title: `${service.title} — MADAuto`,
    description: service.shortDesc,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <Link href="/usluge" className="text-sm font-medium text-primary-600 hover:text-primary-800">
        ← Nazad na usluge
      </Link>

      <span className="mt-4 inline-block w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
        {service.category === "pregled" ? "Pregled i registracija" : "Servis i dijagnostika"}
      </span>

      <h1 className="mt-3 text-3xl font-bold text-primary-900 sm:text-4xl">{service.title}</h1>
      <p className="mt-4 text-gray-600">{service.longDesc}</p>

      <ul className="mt-8 space-y-3">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-gray-700">
            <span className="mt-0.5 text-accent-500">✓</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/zakazivanje"
          className="rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
        >
          Zakaži termin
        </Link>
        <Link
          href="/cenovnik"
          className="rounded-md border border-primary-200 px-6 py-3 text-sm font-semibold text-primary-800 hover:bg-primary-50"
        >
          Pogledaj cenovnik
        </Link>
      </div>
    </section>
  );
}
