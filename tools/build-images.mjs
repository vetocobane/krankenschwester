import { createCanvas, loadImage, Image } from '@napi-rs/canvas';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'Sources');
const outDir = path.join(root, 'assets', 'photos');
const WIDTHS = [1600, 800];

fs.mkdirSync(outDir, { recursive: true });

const slug = (s) =>
  s.toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[äàá]/g, 'a').replace(/[öó]/g, 'o').replace(/[üú]/g, 'u').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Kameranamen wie IMG_5232 oder DCB77A1E-… sagen nichts, die werden durchnummeriert.
const nichtssagend = (name) =>
  /^(img[_-]|_?dsc|photo|foto|[0-9a-f]{8}-[0-9a-f]{4}|[a-z]{2,4}[_-]?\d{3,})/i.test(name);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(jpe?g|png|heic)$/i.test(e.name) ? [p] : [];
  });

async function lade(file) {
  if (!/\.heic$/i.test(file)) return loadImage(file);
  const { default: decode } = await import('heic-decode');
  let roh;
  try {
    roh = await decode({ buffer: fs.readFileSync(file) });
  } catch {
    return loadImage(file); // manche .HEIC sind in Wahrheit JPEG
  }
  const canvas = createCanvas(roh.width, roh.height);
  const ctx = canvas.getContext('2d');
  const daten = ctx.createImageData(roh.width, roh.height);
  daten.data.set(roh.data);
  ctx.putImageData(daten, 0, 0);
  const img = new Image();
  img.src = canvas.toBuffer('image/jpeg', 92);
  return img;
}

async function resize(file, name) {
  const img = await lade(file);
  for (const w of WIDTHS) {
    const scale = Math.min(1, w / img.width);
    const canvas = createCanvas(Math.round(img.width * scale), Math.round(img.height * scale));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const out = path.join(outDir, `${name}-${w}.jpg`);
    fs.writeFileSync(out, canvas.toBuffer('image/jpeg', 78));
  }
  console.log(`${name}  (${img.width}x${img.height})`);
}

// The logo ships transparent but with huge empty margins: trim to the ink.
async function logo(file) {
  const img = await loadImage(file);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Zeilen- und Spaltensummen statt einzelner Pixel: sonst ziehen die blassen
  // Scanner-Flecken am Rand den Beschnitt auf und das Logo schwimmt im Weiß.
  const zeile = new Uint32Array(canvas.height);
  const spalte = new Uint32Array(canvas.width);
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] > 120) {
      const p = i / 4;
      spalte[p % canvas.width]++;
      zeile[(p / canvas.width) | 0]++;
    }
  }
  const grenze = (arr, laenge) => {
    const min = Math.max(3, Math.round(laenge * 0.002));
    let a = 0, b = arr.length - 1;
    while (a < arr.length && arr[a] < min) a++;
    while (b > a && arr[b] < min) b--;
    return [a, b];
  };
  const [minX, maxX] = grenze(spalte, canvas.height);
  const [minY, maxY] = grenze(zeile, canvas.width);

  const pad = 8;
  const w = maxX - minX + pad * 2, h = maxY - minY + pad * 2;
  const trimmed = createCanvas(w, h);
  trimmed.getContext('2d').drawImage(canvas, minX - pad, minY - pad, w, h, 0, 0, w, h);
  const out = path.join(root, 'assets', 'logo.png');
  fs.writeFileSync(out, trimmed.toBuffer('image/png'));
  console.log(`${path.relative(root, out)}  (${w}x${h})`);

  favicon(trimmed);
}

