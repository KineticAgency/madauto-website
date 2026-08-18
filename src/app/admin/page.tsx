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
  email: string;
  notes: string | null;
  status: string;
  created_at: string;
};

function formatDate(value: string) {
  return value.slice(0, 10);
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

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Zakazani termini</h1>
          <p className="mt-1 text-sm text-gray-500">Admin panel — MADAuto</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-50"
        >
          Odjavi se
        </button>
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
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-primary-900 text-white">
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
                    <td colSpan={8} className="p-6 text-center text-gray-500">
                      Nema zakazanih termina.
                    </td>
                  </tr>
                )}
                {activeBookings.map((b, idx) => (
                  <tr key={b.id} className={idx % 2 === 0 ? "bg-white" : "bg-primary-50"}>
                    <td className="p-3 font-medium text-primary-900">{formatDate(b.booking_date)}</td>
                    <td className="p-3">{b.booking_time}</td>
                    <td className="p-3">{b.full_name}</td>
                    <td className="p-3">
                      <a href={`tel:${b.phone}`} className="text-primary-600 hover:underline">
                        {b.phone}
                      </a>
                    </td>
                    <td className="p-3">
                      <a href={`mailto:${b.email}`} className="text-primary-600 hover:underline">
                        {b.email}
                      </a>
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
                <table className="w-full min-w-[600px] border-collapse text-left text-sm text-gray-400">
                  <tbody>
                    {cancelledBookings.map((b) => (
                      <tr key={b.id} className="border-t border-gray-100">
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
    </div>
  );
}
