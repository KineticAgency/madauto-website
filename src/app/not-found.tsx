import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Stranica nije pronađena</h1>
      <p className="mt-4 text-gray-600">Tražena stranica ne postoji.</p>
      <Link href="/" className="mt-6 inline-block text-primary underline">
        Nazad na početnu
      </Link>
    </section>
  );
}
