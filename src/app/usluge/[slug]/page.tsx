import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { companyInfo, services } from "@/lib/data";

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
    <div>
      <section className="relative h-[46vh] min-h-[380px] w-full overflow-hidden bg-primary-900">
        <img
          src={service.heroImage}
          alt={service.heroImageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-primary-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/70 via-transparent to-transparent" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10">
          <Link
            href="/usluge"
            className="mb-4 w-fit text-sm font-medium text-primary-100 hover:text-white"
          >
            ← Nazad na usluge
          </Link>
          <span className="w-fit rounded-full bg-accent-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            {service.category === "pregled" ? "Pregled i registracija" : "Servis i dijagnostika"}
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl">
            {service.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-lg leading-relaxed text-gray-600">{service.longDesc}</p>

            <h2 className="mt-10 text-xl font-bold text-primary-900">Šta uključuje</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 rounded-lg border border-primary-100 bg-primary-50/50 p-4 text-sm text-gray-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                    ✓
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/zakazivanje"
                className="rounded-md bg-accent-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent-500/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-500/40"
              >
                Zakaži termin →
              </Link>
              <Link
                href="/cenovnik"
                className="rounded-md border border-primary-200 px-7 py-3.5 text-sm font-semibold text-primary-800 hover:bg-primary-50"
              >
                Pogledaj cenovnik
              </Link>
            </div>
          </div>

          <aside className="h-fit overflow-hidden rounded-xl border border-primary-100 shadow-sm">
            <iframe
              title="Lokacija MADAuto na mapi"
              src={companyInfo.mapsEmbedSrc}
              width="100%"
              height="200"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-5">
              <p className="text-sm font-bold text-primary-900">Posetite nas</p>
              <p className="mt-1 text-sm text-gray-600">{companyInfo.address}</p>
              <p className="mt-1 text-sm text-gray-600">{companyInfo.phone}</p>
              <a
                href={companyInfo.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-md bg-primary-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-800"
              >
                Otvori u Google Maps →
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
