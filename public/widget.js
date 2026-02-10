(function () {
  'use strict'

  // Default configuration
  const DEFAULTS = {
    formUrl: 'https://trulyvolodymyr.github.io/z-booking',
    buttonText: 'Open Form',
    buttonPosition: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    hiddenButton: false
  }

  // Merge with external config from window.ZBookingConfig
  const CONFIG = { ...DEFAULTS, ...(window.ZBookingConfig || {}) }

  // Check if widget already exists or if we're inside an iframe (prevent recursion)
  if (document.getElementById('widget-overlay')) return
  if (window.self !== window.top) return

  // Create styles
  const style = document.createElement('style')
  style.textContent = `
    #widget-button {
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
    #widget-button:hover {
      background: #0056b3;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,123,255,0.5);
    }
    #widget-button.bottom-right { bottom: 20px; right: 20px; }
    #widget-button.bottom-left { bottom: 20px; left: 20px; }
    #widget-button.top-right { top: 20px; right: 20px; }
    #widget-button.top-left { top: 20px; left: 20px; }
    
    #widget-overlay {
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
      animation: fadeIn 0.3s ease;
      align-items: flex-start !important;
      justify-content: center !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    #widget-overlay.active { display: flex !important; }
    
    #widget-iframe-container {
      position: relative !important;
      width: calc(100% - 8px) !important;
      height: calc(100vh - 40px) !important;
      background: white !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
      animation: slideUp 0.3s ease;
      margin: 40px 4px 0 4px !important;
      transform: none !important;
    }
    
    #widget-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      border-bottom: 1px solid #E6EBEF;
      background: white;
      border-radius: 12px 12px 0 0;
      background-color: #E6EBEF;
    }
    
    #widget-logo {
      height: 29px;
      width: auto;
    }
    
    #widget-close {
      width: 28px;
      height: 28px;
      background: #007bff;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    #widget-close:hover {
      background: #0056b3;
    }
    #widget-close svg {
      width: 16px;
      height: 16px;
      color: white;
    }
    
    #widget-iframe {
      width: 100%;
      height: calc(100% - 75px);
      border: none;
      border-radius: 0 0 12px 12px;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `
  document.head.appendChild(style)

  // Create widget button (directly on body)
  if (!CONFIG.hiddenButton) {
    const btn = document.createElement('button')
    btn.id = 'widget-button'
    btn.className = CONFIG.buttonPosition
    btn.textContent = CONFIG.buttonText
    document.body.appendChild(btn)
  }

  // Construct logo URL from formUrl
  const formUrlBase = CONFIG.formUrl.replace(/\/$/, '')
  const logoUrl = formUrlBase + '/images/logo.png'

  // Create overlay (directly on body for full viewport coverage)
  const overlay = document.createElement('div')
  overlay.id = 'widget-overlay'
  overlay.innerHTML = `
    <div id="widget-iframe-container">
      <div id="widget-header">
        <img id="widget-logo" src="${logoUrl}" alt="Logo" />
        <button id="widget-close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <iframe id="widget-iframe" src="" title="Form Widget"></iframe>
    </div>
  `
  document.body.appendChild(overlay)

  // Get elements
  const closeBtn = document.getElementById('widget-close')
  const iframe = document.getElementById('widget-iframe')

  // Event handlers
  function openWidget () {
    if (!iframe.getAttribute('src')) {
      let url = CONFIG.formUrl
      if (CONFIG.token) {
        url += (url.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(CONFIG.token)
      }
      iframe.src = url
    }
    overlay.classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  function closeWidget () {
    overlay.classList.remove('active')
    document.body.style.overflow = ''
  }

  const btn = document.getElementById('widget-button')
  if (btn) {
    btn.addEventListener('click', openWidget)
  }
  closeBtn.addEventListener('click', closeWidget)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeWidget()
    }
  })

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeWidget()
    }
  })

  // Listen for messages from iframe (optional - for closing from inside)
  window.addEventListener('message', function (e) {
    if (e.data === 'closeWidget') {
      closeWidget()
    }
  })

  // Expose API globally for clients to control the modal
  window.ZBookingWidget = {
    open: openWidget,
    close: closeWidget
  }
})()
