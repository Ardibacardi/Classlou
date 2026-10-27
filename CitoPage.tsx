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
  Euro,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
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
  HERO_INTRO,
  HERO_TITLE,
  WHATSAPP_LINK,
} from './citoConfig';
import CitoShell, { CitoSteps, StickyBar } from './CitoShell';
import { EMPTY_FORM, FIELDS, PAY_PAGE, fieldInputClass, makeReference, saveState, validateForm, type CitoErrors, type CitoFormState } from './citoStore';

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
  const [form, setForm] = useState<CitoFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<CitoErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formInView, setFormInView] = useState(false);

  const formSectionRef = useRef<HTMLDivElement | null>(null);

  const hasOnlineSlot = useMemo(() => CITO_TRAINING_SLOTS.some((s) => /online/i.test(s.location)), []);
  const errorList = useMemo(() => Object.entries(errors).map(([k, v]) => ({ field: k as keyof CitoFormState, message: v as string })), [errors]);

  /* de vaste knop onderaan verdwijnt zolang het formulier zelf in beeld is */
  useEffect(() => {
    const el = formSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver((entries) => setFormInView(entries[0].isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const goToForm = () => {
    const el = document.getElementById('inschrijven');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (submitted) {
      const next = { ...form, [name]: value };
      const found = validateForm(next);
      setErrors(found);
      if (Object.keys(found).length === 0) setShowValidation(false);
    }
  };

  /* Aanmelding opslaan en direct door naar de aparte betaalpagina.
     Het versturen naar ons gebeurt daar, zodat de bezoeker hier niet wacht. */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validateForm(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setShowValidation(true);
      const first = Object.keys(found)[0];
      const el = document.querySelector<HTMLElement>(`[name="${first}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const reference = makeReference();
    saveState({ reference, form, paymentReported: false, sendState: 'idle' });
    window.location.href = PAY_PAGE;
  };

  return (
    <CitoShell
      activeStep={0}
      showSteps={false}
      headerRight={
        <button
          type="button"
          onClick={goToForm}
          className="inline-flex items-center gap-2 bg-secondary text-white font-bold px-5 py-2.5 rounded-full shadow-md hover:bg-orange-500 transition-colors"
        >
          Boek afspraak <ArrowRight size={18} />
        </button>
      }
      stickyBar={
        !formInView ? (
          <StickyBar>
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
          </StickyBar>
        ) : undefined
      }
    >
      {/* ------------------------------------------------ hero */}
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
          <p className="mt-6 text-center text-gray-600">Beide boekjes zitten bij de prijs in. Uw kind neemt ze na de training mee naar huis.</p>
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
          <CitoSteps activeStep={0} />

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Boek een plek voor de Cito-training</h2>
              <p className="mt-2 text-gray-600">
                Vul de gegevens hieronder in. Daarna gaat u direct door naar de betaalpagina, waar u het overzicht ziet en kunt betalen.
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

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-primary hover:bg-primaryHover shadow-lg"
              >
                Verder naar betalen <ArrowRight size={20} />
              </button>

              <p className="text-center text-sm text-gray-500">
                U gaat direct door naar de betaalpagina met het overzicht van uw keuze. Uw aanmelding komt daar bij ons binnen.
              </p>
            </form>
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
                q: 'Hoe lang duurt de Cito-training?',
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
                a: `De investering is ${CITO_PRICE} ${CITO_PRICE_NOTE}. Na uw aanmelding komt u op de betaalpagina met het betaalverzoek van ING. Uw plek is definitief gereserveerd zodra wij de betaling hebben gecontroleerd en bevestigd.`,
              },
              {
                q: 'Kan ik kosteloos verzetten of annuleren?',
                a: `${CITO_CANCEL}. Laat het ons zo snel mogelijk weten, dan kijken we samen naar een ander moment.`,
              },
              {
                q: 'Hoe weet ik of mijn betaling is aangekomen?',
                a: 'Wij controleren de betaling handmatig. Zodra die binnen is, ontvangt u van ons een bevestiging per e-mail. U kunt op de betaalpagina ook aangeven dat u heeft betaald, dan kijken wij het direct na.',
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

      {formInView && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 z-40 md:hidden bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg"
        >
          Naar boven
        </button>
      )}
    </CitoShell>
  );
};

export default CitoPage;
