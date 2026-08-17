import type { Metadata } from "next";
import Link from "next/link";
import { priceList } from "@/lib/data";

export const metadata: Metadata = {
  title: "Cenovnik — MADAuto",
  description: "Cenovnik usluga tehničkog pregleda i auto servisa MADAuto Niš po kategoriji vozila.",
};

export default function CenovnikPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold text-primary-900 sm:text-4xl">Cenovnik</h1>
      <p className="mt-3 text-gray-600">
        Okvirne cene naših usluga po kategoriji vozila. Za tačnu ponudu kontaktirajte nas ili
        zakažite besplatnu procenu.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-primary-100">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-primary-900 text-white">
              <th className="p-4 font-semibold">Usluga</th>
              <th className="p-4 font-semibold">Putnička vozila</th>
              <th className="p-4 font-semibold">Teretna vozila</th>
              <th className="p-4 font-semibold">Motocikli</th>
            </tr>
          </thead>
          <tbody>
            {priceList.map((row, idx) => (
              <tr key={row.usluga} className={idx % 2 === 0 ? "bg-white" : "bg-primary-50"}>
                <td className="p-4 font-medium text-primary-900">{row.usluga}</td>
                <td className="p-4 text-gray-700">{row.putnicka}</td>
                <td className="p-4 text-gray-700">{row.teretna}</td>
                <td className="p-4 text-gray-700">{row.motocikli}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        * Prikazane cene su okvirne i mogu se razlikovati u zavisnosti od tipa i stanja vozila.
      </p>

      <div className="mt-10">
        <Link
          href="/zakazivanje"
          className="inline-block rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-white hover:bg-accent-600"
        >
          Zakaži termin
        </Link>
      </div>
    </section>
  );
}
