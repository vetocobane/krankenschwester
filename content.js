/* Alle pflegbaren Inhalte der Website. Nichts anderes muss angefasst werden. */

window.CONTENT = {
  /* ---------------------------------------------------------------------
     AKTUELLER RELEASE, steht oben auf der Seite
     youtube:  Video-ID (der Teil hinter ?v= in der YouTube-URL) oder ""
               Solange leer, steht dort der Text aus "platzhalter".
     cover:    Dateiname aus assets/photos/ ohne Größenzusatz, oder ""
  --------------------------------------------------------------------- */
  aktuell: {
    titel: "Deine Krankenschwester",
    youtube: "", // Video-ID eintragen, sobald das Musikvideo am 21.10. online ist
    cover: "", // Single-Cover nach Sources/ legen, Bild-Script laufen lassen, Namen hier eintragen
    teaser: "fotoshooting-03", // Foto für das Ankündigungs-Plakat, solange Video und Cover fehlen
    platzhalter: "Musikvideo ab 21.10.2026",
    termine: [
      { datum: "2026-10-16", was: "Single „Deine Krankenschwester“" },
      { datum: "2026-10-21", was: "Musikvideo „Deine Krankenschwester“" },
      { datum: "2026-11-27", was: "„Fragen kostet nichts“", hinweis: "tbc" },
    ],
  },

  /* ---------------------------------------------------------------------
     VERÖFFENTLICHTE SONGS
     embed:   Spotify-Track-ID für den Player (aus der URL nach /track/), oder ""
     youtube: YouTube-Video-ID (der Teil hinter ?v=), oder ""
              Ist sie gesetzt, zeigt die Karte ein Video-Plakat, das auf YouTube öffnet.
     videoBild: Standbild dazu aus assets/photos/. Leer lassen, dann wird
              automatisch das YouTube-Vorschaubild geladen.
  --------------------------------------------------------------------- */
  releases: [
    {
      titel: "Nazis sind schwul",
      typ: "Debüt-Single",
      jahr: "2025",
      spotify: "https://open.spotify.com/intl-de/track/0Pd38fsVXewYE0zWXVIr7a",
      embed: "0Pd38fsVXewYE0zWXVIr7a",
      youtube: "",
    },
    {
      titel: "Fickt gut",
      typ: "Single + Musikvideo",
      jahr: "2025",
      spotify: "https://open.spotify.com/intl-de/track/7DZQ4kBTxcN3eG3J2KS7Ga",
      embed: "7DZQ4kBTxcN3eG3J2KS7Ga",
      youtube: "N6lhe5b0JvI",
      videoBild: "fickt-gut-video",
      videoHinweis: "Auf YouTube, ab 18",
    },
  ],

  /* Laufband unter dem Hero. Beliebig viele Einträge, es füllt sich selbst
     so oft, wie die Bildschirmbreite es braucht. */
  laufband: [
    "Deine Krankenschwester",
    "ab 16.10.",
    "Nazis sind schwul",
    "Fickt gut",
    "laut, direkt und unbequem",
  ],

  /* ---------------------------------------------------------------------
     LIVE: Termine
     Ein Eintrag pro Show. Vergangene rutschen automatisch nach unten.
     datum:   "2026-10-23"  (Jahr-Monat-Tag, immer vierstelliges Jahr)
     stadt:   darf leer bleiben, wenn der Ort noch nicht feststeht
     venue:   Location oder Anlass
     tickets: URL oder ""
     hinweis: "Support", "Abendkasse", "Termin noch offen" oder ""
  --------------------------------------------------------------------- */
  shows: [
    { datum: "2026-10-23", stadt: "", venue: "Tyna", tickets: "", hinweis: "Support" },
    { datum: "2026-10-24", stadt: "", venue: "Tyna", tickets: "", hinweis: "Support" },
    { datum: "2026-12-05", stadt: "Greifswald", venue: "IKuWo", tickets: "", hinweis: "" },

    { datum: "2026-08-09", stadt: "Nürnberg", venue: "CSD Nürnberg", tickets: "", hinweis: "Anreise 08.08." },
    { datum: "2026-08-08", stadt: "Essen", venue: "CSD Essen", tickets: "", hinweis: "" },
    { datum: "2026-08-01", stadt: "Naumburg", venue: "CSD Naumburg / Burgenlandkreis", tickets: "", hinweis: "" },
    { datum: "2026-07-17", stadt: "Leipzig", venue: "CSD Leipzig", tickets: "", hinweis: "17. oder 18.07." },
    { datum: "2026-07-11", stadt: "Köthen", venue: "CSD Köthen", tickets: "", hinweis: "" },
    { datum: "2026-07-10", stadt: "Potsdam", venue: "KuZe", tickets: "", hinweis: "" },
    { datum: "2026-07-04", stadt: "Regensburg", venue: "CSD Regensburg", tickets: "", hinweis: "" },
    { datum: "2026-06-20", stadt: "Wetzlar", venue: "CSD Wetzlar", tickets: "", hinweis: "" },
    { datum: "2026-06-13", stadt: "Leipzig", venue: "LUYS Release Show", tickets: "", hinweis: "" },
    { datum: "2026-05-14", stadt: "Potsdam", venue: "KuZe", tickets: "", hinweis: "" },
    { datum: "2026-05-09", stadt: "Potsdam", venue: "CSD Potsdam", tickets: "", hinweis: "" },
    { datum: "2026-05-01", stadt: "Potsdam", venue: "Demo", tickets: "", hinweis: "" },
    { datum: "2026-04-18", stadt: "", venue: "6euroneunzig", tickets: "", hinweis: "Support" },
    { datum: "2026-04-17", stadt: "", venue: "6euroneunzig", tickets: "", hinweis: "Support" },
  ],

  /* ---------------------------------------------------------------------
     BILDERGALERIE
     Neue Bilder nach Sources/ legen, dann `node tools/build-images.mjs`
     laufen lassen. Das Script nennt die Dateinamen im Terminal.
     datei:  Dateiname OHNE "-1600.jpg" / "-800.jpg"
     alt:    Bildbeschreibung für Screenreader
     credit: Fotograf:in, oder "" wenn unbekannt
  --------------------------------------------------------------------- */
  fotos: [
    { datei: "live-04", alt: "Krankenschwester springt auf der Bühne, Mikrofon in der Hand.", credit: "" },
    { datei: "live-07", alt: "Krankenschwester streckt die Hand in die Kamera, Festivalbühne.", credit: "" },
    { datei: "live-06", alt: "Krankenschwester kniet im roten Bühnenlicht und singt.", credit: "" },
    { datei: "live-16", alt: "Krankenschwester im Club, Arm nach oben, Discokugel im Hintergrund.", credit: "" },
    { datei: "live-18", alt: "Krankenschwester in blauem Gegenlicht auf einer Clubbühne.", credit: "" },
    { datei: "fotoshooting-02", alt: "Krankenschwester liegt auf einer rot gekachelten Fläche und streckt den Stiefel in die Kamera.", credit: "Leonardo Voigt" },
    { datei: "krankenschwester1-leonardovoigt", alt: "Krankenschwester vor einer rot gekachelten Wand, Finger wie eine Pistole an der Schläfe.", credit: "Leonardo Voigt" },
    { datei: "live-19", alt: "Blick durch das Publikum auf die blau beleuchtete Bühne.", credit: "" },
    { datei: "fotoshooting-04", alt: "Nahaufnahme von Krankenschwester in Jeansweste vor orangefarbenen Kacheln.", credit: "Leonardo Voigt" },
    { datei: "fotoshooting-06", alt: "Krankenschwester sprüht „Nazis sind schwul“ an eine Wand.", credit: "Leonardo Voigt" },
    { datei: "fotoshooting-03", alt: "Krankenschwester mit Baseballschläger in einem rot gekachelten Treppenhaus.", credit: "Leonardo Voigt" },
    { datei: "krankenschwester2-leonardo-voigt", alt: "Krankenschwester vor einer gekachelten Wand, Zunge raus.", credit: "Leonardo Voigt" },
  ],

  /* Hero-Bild: Dateiname aus assets/photos/ ohne Größenzusatz.
     hochkant = Handy, quer = Desktop. */
  hero: {
    hochkant: "krankenschwester2-leonardo-voigt",
    quer: "krankenschwester2-leonardo-voigt",
    alt: "Krankenschwester vor einer gekachelten Wand, Zunge raus, Mittelfinger in die Kamera.",
  },

  /* Foto neben der Bio */
  biofoto: {
    datei: "fotoshooting-04",
    alt: "Nahaufnahme von Krankenschwester in Jeansweste vor orangefarbenen Kacheln.",
    credit: "Leonardo Voigt",
  },

  /* ---------------------------------------------------------------------
     SOCIAL MEDIA & KONTAKT, leere Felder werden ausgeblendet
  --------------------------------------------------------------------- */
  social: {
    instagram: "https://instagram.com/krankenschwester.musik",
    tiktok: "https://tiktok.com/@krankenschwester.musik",
    youtube: "https://www.youtube.com/@krankenschwestermusik",
    spotify: "https://open.spotify.com/artist/43OXafmMWRHydbrAp3oajk",
  },

  kontakt: {
    mail: "krankenschwester@wielandmusic.com",
    telefon: "", // "+49 151 22212327" eintragen, wenn die Nummer öffentlich stehen soll
  },
};
