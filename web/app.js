(() => {
  'use strict';

  const ALL = { id: 'all', name: 'All India', native: 'भारत', accent: '#ff2d6f' };

  const ICON_PATHS = {
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    library: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z',
    translate: 'M12.87 15.07l-2.54-2.51.03-.03A17.5 17.5 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
    play: 'M8 5v14l11-7z',
    pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
    next: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
    prev: 'M6 6h2v12H6zm3.5 6l8.5 6V6z',
    shuffle: 'M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z',
    repeat: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z',
    repeatOne: 'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z',
    heart: 'M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z',
    heartFill: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    mic: 'M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z',
    volume: 'M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
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
    lyricsOpen: false,
    activeLine: -1,
    favs: new Set(store.get('favs', [])),
    langs: store.get('langs', null),
  };

  let regions = [];
  let regionById = {};
  let tracks = [];
  let trackById = {};
  let playlists = [];
  const queues = new Map();

  const audio = $('#audio');
  const main = $('#main');
  const lyricsEl = $('#lyrics');
  const seek = $('#seek');
  const volume = $('#volume');
  let seeking = false;

  // ---------- Catalog ----------
  async function loadCatalog() {
    const res = await fetch('catalog.json', { cache: 'no-cache' });
    const data = await res.json();
    const gap = data.lyricLineGapMs || 7000;
    regions = data.regions;
    regionById = Object.fromEntries([ALL, ...regions].map((r) => [r.id, r]));
    tracks = data.tracks.map((t) => ({
      ...t,
      lyrics: (t.lyrics || []).map((line, i) => (typeof line === 'string' ? { t: i * gap, text: line } : line)),
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

  // ---------- Rendering ----------
  function card(track, queueId, i) {
    const r = regionById[track.region];
    const cur = current()?.id === track.id;
    return `<button class="card${cur ? ' is-current' : ''}" data-track="${track.id}" data-q="${queueId}" data-i="${i}">
      <div class="art">
        <img loading="lazy" src="${esc(track.artworkUrl)}" alt="" onerror="this.style.visibility='hidden'">
        <span class="badge" style="background:${r.accent}">${esc(r.native)}</span>
        <span class="play-fab">${icon('play', 26)}</span>
      </div>
      <div class="card-title">${esc(track.title)}</div>
      <div class="card-sub">${esc(track.artist)}</div>
    </button>`;
  }

  function trackRows(list, queueId) {
    queues.set(queueId, list);
    return `<div class="tracklist">${list.map((t, i) => {
      const r = regionById[t.region];
      const fav = state.favs.has(t.id);
      return `<div class="trow${current()?.id === t.id ? ' is-current' : ''}" data-track="${t.id}" data-q="${queueId}" data-i="${i}" role="button" tabindex="0">
        <span class="num">${i + 1}</span>
        <img loading="lazy" src="${esc(t.artworkUrl)}" alt="" onerror="this.style.visibility='hidden'">
        <div><div class="tt">${esc(t.title)}</div><div class="ta">${esc(t.artist)}</div></div>
        <span class="tr">${esc(r.native)} · ${esc(r.name)}</span>
        <button class="fav-btn${fav ? ' on' : ''}" data-fav="${t.id}" aria-label="Favourite">${icon(fav ? 'heartFill' : 'heart', 20)}</button>
      </div>`;
    }).join('')}</div>`;
  }

  function renderHome() {
    const secs = sectionsFor(state.hub);
    queues.clear();
    secs.forEach((s) => queues.set(s.id, s.tracks));
    const chips = [ALL, ...regions].map((r) =>
      `<button class="chip${state.hub === r.id ? ' active' : ''}" style="--accent:${r.accent}" data-hub="${r.id}">${r.id === 'all' ? r.name : `${esc(r.native)}&nbsp; ${esc(r.name)}`}</button>`).join('');
    main.innerHTML = `
      <header class="page-head"><h1 class="brand-title">AT Music</h1><p class="muted">Pyaar ke gaane, poore Bharat se</p></header>
      <div class="chips">${chips}</div>
      ${secs.map((s) => `<section class="row"><h2>${esc(s.title)}</h2><p class="muted">${esc(s.subtitle)}</p>
        <div class="cards">${s.tracks.map((t, i) => card(t, s.id, i)).join('')}</div></section>`).join('')}`;
  }

  function searchResults() {
    const q = state.query.trim().toLowerCase();
    if (!q) {
      return `<h2 style="margin:28px 0 0">Bhasha se dhoondhiye</h2>
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
    const favs = tracks.filter((t) => state.favs.has(t.id));
    main.innerHTML = `
      <header class="page-head"><h1>Your Library</h1><p class="muted">${favs.length} pasandida gaane</p></header>
      ${favs.length ? trackRows(favs, 'library') : `<p class="empty">Abhi koi favourite nahi hai.<br>Kisi gaane par ${icon('heart', 16).replace('<svg', '<svg style="display:inline;vertical-align:-3px"')} dabaiye.</p>`}`;
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

  // ---------- Lyrics ----------
  function renderLyrics() {
    const t = current();
    state.activeLine = -1;
    if (!t) {
      lyricsEl.innerHTML = `<div class="lyr-head"><div class="grow"><div class="t">Lyrics</div></div>
        <button class="lyr-close" data-action="close-lyrics" aria-label="Band kijiye">${icon('close', 22)}</button></div>
        <p class="lyr-note">Pehle koi gaana chalaiye.</p>`;
      return;
    }
    const r = regionById[t.region];
    lyricsEl.style.setProperty('--accent', r.accent);
    lyricsEl.innerHTML = `
      <div class="lyr-head">
        <img src="${esc(t.artworkUrl)}" alt="">
        <div class="grow"><div class="t">${esc(t.title)}</div><div class="a">${esc(t.artist)}</div></div>
        <button class="lyr-close" data-action="close-lyrics" aria-label="Band kijiye">${icon('close', 22)}</button>
      </div>
      <div class="lyr-from">PLAYING FROM · ${esc(r.native)} ${esc(r.name).toUpperCase()}</div>
      <div class="lyr-lines">${t.lyrics.map((l, i) => `<button class="lyr-line" data-line="${i}" data-ms="${l.t}">${esc(l.text)}</button>`).join('')}</div>
      <p class="lyr-note">Kisi line par tap karke wahan pahunchiye.</p>`;
    syncLyrics();
  }

  function syncLyrics() {
    const t = current();
    if (!t || !t.lyrics.length) return;
    const ms = audio.currentTime * 1000;
    let idx = -1;
    for (let i = 0; i < t.lyrics.length; i++) if (t.lyrics[i].t <= ms) idx = i;
    if (idx === state.activeLine) return;
    state.activeLine = idx;
    $$('.lyr-line', lyricsEl).forEach((el, i) => {
      el.classList.toggle('active', i === idx);
      el.classList.toggle('past', i < idx);
    });
    if (state.lyricsOpen && idx >= 0) {
      $(`.lyr-line[data-line="${idx}"]`, lyricsEl)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function setLyricsOpen(open) {
    state.lyricsOpen = open;
    lyricsEl.classList.toggle('hidden', !open);
    $('#btn-lyrics').classList.toggle('on', open);
    if (open) { state.activeLine = -1; syncLyrics(); }
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
    renderLyrics();
    markCurrent();
    setMediaSession(t);
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
    if (audio.currentTime > 3 || state.index === 0) { audio.currentTime = 0; return; }
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
    $$(`[data-fav="${id}"]`).forEach((b) => {
      const on = state.favs.has(id);
      b.classList.toggle('on', on);
      b.innerHTML = icon(on ? 'heartFill' : 'heart', 20);
    });
    updateFavButton();
    if (state.view === 'library') renderLibrary();
  }

  function updateFavButton() {
    const t = current();
    const on = !!t && state.favs.has(t.id);
    const b = $('#np-fav');
    b.classList.toggle('on', on);
    b.innerHTML = icon(on ? 'heartFill' : 'heart', 20);
  }

  function updateNowPlaying() {
    const t = current();
    if (!t) return;
    $('#np-art').src = t.artworkUrl;
    $('#np-title').textContent = t.title;
    $('#np-artist').textContent = `${t.artist} · ${regionById[t.region].native}`;
    document.title = `${t.title} · AT Music`;
    updateFavButton();
  }

  function updatePlayButton() {
    const playing = !audio.paused;
    $('#btn-play').innerHTML = icon(playing ? 'pause' : 'play', 24);
    $('#btn-play').setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }

  function setRangeFill(input) {
    const pct = ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty('--pct', pct + '%');
  }

  function updateProgress() {
    const d = audio.duration;
    const c = audio.currentTime;
    const frac = isFinite(d) && d > 0 ? c / d : 0;
    if (!seeking) {
      seek.value = Math.round(frac * 1000);
      setRangeFill(seek);
      $('#t-cur').textContent = fmt(c);
    }
    $('#t-dur').textContent = fmt(d);
    $('#mini-bar').style.width = frac * 100 + '%';
    syncLyrics();
  }

  function setMediaSession(t) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: t.title,
      artist: t.artist,
      album: 'AT Music',
      artwork: [{ src: t.artworkUrl, sizes: '600x600', type: 'image/jpeg' }],
    });
  }

  // ---------- Onboarding ----------
  function openOnboarding() {
    const el = $('#onboarding');
    let picked = new Set(state.langs || []);
    el.innerHTML = `<div class="ob">
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
  function bind() {
    $$('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });

    document.addEventListener('click', (e) => {
      const fav = e.target.closest('[data-fav]');
      if (fav) { toggleFav(fav.dataset.fav); return; }

      const hub = e.target.closest('[data-hub]');
      if (hub) { state.hub = hub.dataset.hub; state.view = 'home'; render(); return; }

      const play = e.target.closest('[data-q]');
      if (play) {
        const list = queues.get(play.dataset.q);
        if (list) playQueue(list, Number(play.dataset.i));
        return;
      }

      const line = e.target.closest('[data-ms]');
      if (line) { audio.currentTime = Number(line.dataset.ms) / 1000; if (audio.paused) audio.play(); return; }

      const view = e.target.closest('[data-view]');
      if (view) { state.view = view.dataset.view; setLyricsOpen(false); render(); return; }

      const action = e.target.closest('[data-action]');
      if (action?.dataset.action === 'languages') openOnboarding();
      if (action?.dataset.action === 'close-lyrics') setLyricsOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName) && document.activeElement.type !== 'range';
      if (e.code === 'Space' && !typing) { e.preventDefault(); togglePlay(); }
      if (e.key === 'Enter' && document.activeElement?.matches('.trow')) document.activeElement.click();
    });

    $('#btn-play').addEventListener('click', togglePlay);
    $('#btn-next').addEventListener('click', () => next());
    $('#btn-prev').addEventListener('click', prev);
    $('#btn-shuffle').addEventListener('click', (e) => {
      state.shuffle = !state.shuffle;
      e.currentTarget.classList.toggle('on', state.shuffle);
    });
    $('#btn-repeat').addEventListener('click', (e) => {
      state.repeat = { off: 'all', all: 'one', one: 'off' }[state.repeat];
      e.currentTarget.classList.toggle('on', state.repeat !== 'off');
      e.currentTarget.innerHTML = icon(state.repeat === 'one' ? 'repeatOne' : 'repeat');
    });
    $('#btn-lyrics').addEventListener('click', () => setLyricsOpen(!state.lyricsOpen));
    $('#np').addEventListener('click', (e) => { if (!e.target.closest('#np-fav')) setLyricsOpen(!state.lyricsOpen); });
    $('#np-fav').addEventListener('click', () => { const t = current(); if (t) toggleFav(t.id); });

    seek.addEventListener('input', () => {
      seeking = true;
      setRangeFill(seek);
      if (isFinite(audio.duration)) $('#t-cur').textContent = fmt((seek.value / 1000) * audio.duration);
    });
    seek.addEventListener('change', () => {
      if (isFinite(audio.duration)) audio.currentTime = (seek.value / 1000) * audio.duration;
      seeking = false;
    });

    volume.value = store.get('volume', 1);
    audio.volume = volume.value;
    setRangeFill(volume);
    volume.addEventListener('input', () => {
      audio.volume = volume.value;
      setRangeFill(volume);
      store.set('volume', Number(volume.value));
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('play', updatePlayButton);
    audio.addEventListener('pause', updatePlayButton);
    audio.addEventListener('ended', () => next(true));

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('nexttrack', () => next());
      navigator.mediaSession.setActionHandler('previoustrack', prev);
    }
  }

  async function init() {
    bind();
    updatePlayButton();
    try {
      await loadCatalog();
    } catch {
      main.innerHTML = '<p class="empty">Gaane load nahi ho paaye. Internet check karke page refresh kijiye.</p>';
      return;
    }
    render();
    renderLyrics();
    if (!state.langs) openOnboarding();
  }

  init();
})();
