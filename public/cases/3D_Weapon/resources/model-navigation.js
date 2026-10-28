(function () {
  'use strict';
  var pages = ['home', 'ak', 'awp', 'knife', 'm4a1'];
  var pageName = location.pathname.split('/').pop().replace('.html', '');
  var baseUrl = new URL('.', location.href);
  var embedded = !!(window.frameElement && window.frameElement.classList.contains('weapon-page'));
  var modelUrl;
  var frameId;
  var links = {};
  var paths = {};
  var controller = embedded ? parent.weaponNavigation : createController();
  if (!embedded) window.weaponNavigation = controller;

  function targetPage(url) {
    if (!url) return null;
    var target = new URL(url, baseUrl);
    if (target.origin !== baseUrl.origin || new URL('.', target).href !== baseUrl.href) return null;
    var name = target.pathname.split('/').pop().replace('.html', '');
    return pages.indexOf(name) !== -1 ? name : null;
  }

  function walk(node, visit) {
    if (!node || typeof node !== 'object') return;
    visit(node);
    Object.keys(node).forEach(function (key) { walk(node[key], visit); });
  }

  var originalLoad = $axure.loadCurrentPage;
  $axure.loadCurrentPage = function (data) {
    function collectPaths(node) {
      Object.keys(node).forEach(function (id) {
        if (!node[id] || typeof node[id] !== 'object') return;
        if (node[id].scriptId) paths[id] = node[id].scriptId;
        collectPaths(node[id]);
      });
    }
    collectPaths(data.objectPaths);
    walk(data, function (node) {
      if (node.type === 'inlineFrame' && node.target && node.target.urlLiteral) {
        var url = node.target.urlLiteral.value;
        if (url.indexOf('https://sketchfab.com/models/') === 0) {
          modelUrl = url;
          frameId = paths[node.id] + '_input';
          if (pageName !== 'home') node.target.urlLiteral.value = '';
        }
      }
      if (node.interactionMap && node.interactionMap.onClick && paths[node.id]) {
        walk(node.interactionMap.onClick, function (action) {
          if (action.action === 'linkWindow' && action.target.targetType === 'page') {
            var target = targetPage(action.target.url);
            if (target) links[paths[node.id]] = target;
          }
        });
      }
      if (embedded && node.interactionMap) {
        // The host owns the original countdown; cached pages must not reset or multiply it.
        if (node.type === 'Axure:Master' && node.interactionMap.onLoad &&
            JSON.stringify(node.interactionMap.onLoad).indexOf('SecVar') !== -1) {
          delete node.interactionMap.onLoad;
        }
        if (node.label === 'sec' || node.label === 'min') delete node.interactionMap.onMove;
        // Re-entering Home uses the cached model without replaying the opening intro.
        if (pageName === 'home' && node.label === 'main' && node.interactionMap.onLoad) {
          var actions = node.interactionMap.onLoad.cases[0].actions;
          node.interactionMap.onLoad.cases[0].actions = [actions[actions.length - 1]];
        }
      }
    });
    return originalLoad.apply(this, arguments);
  };

  // Keep Axure's original actions, intercepting only local current-window navigation.
  $axure.internal(function (ax) {
    var navigate = ax.navigate;
    ax.navigate = $axure.navigate = function (to) {
      var url = typeof to === 'object' ? to.url : to;
      var target = targetPage(url);
      if (target && (typeof to !== 'object' || !to.target || to.target === 'current')) {
        controller.select(target, false);
        return;
      }
      return navigate.apply(this, arguments);
    };
  });

  function createController() {
    var entries = {};
    var active = pageName;
    var pending;
    var notice;
    var message;
    var retry;
    entries[pageName] = { view: window, title: document.title, ready: false };

    function status(text, failed) {
      if (!notice) return;
      notice.hidden = !text;
      message.textContent = text || '';
      retry.hidden = !failed;
    }

    function preload(name) {
      if (entries[name]) return entries[name];
      var frame = document.createElement('iframe');
      var entry = entries[name] = { frame: frame, ready: false };
      frame.className = 'weapon-page';
      frame.title = name.toUpperCase();
      frame.name = 'weapon-page-' + name;
      frame.setAttribute('allow', 'autoplay; fullscreen; xr-spatial-tracking');
      frame.setAttribute('aria-hidden', 'true');
      frame.inert = true;
      frame.tabIndex = -1;
      frame.src = new URL(name + '.html', baseUrl).href;
      document.body.appendChild(frame);
      entry.timer = setTimeout(function () {
        entry.error = true;
        if (pending && pending.name === name) status('Не удалось загрузить 3D. Попробуйте снова.', true);
      }, 35000);
      return entry;
    }

    function syncCountdown(entry) {
      if (!entry || !entry.view || entry.view === window) return;
      ['hour', 'min', 'sec'].forEach(function (label) {
        var source = document.querySelector('[data-label="' + label + '"] .text');
        var target = entry.view.document.querySelector('[data-label="' + label + '"] .text');
        if (source && target && source.textContent !== target.textContent) target.textContent = source.textContent;
      });
    }

    function setRendering(entry, enabled) {
      var api = entry.view && entry.view.weaponModelApi;
      if (api && entry.ready) {
        if (enabled) api.start();
        else api.stop();
      }
    }

    function activate() {
      if (!pending) return;
      var name = pending.name;
      var entry = entries[name];
      if (!entry.ready) return;
      setRendering(entries[active], false);
      Object.keys(entries).forEach(function (key) {
        var frame = entries[key].frame;
        if (!frame) return;
        var show = key === name;
        frame.classList.toggle('weapon-page-active', show);
        frame.inert = !show;
        frame.tabIndex = show ? 0 : -1;
        frame.setAttribute('aria-hidden', String(!show));
      });
      var showHost = name === pageName;
      document.documentElement.classList.toggle('weapon-host-inactive', !showHost);
      document.getElementById('base').inert = !showHost;
      var hostViewer = document.getElementById('u105');
      if (hostViewer && pageName === 'home') hostViewer.inert = !showHost;
      active = name;
      document.documentElement.dataset.activePage = name;
      document.documentElement.dataset.pendingPage = '';
      syncCountdown(entry);
      setRendering(entry, true);
      document.title = entry.title;
      window.scrollTo(0, 0);
      entry.view.scrollTo(0, 0);
      if (!pending.fromHistory) history.pushState({ weaponPage: name }, '', new URL(name + '.html', baseUrl));
      pending = null;
      status('', false);
    }

    function select(name, fromHistory) {
      if (name === active) {
        pending = null;
        document.documentElement.dataset.pendingPage = '';
        status('', false);
        return;
      }
      pending = { name: name, fromHistory: fromHistory };
      document.documentElement.dataset.pendingPage = name;
      var entry = preload(name);
      status(entry.error ? 'Не удалось загрузить 3D. Попробуйте снова.' : 'Загружаем 3D…', !!entry.error);
      activate();
    }

    function attach(name, view) {
      var entry = entries[name];
      entry.view = view;
      entry.title = view.document.title;
      function update() {
        if (entry !== entries[name]) return;
        var state = view.document.documentElement.dataset;
        var ready = state.modelState === 'ready' && (name !== 'home' || state.landingRevealed === 'true');
        if (ready && !entry.ready) {
          entry.ready = true;
          entry.error = false;
          clearTimeout(entry.timer);
          syncCountdown(entry);
          if (name !== active) setRendering(entry, false);
          else if (!pending) status('', false);
          activate();
        } else if (state.modelState === 'error' && !entry.ready) {
          entry.error = true;
          clearTimeout(entry.timer);
          if ((pending && pending.name === name) || (!pending && name === active && pageName !== 'home')) {
            status('Не удалось загрузить 3D. Попробуйте снова.', true);
          }
        }
      }
      new view.MutationObserver(update).observe(view.document.documentElement, { attributes: true });
      update();
    }

    document.addEventListener('DOMContentLoaded', function () {
      document.documentElement.dataset.activePage = active;
      history.scrollRestoration = 'manual';
      history.replaceState({ weaponPage: active }, '', location.href);
      notice = document.createElement('div');
      notice.className = 'weapon-navigation-status';
      notice.setAttribute('role', 'status');
      notice.hidden = true;
      message = document.createElement('span');
      retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Повторить загрузку';
      retry.addEventListener('click', function () {
        if (!pending) { window.location.reload(); return; }
        var name = pending.name;
        var entry = entries[name];
        clearTimeout(entry.timer);
        if (!entry.frame) { window.location.assign(new URL(name + '.html', baseUrl)); return; }
        entry.frame.remove();
        delete entries[name];
        preload(name);
        status('Загружаем 3D…', false);
      });
      notice.appendChild(message);
      notice.appendChild(retry);
      document.body.appendChild(notice);
      if (pageName !== 'home') status('Загружаем 3D…', false);
      setInterval(function () { syncCountdown(entries[active]); }, 250);
    });
    addEventListener('popstate', function (event) {
      var name = event.state && event.state.weaponPage || targetPage(location.href);
      if (name) select(name, true);
    });
    return { preload: preload, select: select, attach: attach };
  }

  function startModel() {
    document.documentElement.classList.add('model-preloading');
    document.documentElement.dataset.modelState = 'loading';
    var timer = setTimeout(fail, 30000);
    function fail() {
      clearTimeout(timer);
      document.documentElement.dataset.modelState = 'error';
    }
    var sdk = document.createElement('script');
    sdk.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    sdk.onerror = fail;
    sdk.onload = function () {
      try {
        var url = new URL(modelUrl);
        var client = new Sketchfab('1.12.1', document.getElementById(frameId));
        client.init(url.pathname.split('/')[2], {
          autostart: 1,
          autospin: Number(url.searchParams.get('autospin')),
          success: function (api) {
            window.weaponModelApi = api;
            api.addEventListener('viewerready', function () {
              clearTimeout(timer);
              document.documentElement.classList.remove('model-preloading');
              document.documentElement.dataset.modelState = 'ready';
            });
            api.start();
          },
          error: fail
        });
      } catch (error) { fail(); }
    };
    document.head.appendChild(sdk);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      controller.attach(pageName, window);
      Object.keys(links).forEach(function (id) {
        var element = document.getElementById(id);
        if (!element) return;
        element.dataset.modelPage = links[id];
        element.setAttribute('role', 'link');
        element.setAttribute('aria-label', links[id].toUpperCase());
        element.tabIndex = 0;
        element.addEventListener('pointerenter', function () { controller.preload(links[id]); });
        element.addEventListener('focus', function () { controller.preload(links[id]); });
        element.addEventListener('keydown', function (event) {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          event.stopImmediatePropagation();
          controller.select(links[id], false);
        }, true);
      });
      if (pageName !== 'home') startModel();
    }, 0);
  });
}());
