"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Slot = { time: string; available: boolean };

type Booking = {
  id: number;
  booking_date: string;
  booking_time: string;
  vehicle_type: string;
  full_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  status: string;
  source: string;
  created_at: string;
};

const vehicleTypes = ["Putničko vozilo", "Teretno vozilo", "Motocikl"];

function formatDate(value: string) {
  return value.slice(0, 10);
}

function SourceBadge({ source }: { source: string }) {
  const styles: Record<string, string> = {
    online: "bg-primary-100 text-primary-700",
    telefon: "bg-amber-100 text-amber-700",
    licno: "bg-emerald-100 text-emerald-700",
  };
  const labels: Record<string, string> = {
    online: "Onlajn",
    telefon: "Telefon",
    licno: "Lično",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[source] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[source] ?? source}
    </span>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rescheduleSlots, setRescheduleSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addDate, setAddDate] = useState("");
  const [addTime, setAddTime] = useState("");
  const [addSlots, setAddSlots] = useState<Slot[]>([]);
  const [loadingAddSlots, setLoadingAddSlots] = useState(false);
  const [addSource, setAddSource] = useState<"telefon" | "licno">("telefon");
  const [addVehicleType, setAddVehicleType] = useState("");
  const [addFullName, setAddFullName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addBusy, setAddBusy] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      setError("Učitavanje termina nije uspelo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!rescheduleId || !newDate) {
      setRescheduleSlots([]);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    fetch(`/api/available-slots?date=${newDate}&excludeId=${rescheduleId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setRescheduleSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setRescheduleSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [rescheduleId, newDate]);

  useEffect(() => {
    if (!showAddModal || !addDate) {
      setAddSlots([]);
      return;
    }
    let cancelled = false;
    setLoadingAddSlots(true);
    setAddTime("");
    fetch(`/api/available-slots?date=${addDate}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setAddSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setAddSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingAddSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [showAddModal, addDate]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleCancel = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite da otkažete ovaj termin? Klijent će dobiti email obaveštenje.")) {
      return;
    }
    setBusyId(id);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "cancel" }),
      });
      if (!res.ok) throw new Error("failed");
      await loadBookings();
    } catch {
      setActionError("Otkazivanje nije uspelo. Pokušajte ponovo.");
    } finally {
      setBusyId(null);
    }
  };

  const openReschedule = (booking: Booking) => {
    setRescheduleId(booking.id);
    setNewDate(formatDate(booking.booking_date));
    setNewTime(booking.booking_time);
    setActionError(null);
  };

  const submitReschedule = async () => {
    if (!rescheduleId || !newDate || !newTime) return;
    setBusyId(rescheduleId);
    setActionError(null);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rescheduleId, action: "reschedule", date: newDate, time: newTime }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionError(data.error ?? "Pomeranje termina nije uspelo.");
        return;
      }
      setRescheduleId(null);
      await loadBookings();
    } catch {
      setActionError("Pomeranje termina nije uspelo. Pokušajte ponovo.");
    } finally {
      setBusyId(null);
    }
  };

  const openAddModal = () => {
    setAddDate("");
    setAddTime("");
    setAddSlots([]);
    setAddSource("telefon");
    setAddVehicleType("");
    setAddFullName("");
    setAddPhone("");
    setAddEmail("");
    setAddNotes("");
    setAddError(null);
    setShowAddModal(true);
  };

  const submitAddBooking = async () => {
    setAddError(null);
    if (!addDate || !addTime || !addVehicleType || !addFullName || !addPhone) {
      setAddError("Popunite datum, vreme, tip vozila, ime i telefon.");
      return;
    }
    setAddBusy(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: addDate,
          timeSlot: addTime,
          vehicleType: addVehicleType,
          fullName: addFullName,
          phone: addPhone,
          email: addEmail,
          notes: addNotes,
          source: addSource,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAddError(data.error ?? "Dodavanje termina nije uspelo.");
        return;
      }
      setShowAddModal(false);
      await loadBookings();
    } catch {
      setAddError("Dodavanje termina nije uspelo. Pokušajte ponovo.");
    } finally {
      setAddBusy(false);
    }
  };

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Zakazani termini</h1>
          <p className="mt-1 text-sm text-gray-500">Admin panel — MADAuto</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-md bg-accent-500 px-4 py-2 text-sm font-bold text-white hover:bg-accent-600"
          >
            + Dodaj termin
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-50"
          >
            Odjavi se
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <SourceBadge source="online" /> = zakazano preko sajta
        </span>
        <span className="flex items-center gap-1.5">
          <SourceBadge source="telefon" /> = zakazano telefonom
        </span>
        <span className="flex items-center gap-1.5">
          <SourceBadge source="licno" /> = zakazano lično u radnji
        </span>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {actionError && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {loading ? (
        <p className="mt-8 text-sm text-gray-500">Učitavanje...</p>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto rounded-lg border border-primary-100">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-primary-900 text-white">
                  <th className="p-3 font-semibold">Način</th>
                  <th className="p-3 font-semibold">Datum</th>
                  <th className="p-3 font-semibold">Vreme</th>
                  <th className="p-3 font-semibold">Klijent</th>
                  <th className="p-3 font-semibold">Telefon</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Vozilo</th>
                  <th className="p-3 font-semibold">Napomena</th>
                  <th className="p-3 font-semibold">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {activeBookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-gray-500">
                      Nema zakazanih termina.
                    </td>
                  </tr>
                )}
                {activeBookings.map((b, idx) => (
                  <tr key={b.id} className={idx % 2 === 0 ? "bg-white" : "bg-primary-50"}>
                    <td className="p-3">
                      <SourceBadge source={b.source} />
                    </td>
                    <td className="p-3 font-medium text-primary-900">{formatDate(b.booking_date)}</td>
                    <td className="p-3">{b.booking_time}</td>
                    <td className="p-3">{b.full_name}</td>
                    <td className="p-3">
                      <a href={`tel:${b.phone}`} className="text-primary-600 hover:underline">
                        {b.phone}
                      </a>
                    </td>
                    <td className="p-3">
                      {b.email ? (
                        <a href={`mailto:${b.email}`} className="text-primary-600 hover:underline">
                          {b.email}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-3">{b.vehicle_type}</td>
                    <td className="max-w-[180px] truncate p-3 text-gray-500" title={b.notes ?? ""}>
                      {b.notes || "—"}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openReschedule(b)}
                          disabled={busyId === b.id}
                          className="rounded-md border border-primary-200 px-3 py-1.5 text-xs font-semibold text-primary-800 hover:bg-primary-100 disabled:opacity-50"
                        >
                          Promeni
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel(b.id)}
                          disabled={busyId === b.id}
                          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Otkaži
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cancelledBookings.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-500">Otkazani termini</h2>
              <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[650px] border-collapse text-left text-sm text-gray-400">
                  <tbody>
                    {cancelledBookings.map((b) => (
                      <tr key={b.id} className="border-t border-gray-100">
                        <td className="p-3">
                          <SourceBadge source={b.source} />
                        </td>
                        <td className="p-3 line-through">{formatDate(b.booking_date)}</td>
                        <td className="p-3 line-through">{b.booking_time}</td>
                        <td className="p-3 line-through">{b.full_name}</td>
                        <td className="p-3">{b.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {rescheduleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-primary-900">Promeni termin</h3>
            <p className="mt-1 text-sm text-gray-500">
              Klijent će automatski dobiti email o novom terminu.
            </p>

            <label className="mt-4 block text-sm font-semibold text-primary-900">
              Novi datum
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </label>

            <div className="mt-4">
              <p className="mb-1 block text-sm font-semibold text-primary-900">Novo vreme</p>
              {loadingSlots ? (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500">
                  Provera slobodnih termina...
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {rescheduleSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setNewTime(slot.time)}
                      className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                        !slot.available
                          ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                          : newTime === slot.time
                          ? "bg-accent-500 text-white"
                          : "bg-primary-50 text-primary-800 hover:bg-primary-100"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400">
                Precrtano = termin je već zauzet tog dana.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setRescheduleId(null)}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Otkaži
              </button>
              <button
                type="button"
                onClick={submitReschedule}
                disabled={
                  busyId === rescheduleId ||
                  !rescheduleSlots.some((s) => s.time === newTime && s.available)
                }
                className="flex-1 rounded-md bg-accent-500 px-4 py-2 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-60"
              >
                Sačuvaj
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-primary-900">Dodaj termin ručno</h3>
            <p className="mt-1 text-sm text-gray-500">
              Za termin zakazan telefonom ili lično u radnji — odmah blokira taj slot na sajtu.
            </p>

            <div className="mt-4">
              <p className="mb-1 block text-sm font-semibold text-primary-900">Način zakazivanja</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddSource("telefon")}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold ${
                    addSource === "telefon"
                      ? "border-amber-400 bg-amber-100 text-amber-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  📞 Telefon
                </button>
                <button
                  type="button"
                  onClick={() => setAddSource("licno")}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold ${
                    addSource === "licno"
                      ? "border-emerald-400 bg-emerald-100 text-emerald-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  🧑 Lično u radnji
                </button>
              </div>
            </div>

            <label className="mt-4 block text-sm font-semibold text-primary-900">
              Datum termina
              <input
                type="date"
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </label>

            <div className="mt-4">
              <p className="mb-1 block text-sm font-semibold text-primary-900">Vreme</p>
              {!addDate && (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500">
                  Prvo izaberite datum.
                </p>
              )}
              {addDate && loadingAddSlots && (
                <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500">
                  Provera slobodnih termina...
                </p>
              )}
              {addDate && !loadingAddSlots && (
                <div className="flex flex-wrap gap-2">
                  {addSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setAddTime(slot.time)}
                      className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                        !slot.available
                          ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                          : addTime === slot.time
                          ? "bg-accent-500 text-white"
                          : "bg-primary-50 text-primary-800 hover:bg-primary-100"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <label className="mt-4 block text-sm font-semibold text-primary-900">
              Tip vozila
              <select
                value={addVehicleType}
                onChange={(e) => setAddVehicleType(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Izaberite tip vozila</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-semibold text-primary-900">
              Ime i prezime klijenta
              <input
                type="text"
                value={addFullName}
                onChange={(e) => setAddFullName(e.target.value)}
                placeholder="Petar Petrović"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-primary-900">
                Telefon
                <input
                  type="tel"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                  placeholder="06X XXX XXXX"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </label>
              <label className="block text-sm font-semibold text-primary-900">
                Email (opciono)
                <input
                  type="email"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="ime@primer.com"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm font-semibold text-primary-900">
              Napomena (opciono)
              <textarea
                value={addNotes}
                onChange={(e) => setAddNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </label>

            {addError && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {addError}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Otkaži
              </button>
              <button
                type="button"
                onClick={submitAddBooking}
                disabled={addBusy}
                className="flex-1 rounded-md bg-accent-500 px-4 py-2 text-sm font-bold text-white hover:bg-accent-600 disabled:opacity-60"
              >
                {addBusy ? "Čuvanje..." : "Sačuvaj termin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
