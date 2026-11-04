/**
 * ============================================================================
 * SASTADEAL — FRONTEND CORE ENGINE & CONFIGURATION (_config.js)
 * ============================================================================
 * Safe for public GitHub Pages hosting (NO secrets stored here).
 * Provides: API Client, Stale-While-Revalidate Cache, Auth Guard, Theme Engine,
 *           <=200KB Client Image Compressor, CSV/XLS Exporter, 1-Click WhatsApp.
 * ============================================================================
 */

const SASTADEAL_CONFIG = {
  // Paste your deployed Google Apps Script Web App URL here:
  API_URL: 'https://script.google.com/macros/s/AKfycbzwj9H__a2M4EeiTmvYgn3Kj1WIepjQXjnSQLmkgJeh0vYCLG--okwbMsoQYnQu4PNk2A/exec',

  APP_NAME: 'SastaDeal',
  TAGLINE: 'Premium Order & Deal Management Platform',
  VERSION: '3.5.0',

  // Storage Keys
  STORAGE_KEYS: {
    TOKEN: 'sd_auth_token_v3',
    USER: 'sd_auth_user_v3',
    THEME: 'sd_theme_mode',
    CACHE_PREFIX: 'sd_cache_v3_'
  },

  // Exact Status List from Platform Sheet
  ORDER_STATUSES: [
    'Order Placed',
    'Product Received',
    'Reviewed',
    'Review Live',
    'Refund form filled',
    'Got Refund',
    'Cancelled',
    'Review deleted',
    'product not delivered',
    'Cancelled by seller',
    'Cancelled by Amazon',
    'Returned to seller by amz',
    'Reviw not live/Cancelled',
    'under moderation issue',
    'A/c block 4 review',
    'Error on this product',
    'Review deleted Unverified',
    'Rating error Unverified'
  ],

  PLATFORMS: [
    'Amazon',
    'Flipkart',
    'Meesho',
    'Myntra',
    'Blinkit',
    'Amz_Rating',
    'Fkt_Empty',
    'Fkt_Empty_Rating',
    'Fkt_Exchange',
    'Fkt_Exchange_Rating',
    'Fkt_Only_Order',
    'Fkt_Rating',
    'Fkt_Return',
    'Nykaa',
    'Purple',
    'Puspdhan',
    'ReDesyn',
    'Website_Review'
  ]
};

// ─── 1. SHARED GLOBAL STYLESHEET INJECTOR (Fintech Dark/Light Design System) ──

