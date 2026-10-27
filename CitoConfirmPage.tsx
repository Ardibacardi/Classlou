import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, CreditCard, Mail, ShieldCheck } from 'lucide-react';
import { CITO_DURATION, CITO_PRICE, ING_PAYMENT_LINK, CONTACT_EMAIL } from './citoConfig';
import CitoShell from './CitoShell';
import { LANDING_PAGE, PAY_PAGE, buildMailto, findSlot, loadState, statusLabelFor, type CitoState } from './citoStore';

const CitoConfirmPage: React.FC = () => {
  const [state, setState] = useState<CitoState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  if (ready && !state) {
    return (
      <CitoShell activeStep={2}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Geen aanmelding gevonden</h1>
            <p className="mt-3 text-gray-600">Vul eerst het formulier in, dan komt u hier automatisch uit.</p>
            <a
              href={LANDING_PAGE}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-primary hover:bg-primaryHover shadow-lg"
            >
              Naar het inschrijfformulier <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </CitoShell>
    );
  }

  if (!state) {
    return (
      <CitoShell activeStep={2}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-500">Bezig met laden...</div>
      </CitoShell>
    );
  }

  const slot = findSlot(state.form.slotId);
  const mailto = buildMailto(state);
  const sendFailed = state.sendState === 'failed';
  const label = statusLabelFor(state);

  return (
    <CitoShell activeStep={2}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-700 mb-4">
              <CheckCircle2 size={30} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Uw aanmelding is ontvangen</h1>
            <p className="mt-2 text-gray-600">
              Bedankt voor uw aanmelding voor de Cito-training. Hieronder ziet u wat u van ons kunt verwachten.
            </p>
          </div>

          {sendFailed && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle size={20} className="mt-0.5 text-red-700 shrink-0" />
              <div className="text-red-900 text-[15px]">
                <p>
                  <strong>Let op:</strong> uw aanmelding is nog niet bij ons aangekomen. Ga terug naar de betaalpagina en probeer het daar opnieuw, of mail ons direct.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a href={PAY_PAGE} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700">
                    Terug naar de betaalpagina
                  </a>
                  <a href={mailto} className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-700 font-semibold">
                    Liever mailen
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <dl className="space-y-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Referentie</dt>
                <dd className="font-semibold text-gray-900 text-right">{state.reference}</dd>
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
                <dt className="text-gray-600">Locatie</dt>
                <dd className="font-semibold text-gray-900 text-right">{slot ? slot.location : '-'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Kind</dt>
                <dd className="font-semibold text-gray-900 text-right">
                  {state.form.childFirstName} · {state.form.childGroup}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
                <dt className="font-bold text-gray-900">Status betaling</dt>
                <dd className={`font-bold text-right ${state.paymentReported ? 'text-green-700' : 'text-orange-600'}`}>{label}</dd>
              </div>
            </dl>
          </div>

          {!state.paymentReported && (
            <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-5">
              <p className="flex items-center gap-2 font-semibold text-orange-900">
                <Clock size={18} /> Uw betaling is nog niet bevestigd
              </p>
              <p className="mt-2 text-orange-900 text-[15px]">
                Uw plek is gereserveerd. Zodra wij uw betaling van {CITO_PRICE} hebben gecontroleerd, sturen wij u de definitieve bevestiging per e-mail.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {ING_PAYMENT_LINK && (
                  <a
                    href={ING_PAYMENT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primaryHover"
                  >
                    <CreditCard size={18} /> Betalen via ING
                  </a>
                )}
                <a href={PAY_PAGE} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-orange-200 text-orange-900 font-semibold">
                  Terug naar de betaalpagina
                </a>
              </div>
            </div>
          )}

          <ol className="mt-6 space-y-4">
            {[
              {
                title: 'Wij controleren uw betaling',
                text: state.paymentReported
                  ? 'U heeft doorgegeven dat u heeft betaald. Wij controleren dit bij ING en verwerken het zo snel mogelijk.'
                  : 'Zodra uw betaling bij ons binnen is, koppelen wij die aan uw referentie en controleren wij het bedrag.',
              },
              {
                title: 'U ontvangt een bevestiging per e-mail',
                text: `Wij sturen de definitieve bevestiging naar ${state.form.email || 'uw e-mailadres'}, met het trainingsmoment en de praktische afspraken.`,
              },
              {
                title: 'Uw kind kan aan de slag',
                text: 'Tijdens de training krijgt uw kind de uitleg, de oefening en beide boekjes mee naar huis.',
              },
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

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <ShieldCheck size={20} className="mt-0.5 text-primary shrink-0" />
            <p className="text-indigo-900 text-[15px]">
              Vragen over uw aanmelding? Mail ons op{' '}
              <a className="font-semibold underline" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Cito-aanmelding ${state.reference}`)}`}>
                {CONTACT_EMAIL}
              </a>{' '}
              en noem uw referentie.
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href="/" className="flex-1 text-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primaryHover">
              Terug naar The Classlou
            </a>
            <a
              href={LANDING_PAGE}
              className="flex-1 text-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 font-bold hover:border-primary/40"
            >
              Nog een kind aanmelden
            </a>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Mail size={14} /> Uw aanmelding en deze referentie komen per e-mail bij ons binnen.
          </p>
        </div>
      </div>
    </CitoShell>
  );
};

export default CitoConfirmPage;
