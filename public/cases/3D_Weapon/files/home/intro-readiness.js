(function () {
  'use strict';

  var modelUrl;
  var loaders = [];
  var ready = false;
  var pendingReveal;
  var timeout;
  var status;
  var originalSetPanelState = $axure.fn.SetPanelState;
  var originalLoadCurrentPage = $axure.loadCurrentPage;
  document.documentElement.classList.add('model-preloading');
  document.documentElement.dataset.modelState = 'loading';

  // A gentle acceleration, steady cruise, then a soft stop for the words only.
  $.easing.easeWeaponIntroCruise = function (progress) {
    var ramp = 0.2;
    var speed = 1 / (1 - ramp);
    function accelerate(t) {
      return speed * (t / 2 - ramp * Math.sin(Math.PI * t / ramp) / (2 * Math.PI));
    }
    if (progress < ramp) return accelerate(progress);
    if (progress > 1 - ramp) return 1 - accelerate(1 - progress);
    return speed * (progress - ramp / 2);
  };

  // Reveal the phrase in the same tick as its animated move, not when the panel opens.
  $axure.internal(function (ax) {
    var moveWidget = ax.move.MoveWidget;
    ax.move.MoveWidget = function (id, x, y, options) {
      if (id === 'u100' && options && options.easing === 'easeWeaponIntroCruise' && options.duration > 0) {
        var finishLine = followPhraseEdge(options.duration, Math.abs(Number(x)));
        var complete = arguments[5];
        arguments[5] = function () {
          finishLine();
          if (complete) return complete.apply(this, arguments);
        };
        document.documentElement.classList.add('intro-phrase-moving');
      }
      return moveWidget.apply(this, arguments);
    };
  });

  function followPhraseEdge(duration, distance) {
    var phrase = document.getElementById('u100');
    var line = document.getElementById('u65');
    var previousStep = $.fx.step.left;
    var stepLeft = previousStep || $.fx.step._default;
    var following = true;
    var cruiseSpeed = distance / (duration * 0.8);
    line.style.transition = 'opacity 180ms ease-out';
    function align() {
      var scale = phrase.getBoundingClientRect().width / phrase.offsetWidth || 1;
      var edge = (phrase.getBoundingClientRect().right - line.getBoundingClientRect().left) / scale;
      line.style.transform = 'translateZ(0) scaleX(' + Math.max(0, Math.min(1, edge / line.offsetWidth)) + ')';
    }
    function release() {
      if (!following) return;
      following = false;
      if (previousStep) $.fx.step.left = previousStep;
      else delete $.fx.step.left;
      align();
      var scale = phrase.getBoundingClientRect().width / phrase.offsetWidth || 1;
      var remaining = line.offsetWidth - line.getBoundingClientRect().width / scale;
      line.style.transition = 'opacity 180ms ease-out, transform ' + (remaining / cruiseSpeed) + 'ms linear';
      line.style.transform = 'translateZ(0) scaleX(1)';
    }
    // Share each animation step until the words brake; the line then keeps cruise speed.
    $.fx.step.left = function (fx) {
      stepLeft(fx);
      if (following && fx.elem === phrase) {
        align();
        if (fx.state >= 0.8) release();
      }
    };
    align();
    return release;
  }

  // Let Axure run the original intro. Hold only its final transition.
  $axure.fn.SetPanelState = function (stateNumber, options, showWhenSet) {
    if (Number(stateNumber) === 3 && this.getElementIds().indexOf('u0') !== -1) {
      var query = this;
      pendingReveal = function () {
        var root = document.documentElement;
        root.classList.add('landing-entering');
        // Paint the header/footer at zero opacity before starting their crossfade.
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          root.classList.remove('model-preloading');
          originalSetPanelState.call(query, stateNumber, options, showWhenSet);
          root.dataset.landingRevealed = 'true';
          setTimeout(function () { root.classList.remove('landing-entering'); }, 1300);
        }); });
      };
      document.documentElement.dataset.introComplete = 'true';
      revealIfReady();
      return this;
    }
    return originalSetPanelState.apply(this, arguments);
  };

  // The Viewer API owns this iframe; prevent Axure from loading it a second time.
  $axure.loadCurrentPage = function (data) {
    function visit(node) {
      if (!node || typeof node !== 'object') return;
      if (node.label === 'choose 1920' && node.interactionMap.onLoad) {
        node.interactionMap.onLoad.cases.forEach(function (introCase) {
          introCase.actions.forEach(function (action) {
            (action.objectsToMoves || []).forEach(function (move) {
              var motion = move.moveInfo.options;
              if (motion && motion.easing === 'easeOutBounce') {
                motion.easing = 'easeWeaponIntroCruise';
                motion.duration = 1100;
              }
            });
          });
        });
      }
      if (node.label === 'main' && node.interactionMap.onLoad) {
        node.interactionMap.onLoad.cases.forEach(function (introCase) {
          introCase.actions.forEach(function (action) {
            (action.panelsToStates || []).forEach(function (panel) {
              if (panel.stateInfo.stateNumber !== 3) return;
              panel.stateInfo.options.animateOut = { easing: 'fade', duration: 1200 };
              panel.stateInfo.options.animateIn = { easing: 'fade', duration: 1200 };
            });
          });
        });
      }
      if (node.label === 'Loader' && node.interactionMap) {
        loaders.push({ id: data.objectPaths[node.id].scriptId, count: node.diagrams.length, index: 0, active: false });
        delete node.interactionMap.onLoad;
        delete node.interactionMap.onMove;
      }
      if (node.type === 'inlineFrame' && node.target && node.target.urlLiteral) {
        var url = node.target.urlLiteral.value;
        if (url.indexOf('https://sketchfab.com/models/') === 0) {
          modelUrl = url;
          node.target.urlLiteral.value = '';
        }
      }
      Object.keys(node).forEach(function (key) { visit(node[key]); });
    }
    visit(data);
    return originalLoadCurrentPage.apply(this, arguments);
  };

  // One clock per intro, with the same left-to-right cycle in both Loader instances.
  function startLoaders() {
    var axRuntime;
    $axure.internal(function (ax) { axRuntime = ax; });
    var transition = {
      compress: false,
      animateOut: { easing: 'fade', duration: 100 },
      animateIn: { easing: 'fade', duration: 100 }
    };
    function tick() {
      var mainState = axRuntime.visibility.GetPanelState('u0');
      var paused = document.hidden || document.documentElement.dataset.landingRevealed === 'true' ||
        document.documentElement.classList.contains('weapon-host-inactive') ||
        (window.frameElement && window.frameElement.getAttribute('aria-hidden') === 'true');
      loaders.forEach(function (loader) {
        var element = document.getElementById(loader.id);
        var panel = element.closest('#u0_state0, #u0_state1');
        var active = !paused && panel && panel.id === mainState;
        if (!active) { loader.active = false; return; }
        loader.index = loader.active ? (loader.index + 1) % loader.count : 0;
        loader.active = true;
        originalSetPanelState.call($axure('#' + loader.id), loader.index + 1, transition, false);
      });
    }
    tick();
    setInterval(tick, 400);
  }

  function revealIfReady() {
    if (!ready || !pendingReveal) return;
    status.hidden = true;
    var reveal = pendingReveal;
    pendingReveal = null;
    reveal();
  }

  function fail(message) {
    if (ready) return;
    clearTimeout(timeout);
    document.documentElement.dataset.modelState = 'error';
    status.querySelector('p').textContent = message;
    status.hidden = false;
  }

  function start() {
    startLoaders();
    // Axure reparents panel contents during transitions, which reloads iframes.
    // Keep the existing frame in a stable layer beneath the original artwork.
    var frameWidget = document.getElementById('u105');
    if (frameWidget.parentNode !== document.body) document.body.insertBefore(frameWidget, document.getElementById('base'));
    status = document.createElement('div');
    status.className = 'model-loading-status';
    status.hidden = true;
    status.setAttribute('role', 'status');
    var message = document.createElement('p');
    var retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Повторить загрузку';
    retry.addEventListener('click', function () { window.location.reload(); });
    status.appendChild(message);
    status.appendChild(retry);
    document.body.appendChild(status);
    if (window.weaponLayout) window.weaponLayout.decorateLoadingStatus(status);

    timeout = setTimeout(function () {
      fail('Загрузка 3D занимает слишком много времени. Проверьте подключение и попробуйте снова.');
    }, 30000);

    var sdk = document.createElement('script');
    sdk.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    sdk.onerror = function () { fail('Не удалось загрузить 3D. Попробуйте снова.'); };
    sdk.onload = function () {
      try {
        var url = new URL(modelUrl);
        var client = new Sketchfab('1.12.1', document.getElementById('u105_input'));
        client.init(url.pathname.split('/')[2], {
          autostart: 1,
          camera: 0,
          ui_hint: 0,
          scrollwheel: window.weaponPortfolioEmbed ? 0 : 1,
          autospin: Number(url.searchParams.get('autospin')),
          success: function (api) {
            window.weaponModelApi = api;
            api.addEventListener('viewerready', function () {
              function finishModel() {
                ready = true;
                clearTimeout(timeout);
                document.documentElement.dataset.modelState = 'ready';
                status.hidden = true;
                revealIfReady();
              }
              if (window.weaponLayout) window.weaponLayout.prepareModel(api, finishModel);
              else finishModel();
            });
            api.start();
          },
          error: function () { fail('Не удалось загрузить 3D. Попробуйте снова.'); }
        });
      } catch (error) {
        fail('Не удалось загрузить 3D. Попробуйте снова.');
      }
    };
    document.head.appendChild(sdk);
  }

  document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 0); });
}());
