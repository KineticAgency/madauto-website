import Link from "next/link";
import type { Service } from "@/lib/data";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/usluge/${service.slug}`}
      className="group flex flex-col rounded-lg border border-primary-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent-300 hover:shadow-md"
    >
      <span className="inline-block w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
        {service.category === "pregled" ? "Pregled i registracija" : "Servis i dijagnostika"}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-primary-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm text-gray-600">{service.shortDesc}</p>
      <span className="mt-4 text-sm font-semibold text-accent-500 group-hover:text-accent-600">
        Saznaj više →
      </span>
    </Link>
  );
}
