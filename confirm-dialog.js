(function() {
  'use strict';

  function injectDialogs() {
    if (document.getElementById('dialogBackdrop')) return;

    const style = document.createElement('style');
    style.textContent = `
      .dialog-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.5);
        display: none; align-items: center; justify-content: center; z-index: 9999;
      }
      .dialog-backdrop.show { display: flex; }
      .dialog-box {
        background: #fff; border-radius: 12px; padding: 24px;
        max-width: 450px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex; flex-direction: column; gap: 16px;
      }
      .dialog-box h3 { margin: 0; color: #1f2937; }
      .dialog-box p { margin: 0; color: #4b5563; line-height: 1.5; }
      .dialog-box input {
        width: 100%; padding: 10px; border: 2px solid #cbd5e1;
        border-radius: 8px; font-size: 14px; box-sizing: border-box;
      }
      .dialog-buttons { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
      .dialog-btn {
        padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
      }
      .btn-cancel { background: #e2e8f0; color: #475569; }
      .btn-confirm { background: #2563eb; color: white; }
      .btn-danger { background: #dc2626; color: white; }
      .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }
    `;
    document.head.appendChild(style);

    const backdrop = document.createElement('div');
    backdrop.className = 'dialog-backdrop';
    backdrop.id = 'dialogBackdrop';
    backdrop.innerHTML = `
      <div class="dialog-box">
        <h3 id="dialogTitle"></h3>
        <div id="dialogMessage"></div>
        <div id="dialogInputWrap" style="display:none">
          <input type="text" id="dialogInput" autocomplete="off">
          <p id="dialogHint" style="font-size:12px; margin-top:4px; color:#64748b;"></p>
        </div>
        <div class="dialog-buttons">
          <button class="dialog-btn btn-cancel" id="dialogCancel">Cancel</button>
          <button class="dialog-btn btn-confirm" id="dialogConfirm">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  }

  // --- INTERNAL HELPER ---
  function openDialog({ title, message, type = 'confirm', inputType = 'text', keyword = null, confirmText = 'Confirm', confirmColor = 'primary' }) {
    return new Promise((resolve) => {
      injectDialogs();
      const backdrop = document.getElementById('dialogBackdrop');
      const titleEl = document.getElementById('dialogTitle');
      const msgEl = document.getElementById('dialogMessage');
      const inputWrap = document.getElementById('dialogInputWrap');
      const input = document.getElementById('dialogInput');
      const hint = document.getElementById('dialogHint');
      const confirmBtn = document.getElementById('dialogConfirm');
      const cancelBtn = document.getElementById('dialogCancel');

      titleEl.textContent = title;
      msgEl.innerHTML = message;
      confirmBtn.textContent = confirmText;
      
      // Reset styles
      confirmBtn.className = `dialog-btn ${confirmColor === 'danger' ? 'btn-danger' : 'btn-confirm'}`;
      input.value = '';
      input.type = inputType; // 'text' or 'password'

      // Setup UI based on type
      if (type === 'prompt' || type === 'keyword_confirm') {
        inputWrap.style.display = 'block';
        setTimeout(() => input.focus(), 100);
      } else {
        inputWrap.style.display = 'none';
        confirmBtn.focus();
      }

      if (type === 'keyword_confirm' && keyword) {
        confirmBtn.disabled = true;
        hint.textContent = `Type "${keyword}" to confirm.`;
        input.placeholder = keyword;
      } else {
        confirmBtn.disabled = false;
        hint.textContent = '';
        input.placeholder = '';
      }

      const checkInput = () => {
        if (type === 'keyword_confirm') confirmBtn.disabled = input.value !== keyword;
      };

      const close = (val) => {
        backdrop.classList.remove('show');
        cleanup();
        resolve(val);
      };

      const handleConfirm = () => {
        if (type === 'keyword_confirm' && input.value !== keyword) return;
        close(type === 'prompt' ? input.value : true);
      };

      const handleCancel = () => close(null); // Return null on cancel

      const cleanup = () => {
        confirmBtn.onclick = null;
        cancelBtn.onclick = null;
        input.oninput = null;
        input.onkeydown = null;
      };

      confirmBtn.onclick = handleConfirm;
      cancelBtn.onclick = handleCancel;
      input.oninput = checkInput;
      input.onkeydown = (e) => { if (e.key === 'Enter' && !confirmBtn.disabled) handleConfirm(); };
      
      backdrop.classList.add('show');
    });
  }

  // --- EXPORTED FUNCTIONS ---

  window.showConfirmDialog = function(opts) {
    // Legacy support for your existing code
    if (opts.keyword) {
      return openDialog({ ...opts, type: 'keyword_confirm', confirmColor: 'danger' });
    }
    return openDialog({ ...opts, type: 'confirm' });
  };

  window.showPromptDialog = function(title, message, isPassword = false) {
    return openDialog({ 
      title, 
      message, 
      type: 'prompt', 
      inputType: isPassword ? 'password' : 'text',
      confirmText: 'OK'
    });
  };
})();