// ============================================================================
//  CITO-LANDINGSPAGINA  -  INSTELLINGEN
//  Alles wat hieronder staat, kunt u zelf aanpassen. De pagina neemt het
//  meteen over: sla op, de site wordt automatisch opnieuw gebouwd en geplaatst.
//  Regels met "AANPASSEN" zijn de plekken waar nog echte gegevens van The
//  Classlou in moeten.
// ============================================================================

// ---------------------------------------------------------------------------
// 1. BETAALVERZOEK  (AANPASSEN: plak hier de link van het ING-betaalverzoek)
//    Zolang dit leeg is, toont de pagina netjes "betaalverzoek volgt per
//    e-mail" in plaats van een knop die nergens heen gaat.
// ---------------------------------------------------------------------------
export const ING_PAYMENT_LINK = "";

// ---------------------------------------------------------------------------
// 2. PRIJS EN DUUR
// ---------------------------------------------------------------------------
export const CITO_PRICE = "€150";
export const CITO_PRICE_NOTE = "per training, inclusief beide boekjes";
export const CITO_DURATION = "3 uur";

// ---------------------------------------------------------------------------
// 3. BESCHIKBARE TRAININGSMOMENTEN
//    AANPASSEN: dit zijn voorbeeldmomenten. Zet hier alleen momenten die
//    echt beschikbaar zijn, met de juiste datum en tijd. Voeg gerust
//    momenten toe of laat ze weg.
// ---------------------------------------------------------------------------
export interface TrainingSlot {
  id: string;
  day: string;
  time: string;
  location: string;
}

export const CITO_TRAINING_SLOTS: TrainingSlot[] = [
  { id: "za-31okt-10", day: "Zaterdag 31 oktober 2026", time: "10:00 - 13:00", location: "Fysiek, regio Amsterdam" },
  { id: "za-31okt-14", day: "Zaterdag 31 oktober 2026", time: "14:00 - 17:00", location: "Fysiek, regio Amsterdam" },
  { id: "za-07nov-10", day: "Zaterdag 7 november 2026", time: "10:00 - 13:00", location: "Online (Teams of Zoom)" },
  { id: "za-14nov-10", day: "Zaterdag 14 november 2026", time: "10:00 - 13:00", location: "Fysiek, regio Amsterdam" },
];

// ---------------------------------------------------------------------------
// 4. PRAKTISCHE GEGEVENS  (AANPASSEN waar nodig)
// ---------------------------------------------------------------------------
export const CITO_TARGET_GROUP = "Groep 7 en 8 van de basisschool, ter voorbereiding op de Cito-eindtoets";
export const CITO_FORMAT = "In overleg: 1-op-1 of in een klein groepje"; // AANPASSEN
export const CITO_LOCATIONS = "Fysiek in regio Amsterdam of online via Teams/Zoom";
export const CITO_CANCEL = "Kosteloos verzetten of annuleren tot 48 uur voor de training";

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
