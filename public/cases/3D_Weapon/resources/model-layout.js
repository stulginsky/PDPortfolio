(function () {
  'use strict';
  var page = location.pathname.split('/').pop().replace('.html', '');
  var paths = {};
  var art = [];
  var titleArt;
  var frameId;
  var navArt = {};
  var scene;
  var api;
  var prepared = false;
  var textureProgress = null;
  var modelSettled;
  function interactionHost() {
    try { if (parent !== window && parent.weaponNavigation) return parent; } catch (error) {}
    return window;
  }
  function syncInteractionHint() {
    if (interactionHost().document.documentElement.dataset.weaponInteracted === 'true') document.documentElement.dataset.weaponInteracted = 'true';
  }
  function markModelInteracted() {
    var host = interactionHost();
    var alreadyInteracted = host.document.documentElement.dataset.weaponInteracted === 'true';
    document.documentElement.dataset.weaponInteracted = 'true';
    if (alreadyInteracted) return;
    host.document.documentElement.dataset.weaponInteracted = 'true';
    host.dispatchEvent(new Event('weapon-model-interacted'));
  }
  syncInteractionHint();
  interactionHost().addEventListener('weapon-model-interacted', syncInteractionHint);
  function trackModel(viewerApi) {
    viewerApi.addEventListener('camerastart', function () {
      var frame = document.querySelector('.weapon-viewer-frame');
      if (document.documentElement.dataset.modelState === 'ready' && frame && document.activeElement === frame) markModelInteracted();
    });
    viewerApi.addEventListener('textureLoadProgress', function (factor) {
      textureProgress = factor;
      if (modelSettled) modelSettled();
    });
  }
  var originalLoad = $axure.loadCurrentPage;
  function walk(value, callback) {
    if (!value || typeof value !== 'object') return;
    callback(value);
    Object.keys(value).forEach(function (key) { walk(value[key], callback); });
  }
  $axure.loadCurrentPage = function (data) {
    function collect(value) {
      Object.keys(value).forEach(function (id) {
        if (!value[id] || typeof value[id] !== 'object') return;
        if (value[id].scriptId) paths[id] = value[id].scriptId;
        collect(value[id]);
      });
    }
    collect(data.objectPaths);
    walk(data, function (node) {
      var id = paths[node.id];
      if (!id) return;
      if (node.type === 'inlineFrame') frameId = id;
      var image = node.images && node.images['normal~'];
      if (image && node.style && node.style.size) {
        var record = { id: id, src: image, width: node.style.size.width, height: node.style.size.height, sourceY: node.style.location && node.style.location.y, label: node.label };
        art.push(record);
        if (record.height >= 87 && record.height <= 94 && node.style.location && node.style.location.y >= 699 && node.style.location.y <= 706) titleArt = record;
        if (node.interactionMap && node.interactionMap.onClick) {
          walk(node.interactionMap.onClick, function (action) {
            if (action.action === 'linkWindow' && action.target && action.target.targetType === 'page') {
              var target = action.target.url.replace('.html', '');
              navArt[target] = { src: image, hover: node.images['mouseOver~'] || image };
            }
          });
        }
      }
    });
    return originalLoad.apply(this, arguments);
  };

  function image(src, className) {
    var element = document.createElement('img');
    element.src = src;
    element.alt = '';
    if (className) element.className = className;
    element.draggable = false;
    return element;
  }
  function div(className, parent) {
    var element = document.createElement('div');
    element.className = className;
    if (parent) parent.appendChild(element);
    return element;
  }
  function navigation() { return window.weaponNavigation || parent.weaponNavigation; }
  function addButtonSkin(button, skin, folder, prefix) {
    var layer = div('weapon-button-art', button);
    layer.dataset.skin = skin;
    var root = 'images/buttons/' + folder + '/';
    // Composite at integer source pixels before any ancestor scaling. Separate
    // DOM slices otherwise interpolate against transparency and expose pale seams.
    var canvas = document.createElement('canvas');
    canvas.className = 'weapon-button-composite';
    layer.appendChild(canvas);
    var pieces = {};
    var loaded = 0;
    function render() {
      if (loaded !== 4) return;
      var width = Math.round(button.clientWidth);
      if (!width) return;
      canvas.width = width;
      canvas.height = 128;
      var context = canvas.getContext('2d');
      var textX = Math.floor((width - pieces.text.width) / 2);
      var rightX = width - pieces.right.width;
      context.drawImage(pieces.left, 0, 0);
      context.drawImage(pieces.filler, pieces.left.width, 0, textX - pieces.left.width, 128);
      context.drawImage(pieces.text, textX, 0);
      context.drawImage(pieces.filler, textX + pieces.text.width, 0, rightX - textX - pieces.text.width, 128);
      context.drawImage(pieces.right, rightX, 0);
      canvas.dataset.ready = 'true';
    }
    ['left', 'filler', 'text', 'right'].forEach(function (part) {
      var asset = new Image();
      pieces[part] = asset;
      asset.onload = function () { loaded += 1; render(); };
      asset.src = root + prefix + '-' + part + '.png';
    });
    new ResizeObserver(render).observe(button);
    layer.setAttribute('aria-hidden', 'true');
  }
  function updateTimer() {
    if (!scene) return;
    var values = ['hour', 'min', 'sec'].map(function (label) {
      var source = document.querySelector('#base [data-label="' + label + '"] .text');
      return source ? source.textContent.trim().padStart(2, '0') : '00';
    });
    scene.querySelector('.weapon-timer').textContent = values.join(':');
  }
  function setActive(active) {
    if (scene) scene.inert = !active;
    var viewer = document.getElementById(frameId);
    if (viewer) viewer.inert = !active;
    document.getElementById('base').inert = true;
  }
  function prepareModel(viewerApi, done) {
    api = viewerApi;
    if (prepared) { done(); return; }
    prepared = true;
    var finished = false;
    var cameraReady = false;
    var settleTimer;
    var timeout = setTimeout(finishCamera, 2000);
    modelSettled = function () {
      clearTimeout(settleTimer);
      if (finished || !cameraReady || (textureProgress !== null && textureProgress < 1)) return;
      // Sketchfab fades its loading UI after the final resources/camera update.
      settleTimer = setTimeout(function () {
        if (finished) return;
        finished = true;
        modelSettled = null;
        requestAnimationFrame(function () { requestAnimationFrame(done); });
      }, 650);
    };
    function finishCamera() { if (finished) return; clearTimeout(timeout); cameraReady = true; modelSettled(); }
    if (typeof api.getCameraLookAt !== 'function') { finishCamera(); return; }
    api.getCameraLookAt(function (error, camera) {
      if (error || !camera || !camera.position || !camera.target || typeof api.setCameraLookAt !== 'function') { finishCamera(); return; }
      var position = camera.position.map(function (value, index) { return camera.target[index] + (value - camera.target[index]) * 0.6; });
      api.setCameraLookAt(position, camera.target, 0, finishCamera);
    });
  }
  function decorateLoadingStatus(element) {
    var row = div('weapon-loading-weapons', element);
    row.setAttribute('aria-hidden', 'true');
    [
      ['u10', 'u8', 30, 28], ['u2', 'u16', 32, 30],
      ['u6', 'u24', 31, 26], ['u4', 'u32', 30, 27]
    ].forEach(function (asset, index) {
      var item = div('weapon-loading-weapon', row);
      item.style.width = asset[2] * 1.5 + 'px';
      item.style.height = asset[3] * 1.5 + 'px';
      item.style.setProperty('--weapon-loading-delay', index * 400 + 'ms');
      item.appendChild(image('images/home/' + asset[0] + '.png'));
      item.appendChild(image('images/home/' + asset[1] + '.png', 'weapon-loading-highlight'));
    });
    var retry = element.querySelector('button');
    if (retry) element.insertBefore(row, retry);
    var scheduled;
    function position() {
      scheduled = null;
      if (element.hidden) return;
      var view = window;
      var offsetX = 0, offsetY = 0;
      var active = document.documentElement.dataset.activePage;
      var child = active && document.querySelector('iframe[name="weapon-page-' + active + '"]');
      if (child && child.classList.contains('weapon-page-active')) {
        view = child.contentWindow;
        var frameRect = child.getBoundingClientRect();
        offsetX = frameRect.left;
        offsetY = frameRect.top;
      }
      var viewer = view.document.querySelector('.weapon-viewer');
      if (!viewer) return;
      var rect = viewer.getBoundingClientRect();
      element.style.setProperty('--weapon-status-x', offsetX + rect.left + rect.width / 2 + 'px');
      element.style.setProperty('--weapon-status-y', offsetY + rect.top + rect.height / 2 + 'px');
    }
    function schedule() { if (!scheduled) scheduled = requestAnimationFrame(position); }
    new MutationObserver(schedule).observe(element, { attributes: true, attributeFilter: ['hidden', 'data-loading'] });
    addEventListener('resize', schedule);
    addEventListener('scroll', schedule, true);
    schedule();
  }
  window.weaponLayout = { prepareModel: prepareModel, trackModel: trackModel, setActive: setActive, decorateLoadingStatus: decorateLoadingStatus };

  function installMobileGestures(viewer) {
    var surface = div('weapon-touch-surface', viewer);
    surface.setAttribute('aria-hidden', 'true');
    var mobile = matchMedia('(max-width: 1279px)');
    var gesture;
    var generation = 0;
    var pendingFrame = 0;
    function reset() {
      generation += 1;
      gesture = null;
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      pendingFrame = 0;
    }
    function pair(touches) {
      var a = touches[0], b = touches[1];
      return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2,
        distance: Math.max(1, Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)) };
    }
    function render() {
      pendingFrame = 0;
      if (!gesture || !gesture.camera) return;
      var g = gesture;
      var target = g.camera.target;
      var vector = g.camera.position.map(function (value, i) { return value - target[i]; });
      var radius = Math.hypot.apply(Math, vector);
      if (!radius) return;
      if (Math.hypot(g.current.x - g.start.x, g.current.y - g.start.y) > 3 || Math.abs(g.current.distance - g.start.distance) > 3) markModelInteracted();
      var yaw = Math.atan2(vector[1], vector[0]) - (g.current.x - g.start.x) / Math.max(1, viewer.clientWidth) * Math.PI * 2;
      var pitch = Math.acos(Math.max(-1, Math.min(1, vector[2] / radius))) - (g.current.y - g.start.y) / Math.max(1, viewer.clientHeight) * Math.PI;
      pitch = Math.max(0.03, Math.min(Math.PI - 0.03, pitch));
      radius *= Math.max(0.15, Math.min(6, g.start.distance / g.current.distance));
      g.api.setCameraLookAt([
        target[0] + radius * Math.sin(pitch) * Math.cos(yaw),
        target[1] + radius * Math.sin(pitch) * Math.sin(yaw),
        target[2] + radius * Math.cos(pitch)
      ], target, 0);
    }
    function requestRender() {
      if (!pendingFrame) pendingFrame = requestAnimationFrame(render);
    }
    surface.addEventListener('touchstart', function (event) {
      if (!mobile.matches || event.touches.length !== 2) { reset(); return; }
      // A single touch keeps the browser's normal page scrolling. Only a pair is claimed.
      event.preventDefault();
      reset();
      var viewerApi = api;
      if (!viewerApi || typeof viewerApi.getCameraLookAt !== 'function' || typeof viewerApi.setCameraLookAt !== 'function') return;
      var token = generation;
      var initial = pair(event.touches);
      gesture = { api: viewerApi, start: initial, current: initial };
      viewerApi.getCameraLookAt(function (error, camera) {
        if (error || !gesture || generation !== token || !camera || !camera.position || !camera.target) return;
        gesture.camera = camera;
        requestRender();
      });
    }, { passive: false });
    surface.addEventListener('touchmove', function (event) {
      if (!mobile.matches || event.touches.length !== 2) { reset(); return; }
      event.preventDefault();
      if (!gesture) return;
      gesture.current = pair(event.touches);
      requestRender();
    }, { passive: false });
    surface.addEventListener('touchend', reset);
    surface.addEventListener('touchcancel', reset);
    mobile.addEventListener('change', reset);
    addEventListener('pagehide', reset);
  }

  function start() {
    if (!frameId || !titleArt) throw new Error('Missing original scene assets for ' + page);
    document.documentElement.classList.add('weapon-responsive');
    document.documentElement.classList.toggle('weapon-home', page === 'home');
    var viewer = document.getElementById(frameId);
    viewer.classList.add('weapon-viewer');
    viewer.querySelector('iframe').classList.add('weapon-viewer-frame');
    if (viewer.parentNode !== document.body) document.body.insertBefore(viewer, document.getElementById('base'));
    installMobileGestures(viewer);
    document.getElementById('base').inert = true;
    scene = div('weapon-scene', document.body);
    var header = div('weapon-header', document.body);
    var heading = document.createElement('span');
    heading.className = 'weapon-header-text';
    heading.textContent = 'ВЫБЕРИ СЕБЕ ПУШКУ НА CASES4REAL';
    header.appendChild(heading);
    // The host owns one uninterrupted full-width header across cached pages.
    header.hidden = !!(window.frameElement && window.frameElement.classList.contains('weapon-page'));
    var footerSlot = document.querySelector('.weapon-footer-slot');
    if (footerSlot) footerSlot.hidden = header.hidden;
    var nav = document.createElement('nav');
    nav.className = 'weapon-model-menu';
    nav.setAttribute('aria-label', 'Модели оружия');
    scene.appendChild(nav);
    var names = { ak: 'AK-47', m4a1: 'M4A1', awp: 'AWP', knife: 'Нож' };
    ['ak', 'm4a1', 'awp', 'knife'].forEach(function (name) {
      var link = document.createElement('a');
      link.className = 'weapon-model-item';
      link.href = name + '.html';
      link.dataset.weaponPage = name;
      link.setAttribute('aria-label', names[name]);
      if (name === (page === 'home' ? 'ak' : page)) { link.classList.add('weapon-model-current'); link.setAttribute('aria-current', 'page'); }
      link.appendChild(image(name === (page === 'home' ? 'ak' : page) ? navArt[name].hover : navArt[name].src));
      link.addEventListener('pointerenter', function () { navigation().preload(name); });
      link.addEventListener('focus', function () { navigation().preload(name); });
      link.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigation().select(name, false);
      });
      nav.appendChild(link);
    });
    var menuHost = window.frameElement && window.frameElement.classList.contains('weapon-page') ? parent.document.documentElement : document.documentElement;
    function syncMenuSelection() {
      var selected = menuHost.dataset.selectedPage || menuHost.dataset.pendingPage || menuHost.dataset.activePage || page;
      if (selected === 'home') selected = 'ak';
      nav.querySelectorAll('[data-weapon-page]').forEach(function (link) {
        var name = link.dataset.weaponPage;
        var current = name === selected;
        link.classList.toggle('weapon-model-current', current);
        if (current) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
        var src = current ? navArt[name].hover : navArt[name].src;
        if (link.querySelector('img').getAttribute('src') !== src) link.querySelector('img').src = src;
      });
    }
    new MutationObserver(syncMenuSelection).observe(menuHost, { attributes: true, attributeFilter: ['data-selected-page'] });
    syncMenuSelection();
    function syncPendingScene() {
      var pending = menuHost.dataset.pendingPage;
      var active = menuHost.dataset.activePage;
      document.documentElement.classList.toggle('weapon-model-pending', !!pending && pending !== active);
    }
    new MutationObserver(syncPendingScene).observe(menuHost, { attributes: true, attributeFilter: ['data-pending-page', 'data-active-page'] });
    syncPendingScene();
    var gesture = art.find(function (item) { return item.label === '3D'; });
    if (gesture) {
      var icon = div('weapon-gesture', scene);
      var picture = document.createElement('picture');
      var mobileIcon = document.createElement('source');
      mobileIcon.media = '(max-width: 1279px)';
      mobileIcon.srcset = 'images/3Dfinger.png';
      picture.appendChild(mobileIcon);
      var gestureImage = image(gesture.src);
      gestureImage.alt = 'Вращайте 3D-модель';
      picture.appendChild(gestureImage);
      icon.appendChild(picture);
    }
    var title = div('weapon-product-title', scene);
    title.style.setProperty('--art-width', titleArt.width + 'px');
    title.style.setProperty('--art-ratio', titleArt.width + ' / 46');
    title.style.setProperty('--title-art-offset', ((titleArt.sourceY - 706) / 46 * 100) + '%');
    title.appendChild(image(titleArt.src));
    var quality = div('weapon-product-quality', scene);
    quality.style.setProperty('--art-width', titleArt.width + 'px');
    quality.style.setProperty('--art-height', titleArt.height + 'px');
    quality.appendChild(image(titleArt.src));
    var side = div('weapon-side', scene);
    var button = document.createElement('button');
    button.className = 'weapon-get-button';
    button.type = 'button';
    button.setAttribute('aria-label', 'Получить');
    side.appendChild(button);
    addButtonSkin(button, 'main-default', 'default-active-pressed-main', 'default-active-pressed');
    addButtonSkin(button, 'main-hover', 'hover-main', 'hover');
    // The portfolio demo ends here; retain the button's hover and pressed feedback.
    var label = art.find(function (item) { return item.height >= 17 && item.height <= 20 && item.width > 100 && item.width < 400; });
    if (label) {
      var caption = div('weapon-offer-caption', side);
      var captionImage = image(label.src);
      captionImage.style.width = label.width + 'px';
      captionImage.style.height = label.height + 'px';
      caption.appendChild(captionImage);
    }
    var discount = div('weapon-discount', side);
    discount.innerHTML = '<div class="weapon-discount-value"><span class="weapon-discount-number">20</span><span class="weapon-discount-details"><span class="weapon-discount-percent">%</span><span class="weapon-discount-word">СКИДКА</span></span></div><div class="weapon-discount-description">на открытие первого кейса</div>';
    var limited = div('weapon-limited', side);
    limited.appendChild(image('images/home/u158.png'));
    var timer = div('weapon-timer', side);
    timer.setAttribute('role', 'timer');
    timer.setAttribute('aria-label', 'Осталось времени');
    updateTimer();
    document.querySelectorAll('#base [data-label="hour"] .text, #base [data-label="min"] .text, #base [data-label="sec"] .text').forEach(function (node) {
      new MutationObserver(updateTimer).observe(node, { subtree: true, childList: true, characterData: true });
    });
    function updateIntro() {
      document.documentElement.style.setProperty('--weapon-intro-scale', Math.min(innerWidth, 1280) / 1280);
    }
    updateIntro();
    addEventListener('resize', updateIntro);
    function updateActive() { setActive(!document.documentElement.classList.contains('weapon-host-inactive') && (page !== 'home' || document.documentElement.dataset.landingRevealed === 'true')); }
    updateActive();
    new MutationObserver(updateActive).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-landing-revealed'] });
    document.documentElement.dataset.weaponLayoutReady = 'true';
    var mobileScroll = document.createElement('script');
    mobileScroll.src = 'resources/mobile-scroll.js';
    document.head.appendChild(mobileScroll);
  }
  document.addEventListener('DOMContentLoaded', function () { setTimeout(start, 0); });
}());
