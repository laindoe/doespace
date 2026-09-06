/* ---------------------------------------------------------------
   DoeSpace - small vanilla helpers.
   1. Back-to-top bubble
   2. Custom MySpace-style audio player
   --------------------------------------------------------------- */
(function () {
  'use strict';

  /* ---- Back to top ------------------------------------------- */

  var toTop = document.getElementById('back-to-top');

  if (toTop) {
    var SHOW_AFTER = 300;

    var syncToTop = function () {
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;
      toTop.hidden = scrolled < SHOW_AFTER;
    };

    window.addEventListener('scroll', syncToTop, { passive: true });
    window.addEventListener('resize', syncToTop, { passive: true });
    syncToTop();
  }

  /* ---- Copyright year ---------------------------------------- */

  // The template prints the build year, which goes stale if the site is
  // not rebuilt for a while. Correct it to the reader's current year.
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Audio player ------------------------------------------ */

  var player = document.querySelector('[data-player]');
  if (!player) { return; }

  var audio  = player.querySelector('[data-audio]');
  var play   = player.querySelector('[data-play]');
  var seek   = player.querySelector('[data-seek]');
  var time   = player.querySelector('[data-time]');

  if (!audio || !play || !seek || !time) { return; }

  var playLabel = play.getAttribute('aria-label') || 'Play';
  var pauseLabel = playLabel.replace(/^Play\b/, 'Pause');
  var scrubbing = false;
  var broken = false;

  var format = function (seconds) {
    if (!isFinite(seconds) || seconds < 0) { seconds = 0; }
    var m = Math.floor(seconds / 60);
    var s = Math.floor(seconds % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  };

  // Reflect the real element state; never show "playing" on our own guess.
  var syncPlayState = function () {
    var playing = !audio.paused && !audio.ended;
    player.classList.toggle('is-playing', playing);
    play.setAttribute('aria-pressed', playing ? 'true' : 'false');
    play.setAttribute('aria-label', playing ? pauseLabel : playLabel);
  };

  var paintProgress = function (current, duration) {
    var pct = (isFinite(duration) && duration > 0) ? (current / duration) * 100 : 0;
    seek.style.setProperty('--progress', Math.min(Math.max(pct, 0), 100) + '%');
  };

  var syncProgress = function () {
    if (scrubbing) { return; }
    var duration = audio.duration;
    if (isFinite(duration) && duration > 0) {
      seek.max = duration;
      seek.value = audio.currentTime;
      seek.setAttribute('aria-valuetext', format(audio.currentTime) + ' of ' + format(duration));
    }
    paintProgress(audio.currentTime, duration);
    time.textContent = format(audio.currentTime);
  };

  // No visible notice: the controls simply go inert, and the player never
  // claims to be playing.
  var fail = function () {
    broken = true;
    player.classList.remove('is-playing', 'is-loading');
    player.classList.add('is-broken');
    play.disabled = true;
    seek.disabled = true;
    play.setAttribute('aria-label', playLabel);
    play.setAttribute('aria-pressed', 'false');
    time.textContent = '00:00';
    seek.value = 0;
    paintProgress(0, 0);
  };

  audio.addEventListener('loadedmetadata', function () {
    if (broken) { return; }
    if (isFinite(audio.duration) && audio.duration > 0) {
      seek.max = audio.duration;
      seek.disabled = false;
    }
    syncProgress();
  });

  audio.addEventListener('timeupdate', syncProgress);
  audio.addEventListener('durationchange', syncProgress);

  audio.addEventListener('play', function () {
    player.classList.remove('is-loading');
    syncPlayState();
  });
  audio.addEventListener('pause', syncPlayState);

  audio.addEventListener('waiting', function () { player.classList.add('is-loading'); });
  audio.addEventListener('playing', function () { player.classList.remove('is-loading'); });

  audio.addEventListener('ended', function () {
    audio.currentTime = 0;
    seek.value = 0;
    time.textContent = format(0);
    syncPlayState();
  });

  audio.addEventListener('error', function () {
    fail();
  });

  // Seeking: input[type=range] gives pointer AND keyboard control for free.
  seek.addEventListener('input', function () {
    scrubbing = true;
    var target = parseFloat(seek.value) || 0;
    paintProgress(target, audio.duration);
    time.textContent = format(target);
  });

  var commitSeek = function () {
    if (!scrubbing) { return; }
    scrubbing = false;
    var target = parseFloat(seek.value);
    if (isFinite(target) && isFinite(audio.duration)) {
      audio.currentTime = Math.min(Math.max(target, 0), audio.duration);
    }
  };

  seek.addEventListener('change', commitSeek);
  seek.addEventListener('pointerup', commitSeek);

  play.addEventListener('click', function () {
    if (broken) { return; }

    if (audio.paused || audio.ended) {
      player.classList.add('is-loading');
      var started = audio.play();
      if (started && typeof started.catch === 'function') {
        started.catch(function () {
          // Autoplay block, decode failure or a missing file.
          player.classList.remove('is-loading');
          syncPlayState();
          if (audio.error) { fail(); }
        });
      }
    } else {
      audio.pause();
    }
  });

  // A source that never resolves (missing file) reports an error on the
  // <audio> element in some browsers and on the media resource in others.
  if (audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
    fail();
  }

  syncPlayState();
  syncProgress();
}());
