import React from 'react';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import { CONTACT_EMAIL } from './citoConfig';
import { CONFIRM_PAGE, LANDING_PAGE, PAY_PAGE } from './citoStore';

const STEPS = [
  { label: 'Gegevens invullen', href: LANDING_PAGE },
  { label: 'Betalen', href: PAY_PAGE },
  { label: 'Bevestiging', href: CONFIRM_PAGE },
];

/* Vaste kop, stappenbalk en voettekst voor alle drie de Cito-pagina's. */
export const CitoSteps: React.FC<{ activeStep: 0 | 1 | 2 }> = ({ activeStep }) => (
  <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-8 text-xs sm:text-sm">
    {STEPS.map((s, i) => {
      const done = i < activeStep;
      const active = i === activeStep;
      return (
        <li key={s.label} className="flex items-center gap-2">
          {done ? (
            <a
              href={s.href}
              className="w-7 h-7 rounded-full flex items-center justify-center font-bold bg-green-500 text-white"
              title={`Terug naar ${s.label}`}
            >
              ✓
            </a>
          ) : (
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${
                active ? 'bg-primary text-white' : 'bg-white border border-gray-300 text-gray-400'
              }`}
            >
              {i + 1}
            </span>
          )}
          <span className={active ? 'font-bold text-gray-900' : 'text-gray-500'}>{s.label}</span>
          {i < STEPS.length - 1 && <span className="hidden sm:block w-6 sm:w-10 h-px bg-gray-300" />}
        </li>
      );
    })}
  </ol>
);

const CitoShell: React.FC<{
  activeStep: 0 | 1 | 2;
  showSteps?: boolean;
  headerRight?: React.ReactNode;
  stickyBar?: React.ReactNode;
  children: React.ReactNode;
}> = ({ activeStep, showSteps = true, headerRight, stickyBar, children }) => (
  <div className="min-h-screen bg-background text-gray-800 font-sans pb-24 md:pb-0">
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <a href={LANDING_PAGE} className="flex flex-col leading-none">
            <span className="text-xl font-bold text-primary">The Classlou</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Cito-training</span>
          </a>
          {headerRight}
        </div>
      </div>
    </header>

    <main className="pt-24 sm:pt-28">
      {showSteps && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CitoSteps activeStep={activeStep} />
        </div>
      )}
      {children}
    </main>

    <footer className="bg-gray-900 text-gray-400 py-10 mt-4">
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
        <span>
          &copy; {new Date().getFullYear()} The Classlou ·{' '}
          <a href="/" className="hover:text-white transition-colors">
            Privacyverklaring
          </a>
        </span>
      </div>
    </footer>

    {stickyBar}
  </div>
);

export const StickyBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
    {children}
  </div>
);

export const PrimaryArrow: React.FC<{ label: string; onClick?: () => void; href?: string; className?: string }> = ({ label, onClick, href, className }) => {
  const cls = `inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-xl text-white bg-primary hover:bg-primaryHover shadow-lg transition-all ${className || ''}`;
  if (href) {
    return (
      <a href={href} className={cls}>
        {label} <ArrowRight size={20} />
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {label} <ArrowRight size={20} />
    </button>
  );
};

export default CitoShell;
