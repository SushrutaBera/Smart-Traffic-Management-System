// =============================================
//  SmartFlow — Dashboard JS
//  index.js
// =============================================

// --- Animated KPI counters ---
function animKPI(id, base, delta, suffix = '') {
  setInterval(() => {
    const v = base + Math.floor((Math.random() - 0.5) * delta);
    const el = document.getElementById(id);
    if (el) {
      el.textContent = suffix ? v + suffix : v.toLocaleString();
    }
  }, 3000);
}

animKPI('kpi1', 2847, 120);
animKPI('kpi2', 34, 8);
animKPI('kpi4', 63, 10, '%');

// --- Bar Chart (hourly traffic volume) ---
const hours    = ['06','07','08','09','10','11','12','13','14','15'];
const inbound  = [320, 580, 980, 1100, 820, 760, 700, 650, 720, 880];
const outbound = [200, 450, 860,  950, 700, 680, 640, 600, 680, 800];
const maxV     = Math.max(...inbound, ...outbound);

const chart  = document.getElementById('barChart');
const labels = document.getElementById('chartLabels');

if (chart && labels) {
  hours.forEach((h, i) => {
    const group = document.createElement('div');
    group.className = 'bar-group';

    const b1 = document.createElement('div');
    b1.className = 'bar a';
    b1.style.height = (inbound[i] / maxV * 140) + 'px';
    b1.title = `Inbound: ${inbound[i]}`;

    const b2 = document.createElement('div');
    b2.className = 'bar b';
    b2.style.height = (outbound[i] / maxV * 140) + 'px';
    b2.title = `Outbound: ${outbound[i]}`;

    group.append(b1, b2);
    chart.appendChild(group);

    const l = document.createElement('span');
    l.textContent = h;
    labels.appendChild(l);
  });
}

// --- Signal Status Table ---
const signals = [
  { name: 'J1 MG Road',         status: 'green',  timer: 12, cong: 'low' },
  { name: 'J2 Anna Salai',      status: 'yellow', timer: 8,  cong: 'med' },
  { name: 'J3 Poonamallee',     status: 'red',    timer: 45, cong: 'high' },
  { name: 'J5 Tambaram',        status: 'red',    timer: 60, cong: 'high' },
  { name: 'J6 Velachery',       status: 'green',  timer: 22, cong: 'low' },
  { name: 'J10 Thoraipakkam',   status: 'red',    timer: 50, cong: 'high' },
];

const tbody = document.getElementById('signalTableBody');

