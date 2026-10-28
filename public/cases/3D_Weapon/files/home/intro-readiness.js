(function () {
  'use strict';

  var modelUrl;
  var ready = false;
  var pendingReveal;
  var timeout;
  var status;
  var originalSetPanelState = $axure.fn.SetPanelState;
  var originalLoadCurrentPage = $axure.loadCurrentPage;
  document.documentElement.classList.add('model-preloading');
  document.documentElement.dataset.modelState = 'loading';

  // Let Axure run the original intro. Hold only its final transition.
  $axure.fn.SetPanelState = function (stateNumber, options, showWhenSet) {
    if (Number(stateNumber) === 3 && this.getElementIds().indexOf('u0') !== -1) {
      var query = this;
      pendingReveal = function () {
        document.documentElement.classList.remove('model-preloading');
        originalSetPanelState.call(query, stateNumber, options, showWhenSet);
        document.documentElement.dataset.landingRevealed = 'true';
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
    // Axure reparents panel contents during transitions, which reloads iframes.
    // Keep the existing frame in a stable layer beneath the original artwork.
    var frameWidget = document.getElementById('u105');
    document.body.insertBefore(frameWidget, document.getElementById('base'));
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
          autospin: Number(url.searchParams.get('autospin')),
          success: function (api) {
            window.weaponModelApi = api;
            api.addEventListener('viewerready', function () {
              ready = true;
              clearTimeout(timeout);
              document.documentElement.dataset.modelState = 'ready';
              status.hidden = true;
              revealIfReady();
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
