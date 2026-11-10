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
    const scale = Number(pct) / 100;

    // Apply zoom to main table AND to both Dual-Swipe tables if Dual-Swipe is active!
    const targets = [wrap.querySelector('table')];
    const dualBox = document.getElementById('sdDualSplitContainer');
    if (dualBox) {
      dualBox.querySelectorAll('table').forEach(t => targets.push(t));
    }

    targets.filter(Boolean).forEach(tbl => {
      tbl.style.zoom = scale;
      if (!('zoom' in document.body.style)) {
        tbl.style.transform = `scale(${scale})`;
        tbl.style.transformOrigin = 'top left';
        tbl.style.width = `${Math.round(100 / scale)}%`;
      }
    });

    if (btnEl && btnEl.parentElement) {
      btnEl.parentElement.querySelectorAll('.sd-z-btn:not(.sd-dual-btn)').forEach(b => b.classList.remove('active'));
      btnEl.classList.add('active');
    }
    localStorage.setItem('sandeal_tbl_zoom_' + wrapId, pct);

    // Re-sync row heights after zoom change so Left & Right stay 100% aligned!
    if (typeof window.syncDualPaneRowHeights === 'function') {
      setTimeout(window.syncDualPaneRowHeights, 60);
    }
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
/* ============================================================================
   SANDEAL DUAL-SWIPE FREEZE PANE ENGINE (INDEPENDENT LEFT & RIGHT SWIPE)
   - Allows swiping left/right directly on the Left Frozen Columns to reveal
     Order ID <-> Product <-> Account without losing Right-side scroll position!
   - Also provides a 1-Tap True Split-Pane Dual Horizontal Scrollbar mode.
   ============================================================================ */
   
  (function initSanDealDualSwipeTables() {
  const st = document.createElement('style');
  st.textContent = `
    /* Single-Table Unified Dual-Swipe Mode:
       Left sticky cell becomes an independent horizontal scroll strip containing Order ID + Product + Account,
       while staying inside the EXACT SAME <tr> row so heights & zoom NEVER mismatch! */
    .sd-single-dual-strip {
      display: flex !important;
      align-items: center;
      gap: 10px;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      max-width: 175px;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
      padding: 2px 4px;
    }
    .sd-single-dual-strip::-webkit-scrollbar {
      height: 3px;
    }
    .sd-single-dual-strip::-webkit-scrollbar-thumb {
      background: var(--accent);
      border-radius: 3px;
    }
    .sd-dual-item {
      flex: 0 0 auto;
      white-space: nowrap;
      padding-right: 8px;
      border-right: 1px dashed var(--border-color);
    }
    .sd-dual-item:last-child {
      border-right: none;
      padding-right: 2px;
    }
  `;
  document.head.appendChild(st);

  function getActiveOrderTableWrap() {
    return document.getElementById('adminTableWrap') || document.getElementById('tableViewWrap');
  }

  // Convert sticky-col-2 inside the SAME table into an independently scrollable horizontal strip (Order ID <-> Product <-> Account)
  window.applySingleTableDualSwipe = function() {
    const wrap = getActiveOrderTableWrap();
    if (!wrap) return;

    // Remove any old split container if present
    const oldSplit = document.getElementById('sdDualSplitContainer');
    if (oldSplit) oldSplit.remove();
    wrap.style.display = 'block';

    if (wrap.dataset.dualMode !== '1') return;

    const tbl = wrap.querySelector('table');
    if (!tbl) return;

    const headerCells = Array.from(tbl.querySelectorAll('thead th'));
    let ordIdIdx = -1, prodIdx = -1, accIdx = -1, sticky2Idx = -1;

    headerCells.forEach((th, idx) => {
      const txt = (th.textContent || '').toLowerCase();
      if (th.classList.contains('sticky-col-2')) sticky2Idx = idx;
      if (txt.includes('order id')) ordIdIdx = idx;
      else if (txt.includes('product')) prodIdx = idx;
      else if (txt.includes('account')) accIdx = idx;
    });

    const targetStickyIdx = sticky2Idx >= 0 ? sticky2Idx : (ordIdIdx >= 0 ? ordIdIdx : prodIdx);
    if (targetStickyIdx < 0) return;

    const mergeIndices = [ordIdIdx, prodIdx, accIdx].filter(i => i >= 0 && i !== targetStickyIdx);

    // 1. Update Header cell to show combined scrollable header
    const mainTh = headerCells[targetStickyIdx];
    if (mainTh && !mainTh.dataset.dualMerged) {
      mainTh.dataset.dualMerged = '1';
      mainTh.classList.add('sticky-col-2');
      const labels = [mainTh.innerHTML];
      mergeIndices.forEach(i => {
        if (headerCells[i]) {
          labels.push(headerCells[i].innerHTML);
          headerCells[i].style.display = 'none';
        }
      });
      mainTh.innerHTML = `<div class="sd-single-dual-strip" title="Swipe Left/Right here independently!">${labels.map(l => `<span class="sd-dual-item">${l}</span>`).join('')}</div>`;
    }

    // 2. Update every Body row's sticky-col-2 cell to hold the horizontal swipe strip of (Order ID + Product + Account)
    tbl.querySelectorAll('tbody tr').forEach(tr => {
      const cells = Array.from(tr.children);
      const mainTd = cells[targetStickyIdx];
      if (!mainTd || mainTd.dataset.dualMerged) return;
      mainTd.dataset.dualMerged = '1';
      mainTd.classList.add('sticky-col-2');

      const parts = [`<div class="sd-dual-item">${mainTd.innerHTML}</div>`];
      mergeIndices.forEach(i => {
        if (cells[i]) {
          parts.push(`<div class="sd-dual-item">${cells[i].innerHTML}</div>`);
          cells[i].style.display = 'none';
        }
      });

      mainTd.innerHTML = `<div class="sd-single-dual-strip" onclick="event.stopPropagation()">${parts.join('')}</div>`;
    });

    // Sync horizontal scrolling across all left-pinned strips when swiping any one of them!
    const strips = Array.from(tbl.querySelectorAll('.sd-single-dual-strip'));
    let syncingLeft = false;
    strips.forEach(strip => {
      strip.addEventListener('scroll', () => {
        if (syncingLeft) return;
        syncingLeft = true;
        const sl = strip.scrollLeft;
        for (let i = 0; i < strips.length; i++) {
          if (strips[i] !== strip) strips[i].scrollLeft = sl;
        }
        requestAnimationFrame(() => { syncingLeft = false; });
      }, { passive: true });
    });
  };

  window.toggleSanDealDualPaneMode = function(btnEl) {
    const wrap = getActiveOrderTableWrap();
    if (!wrap) return;
    const isDual = wrap.dataset.dualMode === '1';

    if (isDual) {
      wrap.dataset.dualMode = '0';
      if (btnEl) btnEl.classList.remove('active');
      if (typeof renderAdminOrders === 'function') renderAdminOrders();
      if (typeof renderBuyerOrders === 'function') renderBuyerOrders();
      SD.toast('Standard Table View restored', 'info', 1400);
      return;
    }

    // Ensure Order ID, Product & Account columns are enabled before merging into Dual-Swipe strip
    if (typeof colConfig !== 'undefined' && colConfig.cols) {
      colConfig.cols.platformOrderId.show = true;
      colConfig.cols.productName.show = true;
      colConfig.cols.accountName.show = true;
      if (colConfig.freezeSecond === 'NONE') colConfig.freezeSecond = 'platformOrderId';
    }
    if (typeof buyerColCfg !== 'undefined' && buyerColCfg.cols) {
      buyerColCfg.cols.platformOrderId.show = true;
      buyerColCfg.cols.productName.show = true;
      buyerColCfg.cols.accountName.show = true;
      if (buyerColCfg.freezeSecond === 'NONE') buyerColCfg.freezeSecond = 'platformOrderId';
    }

    wrap.dataset.dualMode = '1';
    if (btnEl) btnEl.classList.add('active');
    if (typeof renderAdminOrders === 'function') renderAdminOrders();
    if (typeof renderBuyerOrders === 'function') renderBuyerOrders();
    window.applySingleTableDualSwipe();
    SD.toast('↔️ Dual-Swipe ON: Swipe inside the Left Pinned column & Right columns independently!', 'success', 2200);
  };

  function injectDualSwipeButton() {
    document.querySelectorAll('.sd-zoom-bar .sd-zoom-btns').forEach(btnGroup => {
      if (btnGroup.querySelector('.sd-dual-btn')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sd-z-btn sd-dual-btn';
      btn.style.borderColor = 'var(--accent)';
      btn.innerHTML = '↔️ Dual Swipe';
      btn.title = 'Swipe Left Pinned columns (Order ID + Product + Account) & Right columns separately';
      btn.onclick = function() { window.toggleSanDealDualPaneMode(this); };
      btnGroup.appendChild(btn);
    });

    if (typeof window.renderAdminOrders === 'function' && !window.renderAdminOrders._dualHooked) {
      const origAdmin = window.renderAdminOrders;
      window.renderAdminOrders = function() {
        origAdmin.apply(this, arguments);
        if (document.getElementById('adminTableWrap')?.dataset.dualMode === '1') {
          window.applySingleTableDualSwipe();
        }
      };
      window.renderAdminOrders._dualHooked = true;
    }

    if (typeof window.renderBuyerOrders === 'function' && !window.renderBuyerOrders._dualHooked) {
      const origBuyer = window.renderBuyerOrders;
      window.renderBuyerOrders = function() {
        origBuyer.apply(this, arguments);
        if (document.getElementById('tableViewWrap')?.dataset.dualMode === '1') {
          window.applySingleTableDualSwipe();
        }
      };
      window.renderBuyerOrders._dualHooked = true;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectDualSwipeButton, 500);
    setTimeout(injectDualSwipeButton, 1600);
  });
})();


        
/* ============================================================================
   SANDEAL ULTRA-ADVANCED SUITE (7 NEXT-GEN FEATURES + DEAD/CANCELLED CLASSIFIER)
   ============================================================================ */
