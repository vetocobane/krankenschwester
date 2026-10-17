# Krankenschwester, Website Discovery

Answers pulled from the EPK (`Sources/Krankenschwester - auf einen blick.pdf`) and the locked
design direction. Open points are marked **OFFEN**.

---

## 1. Artist & Brand

- Schreibweise auf der Site: **KRANKENSCHWESTER** in Versalien im Display, `Krankenschwester` im Fließtext.
- Sound in einem Satz: das queere Kind von Punk und Pop, aufgewachsen zwischen Berliner Clubklo und Konzertbühne.
- Visuelle Identität vorhanden:
  - [x] Logo: `Sources/Krankenschwester_Logo.png` (pinke Schablonenschrift, rotes Anarcho-A), freigestellt nach `assets/logo.png`
  - [x] EPK-Layout: rote, kursiv-schmale Versalien in weißen Kästen, Vollbildfotos von Leonardo Voigt
- Tonfall der Texte: konfrontativ und politisch, mit Humor. Kampfansage an Faschos, Heteronormativität und toxische Männlichkeit, Liebesbrief an alle, die sich zu laut, zu anders oder zu queer gefühlt haben.
- Sprache: **Deutsch only.** Presse, Booking und Publikum sind deutschsprachig.

## 2. Audience & Purpose

- Hauptbesucher: neue Hörer:innen über Instagram/TikTok, dazu Booker:innen und Presse.
- Die EINE Aktion:
  - [x] Track hören: „Nazis sind schwul“ auf Spotify
- Traffic: Instagram- und TikTok-Bio (`krankenschwester.musik`), Reels, QR auf Plakaten.
- Mobil: 80 %+ angenommen, Design ist mobile-first.

## 3. Content Inventory

- Musik: Spotify. Verifizierte Links:
  - „Nazis sind Schwul“: https://open.spotify.com/intl-de/track/0Pd38fsVXewYE0zWXVIr7a
  - „Fickt Gut“: https://open.spotify.com/intl-de/track/7DZQ4kBTxcN3eG3J2KS7Ga
  - Kein eigener Player, Embeds sind schnell und vertraut. Custom-Player wäre unnötiges Risiko.
- Releases: „Deine Krankenschwester“ am 16.10.2026 (Video 21.10.), „Fragen kostet nichts“ am 27.11.2026 (tbc). Draußen sind „Nazis sind schwul“ und „Fickt gut“.
- Video: „Fickt gut“ liegt auf YouTube (`N6lhe5b0JvI`, Kanal `@krankenschwestermusik`, bestätigt über die oEmbed-Daten). Das Video ist altersbeschränkt und darf nicht extern abspielen, deshalb auf der Seite ein Plakat mit Link statt eines Players. Musikvideo „Deine Krankenschwester“ folgt am 21.10.2026. **OFFEN:** dessen Video-ID und das Single-Cover.
- Fotos: 32 Motive. Pressefotos und Fotoshooting von Leonardo Voigt, dazu 19 Livefotos. **OFFEN:** Credits der Livefotos.
- Bio: neuer Text vom Artist (06.09.2026), ohne Klarnamen und Alter, dafür mit der politischen Haltung. Die EPK-Details (Wieland Mrusek, 25, Popmusik-Studium, Namensherkunft, „Für Fans von“) stehen nicht mehr auf der Seite und liegen für die Presse bereit.
- Tourdaten: eingetragen, 3 kommende und 14 vergangene Shows. Pflege über `content.js`, kein Feed.
- Pressezitate: noch keine.
- Lyrics: nicht zum Launch.

## 4. Features & Scope

- [x] Audio: Spotify-Embed plus direkte Links
- [x] Live-Sektion: manuelle Pflege in `content.js`, keine Bandsintown/Songkick-Anbindung
- [ ] Mailingliste: kein Anbieter, zum Launch gestrichen
- [ ] Merch: kein Shop, Link kann später in `content.js` ergänzt werden
- [x] Presse-Bereich mit Fotos zum Download, Credit und Kurzbio zum Kopieren
- [x] Booking: `mailto:` und Telefon direkt, kein Formular, also kein Spamschutz nötig
- [x] Socials: Instagram und TikTok (`krankenschwester.musik`), Spotify
- [ ] News/Blog: gestrichen, wird nicht gepflegt

## 5. Visual Direction

Locked im Brainstorm: **Flyposter, v2-Intensität.**

- Pattern: One-Pager, Hero → Musik → Live → Über → Presse → Kontakt.
- [x] Dark only, `#0A0A0A`.
- Farben: Ink `#0A0A0A`, Weiß, Pink `#FF1F8F`, Rot `#FF1F1F`. **Acid-Gelb gestrichen**, es steht in keinem Material des Artists.
- Typografie: Anton (schmale, fette Versalien, geneigt) für Display, Archivo für Fließtext. Kommt dem EPK-Satz am nächsten.
- Textur: Xerox-Raster, Halbton-Punkte, gerissene Kanten, Klebestreifen. Grenze: Fotos dürfen Text nie tragen, Kontrast geht vor Grain.
- Motion: Marquee-Band und Hover-Kippen, alles aus bei `prefers-reduced-motion`.
- Vermieden: überladenes Layout, gebastelter Audio-Player.
- Accessibility-Boden: 4.5:1, sichtbare Fokusrahmen, 44px-Touchziele, echter Text statt Text im Bild.

## 6. Structure

Stand nach der Struktur-Ansage des Artists vom 06.09.2026:

- [x] One-Pager: Hero / Bio / Release / Live / Fotos / Kontakt und Social

Der Presse-Block (Kurzbio zum Kopieren, Fotos zum Download als eigene Sektion) ist dabei rausgeflogen, die Fotos stehen jetzt in der Galerie, Pressefotos auf Anfrage. Kann jederzeit zurück, sobald Presseanfragen kommen.

Begründung One-Pager: zwei veröffentlichte Singles, ein anstehender Release, ein Scroll hält Leute, die aus einer Story kommen, im Fluss. Sobald ein Album oder ein Shop dazukommt, wird `/musik` und `/merch` abgetrennt.

## 7. Tech & Hosting

- Stack: statisches HTML/CSS/JS, kein Build. Inhalte in `content.js`, Bilder über `node tools/build-images.mjs`.
- Hosting: **OFFEN**: Empfehlung Netlify (Drag-and-drop-Deploy, eigene Domain, kostenlos).
- Domain: **OFFEN**.
- Analytics: keins zum Launch, sonst GoatCounter.

## 8. Constraints & Done

- Deadline: **OFFEN** (nächste Show oder Release-Termin).
- Budget: 0 €, alle Fonts und Hosting kostenlos.
- Definition of Done:
  - Launch: Hero, beide Singles hörbar, Live-Sektion mit echten Terminen, Bio, Pressefotos, Booking-Kontakt, **Impressum** (Pflicht in DE, Adresse fehlt noch).
  - Später: Merch-Link, Mailingliste, Pressestimmen, Lyrics.
