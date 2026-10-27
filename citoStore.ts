// ============================================================================
//  Gedeelde logica voor de Cito-funnel (formulier -> betalen -> bevestiging).
//  De drie pagina's lezen en schrijven hun gegevens hier, zodat de bezoeker
//  na het formulier direct naar de aparte betaalpagina gaat.
// ============================================================================
import { CITO_DURATION, CITO_PRICE, CITO_TRAINING_SLOTS, CONTACT_EMAIL, FORM_ENDPOINT, type TrainingSlot } from './citoConfig';

/* ------------------------------------------------------------------ paden */

export const LANDING_PAGE = '/cito.html';
export const PAY_PAGE = '/cito-betalen.html';
export const CONFIRM_PAGE = '/cito-bevestiging.html';
export const STATE_KEY = 'cito_state';

/* ------------------------------------------------------------------ types */

export interface CitoFormState {
  parentName: string;
  email: string;
  phone: string;
  childFirstName: string;
  childGroup: string;
  slotId: string;
  comments: string;
}

export type CitoErrors = Partial<Record<keyof CitoFormState, string>>;
export type SendState = 'idle' | 'sending' | 'sent' | 'failed';

export interface CitoState {
  reference: string;
  form: CitoFormState;
  paymentReported: boolean;
  sendState: SendState;
}

export const EMPTY_FORM: CitoFormState = {
  parentName: '',
  email: '',
  phone: '',
  childFirstName: '',
  childGroup: '',
  slotId: '',
  comments: '',
};

export const FIELDS: Array<{
  label: string;
  name: keyof CitoFormState;
  type: 'text' | 'email' | 'tel' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}> = [
  { label: 'Naam ouder/verzorger', name: 'parentName', type: 'text', required: true, placeholder: 'Bijv. Sanne de Vries' },
  { label: 'E-mailadres', name: 'email', type: 'email', required: true, placeholder: 'Bijv. naam@voorbeeld.nl' },
  { label: 'Telefoonnummer', name: 'phone', type: 'tel', required: true, placeholder: 'Bijv. 06 12345678' },
  { label: 'Voornaam kind', name: 'childFirstName', type: 'text', required: true, placeholder: 'Bijv. Emma' },
  {
    label: 'Groep van het kind',
    name: 'childGroup',
    type: 'select',
    required: true,
    options: ['Groep 5', 'Groep 6', 'Groep 7', 'Groep 8', 'Anders, namelijk'],
  },
];

/* --------------------------------------------------------------- helpers */

export const findSlot = (id: string): TrainingSlot | undefined => CITO_TRAINING_SLOTS.find((s) => s.id === id);

export const fieldInputClass = (invalid: boolean) =>
  `w-full px-4 py-3 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    invalid ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-300'
  }`;

export const makeReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  for (let i = 0; i < 4; i += 1) tail += chars[Math.floor(Math.random() * chars.length)];
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `CITO-${stamp}-${tail}`;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v.trim());

export const validateForm = (form: CitoFormState): CitoErrors => {
  const e: CitoErrors = {};

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

export const statusLabelFor = (state: Pick<CitoState, 'sendState' | 'paymentReported'>) =>
  state.sendState === 'failed'
    ? 'Aanmelding nog niet bij ons aangekomen'
    : state.paymentReported
      ? 'Betaling gemeld, wacht op controle'
      : 'Betaling nog niet bevestigd';

export const buildMailto = (state: CitoState) => {
  const { form } = state;
  const slot = findSlot(form.slotId);
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Cito-aanmelding ${state.reference}`)}&body=${encodeURIComponent(
    `Ik wil mijn kind graag aanmelden voor de Cito-training.\n\nReferentie: ${state.reference}\nNaam ouder/verzorger: ${form.parentName}\nE-mail: ${form.email}\nTelefoon: ${form.phone}\nVoornaam kind: ${form.childFirstName}\nGroep: ${form.childGroup}\nTrainingsmoment: ${
      slot ? `${slot.day}, ${slot.time} (${slot.location})` : ''
    }\nInvestering: ${CITO_PRICE}\nOpmerkingen: ${form.comments}`,
  )}`;
};

/* ------------------------------------------------------- opslag (sessie) */

export const saveState = (state: CitoState) => {
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (err) {
    /* opslaan lukt niet: de pagina werkt dan zonder onthouden state */
  }
};

export const loadState = (): CitoState | null => {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CitoState;
    if (!parsed || !parsed.form) return null;
    return {
      reference: parsed.reference || '',
      form: { ...EMPTY_FORM, ...parsed.form },
      paymentReported: !!parsed.paymentReported,
      /* na een herlaadbeurt weten we niet of versturen is gelukt: laat opnieuw proberen toe */
      sendState: parsed.sendState === 'sending' ? 'failed' : parsed.sendState || 'idle',
    };
  } catch (err) {
    return null;
  }
};

/* --------------------------------------------------- versturen naar ons */

const buildPayload = (state: CitoState, extra: Record<string, string>) => {
  const { form } = state;
  const slot = findSlot(form.slotId);
  return {
    _template: 'table',
    Referentie: state.reference,
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
  };
};

const post = async (body: Record<string, unknown>) => {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    /* keepalive: de aanvraag loopt door als de bezoeker ondertussen doorklikt */
    keepalive: true,
  });
  return response.ok;
};

export const sendRegistration = async (state: CitoState): Promise<boolean> => {
  const { form } = state;
  try {
    return await post({
      _subject: `CITO-aanmelding ${state.reference}: ${form.childFirstName.trim()} (${form.parentName.trim()})`,
      _replyto: form.email.trim(),
      _autoresponse:
        `Beste ${form.parentName.trim()},\n\n` +
        `Bedankt voor uw aanmelding voor de Cito-training van ${CITO_DURATION}. We hebben uw aanmelding ontvangen onder referentie ${state.reference}.\n\n` +
        `Let op: uw aanmelding is ontvangen, maar de betaling is nog niet bevestigd. Uw plek is definitief gereserveerd zodra wij uw betaling hebben gecontroleerd; u ontvangt daarvan een aparte bevestiging per e-mail.\n\n` +
        `Heeft u vragen? Antwoord gerust op deze e-mail.\n\nHartelijke groet,\nThe Classlou`,
      ...buildPayload(state, { Status: 'Aanmelding ontvangen - betaling nog niet bevestigd' }),
    });
  } catch (err) {
    return false;
  }
};

export const reportPayment = async (state: CitoState): Promise<boolean> => {
  try {
    return await post({
      _subject: `CITO betaling gemeld ${state.reference}: ${state.form.childFirstName.trim()}`,
      _replyto: state.form.email.trim(),
      ...buildPayload(state, { Status: 'Ouder meldt betaling gedaan - controle nodig' }),
    });
  } catch (err) {
    return false;
  }
};
