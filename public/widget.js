(function () {
  'use strict'

  // Configuration
  const CONFIG = {
    formUrl: 'https://trulyvolodymyr.github.io/z-booking', // Replace with your form URL
    buttonText: 'Open Form',
    buttonPosition: 'bottom-right' // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  }

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
      align-items: center !important;
      justify-content: center !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
    }
    #widget-overlay.active { display: flex !important; }
    
    #widget-iframe-container {
      position: relative !important;
      width: 90% !important;
      max-width: 1000px !important;
      height: 80vh !important;
      max-height: 700px !important;
      background: white !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
      animation: slideUp 0.3s ease;
      margin: auto !important;
      transform: none !important;
    }
    
    #widget-close {
      position: absolute;
      top: -15px;
      right: -15px;
      width: 40px;
      height: 40px;
      background: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
      color: #333;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: all 0.2s ease;
    }
    #widget-close:hover {
      background: #f0f0f0;
      transform: rotate(90deg);
    }
    
    #widget-iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
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
  const btn = document.createElement('button')
  btn.id = 'widget-button'
  btn.className = CONFIG.buttonPosition
  btn.textContent = CONFIG.buttonText
  document.body.appendChild(btn)

  // Create overlay (directly on body for full viewport coverage)
  const overlay = document.createElement('div')
  overlay.id = 'widget-overlay'
  overlay.innerHTML = `
    <div id="widget-iframe-container">
      <button id="widget-close">&times;</button>
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
      iframe.src = CONFIG.formUrl
    }
    overlay.classList.add('active')
    document.body.style.overflow = 'hidden'
  }

  function closeWidget () {
    overlay.classList.remove('active')
    document.body.style.overflow = ''
  }

  btn.addEventListener('click', openWidget)
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
})()
