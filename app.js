'use strict';
(() => {
  const HOLD = 6000;
  const FADE = 1500;
  const home = document.getElementById('home');
  const player = document.getElementById('player');
  const startButton = document.getElementById('start');
  const silentButton = document.getElementById('start-silent');
  let musicEnabled = true;
  const stopButton = document.getElementById('stop');
  const controls = document.getElementById('controls');
  const audio = document.getElementById('audio');
  const retry = document.getElementById('audio-retry');
  const status = document.getElementById('play-status');
  const homeStatus = document.getElementById('home-status');
  const slides = [...document.querySelectorAll('.slide')];
  const photos = typeof PHOTOS !== 'undefined' ? PHOTOS : [];
  const music = typeof MUSIC !== 'undefined' ? MUSIC : [];
  let active = false, generation = 0, photoIndex = -1, slot = 0, track = 0;
  let timer, controlsTimer, fadeFrame, wakeLock;
  let enteredFullscreen = false, pendingPhoto;
  let context, gain, source;
  const url = (folder, name) => folder + '/' + encodeURIComponent(name);
  const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;

  document.getElementById('sacred-background').addEventListener('error', event => { event.target.hidden = true; });
  const portrait = document.getElementById('portrait');
  function portraitError() { portrait.hidden = true; document.getElementById('portrait-fallback').hidden = false; }
  portrait.addEventListener('error', portraitError);
  if (portrait.complete && !portrait.naturalWidth) portraitError();
  if (!photos.length) { startButton.disabled = true; silentButton.disabled = true; homeStatus.textContent = '尚未加入相片，請先執行 resize_photos.py。'; }
  audio.loop = music.length === 1;
  if (music.length) audio.src = url('music', music[0]);

  function loadPhoto(index) {
    return new Promise(resolve => {
      const image = new Image();
      let settled = false;
      const timeout = setTimeout(() => finish(false), 15000);
      function finish(ok) {
        if (settled) return;
        settled = true; clearTimeout(timeout);
        image.onload = image.onerror = null;
        resolve(ok ? { image, index } : null);
      }
      image.onload = async () => {
        try { if (image.decode) await image.decode(); } catch (_) {}
        finish(image.naturalWidth > 0);
      };
      image.onerror = () => finish(false);
      image.src = url('picture', photos[index]);
    });
  }
  async function findPhoto(index, token) {
    for (let offset = 0; offset < photos.length && active && generation === token; offset++) {
      const result = await loadPhoto((index + offset) % photos.length);
      if (result) return result;
    }
    return null;
  }
  async function showNext(token, first = false) {
    const result = await pendingPhoto;
    if (!active || generation !== token) return;
    if (!result) { stop('相片無法讀取，請確認 picture 資料夾與 photos.js。'); return; }
    const previous = slides[slot];
    slot = first ? 0 : 1 - slot;
    const next = slides[slot];
    next.src = result.image.src;
    next.alt = '追思相片 ' + (result.index + 1);
    next.style.transition = first ? 'none' : '';
    void next.offsetWidth;
    if (!first) { previous.style.transition = ''; previous.classList.remove('visible'); }
    next.classList.add('visible');
    photoIndex = result.index;
    player.dataset.photoIndex = String(photoIndex);
    status.textContent = !musicEnabled || music.length ? '' : '未加入音樂，正在播放相片。';
    pendingPhoto = findPhoto((photoIndex + 1) % photos.length, token);
    // 每張完全顯示 6 秒，再用 1.5 秒交叉淡化；第一次無需等待淡化。
    timer = setTimeout(() => showNext(token), HOLD + (first ? 0 : FADE));
  }
  function showControls() {
    if (!active) return;
    controls.hidden = false;
    clearTimeout(controlsTimer);
    controlsTimer = setTimeout(() => {
      controls.hidden = true;
      if (document.activeElement === stopButton) player.focus({ preventScroll: true });
    }, 4000);
  }
  function setupAudio() {
    if (context || source || window.location?.protocol === 'file:') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        context = new AudioContext();
        gain = context.createGain();
        source = context.createMediaElementSource(audio);
        source.connect(gain); gain.connect(context.destination);
      }
    } catch (_) { context = null; gain = null; }
  }
  function fadeIn() {
    cancelAnimationFrame(fadeFrame);
    if (gain && context && context.state === 'running') {
      const now = context.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1, now + 2);
      audio.volume = 1;
    } else {
      const began = performance.now();
      const step = now => {
        if (!active) return;
        audio.volume = Math.min(1, (now - began) / 2000);
        if (now - began < 2000) fadeFrame = requestAnimationFrame(step);
      };
      fadeFrame = requestAnimationFrame(step);
    }
  }
  function playMusic(fade = false) {
    if (!musicEnabled || !music.length || !active) return;
    const token = generation;
    // 在使用者的點擊處理中立即呼叫 play/resume，保留 Safari 的播放授權。
    if (fade) {
      setupAudio();
      if (gain) gain.gain.value = 0;
      else audio.volume = 0;
    }
    const resumed = context ? context.resume().catch(() => {}) : Promise.resolve();
    const playing = audio.play();
    Promise.all([resumed, playing]).then(() => {
      if (!active || generation !== token) return;
      retry.hidden = true;
      if (fade) fadeIn();
    }).catch(() => { if (active && generation === token) retry.hidden = false; });
  }
  async function requestWakeLock(token) {
    try {
      if (navigator.wakeLock) {
        const lock = await navigator.wakeLock.request('screen');
        if (!active || generation !== token) await lock.release();
        else wakeLock = lock;
      }
    } catch (_) {}
  }
  function start(withMusic = true) {
    if (active || !photos.length) return;
    musicEnabled = withMusic;
    audio.muted = !musicEnabled;
    retry.hidden = true;
    active = true; const token = ++generation;
    enteredFullscreen = false; photoIndex = -1; slot = 0;
    homeStatus.textContent = ''; status.textContent = '正在準備相片…';
    home.hidden = true; player.hidden = false; document.body.classList.add('playing');
    player.focus({ preventScroll: true });
    track = 0;
    if (musicEnabled && music.length) { audio.src = url('music', music[0]); playMusic(true); }
    const request = player.requestFullscreen || player.webkitRequestFullscreen;
    if (request) {
      try {
        const requested = request.call(player);
        if (requested && requested.catch) requested.catch(() => { if (active && generation === token) showControls(); });
      } catch (_) { showControls(); }
    }
    pendingPhoto = findPhoto(0, token);
    showNext(token, true); showControls(); requestWakeLock(token);
  }
  function stop(message = '') {
    if (!active) return;
    active = false; ++generation;
    clearTimeout(timer); clearTimeout(controlsTimer); cancelAnimationFrame(fadeFrame);
    audio.pause();
    try { audio.currentTime = 0; } catch (_) {}
    if (context) context.suspend().catch(() => {});
    if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
    slides.forEach(image => { image.style.transition = 'none'; image.classList.remove('visible'); image.removeAttribute('src'); });
    controls.hidden = true; retry.hidden = true;
    player.hidden = true; home.hidden = false; document.body.classList.remove('playing');
    homeStatus.textContent = message;
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (fullscreenElement() && exit) {
      try { const result = exit.call(document); if (result && result.catch) result.catch(() => {}); } catch (_) {}
    }
    enteredFullscreen = false;
    (musicEnabled ? startButton : silentButton).focus({ preventScroll: true });
  }
  function fullscreenChanged() {
    if (!active) return;
    if (fullscreenElement()) enteredFullscreen = true;
    else if (enteredFullscreen) stop();
  }
  document.addEventListener('fullscreenchange', fullscreenChanged);
  document.addEventListener('webkitfullscreenchange', fullscreenChanged);
  document.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape') stop();
    else if (event.key === 'Tab') showControls();
  });
  document.addEventListener('visibilitychange', () => {
    if (active && document.visibilityState === 'visible') requestWakeLock(generation);
  });
  audio.addEventListener('ended', () => {
    if (!active || !musicEnabled || !music.length) return;
    track = (track + 1) % music.length;
    audio.src = url('music', music[track]); playMusic();
  });
  audio.addEventListener('error', () => {
    if (active && musicEnabled) { status.textContent = '音樂無法讀取，請確認 music 資料夾。'; retry.hidden = false; }
  });
  retry.addEventListener('click', event => { event.stopPropagation(); playMusic(true); });
  startButton.addEventListener('click', () => start(true));
  silentButton.addEventListener('click', () => start(false));
  stopButton.addEventListener('click', event => { event.stopPropagation(); stop(); });
  player.addEventListener('pointerdown', showControls);
})();

