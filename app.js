/* ═══════════════════════════════════════════════════════════
   MOÉ MOVES — app.js
   All interactive functionality for the website
═══════════════════════════════════════════════════════════ */

/* ── NAV ──────────────────────────────────────────────────── */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// Highlight active nav link on scroll
window.addEventListener('scroll', () => {
  const sections = ['home','services','about','pricing','gallery','testimonials','faq','book','contact'];
  const y = window.scrollY + 80;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.offsetTop <= y && el.offsetTop + el.offsetHeight > y) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
});

/* ── FAQ ──────────────────────────────────────────────────── */
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

/* ── PRICE LIST ACCORDION ─────────────────────────────────── */
function toggleAcc(bodyId, chevId) {
  document.getElementById(bodyId).classList.toggle('open');
  document.getElementById(chevId).classList.toggle('open');
}

/* ── BOOKING FORM ─────────────────────────────────────────── */
let curStep = 0;
let pkgRange = null;
let pkgName  = '';

// Set minimum date to today
window.addEventListener('DOMContentLoaded', () => {
  const dt = document.getElementById('fdt');
  if (dt) dt.min = new Date().toISOString().split('T')[0];
});

function goStep(n) {
  if (n > curStep && !validateStep(curStep)) return;
  document.getElementById('fp' + curStep).classList.remove('active');
  curStep = n;
  document.getElementById('fp' + n).classList.add('active');
  for (let i = 0; i < 5; i++) {
    const tab = document.getElementById('fs' + i);
    if (!tab) continue;
    tab.className = 'fstep' + (i === n ? ' active' : i < n ? ' done' : '');
  }
  if (n === 4) buildSummary();
  document.getElementById('book').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function validateStep(step) {
  if (step === 0) {
    if (!gv('fn')) { alert('Please enter your full name.'); return false; }
    if (!gv('fp')) { alert('Please enter your phone number.'); return false; }
  }
  if (step === 1) {
    if (!gv('ffr')) { alert('Please enter your current address area.'); return false; }
    if (!gv('fto')) { alert('Please enter the destination area.'); return false; }
    if (!gv('fdt')) { alert('Please select a preferred move date.'); return false; }
  }
  return true;
}

// Helpers
function gv(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

function pp(groupId, el) {
  document.querySelectorAll('#' + groupId + ' .fpill').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
}

function gp(groupId) {
  const el = document.querySelector('#' + groupId + ' .fpill.on');
  return el ? el.dataset.v : '';
}

function fc(el) {
  el.classList.toggle('on');
  el.querySelector('.fchkbox').textContent = el.classList.contains('on') ? '✓' : '';
  updateQuote();
}

function gchk(groupId) {
  return [...document.querySelectorAll('#' + groupId + ' .fchk.on')].map(e => e.dataset.v);
}

// Package selection
function fpkg(el, name, range) {
  document.querySelectorAll('.pkggrid .pkg').forEach(c => c.classList.remove('on'));
  el.classList.add('on');
  pkgName  = name;
  pkgRange = range;
  updateQuote();
}

// Live quote calculator
function updateQuote() {
  if (!pkgRange) return;
  if (pkgName === 'Corporate') {
    showQ('fqbox', 'fqamt', 'Custom — we will assess your needs');
    showQ('fqbox2', 'fqamt2', 'Custom Quote');
    showQ('fqbox3', 'fqamt3', 'Custom Quote');
    return;
  }
  let lo = pkgRange[0], hi = pkgRange[1];

  // Home size modifier
  const sz = document.getElementById('fsz') ? document.getElementById('fsz').value : '';
  if (sz.includes('3 Bed'))    { lo *= 1.10; hi *= 1.15; }
  if (sz.includes('4 Bed'))    { lo *= 1.18; hi *= 1.22; }
  if (sz.includes('5 Bed'))    { lo *= 1.28; hi *= 1.35; }
  if (sz.includes('Office'))   { lo *= 1.20; hi *= 1.30; }

  // Distance modifier
  const dist = gp('gpd');
  if (dist === 'Across Ilorin') { lo += 8000;  hi += 15000; }
  if (dist === 'Nearby town')   { lo += 20000; hi += 40000; }

  // Floor modifier
  const fl = gp('gpfl');
  if (fl === '1st floor')  { lo += 5000;  hi += 8000;  }
  if (fl === '2nd floor+') { lo += 10000; hi += 16000; }

  // Heavy items
  lo += gchk('ghv').length * 2000;
  hi += gchk('ghv').length * 4000;

  // Artisan services
  const artisans = ['Painting', 'Plumbing', 'Electrical', 'Furniture Assembly'];
  const artCount = gchk('gsv').filter(s => artisans.some(a => s.includes(a))).length;
  lo += artCount * 8000;
  hi += artCount * 20000;

  lo = Math.round(lo / 1000) * 1000;
  hi = Math.round(hi / 1000) * 1000;
  const label = '₦' + (lo / 1000) + 'k – ₦' + (hi / 1000) + 'k';
  showQ('fqbox',  'fqamt',  label);
  showQ('fqbox2', 'fqamt2', label);
  showQ('fqbox3', 'fqamt3', label);
}

function showQ(boxId, amtId, label) {
  const box = document.getElementById(boxId);
  const amt = document.getElementById(amtId);
  if (box) box.style.display = 'flex';
  if (amt) amt.textContent = label;
}

// Build summary on step 4
function buildSummary() {
  setSumm('ss-name',   gv('fn'));
  setSumm('ss-phone',  gv('fp'));
  setSumm('ss-wa',     gv('fw') || 'Same as phone');
  setSumm('ss-type',   gp('gpt') || '—');
  setSumm('ss-size',   (document.getElementById('fsz') || {}).value || '—');
  setSumm('ss-fromto', gv('ffr') + ' → ' + gv('fto'));
  setSumm('ss-date',   gv('fdt'));
  setSumm('ss-svcs',   gchk('gsv').join(', ') || 'None');
  setSumm('ss-pkg',    pkgName || '—');
  setSumm('ss-budget', gp('gpb') || '—');
  updateQuote();
}

function setSumm(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// Submit form
function fSubmit() {
  const booking = {
    id:          Date.now(),
    submittedAt: new Date().toLocaleString(),
    status:      'pending',
    name:        gv('fn'),
    phone:       gv('fp'),
    whatsapp:    gv('fw') || gv('fp'),
    email:       gv('fe'),
    source:      gp('gps'),
    moveType:    gp('gpt'),
    homeSize:    (document.getElementById('fsz') || {}).value || '',
    from:        gv('ffr'),
    to:          gv('fto'),
    distance:    gp('gpd'),
    date:        gv('fdt'),
    time:        (document.getElementById('ftm') || {}).value || '',
    floor:       gp('gpfl'),
    services:    gchk('gsv'),
    heavyItems:  gchk('ghv'),
    fragile:     gv('ffrag'),
    package:     pkgName,
    budget:      gp('gpb'),
    notes:       gv('fnotes'),
    estimatedQuote: (document.getElementById('fqamt') || {}).textContent || ''
  };

  // Save to localStorage for admin dashboard
  try {
    const all = JSON.parse(localStorage.getItem('mm_bookings') || '[]');
    all.unshift(booking);
    localStorage.setItem('mm_bookings', JSON.stringify(all));
  } catch(e) {}

  // Submit to Netlify Forms
  const fd = new FormData();
  fd.append('form-name',       'moemoves-booking');
  fd.append('full-name',       booking.name);
  fd.append('phone',           booking.phone);
  fd.append('whatsapp',        booking.whatsapp);
  fd.append('email',           booking.email);
  fd.append('source',          booking.source);
  fd.append('move-type',       booking.moveType);
  fd.append('home-size',       booking.homeSize);
  fd.append('move-from',       booking.from);
  fd.append('move-to',         booking.to);
  fd.append('distance',        booking.distance);
  fd.append('move-date',       booking.date);
  fd.append('move-time',       booking.time);
  fd.append('floor-level',     booking.floor);
  fd.append('services',        booking.services.join(', '));
  fd.append('heavy-items',     booking.heavyItems.join(', '));
  fd.append('fragile-items',   booking.fragile);
  fd.append('package',         booking.package);
  fd.append('budget',          booking.budget);
  fd.append('estimated-quote', booking.estimatedQuote);
  fd.append('notes',           booking.notes);

  fetch('/', { method: 'POST', body: fd }).catch(() => {});

  // Show success
  document.querySelectorAll('.fpanel').forEach(p => p.style.display = 'none');
  document.querySelector('.form-steps').style.display = 'none';
  document.getElementById('fsucc').style.display = 'block';
  document.getElementById('fsucc-name').textContent    = booking.name;
  document.getElementById('fsucc-contact').textContent = booking.whatsapp;

  // Google Calendar link
  const d = booking.date.replace(/-/g, '');
  if (d) {
    const title   = encodeURIComponent("Moé Moves — " + booking.name + "'s Move");
    const details = encodeURIComponent('From ' + booking.from + ' to ' + booking.to + '. Package: ' + booking.package);
    const loc     = encodeURIComponent(booking.from + ', Ilorin, Kwara State');
    document.getElementById('fcal-link').href =
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + title +
      '&dates=' + d + '/' + d + '&details=' + details + '&location=' + loc;
  }

  // WhatsApp message — REPLACE NUMBER BELOW WITH YOUR ACTUAL NUMBER
  const msg = encodeURIComponent(
    'Hello Moé Moves! I just submitted a booking request.\n' +
    'Name: ' + booking.name + '\n' +
    'Date: ' + booking.date + '\n' +
    'From: ' + booking.from + ' → ' + booking.to + '\n' +
    'Package: ' + booking.package
  );
  document.getElementById('fwa-link').href = 'https://wa.me/2348000000000?text=' + msg;

  showQ('fqbox3', 'fqamt3', (document.getElementById('fqamt') || {}).textContent || '');
}

/* ── ADMIN DASHBOARD ──────────────────────────────────────── */
const ADMIN_PASSWORD = 'moemoves2026'; // CHANGE THIS TO YOUR OWN PASSWORD
let adminLoggedIn = false;

function showOwnerLogin() {
  document.getElementById('staff-login-list-wrap').style.display = 'none';
  document.getElementById('staff-pin-wrap').style.display        = 'none';
  document.getElementById('owner-login-wrap').style.display      = 'block';
  setTimeout(() => {
    const pw = document.getElementById('admin-pw');
    if (pw) { pw.value = ''; pw.focus(); }
  }, 100);
}

function showStaffLogin() {
  document.getElementById('staff-login-list-wrap').style.display = 'none';
  document.getElementById('owner-login-wrap').style.display      = 'none';
  document.getElementById('staff-pin-wrap').style.display        = 'block';
  const nameInput = document.getElementById('staff-name-input');
  if (nameInput) { nameInput.value = ''; nameInput.focus(); }
  document.querySelectorAll('.pin-digit').forEach(d => d.value = '');
  document.querySelector('.pin-error').style.display = 'none';
}

function showAccountList() {
  document.getElementById('owner-login-wrap').style.display  = 'none';
  document.getElementById('staff-pin-wrap').style.display    = 'none';
  document.getElementById('staff-login-list-wrap').style.display = 'block';
}


function openAdmin() {
  document.getElementById('admin-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Populate staff login list
  try { staffList = JSON.parse(localStorage.getItem('mm_staff') || '[]'); } catch(e) {}
  const listEl = document.getElementById('staff-login-list');
  if (listEl) {
    const ownerRow = listEl.children[0];
    listEl.innerHTML = '';
    listEl.appendChild(ownerRow);
    staffList.forEach(s => {
      const div = document.createElement('div');
      div.className = 'staff-login-item';
      div.innerHTML = `<div class="staff-login-avatar">${s.name.charAt(0).toUpperCase()}</div><div><div class="staff-login-name">${s.name}</div><div class="staff-login-role">${s.role}</div></div>`;
      div.onclick = () => selectStaffLogin(s.id);
      listEl.appendChild(div);
    });
  }

  if (!adminLoggedIn) {
    showAccountList();
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-main').style.display  = 'none';
  }
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function adminLogin() {
  const pw = document.getElementById('admin-pw').value;
  if (pw === ADMIN_PASSWORD) {
    adminLoggedIn = true;
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-main').style.display  = 'block';
    loadBookings();
  } else {
    const input = document.getElementById('admin-pw');
    input.style.borderColor = '#ff4444';
    setTimeout(() => input.style.borderColor = '', 1500);
    input.value = '';
    input.placeholder = 'Wrong password — try again';
  }
}

function adminTab(id, btn) {
  document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.apanel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('at-' + id).classList.add('active');
  if (id === 'bookings') loadBookings();
}

function loadBookings() {
  let bks = [];
  try { bks = JSON.parse(localStorage.getItem('mm_bookings') || '[]'); } catch(e) {}

  // Update stats
  const setStat = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setStat('stat-total',     bks.length);
  setStat('stat-pending',   bks.filter(b => b.status === 'pending').length);
  setStat('stat-confirmed', bks.filter(b => b.status === 'confirmed').length);
  setStat('stat-completed', bks.filter(b => b.status === 'completed').length);

  const list = document.getElementById('bookings-list');
  if (!list) return;

  if (bks.length === 0) {
    list.innerHTML = '<div class="empty-state"><div style="font-size:48px;margin-bottom:12px">📭</div><div style="font-size:14px;font-weight:600">No bookings yet</div><div style="font-size:12px;margin-top:6px">Submissions from the booking form will appear here automatically</div></div>';
    return;
  }

  list.innerHTML = bks.map(b => `
    <div class="bkcard" id="bkc-${b.id}">
      <div class="bktop">
        <div>
          <div class="bkref">REF #${String(b.id).slice(-6)} &middot; ${b.submittedAt}</div>
          <div class="bkname">${b.name}</div>
        </div>
        <button class="bkstatus ${b.status}" onclick="cycleStatus(${b.id})">${b.status.toUpperCase()}</button>
      </div>
      <div class="bkmeta">
        📞 <strong>${b.phone}</strong>${b.whatsapp && b.whatsapp !== b.phone ? ' &middot; 💬 ' + b.whatsapp : ''}<br>
        📍 <strong>${b.from}</strong> &rarr; <strong>${b.to}</strong>${b.distance ? ' &middot; ' + b.distance : ''}<br>
        📅 <strong>${b.date}</strong>${b.time ? ' &middot; ' + b.time : ''}<br>
        🏠 ${b.homeSize || '—'} &middot; ${b.moveType || '—'}<br>
        🛠 ${(b.services || []).join(', ') || '—'}<br>
        ${(b.heavyItems || []).length ? '📦 ' + b.heavyItems.join(', ') + '<br>' : ''}
        ${b.notes ? '📝 ' + b.notes : ''}
      </div>
      ${b.estimatedQuote ? '<div class="bkquote">' + b.estimatedQuote + '</div>' : ''}
      ${b.package ? '<div class="bkpkg">' + b.package + '</div>' : ''}
      <div class="bkactions">
        <button class="bkbtn confirm"  onclick="setStatus(${b.id},'confirmed')">✓ Confirm</button>
        <button class="bkbtn complete" onclick="setStatus(${b.id},'completed')">★ Complete</button>
        <button class="bkbtn invbtn"   onclick="prefillInvoice('${b.name}','${b.phone}','${b.date}')">🧾 Invoice</button>
        <button class="bkbtn"          onclick="waClient('${b.whatsapp || b.phone}','${b.name}')">💬 WhatsApp</button>
        <button class="bkbtn delbtn"   onclick="delBooking(${b.id})">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}

function setStatus(id, status) {
  try {
    let bks = JSON.parse(localStorage.getItem('mm_bookings') || '[]');
    bks = bks.map(b => b.id === id ? { ...b, status } : b);
    localStorage.setItem('mm_bookings', JSON.stringify(bks));
    loadBookings();
  } catch(e) {}
}

function cycleStatus(id) {
  const order = ['pending', 'confirmed', 'completed', 'cancelled'];
  try {
    let bks = JSON.parse(localStorage.getItem('mm_bookings') || '[]');
    bks = bks.map(b => {
      if (b.id === id) {
        const i = order.indexOf(b.status);
        return { ...b, status: order[(i + 1) % order.length] };
      }
      return b;
    });
    localStorage.setItem('mm_bookings', JSON.stringify(bks));
    loadBookings();
  } catch(e) {}
}

function delBooking(id) {
  if (!confirm('Delete this booking? This cannot be undone.')) return;
  try {
    let bks = JSON.parse(localStorage.getItem('mm_bookings') || '[]');
    bks = bks.filter(b => b.id !== id);
    localStorage.setItem('mm_bookings', JSON.stringify(bks));
    loadBookings();
  } catch(e) {}
}

function waClient(phone, name) {
  const msg = encodeURIComponent('Hello ' + name + '! This is Moé Moves. We are following up on your booking request. ');
  window.open('https://wa.me/' + phone.replace(/[^0-9]/g, '') + '?text=' + msg, '_blank');
}

/* ── INVOICE GENERATOR ────────────────────────────────────── */
let invLines = [];

function prefillInvoice(name, phone, date) {
  adminTab('invoice', document.querySelectorAll('.atab')[1]);
  const setInv = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setInv('inv-client', name);
  setInv('inv-phone',  phone);
  setInv('inv-date',   date);
  setInv('inv-num',    'INV-' + Date.now().toString().slice(-4));
  if (invLines.length === 0) addInvLine();
  renderInvLines();
}

function addInvLine() {
  invLines.push({ id: Date.now(), desc: '', qty: 1, rate: 0 });
  renderInvLines();
}

function renderInvLines() {
  const container = document.getElementById('inv-lines');
  if (!container) return;
  container.innerHTML = invLines.map(l => `
    <div class="iline">
      <input class="iinp" placeholder="Service description" value="${l.desc}" oninput="invUpd(${l.id},'desc',this.value)">
      <input class="iinp" type="number" placeholder="Qty" value="${l.qty}" oninput="invUpd(${l.id},'qty',this.value)" min="1">
      <input class="iinp" type="number" placeholder="Amount ₦" value="${l.rate || ''}" oninput="invUpd(${l.id},'rate',this.value)">
      <button onclick="removeInvLine(${l.id})" style="background:none;border:none;color:#ff6b6b;font-size:18px;cursor:pointer;flex-shrink:0">✕</button>
    </div>
  `).join('');
  updateInvTotal();
}

function invUpd(id, field, val) {
  const l = invLines.find(x => x.id === id);
  if (l) l[field] = field === 'desc' ? val : parseFloat(val) || 0;
  updateInvTotal();
}

function removeInvLine(id) {
  invLines = invLines.filter(l => l.id !== id);
  renderInvLines();
}

function updateInvTotal() {
  const total = invLines.reduce((s, l) => s + (l.qty * l.rate), 0);
  const el = document.getElementById('itotal-amt');
  if (el) el.textContent = '₦' + total.toLocaleString();
}

function generateInvoice() {
  const gInv = id => (document.getElementById(id) || {}).value || '';
  const client = gInv('inv-client') || 'Client Name';
  const phone  = gInv('inv-phone')  || '—';
  const date   = gInv('inv-date')   || new Date().toISOString().split('T')[0];
  const num    = gInv('inv-num')    || 'INV-001';
  const from   = gInv('inv-from')   || '—';
  const to     = gInv('inv-to')     || '—';
  const notes  = gInv('inv-notes')  || 'Balance due on completion.';
  const total  = invLines.reduce((s, l) => s + (l.qty * l.rate), 0);

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Invoice ${num} — Moé Moves</title>
  <style>
    body{font-family:sans-serif;margin:0;padding:40px;color:#1A1A2E;font-size:13px}
    .hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #E8600A}
    .brand-t{font-size:28px;font-weight:900;color:#0F2645;letter-spacing:3px;line-height:1}
    .brand-b{font-size:28px;font-weight:700;color:#E8600A;letter-spacing:3px;line-height:1}
    .inv-n{font-size:32px;font-weight:900;color:#E8600A;text-align:right}
    .inv-lbl{font-size:11px;color:#aaa;text-align:right;margin-top:-4px}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
    .meta-b{background:#F5F5F7;border-radius:10px;padding:14px 16px}
    .meta-b h4{font-size:10px;color:#E8600A;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px}
    .meta-b p{margin:3px 0;font-size:12px;color:#444}
    table{width:100%;border-collapse:collapse;margin-bottom:20px}
    th{background:#0F2645;color:white;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.8px}
    td{padding:10px 12px;border-bottom:1px solid #E8E8EF;font-size:12px}
    tr:nth-child(even) td{background:#F5F5F7}
    .total-row{display:flex;justify-content:flex-end;gap:60px;padding:14px 0;border-top:2px solid #0F2645;font-size:15px;font-weight:800}
    .total-amt{color:#E8600A;font-size:22px}
    .sig{width:200px;border-top:1px solid #ccc;padding-top:6px;font-size:11px;color:#aaa;margin-top:40px}
    .ftr{margin-top:28px;padding-top:16px;border-top:2px solid #E8600A;display:flex;justify-content:space-between;font-size:11px;color:#aaa}
    .print-btn{background:#E8600A;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:11px}
    @media print{.print-btn{display:none}body{padding:20px}}
  </style></head><body>
  <div class="hdr">
    <div>
      <div class="brand-t">MOÉ</div>
      <div class="brand-b">MOVES</div>
      <div style="font-size:11px;color:#aaa;margin-top:6px">Stress-Free Relocation &amp; Home Support<br>Ilorin, Kwara State &middot; @moemoves</div>
    </div>
    <div>
      <div class="inv-n">${num}</div>
      <div class="inv-lbl">INVOICE</div>
      <div class="inv-lbl">Date: ${date}</div>
    </div>
  </div>
  <div class="meta">
    <div class="meta-b"><h4>Billed To</h4><p><strong>${client}</strong></p><p>📞 ${phone}</p></div>
    <div class="meta-b"><h4>Job Details</h4><p>📍 From: ${from}</p><p>📍 To: ${to}</p><p>📅 Move date: ${date}</p></div>
  </div>
  <table>
    <thead><tr><th>Service Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Rate (₦)</th><th style="text-align:right">Total (₦)</th></tr></thead>
    <tbody>
      ${invLines.map(l => `<tr><td>${l.desc || '—'}</td><td style="text-align:right">${l.qty}</td><td style="text-align:right">${l.rate.toLocaleString()}</td><td style="text-align:right">${(l.qty * l.rate).toLocaleString()}</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="total-row"><span>TOTAL DUE</span><span class="total-amt">₦${total.toLocaleString()}</span></div>
  <p style="font-size:12px;color:#666;margin-top:10px"><strong>Payment Notes:</strong> ${notes}</p>
  <p style="font-size:12px;color:#666">Accepted: Bank Transfer &middot; Cash</p>
  <div style="display:flex;justify-content:space-between;margin-top:40px">
    <div class="sig">Client Signature</div>
    <div class="sig" style="text-align:right">Moé Moves Authorised</div>
  </div>
  <div class="ftr">
    <span>Moé Moves &middot; Ilorin, Kwara State &middot; 2026</span>
    <span>"Your Move, Made Easy."</span>
    <button class="print-btn" onclick="window.print()">🖨️ Print Invoice</button>
  </div>
  </body></html>`;

  const w = window.open('', '_blank', 'width=800,height=900');
  w.document.write(html);
  w.document.close();
}

/* ════════════════════════════════════════════════════════════
   SERVICE SELECTOR — Branched booking form
════════════════════════════════════════════════════════════ */
let selectedServiceBranch = '';

function selectBranch(branch) {
  selectedServiceBranch = branch;
  // Hide selector, show correct branch form
  document.getElementById('svc-selector-screen').style.display = 'none';
  document.querySelectorAll('.branch-form').forEach(f => f.classList.remove('active'));
  document.getElementById('branch-' + branch).classList.add('active');
}

function backToSelector() {
  document.querySelectorAll('.branch-form').forEach(f => f.classList.remove('active'));
  document.getElementById('svc-selector-screen').style.display = 'block';
  selectedServiceBranch = '';
}

/* Sub-service checkboxes (cleaning / artisan) */
function subSvc(el) {
  el.classList.toggle('on');
  el.querySelector('.sub-svc-box').textContent = el.classList.contains('on') ? '✓' : '';
}

function getSubSvcs(groupId) {
  return [...document.querySelectorAll('#' + groupId + ' .sub-svc.on')].map(e => e.dataset.v);
}

/* Submit cleaning branch */
function submitCleaning() {
  const name    = gv('cl-name');
  const phone   = gv('cl-phone');
  const address = gv('cl-address');
  const date    = gv('cl-date');
  if (!name || !phone || !address || !date) {
    alert('Please fill in your name, phone, address, and preferred date.');
    return;
  }
  const svcs = getSubSvcs('cl-svcs');
  const booking = {
    id: Date.now(), submittedAt: new Date().toLocaleString(), status: 'pending',
    serviceType: 'Cleaning', name, phone,
    whatsapp: gv('cl-wa') || phone,
    address, date, services: svcs,
    homeSize: (document.getElementById('cl-size') || {}).value || '',
    notes: gv('cl-notes'), estimatedQuote: '', package: 'Cleaning Service'
  };
  saveAndSubmit(booking, {
    'form-name': 'moemoves-booking', 'full-name': name, phone, 'whatsapp': booking.whatsapp,
    'service-type': 'Cleaning', 'move-from': address, 'move-date': date,
    'services': svcs.join(', '), 'home-size': booking.homeSize, 'notes': booking.notes
  });
}

/* Submit artisan branch */
function submitArtisan() {
  const name    = gv('ar-name');
  const phone   = gv('ar-phone');
  const address = gv('ar-address');
  const date    = gv('ar-date');
  if (!name || !phone || !address || !date) {
    alert('Please fill in your name, phone, address, and preferred date.');
    return;
  }
  const svcs = getSubSvcs('ar-svcs');
  const booking = {
    id: Date.now(), submittedAt: new Date().toLocaleString(), status: 'pending',
    serviceType: 'Artisan', name, phone,
    whatsapp: gv('ar-wa') || phone,
    address, date, services: svcs,
    notes: gv('ar-notes'), estimatedQuote: '', package: 'Artisan Service'
  };
  saveAndSubmit(booking, {
    'form-name': 'moemoves-booking', 'full-name': name, phone, 'whatsapp': booking.whatsapp,
    'service-type': 'Artisan Services', 'move-from': address, 'move-date': date,
    'services': svcs.join(', '), 'notes': booking.notes
  });
}

function saveAndSubmit(booking, fields) {
  // Save locally
  try {
    const all = JSON.parse(localStorage.getItem('mm_bookings') || '[]');
    all.unshift(booking);
    localStorage.setItem('mm_bookings', JSON.stringify(all));
  } catch(e) {}
  // Submit to Netlify
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v || ''));
  fetch('/', { method: 'POST', body: fd }).catch(() => {});
  // Show branch success
  showBranchSuccess(booking);
}

function showBranchSuccess(booking) {
  document.querySelectorAll('.branch-form').forEach(f => f.classList.remove('active'));
  const s = document.getElementById('branch-success');
  s.classList.add('active');
  document.getElementById('bs-name').textContent    = booking.name;
  document.getElementById('bs-contact').textContent = booking.whatsapp;
  document.getElementById('bs-type').textContent    = booking.serviceType;
  // Calendar link
  const d = (booking.date || '').replace(/-/g, '');
  if (d) {
    const title = encodeURIComponent('Moé Moves — ' + booking.serviceType + ' Service for ' + booking.name);
    const loc   = encodeURIComponent(booking.address || 'Ilorin');
    document.getElementById('bs-cal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + title + '&dates=' + d + '/' + d + '&location=' + loc;
  }
  const msg = encodeURIComponent('Hello Moé Moves! I submitted a ' + booking.serviceType + ' request. Name: ' + booking.name + ', Date: ' + booking.date + ', Address: ' + booking.address);
  document.getElementById('bs-wa').href = 'https://wa.me/2348000000000?text=' + msg;
}

/* ════════════════════════════════════════════════════════════
   RECEIPTS
════════════════════════════════════════════════════════════ */
let receipts = [];

function loadReceipts() {
  try { receipts = JSON.parse(localStorage.getItem('mm_receipts') || '[]'); } catch(e) { receipts = []; }
  renderReceipts(receipts);
}

function renderReceipts(list) {
  const el = document.getElementById('receipts-list');
  if (!el) return;
  if (list.length === 0) {
    el.innerHTML = '<div class="empty-state"><div style="font-size:40px;margin-bottom:10px">🧾</div><div>No receipts yet. Generate receipts from completed bookings.</div></div>';
    return;
  }
  el.innerHTML = list.map(r => `
    <div class="receipt-card">
      <div class="receipt-top">
        <div>
          <div class="receipt-ref">${r.num}</div>
          <div class="receipt-client">${r.client}</div>
        </div>
        <div class="receipt-amt">₦${Number(r.total).toLocaleString()}</div>
      </div>
      <div class="receipt-meta">
        📞 ${r.phone} &nbsp;·&nbsp; 📅 ${r.date} &nbsp;·&nbsp; 📍 ${r.address || '—'}
      </div>
      <div class="receipt-actions">
        <button class="gen-receipt-btn" onclick="printReceipt(${r.id})">🖨️ Print Receipt</button>
        <button class="bkbtn delbtn" onclick="deleteReceipt(${r.id})">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}

function searchReceipts() {
  const q = (document.getElementById('receipt-search').value || '').toLowerCase();
  renderReceipts(q ? receipts.filter(r => r.client.toLowerCase().includes(q) || r.phone.includes(q) || r.num.toLowerCase().includes(q)) : receipts);
}

function saveReceiptFromForm() {
  const client  = (document.getElementById('rc-client') || {}).value || '';
  const phone   = (document.getElementById('rc-phone') || {}).value || '';
  const date    = (document.getElementById('rc-date') || {}).value || '';
  const address = (document.getElementById('rc-address') || {}).value || '';
  const service = (document.getElementById('rc-service') || {}).value || '';
  const total   = parseFloat((document.getElementById('rc-total') || {}).value) || 0;
  const paid    = parseFloat((document.getElementById('rc-paid') || {}).value) || 0;
  const notes   = (document.getElementById('rc-notes') || {}).value || '';
  if (!client || !phone || !total) { alert('Please fill in client name, phone, and amount.'); return; }
  const r = {
    id: Date.now(), num: 'REC-' + Date.now().toString().slice(-5),
    client, phone, date, address, service, total, paid, balance: total - paid, notes,
    createdAt: new Date().toLocaleString()
  };
  receipts.unshift(r);
  try { localStorage.setItem('mm_receipts', JSON.stringify(receipts)); } catch(e) {}
  renderReceipts(receipts);
  printReceipt(r.id);
  // Clear form
  ['rc-client','rc-phone','rc-date','rc-address','rc-service','rc-total','rc-paid','rc-notes'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

function prefillReceiptFromBooking(name, phone, date, quote) {
  adminTab('receipts', document.querySelectorAll('.atab')[2]);
  const s = id => { const e = document.getElementById(id); if (e) e.value = id === 'rc-client' ? name : id === 'rc-phone' ? phone : id === 'rc-date' ? date : ''; };
  ['rc-client','rc-phone','rc-date'].forEach(s);
  const totalEl = document.getElementById('rc-total');
  if (totalEl && quote) {
    const nums = quote.match(/\d+/g);
    if (nums && nums.length) totalEl.value = nums[0] + '000';
  }
}

function deleteReceipt(id) {
  if (!confirm('Delete this receipt?')) return;
  receipts = receipts.filter(r => r.id !== id);
  try { localStorage.setItem('mm_receipts', JSON.stringify(receipts)); } catch(e) {}
  renderReceipts(receipts);
}

function printReceipt(id) {
  const r = receipts.find(x => x.id === id);
  if (!r) return;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Receipt ${r.num} — Moé Moves</title>
  <style>
    body{font-family:sans-serif;max-width:400px;margin:30px auto;padding:24px;color:#1A1A2E;font-size:13px;border:2px solid #E8600A;border-radius:12px}
    .top{text-align:center;border-bottom:2px solid #E8600A;padding-bottom:16px;margin-bottom:16px}
    .brand-t{font-size:24px;font-weight:900;color:#0F2645;letter-spacing:3px;line-height:1}
    .brand-b{font-size:24px;font-weight:700;color:#E8600A;letter-spacing:3px;line-height:1;margin-bottom:8px}
    .rec-num{font-size:11px;color:#aaa;letter-spacing:1px;text-transform:uppercase}
    .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:12px}
    .row .lbl{color:#888}.row .val{font-weight:600;color:#1A1A2E}
    .total-section{margin-top:12px;padding:12px;background:#FFF8F0;border-radius:8px;border:1px solid #E8600A}
    .total-row{display:flex;justify-content:space-between;font-size:14px;font-weight:800;color:#0F2645;margin-bottom:4px}
    .balance{color:${r.balance > 0 ? '#E8600A' : '#1A6B3C'};font-weight:900;font-size:16px}
    .footer{text-align:center;margin-top:16px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#aaa}
    .print-btn{display:block;width:100%;padding:10px;background:#E8600A;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;margin-top:12px}
    @media print{.print-btn{display:none}body{border:2px solid #E8600A;margin:0}}
  </style></head><body>
  <div class="top">
    <div class="brand-t">MOÉ</div><div class="brand-b">MOVES</div>
    <div class="rec-num">Receipt ${r.num}</div>
  </div>
  <div class="row"><span class="lbl">Client</span><span class="val">${r.client}</span></div>
  <div class="row"><span class="lbl">Phone</span><span class="val">${r.phone}</span></div>
  <div class="row"><span class="lbl">Date</span><span class="val">${r.date}</span></div>
  <div class="row"><span class="lbl">Address</span><span class="val">${r.address || '—'}</span></div>
  <div class="row"><span class="lbl">Service</span><span class="val">${r.service || '—'}</span></div>
  ${r.notes ? `<div class="row"><span class="lbl">Notes</span><span class="val">${r.notes}</span></div>` : ''}
  <div class="total-section">
    <div class="total-row"><span>Total Amount</span><span>₦${Number(r.total).toLocaleString()}</span></div>
    <div class="total-row"><span>Amount Paid</span><span>₦${Number(r.paid).toLocaleString()}</span></div>
    <div class="total-row"><span>Balance Due</span><span class="balance">₦${Number(r.balance).toLocaleString()}</span></div>
  </div>
  <div class="footer">
    <p>Thank you for choosing Moé Moves!</p>
    <p>"Your Move, Made Easy." · Ilorin, Kwara State · 2026</p>
    <p>@moemoves</p>
  </div>
  <button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
  </body></html>`;
  const w = window.open('', '_blank', 'width=480,height:700');
  w.document.write(html);
  w.document.close();
}

/* ════════════════════════════════════════════════════════════
   STAFF ACCOUNTS
════════════════════════════════════════════════════════════ */
let staffList = [];
let selectedStaffForLogin = null;
let accessOptions = [];

function loadStaff() {
  try { staffList = JSON.parse(localStorage.getItem('mm_staff') || '[]'); } catch(e) { staffList = []; }
  renderStaff();
}

function renderStaff() {
  const el = document.getElementById('staff-list');
  if (!el) return;
  if (staffList.length === 0) {
    el.innerHTML = '<div style="color:rgba(255,255,255,.3);font-size:13px;padding:12px 0;text-align:center">No staff accounts yet. Add your first team member below.</div>';
    return;
  }
  el.innerHTML = `<div class="staff-grid">${staffList.map(s => `
    <div class="staff-card">
      <button class="staff-del" onclick="deleteStaff(${s.id})">✕</button>
      <div class="staff-avatar">${s.name.charAt(0).toUpperCase()}</div>
      <div class="staff-name">${s.name}</div>
      <div class="staff-role">${s.role}</div>
      <div class="staff-access">
        ${s.access.map(a => `<span class="access-badge ${a === 'Full Access' ? 'full' : 'limited'}">${a}</span>`).join('')}
      </div>
      <div class="staff-status">PIN: ****</div>
    </div>
  `).join('')}</div>`;
}

function toggleAccessOpt(el) {
  el.classList.toggle('on');
  const val = el.dataset.v;
  if (el.classList.contains('on')) {
    accessOptions.push(val);
  } else {
    accessOptions = accessOptions.filter(x => x !== val);
  }
}

function addStaff() {
  const name = (document.getElementById('ns-name') || {}).value?.trim();
  const role = (document.getElementById('ns-role') || {}).value?.trim();
  const pin  = (document.getElementById('ns-pin') || {}).value?.trim();
  if (!name || !role || !pin) { alert('Please fill in name, role, and PIN.'); return; }
  if (pin.length < 4) { alert('PIN must be at least 4 digits.'); return; }
  if (accessOptions.length === 0) { alert('Please select at least one access level.'); return; }
  const staff = { id: Date.now(), name, role, pin, access: [...accessOptions], createdAt: new Date().toLocaleString() };
  staffList.push(staff);
  try { localStorage.setItem('mm_staff', JSON.stringify(staffList)); } catch(e) {}
  renderStaff();
  // Reset form
  ['ns-name','ns-role','ns-pin'].forEach(id => { const e = document.getElementById(id); if(e) e.value = ''; });
  accessOptions = [];
  document.querySelectorAll('.access-opt').forEach(o => o.classList.remove('on'));
  alert('Staff member ' + name + ' added successfully!');
}

function deleteStaff(id) {
  if (!confirm('Remove this staff member?')) return;
  staffList = staffList.filter(s => s.id !== id);
  try { localStorage.setItem('mm_staff', JSON.stringify(staffList)); } catch(e) {}
  renderStaff();
}

// Staff login flow

function verifyStaffPin() {
  const pin = [...document.querySelectorAll('.pin-digit')].map(d => d.value).join('');
  const nameEntered = (document.getElementById('staff-name-input')?.value || '').trim().toLowerCase();
  const pinError = document.querySelector('.pin-error');

  // Try to match by name + PIN from staff list
  let matched = null;
  try {
    const allStaff = JSON.parse(localStorage.getItem('mm_staff') || '[]');
    matched = allStaff.find(s =>
      s.name.toLowerCase() === nameEntered && s.pin === pin
    );
    // Also allow partial match on first name
    if (!matched) {
      matched = allStaff.find(s =>
        s.name.toLowerCase().startsWith(nameEntered) && s.pin === pin
      );
    }
  } catch(e) {}

  if (matched) {
    selectedStaffForLogin = matched;
    adminLoggedIn = true;
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-main').style.display  = 'block';
    // Apply access restrictions
    const hasFullAccess = matched.access.includes('Full Access');
    document.querySelectorAll('.atab').forEach((tab, i) => {
      if (!hasFullAccess && i > 2) tab.style.display = 'none';
    });
    loadBookings();
  } else {
    if (pinError) pinError.style.display = 'block';
    document.querySelectorAll('.pin-digit').forEach(d => d.value = '');
    document.getElementById('pin-1')?.focus();
  }
}
   
function movePinFocus(el, next) {
  if (el.value.length === 1 && next) {
    const nextEl = document.getElementById('pin-' + next);
    if (nextEl) nextEl.focus();
  }
}

// Updated adminTab to load receipts/staff
const _origAdminTab = adminTab;
window.adminTab = function(id, btn) {
  _origAdminTab(id, btn);
  if (id === 'receipts') loadReceipts();
  if (id === 'staff') loadStaff();
};

// Update loadBookings to add receipt button
const _origLoadBookings = loadBookings;
window.loadBookings = function() {
  _origLoadBookings();
  // Patch in receipt button for completed bookings
  setTimeout(() => {
    document.querySelectorAll('.bkcard').forEach(card => {
      const actions = card.querySelector('.bkactions');
      if (!actions) return;
      if (!actions.querySelector('.rcptbtn')) {
        const btn = document.createElement('button');
        btn.className = 'bkbtn rcptbtn gen-receipt-btn';
        btn.textContent = '🧾 Receipt';
        const bkId = card.id.replace('bkc-', '');
        btn.onclick = () => {
          let bks = [];
          try { bks = JSON.parse(localStorage.getItem('mm_bookings') || '[]'); } catch(e) {}
          const bk = bks.find(b => String(b.id) === bkId);
          if (bk) prefillReceiptFromBooking(bk.name, bk.phone, bk.date, bk.estimatedQuote);
        };
        actions.appendChild(btn);
      }
    });
  }, 100);
};
