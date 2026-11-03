(function () {
  'use strict';
  var root = document.documentElement;
  var cached = !!(frameElement && frameElement.classList.contains('weapon-page'));
  var portfolio = !!(frameElement && frameElement.classList.contains('weapon-case-landing'));
  var media = matchMedia('(max-width: 1279px)');
  var nodes;
  var enabled = false;
  var offset = 0;
  var metrics;
  var frame = 0;

  function measure() {
    if (!nodes || !media.matches) return null;
    var sceneHeight = parseFloat(getComputedStyle(nodes.scene).height);
    var footerHeight = nodes.footer.querySelector('.ds-footer').getBoundingClientRect().height;
    var buttonBottom = parseFloat(getComputedStyle(nodes.button).top) + nodes.button.offsetHeight;
    var menuBottom = parseFloat(getComputedStyle(nodes.header).height) + nodes.menu.offsetHeight;
    var pinAt = Math.max(0, parseFloat(getComputedStyle(nodes.quality).top) - menuBottom - 16);
    metrics = { height: Math.ceil(sceneHeight + footerHeight), pinAt: pinAt, buttonBottom: buttonBottom, sceneHeight: sceneHeight };
    // Cached pages omit their duplicate footer, but share the host's scroll range.
    if (cached && parent.weaponMobileLayout) {
      var hostMetrics = parent.weaponMobileLayout.measure();
      if (hostMetrics) metrics.height = hostMetrics.height;
    }
    return metrics;
  }
  function apply(nextOffset, viewportHeight) {
    if (!enabled || !metrics) return;
    var max = Math.max(0, metrics.height - viewportHeight);
    offset = Math.max(0, Math.min(max, nextOffset));
    var pinnedOffset = Math.min(offset, metrics.pinAt);
    root.style.setProperty('--weapon-mobile-offset', offset + 'px');
    root.style.setProperty('--weapon-mobile-stack-offset', pinnedOffset + 'px');
    root.style.setProperty('--weapon-mobile-tail-cut', (metrics.buttonBottom - pinnedOffset + offset) + 'px');
    root.style.setProperty('--weapon-mobile-blur-opacity', Math.min(1, offset / 120));
    root.classList.toggle('weapon-mobile-stack-pinned', max > metrics.pinAt && offset >= metrics.pinAt);
    root.dataset.mobileScrollOffset = String(Math.round(offset));
    if (!cached) document.querySelectorAll('.weapon-page').forEach(function (child) {
      if (child.contentWindow.weaponMobileLayout) child.contentWindow.weaponMobileLayout.update(offset, viewportHeight);
    });
  }
  function configure() {
    if (!nodes) return;
    if (media.matches && !enabled) {
      enabled = true;
      root.classList.add('weapon-mobile-scroll');
      root.classList.toggle('weapon-mobile-portfolio', portfolio);
      nodes.stack.appendChild(nodes.quality);
      nodes.stack.appendChild(nodes.title);
      nodes.stack.appendChild(nodes.button);
      nodes.tail.appendChild(nodes.side);
    } else if (!media.matches && enabled) {
      enabled = false;
      root.classList.remove('weapon-mobile-scroll', 'weapon-mobile-stack-pinned');
      nodes.scene.appendChild(nodes.quality);
      nodes.scene.appendChild(nodes.title);
      nodes.side.appendChild(nodes.button);
      nodes.scene.appendChild(nodes.side);
      document.body.appendChild(nodes.footer);
      document.body.style.height = '';
    }
    if (enabled) {
      measure();
      nodes.tail.style.height = metrics.height + 'px';
      if (!cached) document.body.style.height = metrics.height + 'px';
      var host = cached && parent.weaponMobileLayout;
      var state = host ? host.state() : { offset: portfolio ? offset : scrollY, viewportHeight: innerHeight };
      apply(state.offset, state.viewportHeight);
    }
    if (portfolio) dispatchEvent(new Event('weapon-mobile-layout'));
  }
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(function () { frame = 0; if (!portfolio && !cached) apply(scrollY, innerHeight); });
  }
  window.weaponMobileLayout = {
    measure: measure,
    update: apply,
    state: function () { return { offset: offset, viewportHeight: innerHeight }; }
  };
  function start() {
    var scene = document.querySelector('.weapon-scene');
    if (!scene || !document.querySelector('.weapon-timer')) return false;
    nodes = {
      scene: scene, viewer: document.querySelector('.weapon-viewer'),
      header: document.querySelector('.weapon-header'), menu: document.querySelector('.weapon-model-menu'),
      title: document.querySelector('.weapon-product-title'), quality: document.querySelector('.weapon-product-quality'),
      button: document.querySelector('.weapon-get-button'), side: document.querySelector('.weapon-side'),
      footer: document.querySelector('.weapon-footer-slot')
    };
    nodes.stack = document.createElement('div'); nodes.stack.className = 'weapon-mobile-stack'; scene.appendChild(nodes.stack);
    nodes.tail = document.createElement('div'); nodes.tail.className = 'weapon-mobile-tail'; scene.appendChild(nodes.tail);
    var blur = document.createElement('div'); blur.className = 'weapon-mobile-blur'; nodes.viewer.appendChild(blur);
    configure();
    addEventListener('resize', configure);
    media.addEventListener('change', configure);
    addEventListener('scroll', schedule, { passive: true });
    document.fonts.ready.then(configure);
    new MutationObserver(configure).observe(root, { attributes: true, attributeFilter: ['data-landing-revealed'] });
    return true;
  }
  function boot() {
    if (start()) return;
    var observer = new MutationObserver(function () { if (start()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}());
