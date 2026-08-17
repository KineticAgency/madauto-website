"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { companyInfo } from "@/lib/data";

const navLinks = [
  { href: "/", label: "Početna" },
  { href: "/usluge", label: "Usluge" },
  { href: "/cenovnik", label: "Cenovnik" },
  { href: "/zakazivanje", label: "Zakazivanje" },
  { href: "/o-nama", label: "O nama" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-primary-900/95 shadow-lg backdrop-blur"
          : "bg-primary-900"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-accent-400">MADAuto</span>
          <span
            className={`text-[11px] text-primary-200 transition-all duration-300 ${
              scrolled ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
            }`}
          >
            Tehnički pregled &amp; auto servis
          </span>
        </Link>

        <nav className="hidden gap-6 text-sm font-medium text-primary-100 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-white ${
                pathname === link.href ? "text-white" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={`tel:${companyInfo.phoneHref}`}
            className="text-sm font-semibold text-primary-100 hover:text-white"
          >
            {companyInfo.phone}
          </a>
          <Link
            href="/zakazivanje"
            className="rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
          >
            Zakaži termin
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${
              menuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-opacity ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-white transition-transform ${
              menuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden bg-primary-900 transition-[max-height] duration-300 md:hidden ${
          menuOpen ? "max-h-96 border-t border-primary-700" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 py-4 text-primary-100">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-700 hover:text-white ${
                pathname === link.href ? "bg-primary-700 text-white" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`tel:${companyInfo.phoneHref}`}
            className="mt-2 rounded-md px-3 py-2 text-sm font-semibold text-primary-100 hover:text-white"
          >
            📞 {companyInfo.phone}
          </a>
          <Link
            href="/zakazivanje"
            className="mt-1 rounded-md bg-accent-500 px-3 py-2 text-center text-sm font-semibold text-white"
          >
            Zakaži termin
          </Link>
        </nav>
      </div>
    </header>
  );
}
