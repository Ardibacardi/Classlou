import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  Euro,
  Gift,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  CITO_CANCEL,
  CITO_DURATION,
  CITO_FORMAT,
  CITO_LOCATIONS,
  CITO_PRICE,
  CITO_PRICE_NOTE,
  CITO_TARGET_GROUP,
  CITO_TRAINING_SLOTS,
  CONTACT_EMAIL,
  FORM_ENDPOINT,
  HERO_INTRO,
  HERO_TITLE,
  ING_PAYMENT_LINK,
  WHATSAPP_LINK,
} from './citoConfig';

/* ------------------------------------------------------------------ types */

interface FormState {
  parentName: string;
  email: string;
  phone: string;
  childFirstName: string;
  childGroup: string;
  slotId: string;
  comments: string;
}

type Errors = Partial<Record<keyof FormState, string>>;
type Step = 'form' | 'pay' | 'done';
type SubmitStatus = 'idle' | 'submitting' | 'error';

const EMPTY_FORM: FormState = {
  parentName: '',
  email: '',
  phone: '',
  childFirstName: '',
  childGroup: '',
  slotId: '',
  comments: '',
};

const FIELDS: Array<{ label: string; name: keyof FormState; type: 'text' | 'email' | 'tel' | 'select' | 'textarea'; required: boolean; placeholder?: string; options?: string[]; hint?: string }> = [
  { label: 'Naam ouder/verzorger', name: 'parentName', type: 'text', required: true, placeholder: 'Bijv. Sanne de Vries' },
  { label: 'E-mailadres', name: 'email', type: 'email', required: true, placeholder: 'Bijv. naam@voorbeeld.nl' },
  { label: 'Telefoonnummer', name: 'phone', type: 'tel', required: true, placeholder: 'Bijv. 06 12345678' },
  { label: 'Voornaam kind', name: 'childFirstName', type: 'text', required: true, placeholder: 'Bijv. Emma' },
  { label: 'Groep van het kind', name: 'childGroup', type: 'select', required: true, options: ['Groep 5', 'Groep 6', 'Groep 7', 'Groep 8', 'Anders, namelijk'] },
];

const STEPS: Array<{ id: Step; label: string }> = [
  { id: 'form', label: 'Gegevens invullen' },
  { id: 'pay', label: 'Betalen' },
  { id: 'done', label: 'Bevestiging' },
];

/* ------------------------------------------------------------- validation */

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v.trim());

