/* ═══════════════════════════════════════════════════════════
   MOÉ MOVES — app.js  |  Powered by Supabase
═══════════════════════════════════════════════════════════ */

const SUPA_URL = 'https://wwuaukjxaiizlcfxxxsh.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bmdsbW9hcHJ4eHdxZmV4aGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTA5NjgsImV4cCI6MjA5MTMyNjk2OH0.k-I4G4X3lJ0gpTKUxucZnfol2h_G18dJqJePty6Qf2w';

const SB = {
  'Content-Type':'application/json',
  'apikey': SUPA_KEY,
  'Authorization': `Bearer ${SUPA_KEY}`,
  'Prefer': 'return=representation'
};

async function sbGet(table, q='') {
  try {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${q}&order=created_at.desc`, {headers:SB});
    return r.ok ? await r.json() : [];
  } catch(e){ return []; }
}
async function sbInsert(table, data) {
  try {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {method:'POST',headers:SB,body:JSON.stringify(data)});
    return r.ok ? await r.json() : null;
  } catch(e){ return null; }
}
async function sbUpdate(table, id, data) {
  try {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {method:'PATCH',headers:SB,body:JSON.stringify(data)});
    return r.ok;
  } catch(e){ return false; }
}
async function sbDelete(table, id) {
  try {
    const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, {method:'DELETE',headers:SB});
    return r.ok;
  } catch(e){ return false; }
}
function genRef(){ return 'MM-'+Date.now().toString().slice(-6); }
function showToast(msg) {
  let t=document.getElementById('mm-toast');
  if(!t){t=document.createElement('div');t.id='mm-toast';t.style.cssText='position:fixed;bottom:80px;right:24px;background:#0F2645;color:white;padding:10px 18px;border-radius:10px;font-size:12px;font-weight:700;border:1px solid #E8600A;z-index:9999;opacity:0;transition:opacity .3s;pointer-events:none';document.body.appendChild(t);}
  t.textContent=msg;t.style.opacity='1';setTimeout(()=>t.style.opacity='0',2500);
}

/* ── NAV ──────────────────────────────────────────────────*/
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open');}
window.addEventListener('scroll',()=>{
  const sections=['home','services','about','pricing','gallery','testimonials','faq','book','contact'];
  const y=window.scrollY+80;
  sections.forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    if(el.offsetTop<=y&&el.offsetTop+el.offsetHeight>y){
      document.querySelectorAll('.nav-links a').forEach(a=>{a.classList.toggle('active',a.getAttribute('href')==='#'+id);});
    }
  });
});

/* ── FAQ ──────────────────────────────────────────────────*/
function toggleFaq(btn){
  const item=btn.parentElement;const isOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
  if(!isOpen)item.classList.add('open');
}
function toggleAcc(bodyId,chevId){document.getElementById(bodyId).classList.toggle('open');document.getElementById(chevId).classList.toggle('open');}

/* ── BOOKING FORM ─────────────────────────────────────────*/
let curStep=0,pkgRange=null,pkgName='';
window.addEventListener('DOMContentLoaded',()=>{const dt=document.getElementById('fdt');if(dt)dt.min=new Date().toISOString().split('T')[0];});

function goStep(n){
  if(n>curStep&&!validateStep(curStep))return;
  document.getElementById('fp'+curStep).classList.remove('active');
  curStep=n;document.getElementById('fp'+n).classList.add('active');
  for(let i=0;i<5;i++){const t=document.getElementById('fs'+i);if(t)t.className='fstep'+(i===n?' active':i<n?' done':'');}
  if(n===4)buildSummary();
  document.getElementById('book').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function validateStep(s){
  if(s===0){if(!gv('fn')){alert('Please enter your name.');return false;}if(!gv('fp')){alert('Please enter your phone.');return false;}}
  if(s===1){if(!gv('ffr')){alert('Please enter your current area.');return false;}if(!gv('fto')){alert('Please enter destination.');return false;}if(!gv('fdt')){alert('Please select a date.');return false;}}
  return true;
}
function gv(id){const e=document.getElementById(id);return e?e.value.trim():'';}
function pp(g,el){document.querySelectorAll('#'+g+' .fpill').forEach(p=>p.classList.remove('on'));el.classList.add('on');}
function gp(g){const e=document.querySelector('#'+g+' .fpill.on');return e?e.dataset.v:'';}
function fc(el){el.classList.toggle('on');el.querySelector('.fchkbox').textContent=el.classList.contains('on')?'✓':'';updateQuote();}
function gchk(g){return[...document.querySelectorAll('#'+g+' .fchk.on')].map(e=>e.dataset.v);}
function fpkg(el,name,range){document.querySelectorAll('.pkggrid .pkg').forEach(c=>c.classList.remove('on'));el.classList.add('on');pkgName=name;pkgRange=range;updateQuote();}

function updateQuote(){
  if(!pkgRange)return;
  if(pkgName==='Corporate'){['fqbox','fqbox2','fqbox3'].forEach((b,i)=>showQ(b,['fqamt','fqamt2','fqamt3'][i],'Custom Quote'));return;}
  let lo=pkgRange[0],hi=pkgRange[1];
  const sz=(document.getElementById('fsz')||{}).value||'';
  if(sz.includes('3 Bed')){lo*=1.10;hi*=1.15;}if(sz.includes('4 Bed')){lo*=1.18;hi*=1.22;}
  if(sz.includes('5 Bed')){lo*=1.28;hi*=1.35;}if(sz.includes('Office')){lo*=1.20;hi*=1.30;}
  const d=gp('gpd');if(d==='Across Ilorin'){lo+=8000;hi+=15000;}if(d==='Nearby town'){lo+=20000;hi+=40000;}
  const fl=gp('gpfl');if(fl==='1st floor'){lo+=5000;hi+=8000;}if(fl==='2nd floor+'){lo+=10000;hi+=16000;}
  lo+=gchk('ghv').length*2000;hi+=gchk('ghv').length*4000;
  const ac=gchk('gsv').filter(s=>['Painting','Plumbing','Electrical','Furniture Assembly'].some(a=>s.includes(a))).length;
  lo+=ac*8000;hi+=ac*20000;lo=Math.round(lo/1000)*1000;hi=Math.round(hi/1000)*1000;
  const lbl='₦'+(lo/1000)+'k – ₦'+(hi/1000)+'k';
  showQ('fqbox','fqamt',lbl);showQ('fqbox2','fqamt2',lbl);showQ('fqbox3','fqamt3',lbl);
}
function showQ(bid,aid,lbl){const b=document.getElementById(bid);const a=document.getElementById(aid);if(b)b.style.display='flex';if(a)a.textContent=lbl;}
function buildSummary(){
  setSumm('ss-name',gv('fn'));setSumm('ss-phone',gv('fp'));setSumm('ss-wa',gv('fw')||'Same as phone');
  setSumm('ss-type',gp('gpt')||'—');setSumm('ss-size',(document.getElementById('fsz')||{}).value||'—');
  setSumm('ss-fromto',gv('ffr')+' → '+gv('fto'));setSumm('ss-date',gv('fdt'));
  setSumm('ss-svcs',gchk('gsv').join(', ')||'None');setSumm('ss-pkg',pkgName||'—');setSumm('ss-budget',gp('gpb')||'—');
  updateQuote();
}
function setSumm(id,val){const e=document.getElementById(id);if(e)e.textContent=val;}

/* ── SUBMIT MOVING → SUPABASE ─────────────────────────────*/
async function fSubmit(){
  const btn=document.querySelector('.fbtnsubmit');
  if(btn){btn.textContent='Saving...';btn.disabled=true;}
  const booking={
    ref:genRef(),status:'Pending',service_type:'Moving',
    name:gv('fn'),phone:gv('fp'),whatsapp:gv('fw')||gv('fp'),email:gv('fe'),
    source:gp('gps'),move_type:gp('gpt'),home_size:(document.getElementById('fsz')||{}).value||'',
    move_from:gv('ffr'),move_to:gv('fto'),distance:gp('gpd'),
    move_date:gv('fdt')||null,move_time:(document.getElementById('ftm')||{}).value||'',
    floor_level:gp('gpfl'),services:gchk('gsv').join(', '),heavy_items:gchk('ghv').join(', '),
    fragile_items:gv('ffrag'),package:pkgName,budget:gp('gpb'),notes:gv('fnotes'),
    estimated_quote:(document.getElementById('fqamt')||{}).textContent||'',payment_status:'Not Paid'
  };
  await sbInsert('bookings',booking);
  upsertCustomer(booking);
  const fd=new FormData();fd.append('form-name','moemoves-booking');
  Object.entries(booking).forEach(([k,v])=>fd.append(k.replace(/_/g,'-'),v||''));
  fetch('/',{method:'POST',body:fd}).catch(()=>{});
  if(btn){btn.textContent='Submit Booking Request ✓';btn.disabled=false;}
  showFormSuccess(booking);
}
async function upsertCustomer(b){
  const ex=await sbGet('customers',`phone=eq.${b.phone}`);
  if(ex&&ex.length>0){await sbUpdate('customers',ex[0].id,{last_booking_date:b.move_date,total_jobs:(ex[0].total_jobs||0)+1});}
  else{await sbInsert('customers',{name:b.name,phone:b.phone,whatsapp:b.whatsapp,email:b.email,source:b.source,first_booking_date:b.move_date,last_booking_date:b.move_date,total_jobs:1,preferred_service:b.service_type});}
}
function showFormSuccess(b){
  document.querySelectorAll('.fpanel').forEach(p=>p.style.display='none');
  const st=document.querySelector('.form-steps');if(st)st.style.display='none';
  const s=document.getElementById('fsucc');if(s)s.style.display='block';
  const ne=document.getElementById('fsucc-name');if(ne)ne.textContent=b.name;
  const ce=document.getElementById('fsucc-contact');if(ce)ce.textContent=b.whatsapp;
  const d=(b.move_date||'').replace(/-/g,'');
  if(d){
    const title=encodeURIComponent("Moé Moves — "+b.name+"'s Move");
    const details=encodeURIComponent('From '+b.move_from+' to '+b.move_to+'. Package: '+b.package+'. Ref: '+b.ref);
    const loc=encodeURIComponent(b.move_from+', Ilorin');
    const cl=document.getElementById('fcal-link');if(cl)cl.href='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+title+'&dates='+d+'/'+d+'&details='+details+'&location='+loc;
  }
  const msg=encodeURIComponent('Hello Moé Moves! I submitted a booking.\nName: '+b.name+'\nRef: '+b.ref+'\nDate: '+b.move_date+'\nFrom: '+b.move_from+' → '+b.move_to+'\nPackage: '+b.package);
  const wa=document.getElementById('fwa-link');if(wa)wa.href='https://wa.me/2348000000000?text='+msg;
  showQ('fqbox3','fqamt3',(document.getElementById('fqamt')||{}).textContent||'');
}

/* ── SERVICE BRANCHES ─────────────────────────────────────*/
let selectedServiceBranch='';
function selectBranch(b){selectedServiceBranch=b;document.getElementById('svc-selector-screen').style.display='none';document.querySelectorAll('.branch-form').forEach(f=>f.classList.remove('active'));document.getElementById('branch-'+b).classList.add('active');}
function backToSelector(){document.querySelectorAll('.branch-form').forEach(f=>f.classList.remove('active'));document.getElementById('svc-selector-screen').style.display='block';selectedServiceBranch='';}
function subSvc(el){el.classList.toggle('on');el.querySelector('.sub-svc-box').textContent=el.classList.contains('on')?'✓':'';}
function getSubSvcs(g){return[...document.querySelectorAll('#'+g+' .sub-svc.on')].map(e=>e.dataset.v);}

async function submitCleaning(){
  const name=gv('cl-name'),phone=gv('cl-phone'),address=gv('cl-address'),date=gv('cl-date');
  if(!name||!phone||!address||!date){alert('Please fill in all required fields.');return;}
  const b={ref:genRef(),status:'Pending',service_type:'Cleaning',name,phone,whatsapp:gv('cl-wa')||phone,move_from:address,move_date:date||null,home_size:(document.getElementById('cl-size')||{}).value||'',services:getSubSvcs('cl-svcs').join(', '),notes:gv('cl-notes'),package:'Cleaning Service',payment_status:'Not Paid'};
  await sbInsert('bookings',b);upsertCustomer(b);
  const fd=new FormData();fd.append('form-name','moemoves-booking');Object.entries(b).forEach(([k,v])=>fd.append(k.replace(/_/g,'-'),v||''));fetch('/',{method:'POST',body:fd}).catch(()=>{});
  showBranchSuccess(b);
}
async function submitArtisan(){
  const name=gv('ar-name'),phone=gv('ar-phone'),address=gv('ar-address'),date=gv('ar-date');
  if(!name||!phone||!address||!date){alert('Please fill in all required fields.');return;}
  const b={ref:genRef(),status:'Pending',service_type:'Artisan',name,phone,whatsapp:gv('ar-wa')||phone,move_from:address,move_date:date||null,services:getSubSvcs('ar-svcs').join(', '),notes:gv('ar-notes'),package:'Artisan Service',payment_status:'Not Paid'};
  await sbInsert('bookings',b);upsertCustomer(b);
  const fd=new FormData();fd.append('form-name','moemoves-booking');Object.entries(b).forEach(([k,v])=>fd.append(k.replace(/_/g,'-'),v||''));fetch('/',{method:'POST',body:fd}).catch(()=>{});
  showBranchSuccess(b);
}
function showBranchSuccess(b){
  document.querySelectorAll('.branch-form').forEach(f=>f.classList.remove('active'));
  const s=document.getElementById('branch-success');s.classList.add('active');
  const ne=document.getElementById('bs-name');if(ne)ne.textContent=b.name;
  const ce=document.getElementById('bs-contact');if(ce)ce.textContent=b.whatsapp;
  const te=document.getElementById('bs-type');if(te)te.textContent=b.service_type;
  const d=(b.move_date||'').replace(/-/g,'');
  if(d){const title=encodeURIComponent('Moé Moves — '+b.service_type+' for '+b.name);const loc=encodeURIComponent(b.move_from||'Ilorin');const cl=document.getElementById('bs-cal');if(cl)cl.href='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+title+'&dates='+d+'/'+d+'&location='+loc;}
  const msg=encodeURIComponent('Hello Moé Moves! I submitted a '+b.service_type+' request. Name: '+b.name+', Ref: '+b.ref+', Date: '+b.move_date);
  const wa=document.getElementById('bs-wa');if(wa)wa.href='https://wa.me/2348000000000?text='+msg;
}

/* ════════════════════════════════════════════════════════
   ADMIN DASHBOARD — Supabase powered
════════════════════════════════════════════════════════ */
const ADMIN_PASSWORD='moemoves2026';
let adminLoggedIn=false,currentStaff=null,allBookings=[],allStaff=[],receipts=[];

/* ── LOGIN ────────────────────────────────────────────────*/
function showOwnerLogin(){
  document.getElementById('staff-login-list-wrap').style.display='none';
  document.getElementById('staff-pin-wrap').style.display='none';
  document.getElementById('owner-login-wrap').style.display='block';
  setTimeout(()=>{const pw=document.getElementById('admin-pw');if(pw){pw.value='';pw.focus();}},100);
}
function showStaffLogin(){
  document.getElementById('staff-login-list-wrap').style.display='none';
  document.getElementById('owner-login-wrap').style.display='none';
  document.getElementById('staff-pin-wrap').style.display='block';
  const ni=document.getElementById('staff-name-input');if(ni){ni.value='';ni.focus();}
  document.querySelectorAll('.pin-digit').forEach(d=>d.value='');
  const pe=document.querySelector('.pin-error');if(pe)pe.style.display='none';
}
function showAccountList(){
  document.getElementById('owner-login-wrap').style.display='none';
  document.getElementById('staff-pin-wrap').style.display='none';
  document.getElementById('staff-login-list-wrap').style.display='block';
}
function openAdmin(){
  document.getElementById('admin-overlay').classList.add('open');
  document.body.style.overflow='hidden';
  if(!adminLoggedIn){showAccountList();document.getElementById('admin-login').style.display='block';document.getElementById('admin-main').style.display='none';}
}
function closeAdmin(){document.getElementById('admin-overlay').classList.remove('open');document.body.style.overflow='';}
function adminLogin(){
  const pw=(document.getElementById('admin-pw')||{}).value||'';
  if(pw===ADMIN_PASSWORD){
    adminLoggedIn=true;currentStaff=null;
    document.getElementById('admin-login').style.display='none';
    document.getElementById('admin-main').style.display='block';
    document.querySelectorAll('.atab').forEach(t=>t.style.display='');
    loadBookings();
  } else {
    const inp=document.getElementById('admin-pw');
    if(inp){inp.style.borderColor='#ff4444';setTimeout(()=>inp.style.borderColor='',1500);inp.value='';}
  }
}
async function verifyStaffPin(){
  const pin=[...document.querySelectorAll('.pin-digit')].map(d=>d.value).join('');
  const nameEntered=(document.getElementById('staff-name-input')?.value||'').trim().toLowerCase();
  const pe=document.querySelector('.pin-error');
  const allStaffData=await sbGet('staff','status=eq.Active');
  let matched=allStaffData.find(s=>s.name.toLowerCase()===nameEntered&&s.pin===pin);
  if(!matched)matched=allStaffData.find(s=>s.name.toLowerCase().startsWith(nameEntered)&&s.pin===pin);
  if(matched){
    adminLoggedIn=true;currentStaff=matched;
    document.getElementById('admin-login').style.display='none';
    document.getElementById('admin-main').style.display='block';
    const hasFullAccess=(matched.access_level||'').includes('Full Access');
    document.querySelectorAll('.atab').forEach((t,i)=>{if(!hasFullAccess&&i>2)t.style.display='none';});
    loadBookings();
  } else {
    if(pe)pe.style.display='block';
    document.querySelectorAll('.pin-digit').forEach(d=>d.value='');
    document.getElementById('pin-1')?.focus();
  }
}
function movePinFocus(el,next){if(el.value.length===1&&next){const n=document.getElementById('pin-'+next);if(n)n.focus();}}

/* ── TABS ─────────────────────────────────────────────────*/
function adminTab(id,btn){
  document.querySelectorAll('.atab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.apanel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');document.getElementById('at-'+id).classList.add('active');
  if(id==='bookings')loadBookings();
  if(id==='receipts')loadReceipts();
  if(id==='staff')loadStaff();
  if(id==='invoice'&&invLines.length===0)addInvLine();
}

/* ── BOOKINGS ─────────────────────────────────────────────*/
async function loadBookings(){
  const list=document.getElementById('bookings-list');
  if(list)list.innerHTML='<div style="color:rgba(255,255,255,.4);text-align:center;padding:24px;font-size:13px">Loading bookings from database...</div>';
  const q=currentStaff?`workers_assigned=ilike.%${currentStaff.name}%`:'';
  allBookings=await sbGet('bookings',q);
  const setStat=(id,val)=>{const e=document.getElementById(id);if(e)e.textContent=val;};
  setStat('stat-total',allBookings.length);
  setStat('stat-pending',allBookings.filter(b=>b.status==='Pending').length);
  setStat('stat-confirmed',allBookings.filter(b=>b.status==='Confirmed').length);
  setStat('stat-completed',allBookings.filter(b=>b.status==='Completed').length);
  if(!list)return;
  if(allBookings.length===0){list.innerHTML='<div class="empty-state"><div style="font-size:40px;margin-bottom:12px">📭</div><div style="font-size:14px;font-weight:600">No bookings yet</div><div style="font-size:12px;margin-top:6px;color:rgba(255,255,255,.3)">Bookings from your website appear here instantly</div></div>';return;}
  list.innerHTML=allBookings.map(b=>`
    <div class="bkcard" id="bkc-${b.id}">
      <div class="bktop">
        <div>
          <div class="bkref">${b.ref||'—'} · ${b.service_type||''} · ${new Date(b.created_at).toLocaleDateString('en-GB')}</div>
          <div class="bkname">${b.name||'—'}</div>
        </div>
        <button class="bkstatus ${(b.status||'pending').toLowerCase()}" onclick="cycleStatus('${b.id}','${b.status||'Pending'}')">${b.status||'Pending'}</button>
      </div>
      <div class="bkmeta">
        📞 <strong>${b.phone||'—'}</strong>${b.whatsapp&&b.whatsapp!==b.phone?' · 💬 '+b.whatsapp:''}<br>
        📍 <strong>${b.move_from||b.services||'—'}</strong>${b.move_to?' → <strong>'+b.move_to+'</strong>':''}${b.distance?' · '+b.distance:''}<br>
        📅 <strong>${b.move_date||'—'}</strong>${b.move_time?' · '+b.move_time:''} · ${b.home_size||'—'}<br>
        🛠 ${b.services||'—'}<br>
        ${b.notes?'📝 '+b.notes:''}
      </div>
      ${b.estimated_quote?`<div class="bkquote">${b.estimated_quote}</div>`:''}
      ${b.package?`<div class="bkpkg">${b.package}</div>`:''}
      <div style="margin-top:12px;padding:10px 12px;background:rgba(255,255,255,.04);border-radius:8px;border:1px solid rgba(255,255,255,.08)">
        <div style="font-size:9px;font-weight:700;color:var(--gold);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px">Assign Job</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
          <input id="tl-${b.id}" class="iinp" style="flex:1;min-width:120px;padding:6px 10px;font-size:11px" placeholder="Team Lead" value="${b.team_lead||''}">
          <input id="wk-${b.id}" class="iinp" style="flex:2;min-width:160px;padding:6px 10px;font-size:11px" placeholder="Workers (comma separated)" value="${b.workers_assigned||''}">
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <input id="sv-${b.id}" class="iinp" style="flex:1;padding:6px 10px;font-size:11px" placeholder="Supervisor" value="${b.supervisor||''}">
          <button onclick="saveAssignment('${b.id}')" style="padding:6px 14px;background:var(--orange);border:none;border-radius:8px;font-family:inherit;font-size:10px;font-weight:700;color:white;cursor:pointer;white-space:nowrap">Save Assignment ✓</button>
        </div>
        ${b.workers_assigned?`<div style="margin-top:8px"><button onclick="notifyWorkers('${b.id}')" style="padding:5px 12px;background:rgba(37,211,102,.15);border:1px solid rgba(37,211,102,.3);border-radius:8px;font-family:inherit;font-size:10px;font-weight:700;color:#25D366;cursor:pointer">💬 Send WhatsApp to Workers</button></div>`:''}
      </div>
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <span style="font-size:10px;color:rgba(255,255,255,.4)">Payment:</span>
        <select onchange="updatePayStatus('${b.id}',this.value)" style="padding:4px 8px;border-radius:6px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:white;font-family:inherit;font-size:10px;cursor:pointer">
          <option ${b.payment_status==='Not Paid'?'selected':''}>Not Paid</option>
          <option ${b.payment_status==='Deposit Paid'?'selected':''}>Deposit Paid</option>
          <option ${b.payment_status==='Partial'?'selected':''}>Partial</option>
          <option ${b.payment_status==='Paid'?'selected':''}>Paid</option>
        </select>
      </div>
      <div class="bkactions">
        <button class="bkbtn confirm" onclick="setStatus('${b.id}','Confirmed')">✓ Confirm</button>
        <button class="bkbtn complete" onclick="setStatus('${b.id}','Completed')">★ Complete</button>
        <button class="bkbtn invbtn" onclick="prefillInvoice('${b.name}','${b.phone}','${b.move_date}','${b.id}')">🧾 Invoice</button>
        <button class="bkbtn" onclick="prefillReceiptFromBooking('${b.name}','${b.phone}','${b.move_date}','${b.estimated_quote}')">🧾 Receipt</button>
        <button class="bkbtn" onclick="waClient('${b.whatsapp||b.phone}','${b.name}')">💬 WhatsApp</button>
        <button class="bkbtn delbtn" onclick="delBooking('${b.id}')">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}
async function setStatus(id,status){await sbUpdate('bookings',id,{status});loadBookings();}
async function cycleStatus(id,current){const o=['Pending','Confirmed','In Progress','Completed','Cancelled'];await sbUpdate('bookings',id,{status:o[(o.indexOf(current)+1)%o.length]});loadBookings();}
async function saveAssignment(id){
  const tl=(document.getElementById('tl-'+id)||{}).value||'';
  const wk=(document.getElementById('wk-'+id)||{}).value||'';
  const sv=(document.getElementById('sv-'+id)||{}).value||'';
  await sbUpdate('bookings',id,{team_lead:tl,workers_assigned:wk,supervisor:sv});
  showToast('Assignment saved!');loadBookings();
}
async function updatePayStatus(id,status){await sbUpdate('bookings',id,{payment_status:status});showToast('Payment status updated');}
async function delBooking(id){if(!confirm('Delete this booking?'))return;await sbDelete('bookings',id);loadBookings();}
function waClient(phone,name){const msg=encodeURIComponent('Hello '+name+'! This is Moé Moves. ');window.open('https://wa.me/'+phone.replace(/[^0-9]/g,'')+'?text='+msg,'_blank');}
function notifyWorkers(id){
  const b=allBookings.find(x=>x.id===id);if(!b)return;
  const msg=encodeURIComponent('Hello! You have been assigned to a Moé Moves job.\n\nRef: '+(b.ref||'')+'\nDate: '+(b.move_date||'')+'\nTime: '+(b.move_time||'')+'\nFrom: '+(b.move_from||'')+'\nTo: '+(b.move_to||'')+'\nTeam Lead: '+(b.team_lead||'')+'\n\nPlease reply YES to confirm. — Moé Moves');
  window.open('https://wa.me/?text='+msg,'_blank');
}

/* ── RECEIPTS ─────────────────────────────────────────────*/
async function loadReceipts(){receipts=await sbGet('receipts');renderReceipts(receipts);}
function renderReceipts(list){
  const el=document.getElementById('receipts-list');if(!el)return;
  if(list.length===0){el.innerHTML='<div class="empty-state"><div style="font-size:40px;margin-bottom:10px">🧾</div><div>No receipts yet.</div></div>';return;}
  el.innerHTML=list.map(r=>`
    <div class="receipt-card">
      <div class="receipt-top">
        <div><div class="receipt-ref">${r.receipt_number||'—'}</div><div class="receipt-client">${r.customer_name||'—'}</div></div>
        <div class="receipt-amt">₦${Number(r.total_amount||0).toLocaleString()}</div>
      </div>
      <div class="receipt-meta">📞 ${r.customer_phone||'—'} · 📅 ${r.service_date||'—'} · Balance: ₦${Number(r.balance||0).toLocaleString()}</div>
      <div class="receipt-actions"><button class="gen-receipt-btn" onclick="printReceipt('${r.id}')">🖨️ Print</button><button class="bkbtn delbtn" onclick="deleteReceipt('${r.id}')">🗑 Delete</button></div>
    </div>`).join('');
}
function searchReceipts(){const q=(document.getElementById('receipt-search')?.value||'').toLowerCase();renderReceipts(q?receipts.filter(r=>(r.customer_name||'').toLowerCase().includes(q)||(r.customer_phone||'').includes(q)):receipts);}
async function saveReceiptFromForm(){
  const client=(document.getElementById('rc-client')||{}).value?.trim();
  const phone=(document.getElementById('rc-phone')||{}).value?.trim();
  const date=(document.getElementById('rc-date')||{}).value;
  const total=parseFloat((document.getElementById('rc-total')||{}).value)||0;
  const paid=parseFloat((document.getElementById('rc-paid')||{}).value)||0;
  if(!client||!phone||!total){alert('Please fill in client name, phone, and amount.');return;}
  const r={receipt_number:'REC-'+Date.now().toString().slice(-5),customer_name:client,customer_phone:phone,service_date:date||null,address:(document.getElementById('rc-address')||{}).value||'',service:(document.getElementById('rc-service')||{}).value||'',total_amount:total,amount_paid:paid,balance:total-paid,payment_status:paid>=total?'Paid':paid>0?'Deposit Paid':'Not Paid',notes:(document.getElementById('rc-notes')||{}).value||'',issued_by:currentStaff?currentStaff.name:'Owner'};
  const saved=await sbInsert('receipts',r);
  if(saved&&saved[0]){receipts.unshift(saved[0]);renderReceipts(receipts);printReceipt(saved[0].id);}
  ['rc-client','rc-phone','rc-date','rc-address','rc-service','rc-total','rc-paid','rc-notes'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  showToast('Receipt saved!');
}
function prefillReceiptFromBooking(name,phone,date,quote){
  adminTab('receipts',document.querySelectorAll('.atab')[2]);
  const sv=(id,val)=>{const e=document.getElementById(id);if(e)e.value=val;};
  sv('rc-client',name);sv('rc-phone',phone);sv('rc-date',date||'');
  const te=document.getElementById('rc-total');if(te&&quote){const nums=quote.match(/\d+/g);if(nums?.length)te.value=nums[0]+'000';}
}
async function deleteReceipt(id){if(!confirm('Delete this receipt?'))return;await sbDelete('receipts',id);receipts=receipts.filter(r=>r.id!==id);renderReceipts(receipts);}
function printReceipt(id){
  const r=receipts.find(x=>x.id===id);if(!r)return;
  const w=window.open('','_blank','width=480,height=700');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receipt ${r.receipt_number}</title><style>body{font-family:sans-serif;max-width:400px;margin:30px auto;padding:24px;color:#1A1A2E;font-size:13px;border:2px solid #E8600A;border-radius:12px}.top{text-align:center;border-bottom:2px solid #E8600A;padding-bottom:16px;margin-bottom:16px}.bt{font-size:24px;font-weight:900;color:#0F2645;letter-spacing:3px;line-height:1}.bb{font-size:24px;font-weight:700;color:#E8600A;letter-spacing:3px;line-height:1;margin-bottom:8px}.row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:12px}.lbl{color:#888}.ts{margin-top:12px;padding:12px;background:#FFF8F0;border-radius:8px;border:1px solid #E8600A}.tr{display:flex;justify-content:space-between;font-size:14px;font-weight:800;color:#0F2645;margin-bottom:4px}.bal{color:${Number(r.balance)>0?'#E8600A':'#1A6B3C'};font-size:16px}.ft{text-align:center;margin-top:16px;padding-top:12px;border-top:1px solid #eee;font-size:11px;color:#aaa}.sig{width:200px;border-top:1px solid #ccc;padding-top:6px;font-size:11px;color:#aaa;margin-top:40px}.pb{display:block;width:100%;padding:10px;background:#E8600A;color:white;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;margin-top:12px}@media print{.pb{display:none}}</style></head><body>
  <div class="top"><div class="bt">MOÉ</div><div class="bb">MOVES</div><div style="font-size:11px;color:#aaa">Receipt ${r.receipt_number}</div></div>
  <div class="row"><span class="lbl">Client</span><span>${r.customer_name||'—'}</span></div>
  <div class="row"><span class="lbl">Phone</span><span>${r.customer_phone||'—'}</span></div>
  <div class="row"><span class="lbl">Date</span><span>${r.service_date||'—'}</span></div>
  <div class="row"><span class="lbl">Service</span><span>${r.service||'—'}</span></div>
  ${r.notes?`<div class="row"><span class="lbl">Notes</span><span>${r.notes}</span></div>`:''}
  <div class="ts"><div class="tr"><span>Total</span><span>₦${Number(r.total_amount||0).toLocaleString()}</span></div><div class="tr"><span>Paid</span><span>₦${Number(r.amount_paid||0).toLocaleString()}</span></div><div class="tr"><span>Balance</span><span class="bal">₦${Number(r.balance||0).toLocaleString()}</span></div></div>
  <div style="display:flex;justify-content:space-between;margin-top:40px"><div class="sig">Client Signature</div><div class="sig" style="text-align:right">Authorised By</div></div>
  <div class="ft"><p>Thank you for choosing Moé Moves!</p><p>"Your Move, Made Easy." · Ilorin · 2026</p></div>
  <button class="pb" onclick="window.print()">🖨️ Print Receipt</button></body></html>`);
  w.document.close();
}

/* ── STAFF ────────────────────────────────────────────────*/
let accessOptions=[];
async function loadStaff(){allStaff=await sbGet('staff');renderStaff();}
function renderStaff(){
  const el=document.getElementById('staff-list');if(!el)return;
  if(allStaff.length===0){el.innerHTML='<div style="color:rgba(255,255,255,.3);font-size:13px;padding:12px 0;text-align:center;margin-bottom:16px">No staff added yet.</div>';return;}
  el.innerHTML=`<div class="staff-grid">${allStaff.map(s=>`<div class="staff-card"><button class="staff-del" onclick="deleteStaff('${s.id}')">✕</button><div class="staff-avatar">${(s.name||'?').charAt(0).toUpperCase()}</div><div class="staff-name">${s.name||'—'}</div><div class="staff-role">${s.category||''} · ${s.role||''}</div><div class="staff-access"><span class="access-badge ${(s.access_level||'').includes('Full')?'full':'limited'}">${s.access_level||'Limited'}</span></div><div class="staff-status">📞 ${s.phone||'—'} · ${s.gender||'—'}</div><div class="staff-status" style="margin-top:4px">Jobs done: ${s.total_jobs||0}</div></div>`).join('')}</div>`;
}
function toggleAccessOpt(el){el.classList.toggle('on');const v=el.dataset.v;if(el.classList.contains('on'))accessOptions.push(v);else accessOptions=accessOptions.filter(x=>x!==v);}
async function addStaff(){
  const name=(document.getElementById('ns-name')||{}).value?.trim();
  const role=(document.getElementById('ns-role')||{}).value?.trim();
  const cat=(document.getElementById('ns-cat')||{}).value?.trim()||'';
  const pin=(document.getElementById('ns-pin')||{}).value?.trim();
  const phone=(document.getElementById('ns-phone')||{}).value?.trim()||'';
  const gender=(document.getElementById('ns-gender')||{}).value||'';
  const dob=(document.getElementById('ns-dob')||{}).value||null;
  const marital=(document.getElementById('ns-marital')||{}).value||'';
  if(!name||!role||!pin){alert('Please fill in name, role, and PIN.');return;}
  if(pin.length<4){alert('PIN must be at least 4 digits.');return;}
  const access=accessOptions.length>0?accessOptions.join(', '):'View Bookings';
  const saved=await sbInsert('staff',{name,role,category:cat,pin,phone,gender,date_of_birth:dob||null,marital_status:marital,access_level:access,status:'Active'});
  if(saved&&saved[0]){allStaff.unshift(saved[0]);renderStaff();['ns-name','ns-role','ns-cat','ns-pin','ns-phone','ns-dob'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});accessOptions=[];document.querySelectorAll('.access-opt').forEach(o=>o.classList.remove('on'));showToast(name+' added!');}
}
async function deleteStaff(id){if(!confirm('Remove this staff member?'))return;await sbDelete('staff',id);allStaff=allStaff.filter(s=>s.id!==id);renderStaff();}

/* ── INVOICES ─────────────────────────────────────────────*/
let invLines=[];
function prefillInvoice(name,phone,date,bookingId){
  adminTab('invoice',document.querySelectorAll('.atab')[1]);
  const sv=(id,val)=>{const e=document.getElementById(id);if(e)e.value=val;};
  sv('inv-client',name);sv('inv-phone',phone);sv('inv-date',date||'');sv('inv-num','INV-'+Date.now().toString().slice(-4));
  if(invLines.length===0)addInvLine();renderInvLines();
}
function addInvLine(){invLines.push({id:Date.now(),desc:'',qty:1,rate:0});renderInvLines();}
function renderInvLines(){
  const c=document.getElementById('inv-lines');if(!c)return;
  c.innerHTML=invLines.map(l=>`<div class="iline"><input class="iinp" placeholder="Service description" value="${l.desc}" oninput="invUpd(${l.id},'desc',this.value)"><input class="iinp" type="number" placeholder="Qty" value="${l.qty}" oninput="invUpd(${l.id},'qty',this.value)" min="1" style="width:65px"><input class="iinp" type="number" placeholder="Amount ₦" value="${l.rate||''}" oninput="invUpd(${l.id},'rate',this.value)" style="width:110px"><button onclick="removeInvLine(${l.id})" style="background:none;border:none;color:#ff6b6b;font-size:18px;cursor:pointer;flex-shrink:0">✕</button></div>`).join('');
  updateInvTotal();
}
function invUpd(id,field,val){const l=invLines.find(x=>x.id===id);if(l)l[field]=field==='desc'?val:parseFloat(val)||0;updateInvTotal();}
function removeInvLine(id){invLines=invLines.filter(l=>l.id!==id);renderInvLines();}
function updateInvTotal(){const t=invLines.reduce((s,l)=>s+(l.qty*l.rate),0);const e=document.getElementById('itotal-amt');if(e)e.textContent='₦'+t.toLocaleString();}
async function generateInvoice(){
  const gI=id=>(document.getElementById(id)||{}).value||'';
  const client=gI('inv-client')||'Client',phone=gI('inv-phone'),date=gI('inv-date')||new Date().toISOString().split('T')[0];
  const num=gI('inv-num')||'INV-001',from=gI('inv-from'),to=gI('inv-to'),notes=gI('inv-notes')||'Balance due on completion.';
  const total=invLines.reduce((s,l)=>s+(l.qty*l.rate),0);
  await sbInsert('invoices',{invoice_number:num,customer_name:client,customer_phone:phone,service:invLines.map(l=>l.desc).join(', '),line_items:invLines,total_amount:total,due_date:date||null,payment_status:'Not Paid',issued_by:currentStaff?currentStaff.name:'Owner',notes});
  const w=window.open('','_blank','width=800,height=900');
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice ${num}</title><style>body{font-family:sans-serif;margin:0;padding:40px;color:#1A1A2E;font-size:13px}.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #E8600A}.bt{font-size:28px;font-weight:900;color:#0F2645;letter-spacing:3px;line-height:1}.bb{font-size:28px;font-weight:700;color:#E8600A;letter-spacing:3px;line-height:1}.in{font-size:32px;font-weight:900;color:#E8600A;text-align:right}.il{font-size:11px;color:#aaa;text-align:right;margin-top:-4px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}.mb{background:#F5F5F7;border-radius:10px;padding:14px 16px}.mb h4{font-size:10px;color:#E8600A;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px}.mb p{margin:3px 0;font-size:12px;color:#444}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{background:#0F2645;color:white;padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase}td{padding:10px 12px;border-bottom:1px solid #E8E8EF;font-size:12px}tr:nth-child(even) td{background:#F5F5F7}.tr{display:flex;justify-content:flex-end;gap:60px;padding:14px 0;border-top:2px solid #0F2645;font-size:15px;font-weight:800}.ta{color:#E8600A;font-size:22px}.sig{width:200px;border-top:1px solid #ccc;padding-top:6px;font-size:11px;color:#aaa;margin-top:40px}.ft{margin-top:28px;padding-top:16px;border-top:2px solid #E8600A;display:flex;justify-content:space-between;font-size:11px;color:#aaa}.pb{background:#E8600A;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:11px}@media print{.pb{display:none}body{padding:20px}}</style></head><body>
  <div class="hdr"><div><div class="bt">MOÉ</div><div class="bb">MOVES</div><div style="font-size:11px;color:#aaa;margin-top:6px">Ilorin, Kwara State · @moemoves</div></div><div><div class="in">${num}</div><div class="il">INVOICE</div><div class="il">Date: ${date}</div></div></div>
  <div class="meta"><div class="mb"><h4>Billed To</h4><p><strong>${client}</strong></p><p>📞 ${phone}</p></div><div class="mb"><h4>Job Details</h4><p>📍 From: ${from||'—'}</p><p>📍 To: ${to||'—'}</p><p>📅 Date: ${date}</p></div></div>
  <table><thead><tr><th>Service</th><th style="text-align:right">Qty</th><th style="text-align:right">Rate (₦)</th><th style="text-align:right">Total (₦)</th></tr></thead><tbody>${invLines.map(l=>`<tr><td>${l.desc||'—'}</td><td style="text-align:right">${l.qty}</td><td style="text-align:right">${l.rate.toLocaleString()}</td><td style="text-align:right">${(l.qty*l.rate).toLocaleString()}</td></tr>`).join('')}</tbody></table>
  <div class="tr"><span>TOTAL DUE</span><span class="ta">₦${total.toLocaleString()}</span></div>
  <p style="font-size:12px;color:#666;margin-top:10px"><strong>Payment Notes:</strong> ${notes}</p>
  <div style="display:flex;justify-content:space-between;margin-top:40px"><div class="sig">Client Signature</div><div class="sig" style="text-align:right">Moé Moves Authorised</div></div>
  <div class="ft"><span>Moé Moves · Ilorin · 2026</span><span>"Your Move, Made Easy."</span><button class="pb" onclick="window.print()">🖨️ Print Invoice</button></div>
  </body></html>`);
  w.document.close();showToast('Invoice saved and opened!');
}