if (tbody) {
  const congMap = {
    low:  ['fill-low',  25],
    med:  ['fill-med',  55],
    high: ['fill-high', 88],
  };

  signals.forEach(s => {
    const [cls, pct] = congMap[s.cong];
    const safeId = 't_' + s.name.replace(/\s/g, '');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-size:12px;">${s.name}</td>
      <td>
        <span class="sig-status">
          <span class="sig-dot ${s.status}"></span>
          ${s.status.toUpperCase()}
        </span>
      </td>
      <td><span class="sig-timer" id="${safeId}">${s.timer}s</span></td>
      <td>
        <div class="congestion-bar">
          <div class="congestion-fill ${cls}" style="width:${pct}%"></div>
        </div>
      </td>
    `;
    tbody.appendChild(tr);

    // countdown timer per signal
    let t = s.timer;
    setInterval(() => {
      t--;
      if (t < 0) t = s.timer;
      const el = document.getElementById(safeId);
      if (el) el.textContent = t + 's';
    }, 1000);
  });
}

// --- Heatmap ---
const days   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const hmData = [
  [1, 2, 3, 4, 3, 1, 0],
  [2, 3, 4, 4, 4, 2, 1],
  [1, 2, 3, 3, 3, 1, 0],
  [2, 3, 4, 4, 3, 2, 1],
  [3, 4, 4, 4, 4, 3, 1],
  [1, 2, 2, 3, 2, 1, 0],
  [0, 1, 1, 2, 1, 0, 0],
];
const times = ['06h','08h','10h','12h','14h','16h','18h'];

const hmDays = document.getElementById('hmDays');
if (hmDays) {
  days.forEach(d => {
    const s = document.createElement('span');
    s.textContent = d;
    hmDays.appendChild(s);
  });
}

const hm = document.getElementById('heatmap');
if (hm) {
  hmData.forEach((row, ri) => {
    row.forEach((val, ci) => {
      const cell = document.createElement('div');
      cell.className = `hm-cell hm-${val}`;
      cell.textContent = val > 0 ? val : '·';
      cell.title = `${days[ci]} ${times[ri]}: Level ${val}`;
      hm.appendChild(cell);
    });
  });
}

// --- Gauge animation ---
// let gaugeAngle  = -20;
// let gaugeTarget = -20;

// function animGauge() {
//   gaugeTarget = -90 + Math.random() * 140;
//   const needle = document.getElementById('needle');
//   const valEl  = document.getElementById('gaugeVal');

//   if (needle) {
//     gaugeAngle += (gaugeTarget - gaugeAngle) * 0.1;
//     needle.setAttribute('transform', `rotate(${gaugeAngle},90,100)`);
//     const speed = Math.round(((gaugeAngle + 90) / 140) * 100);
//     if (valEl) valEl.textContent = Math.max(5, Math.min(100, speed));
//   }
//   requestAnimationFrame(animGauge);
// }
// animGauge();

// --- Last sync counter ---
let syncSec = 0;
setInterval(() => {
  syncSec++;
  const el = document.getElementById('lastSync');
  if (el) {
    el.textContent = syncSec < 60 ? syncSec + 's ago' : Math.floor(syncSec / 60) + 'm ago';
  }
  if (syncSec > 30) syncSec = 0;
}, 1000);

// --- Junction modal ---
function selectJunction(name, status, timer, cong) {
  document.getElementById('jTitle').textContent = name;
  const colors = { GREEN: 'var(--accent3)', RED: 'var(--red)', YELLOW: 'var(--accent4)' };
  const c = colors[status] || 'var(--accent)';
  const congPct = cong === 'High' ? 88 : cong === 'Med' ? 55 : 25;
  const congColor = cong === 'High' ? 'var(--red)' : cong === 'Med' ? 'var(--accent4)' : 'var(--accent3)';

  document.getElementById('jBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
      <div style="background:var(--surface2);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);font-family:'DM Mono',monospace;margin-bottom:4px;">SIGNAL</div>
        <div style="font-size:22px;font-weight:700;color:${c};font-family:'Syne',sans-serif;">${status}</div>
      </div>
      <div style="background:var(--surface2);border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:var(--muted);font-family:'DM Mono',monospace;margin-bottom:4px;">TIMER</div>
        <div style="font-size:22px;font-weight:700;color:var(--accent);font-family:'Syne',sans-serif;">${timer}</div>
      </div>
    </div>
    <div style="background:var(--surface2);border-radius:8px;padding:12px;margin-bottom:12px;">
      <div style="font-size:11px;color:var(--muted);margin-bottom:8px;font-family:'DM Mono',monospace;">CONGESTION LEVEL</div>
      <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden;">
        <div style="height:100%;width:${congPct}%;background:${congColor};border-radius:4px;"></div>
      </div>
      <div style="font-size:12px;margin-top:6px;color:var(--text);">${cong} Congestion</div>
    </div>
    <div style="display:flex;gap:8px;">
      <button
        style="flex:1;padding:10px;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);color:var(--accent);border-radius:8px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;"
        onclick="closeModal()">Override Signal</button>
      <button
        style="flex:1;padding:10px;background:rgba(255,59,92,0.1);border:1px solid rgba(255,59,92,0.3);color:var(--red);border-radius:8px;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;"
        onclick="closeModal()">Report Issue</button>
    </div>
  `;
  document.getElementById('junctionOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('junctionOverlay').classList.remove('open');
}

function showAlerts() {
  alert('2 critical alerts:\n1. Signal Failure – J3 Poonamallee (08:42)\n2. Accident on NH-44 near J5 (08:51)\n\nManual intervention required.');
}
