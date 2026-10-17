(() => {
  const C = window.CONTENT;
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const bild = (name, w) => `assets/photos/${name}-${w}.jpg`;
  const extern = (a) => { a.target = '_blank'; a.rel = 'noopener'; return a; };

  const datumLang = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const datumKurz = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' });
  const wochentag = new Intl.DateTimeFormat('de-DE', { weekday: 'short' });
  const heute = new Date();
  heute.setHours(0, 0, 0, 0);

  /* ---------- Hero ---------- */
  const hero = C.hero;
  if (hero && hero.hochkant) {
    const quelle = $('.hero-bg source');
    const img = $('.hero-bg img');
    if (quelle && hero.quer) quelle.srcset = bild(hero.quer, 1600);
    if (img) {
      img.src = bild(hero.hochkant, 800);
      img.srcset = `${bild(hero.hochkant, 800)} 800w, ${bild(hero.hochkant, 1600)} 1600w`;
      if (hero.alt) img.alt = hero.alt;
    }
  }

  /* ---------- Laufband ----------
     Wird so oft wiederholt, bis eine Spur breiter als der Bildschirm ist.
     Zwei identische Spuren laufen um ihre eigene Breite nach links, dadurch
     reißt das Band nie ab, egal wie breit das Fenster ist. */
  const laufband = $('[data-marquee]');
  if (laufband && (C.laufband || []).length) {
    const einheit = C.laufband.map((t) => esc(t)).join(' &#10022; ') + ' &#10022; ';
    const spur = () => {
      const s = el('span', 'marquee-spur', einheit);
      laufband.append(s);
      return s;
    };
    const bauen = () => {
      laufband.textContent = '';
      const s = spur();
      const breite = s.offsetWidth || 1;
      const noetig = Math.max(1, Math.ceil(laufband.offsetWidth / breite));
      s.innerHTML = einheit.repeat(noetig);
      const zweite = spur();
      zweite.innerHTML = s.innerHTML;
      const dauer = Math.round(s.offsetWidth / 90);
      laufband.style.setProperty('--laufzeit', `${Math.max(8, dauer)}s`);
    };
    bauen();
    let timer;
    addEventListener('resize', () => {
      clearTimeout(timer);
      timer = setTimeout(bauen, 250);
    });
  }

  /* ---------- Bio-Foto ---------- */
  const biofoto = $('[data-biofoto]');
  if (biofoto && C.biofoto && C.biofoto.datei) {
    const f = C.biofoto;
    const img = el('img');
    img.src = bild(f.datei, 800);
    img.srcset = `${bild(f.datei, 800)} 800w, ${bild(f.datei, 1600)} 1600w`;
    img.sizes = '(min-width: 900px) 40vw, 90vw';
    img.alt = f.alt || '';
    img.loading = 'lazy';
    biofoto.append(img);
    if (f.credit) biofoto.append(el('figcaption', null, `Foto: ${esc(f.credit)}`));
  }

  /* ---------- Aktueller Release ---------- */
  const aktuell = $('[data-aktuell]');
  if (aktuell && C.aktuell) {
    const a = C.aktuell;
    const block = el('div', 'aktuell');

    const naechsterTermin = (a.termine || [])
      .map((t) => new Date(`${t.datum}T00:00:00`))
      .filter((d) => !isNaN(d) && d >= heute)
      .sort((x, y) => x - y)[0];

    const buehne = el('div', 'aktuell-video');
    if (a.youtube) {
      const frame = el('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(a.youtube)}`;
      frame.title = `Musikvideo: ${a.titel}`;
      frame.loading = 'lazy';
      frame.allow = 'accelerometer; clipboard-write; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      buehne.append(frame);
    } else if (a.cover) {
      const img = el('img');
      img.src = bild(a.cover, 800);
      img.srcset = `${bild(a.cover, 800)} 800w, ${bild(a.cover, 1600)} 1600w`;
      img.alt = `Cover von ${a.titel}`;
      buehne.append(img);
    } else {
      // Kein Video, kein Cover: statt eines leeren Rahmens ein Ankündigungs-Plakat.
      buehne.classList.add('aktuell-plakat');
      if (a.teaser) {
        const img = el('img');
        img.src = bild(a.teaser, 800);
        img.srcset = `${bild(a.teaser, 800)} 800w, ${bild(a.teaser, 1600)} 1600w`;
        img.sizes = '(min-width: 900px) 62vw, 100vw';
        img.alt = '';
        buehne.append(img);
      }
      const text = el('div', 'plakat-text');
      if (naechsterTermin) {
        const tage = Math.round((naechsterTermin - heute) / 86400000);
        text.append(el('p', 'plakat-datum', datumKurz.format(naechsterTermin)));
        text.append(el('p', 'plakat-zeile', tage === 0 ? 'Heute draußen' : `Noch ${tage} Tage`));
      }
      if (a.platzhalter) text.append(el('p', 'plakat-hinweis', esc(a.platzhalter)));
      buehne.append(text);
    }
    block.append(buehne);

    const info = el('div', 'aktuell-info');
    info.append(el('p', 'aktuell-label', 'Neue Single'));
    info.append(el('h3', 'aktuell-titel', esc(a.titel)));

    const liste = el('ul', 'termine');
    for (const t of a.termine || []) {
      const d = new Date(`${t.datum}T00:00:00`);
      const li = el('li');
      li.append(el('span', 'termin-datum', isNaN(d) ? esc(t.datum) : datumKurz.format(d)));
      li.append(el('span', 'termin-was', esc(t.was)));
      if (t.hinweis) li.append(el('span', 'termin-hinweis', esc(t.hinweis)));
      liste.append(li);
    }
    info.append(liste);
    block.append(info);
    aktuell.append(block);
  }

  /* ---------- Veröffentlichte Songs ---------- */
  const releases = $('[data-releases]');
  if (releases) {
    for (const r of C.releases || []) {
      const karte = el('article', 'release');
      karte.append(el('h4', null, esc(r.titel)));
      karte.append(el('p', 'meta', `${esc(r.typ)} &middot; ${esc(r.jahr)}`));
      if (r.youtube) {
        // Kein iframe: die Videos sind auf YouTube altersbeschränkt und dürfen
        // extern nicht abspielen. Ein Plakat mit Play-Button führt direkt hin.
        const a = extern(el('a', 'release-video'));
        a.href = `https://www.youtube.com/watch?v=${encodeURIComponent(r.youtube)}`;
        a.setAttribute('aria-label', `Musikvideo „${r.titel}“ auf YouTube ansehen`);
        const img = el('img');
        if (r.videoBild) {
          img.src = bild(r.videoBild, 800);
          img.srcset = `${bild(r.videoBild, 800)} 800w, ${bild(r.videoBild, 1600)} 1600w`;
        } else {
          img.src = `https://i.ytimg.com/vi/${encodeURIComponent(r.youtube)}/maxresdefault.jpg`;
        }
        img.alt = `Standbild aus dem Musikvideo „${r.titel}“`;
        img.loading = 'lazy';
        a.append(img);
        a.append(el('span', 'play', '&#9654;'));
        if (r.videoHinweis) a.append(el('span', 'video-hinweis', esc(r.videoHinweis)));
        karte.append(a);
      } else if (r.embed) {
        const frame = el('iframe');
        frame.src = `https://open.spotify.com/embed/track/${encodeURIComponent(r.embed)}?theme=0`;
        frame.title = `Spotify-Player: ${r.titel}`;
        frame.loading = 'lazy';
        frame.allow = 'encrypted-media; clipboard-write';
        karte.append(frame);
      }
      const links = el('div', 'links');
      for (const [key, label, cls] of [
        ['spotify', 'Auf Spotify', 'btn btn-pink btn-klein'],
        ['youtube', 'Auf YouTube', 'btn btn-ghost btn-klein'],
      ]) {
        if (!r[key]) continue;
        const a = extern(el('a', cls, label));
        a.href = key === 'youtube' ? `https://www.youtube.com/watch?v=${encodeURIComponent(r.youtube)}` : r[key];
        links.append(a);
      }
      if (links.children.length) karte.append(links);
      releases.append(karte);
    }
  }

  /* ---------- Live ---------- */
  const shows = (C.shows || [])
    .map((s) => ({ ...s, d: new Date(`${s.datum}T00:00:00`) }))
    .filter((s) => !isNaN(s.d))
    .sort((a, b) => a.d - b.d);
  const kommend = shows.filter((s) => s.d >= heute);
  const vorbei = shows.filter((s) => s.d < heute).reverse();

  const showZeile = (s, vergangen) => {
    const li = el('li', vergangen ? 'show show-vorbei' : 'show');
    li.append(el('span', 'datum', `${wochentag.format(s.d)} ${datumLang.format(s.d)}`));
    li.append(el('span', 'ort', esc([s.stadt, s.venue].filter(Boolean).join(', '))));
    if (s.hinweis) li.append(el('span', 'hinweis', esc(s.hinweis)));
    const aktion = el('span', 'aktion');
    if (vergangen) {
      aktion.append(el('span', 'stempel', 'Gespielt'));
    } else if (s.tickets) {
      const a = extern(el('a', 'btn btn-pink btn-klein', 'Tickets'));
      a.href = s.tickets;
      a.setAttribute('aria-label', `Tickets für ${[s.stadt, s.venue].filter(Boolean).join(', ')} am ${datumLang.format(s.d)}`);
      aktion.append(a);
    }
    li.append(aktion);
    return li;
  };

  const live = $('[data-shows]');
  if (live) {
    if (kommend.length) {
      const ul = el('ul', 'shows');
      kommend.forEach((s) => ul.append(showZeile(s, false)));
      live.append(ul);
    } else {
      live.append(el('div', 'leer',
        '<p><strong>Aktuell keine angekündigten Termine.</strong></p>' +
        `<p>Für Booking-Anfragen: <a href="mailto:${esc(C.kontakt.mail)}">${esc(C.kontakt.mail)}</a></p>`));
    }
    if (vorbei.length) {
      const details = el('details', 'vergangen');
      details.append(el('summary', null, `Vergangene Shows (${vorbei.length})`));
      const ul = el('ul', 'shows');
      vorbei.forEach((s) => ul.append(showZeile(s, true)));
      details.append(ul);
      live.append(details);
    }
  }

  const naechste = $('[data-next-show]');
  if (naechste && kommend.length) {
    const s = kommend[0];
    const ort = [s.stadt, s.venue].filter(Boolean).join(', ');
    naechste.textContent = `Nächste Show: ${datumLang.format(s.d)} ${ort}`;
    naechste.hidden = false;
  }

  /* ---------- Galerie ---------- */
  const galerie = $('[data-galerie]');
  const kippen = matchMedia('(hover: hover)').matches
    && !matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (galerie) {
    for (const f of C.fotos || []) {
      const fig = el('figure');
      const a = extern(el('a'));
      a.href = bild(f.datei, 1600);
      // Zwei Ebenen: unten das Foto in Farbe, darüber die pinke Fassung aus dem
      // Bild-Script. Der Hover blendet nur die Deckkraft, das ist ruhiger als
      // Filter oder Blend-Modi, die beim Kippen neu gerechnet werden müssten.
      const img = el('img', 'farbe');
      img.src = bild(f.datei, 800);
      img.alt = f.alt || '';
      img.loading = 'lazy';

      const duo = el('img', 'duo');
      duo.src = `assets/photos/${f.datei}-duo-800.jpg`;
      duo.alt = '';
      duo.loading = 'lazy';
      duo.addEventListener('error', () => duo.remove());

      // Das Blatt wird bewegt, der Link selbst bleibt liegen. Sonst rutscht die
      // Fläche beim Kippen unter der Maus weg und der Hover flackert.
      const blatt = el('span', 'blatt');
      blatt.append(img, duo);
      a.append(blatt);
      if (kippen) {
        a.addEventListener('pointermove', (e) => {
          const r = a.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          // Das Blatt neigt sich zu der Seite, auf der die Maus steht.
          a.style.setProperty('--ry', `${(x * 16).toFixed(2)}deg`);
          a.style.setProperty('--rx', `${(-y * 16).toFixed(2)}deg`);
        });
        a.addEventListener('pointerleave', () => {
          a.style.setProperty('--ry', '0deg');
          a.style.setProperty('--rx', '0deg');
        });
      }
      fig.append(a);
      if (f.credit) fig.append(el('figcaption', null, `Foto: ${esc(f.credit)}`));
      galerie.append(fig);
    }
  }

  /* ---------- Kontakt ---------- */
  const kontakt = $('[data-kontakt]');
  if (kontakt) {
    const k = C.kontakt || {};
    const eintraege = [
      k.mail && ['Mail schreiben', k.mail, `mailto:${k.mail}`],
      k.telefon && ['Anrufen', k.telefon, `tel:${k.telefon.replace(/\s/g, '')}`],
    ].filter(Boolean);
    for (const [label, wert, href] of eintraege) {
      const a = el('a', null, `<span>${esc(label)}</span><span class="wert">${esc(wert)}</span>`);
      a.href = href;
      kontakt.append(a);
    }
  }

  /* ---------- Social in der Kopfleiste ---------- */
  const glyphen = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.3"/>',
    tiktok: '<path d="M14.3 3h2.6c.3 2.1 1.8 3.6 3.9 3.8v2.7c-1.4 0-2.7-.4-3.9-1.2v5.9a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.8a3.1 3.1 0 1 0 2.4 3V3z"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4.2"/><path d="M10 8.6 16 12l-6 3.4V8.6z" fill="#fff"/>',
    spotify: '<circle cx="12" cy="12" r="10"/><path d="M7 14.4c2.9-1.3 6.3-1 8.8.6M7.4 11.3c3.4-1.5 7.3-1.1 10.2.8M7.8 8.2c3.9-1.6 8.3-1.1 11.5 1" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
  };
  const barSocial = $('[data-barsocial]');
  if (barSocial) {
    const s = C.social || {};
    for (const [key, label] of [['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'], ['spotify', 'Spotify']]) {
      if (!s[key]) continue;
      const a = extern(el('a', null, `<svg viewBox="0 0 24 24" aria-hidden="true">${glyphen[key]}</svg>`));
      a.href = s[key];
      a.setAttribute('aria-label', label);
      barSocial.append(a);
    }
  }

  /* ---------- Social ---------- */
  const social = $('[data-social]');
  if (social) {
    const s = C.social || {};
    for (const [key, label] of [['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube'], ['spotify', 'Spotify']]) {
      if (!s[key]) continue;
      const a = extern(el('a', 'social-link', esc(label)));
      a.href = s[key];
      social.append(a);
    }
  }
})();
