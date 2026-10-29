(() => {
  'use strict';

  const ALL = { id: 'all', name: 'All India', native: 'भारत', accent: '#ff2d6f' };

  const ICON_PATHS = {
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    library: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z',
    translate: 'M12.87 15.07l-2.54-2.51.03-.03A17.5 17.5 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
    play: 'M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z',
    pause: 'M7 5h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm7 0h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
    next: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
    prev: 'M6 6h2v12H6zm3.5 6l8.5 6V6z',
    shuffle: 'M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z',
    repeat: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z',
    repeatOne: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z',
    heart: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
    heartFill: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    mic: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',
    volume: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z',
    down: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
    check: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  };

  const icon = (name, size = 24) =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><path fill="currentColor" d="${ICON_PATHS[name]}"/></svg>`;

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (sec) => {
    if (!isFinite(sec) || sec < 0) return '0:00';
    const s = Math.floor(sec);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };
  const hash = (s) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem('atmusic_' + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('atmusic_' + key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    },
  };

  const state = {
    view: 'home',
    hub: 'all',
    query: '',
    queue: [],
    index: -1,
    shuffle: false,
    repeat: 'off',
    npOpen: false,
    activeLine: -2,
    favs: new Set(store.get('favs', [])),
    langs: store.get('langs', null),
  };

  let regions = [];
  let regionById = {};
  let tracks = [];
  let trackById = {};
  let playlists = [];
  let lineGap = 7000;
  let lyricEls = [];
  const queues = new Map();

  const audio = $('#audio');
  const main = $('#main');
  const npf = $('#nowplaying');
  const lyrBox = $('#npf-lyrics');
  const lyrTrack = $('#lyr-track');
  const volume = $('#volume');
  let seeking = false;

  // ---------- Generated cover art (used until a real cover is uploaded) ----------
  const DEEP = ['#14061f', '#1d0a2e', '#0a1230', '#2a0716', '#061a1c', '#1f1406'];
  const coverCache = new Map();

  function wrapTitle(title, max = 11) {
    const lines = [''];
    for (const w of title.split(' ')) {
      const cur = lines[lines.length - 1];
      if (cur && (cur + ' ' + w).length > max) lines.push(w);
      else lines[lines.length - 1] = cur ? `${cur} ${w}` : w;
    }
    return lines.slice(0, 3);
  }

  function art(t) {
    if (t.artworkUrl) return t.artworkUrl;
    if (coverCache.has(t.id)) return coverCache.get(t.id);
    const r = regionById[t.region];
    const h = hash(t.id);
    const deep = DEEP[h % DEEP.length];
    const lines = wrapTitle(t.title);
    const fs = lines.length > 2 ? 62 : 76;
    const cx = 410 + (h % 90);
    const cy = 150 + ((h >> 4) % 90);
    const text = lines.map((l, i) =>
      `<text x="40" y="${Math.round(490 - (lines.length - 1 - i) * fs * 1.05)}" font-family="Poppins,Arial,sans-serif" font-weight="800" font-size="${fs}" fill="#fff" letter-spacing="-2">${esc(l)}</text>`).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${r.accent}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
        <radialGradient id="l" cx="${20 + (h % 50)}%" cy="${10 + ((h >> 3) % 40)}%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".42"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="600" height="600" fill="url(#g)"/>
      <rect width="600" height="600" fill="url(#l)"/>
      <g fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="2">
        <circle cx="${cx}" cy="${cy}" r="170"/><circle cx="${cx}" cy="${cy}" r="125"/><circle cx="${cx}" cy="${cy}" r="80"/>
      </g>
      <circle cx="${cx}" cy="${cy}" r="34" fill="#fff" fill-opacity=".2"/>
      <text x="44" y="84" font-family="Poppins,Arial,sans-serif" font-weight="800" font-size="26" fill="#fff" letter-spacing="4">AT MUSIC</text>
      ${text}
      <text x="44" y="550" font-family="Poppins,Arial,sans-serif" font-size="25" fill="#fff" fill-opacity=".85">${esc(r.native)} · ${esc(t.artist)}</text>
    </svg>`;
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    coverCache.set(t.id, url);
    return url;
  }

  // ---------- Catalog ----------
  async function loadCatalog() {
    const res = await fetch('catalog.json', { cache: 'no-cache' });
    const data = await res.json();
    lineGap = data.lyricLineGapMs || 7000;
    regions = data.regions;
    regionById = Object.fromEntries([ALL, ...regions].map((r) => [r.id, r]));
    tracks = data.tracks.map((t) => ({
      ...t,
      lyrics: (t.lyrics || []).map((line, i) => (typeof line === 'string' ? { t: i * lineGap, text: line } : line)),
    }));
    trackById = Object.fromEntries(tracks.map((t) => [t.id, t]));
    playlists = data.playlists.map((p) => ({ ...p, tracks: p.tracks.map((id) => trackById[id]).filter(Boolean) }));
  }

  function sectionsFor(hubId) {
    const preferred = new Set(state.langs || []);
    if (hubId === 'all') {
      const forYou = tracks.filter((t) => preferred.has(t.region));
      const sorted = [...playlists].sort((a, b) => preferred.has(b.region) - preferred.has(a.region));
      return (forYou.length ? [{ id: 'p_for_you', title: 'Made for You', subtitle: 'Aapki bhashayein, sirf romance', tracks: forYou }] : []).concat(sorted);
    }
    const hub = regionById[hubId];
    const own = { id: 'p_hub_' + hubId, title: `${hub.name} Romance`, subtitle: hub.native, tracks: tracks.filter((t) => t.region === hubId) };
    return [own, ...playlists.filter((p) => p.id !== 'p_' + hubId && p.tracks.some((t) => t.region === hubId))];
  }

  const current = () => state.queue[state.index];

  // ---------- Views ----------
  const EQ = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>';

  function card(track, queueId, i) {
    const cur = current()?.id === track.id;
    return `<button class="card${cur ? ' is-current' : ''}" data-track="${track.id}" data-q="${queueId}" data-i="${i}">
      <div class="art">
        <img loading="lazy" src="${esc(art(track))}" alt="">
        ${EQ}
        <span class="play-fab">${icon('play', 24)}</span>
      </div>
      <div class="card-title">${esc(track.title)}</div>
      <div class="card-sub">${esc(track.artist)} · ${esc(regionById[track.region].native)}</div>
    </button>`;
  }

  function trackRows(list, queueId) {
    queues.set(queueId, list);
    return `<div class="tracklist">${list.map((t, i) => {
      const r = regionById[t.region];
      const fav = state.favs.has(t.id);
      return `<div class="trow${current()?.id === t.id ? ' is-current' : ''}" data-track="${t.id}" data-q="${queueId}" data-i="${i}" role="button" tabindex="0">
        <span class="num">${i + 1}</span>
        <img loading="lazy" src="${esc(art(t))}" alt="">
        <div><div class="tt">${esc(t.title)}</div><div class="ta">${esc(t.artist)}</div></div>
        <span class="tr">${esc(r.native)} · ${esc(r.name)}</span>
        <button class="fav-btn${fav ? ' on' : ''}" data-fav="${t.id}" aria-label="Favourite">${icon(fav ? 'heartFill' : 'heart', 20)}</button>
      </div>`;
    }).join('')}</div>`;
  }

  function hero(secs) {
    const list = secs[0]?.tracks || [];
    const t = list[0];
    if (!t) return '';
    queues.set('hero', list);
    const r = regionById[t.region];
    const cover = esc(art(t));
    return `<section class="hero" style="--accent:${r.accent}">
      <img class="hero-bg" src="${cover}" alt="">
      <div>
        <span class="eyebrow">AAJ KA GAANA · ${esc(r.native)}</span>
        <h1>${esc(t.title)}</h1>
        <p>${esc(t.artist)} · ${esc(t.lyrics[0]?.text || 'AT Music Original')}</p>
        <div class="hero-actions">
          <button class="btn-primary" data-q="hero" data-i="0">${icon('play', 22)} Play</button>
          <button class="btn-ghost" data-q="hero" data-i="0" data-open-np>Lyrics ke saath</button>
        </div>
      </div>
      <img class="hero-art" src="${cover}" alt="">
    </section>`;
  }

  function renderHome() {
    const secs = sectionsFor(state.hub);
    queues.clear();
    secs.forEach((s) => queues.set(s.id, s.tracks));
    document.documentElement.style.setProperty('--hub', regionById[state.hub].accent);
    const chips = [ALL, ...regions].map((r) =>
      `<button class="chip${state.hub === r.id ? ' active' : ''}" style="--accent:${r.accent}" data-hub="${r.id}">${r.id === 'all' ? r.name : `${esc(r.native)}&nbsp; ${esc(r.name)}`}</button>`).join('');
    main.innerHTML = `
      ${hero(secs)}
      <div class="chips">${chips}</div>
      ${secs.map((s) => `<section class="row">
        <div class="row-head"><div><h2>${esc(s.title)}</h2><p>${esc(s.subtitle)}</p></div></div>
        <div class="cards">${s.tracks.map((t, i) => card(t, s.id, i)).join('')}</div>
      </section>`).join('')}`;
  }

  function searchResults() {
    const q = state.query.trim().toLowerCase();
    if (!q) {
      return `<h2 style="margin:30px 0 0;font-size:22px">Bhasha se dhoondhiye</h2>
        <div class="tiles">${regions.map((r) => `<button class="tile" style="--accent:${r.accent}" data-hub="${r.id}"><b>${esc(r.native)}</b><span>${esc(r.name)}</span></button>`).join('')}</div>`;
    }
    const hits = tracks.filter((t) => {
      const r = regionById[t.region];
      return [t.title, t.artist, r.name, r.native, ...t.lyrics.map((l) => l.text)].some((s) => s.toLowerCase().includes(q));
    });
    return hits.length ? trackRows(hits, 'search') : `<p class="empty">"${esc(state.query)}" ke liye kuch nahi mila.</p>`;
  }

  function renderSearch() {
    queues.clear();
    document.documentElement.style.setProperty('--hub', ALL.accent);
    main.innerHTML = `
      <header class="page-head"><h1>Search</h1></header>
      <label class="search-box">${icon('search', 22)}<input id="q" type="search" placeholder="Gaana, artist, bhasha ya lyrics…" value="${esc(state.query)}" autocomplete="off"></label>
      <div id="results">${searchResults()}</div>`;
    const input = $('#q');
    input.addEventListener('input', () => { state.query = input.value; $('#results').innerHTML = searchResults(); });
    input.focus();
  }

  function renderLibrary() {
    queues.clear();
    document.documentElement.style.setProperty('--hub', '#7b2cff');
    const favs = tracks.filter((t) => state.favs.has(t.id));
    main.innerHTML = `
      <header class="page-head"><h1>Your Library</h1><p class="muted">${favs.length} pasandida gaane</p></header>
      ${favs.length ? trackRows(favs, 'library') : `<p class="empty">Abhi koi favourite nahi hai.<br>Kisi gaane ke ♡ par tap kijiye.</p>`}`;
  }

  function render() {
    $$('.nav-item[data-view]').forEach((b) => b.classList.toggle('active', b.dataset.view === state.view));
    ({ home: renderHome, search: renderSearch, library: renderLibrary })[state.view]();
    main.scrollTop = 0;
  }

  function markCurrent() {
    const id = current()?.id;
    $$('[data-track]').forEach((el) => el.classList.toggle('is-current', el.dataset.track === id));
  }

  // ---------- Now Playing + lyrics ----------
  function setNowPlayingOpen(open, lyricsFirst = false) {
    if (open && !current()) return;
    state.npOpen = open;
    npf.classList.toggle('open', open);
    npf.setAttribute('aria-hidden', String(!open));
    if (open) {
      npf.classList.toggle('show-lyrics', lyricsFirst);
      state.activeLine = -2;
      requestAnimationFrame(() => tick());
    }
  }

  function buildLyrics() {
    const t = current();
    state.activeLine = -2;
    lyrTrack.style.transform = 'translateY(0)';
    if (!t) { lyrTrack.innerHTML = ''; lyricEls = []; return; }
    lyrTrack.innerHTML = t.lyrics.length
      ? t.lyrics.map((l, i) => `<button class="lyr-line" data-line="${i}" data-ms="${l.t}">${esc(l.text)}</button>`).join('') +
        '<p class="lyr-note">Kisi bhi line par tap karke gaana wahin se suniye.</p>'
      : '<p class="lyr-empty">Is gaane ke lyrics jald aa rahe hain ✨</p>';
    lyricEls = $$('.lyr-line', lyrTrack);
  }

  function positionLyrics() {
    const el = lyricEls[state.activeLine];
    const target = el || lyricEls[0];
    if (!target) return;
    const y = target.offsetTop - lyrBox.clientHeight * 0.34 + target.offsetHeight / 2;
    lyrTrack.style.transform = `translateY(${-Math.max(0, y)}px)`;
  }

  function syncLyrics(ms) {
    const t = current();
    if (!t || !lyricEls.length) return;
    let idx = -1;
    for (let i = 0; i < t.lyrics.length; i++) if (t.lyrics[i].t <= ms) idx = i;
    if (idx !== state.activeLine) {
      state.activeLine = idx;
      lyricEls.forEach((el, i) => {
        el.classList.toggle('active', i === idx);
        el.classList.toggle('past', i < idx);
      });
      positionLyrics();
    }
    if (idx >= 0) {
      const start = t.lyrics[idx].t;
      const end = t.lyrics[idx + 1]?.t ?? start + lineGap;
      const p = Math.min(1, Math.max(0, (ms - start) / Math.max(1, end - start)));
      lyricEls[idx].style.setProperty('--p', `${(p * 112).toFixed(1)}%`);
    }
  }

  // ---------- Playback ----------
  function playQueue(list, i) {
    state.queue = list.slice();
    loadIndex(i);
  }

  function loadIndex(i) {
    state.index = i;
    const t = current();
    audio.src = t.streamUrl;
    audio.play().catch(() => { /* autoplay blocked until user gesture */ });
    updateNowPlaying();
    buildLyrics();
    markCurrent();
    setMediaSession(t);
    tick();
  }

  function next(auto = false) {
    if (!state.queue.length) return;
    if (auto && state.repeat === 'one') { audio.currentTime = 0; audio.play(); return; }
    let i;
    if (state.shuffle && state.queue.length > 1) {
      do { i = Math.floor(Math.random() * state.queue.length); } while (i === state.index);
    } else {
      i = state.index + 1;
    }
    if (i >= state.queue.length) {
      if (state.repeat !== 'all') { if (auto) { audio.pause(); audio.currentTime = 0; } return; }
      i = 0;
    }
    loadIndex(i);
  }

  function prev() {
    if (!state.queue.length) return;
    if (audio.currentTime > 3 || state.index === 0) { audio.currentTime = 0; tick(); return; }
    loadIndex(state.index - 1);
  }

  function togglePlay() {
    if (!current()) {
      const first = sectionsFor(state.hub)[0];
      if (first) playQueue(first.tracks, 0);
      return;
    }
    if (audio.paused) audio.play(); else audio.pause();
  }

  function toggleFav(id) {
    if (state.favs.has(id)) state.favs.delete(id); else state.favs.add(id);
    store.set('favs', [...state.favs]);
    const on = state.favs.has(id);
    $$(`[data-fav="${id}"]`).forEach((b) => { b.classList.toggle('on', on); b.innerHTML = icon(on ? 'heartFill' : 'heart', 20); });
    updateFavButtons();
    if (state.view === 'library') renderLibrary();
  }

  function updateFavButtons() {
    const t = current();
    const on = !!t && state.favs.has(t.id);
    $$('.fav-cur').forEach((b) => { b.classList.toggle('on', on); b.innerHTML = icon(on ? 'heartFill' : 'heart', 22); });
  }

  function updateNowPlaying() {
    const t = current();
    if (!t) return;
    const r = regionById[t.region];
    const cover = art(t);
    $('#np-art').src = cover;
    $('#np-title').textContent = t.title;
    $('#np-artist').textContent = `${t.artist} · ${r.native}`;
    $('#npf-art').src = cover;
    $('#npf-bg').src = cover;
    $('#npf-bg2').src = cover;
    $('#npf-title').textContent = t.title;
    $('#npf-artist').textContent = `${t.artist} · ${r.native} ${r.name}`;
    $('#npf-from').textContent = `${r.native} · ${r.name} Romance`;
    document.title = `${t.title} · AT Music`;
    updateFavButtons();
  }

  function updatePlayButtons() {
    const playing = !audio.paused;
    document.body.classList.toggle('is-playing', playing);
    $$('[data-cmd="play"]').forEach((b) => {
      b.innerHTML = icon(playing ? 'pause' : 'play', b.classList.contains('big') ? 36 : 24);
      b.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    });
  }

  function updateModeButtons() {
    $$('[data-cmd="shuffle"]').forEach((b) => b.classList.toggle('on', state.shuffle));
    $$('[data-cmd="repeat"]').forEach((b) => {
      b.classList.toggle('on', state.repeat !== 'off');
      b.innerHTML = icon(state.repeat === 'one' ? 'repeatOne' : 'repeat');
    });
  }

  function setRangeFill(input) {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--pct', pct + '%');
  }

  // One animation-frame loop drives the progress bars and the karaoke wipe.
  let raf = 0;
  function tick() {
    const d = audio.duration;
    const c = audio.currentTime;
    const frac = isFinite(d) && d > 0 ? c / d : 0;
    if (!seeking) {
      $$('.seek').forEach((s) => { s.value = Math.round(frac * 1000); setRangeFill(s); });
      $$('.t-cur').forEach((el) => { el.textContent = fmt(c); });
    }
    $$('.t-dur').forEach((el) => { el.textContent = fmt(d); });
    $('#mini-bar').style.width = frac * 100 + '%';
    syncLyrics(c * 1000);
  }
  function loop() { tick(); raf = audio.paused ? 0 : requestAnimationFrame(loop); }
  function startLoop() { if (!raf) raf = requestAnimationFrame(loop); }

  function setMediaSession(t) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t.title,
      artist: t.artist,
      album: 'AT Music',
      artwork: [{ src: art(t), sizes: '600x600' }],
    });
  }

  // ---------- Onboarding ----------
  function openOnboarding() {
    const el = $('#onboarding');
    const picked = new Set(state.langs || []);
    el.innerHTML = `<div class="ob">
      <span class="logo">AT</span>
      <h1 id="ob-title">Kis bhasha mein pyaar sunna hai?</h1>
      <p class="lead">Apni pasand ki bhashayein chuniye. Baad mein kabhi bhi badal sakte hain.</p>
      <div class="ob-grid">${regions.map((r) => `<button class="ob-tile${picked.has(r.id) ? ' on' : ''}" style="--accent:${r.accent}" data-pick="${r.id}" aria-pressed="${picked.has(r.id)}">
        <span class="tick">${icon('check', 22)}</span><b>${esc(r.native)}</b><span>${esc(r.name)}</span></button>`).join('')}</div>
      <button class="ob-go" ${picked.size ? '' : 'disabled'}>Shuru karein</button>
    </div>`;
    el.classList.remove('hidden');
    el.onclick = (e) => {
      const tile = e.target.closest('[data-pick]');
      if (tile) {
        const id = tile.dataset.pick;
        if (picked.has(id)) picked.delete(id); else picked.add(id);
        tile.classList.toggle('on', picked.has(id));
        tile.setAttribute('aria-pressed', picked.has(id));
        $('.ob-go', el).disabled = picked.size === 0;
        return;
      }
      if (e.target.closest('.ob-go') && picked.size) {
        state.langs = [...picked];
        store.set('langs', state.langs);
        el.classList.add('hidden');
        state.view = 'home';
        state.hub = 'all';
        render();
      }
    };
  }

  // ---------- Events ----------
  const COMMANDS = {
    play: togglePlay,
    next: () => next(),
    prev,
    shuffle: () => { state.shuffle = !state.shuffle; updateModeButtons(); },
    repeat: () => { state.repeat = { off: 'all', all: 'one', one: 'off' }[state.repeat]; updateModeButtons(); },
    fav: () => { const t = current(); if (t) toggleFav(t.id); },
    open: () => setNowPlayingOpen(true),
    'open-lyrics': () => setNowPlayingOpen(true, true),
    close: () => setNowPlayingOpen(false),
    'toggle-lyrics': () => { npf.classList.toggle('show-lyrics'); state.activeLine = -2; requestAnimationFrame(tick); },
  };

  function bind() {
    $$('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });

    document.addEventListener('click', (e) => {
      const fav = e.target.closest('[data-fav]');
      if (fav) { toggleFav(fav.dataset.fav); return; }

      const cmd = e.target.closest('[data-cmd]');
      if (cmd) { COMMANDS[cmd.dataset.cmd]?.(); return; }

      const hub = e.target.closest('[data-hub]');
      if (hub) { state.hub = hub.dataset.hub; state.view = 'home'; render(); return; }

      const play = e.target.closest('[data-q]');
      if (play) {
        const list = queues.get(play.dataset.q);
        if (list) {
          playQueue(list, Number(play.dataset.i));
          if (play.hasAttribute('data-open-np')) setNowPlayingOpen(true, true);
        }
        return;
      }

      const line = e.target.closest('[data-ms]');
      if (line) { audio.currentTime = Number(line.dataset.ms) / 1000; if (audio.paused) audio.play(); tick(); return; }

      const view = e.target.closest('[data-view]');
      if (view) { state.view = view.dataset.view; setNowPlayingOpen(false); render(); return; }

      if (e.target.closest('[data-action="languages"]')) openOnboarding();
    });

    document.addEventListener('keydown', (e) => {
      const el = document.activeElement;
      const typing = el && /^(INPUT|TEXTAREA)$/.test(el.tagName) && el.type !== 'range';
      if (e.code === 'Space' && !typing) { e.preventDefault(); togglePlay(); }
      if (e.key === 'Escape' && state.npOpen) setNowPlayingOpen(false);
      if (e.key === 'Enter' && el?.matches('.trow, .np')) el.click();
    });

    $$('.seek').forEach((s) => {
      s.addEventListener('input', () => {
        seeking = true;
        setRangeFill(s);
        if (isFinite(audio.duration)) $$('.t-cur').forEach((el) => { el.textContent = fmt((s.value / 1000) * audio.duration); });
      });
      s.addEventListener('change', () => {
        if (isFinite(audio.duration)) audio.currentTime = (s.value / 1000) * audio.duration;
        seeking = false;
        tick();
      });
    });

    volume.value = store.get('volume', 1);
    audio.volume = volume.value;
    setRangeFill(volume);
    volume.addEventListener('input', () => {
      audio.volume = volume.value;
      setRangeFill(volume);
      store.set('volume', Number(volume.value));
    });

    audio.addEventListener('play', () => { updatePlayButtons(); startLoop(); });
    audio.addEventListener('pause', () => { updatePlayButtons(); tick(); });
    audio.addEventListener('loadedmetadata', tick);
    audio.addEventListener('seeked', tick);
    audio.addEventListener('ended', () => next(true));
    window.addEventListener('resize', () => { if (state.npOpen) positionLyrics(); });

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('nexttrack', () => next());
      navigator.mediaSession.setActionHandler('previoustrack', prev);
    }
  }

  async function init() {
    bind();
    updatePlayButtons();
    updateModeButtons();
    try {
      await loadCatalog();
    } catch {
      main.innerHTML = '<p class="empty">Gaane load nahi ho paaye. Internet check karke page refresh kijiye.</p>';
      return;
    }
    render();
    if (!state.langs) openOnboarding();
  }

  init();
})();
