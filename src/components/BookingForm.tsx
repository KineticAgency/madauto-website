"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import BookingCalendar from "./BookingCalendar";
import { timeSlots } from "@/lib/data";

type BookingFormValues = {
  date: string;
  timeSlot: string;
  vehicleType: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
};

const vehicleTypes = ["Putničko vozilo", "Teretno vozilo", "Motocikl"];

export default function BookingForm() {
  const [submitted, setSubmitted] = useState<BookingFormValues | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const today = new Date();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
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

  const onSubmit = async (values: BookingFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("request-failed");
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
          <label htmlFor="timeSlot" className="mb-1 block text-sm font-semibold text-primary-900">
            Vremenski slot
          </label>
          <select
            id="timeSlot"
            {...register("timeSlot", { required: "Molimo izaberite vreme." })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Izaberite vreme</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
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