// Das rote Anarcho-A aus dem Logo wird zum Favicon. Es unterscheidet sich vom
// pinken Schriftzug durch den niedrigen Blauanteil, danach wird gesucht.
function favicon(quelle) {
  const ctx = quelle.getContext('2d');
  const px = ctx.getImageData(0, 0, quelle.width, quelle.height).data;
  let minX = quelle.width, minY = quelle.height, maxX = 0, maxY = 0;
  for (let i = 0; i < px.length; i += 4) {
    const [r, g, b, a] = [px[i], px[i + 1], px[i + 2], px[i + 3]];
    if (a > 120 && r > 120 && b < 90 && g < 110) {
      const p = i / 4, x = p % quelle.width, y = (p / quelle.width) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  const w = maxX - minX, h = maxY - minY;
  if (w < 10 || h < 10) {
    console.log('favicon: kein rotes A gefunden, übersprungen');
    return;
  }
  const kante = Math.max(w, h);
  const gross = 256, rand = 12;
  const canvas = createCanvas(gross, gross);
  const ctx2 = canvas.getContext('2d');
  const faktor = (gross - rand * 2) / kante;
  ctx2.drawImage(
    quelle,
    minX - (kante - w) / 2, minY - (kante - h) / 2, kante, kante,
    rand, rand, kante * faktor, kante * faktor,
  );
  // Alles wegradieren, was nicht rot ist, sonst stehen Reste des pinken
  // Schriftzugs hinter dem A und das Icon wird bei 16 px zu Matsch.
  const daten = ctx2.getImageData(0, 0, gross, gross);
  const p2 = daten.data;
  for (let i = 0; i < p2.length; i += 4) {
    if (p2[i] - p2[i + 2] < 120) p2[i + 3] = 0;
  }
  ctx2.putImageData(daten, 0, 0);

  const out = path.join(root, 'assets', 'favicon.png');
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log(`${path.relative(root, out)}  (Quelle ${w}x${h})`);
}

// Pinker Duoton für die Galerie, fest ins Bild gerechnet. Das ist dieselbe
// Rechnung wie mix-blend-mode: luminosity über Pink, nur einmalig statt bei
// jedem Hover, und ohne Flackern unter 3D-Transformationen.
const PINK = [255, 31, 143];

function setLum(c, lum) {
  const l = 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
  const d = lum - l;
  let r = [c[0] + d, c[1] + d, c[2] + d];
  const n = Math.min(...r), x = Math.max(...r);
  if (n < 0) r = r.map((v) => lum + ((v - lum) * lum) / (lum - n));
  if (x > 255) r = r.map((v) => lum + ((v - lum) * (255 - lum)) / (x - lum));
  return r;
}

async function duoton(name) {
  const quelle = path.join(outDir, `${name}-800.jpg`);
  if (!fs.existsSync(quelle)) {
    console.log(`duoton: ${name}-800.jpg fehlt, übersprungen`);
    return;
  }
  const img = await loadImage(quelle);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const daten = ctx.getImageData(0, 0, img.width, img.height);
  const px = daten.data;
  for (let i = 0; i < px.length; i += 4) {
    const lum = 0.3 * px[i] + 0.59 * px[i + 1] + 0.11 * px[i + 2];
    const [r, g, b] = setLum(PINK, lum);
    px[i] = r; px[i + 1] = g; px[i + 2] = b;
  }
  ctx.putImageData(daten, 0, 0);
  const out = path.join(outDir, `${name}-duo-800.jpg`);
  fs.writeFileSync(out, canvas.toBuffer('image/jpeg', 80));
  console.log(`${name}-duo-800.jpg`);
}

function galerieBilder() {
  try {
    const quelltext = fs.readFileSync(path.join(root, 'content.js'), 'utf8');
    const fenster = {};
    new Function('window', quelltext)(fenster);
    return (fenster.CONTENT?.fotos ?? []).map((f) => f.datei);
  } catch (err) {
    console.log('content.js nicht lesbar, kein Duoton erzeugt:', err.message);
    return [];
  }
}

// Pressefotos zuerst, damit bei doppelten Bildern der sprechende Dateiname gewinnt.
const rang = (p) => (/presse/i.test(p) ? 0 : 1);
const dateien = walk(srcDir).sort((a, b) => rang(a) - rang(b) || a.localeCompare(b));
const zaehler = {};
const gesehen = new Map();

for (const file of dateien) {
  if (/logo/i.test(file)) {
    await logo(file);
    continue;
  }
  const groesse = fs.statSync(file).size;
  if (gesehen.has(groesse)) {
    console.log(`${path.basename(file)}  uebersprungen, gleich wie ${gesehen.get(groesse)}`);
    continue;
  }
  gesehen.set(groesse, path.basename(file));

  const ordner = path.relative(srcDir, path.dirname(file));
  const basis = path.basename(file);
  let name;
  if (nichtssagend(basis)) {
    const gruppe = (slug(ordner.split(path.sep).pop() || 'foto') || 'foto').replace(/-?fotos?$/, '');
    zaehler[gruppe] = (zaehler[gruppe] || 0) + 1;
    name = `${gruppe}-${String(zaehler[gruppe]).padStart(2, '0')}`;
  } else {
    name = slug(basis);
  }
  await resize(file, name);
}

for (const name of galerieBilder()) await duoton(name);
