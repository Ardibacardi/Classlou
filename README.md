<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1X00ey0Q-jhtC8Xr_k_l5OsZxohdRrGdT

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Pagina's

| Pagina | Bestand | URL |
| --- | --- | --- |
| Hoofdsite | `index.html` + `App.tsx` | `/` |
| Cito-training (landingspagina voor Instagram) | `cito.html` + `CitoPage.tsx` | `/cito.html` |
| Cito-betalen (overzicht + betaling via ING) | `cito-betalen.html` + `CitoPayPage.tsx` | `/cito-betalen.html` |
| Cito-bevestiging (status van de aanmelding) | `cito-bevestiging.html` + `CitoConfirmPage.tsx` | `/cito-bevestiging.html` |

### Route van de Cito-funnel

1. `/cito.html` - uitleg en inschrijfformulier. Na een geldig formulier slaat de pagina de gegevens op in `sessionStorage` (`cito_state`) en gaat de bezoeker **direct** naar de betaalpagina. Er wordt daar niets naar de mailservice gewacht.
2. `/cito-betalen.html` - overzicht van de keuze, status "aanmelding ontvangen" en de knop **Betalen via ING**. Het versturen van de aanmelding gebeurt op deze pagina, zodat de bezoeker niet hoeft te wachten. Mislukt het versturen, dan verdwijnt de betaalknop en kan hij opnieuw proberen of mailen.
3. `/cito-bevestiging.html` - status van de aanmelding en wat er daarna gebeurt. Onderscheid tussen "betaling nog niet bevestigd" en "betaling gemeld, wacht op controle".

De drie pagina's delen hun logica via **`citoStore.ts`** (validatie, referentie, opslag, mail-payload) en hun kop, stappenbalk en voettekst via **`CitoShell.tsx`**.

## Cito-landingspagina aanpassen

Alle instelbare gegevens staan in **`citoConfig.ts`**, bovenaan het bestand:

- **`ING_PAYMENT_LINK`** - de link van het ING-betaalverzoek. Zolang die leeg is, toont de betaalstap "uw betaalverzoek volgt per e-mail" in plaats van een knop.
- **`CITO_TRAINING_SLOTS`** - de beschikbare trainingsmomenten (datum, tijd, locatie). Alleen momenten die echt beschikbaar zijn.
- **`CITO_PRICE`**, **`CITO_FORMAT`**, **`CITO_LOCATIONS`**, **`CITO_CANCEL`** - praktische gegevens.
- **`CONTACT_EMAIL`** / **`FORM_ENDPOINT`** - waar aanmeldingen binnenkomen (FormSubmit stuurt ze als tabel per e-mail).

Na een aanpassing: committen en naar `main` pushen. GitHub Actions bouwt en plaatst de site automatisch.

