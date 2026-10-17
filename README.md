# Krankenschwester, Website

Statische Seite, kein Build, kein Framework. Zum Ansehen `index.html` im Browser öffnen
oder `npx serve .` im Projektordner starten.

Reihenfolge der Seite: Hero, Bio, Release, Live, Fotos, Kontakt und Social.

```
index.html      Seitengerüst und die Bio-Texte
styles.css      Gestaltung
content.js      >> Hier werden Inhalte gepflegt <<
main.js         baut Release, Termine, Galerie, Kontakt und Social aus content.js
assets/         fertige Bilder fürs Web (erzeugt, nicht von Hand bearbeiten)
Sources/        Originale: Logo, Pressefotos, Livefotos, EPK
tools/          Bild-Script
```

## Aktueller Release

In `content.js` unter `aktuell`:

- `youtube`: die Video-ID, also der Teil hinter `?v=` in der YouTube-URL. Solange das Feld
  leer ist, steht im Video-Rahmen der Text aus `platzhalter` (aktuell „Musikvideo ab 21.10.2026“).
- `cover`: Dateiname des Single-Covers aus `assets/photos/` ohne Größenzusatz. Wird gezeigt,
  solange es noch kein Video gibt.
- `termine`: die Release-Daten darunter, jeweils `{ datum: "2026-10-16", was: "…", hinweis: "tbc" }`.

Bereits veröffentlichte Songs stehen in `releases`. Für den Spotify-Player die Track-ID aus
der Spotify-URL kopieren, das ist der Teil hinter `/track/`.

Ist bei einem Song `youtube` gesetzt, zeigt die Karte statt des Players ein Video-Plakat mit
Play-Button, das auf YouTube öffnet. Das ist Absicht: die Videos sind dort altersbeschränkt
und lassen sich auf fremden Seiten nicht abspielen, ein eingebetteter Player würde nur eine
graue Fehlermeldung zeigen. Das Standbild kommt aus `videoBild` (Datei in `assets/photos/`),
ohne Eintrag wird das YouTube-Vorschaubild geladen. `videoHinweis` ist das kleine Label unten
links im Plakat.

## Termine eintragen

In `content.js` in der Liste `shows` eine Zeile pro Show ergänzen:

```js
{ datum: "2026-12-05", stadt: "Greifswald", venue: "IKuWo", tickets: "https://…", hinweis: "Support" },
```

- `datum` immer als `"JJJJ-MM-TT"`, sonst wird die Show ignoriert.
- `stadt`, `tickets` und `hinweis` dürfen leer bleiben (`""`).
- Sortierung passiert automatisch. Vergangene Termine rutschen in ein aufklappbares
  Feld „Vergangene Shows“ und bekommen den Stempel „Gespielt“. Nichts muss gelöscht werden.
- Die nächste Show erscheint automatisch im Hero.
- Sind keine kommenden Termine da, zeigt die Sektion den Booking-Kontakt.

## Fotos ergänzen

1. Neue Bilder nach `Sources/` legen, gern in einen eigenen Unterordner. JPG, PNG und HEIC
   werden erkannt.
2. Einmal `node tools/build-images.mjs` ausführen. Das Script rechnet jedes Bild auf
   1600 px und 800 px Breite herunter und legt es unter `assets/photos/` ab. Kameranamen wie
   `IMG_5232` oder `LOR00202` werden nach Ordner durchnummeriert, aus `Live-Fotos/` wird also
   `live-01`, `live-02` und so weiter. Doppelte Bilder werden übersprungen. Die fertigen
   Namen stehen danach im Terminal.
3. In `content.js` in `fotos` eintragen, den Dateinamen **ohne** `-1600.jpg` / `-800.jpg`:

```js
{ datei: "live-20", alt: "Krankenschwester auf der Bühne, Publikum springt.", credit: "Name" },
```

`alt` ist die Bildbeschreibung für Screenreader, also kurz sagen, was zu sehen ist.
`credit` leer lassen, wenn die Fotograf:in unbekannt ist.

Hero-Bild und Bio-Foto werden in `content.js` unter `hero` und `biofoto` gesetzt.

Beim ersten Mal einmalig `npm install` ausführen, das Script braucht `@napi-rs/canvas`
und `heic-decode`.

## Social und Kontakt

`content.js` unter `social` (Instagram, TikTok, YouTube, Spotify) und `kontakt` (Mail,
optional Telefon). Leere Felder werden ausgeblendet.

## Offen vor dem Launch

- **Impressum.** In Deutschland Pflicht, sobald die Seite öffentlich ist. Fehlt noch, weil
  die Anschrift fehlt. Kommt als eigene Seite `impressum.html` plus Link im Fuß.
- Video-ID und Single-Cover für „Deine Krankenschwester“ nachtragen.
- Fotograf:innen der Livefotos für die Credits.
- Hosting und Domain entscheiden, Empfehlung Netlify.
