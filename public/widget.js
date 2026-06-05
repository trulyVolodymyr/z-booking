(function () {
  'use strict'

  // Prevent recursion: never inject the widget when running inside the form iframe itself
  if (window.self !== window.top) return

  // Default configuration
  const DEFAULTS = {
    formUrl: 'https://trulyvolodymyr.github.io/z-booking',
    buttonText: 'Open Form',
    buttonPosition: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    hiddenButton: false,
    mode: 'overlay', // 'overlay' (fullscreen modal) | 'inline' (mounted into a host element)
    target: null, // CSS selector or element — required for inline mode
    view: null, // optional path segment to deep-link the iframe (e.g. 'service/tuv')
    params: null, // optional object of query params appended to the iframe url
    token: null,
    autoOpen: null // null => defaults to true for inline, false for overlay
  }

  // Capture the embedding <script> at load time so we can read its data-* attributes
  const CURRENT_SCRIPT = document.currentScript

  // Read config overrides from data-* attributes on the embedding script tag
  function readScriptConfig () {
    if (!CURRENT_SCRIPT || !CURRENT_SCRIPT.dataset) return {}
    const d = CURRENT_SCRIPT.dataset
    const cfg = {}
    if (d.formUrl != null) cfg.formUrl = d.formUrl
    if (d.buttonText != null) cfg.buttonText = d.buttonText
    if (d.buttonPosition != null) cfg.buttonPosition = d.buttonPosition
    if (d.hiddenButton != null) cfg.hiddenButton = d.hiddenButton === 'true'
    if (d.mode != null) cfg.mode = d.mode
    if (d.target != null) cfg.target = d.target
    if (d.view != null) cfg.view = d.view
    if (d.token != null) cfg.token = d.token
    if (d.autoOpen != null) cfg.autoOpen = d.autoOpen === 'true'
    return cfg
  }

  const SCRIPT_CONFIG = readScriptConfig()

  // Inject the shared stylesheet exactly once
  function injectStyles () {
    if (document.getElementById('zb-widget-styles')) return
    const style = document.createElement('style')
    style.id = 'zb-widget-styles'
    style.textContent = `
    .zb-button {
      position: fixed;
      z-index: 999999;
      padding: 12px 24px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,123,255,0.4);
      transition: all 0.3s ease;
    }
    .zb-button:hover {
      background: #0056b3;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,123,255,0.5);
    }
    .zb-button.bottom-right { bottom: 20px; right: 20px; }
    .zb-button.bottom-left { bottom: 20px; left: 20px; }
    .zb-button.top-right { top: 20px; right: 20px; }
    .zb-button.top-left { top: 20px; left: 20px; }

    /* Overlay mode: fullscreen modal */
    .zb-overlay {
      display: none;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0,0,0,0.5) !important;
      z-index: 1000000 !important;
      animation: zbFadeIn 0.3s ease;
      align-items: flex-start !important;
      justify-content: center !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    .zb-overlay.active { display: flex !important; }

    .zb-overlay .zb-container {
      position: relative !important;
      width: calc(100% - 8px) !important;
      height: calc(100vh - 40px) !important;
      animation: zbSlideUp 0.3s ease;
      margin: 40px 4px 0 4px !important;
    }

    /* Inline mode: fill the host container */
    .zb-inline {
      display: none;
      width: 100%;
      height: 100%;
    }
    .zb-inline.active { display: block; }
    .zb-inline .zb-container {
      position: relative;
      width: 100%;
      height: 100%;
      background: transparent;
      border-radius: 0;
    }
    /* Embedded look: no header, no wrapper border/chrome, iframe fills the box */
    .zb-inline .zb-header { display: none !important; }
    .zb-inline .zb-iframe {
      height: 100%;
      border-radius: 0;
    }

    .zb-container {
      background: transparent;
      border-radius: 12px;
      transform: none;
      box-sizing: border-box;
    }
    @media (max-width: 907px) {
      .zb-container { background: white; }
    }

    .zb-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid #E6EBEF;
      background-color: #E6EBEF;
      border-radius: 12px 12px 0 0;
    }

    @media (min-width: 907px) {
      .zb-overlay .zb-header { display: none !important; }
      .zb-overlay .zb-iframe {
        height: 100% !important;
        border-radius: 12px;
      }
    }

    .zb-logo {
      height: 29px;
      width: auto;
    }

    .zb-close {
      width: 28px !important;
      height: 28px !important;
      padding: 0 !important;
      background: #007bff !important;
      border: none !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease;
    }
    .zb-close:hover {
      background: #0056b3 !important;
    }
    .zb-close svg {
      width: 16px !important;
      height: 16px !important;
      color: white !important;
      stroke: white !important;
    }

    .zb-iframe {
      width: 100%;
      height: calc(100% - 75px);
      border: none;
      border-radius: 0 0 12px 12px;
    }

    @keyframes zbFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes zbSlideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `
    document.head.appendChild(style)
  }

  // Build the iframe URL from config (token + deep-link view + extra params)
  function buildIframeUrl (config) {
    let url = String(config.formUrl).replace(/\/$/, '')

    if (config.view) {
      url += '/' + String(config.view).replace(/^\//, '')
    }

    const query = []
    if (config.token) {
      query.push('token=' + encodeURIComponent(config.token))
    }
    // Tell the app it is embedded inline so it drops its modal card chrome
    if (config.mode === 'inline') {
      query.push('embedded=true')
    }
    if (config.params && typeof config.params === 'object') {
      Object.keys(config.params).forEach(function (key) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(config.params[key]))
      })
    }
    if (query.length) {
      url += (url.includes('?') ? '&' : '?') + query.join('&')
    }

    return url
  }

  // Resolve the host element for inline mode
  function resolveTarget (target) {
    if (!target) return null
    if (typeof target === 'string') return document.querySelector(target)
    if (target.nodeType === 1) return target
    return null
  }

  // Track which inline containers already host a widget (per-target double-inject guard)
  const mountedTargets = []

  /**
   * Create a widget instance.
   * @returns {{ open: Function, close: Function, destroy: Function, el: HTMLElement }}
   */
  function createWidget (userConfig) {
    injectStyles()

    const config = Object.assign({}, DEFAULTS, window.ZBookingConfig || {}, SCRIPT_CONFIG, userConfig || {})
    const isInline = config.mode === 'inline'
    const autoOpen = config.autoOpen == null ? isInline : config.autoOpen

    // Resolve host for inline mode; fall back to overlay if the target is missing
    let host = document.body
    if (isInline) {
      const resolved = resolveTarget(config.target)
      if (!resolved) {
        console.warn('[ZBooking] inline mode requires a valid `target`; nothing injected.')
        return null
      }
      if (mountedTargets.indexOf(resolved) !== -1) {
        console.warn('[ZBooking] a widget is already mounted in this target; skipping.')
        return null
      }
      mountedTargets.push(resolved)
      host = resolved
    }

    const formUrlBase = String(config.formUrl).replace(/\/$/, '')
    const logoUrl = formUrlBase + '/images/logo.png'

    // Optional floating trigger button (overlay mode only)
    let button = null
    if (!isInline && !config.hiddenButton) {
      button = document.createElement('button')
      button.className = 'zb-button ' + config.buttonPosition
      button.textContent = config.buttonText
      document.body.appendChild(button)
    }

    // Header (logo + close button) — only for the overlay modal, never for embedded inline
    const headerHtml = isInline
      ? ''
      : '<div class="zb-header">' +
          '<img class="zb-logo" src="' + logoUrl + '" alt="Logo" />' +
          '<button class="zb-close" type="button">' +
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">' +
              '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />' +
            '</svg>' +
          '</button>' +
        '</div>'

    // Root element: an overlay wrapper, or an inline wrapper inside the host
    const root = document.createElement('div')
    root.className = isInline ? 'zb-inline' : 'zb-overlay'
    root.innerHTML =
      '<div class="zb-container">' +
        headerHtml +
        '<iframe class="zb-iframe" src="" title="Form Widget"></iframe>' +
      '</div>'
    host.appendChild(root)

    const closeBtn = root.querySelector('.zb-close')
    const iframe = root.querySelector('.zb-iframe')

    function open () {
      if (!iframe.getAttribute('src')) {
        iframe.src = buildIframeUrl(config)
      }
      root.classList.add('active')
      if (!isInline) {
        document.body.style.overflow = 'hidden'
      }
    }

    function close () {
      root.classList.remove('active')
      if (!isInline) {
        document.body.style.overflow = ''
      }
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('resetWidget', '*')
      }
    }

    function destroy () {
      window.removeEventListener('message', onMessage)
      document.removeEventListener('keydown', onKeydown)
      if (button && button.parentNode) button.parentNode.removeChild(button)
      if (root.parentNode) root.parentNode.removeChild(root)
      if (isInline) {
        const idx = mountedTargets.indexOf(host)
        if (idx !== -1) mountedTargets.splice(idx, 1)
      }
    }

    // Wiring
    if (button) button.addEventListener('click', open)
    if (closeBtn) closeBtn.addEventListener('click', close)

    // Overlay-only: click on the backdrop closes
    if (!isInline) {
      root.addEventListener('click', function (e) {
        if (e.target === root) close()
      })
    }

    function onKeydown (e) {
      if (e.key === 'Escape' && root.classList.contains('active')) close()
    }
    document.addEventListener('keydown', onKeydown)

    function onMessage (e) {
      if (e.data === 'closeWidget') close()
    }
    window.addEventListener('message', onMessage)

    if (autoOpen) open()

    return { open, close, destroy, el: root }
  }

  // Run a callback once the DOM <body> is available (script may load from <head>)
  function whenBodyReady (cb) {
    if (document.body) {
      cb()
    } else {
      document.addEventListener('DOMContentLoaded', cb, { once: true })
    }
  }

  // Wait for an inline target to appear in the DOM. On SPA hosts (Vue/React/etc.)
  // the container is often rendered AFTER load, so a one-shot lookup at DOMContentLoaded
  // misses it. Resolve immediately if present, otherwise observe the DOM until it shows
  // up (or give up after `timeoutMs`). Accepts a selector string or an element.
  function whenTargetReady (target, cb, timeoutMs) {
    if (!target || typeof target !== 'string') {
      cb(resolveTarget(target))
      return
    }
    const existing = document.querySelector(target)
    if (existing) {
      cb(existing)
      return
    }
    let settled = false
    const observer = new MutationObserver(function () {
      const el = document.querySelector(target)
      if (el && !settled) {
        settled = true
        observer.disconnect()
        cb(el)
      }
    })
    observer.observe(document.documentElement, { childList: true, subtree: true })
    window.setTimeout(function () {
      if (settled) return
      settled = true
      observer.disconnect()
      if (!document.querySelector(target)) {
        console.warn('[ZBooking] inline target "' + target + '" never appeared; widget not mounted.')
      } else {
        cb(document.querySelector(target))
      }
    }, timeoutMs || 10000)
  }

  // The lazily-created default instance (built from window.ZBookingConfig + script data-*)
  let defaultInstance = null
  function ensureDefaultInstance () {
    if (defaultInstance) return defaultInstance
    if (!document.body) return null // can't mount yet; caller should retry on DOM ready
    const cfg = Object.assign({}, DEFAULTS, window.ZBookingConfig || {}, SCRIPT_CONFIG)
    defaultInstance = createWidget(cfg)
    if (defaultInstance) {
      window.ZBooking.instances.push(defaultInstance)
      window.ZBooking.default = defaultInstance
    }
    return defaultInstance
  }

  // Public factory API — defined IMMEDIATELY so host code never hits "not defined",
  // even if it calls open()/create() before the DOM (or this default instance) is ready.
  window.ZBooking = window.ZBooking || {
    instances: [],
    create: function (cfg) {
      const instance = createWidget(cfg)
      if (instance) window.ZBooking.instances.push(instance)
      return instance
    }
  }

  // Backward-compatible global. open()/close() lazily build the default instance,
  // so an onclick="ZBookingWidget.open()" works regardless of script load order.
  window.ZBookingWidget = window.ZBookingWidget || {
    open: function () {
      const i = ensureDefaultInstance()
      if (i) i.open()
      else whenBodyReady(function () { const inst = ensureDefaultInstance(); if (inst) inst.open() })
    },
    close: function () {
      const i = ensureDefaultInstance()
      if (i) i.close()
    }
  }

  // Auto-bootstrap the default instance on load (floating button / inline mount),
  // matching the original single-widget embed behavior — once the body exists.
  whenBodyReady(function () {
    const cfg = Object.assign({}, DEFAULTS, window.ZBookingConfig || {}, SCRIPT_CONFIG)
    if (cfg.mode === 'inline') {
      // Wait for the (possibly SPA-rendered) container before mounting
      whenTargetReady(cfg.target, function (el) {
        if (el) ensureDefaultInstance()
      })
    } else if (!document.querySelector('.zb-overlay')) {
      // Only auto-create one default overlay instance
      ensureDefaultInstance()
    }
  })
})()
