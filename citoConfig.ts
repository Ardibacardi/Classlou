// ============================================================================
//  CITO-LANDINGSPAGINA  -  INSTELLINGEN
//  Alles wat hieronder staat, kunt u zelf aanpassen. De pagina neemt het
//  meteen over: sla op, de site wordt automatisch opnieuw gebouwd en geplaatst.
//  Laatst bijgewerkt: 27 oktober 2026
// ============================================================================

// ---------------------------------------------------------------------------
// 1. BETAALVERZOEK
//    De link van het ING-betaalverzoek. Zolang dit leeg is, toont de pagina
//    "betaalverzoek volgt per e-mail" in plaats van een knop.
// ---------------------------------------------------------------------------
export const ING_PAYMENT_LINK = "https://www.ing.nl/payreq/m/Zca11HZGkwgSSzWyr1xvPFU5UMeyG3SQ";

// ---------------------------------------------------------------------------
// 2. PRIJS EN DUUR
// ---------------------------------------------------------------------------
export const CITO_PRICE = "€150";
export const CITO_PRICE_NOTE = "per training, inclusief beide boekjes";
export const CITO_DURATION = "3 uur";

// ---------------------------------------------------------------------------
// 3. BESCHIKBARE TRAININGSMOMENTEN
//    Zet hier alleen momenten die echt beschikbaar zijn, met de juiste datum
//    en tijd. Voeg gerust momenten toe of laat ze weg.
// ---------------------------------------------------------------------------
export interface TrainingSlot {
  id: string;
  day: string;
  time: string;
  location: string;
}

export const CITO_TRAINING_SLOTS: TrainingSlot[] = [
  { id: "zo-08nov-1315", day: "Zondag 8 november 2026", time: "13:15 - 16:15", location: "Fysiek, Amsterdam Noord" },
  { id: "zo-15nov-1315", day: "Zondag 15 november 2026", time: "13:15 - 16:15", location: "Fysiek, Amsterdam Noord" },
];

// ---------------------------------------------------------------------------
// 4. PRAKTISCHE GEGEVENS
// ---------------------------------------------------------------------------
export const CITO_TARGET_GROUP = "Groep 5, 6, 7 en 8 van de basisschool";
export const CITO_FORMAT = "In een klein groepje";
export const CITO_LOCATIONS = "Fysiek in Amsterdam Noord of online via Teams of Zoom";
export const CITO_CANCEL = "Kosteloos verzetten of annuleren tot 72 uur voor de training";

// ---------------------------------------------------------------------------
// 5. CONTACT EN AFLEVERING VAN AANMELDINGEN
// ---------------------------------------------------------------------------
export const CONTACT_EMAIL = "theclasslou@gmail.com";
export const FORM_ENDPOINT = "https://formsubmit.co/ajax/theclasslou@gmail.com";
export const WHATSAPP_LINK = ""; // optioneel: vul een wa.me-link in voor een WhatsApp-knop

// ---------------------------------------------------------------------------
// 6. TEKSTEN DIE U SNEL WILT KUNNEN WIJZIGEN
// ---------------------------------------------------------------------------
export const HERO_TITLE = "Met een duidelijk stappenplan aan de slag met Cito-vragen";
export const HERO_INTRO =
  "In één training van 3 uur leert uw kind hoe het iedere Cito-vraag stap voor stap aanpakt. We behandelen een mix van alle benodigde strategieën en oefenen meteen met de opgaven. Uw kind gaat naar huis met een opgavenboekje en een ezelsbruggetjesboekje, en met een aanpak die het bij elke vergelijkbare vraag opnieuw kan gebruiken.";
