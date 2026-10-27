import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, CreditCard, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { CITO_DURATION, CITO_PRICE, ING_PAYMENT_LINK, CONTACT_EMAIL } from './citoConfig';
import CitoShell, { StickyBar } from './CitoShell';
import {
  CONFIRM_PAGE,
  LANDING_PAGE,
  buildMailto,
  findSlot,
  loadState,
  reportPayment,
  saveState,
  sendRegistration,
  type CitoState,
} from './citoStore';

const CitoPayPage: React.FC = () => {
  const [state, setState] = useState<CitoState | null>(null);
  const [ready, setReady] = useState(false);
  const [slowSend, setSlowSend] = useState(false);
  const [reportStatus, setReportStatus] = useState<'idle' | 'sending' | 'failed'>('idle');
  const startedRef = useRef(false);

  const persist = (next: CitoState) => {
    setState(next);
    saveState(next);
  };

  /* Aanmelding hier versturen: deze pagina blijft open, dus we weten of het lukt. */
  const runSend = async (current: CitoState, isRetry = false) => {
    if (!isRetry) setSlowSend(false);
    const slowTimer = window.setTimeout(() => setSlowSend(true), 7000);
    persist({ ...current, sendState: 'sending' });

    const ok = await sendRegistration(current);
    window.clearTimeout(slowTimer);
    setSlowSend(false);
    persist({ ...current, sendState: ok ? 'sent' : 'failed' });

    /* bij een storing: één automatische tweede poging, daarna ziet de bezoeker
       de melding met de knop om het zelf opnieuw te proberen */
    if (!ok && !isRetry) {
      window.setTimeout(() => {
        void runSend(current, true);
      }, 4000);
    }
  };

  useEffect(() => {
    const saved = loadState();
    setState(saved);
    setReady(true);
    if (!saved || saved.sendState === 'sent' || startedRef.current) return;
    startedRef.current = true;
    void runSend(saved);
  }, []);

  const handleReportPayment = async () => {
    if (!state) return;
    setReportStatus('sending');
    const ok = await reportPayment(state);
    if (ok) {
      persist({ ...state, paymentReported: true });
      setReportStatus('idle');
    } else {
      setReportStatus('failed');
    }
  };

  /* ------------------------------------------------------ geen aanmelding */
  if (ready && !state) {
    return (
      <CitoShell activeStep={1}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">We konden uw aanmelding niet vinden</h1>
            <p className="mt-3 text-gray-600">
              Vul eerst het formulier in. Daarna komt u automatisch op deze betaalpagina.
            </p>
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
      <CitoShell activeStep={1}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-500">Bezig met laden...</div>
      </CitoShell>
    );
  }

  const slot = findSlot(state.form.slotId);
  const mailto = buildMailto(state);
  const sendFailed = state.sendState === 'failed';
  const sending = state.sendState === 'sending' || state.sendState === 'idle';

  return (
    <CitoShell
      activeStep={1}
      headerRight={
        <a
          href={LANDING_PAGE}
          className="inline-flex items-center gap-2 text-primary font-semibold px-3 py-2 rounded-full hover:bg-indigo-50 transition-colors"
        >
          Gegevens aanpassen
        </a>
      }
      stickyBar={
        !sendFailed ? (
          <StickyBar>
            <div className="flex items-center gap-3">
              <div className="leading-tight">
                <p className="text-sm font-bold text-gray-900">{CITO_PRICE}</p>
                <p className="text-xs text-gray-500">Cito-training {CITO_DURATION}</p>
              </div>
              {ING_PAYMENT_LINK ? (
                <a
                  href={ING_PAYMENT_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-bold px-5 py-3 rounded-xl shadow-lg"
                >
                  <CreditCard size={18} /> Betalen via ING
                </a>
              ) : (
                <span className="flex-1 text-center text-sm text-gray-600">Betaalverzoek volgt per e-mail</span>
              )}
            </div>
          </StickyBar>
        ) : undefined
      }
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-10">
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${
                sendFailed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {sendFailed ? <AlertCircle size={30} /> : <CheckCircle2 size={30} />}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {sendFailed ? 'Uw aanmelding is nog niet bij ons aangekomen' : 'Uw aanmelding is verstuurd'}
            </h1>
            <p className="mt-2 text-gray-600">
              {sendFailed
                ? 'Er ging iets mis bij het versturen. Betaal nog niet: probeer het hieronder eerst opnieuw.'
                : 'Hieronder ziet u het overzicht van uw keuze. U kunt nu de betaling doen.'}
            </p>
          </div>

          {/* ---------------------------------------- status aanmelding */}
          <div className="grid gap-3">
            {sendFailed ? (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle size={20} className="mt-0.5 text-red-700 shrink-0" />
                <div className="text-red-900 text-[15px]">
                  <p>
                    <strong>Versturen lukte niet.</strong> Uw gegevens zijn nog niet bij ons binnen. Probeer het opnieuw of mail ons direct.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void runSend(state)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                    >
                      Opnieuw versturen
                    </button>
                    <a href={mailto} className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-700 font-semibold">
                      Liever mailen
                    </a>
                  </div>
                </div>
              </div>
            ) : sending ? (
              <div className="flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <Loader2 size={20} className="mt-0.5 text-primary shrink-0 animate-spin" />
                <p className="text-indigo-900 text-[15px]">
                  <strong>Uw aanmelding wordt verstuurd...</strong>{' '}
                  {slowSend
                    ? 'Dit duurt iets langer dan normaal. U kunt rustig verder, er raakt niets kwijt.'
                    : 'U hoeft niet te wachten, u kunt hieronder alvast verder.'}
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                <CheckCircle2 size={20} className="mt-0.5 text-green-700 shrink-0" />
                <p className="text-green-900 text-[15px]">
                  <strong>Aanmelding ontvangen.</strong> Uw gegevens zijn bij ons binnen onder referentie <strong>{state.reference}</strong>.
                </p>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <Clock size={20} className="mt-0.5 text-secondary shrink-0" />
              <p className="text-orange-900 text-[15px]">
                <strong>Betaling nog niet bevestigd.</strong> Let op: een klik op de betaallink betekent nog niet dat wij uw betaling hebben ontvangen. Wij controleren iedere
                betaling handmatig en sturen daarna een aparte bevestiging per e-mail.
              </p>
            </div>
          </div>

          {/* ---------------------------------------- overzicht */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
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
                  {state.form.childFirstName} · {state.form.childGroup}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
                <dt className="font-bold text-gray-900">Te betalen</dt>
                <dd className="font-extrabold text-gray-900 text-right">{CITO_PRICE}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Referentie</dt>
                <dd className="font-semibold text-gray-900 text-right">{state.reference}</dd>
              </div>
            </dl>
          </div>

          {/* ---------------------------------------- betalen */}
          {!sendFailed &&
            (ING_PAYMENT_LINK ? (
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
                  Wij sturen u het betaalverzoek van ING naar {state.form.email || 'uw e-mailadres'}, samen met de bevestiging van uw aanmelding.
                </p>
              </div>
            ))}

          {/* ---------------------------------------- al betaald? */}
          <div className="mt-5 rounded-xl border border-gray-200 p-5">
            <p className="font-semibold text-gray-900">Al betaald?</p>
            <p className="mt-1 text-gray-600 text-sm">Geef het hieronder door, dan controleren wij de betaling bij ING en bevestigen wij uw plek per e-mail.</p>
            {state.paymentReported ? (
              <div className="mt-4 flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
                <CheckCircle2 size={18} className="mt-0.5 text-green-700 shrink-0" />
                <p className="text-green-900 text-[15px]">Bedankt, uw melding is bij ons binnen. Wij controleren de betaling en bevestigen uw plek per e-mail.</p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleReportPayment}
                  disabled={reportStatus === 'sending'}
                  className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-primary text-primary font-bold hover:bg-indigo-50 disabled:opacity-70"
                >
                  {reportStatus === 'sending' ? 'Versturen...' : 'Ik heb betaald, meld het'}
                </button>
                {reportStatus === 'failed' && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" /> Dat lukte niet. Probeer het nog eens, of mail ons op {CONTACT_EMAIL}.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={CONFIRM_PAGE}
              className="flex-1 text-center px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 inline-flex items-center justify-center gap-2"
            >
              Naar de bevestiging <ArrowRight size={18} />
            </a>
            <a href={mailto} className="flex-1 text-center px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 font-bold hover:border-primary/40">
              Vraag stellen
            </a>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <ShieldCheck size={20} className="mt-0.5 text-primary shrink-0" />
            <p className="text-indigo-900 text-[15px]">
              Uw plek is gereserveerd. Wij bevestigen definitief nadat de betaling is gecontroleerd. Vragen? Mail ons op{' '}
              <a className="font-semibold underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
            <Mail size={14} /> Uw aanmelding en deze referentie komen per e-mail bij ons binnen.
          </p>
        </div>
      </div>
    </CitoShell>
  );
};

export default CitoPayPage;
