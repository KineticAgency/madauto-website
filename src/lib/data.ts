export type Service = {
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  category: "pregled" | "servis";
  bullets: string[];
  heroImage: string;
  heroImageAlt: string;
};

export const services: Service[] = [
  {
    slug: "tehnicki-pregled",
    title: "Tehnički pregled",
    shortDesc: "Redovan i vanredni tehnički pregled svih tipova vozila.",
    longDesc:
      "Vršimo redovan i vanredni tehnički pregled putničkih, teretnih vozila i motocikala. Pregled obavljaju ovlašćeni tehničari uz korišćenje savremene opreme, u skladu sa zakonskom regulativom.",
    category: "pregled",
    bullets: [
      "Pregled kočionog i upravljačkog sistema",
      "Provera osvetljenja i signalizacije",
      "Merenje emisije izduvnih gasova",
      "Izdavanje zapisnika o tehničkoj ispravnosti",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1541846476-8e81bf093904?q=80&w=1800&auto=format&fit=crop",
    heroImageAlt: "Crveni automobil u servisnoj garaži",
  },
  {
    slug: "registracija-vozila",
    title: "Registracija vozila",
    shortDesc: "Kompletna registracija i produženje registracije na jednom mestu.",
    longDesc:
      "Omogućavamo brzu i jednostavnu registraciju vozila — od tehničkog pregleda do izdavanja saobraćajne dozvole i registracionih tablica, bez dodatnog čekanja u redovima.",
    category: "pregled",
    bullets: [
      "Produženje registracije",
      "Prva registracija vozila",
      "Izdavanje saobraćajne dozvole",
      "Obaveštenje o isteku registracije",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1632405862117-236585cfb757?q=80&w=1800&auto=format&fit=crop",
    heroImageAlt: "Automobil parkiran u garaži pripremljen za registraciju",
  },
  {
    slug: "auto-dijagnostika",
    title: "Auto dijagnostika",
    shortDesc: "Kompjuterska dijagnostika motora i elektronskih sistema.",
    longDesc:
      "Kompjuterskom dijagnostikom precizno utvrđujemo uzrok kvara na motoru, senzorima i elektronskim sistemima vozila, čime skraćujemo vreme i cenu popravke.",
    category: "servis",
    bullets: [
      "Očitavanje i brisanje grešaka (OBD)",
      "Provera rada senzora i aktuatora",
      "Dijagnostika motora i menjača",
      "Provera elektronskih sistema vozila",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1800&auto=format&fit=crop",
    heroImageAlt: "Detalj motora vozila tokom dijagnostike",
  },
  {
    slug: "servis-kocionog-sistema",
    title: "Servis kočionog sistema",
    shortDesc: "Provera, održavanje i popravka kočionog sistema.",
    longDesc:
      "Kočioni sistem je ključan za bezbednost — vršimo kontrolu, zamenu diskova, pločica i creva, kao i punjenje kočione tečnosti, uz proveru na savremenom uređaju za merenje kočione sile.",
    category: "servis",
    bullets: [
      "Zamena kočionih pločica i diskova",
      "Zamena kočione tečnosti i creva",
      "Merenje kočione sile na valjcima",
      "Provera ručne (parking) kočnice",
    ],
    heroImage:
      "https://images.unsplash.com/photo-1770834807387-820280f8270b?q=80&w=1800&auto=format&fit=crop",
    heroImageAlt: "Detalj crvene kočione čeljusti na točku vozila",
  },
];

export const workingHours = [
  { day: "Ponedeljak", hours: "08:00 – 16:00" },
  { day: "Utorak", hours: "08:00 – 16:00" },
  { day: "Sreda", hours: "08:00 – 16:00" },
  { day: "Četvrtak", hours: "08:00 – 16:00" },
  { day: "Petak", hours: "08:00 – 16:00" },
  { day: "Subota", hours: "08:00 – 13:00" },
  { day: "Nedelja", hours: "Ne radimo" },
];

export type PriceRow = {
  usluga: string;
  putnicka: string;
  teretna: string;
  motocikli: string;
};

export const priceList: PriceRow[] = [
  {
    usluga: "Redovan tehnički pregled",
    putnicka: "2.500 RSD",
    teretna: "4.000 RSD",
    motocikli: "1.800 RSD",
  },
  {
    usluga: "Vanredni tehnički pregled",
    putnicka: "2.000 RSD",
    teretna: "3.500 RSD",
    motocikli: "1.500 RSD",
  },
  {
    usluga: "Registracija vozila (kompletna)",
    putnicka: "3.500 RSD",
    teretna: "5.500 RSD",
    motocikli: "2.500 RSD",
  },
  {
    usluga: "Kompjuterska dijagnostika",
    putnicka: "1.500 RSD",
    teretna: "2.000 RSD",
    motocikli: "1.200 RSD",
  },
  {
    usluga: "Merenje emisije izduvnih gasova",
    putnicka: "1.000 RSD",
    teretna: "1.500 RSD",
    motocikli: "800 RSD",
  },
];

export const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];

export const companyInfo = {
  name: "MADAuto",
  address: "Vojvode Mišića 46/b, Niš",
  phone: "018 528 206",
  phoneHref: "018528206",
  email: "info@madauto.net",
  founded: 2002,
  responsiblePerson: "Dragan Mitić",
  rating: 4.3,
  reviewsCount: 331,
  mapsEmbedSrc: "https://www.google.com/maps?q=43.3207374,21.9074781&z=17&output=embed",
  mapsLink:
    "https://www.google.com/maps/place/Tehni%C4%8Dki+Pregled+MADAUTO/@43.3207413,21.9049032,17z/data=!3m1!4b1!4m6!3m5!1s0x4755b0b8f0e0fee1:0x1e038dc125ab6954!8m2!3d43.3207374!4d21.9074781!16s%2Fg%2F11b6hqfm36",
};