(function injectDesignSystem() {
  const savedTheme = localStorage.getItem(SASTADEAL_CONFIG.STORAGE_KEYS.THEME) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.id = 'sastadeal-core-styles';
  style.textContent = `
    :root, [data-theme="dark"] {
      --bg-primary: #0f172a;
      --bg-secondary: #1e293b;
      --bg-tertiary: #26334d;
      --bg-glass: rgba(30, 41, 59, 0.82);
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --text-muted: #64748b;
      --border-color: rgba(255, 255, 255, 0.08);
      --border-hover: rgba(212, 165, 116, 0.4);
      --accent: #d4a574;
      --accent-hover: #c4956a;
      --accent-glow: rgba(212, 165, 116, 0.15);
      --accent-text: #0f172a;
      --green: #16a34a;
      --green-bg: rgba(22, 163, 74, 0.15);
      --yellow: #d97706;
      --yellow-bg: rgba(217, 119, 6, 0.15);
      --red: #dc2626;
      --red-bg: rgba(220, 38, 38, 0.15);
      --purple: #7c3aed;
      --purple-bg: rgba(124, 58, 237, 0.15);
      --cyan: #0891b2;
      --cyan-bg: rgba(8, 145, 178, 0.15);
      --brown: #a16207;
      --brown-bg: rgba(139, 69, 19, 0.25);
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
      --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.45);
    }

    [data-theme="light"] {
      --bg-primary: #f5f7fa;
      --bg-secondary: #ffffff;
      --bg-tertiary: #f1f5f9;
      --bg-glass: rgba(255, 255, 255, 0.88);
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-muted: #64748b;
      --border-color: rgba(15, 23, 42, 0.09);
      --border-hover: rgba(196, 149, 106, 0.6);
      --accent: #b88450;
      --accent-hover: #9f6e3d;
      --accent-glow: rgba(184, 132, 80, 0.14);
      --accent-text: #ffffff;
      --brown: #8B4513;
      --shadow-sm: 0 2px 6px rgba(15, 23, 42, 0.06);
      --shadow-lg: 0 12px 28px rgba(15, 23, 42, 0.12);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      transition: background-color 0.2s ease, color 0.2s ease;
    }
    .mono { font-family: 'JetBrains Mono', monospace; }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-primary); }
    ::-webkit-scrollbar-thumb { background: var(--bg-tertiary); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

    /* Toast Notifications */
    #sd-toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    }
    .sd-toast {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-left: 4px solid var(--accent);
      padding: 12px 16px;
      border-radius: 10px;
      box-shadow: var(--shadow-lg);
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      animation: sdSlideIn 0.25s ease forwards;
    }
    .sd-toast.success { border-left-color: var(--green); }
    .sd-toast.error { border-left-color: var(--red); }
    .sd-toast.warning { border-left-color: var(--yellow); }
    @keyframes sdSlideIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

// ─── 2. API ENGINE, AUTH SESSION & STALE-WHILE-REVALIDATE CACHE ───────────

const SD = {
  getToken() {
    return sessionStorage.getItem(SASTADEAL_CONFIG.STORAGE_KEYS.TOKEN) ||
           localStorage.getItem(SASTADEAL_CONFIG.STORAGE_KEYS.TOKEN) || '';
  },

  getUser() {
    const raw = sessionStorage.getItem(SASTADEAL_CONFIG.STORAGE_KEYS.USER) ||
                localStorage.getItem(SASTADEAL_CONFIG.STORAGE_KEYS.USER);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  },

  saveSession(token, user, remember = true) {
    sessionStorage.setItem(SASTADEAL_CONFIG.STORAGE_KEYS.TOKEN, token);
    sessionStorage.setItem(SASTADEAL_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    if (remember) {
      localStorage.setItem(SASTADEAL_CONFIG.STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(SASTADEAL_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  logout(redirect = 'login.html') {
    sessionStorage.clear();
    localStorage.removeItem(SASTADEAL_CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(SASTADEAL_CONFIG.STORAGE_KEYS.USER);
    if (redirect) window.location.href = redirect;
  },

  requireAuth(expectedRole) {
    const user = this.getUser();
    const token = this.getToken();
    if (!user || !token) {
      window.location.href = 'login.html';
      return null;
    }
    if (expectedRole && user.role !== expectedRole && user.role !== 'admin') {
      window.location.href = 'login.html';
      return null;
    }
    return user;
  },

  /**
   * Core API caller (uses POST with text/plain to avoid CORS preflight failures on Google Apps Script)
   */
  async api(action, payload = {}, options = {}) {
    const url = SASTADEAL_CONFIG.API_URL;
    if (!url || url.includes('YOUR_DEPLOYMENT_ID_HERE')) {
      this.toast('Please update API_URL in _config.js with your Google Apps Script Web App URL.', 'warning');
      return { success: false, error: 'API_URL not configured' };
    }

    const bodyObj = Object.assign({}, payload, {
      action: action,
      token: this.getToken()
    });

    const cacheKey = SASTADEAL_CONFIG.STORAGE_KEYS.CACHE_PREFIX + action + '_' + (this.getUser()?.userId || 'pub');

    // Return cached data immediately if requested via onCached callback
    if (options.useCache && typeof options.onCached === 'function') {
      const cachedRaw = localStorage.getItem(cacheKey);
      if (cachedRaw) {
        try {
          const parsed = JSON.parse(cachedRaw);
          options.onCached(parsed.data, parsed.timestamp);
        } catch (e) {}
      }
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(bodyObj)
      });
      const result = await response.json();

      if (result && result.code === 401) {
        this.toast('Session expired. Please login again.', 'error');
        this.logout('login.html');
        return result;
      }

      if (options.useCache && result && result.success) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: result
          }));
        } catch (storageErr) {
          // Ignore quota exceeded
        }
      }

      return result;
    } catch (err) {
      console.error('SastaDeal API Error:', err);
      return { success: false, error: 'Network error communicating with server. Check your internet or API_URL.' };
    }
  },

  // ─── 3. THEME & UI HELPERS ────────────────────────────────────────────────

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(SASTADEAL_CONFIG.STORAGE_KEYS.THEME, next);
    return next;
  },

  toast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('sd-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sd-toast-container';
      document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `sd-toast ${type}`;
    el.innerHTML = `
      <span>${this.escapeHtml(message)}</span>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:16px;">✕</button>
    `;
    container.appendChild(el);
    setTimeout(() => {
      if (el.parentElement) el.remove();
    }, duration);
  },

  escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  formatCurrency(val) {
    if (val === null || val === undefined || val === '') return '—';
    const num = Number(val);
    if (isNaN(num)) return '—';
    const sign = num < 0 ? '-' : '';
    return sign + '₹' + Math.abs(num).toLocaleString('en-IN', {
      minimumFractionDigits: num % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
  },

  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  daysBetween(startDateStr, endDateStr = null) {
    if (!startDateStr) return null;
    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date();
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  },

  /**
   * Status Badge HTML with color coding
   */
  statusBadge(status) {
    const s = String(status || 'Order Placed').trim();
    const low = s.toLowerCase();
    let bg = 'var(--cyan-bg)', color = 'var(--cyan)';

    if (low === 'got refund') {
      bg = 'var(--green-bg)'; color = '#22c55e';
    } else if (low.includes('refund form')) {
      bg = 'var(--purple-bg)'; color = '#a855f7';
    } else if (low.includes('review live') || low === 'reviewed') {
      bg = 'var(--accent-glow)'; color = 'var(--accent)';
    } else if (low.includes('received')) {
      bg = 'var(--yellow-bg)'; color = '#f59e0b';
    } else if (low.includes('cancel') || low.includes('delete') || low.includes('error') || low.includes('not delivered') || low.includes('block') || low.includes('return')) {
      bg = 'var(--red-bg)'; color = '#ef4444';
    }

    return `<span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:600;background:${bg};color:${color};white-space:nowrap;">${this.escapeHtml(s)}</span>`;
  },

  paymentBadge(paymentStatus) {
    const s = String(paymentStatus || 'Pending').trim();
    const isPaid = s.toLowerCase() === 'paid';
    const bg = isPaid ? 'var(--green-bg)' : 'var(--yellow-bg)';
    const color = isPaid ? '#22c55e' : '#f59e0b';
    return `<span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:0.75rem;font-weight:700;background:${bg};color:${color};white-space:nowrap;">${isPaid ? '✓ Paid' : '⏳ Pending'}</span>`;
  },

  /**
   * Key Business Rule #9: ActualGot color = Dark Brown (#8B4513) if less than ToGet, Green otherwise
   */
  formatActualGotHtml(actualGot, toGet) {
    if (actualGot === null || actualGot === undefined || actualGot === '') {
      return `<span style="color:var(--text-muted)">—</span>`;
    }
    const got = Number(actualGot);
    const exp = Number(toGet) || 0;
    if (got < exp) {
      return `<span class="mono" style="color:#d97706;background:var(--brown-bg);padding:2px 6px;border-radius:4px;font-weight:700;" title="Less than ToGet (₹${exp})">${this.formatCurrency(got)}</span>`;
    }
    return `<span class="mono" style="color:#22c55e;font-weight:700;">${this.formatCurrency(got)}</span>`;
  },

  copyText(text, label = 'Order ID') {
    navigator.clipboard.writeText(String(text || '')).then(() => {
      this.toast(`${label} copied: ${text}`, 'success', 2000);
    });
  },

  // ─── 4. CLIENT-SIDE IMAGE COMPRESSOR (<= 200KB) ──────────────────────────

  async compressImageFile(file, maxKB = 200, maxWidth = 1280) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.82;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);

          // Iteratively lower quality until <= 200KB
          while (dataUrl.length * 0.75 > maxKB * 1024 && quality > 0.25) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve({
            base64Data: dataUrl,
            fileName: file.name.replace(/\.[^.]+$/, '.jpg'),
            mimeType: 'image/jpeg',
            sizeKB: Math.round((dataUrl.length * 0.75) / 1024)
          });
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // ─── 5. 1-CLICK WHATSAPP WEB SENDER ──────────────────────────────────────

  openWhatsApp(phone, messageText) {
    let cleanPhone = String(phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`
      : `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank', 'noopener');
  },

  // ─── 6. UNIVERSAL CSV & XLS EXPORTER ─────────────────────────────────────

  exportToCSV(filename, headers, rowsArray) {
    const escapeCSV = val => {
      const s = String(val === null || val === undefined ? '' : val).replace(/"/g, '""');
      return `"${s}"`;
    };
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rowsArray.map(row => row.map(escapeCSV).join(','))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    link.click();
  },

  exportToXLS(filename, headers, rowsArray) {
    let tableHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1"><thead><tr>';
    headers.forEach(h => {
      tableHtml += `<th style="background:#1e293b;color:#ffffff;font-weight:bold;padding:6px;">${this.escapeHtml(h)}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';
    rowsArray.forEach(row => {
      tableHtml += '<tr>';
      row.forEach(cell => {
        tableHtml += `<td style="padding:5px;">${this.escapeHtml(cell === null || cell === undefined ? '' : cell)}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></body></html>';

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename.endsWith('.xls') ? filename : `${filename}.xls`;
    link.click();
  }
};
// Auto-Rebrand SastaDeal -> SanDeal across all pages
document.addEventListener('DOMContentLoaded', () => {
  if (document.title.includes('SastaDeal')) {
    document.title = document.title.replace(/SastaDeal/g, 'SanDeal');
  }
  document.querySelectorAll('.brand span, h1, h2, h3, p, footer').forEach(el => {
    if (el.children.length === 0 && el.textContent.includes('SastaDeal')) {
      el.textContent = el.textContent.replace(/SastaDeal/g, 'SanDeal');
    }
  });
});
/* ============================================================================
   SANDEAL PRO GLOBAL ENGINE:
   1. Universal Table Zoom & Pinch-to-Fit (65% to 100%) across Admin/Buyer/Med
   2. Clickable Notice Marquee Popup
   3. Instant Deal Push Notification + Sound Alert Watcher
   4. Auto SanDeal Rebranding
   ============================================================================ */
(function initSanDealGlobalUpgrades() {
  // Inject Global Zoom & Compact Styles
  const st = document.createElement('style');
  st.textContent = `
    .sd-zoom-bar {
      display: flex; align-items: center; justify-content: space-between;
      gap: 6px; padding: 4px 8px; margin-bottom: 4px;
      background: var(--bg-secondary); border: 1px solid var(--border-color);
      border-radius: 7px; font-size: 0.65rem; color: var(--text-secondary);
    }
    .sd-zoom-btns { display: flex; gap: 3px; align-items: center; }
    .sd-z-btn {
      padding: 2px 6px; border-radius: 5px; border: 1px solid var(--border-color);
      background: var(--bg-primary); color: var(--text-primary);
      font-size: 0.62rem; font-weight: 700; cursor: pointer; font-family: 'JetBrains Mono', monospace;
    }
    .sd-z-btn.active { background: var(--accent); color: #0b1120; border-color: var(--accent); }
    .marquee-bar { cursor: pointer; }
  `;
  document.head.appendChild(st);

  window.setSanDealTableZoom = function(wrapId, pct, btnEl) {
    const wrap = document.getElementById(wrapId);
    if (!wrap) return;
    const tbl = wrap.querySelector('table');
    if (!tbl) return;
    const scale = Number(pct) / 100;
    tbl.style.zoom = scale;
    // Fallback for browsers where CSS zoom behaves differently
    if (!('zoom' in document.body.style)) {
      tbl.style.transform = `scale(${scale})`;
      tbl.style.transformOrigin = 'top left';
      tbl.style.width = `${Math.round(100 / scale)}%`;
    }
    if (btnEl && btnEl.parentElement) {
      btnEl.parentElement.querySelectorAll('.sd-z-btn').forEach(b => b.classList.remove('active'));
      btnEl.classList.add('active');
    }
    localStorage.setItem('sandeal_tbl_zoom_' + wrapId, pct);
  };

  function attachUniversalTableZoomBars() {
    document.querySelectorAll('.table-wrap').forEach((wrap, idx) => {
      if (wrap.dataset.zoomAttached) return;
      wrap.dataset.zoomAttached = '1';
      if (!wrap.id) wrap.id = 'sdAutoTblWrap_' + idx;

      const savedPct = localStorage.getItem('sandeal_tbl_zoom_' + wrap.id) || '100';
      const bar = document.createElement('div');
      bar.className = 'sd-zoom-bar';
      bar.innerHTML = `
        <span>🔍 <strong>Table Size / Fit:</strong> (Pinch or Tap %)</span>
        <div class="sd-zoom-btns">
          ${['100', '85', '75', '65', '55'].map(p => `
            <button type="button" class="sd-z-btn ${savedPct === p ? 'active' : ''}" onclick="setSanDealTableZoom('${wrap.id}', ${p}, this)">${p === '65' ? '65% Fit' : p + '%'}</button>
          `).join('')}
        </div>
      `;
      wrap.parentNode.insertBefore(bar, wrap);
      if (savedPct !== '100') {
        setTimeout(() => window.setSanDealTableZoom(wrap.id, savedPct), 150);
      }

      // Two-Finger Pinch-In / Pinch-Out Gesture Support on Table
      let startDist = 0;
      let currentPct = Number(savedPct) || 100;
      wrap.addEventListener('touchstart', e => {
        if (e.touches.length === 2) {
          startDist = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
          );
        }
      }, { passive: true });

      wrap.addEventListener('touchmove', e => {
        if (e.touches.length === 2 && startDist > 0) {
          const dist = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
          );
          const ratio = dist / startDist;
          const nextPct = Math.min(100, Math.max(50, Math.round(currentPct * ratio)));
          window.setSanDealTableZoom(wrap.id, nextPct);
        }
      }, { passive: true });
    });
  }

  // Clickable Notice Ticker Popup
  function makeMarqueeClickable() {
    document.querySelectorAll('.marquee-bar').forEach(bar => {
      if (bar.dataset.clickBound) return;
      bar.dataset.clickBound = '1';
      bar.title = 'Tap to read full notice';
      bar.addEventListener('click', () => {
        const txtEl = bar.querySelector('.marquee-track');
        const fullText = txtEl ? txtEl.textContent : '';
        if (!fullText) return;
        const formatted = fullText.split('   •   ').map(line =>
          `<div style="background:var(--bg-primary);border-left:3px solid var(--accent);padding:9px 11px;border-radius:7px;margin-bottom:7px;font-size:0.78rem;line-height:1.45;">${SD.escapeHtml(line)}</div>`
        ).join('');

        let modal = document.getElementById('sdGlobalNoticeModal');
        if (!modal) {
          modal = document.createElement('div');
          modal.id = 'sdGlobalNoticeModal';
          modal.className = 'modal-backdrop';
          modal.onclick = e => { if (e.target === modal) modal.classList.remove('open'); };
          modal.innerHTML = `
            <div class="modal-box" style="max-width:430px;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <h3 style="font-size:0.95rem;">📢 SanDeal Notice Board</h3>
                <button onclick="document.getElementById('sdGlobalNoticeModal').classList.remove('open')" style="background:none;border:none;color:var(--text-secondary);font-size:1.1rem;cursor:pointer;">✕</button>
              </div>
              <div id="sdGlobalNoticeBody"></div>
            </div>
          `;
          document.body.appendChild(modal);
        }
        document.getElementById('sdGlobalNoticeBody').innerHTML = formatted;
        modal.classList.add('open');
      });
    });
  }

  // Deal Push Alert Subscription & Chime Sound
  window.playSanDealChime = function() {
    try {
      const hr = new Date().getHours();
      if (hr >= 23 || hr < 7) return; // Silent DND at night
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.36);
      });
    } catch (e) {}
  };

  window.toggleSanDealPushAlerts = async function(btnEl) {
    if (!('Notification' in window)) {
      SD.toast('Deal Alerts enabled in-app!', 'success');
      localStorage.setItem('sandeal_push_subscribed', '1');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      localStorage.setItem('sandeal_push_subscribed', '1');
      window.playSanDealChime();
      SD.toast('🔔 Instant Deal Alerts Activated! You will be notified whenever a deal goes live.', 'success', 4000);
      if (btnEl) btnEl.innerHTML = '🔔 Alerts ON';
      try {
        new Notification('🔥 SanDeal Alerts Active!', {
          body: 'You will get instant notifications whenever new deals are posted or reactivated.',
          icon: 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png'
        });
      } catch (e) {}
    } else {
      SD.toast('Please allow Notification permission in browser settings.', 'warning');
    }
  };

  window.checkNewDealsForPushAlert = function(dealsList) {
    if (!Array.isArray(dealsList) || !dealsList.length) return;
    const activeIds = dealsList.filter(d => String(d.status || 'active').toLowerCase() === 'active').map(d => d.dealId);
    const prevRaw = localStorage.getItem('sandeal_seen_active_deals');
    if (prevRaw) {
      try {
        const prevSet = new Set(JSON.parse(prevRaw));
        const newlyAdded = dealsList.filter(d => String(d.status || 'active').toLowerCase() === 'active' && !prevSet.has(d.dealId));
        if (newlyAdded.length > 0) {
          const topDeal = newlyAdded[0];
          window.playSanDealChime();
          SD.toast(`🔥 NEW DEAL LIVE: ${topDeal.title} (${topDeal.platform})!`, 'success', 6000);
          if (localStorage.getItem('sandeal_push_subscribed') === '1' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`🔥 New Deal on SanDeal (${topDeal.platform})`, {
              body: `${topDeal.title} ${Number(topDeal.price) > 0 ? '— Get ₹' + topDeal.youGet : '— Tap to view photo & request!'}`,
              icon: topDeal.imageUrl || 'https://cdn-icons-png.flaticon.com/512/1170/1170678.png'
            });
          }
        }
      } catch (e) {}
    }
    localStorage.setItem('sandeal_seen_active_deals', JSON.stringify(activeIds));
  };

  document.addEventListener('DOMContentLoaded', () => {
    attachUniversalTableZoomBars();
    makeMarqueeClickable();
    setTimeout(attachUniversalTableZoomBars, 1200);
  });
})();
// Smart Multi-Category Auto-Detector for SanDeal Deals
window.detectSanDealCategories = function(titleStr, instStr = '') {
  const txt = `${titleStr || ''} ${instStr || ''}`.toLowerCase();
  const cats = new Set();

  // Check explicit tag first e.g. [Cat: Clothing, Kids]
  const explicit = (instStr || '').match(/\[Cat:\s*([^\]]+)\]/i);
  if (explicit && explicit[1]) {
    explicit[1].split(',').forEach(c => cats.add(c.trim()));
  }

  if (/\b(shirt|t-shirt|tshirt|kurta|kurti|saree|dress|jeans|trouser|top|lehenga|hoodie|jacket|suit|apparel|fashion|wear|bra|brief|pant|legging|cotton|rayon|frock)\b/i.test(txt)) {
    cats.add('👗 Clothing');
  }
  if (/\b(kid|baby|child|toy|train|scooter|infant|newborn|boy|girl|diaper|stroller|potty|puzzle|game|school)\b/i.test(txt)) {
    cats.add('🧸 Kids & Toys');
  }
  if (/\b(home|kitchen|mop|cleaner|candle|container|jar|bottle|lunch|tiffin|heater|purifier|pillow|bedsheet|blanket|towel|organizer|rack|lamp|decor|pan|cooker|mixer|grinder)\b/i.test(txt)) {
    cats.add('🏠 Home & Kitchen');
  }
  if (/\b(watch|earbud|speaker|boat|dashcam|camera|powerbank|charger|cable|hub|adapter|phone|mobile|laptop|mouse|keyboard|trimmer|shaver|dryer|led|electronic)\b/i.test(txt)) {
    cats.add('📱 Electronics');
  }
  if (/\b(cream|serum|shampoo|oil|face|skin|hair|roll-on|perfume|makeup|lipstick|lotion|soap|grooming|massager|comb)\b/i.test(txt)) {
    cats.add('💄 Beauty & Care');
  }

  if (cats.size === 0) cats.add('🔥 General Deals');
  return Array.from(cats);
};
