import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import Testimonials from "@/components/Testimonials";
import HeroBackground from "@/components/HeroBackground";
import DriveByCar from "@/components/DriveByCar";
import { companyInfo, services } from "@/lib/data";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-primary-900 py-24 text-white sm:py-28">
        <HeroBackground />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #fff 0, #fff 2px, transparent 2px, transparent 26px)",
          }}
        />
        <div
          className="pointer-events-none absolute left-1/4 top-0 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #dc2626 0%, transparent 70%)" }}
        />
        <DriveByCar />

        <div className="relative mx-auto max-w-6xl px-4 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-accent-400">
            Stanica za tehnički pregled · Niš
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-6xl font-black leading-[1.35] tracking-tight sm:text-7xl lg:mx-0 lg:max-w-xl lg:text-4xl lg:leading-[1.4] xl:max-w-2xl xl:text-5xl xl:leading-[1.4]">
            Tehnički pregled i servis
            <br />
            <span className="text-accent-500">kojem Niš veruje.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-primary-200 lg:mx-0">
            Brzo, stručno i bez čekanja — vaše vozilo u pouzdanim rukama.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              href="/zakazivanje"
              className="rounded-md bg-accent-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-accent-500/30 transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-xl hover:shadow-accent-500/40"
            >
              Zakaži tehnički pregled →
            </Link>
            <Link
              href="/usluge"
              className="rounded-md border border-white/25 px-8 py-3.5 text-base font-semibold transition-colors hover:bg-white/10"
            >
              Pogledaj usluge
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 lg:mx-0">
            <div className="bg-primary-900 px-6 py-5">
              <p className="text-2xl font-black text-white">
                {new Date().getFullYear() - companyInfo.founded}+
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-300">
                Godina iskustva
              </p>
            </div>
            <div className="bg-primary-900 px-6 py-5">
              <p className="text-2xl font-black text-white">6/7</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-300">
                Dana radimo nedeljno
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-primary-900">Šta radimo</h2>
            <p className="mt-2 text-gray-600">Pregled naših ključnih usluga.</p>
          </div>
          <Link href="/usluge" className="text-sm font-semibold text-accent-500 hover:text-accent-600">
            Sve usluge →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="bg-primary-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-primary-900">Gde se nalazimo</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-primary-100">
              <iframe
                title="Lokacija MADAuto na mapi"
                src={companyInfo.mapsEmbedSrc}
                width="100%"
                height="260"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={companyInfo.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white px-4 py-2.5 text-center text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                Otvori u Google Maps →
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary-900">Zašto MADAuto?</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-accent-500">✓</span>
                Preko {new Date().getFullYear() - companyInfo.founded} godina iskustva (od{" "}
                {companyInfo.founded}.)
              </li>
              <li className="flex gap-2">
                <span className="text-accent-500">✓</span>
                Ocena {companyInfo.rating}/5 na osnovu {companyInfo.reviewsCount} recenzija
              </li>
              <li className="flex gap-2">
                <span className="text-accent-500">✓</span>
                Zakazivanje termina onlajn, bez čekanja
              </li>
              <li className="flex gap-2">
                <span className="text-accent-500">✓</span>
                Adresa: {companyInfo.address}
              </li>
            </ul>
            <Link
              href="/kontakt"
              className="mt-6 inline-block rounded-md bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-800"
            >
              Kontaktirajte nas
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
}