(function initSanDealUltraSuite() {
  // 1. Universal Dead / Cancelled / Moderation Order Detector
  SD.isDeadOrCancelledOrder = function(statusStr) {
    const s = String(statusStr || '').trim().toLowerCase();
    if (!s) return false;
    return (
      s.includes('cancel') ||
      s.includes('not delivered') ||
      s.includes('returned to seller') ||
      s.includes('return') ||
      s.includes('not live') ||
      s.includes('deleted') ||
      s.includes('moderation') ||
      s.includes('block') ||
      s.includes('error')
    );
  };

  // 2. Feature #7: 1-Tap UPI Deep-Link Pay + Dynamic UPI QR Code Modal
  window.openSanDealUpiPayModal = function(upiId, payeeName, amount, noteText = 'SanDeal Payout') {
    const cleanUpi = String(upiId || '').trim();
    const amt = Math.max(0, Number(amount) || 0);
    if (!cleanUpi) {
      SD.toast('⚠️ Please enter a UPI ID or Mobile Number first!', 'warning');
      return;
    }
    const finalPa = cleanUpi.includes('@') ? cleanUpi : `${cleanUpi.replace(/\D/g, '').slice(-10)}@ybl`;
    const upiUri = `upi://pay?pa=${encodeURIComponent(finalPa)}&pn=${encodeURIComponent(payeeName || 'SanDeal Partner')}&am=${amt.toFixed(2)}&cu=INR&tn=${encodeURIComponent(noteText)}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}`;

    let modal = document.getElementById('sdUpiQrPayModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'sdUpiQrPayModal';
      modal.className = 'modal-backdrop';
      modal.onclick = e => { if (e.target === modal) modal.classList.remove('open'); };
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-box" style="max-width:370px;text-align:center;" onclick="event.stopPropagation()">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="font-size:0.94rem;">⚡ SanDeal Instant UPI Pay & QR</h3>
          <button onclick="document.getElementById('sdUpiQrPayModal').classList.remove('open')" style="background:none;border:none;color:var(--text-secondary);font-size:1.1rem;cursor:pointer;">✕</button>
        </div>
        <div style="font-size:0.76rem;color:var(--text-secondary);margin-bottom:4px;">Payee: <strong style="color:var(--text-primary);">${SD.escapeHtml(payeeName)}</strong></div>
        <div class="mono" style="font-size:0.72rem;color:var(--cyan);margin-bottom:8px;">UPI: ${SD.escapeHtml(finalPa)} 📋</div>
        <div class="mono" style="font-size:1.45rem;font-weight:900;color:#22c55e;margin-bottom:10px;">₹${amt.toLocaleString('en-IN')}</div>
        <div style="background:#fff;padding:10px;border-radius:12px;display:inline-block;margin-bottom:10px;">
          <img src="${qrApiUrl}" alt="UPI QR" style="width:190px;height:190px;display:block;" />
        </div>
        <div style="font-size:0.66rem;color:var(--text-muted);margin-bottom:10px;">Scan with any UPI App or tap below on mobile</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <a href="${upiUri}" class="btn primary" style="justify-content:center;padding:9px;text-decoration:none;grid-column:1/-1;">🚀 1-Tap Pay via GPay / PhonePe / Paytm</a>
          <button type="button" class="btn" style="justify-content:center;" onclick="SD.copyText('${SD.escapeHtml(finalPa)}','UPI ID')">📋 Copy UPI</button>
          <button type="button" class="btn" style="justify-content:center;" onclick="SD.copyText('${amt}','Amount')">📋 Copy ₹${amt}</button>
        </div>
      </div>
    `;
    modal.classList.add('open');
  };

  // 3. Feature #4: Account Health & Review Risk Calculator
  window.computeSanDealAccountHealth = function(userId, ordersList) {
    const uid = String(userId || '').toLowerCase();
    const myOrds = (ordersList || []).filter(o => String(o.userId || '').toLowerCase() === uid);
    const recent7d = myOrds.filter(o => o.orderDate && (SD.daysBetween(o.orderDate) || 0) <= 7 && !SD.isDeadOrCancelledOrder(o.orderStatus));
    const blockedEver = myOrds.some(o => String(o.orderStatus || '').toLowerCase().includes('block') || String(o.orderStatus || '').toLowerCase().includes('deleted'));

    if (blockedEver || recent7d.length >= 4) {
      return { label: `🔴 High Risk (${recent7d.length}/7d)`, color: '#ef4444', bg: 'rgba(239,68,68,0.16)', tip: 'Give this account 5 days rest or use Only-Order deals' };
    }
    if (recent7d.length >= 2) {
      return { label: `🟡 Warm (${recent7d.length}/7d)`, color: '#f59e0b', bg: 'rgba(245,158,11,0.16)', tip: '2–3 orders in last 7 days' };
    }
    return { label: `🟢 Safe (${recent7d.length}/7d)`, color: '#22c55e', bg: 'rgba(34,197,94,0.15)', tip: 'Healthy account for review deals' };
  };

  // 4. Feature #8: Multi-Language Hindi Voice Assistant for Buyers
  window.speakSanDealHindiGuide = function(orderObj) {
    if (!('speechSynthesis' in window)) {
      SD.toast('Voice guide not supported on this browser.', 'warning');
      return;
    }
    window.speechSynthesis.cancel();
    let msg = '';
    if (!orderObj) {
      msg = 'नमस्ते! सैन डील पोर्टल में आपका स्वागत है। यहाँ आप अपने सभी ऑर्डर्स का स्टेटस, रिफंड और नई डील्स देख सकते हैं। किसी भी ऑर्डर का प्रूफ अपलोड करने के लिए सबमिट प्रूफ बटन दबाएं।';
    } else {
      const st = String(orderObj.orderStatus || '').toLowerCase();
      const pay = String(orderObj.paymentStatus || '').toLowerCase();
      if (pay === 'paid') {
        msg = `ऑर्डर नंबर ${orderObj.orderNo} का ${orderObj.buyerActualGot || orderObj.buyerToGet} रुपये पेमेंट आपके अकाउंट में भेजा जा चुका है। धन्यवाद!`;
      } else if (st === 'got refund') {
        msg = `बधाई हो! ऑर्डर नंबर ${orderObj.orderNo} का रिफंड अप्रूव हो चुका है। बहुत जल्द ${orderObj.buyerToGet} रुपये आपके यूपीआई में ट्रांसफर कर दिए जाएंगे।`;
      } else if (st === 'order placed') {
        msg = `ऑर्डर नंबर ${orderObj.orderNo} अभी प्लेस हुआ है। प्रोडक्ट डिलीवर होने के बाद कृपया प्रूफ बटन दबाकर डिलीवरी अपडेट करें।`;
      } else if (st === 'product received') {
        msg = `ऑर्डर नंबर ${orderObj.orderNo} डिलीवर हो चुका है। कृपया अमेज़न या फ्लिपकार्ट पर इसकी रेटिंग या रिव्यू सबमिट करें।`;
      } else if (SD.isDeadOrCancelledOrder(st)) {
        msg = `ऑर्डर नंबर ${orderObj.orderNo} कैंसिल या नॉट डिलीवर्ड है, इसलिए इसका रिफंड लागू नहीं है।`;
      } else {
        msg = `ऑर्डर नंबर ${orderObj.orderNo} पर काम चल रहा है। रिफंड फॉर्म भरने के बाद रिफंड आते ही आपको पेमेंट मिल जाएगा।`;
      }
    }
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = 'hi-IN';
    u.rate = 0.98;
    window.speechSynthesis.speak(u);
    SD.toast('🔊 बोलकर जानकारी दी जा रही है...', 'info', 3000);
  };

    // 5. Feature #1: Smart Auto-OCR Screenshot Reader (Auto-fills Order ID, Price & Platform + Shows Match Status)
  window.scanSanDealScreenshotOCR = async function(base64Img, targetOrderIdInputId, targetPriceInputId, targetPlatformInputId, statusBannerId) {
    if (!base64Img) { SD.toast('Please select an order screenshot first!', 'warning'); return; }
    const banner = statusBannerId ? document.getElementById(statusBannerId) : null;
    if (banner) {
      banner.style.display = 'block';
      banner.style.color = 'var(--accent)';
      banner.innerHTML = '⏳ <strong>AI OCR Scanning Screenshot...</strong> Reading Order ID, Price & Platform from image above...';
    }
    SD.toast('🔍 Scanning Screenshot for Order ID & Price...', 'info', 3000);

    try {
      if (!window.Tesseract) {
        await new Promise((res, rej) => {
          const sc = document.createElement('script');
          sc.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
          sc.onload = res; sc.onerror = rej;
          document.head.appendChild(sc);
        });
      }
      const { data: { text } } = await window.Tesseract.recognize(base64Img, 'eng');
      const cleanTxt = String(text || '');

      // 1. Detect Platform Order ID (Amazon 404-..., Flipkart OD..., Myntra/Meesho)
      const idMatch = cleanTxt.match(/\b\d{3}\s*-\s*\d{7}\s*-\s*\d{7}\b/) ||
                      cleanTxt.match(/\bOD\d{14,22}\b/i) ||
                      cleanTxt.match(/\bORD\d{8,16}\b/i);
      const foundId = idMatch ? idMatch[0].replace(/\s+/g, '') : '';

      // 2. Detect Price Paid
      const priceMatch = cleanTxt.match(/(?:Total|Order Total|Grand Total|Amount|Paid|Rs\.?|INR|₹)\s*[:=-]?\s*₹?\s*([\d,]{2,7}(?:\.\d{1,2})?)/i) ||
                         cleanTxt.match(/₹\s*([\d,]{2,7}(?:\.\d{1,2})?)/);
      const foundPrice = (priceMatch && priceMatch[1]) ? priceMatch[1].replace(/,/g, '') : '';

      // 3. Auto-detect Platform
      let foundPlat = '';
      if (/\b\d{3}-\d{7}-\d{7}\b/.test(foundId) || /amazon/i.test(cleanTxt)) foundPlat = 'Amazon';
      else if (/^OD\d+/i.test(foundId) || /flipkart/i.test(cleanTxt)) foundPlat = 'Flipkart';
      else if (/myntra/i.test(cleanTxt)) foundPlat = 'Myntra';
      else if (/meesho/i.test(cleanTxt)) foundPlat = 'Meesho';
      else if (/blinkit/i.test(cleanTxt)) foundPlat = 'Blinkit';

          if (foundId && document.getElementById(targetOrderIdInputId)) {
      const el = document.getElementById(targetOrderIdInputId);
      el.value = foundId;
      el.style.borderColor = '#22c55e';
      el.dispatchEvent(new Event('input'));
    }

      if (foundPrice && document.getElementById(targetPriceInputId)) {
        const el = document.getElementById(targetPriceInputId);
        el.value = foundPrice;
        el.style.borderColor = '#22c55e';
        if (typeof calcAdminAddMath === 'function') calcAdminAddMath();
        if (typeof calcBuyerAddMath === 'function') calcBuyerAddMath();
      }
      if (foundPlat && targetPlatformInputId && document.getElementById(targetPlatformInputId)) {
        document.getElementById(targetPlatformInputId).value = foundPlat;
      }

      if (banner) {
        if (foundId || foundPrice) {
          banner.style.color = '#22c55e';
          banner.innerHTML = `✅ <strong>Auto-Filled from Screenshot:</strong> Order ID: <u>${foundId || 'Check manually'}</u> | Price: <u>${foundPrice ? '₹' + foundPrice : 'Check manually'}</u> ${foundPlat ? '| Platform: ' + foundPlat : ''} — <em>Please verify with the preview image above!</em>`;
        } else {
          banner.style.color = '#f59e0b';
          banner.innerHTML = `⚠️ <strong>Preview Ready above:</strong> Could not auto-read clear digits. Please look at the preview image above & verify fields below.`;
        }
      }
    } catch (e) {
      if (banner) {
        banner.style.color = '#f59e0b';
        banner.innerHTML = '⚠️ Screenshot attached above. Please verify Order ID & Price below.';
      }
    }
  };
})();