const validate = (form: FormState): Errors => {
  const e: Errors = {};

  const name = form.parentName.trim();
  if (!name) e.parentName = 'Vul de naam van de ouder/verzorger in.';
  else if (name.length < 2) e.parentName = 'Vul uw volledige naam in.';
  else if (!/\s/.test(name)) e.parentName = 'Vul uw voor- en achternaam in, bijvoorbeeld Sanne de Vries.';

  const email = form.email.trim();
  if (!email) e.email = 'Vul uw e-mailadres in.';
  else if (!isEmail(email)) e.email = 'Dit e-mailadres lijkt niet te kloppen. Voorbeeld: naam@voorbeeld.nl';

  const digits = form.phone.replace(/[^0-9]/g, '');
  if (!form.phone.trim()) e.phone = 'Vul uw telefoonnummer in.';
  else if (digits.length < 9 || digits.length > 15) e.phone = 'Dit telefoonnummer lijkt niet te kloppen. Voorbeeld: 06 12345678';

  if (!form.childFirstName.trim()) e.childFirstName = 'Vul de voornaam van uw kind in.';
  else if (!/^[A-Za-zÀ-ÿ' -]{2,}$/.test(form.childFirstName.trim())) e.childFirstName = 'Vul alleen de voornaam van uw kind in, zonder cijfers.';

  if (!form.childGroup) e.childGroup = 'Kies de groep waarin uw kind zit.';

  if (!form.slotId) e.slotId = 'Kies een trainingsmoment.';

  return e;
};

/* ------------------------------------------------------------------ utils */

const makeReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  for (let i = 0; i < 4; i += 1) tail += chars[Math.floor(Math.random() * chars.length)];
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `CITO-${stamp}-${tail}`;
};

const fieldInputClass = (invalid: boolean) =>
  `w-full px-4 py-3 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    invalid ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-300'
  }`;

/* --------------------------------------------------------------- section */

const SectionHeading: React.FC<{ eyebrow?: string; title: string; intro?: string; center?: boolean }> = ({ eyebrow, title, intro, center }) => (
  <div className={center ? 'text-center' : ''}>
    {eyebrow && <p className="text-sm font-bold uppercase tracking-wider text-secondary mb-2">{eyebrow}</p>}
    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{title}</h2>
    {intro && <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">{intro}</p>}
  </div>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-3 text-gray-600 leading-relaxed">
    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
    <span>{children}</span>
  </li>
);

/* --------------------------------------------------------------- the page */

const CitoPage: React.FC = () => {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [showValidation, setShowValidation] = useState(false);
  const [reference, setReference] = useState('');
  const [paymentReported, setPaymentReported] = useState(false);
  const [paymentReportStatus, setPaymentReportStatus] = useState<SubmitStatus>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formInView, setFormInView] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);

  const slot = useMemo(() => CITO_TRAINING_SLOTS.find((s) => s.id === form.slotId), [form.slotId]);
  const hasOnlineSlot = useMemo(() => CITO_TRAINING_SLOTS.some((s) => /online/i.test(s.location)), []);
  const errorList = useMemo(() => Object.entries(errors).map(([k, v]) => ({ field: k as keyof FormState, message: v as string })), [errors]);

  /* keep the funnel on the same step after a page refresh */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('cito_state');
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved && (saved.step === 'pay' || saved.step === 'done')) {
          setStep(saved.step);
          setReference(saved.reference || '');
          setForm({ ...EMPTY_FORM, ...(saved.form || {}) });
          setPaymentReported(!!saved.paymentReported);
        }
      }
    } catch (err) {
      /* niets opslaan is geen probleem */
    }
  }, []);

  useEffect(() => {
    try {
      if (step === 'form') sessionStorage.removeItem('cito_state');
      else sessionStorage.setItem('cito_state', JSON.stringify({ step, reference, form, paymentReported }));
    } catch (err) {
      /* ignore */
    }
  }, [step, reference, form, paymentReported]);

  /* hide the mobile sticky bar while the form itself is on screen */
  useEffect(() => {
    const el = formSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver((entries) => setFormInView(entries[0].isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goToForm = () => {
    setStep('form');
    setTimeout(() => {
      const el = document.getElementById('inschrijven');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitted) {
      const next = { ...form, [name]: value };
      const found = validate(next);
      setErrors(found);
      if (Object.keys(found).length === 0) setShowValidation(false);
    }
  };

  const payload = (ref: string, extra: Record<string, string>) => ({
    _template: 'table',
    Referentie: ref,
    Ouder: form.parentName.trim(),
    Email: form.email.trim(),
    Telefoon: form.phone.trim(),
    Kind: form.childFirstName.trim(),
    Groep: form.childGroup,
    Trainingsmoment: slot ? `${slot.day}, ${slot.time}` : '',
    Locatie: slot ? slot.location : '',
    Investering: CITO_PRICE,
    Opmerkingen: form.comments.trim() || '-',
    ...extra,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setShowValidation(true);
      const first = Object.keys(found)[0];
      const el = document.querySelector<HTMLElement>(`[name="${first}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const ref = reference || makeReference();
    setReference(ref);
    setStatus('submitting');

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `CITO-aanmelding ${ref}: ${form.childFirstName.trim()} (${form.parentName.trim()})`,
          _replyto: form.email.trim(),
          _autoresponse:
            `Beste ${form.parentName.trim()},\n\n` +
            `Bedankt voor uw aanmelding voor de Cito-training van ${CITO_DURATION}. We hebben uw aanmelding ontvangen onder referentie ${ref}.\n\n` +
            `Let op: uw aanmelding is ontvangen, maar de betaling is nog niet bevestigd. Uw plek is definitief gereserveerd zodra wij uw betaling hebben gecontroleerd; u ontvangt daarvan een aparte bevestiging per e-mail.\n\n` +
            `Heeft u vragen? Antwoord gerust op deze e-mail.\n\nHartelijke groet,\nThe Classlou`,
          ...payload(ref, { Status: 'Aanmelding ontvangen - betaling nog niet bevestigd' }),
        }),
      });

      if (response.ok) {
        setStep('pay');
        setStatus('idle');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const handleReportPayment = async () => {
    setPaymentReportStatus('submitting');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `CITO betaling gemeld ${reference}: ${form.childFirstName.trim()}`,
          _replyto: form.email.trim(),
          ...payload(reference, { Status: 'Ouder meldt betaling gedaan - controle nodig' }),
        }),
      });
      if (response.ok) {
        setPaymentReported(true);
        setPaymentReportStatus('idle');
      } else {
        setPaymentReportStatus('error');
      }
    } catch (err) {
      setPaymentReportStatus('error');
    }
  };

  const mailtoFallback = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Cito-aanmelding ${reference}`,
  )}&body=${encodeURIComponent(
    `Ik wil mijn kind graag aanmelden voor de Cito-training.\n\nNaam ouder/verzorger: ${form.parentName}\nE-mail: ${form.email}\nTelefoon: ${form.phone}\nVoornaam kind: ${form.childFirstName}\nGroep: ${form.childGroup}\nTrainingsmoment: ${slot ? `${slot.day}, ${slot.time} (${slot.location})` : ''}\nInvestering: ${CITO_PRICE}\nOpmerkingen: ${form.comments}`,
  )}`;

  const statusLabel = step === 'form' ? 'Aanmelding nog niet verstuurd' : paymentReported ? 'Betaling gemeld, wacht op controle' : 'Betaling nog niet bevestigd';

  return (
    <div className="min-h-screen bg-background text-gray-800 font-sans pb-24 md:pb-0">
      {/* ------------------------------------------------ header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/" className="flex flex-col leading-none">
              <span className="text-xl font-bold text-primary">The Classlou</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Cito-training</span>
            </a>
            <button
              type="button"
              onClick={goToForm}
              className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-orange-500 transition-colors"
            >
              Boek afspraak <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------ hero */}
      <main className="pt-24 sm:pt-28">
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 text-primary text-sm font-semibold px-4 py-2">
            <Sparkles size={16} /> {CITO_DURATION} training · inclusief twee boekjes
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{HERO_TITLE}</h1>
          <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-3xl">{HERO_INTRO}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={goToForm}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-primary hover:bg-primaryHover shadow-lg transition-all"
            >
              Boek afspraak <ArrowRight size={20} />
            </button>
            <a
              href="#leren"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-primary bg-white border border-indigo-100 hover:border-primary/40 shadow-sm transition-all"
            >
              Wat uw kind leert
            </a>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Clock size={22} />, title: `${CITO_DURATION} training`, text: 'Een mix van alle benodigde strategieën, meteen toegepast op Cito-opgaven.' },
              { icon: <BookOpenCheck size={22} />, title: 'Twee boekjes', text: 'Een opgavenboekje en een ezelsbruggetjesboekje, van uw kind.' },
              { icon: <Lightbulb size={22} />, title: 'Stappenplan per vraag', text: 'Uw kind leert herkennen welke stappen iedere vraag nodig heeft.' },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-primary flex items-center justify-center mb-4">{card.icon}</div>
                <p className="font-bold text-gray-900">{card.title}</p>
                <p className="mt-1 text-gray-600 leading-relaxed text-[15px]">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ wat uw kind leert */}
        <section id="leren" className="mt-20 py-16 bg-white scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Wat uw kind leert"
              title="Van losse trucjes naar een aanpak die altijd werkt"
              intro={`De training duurt ${CITO_DURATION}. Tijdens de training behandelen we een mix van alle benodigde strategieën en oefenen de kinderen hoe ze deze bij de opgaven kunnen toepassen.`}
            />

            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Alle strategieën in één training',
                  text: 'Van het lezen van de vraag tot het controleren van het antwoord: we behandelen een mix van alle strategieën die bij de Cito-toets nodig zijn, afgestemd op het niveau van uw kind.',
                },
                {
                  title: 'Direct oefenen met echte Cito-opgaven',
                  text: 'Uitleg alleen is niet genoeg. Uw kind past iedere strategie meteen toe op Cito-opgaven, zodat het niet alleen weet wat het moet doen, maar het ook kan.',
                },
                {
                  title: 'Herkennen welk stappenplan nodig is',
                  text: 'Iedere vraag heeft een stappenplan. Uw kind leert herkennen welke stappen nodig zijn en hoe die bij vergelijkbare vragen steeds opnieuw kunnen worden toegepast.',
                },
              ].map((item, i) => (
                <div key={item.title} className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                  <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-primary text-white font-bold mb-4">{i + 1}</span>
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="mt-2 text-gray-600 leading-relaxed text-[15px]">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={goToForm}
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-primary hover:bg-primaryHover shadow-lg transition-all"
              >
                Boek afspraak <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ materialen */}
        <section id="materiaal" className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="De materialen"
              title="Twee boekjes die uw kind houden"
              intro="Uw kind oefent tijdens de training én gaat verder met materiaal waarmee het thuis zelfstandig aan de slag kan."
            />
            <div className="mt-10 grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-primary flex items-center justify-center mb-4">
                  <BookOpenCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Het opgavenboekje</h3>
                <ul className="mt-4 space-y-3">
                  <Bullet>Cito-opgaven waarmee uw kind de strategieën stap voor stap oefent.</Bullet>
                  <Bullet>Per onderdeel duidelijk welke aanpak hoort bij welk type vraag.</Bullet>
                  <Bullet>Zo ziet uw kind zelf dat iedere vraag een aanpak heeft.</Bullet>
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-secondary flex items-center justify-center mb-4">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Het ezelsbruggetjesboekje</h3>
                <ul className="mt-4 space-y-3">
                  <Bullet>Korte geheugensteuntjes bij de stappenplannen.</Bullet>
                  <Bullet>De ezelsbruggetjes helpen om de aanpak te onthouden.</Bullet>
                  <Bullet>Handig om nog eens na te kijken vlak voor de toets.</Bullet>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-center text-gray-600">
              Beide boekjes zitten bij de prijs in. Uw kind neemt ze na de training mee naar huis.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------ praktisch */}
        <section id="praktisch" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="Praktische informatie" title="Alles wat u vooraf wilt weten" />
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: <Clock size={20} />, label: 'Duur', value: CITO_DURATION },
                { icon: <Euro size={20} />, label: 'Investering', value: `${CITO_PRICE} ${CITO_PRICE_NOTE}` },
                { icon: <Users size={20} />, label: 'Vorm', value: CITO_FORMAT },
                { icon: <BookOpenCheck size={20} />, label: 'Doelgroep', value: CITO_TARGET_GROUP },
                { icon: <MapPin size={20} />, label: 'Locatie', value: CITO_LOCATIONS },
                { icon: <CalendarCheck size={20} />, label: 'Verzetten of annuleren', value: CITO_CANCEL },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wide">
                    {item.icon} {item.label}
                  </div>
                  <p className="mt-2 text-gray-800 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-indigo-50 rounded-2xl border border-indigo-100 p-7">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarCheck className="text-primary" size={22} /> Beschikbare trainingsmomenten
              </h3>
              <p className="mt-2 text-gray-600">Kies bij het inschrijven het moment dat u past. Vol = vol, per moment is een beperkt aantal plekken.</p>
              <ul className="mt-5 grid sm:grid-cols-2 gap-3">
                {CITO_TRAINING_SLOTS.map((s) => (
                  <li key={s.id} className="bg-white rounded-xl border border-indigo-100 px-4 py-3 flex items-start gap-3">
                    <CalendarCheck size={18} className="mt-0.5 text-primary shrink-0" />
                    <span className="text-gray-800 text-[15px]">
                      <strong className="block">{s.day}</strong>
                      {s.time} · {s.location}
                    </span>
                  </li>
                ))}
              </ul>
              {CITO_TRAINING_SLOTS.length === 0 && (
                <p className="mt-4 text-gray-600">Nieuwe momenten worden binnenkort geplaatst. Neem gerust contact op voor de mogelijkheden.</p>
              )}
              {!hasOnlineSlot && (
                <p className="mt-4 text-gray-600">
                  Online training nodig? Er staan nu alleen fysieke momenten in de lijst. Mail ons op{' '}
                  <a className="font-semibold text-primary underline" href={`mailto:${CONTACT_EMAIL}`}>
                    {CONTACT_EMAIL}
                  </a>{' '}
                  en we plannen een online moment in overleg.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ inschrijven */}
        <section id="inschrijven" className="py-16 bg-gray-50 scroll-mt-20" ref={formSectionRef}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* funnel steps */}
            <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm">
              {STEPS.map((s, i) => {
                const activeIndex = STEPS.findIndex((x) => x.id === step);
                const done = i < activeIndex;
                const active = i === activeIndex;
                return (
                  <li key={s.id} className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                        done ? 'bg-green-500 text-white' : active ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-400'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <span className={active ? 'font-bold text-gray-900' : 'text-gray-500'}>{s.label}</span>
                    {i < STEPS.length - 1 && <span className="hidden sm:block w-6 sm:w-10 h-px bg-gray-300" />}
                  </li>
                );
              })}
            </ol>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
              {/* ---------------------------------------- step 1: formulier */}
              {step === 'form' && (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Boek een plek voor de Cito-training</h2>
                    <p className="mt-2 text-gray-600">
                      Vul de gegevens hieronder in. U ontvangt hierna direct de betaalstap, zodat de plek van uw kind gereserveerd wordt.
                    </p>
                  </div>

                  {showValidation && errorList.length > 0 && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
                      <p className="flex items-center gap-2 font-bold text-red-800">
                        <AlertCircle size={20} /> Nog even deze gegevens aanpassen
                      </p>
                      <ul className="mt-2 space-y-1 text-red-700 text-sm list-disc list-inside">
                        {errorList.map((err) => (
                          <li key={err.field}>{err.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
                    {FIELDS.map((field) => (
                      <div key={field.name}>
                        <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                          {field.label} {field.required ? '*' : ''}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            aria-invalid={!!errors[field.name]}
                            className={fieldInputClass(!!errors[field.name])}
                          >
                            <option value="">Kies een optie</option>
                            {(field.options || []).map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            inputMode={field.type === 'tel' ? 'tel' : undefined}
                            autoComplete={field.name === 'email' ? 'email' : field.name === 'phone' ? 'tel' : field.name === 'parentName' ? 'name' : 'off'}
                            value={form[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            aria-invalid={!!errors[field.name]}
                            className={fieldInputClass(!!errors[field.name])}
                          />
                        )}
                        {errors[field.name] && (
                          <p className="mt-2 flex items-start gap-2 text-sm text-red-600">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {errors[field.name]}
                          </p>
                        )}
                      </div>
                    ))}

                    <div>
                      <label htmlFor="slotId" className="block text-sm font-semibold text-gray-700 mb-2">
                        Gewenst trainingsmoment *
                      </label>
                      <select
                        id="slotId"
                        name="slotId"
                        value={form.slotId}
                        onChange={handleChange}
                        aria-invalid={!!errors.slotId}
                        className={fieldInputClass(!!errors.slotId)}
                      >
                        <option value="">Kies een moment</option>
                        {CITO_TRAINING_SLOTS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.day} · {s.time} · {s.location}
                          </option>
                        ))}
                      </select>
                      {errors.slotId && (
                        <p className="mt-2 flex items-start gap-2 text-sm text-red-600">
                          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {errors.slotId}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="comments" className="block text-sm font-semibold text-gray-700 mb-2">
                        Eventuele opmerkingen <span className="font-normal text-gray-500">(optioneel)</span>
                      </label>
                      <textarea
                        id="comments"
                        name="comments"
                        rows={3}
                        value={form.comments}
                        onChange={handleChange}
                        placeholder="Bijv. waar uw kind moeite mee heeft, of een vraag over de training"
                        className={fieldInputClass(false)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-primary hover:bg-primaryHover shadow-lg disabled:opacity-70"
                    >
                      {status === 'submitting' ? 'Versturen...' : 'Aanmelding versturen'}
                      {status !== 'submitting' && <ArrowRight size={20} />}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                      Na het versturen ziet u eerst een overzicht van uw keuze en gaat u door naar de betaling.
                    </p>

                    {status === 'error' && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                        <p className="font-bold text-red-800 flex items-center justify-center gap-2">
                          <AlertCircle size={20} /> Er ging iets mis bij het versturen
                        </p>
                        <p className="mt-2 text-red-700 text-sm">Probeer het nog eens, of stuur uw aanmelding direct per e-mail.</p>
                        <a
                          href={mailtoFallback}
                          className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                        >
                          <Mail size={18} /> Mail mijn aanmelding
                        </a>
                      </div>
                    )}
                  </form>
                </>
              )}

              {/* ---------------------------------------- step 2: betalen */}
              {step === 'pay' && (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-700 mb-4">
                      <CheckCircle2 size={30} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Aanmelding ontvangen</h2>
                    <p className="mt-2 text-gray-600">
                      Uw aanmelding is bij ons binnen. De plek van uw kind is gereserveerd zodra wij uw betaling hebben gecontroleerd.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Overzicht van uw keuze</p>
                    <dl className="mt-4 space-y-3 text-[15px]">
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Training</dt>
                        <dd className="font-semibold text-gray-900 text-right">Cito-training ({CITO_DURATION}, incl. beide boekjes)</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Moment</dt>
                        <dd className="font-semibold text-gray-900 text-right">{slot ? slot.day : '-'}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Tijd</dt>
                        <dd className="font-semibold text-gray-900 text-right">{slot ? slot.time : '-'}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Locatie</dt>
                        <dd className="font-semibold text-gray-900 text-right">{slot ? slot.location : '-'}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Kind</dt>
                        <dd className="font-semibold text-gray-900 text-right">
                          {form.childFirstName} · {form.childGroup}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
                        <dt className="font-bold text-gray-900">Te betalen</dt>
                        <dd className="font-extrabold text-gray-900 text-right">{CITO_PRICE}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Referentie</dt>
                        <dd className="font-semibold text-gray-900 text-right">{reference}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* status: aanmelding vs betaling */}
                  <div className="mt-6 grid gap-3">
                    <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                      <CheckCircle2 size={20} className="mt-0.5 text-green-700 shrink-0" />
                      <p className="text-green-900 text-[15px]">
                        <strong>Aanmelding ontvangen.</strong> Uw gegevens zijn bij ons binnen onder referentie <strong>{reference}</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                      <Clock size={20} className="mt-0.5 text-secondary shrink-0" />
                      <p className="text-orange-900 text-[15px]">
                        <strong>Betaling nog niet bevestigd.</strong> Let op: een klik op de betaallink betekent nog niet dat wij uw betaling hebben ontvangen. Wij controleren
                        iedere betaling handmatig en sturen daarna een aparte bevestiging per e-mail.
                      </p>
                    </div>
                  </div>

                  {ING_PAYMENT_LINK ? (
                    <a
                      href={ING_PAYMENT_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-primary hover:bg-primaryHover shadow-lg"
                    >
                      <CreditCard size={20} /> Betalen via ING
                    </a>
                  ) : (
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 text-center">
                      <p className="font-semibold text-gray-900">Uw betaalverzoek volgt per e-mail</p>
                      <p className="mt-1 text-gray-600 text-sm">
                        Wij sturen u het betaalverzoek van ING naar {form.email || 'uw e-mailadres'}, samen met de bevestiging van uw aanmelding.
                      </p>
                    </div>
                  )}

                  <div className="mt-5 rounded-xl border border-gray-200 p-5">
                    <p className="font-semibold text-gray-900">Al betaald?</p>
                    <p className="mt-1 text-gray-600 text-sm">
                      Geef het hieronder door, dan controleren wij de betaling bij ING en bevestigen wij uw plek per e-mail.
                    </p>
                    {paymentReported ? (
                      <div className="mt-4 flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
                        <CheckCircle2 size={18} className="mt-0.5 text-green-700 shrink-0" />
                        <p className="text-green-900 text-[15px]">Bedankt, uw melding is bij ons binnen. Wij controleren de betaling en bevestigen uw plek per e-mail.</p>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleReportPayment}
                          disabled={paymentReportStatus === 'submitting'}
                          className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-primary text-primary font-bold hover:bg-indigo-50 disabled:opacity-70"
                        >
                          {paymentReportStatus === 'submitting' ? 'Versturen...' : 'Ik heb betaald, meld het'}
                        </button>
                        {paymentReportStatus === 'error' && (
                          <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" /> Dat lukte niet. Probeer het nog eens, of mail ons op {CONTACT_EMAIL}.
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('done');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800"
                    >
                      Verder naar bevestiging
                    </button>
                    <a href={mailtoFallback} className="flex-1 text-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 font-bold hover:border-primary/40">
                      Vraag stellen
                    </a>
                  </div>
                </>
              )}

              {/* ---------------------------------------- step 3: bevestiging */}
              {step === 'done' && (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-700 mb-4">
                      <CheckCircle2 size={30} />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Uw aanmelding is ontvangen</h2>
                    <p className="mt-2 text-gray-600">
                      Bedankt voor uw aanmelding voor de Cito-training. Hieronder ziet u wat u van ons kunt verwachten.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                    <dl className="space-y-3 text-[15px]">
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Referentie</dt>
                        <dd className="font-semibold text-gray-900 text-right">{reference}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Training</dt>
                        <dd className="font-semibold text-gray-900 text-right">Cito-training ({CITO_DURATION}, incl. beide boekjes)</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Moment</dt>
                        <dd className="font-semibold text-gray-900 text-right">{slot ? `${slot.day} · ${slot.time}` : '-'}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-gray-600">Kind</dt>
                        <dd className="font-semibold text-gray-900 text-right">
                          {form.childFirstName} · {form.childGroup}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
                        <dt className="font-bold text-gray-900">Status betaling</dt>
                        <dd className="font-bold text-orange-600 text-right">{statusLabel}</dd>
                      </div>
                    </dl>
                  </div>

                  <ol className="mt-6 space-y-4">
                    {[
                      {
                        title: 'Wij controleren uw betaling',
                        text: paymentReported
                          ? 'U heeft doorgegeven dat u heeft betaald. Wij controleren dit bij ING en verwerken het zo snel mogelijk.'
                          : 'Zodra uw betaling bij ons binnen is, koppelen wij die aan uw referentie en controleren wij het bedrag.',
                      },
                      { title: 'U ontvangt een bevestiging per e-mail', text: `Wij sturen de definitieve bevestiging naar ${form.email || 'uw e-mailadres'}, met het trainingsmoment en de praktische afspraken.` },
                      { title: 'Uw kind kan aan de slag', text: 'Tijdens de training krijgt uw kind de uitleg, de oefening en beide boekjes mee naar huis.' },
                    ].map((item, i) => (
                      <li key={item.title} className="flex gap-4">
                        <span className="w-8 h-8 shrink-0 rounded-full bg-primary text-white font-bold flex items-center justify-center">{i + 1}</span>
                        <span>
                          <strong className="block text-gray-900">{item.title}</strong>
                          <span className="text-gray-600 text-[15px] leading-relaxed">{item.text}</span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <ShieldCheck size={20} className="mt-0.5 text-secondary shrink-0" />
                    <p className="text-orange-900 text-[15px]">
                      Uw plek is gereserveerd. De definitieve bevestiging volgt nadat wij uw betaling hebben gecontroleerd. Vragen? Mail ons op{' '}
                      <a className="font-semibold underline" href={`mailto:${CONTACT_EMAIL}`}>
                        {CONTACT_EMAIL}
                      </a>
                      .
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <a href="/" className="flex-1 text-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primaryHover">
                      Terug naar The Classlou
                    </a>
                    <button
                      type="button"
                      onClick={goToForm}
                      className="flex-1 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 font-bold hover:border-primary/40"
                    >
                      Nog een kind aanmelden
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ faq */}
        <section id="faq" className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading center eyebrow="Veelgestelde vragen" title="Vragen van ouders" />
            <div className="mt-8 space-y-3">
              {[
                {
                  q: `Hoe lang duurt de Cito-training?`,
                  a: `De training duurt ${CITO_DURATION}. In die tijd behandelen we een mix van alle benodigde strategieën en oefenen de kinderen hoe ze deze bij de opgaven kunnen toepassen.`,
                },
                {
                  q: 'Wat krijgt mijn kind mee naar huis?',
                  a: 'Ieder kind krijgt een opgavenboekje en een ezelsbruggetjesboekje. De boekjes zitten bij de prijs in en zijn van uw kind.',
                },
                {
                  q: 'Wat leert mijn kind precies?',
                  a: 'Dat iedere vraag een stappenplan heeft. Uw kind leert herkennen welke stappen nodig zijn en hoe die bij vergelijkbare vragen steeds opnieuw kunnen worden toegepast. De ezelsbruggetjes helpen om de aanpak te onthouden.',
                },
                {
                  q: 'Voor welke kinderen is de training bedoeld?',
                  a: `${CITO_TARGET_GROUP}. Twijfelt u of de training passend is? Mail ons gerust, dan denken we met u mee.`,
                },
                {
                  q: 'Is de training fysiek of online?',
                  a: `${CITO_LOCATIONS}. De fysieke trainingen staan bij de beschikbare momenten. Voor een online training plannen we samen een moment; uw kind krijgt de boekjes dan vooraf toegestuurd.`,
                },
                {
                  q: 'Hoe betaal ik?',
                  a: `De investering is ${CITO_PRICE} ${CITO_PRICE_NOTE}. Na uw aanmelding ontvangt u een betaalverzoek via ING. Uw plek is definitief gereserveerd zodra wij de betaling hebben gecontroleerd en bevestigd.`,
                },
                {
                  q: 'Kan ik kosteloos verzetten of annuleren?',
                  a: `${CITO_CANCEL}. Laat het ons zo snel mogelijk weten, dan kijken we samen naar een ander moment.`,
                },
                {
                  q: 'Hoe weet ik of mijn betaling is aangekomen?',
                  a: 'Wij controleren de betaling handmatig. Zodra die binnen is, ontvangt u van ons een bevestiging per e-mail. U kunt ook op de betaalstap aangeven dat u heeft betaald, dan kijken wij het direct na.',
                },
              ].map((faq, i) => (
                <div key={faq.q} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 bg-gray-50 hover:bg-white transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={20} className="text-primary shrink-0" /> : <ChevronDown size={20} className="text-gray-500 shrink-0" />}
                  </button>
                  {openFaq === i && <div className="px-5 py-4 bg-white text-gray-600 leading-relaxed border-t border-gray-100">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ afsluitende cta */}
        <section className="py-16 bg-gradient-to-br from-indigo-900 to-primary text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Klaar om de Cito-toets met vertrouwen tegemoet te gaan?</h2>
            <p className="mt-3 text-indigo-100 text-lg">
              Boek een plek voor de training van {CITO_DURATION}. Uw kind leert de stappenplannen en krijgt beide boekjes mee.
            </p>
            <button
              type="button"
              onClick={goToForm}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-primary bg-white hover:bg-indigo-50 shadow-lg"
            >
              Boek afspraak <ArrowRight size={20} />
            </button>
            <p className="mt-6 text-indigo-100 text-sm">
              Vragen? Mail ons op{' '}
              <a className="underline font-semibold" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              {WHATSAPP_LINK && (
                <>
                  {' '}
                  of stuur een bericht via{' '}
                  <a className="underline font-semibold" href={WHATSAPP_LINK}>
                    WhatsApp
                  </a>
                </>
              )}
            </p>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------ footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-white font-bold text-lg">The Classlou</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a href="/" className="hover:text-white transition-colors">
              Hele website
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white transition-colors flex items-center gap-1">
              <Mail size={14} /> {CONTACT_EMAIL}
            </a>
            <span className="flex items-center gap-1">
              <Phone size={14} /> Via het contactformulier
            </span>
          </div>
          <span>&copy; {new Date().getFullYear()} The Classlou</span>
        </div>
      </footer>

      {/* ------------------------------------------------ mobiele vaste knop */}
      {!formInView && (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3">
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-900">{CITO_PRICE}</p>
              <p className="text-xs text-gray-500">{CITO_DURATION} · incl. 2 boekjes</p>
            </div>
            <button
              type="button"
              onClick={goToForm}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl shadow-lg"
            >
              Boek afspraak <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ terug naar boven */}
      {formInView && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 z-40 md:hidden bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg"
        >
          Naar boven
        </button>
      )}
    </div>
  );
};

export default CitoPage;
