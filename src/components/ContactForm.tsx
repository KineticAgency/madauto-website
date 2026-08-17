"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

type ContactFormValues = {
  fullName: string;
  phone: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>();

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("request-failed");
      setSent(true);
      reset();
    } catch {
      setSubmitError(
        "Došlo je do greške pri slanju poruke. Molimo pozovite nas direktno na 018 528 206."
      );
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-2xl">✅</p>
        <h3 className="mt-2 font-semibold text-primary-900">Poruka je poslata!</h3>
        <p className="mt-1 text-sm text-gray-600">Odgovorićemo Vam u najkraćem roku.</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 text-sm font-semibold text-accent-500 hover:text-accent-600"
        >
          Pošalji novu poruku
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}
      <div>
        <label htmlFor="c-fullName" className="mb-1 block text-sm font-semibold text-primary-900">
          Ime i prezime
        </label>
        <input
          id="c-fullName"
          type="text"
          {...register("fullName", { required: "Molimo unesite ime i prezime." })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-phone" className="mb-1 block text-sm font-semibold text-primary-900">
            Telefon
          </label>
          <input
            id="c-phone"
            type="tel"
            {...register("phone", {
              required: "Molimo unesite broj telefona.",
              pattern: { value: /^[0-9+\s]{6,15}$/, message: "Unesite ispravan broj telefona." },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="c-email" className="mb-1 block text-sm font-semibold text-primary-900">
            Email
          </label>
          <input
            id="c-email"
            type="email"
            {...register("email", {
              required: "Molimo unesite email.",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Unesite ispravnu email adresu." },
            })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="c-message" className="mb-1 block text-sm font-semibold text-primary-900">
          Poruka
        </label>
        <textarea
          id="c-message"
          rows={4}
          {...register("message", {
            required: "Molimo unesite poruku.",
            minLength: { value: 10, message: "Poruka je prekratka." },
          })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 self-start rounded-md bg-accent-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-60"
      >
        {isSubmitting ? "Slanje..." : "Pošalji poruku"}
      </button>
    </form>
  );
}
