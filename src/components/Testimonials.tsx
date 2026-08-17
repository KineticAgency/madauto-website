const testimonials = [
  {
    name: "Nikola Jovanović",
    vehicle: "Putničko vozilo",
    rating: 5,
    text: "Brz i profesionalan tehnički pregled, bez čekanja u redu. Zakazao sam onlajn i sve je prošlo tačno na vreme.",
  },
  {
    name: "Milica Stanković",
    vehicle: "Teretno vozilo",
    rating: 5,
    text: "Ljubazno osoblje i jasno objašnjenje svake stavke na servisu. Cene su korektne, a dijagnostika je bila precizna.",
  },
  {
    name: "Aleksandar Ristić",
    vehicle: "Motocikl",
    rating: 4,
    text: "Redovno dolazim na tehnički pregled već par godina. Uvek profesionalno i bez skrivenih troškova.",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-900">Šta kažu naši klijenti</h2>
        <p className="mt-2 text-gray-600">Iskustva klijenata koji su nam poverili svoje vozilo.</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="flex flex-col rounded-lg border border-primary-100 bg-white p-6 shadow-sm"
          >
            <div className="flex text-accent-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < t.rating ? "★" : "☆"}</span>
              ))}
            </div>
            <p className="mt-3 flex-1 text-sm text-gray-600">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-4 border-t border-primary-50 pt-3">
              <p className="text-sm font-semibold text-primary-900">{t.name}</p>
              <p className="text-xs text-gray-500">{t.vehicle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
