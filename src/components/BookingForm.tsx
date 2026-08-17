"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import BookingCalendar from "./BookingCalendar";

type BookingFormValues = {
  date: string;
  timeSlot: string;
  vehicleType: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
};

type Slot = { time: string; available: boolean };

const vehicleTypes = ["Putničko vozilo", "Teretno vozilo", "Motocikl"];

export default function BookingForm() {
  const [submitted, setSubmitted] = useState<BookingFormValues | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const today = new Date();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    defaultValues: {
      date: "",
      timeSlot: "",
      vehicleType: "",
      fullName: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const selectedDate = watch("date");

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setLoadingSlots(true);
    setValue("timeSlot", "");
    fetch(`/api/available-slots?date=${selectedDate}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedDate, setValue]);

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) {
          setSubmitError(data.error ?? "Taj termin je upravo zauzet. Molimo izaberite drugi.");
          setSlots((prev) =>
            prev.map((s) => (s.time === values.timeSlot ? { ...s, available: false } : s))
          );
          setValue("timeSlot", "");
          return;
        }
        throw new Error("request-failed");
      }
      setSubmitted(values);
      reset();
    } catch {
      setSubmitError(
        "Došlo je do greške pri slanju zahteva. Molimo pozovite nas direktno na " +
          "018 528 206 ili pokušajte ponovo."
      );
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-2xl">✅</p>
        <h3 className="mt-2 text-xl font-semibold text-primary-900">
          Zahtev za termin je poslat!
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Kontaktiraćemo Vas na broj <strong>{submitted.phone}</strong> radi potvrde
          termina dana <strong>{submitted.date}</strong> u{" "}
          <strong>{submitted.timeSlot}</strong>.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className="mt-6 rounded-md bg-primary-800 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Zakaži još jedan termin
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-2">
      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700 lg:col-span-2">
          {submitError}
        </div>
      )}
      <div>
        <label className="mb-2 block text-sm font-semibold text-primary-900">
          Izaberite datum termina
        </label>
        <Controller
          name="date"
          control={control}
          rules={{ required: "Molimo izaberite datum." }}
          render={({ field }) => (
            <BookingCalendar
              today={today}
              selectedDate={field.value || null}
              onSelect={(dateKey) => field.onChange(dateKey)}
            />
          )}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
        {selectedDate && (
          <p className="mt-2 text-sm text-primary-700">
            Odabrani datum: <strong>{selectedDate}</strong>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-primary-900">
            Vremenski slot
          </label>
          <input type="hidden" {...register("timeSlot", { required: "Molimo izaberite vreme." })} />

          {!selectedDate && (
            <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500">
              Prvo izaberite datum.
            </p>
          )}
          {selectedDate && loadingSlots && (
            <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500">
              Učitavanje termina...
            </p>
          )}
          {selectedDate && !loadingSlots && slots.length === 0 && (
            <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500">
              Nema definisanih termina za odabrani dan.
            </p>
          )}
          {selectedDate && !loadingSlots && slots.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => {
                const isSelected = watch("timeSlot") === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setValue("timeSlot", slot.time, { shouldValidate: true })}
                    className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      !slot.available
                        ? "cursor-not-allowed bg-gray-100 text-gray-400 line-through"
                        : isSelected
                        ? "bg-accent-500 text-white"
                        : "bg-primary-50 text-primary-800 hover:bg-primary-100"
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
          {errors.timeSlot && (
            <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="vehicleType"
            className="mb-1 block text-sm font-semibold text-primary-900"
          >
            Tip vozila
          </label>
          <select
            id="vehicleType"
            {...register("vehicleType", { required: "Molimo izaberite tip vozila." })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Izaberite tip vozila</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.vehicleType && (
            <p className="mt-1 text-sm text-red-600">{errors.vehicleType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fullName" className="mb-1 block text-sm font-semibold text-primary-900">
            Ime i prezime
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Petar Petrović"
            {...register("fullName", {
              required: "Molimo unesite ime i prezime.",
              minLength: { value: 3, message: "Ime je prekratko." },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-primary-900">
              Telefon
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="06X XXX XXXX"
              {...register("phone", {
                required: "Molimo unesite broj telefona.",
                pattern: {
                  value: /^[0-9+\s]{6,15}$/,
                  message: "Unesite ispravan broj telefona.",
                },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-primary-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="ime@primer.com"
              {...register("email", {
                required: "Molimo unesite email.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Unesite ispravnu email adresu.",
                },
              })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-semibold text-primary-900">
            Napomena (opciono)
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Dodatne informacije o vozilu ili terminu..."
            {...register("notes")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          {isSubmitting ? "Slanje..." : "Zakaži termin"}
        </button>
      </div>
    </form>
  );
}
