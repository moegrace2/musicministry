// notifications.js
(function() {
  'use strict';

  // 1. Inject CSS Styles immediately (Head always exists)
  const style = document.createElement('style');
  style.textContent = `
    .toast-container {
      position: fixed; bottom: 20px; right: 20px; z-index: 10000;
      display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    }
    .toast {
      background: #333; color: #fff; padding: 12px 20px; border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 14px;
      opacity: 0; transform: translateY(20px); transition: all 0.3s ease;
      pointer-events: auto; min-width: 250px; max-width: 400px; display: flex; align-items: center; justify-content: space-between;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
    .toast.error { background: #dc2626; color: white; }
    .toast.success { background: #16a34a; color: white; }
    .toast.info { background: #2563eb; color: white; }
    .toast.warning { background: #d97706; color: white; }
  `;
  document.head.appendChild(style);

  // 2. Global Function
  window.showToast = function(message, type = 'info') {
    // Ensure container exists (create it on first call if needed)
    let container = document.querySelector('.toast-container');
    if (!container) {
      if (!document.body) return; // Failsafe if body still isn't ready
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    
    container.appendChild(el);
    
    // Animate In
    requestAnimationFrame(() => el.classList.add('show'));

    // Animate Out & Remove
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 300);
    }, 3500);
  };
})();