/* ============================================================
   懷念 — 播放邏輯
   純 JavaScript，無任何外部連線；可用 file:// 直接開啟
   ============================================================ */
(function () {
  "use strict";

  // ---------- 可調整的參數 ----------
  var SLIDE_MS = 6000;   // 每張停留時間
  var FADE_MS = 1500;    // 交叉淡入淡出時間（需與 style.css 的 transition 一致）
  var MUSIC_FADE_MS = 2000;  // 音樂淡入時間
  var END_BTN_MS = 4000;     // 「結束」按鈕顯示秒數
  var PHOTO_DIR = "picture/";
  var MUSIC_DIR = "music/";

  // ---------- DOM ----------
  var home = document.getElementById("home");
  var player = document.getElementById("player");
  var startBtn = document.getElementById("startBtn");
  var endBtn = document.getElementById("endBtn");
  var homeHint = document.getElementById("homeHint");
  var layers = [document.getElementById("layerA"), document.getElementById("layerB")];
  var bgm = document.getElementById("bgm");

  var photos = (typeof PHOTOS !== "undefined" && PHOTOS.length) ? PHOTOS : [];
  var tracks = (typeof MUSIC !== "undefined" && MUSIC.length) ? MUSIC : [];

  // ---------- 狀態 ----------
  var playing = false;
  var usingFullscreen = false;  // 這次播放是否成功進入全螢幕
  var photoIndex = 0;           // 下一張要顯示的相片索引
  var activeLayer = 0;          // 目前顯示中的圖層
  var slideTimer = null;
  var fadeTimer = null;
  var endBtnTimer = null;
  var preloaded = null;         // 預先載入的下一張 Image
  var trackIndex = 0;
  var session = 0;              // 每次開始 +1，用來忽略上一輪殘留的非同步回呼

  // ---------- 全螢幕相容處理 ----------
  var docEl = document.documentElement;
  var fsRequest = docEl.requestFullscreen || docEl.webkitRequestFullscreen ||
                  docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
  var fsExit = document.exitFullscreen || document.webkitExitFullscreen ||
               document.mozCancelFullScreen || document.msExitFullscreen;

  function fsElement() {
    return document.fullscreenElement || document.webkitFullscreenElement ||
           document.mozFullScreenElement || document.msFullscreenElement || null;
  }

  function fsSupported() {
    var enabled = document.fullscreenEnabled || document.webkitFullscreenEnabled ||
                  document.mozFullScreenEnabled || document.msFullscreenEnabled;
    return !!fsRequest && enabled !== false;
  }

  function requestFullscreen() {
    // 回傳 Promise；不支援時 reject
    return new Promise(function (resolve, reject) {
      if (!fsSupported()) { reject(new Error("fullscreen not supported")); return; }
      try {
        var p = fsRequest.call(docEl, { navigationUI: "hide" });
        if (p && typeof p.then === "function") {
          p.then(resolve, reject);
        } else {
          // 舊版 webkit 不回傳 Promise：稍後檢查是否真的進入全螢幕
          setTimeout(function () { fsElement() ? resolve() : reject(new Error("no fullscreen")); }, 300);
        }
      } catch (e) { reject(e); }
    });
  }

  function exitFullscreen() {
    if (fsElement() && fsExit) {
      try { var p = fsExit.call(document); if (p && p.catch) { p.catch(function () {}); } } catch (e) {}
    }
  }

  // ---------- 相片 ----------
  function photoUrl(name) { return PHOTO_DIR + encodeURIComponent(name); }

  function preload(index) {
    if (!photos.length) { return; }
    var img = new Image();
    img.decoding = "async";
    img.src = photoUrl(photos[index % photos.length]);
    preloaded = img;
  }

  function restartKenBurns(el) {
    el.classList.remove("kenburns");
    void el.offsetWidth; // 強制重排，讓動畫重新開始
    el.classList.add("kenburns");
  }

  function showNext() {
    if (!playing || !photos.length) { return; }
    var mySession = session;
    var name = photos[photoIndex % photos.length];
    var nextLayer = 1 - activeLayer;
    var el = layers[nextLayer];
    var src = photoUrl(name);

    // 準備下一張到隱藏的圖層上；等它解碼完成再淡入，避免閃白
    el.src = src;
    var ready = (el.decode ? el.decode().catch(function () {}) : Promise.resolve());
    ready.then(function () {
      if (!playing || mySession !== session) { return; }
      restartKenBurns(el);
      el.classList.add("visible");
      layers[activeLayer].classList.remove("visible");
      activeLayer = nextLayer;

      // 淡出結束後清掉舊圖層的 Ken Burns，避免下次瞬間跳動
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () {
        if (mySession !== session) { return; }
        layers[1 - activeLayer].classList.remove("kenburns");
      }, FADE_MS + 50);

      photoIndex = (photoIndex + 1) % photos.length;
      preload(photoIndex);

      clearTimeout(slideTimer);
      slideTimer = setTimeout(showNext, SLIDE_MS);
    });
  }

  function startSlides() {
    photoIndex = 0;
    activeLayer = 1;   // 讓第一張出現在 layerA
    layers.forEach(function (l) { l.classList.remove("visible", "kenburns"); l.removeAttribute("src"); });
    showNext();
  }

  function stopSlides() {
    clearTimeout(slideTimer); slideTimer = null;
    clearTimeout(fadeTimer); fadeTimer = null;
    preloaded = null;
    layers.forEach(function (l) {
      l.classList.remove("visible", "kenburns");
      l.removeAttribute("src");
    });
  }

  // ---------- 音樂 ----------
  var volumeTimer = null;

  function fadeInMusic() {
    clearInterval(volumeTimer);
    var steps = 20, i = 0;
    try { bgm.volume = 0; } catch (e) {}
    volumeTimer = setInterval(function () {
      i++;
      try { bgm.volume = Math.min(1, i / steps); } catch (e) {}
      if (i >= steps) { clearInterval(volumeTimer); volumeTimer = null; }
    }, MUSIC_FADE_MS / steps);
  }

  function loadTrack(index) {
    if (!tracks.length) { return; }
    trackIndex = index % tracks.length;
    bgm.src = MUSIC_DIR + encodeURIComponent(tracks[trackIndex]);
    bgm.load();
  }

  function startMusic() {
    if (!tracks.length) { return; }
    loadTrack(0);
    fadeInMusic();
    var p = bgm.play();
    if (p && p.catch) { p.catch(function () { /* 瀏覽器阻擋自動播放時靜音繼續播相片 */ }); }
  }

  function stopMusic() {
    clearInterval(volumeTimer); volumeTimer = null;
    try { bgm.pause(); bgm.currentTime = 0; } catch (e) {}
    bgm.removeAttribute("src");
    try { bgm.load(); } catch (e) {}
  }

  bgm.addEventListener("ended", function () {
    if (!playing) { return; }
    loadTrack(trackIndex + 1);      // 全部播完後 % 回到第一首
    try { bgm.volume = 1; } catch (e) {}
    var p = bgm.play();
    if (p && p.catch) { p.catch(function () {}); }
  });

  // ---------- 結束按鈕（手機／平板） ----------
  function showEndBtn() {
    if (!playing) { return; }
    endBtn.hidden = false;
    player.classList.add("show-cursor");
    // 下一個 frame 再加 class，讓淡入動畫生效
    requestAnimationFrame(function () { endBtn.classList.add("visible"); });
    clearTimeout(endBtnTimer);
    endBtnTimer = setTimeout(hideEndBtn, END_BTN_MS);
  }

  function hideEndBtn() {
    clearTimeout(endBtnTimer); endBtnTimer = null;
    endBtn.classList.remove("visible");
    player.classList.remove("show-cursor");
    setTimeout(function () { if (!endBtn.classList.contains("visible")) { endBtn.hidden = true; } }, 400);
  }

  // ---------- 開始／停止 ----------
  function enterPlayer() {
    playing = true;
    session++;
    home.hidden = true;
    player.hidden = false;
    hideEndBtn();
    startMusic();
    startSlides();
  }

  function start() {
    if (playing) { return; }
    if (!photos.length) {
      homeHint.textContent = "找不到相片：請先執行 resize_photos.py 產生 picture/ 與 photos.js";
      homeHint.hidden = false;
      return;
    }
    homeHint.hidden = true;

    // 注意：音樂播放與全螢幕都必須在使用者點擊的同一個事件中呼叫，
    // 否則瀏覽器會拒絕。因此先進入播放（含音樂），再嘗試全螢幕。
    enterPlayer();

    requestFullscreen().then(function () {
      usingFullscreen = true;
    }, function () {
      // 不支援全螢幕（例如 iPhone）：改以覆蓋整個視窗的方式播放
      usingFullscreen = false;
    });
  }

  function stop() {
    if (!playing) { return; }
    playing = false;
    session++;
    stopSlides();
    stopMusic();
    hideEndBtn();
    player.hidden = true;
    home.hidden = false;
    exitFullscreen();
    usingFullscreen = false;
    // 把焦點放回按鈕，方便用鍵盤／遙控器再次開始
    try { startBtn.focus({ preventScroll: true }); } catch (e) {}
  }

  // ---------- 事件 ----------
  startBtn.addEventListener("click", start);

  endBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    stop();
  });

  // 退出全螢幕（Esc、手勢、系統按鈕…）→ 一律停止並回首頁
  ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"]
    .forEach(function (evt) {
      document.addEventListener(evt, function () {
        if (playing && usingFullscreen && !fsElement()) { stop(); }
      });
    });

  // 沒有進入全螢幕時（例如全螢幕被拒絕），Esc 也要能停止
  document.addEventListener("keydown", function (e) {
    if (!playing) { return; }
    if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
      if (!usingFullscreen) { stop(); }
      // 有進入全螢幕時，瀏覽器會先退出全螢幕，由 fullscreenchange 處理
    }
  });

  // 點一下（或觸控）播放畫面 → 顯示「結束」按鈕，幾秒後自動隱藏
  player.addEventListener("pointerdown", function (e) {
    if (e.target === endBtn) { return; }
    if (endBtn.classList.contains("visible")) { hideEndBtn(); } else { showEndBtn(); }
  });
  // 較舊的瀏覽器沒有 pointer 事件時的備援
  if (!("PointerEvent" in window)) {
    player.addEventListener("click", function (e) {
      if (e.target === endBtn) { return; }
      if (endBtn.classList.contains("visible")) { hideEndBtn(); } else { showEndBtn(); }
    });
  }

  // 全螢幕中滑鼠移動時暫時顯示游標與結束按鈕（電腦、電視用滑鼠時較方便）
  var mouseTimer = null;
  player.addEventListener("mousemove", function () {
    if (!playing) { return; }
    player.classList.add("show-cursor");
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(function () {
      if (!endBtn.classList.contains("visible")) { player.classList.remove("show-cursor"); }
    }, 2500);
  });

  // 首頁預先載入第一張相片，讓按下開始後立即顯示
  if (photos.length) { preload(0); }
})();
