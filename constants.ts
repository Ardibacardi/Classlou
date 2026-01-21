import { FAQItem, Review, Subject } from './types';

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Over mij', href: '#about' },
  { label: 'Diensten', href: '#services' },
  { label: 'Tarieven', href: '#rates' },
  { label: 'Ervaringen', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    text: "Ik vond school altijd stressvol, vooral toetsen. Tijdens de bijlessen kreeg ik structuur en zelfvertrouwen. De uitleg is persoonlijk en afgestemd op wat ik nodig heb.",
    author: "Sara (4 havo)"
  },
  {
    id: 2,
    text: "Wij merkten snel verschil bij onze dochter. Ze kreeg meer overzicht en haar cijfers gingen omhoog. Fijn dat er echt aandacht is voor de leerling.",
    author: "Ouder van Emma (3 vwo)"
  },
  {
    id: 3,
    text: "Ik durfde eindelijk vragen te stellen zonder me dom te voelen. De lessen zijn lang genoeg om echt alles te begrijpen.",
    author: "Aya (2 vwo)"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "Hoe lang duurt een bijles?",
    answer: "Een bijles duurt minimaal 1,5 uur om volledige kwaliteit en diepgang te kunnen garanderen. Extra tijd is altijd mogelijk; de duur van de les wordt in overleg bepaald en afgestemd op de wensen van de leerling."
  },
  {
    question: "Werk je ook in weekenden?",
    answer: "Ja, wij werken ook in de weekenden. Dit gaat altijd in overleg en is afhankelijk van de beschikbaarheid."
  },
  {
    question: "Is er ook examenvoorbereiding?",
    answer: "Ja, wij bieden gerichte examen- en toetsvoorbereiding. Hierbij werken we met samenvattingen, oefenopgaven en oude centraal examens, afgestemd op het niveau en de leerdoelen van de leerling."
  },
  {
    question: "Online of fysiek?",
    answer: "Bijles is mogelijk online én fysiek. Online lessen verlopen via een videobelplatform met een digitale schoolbord. Fysieke bijles vindt plaats op onze locatie."
  },
  {
    question: "Hoe kan ik betalen?",
    answer: "Betalen kan via bankoverschrijving. De betaling vindt plaats per maand."
  },
  {
    question: "Kan ik meerdere vakken tegelijk bij jullie volgen?",
    answer: "Ja, het is mogelijk om meerdere vakken tegelijk te volgen. We stellen dan een persoonlijk leerplan op, zodat de lessen goed op elkaar aansluiten."
  },
  {
    question: "Wat als een les niet doorgaat?",
    answer: "Wanneer een les minimaal 48 uur van tevoren wordt afgezegd, kan deze kosteloos worden verplaatst. Bij een te late afmelding wordt de les in rekening gebracht."
  }
];

export const SUBJECTS: Subject[] = [
  { name: "Wiskunde A/B", levels: ["VMBO", "HAVO", "VWO"] },
  { name: "Natuurkunde", levels: ["VMBO", "HAVO", "VWO"] },
  { name: "Scheikunde", levels: ["VMBO", "HAVO", "VWO"] },
  { name: "Engels", levels: ["Basisschool", "VMBO", "HAVO", "VWO"] },
  { name: "Nederlands", levels: ["Basisschool", "VMBO", "HAVO", "VWO"] },
];

export const LEVELS_INFO = [
  "Basisschool groep 3-8",
  "VMBO leerjaar 1-4",
  "HAVO leerjaar 1-5",
  "VWO leerjaar 1-6"
];

export const FEATURES = [
  "Persoonlijke aandacht",
  "Rustige uitleg",
  "Sterke verbetering in cijfers",
  "Professionele begeleiding"
];
