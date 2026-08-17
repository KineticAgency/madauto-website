import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import Testimonials from "@/components/Testimonials";
import { companyInfo, services, workingHours } from "@/lib/data";

export default function HomePage() {
  return (
    <div>
      <section className="bg-primary-900 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">
            MADAuto — Tehnički pregled i auto servis
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Brz i pouzdan tehnički pregled i servis vozila u Nišu.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/zakazivanje"
              className="rounded-md bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600"
            >
              Zakaži tehnički pregled
            </Link>
            <Link
              href="/usluge"
              className="rounded-md border border-white/40 px-6 py-3 font-semibold hover:bg-white/10"
            >
              Naše usluge
            </Link>
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
            <h2 className="text-2xl font-bold text-primary-900">Radno vreme</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {workingHours.map((row) => (
                <li key={row.day} className="flex justify-between border-b border-primary-100 py-2">
                  <span className="text-primary-800">{row.day}</span>
                  <span className="font-medium text-primary-600">{row.hours}</span>
                </li>
              ))}
            </ul>
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
