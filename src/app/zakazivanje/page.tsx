import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { companyInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Zakazivanje termina — MADAuto",
  description: "Zakažite termin za tehnički pregled ili servis vozila u MADAuto Niš.",
};

export default function ZakazivanjePage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold text-primary-900 sm:text-4xl">Zakazivanje termina</h1>
      <p className="mt-3 text-gray-600">
        Izaberite datum, vreme i tip vozila, a mi ćemo Vas kontaktirati na broj{" "}
        <strong>{companyInfo.phone}</strong> ili email radi potvrde termina.
      </p>

      <div className="mt-10">
        <BookingForm />
      </div>
    </section>
  );
}
