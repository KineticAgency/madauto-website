import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { companyInfo, workingHours } from "@/lib/data";

export const metadata: Metadata = {
  title: "Kontakt — MADAuto",
  description: "Kontaktirajte MADAuto stanicu za tehnički pregled i auto servis u Nišu.",
};

export default function KontaktPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-primary-900 sm:text-4xl">Kontakt</h1>
      <p className="mt-3 text-gray-600">
        Posetite nas, pozovite ili nam pošaljite poruku — rado ćemo odgovoriti na sva pitanja.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="rounded-lg border border-primary-100 p-6">
            <h2 className="text-lg font-semibold text-primary-900">Podaci za kontakt</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>
                <strong>Adresa:</strong> {companyInfo.address}
              </li>
              <li>
                <strong>Telefon:</strong>{" "}
                <a href={`tel:${companyInfo.phoneHref}`} className="text-primary-600 hover:underline">
                  {companyInfo.phone}
                </a>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${companyInfo.email}`} className="text-primary-600 hover:underline">
                  {companyInfo.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-primary-100 p-6">
            <h2 className="text-lg font-semibold text-primary-900">Radno vreme</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {workingHours.map((row) => (
                <li key={row.day} className="flex justify-between border-b border-primary-50 py-2 last:border-0">
                  <span className="text-primary-800">{row.day}</span>
                  <span className="font-medium text-primary-600">{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-lg border border-primary-100">
            <iframe
              title="Lokacija MADAuto na mapi"
              src={companyInfo.mapsEmbedSrc}
              width="100%"
              height="180"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={companyInfo.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block border-t border-primary-100 bg-primary-50 px-4 py-2.5 text-center text-sm font-semibold text-primary-700 hover:bg-primary-100"
            >
              Otvori u Google Maps →
            </a>
          </div>

          <div className="group relative aspect-[4/3] overflow-hidden rounded-lg shadow-md">
            <img
              src="/images/fasada.jpg"
              alt="Fasada MADAuto stanice za tehnički pregled"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-lg font-bold text-white">Posetite nas</p>
              <p className="text-sm text-primary-100">{companyInfo.address}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-primary-100 p-6">
          <h2 className="text-lg font-semibold text-primary-900">Pošaljite nam poruku</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
