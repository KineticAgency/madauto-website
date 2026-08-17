"use client";

import { useMemo, useState } from "react";
import ServiceCard from "./ServiceCard";
import type { Service } from "@/lib/data";

const filterOptions: { value: "sve" | Service["category"]; label: string }[] = [
  { value: "sve", label: "Sve usluge" },
  { value: "pregled", label: "Pregled i registracija" },
  { value: "servis", label: "Servis i dijagnostika" },
];

export default function ServicesFilter({ services }: { services: Service[] }) {
  const [filter, setFilter] = useState<"sve" | Service["category"]>("sve");

  const filtered = useMemo(
    () => (filter === "sve" ? services : services.filter((s) => s.category === filter)),
    [filter, services]
  );

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Prikazano {filtered.length} od {services.length} usluga
        </p>
        <label className="flex items-center gap-2 text-sm font-medium text-primary-900">
          Filtriraj po kategoriji:
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>
    </div>
  );
}
