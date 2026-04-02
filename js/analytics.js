// =============================================
//  SmartFlow — Analytics JS
//  analytics.js
// =============================================

// --- Tab switching ---
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// --- Line Chart (24-hour volume) ---
const volumes   = [50,80,120,200,350,480,820,1100,980,860,720,680,710,750,800,880,1050,1180,980,720,480,320,200,90];
const yesterday = [60,70,110,190,320,460,790,1050,920,800,700,650,690,720,770,850,1000,1120,940,700,460,300,190,80];

const svg  = document.getElementById('lineChartSVG');
const maxV = Math.max(...volumes, ...yesterday);
const xs   = Array.from({ length: 24 }, (_, i) => 40 + (i * (450 / 23)));
const ys   = v => 140 - (v / maxV * 120);

if (svg) {
  // today line
  const pts = volumes.map((v, i) => `${xs[i]},${ys(v)}`).join(' ');
  document.getElementById('linePath').setAttribute('d', 'M' + pts.replace(/ /g, ' L'));
  document.getElementById('areaPath').setAttribute(
    'd',
    'M' + xs[0] + ',140 ' + volumes.map((v, i) => `L${xs[i]},${ys(v)}`).join(' ') + ` L${xs[23]},140 Z`
  );

  // yesterday line
  const pts2 = yesterday.map((v, i) => `${xs[i]},${ys(v)}`).join(' ');
  document.getElementById('linePath2').setAttribute('d', 'M' + pts2.replace(/ /g, ' L'));

  // X axis labels every 4 hours
  [0, 4, 8, 12, 16, 20, 23].forEach(i => {
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', xs[i]);
    txt.setAttribute('y', 165);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('class', 'axis-label');
    txt.textContent = i + 'h';
    svg.appendChild(txt);
  });
}

// --- Zone Congestion Bars ---
const zones = [
  { name: 'North Zone',     val: 82, color: 'var(--red)' },
  { name: 'South Zone',     val: 56, color: 'var(--accent4)' },
  { name: 'East Zone (OMR)',val: 71, color: 'var(--accent2)' },
  { name: 'West Zone',      val: 44, color: 'var(--accent3)' },
  { name: 'Central',        val: 88, color: 'var(--red)' },
  { name: 'Airport Rd',     val: 38, color: 'var(--accent3)' },
];

const zc = document.getElementById('zoneChart');
if (zc) {
  zones.forEach(z => {
    zc.innerHTML += `
      <div class="hbar-row">
        <div class="hbar-label">${z.name}</div>
        <div class="hbar-bg">
          <div class="hbar-fill" style="width:${z.val}%;background:${z.color};"></div>
        </div>
        <div class="hbar-val">${z.val}%</div>
      </div>
    `;
  });
}

// --- Junction Efficiency Table ---
const junctions = [
  { name: 'J6 Velachery',       thru: 1240, wait: '12s', eff: 94, rank: 1 },
  { name: 'J8 Sholinganallur',  thru: 1180, wait: '14s', eff: 91, rank: 2 },
  { name: 'J1 MG Road',         thru: 1050, wait: '18s', eff: 88, rank: 3 },
  { name: 'J4 GST Road',        thru:  920, wait: '22s', eff: 84, rank: 4 },
  { name: 'J9 Perungudi',       thru:  880, wait: '26s', eff: 79, rank: 5 },
  { name: 'J7 OMR Toll',        thru:  760, wait: '28s', eff: 74, rank: 6 },
  { name: 'J2 Anna Salai',      thru:  640, wait: '32s', eff: 65, rank: 7 },
  { name: 'J3 Poonamallee',     thru:  480, wait: '58s', eff: 41, rank: 8 },
];

const juncTable = document.getElementById('juncTable');
if (juncTable) {
  junctions.forEach(j => {
    const rankClass = j.rank <= 3 ? `rank-${j.rank}` : '';
    const barColor  = j.eff > 80 ? 'var(--accent3)' : j.eff > 60 ? 'var(--accent4)' : 'var(--red)';
    juncTable.innerHTML += `
      <tr>
        <td><span class="rank-badge ${rankClass}">#${j.rank}</span></td>
        <td style="font-size:12px;">${j.name}</td>
        <td style="font-family:'DM Mono',monospace;color:var(--accent)">${j.thru}</td>
        <td style="font-family:'DM Mono',monospace;color:var(--accent2)">${j.wait}</td>
        <td>
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:${j.eff}%;background:${barColor};border-radius:3px;"></div>
            </div>
            <span style="font-size:11px;font-family:'DM Mono',monospace;">${j.eff}%</span>
          </div>
        </td>
      </tr>
    `;
  });
}

// --- Incident Type Bars ---
const incidents = [
  { type: 'Accidents',      count: 18, color: 'var(--red)' },
  { type: 'Signal Faults',  count: 12, color: 'var(--accent2)' },
  { type: 'Congestion',     count:  9, color: 'var(--accent4)' },
  { type: 'Waterlogging',   count:  5, color: 'var(--accent)' },
  { type: 'Road Work',      count:  3, color: 'var(--muted)' },
];

const ib = document.getElementById('incidentBars');
if (ib) {
  incidents.forEach(inc => {
    ib.innerHTML += `
      <div class="hbar-row">
        <div class="hbar-label" style="min-width:90px;">${inc.type}</div>
        <div class="hbar-bg">
          <div class="hbar-fill" style="width:${(inc.count / 18 * 100).toFixed(0)}%;background:${inc.color};"></div>
        </div>
        <div class="hbar-val">${inc.count}</div>
      </div>
    `;
  });
}

// --- Incident By Time Bars ---
const timePeriods = [
  { period: '6–9 AM',  count: 35, color: 'var(--accent2)' },
  { period: '9–12 PM', count: 20, color: 'var(--accent4)' },
  { period: '12–4 PM', count: 15, color: 'var(--accent3)' },
  { period: '4–8 PM',  count: 38, color: 'var(--red)' },
  { period: '8–12 AM', count: 10, color: 'var(--muted)' },
];

const timeBars = document.getElementById('timeBars');
if (timeBars) {
  timePeriods.forEach(t => {
    timeBars.innerHTML += `
      <div class="hbar-row">
        <div class="hbar-label" style="min-width:70px;">${t.period}</div>
        <div class="hbar-bg">
          <div class="hbar-fill" style="width:${(t.count / 38 * 100).toFixed(0)}%;background:${t.color};"></div>
        </div>
        <div class="hbar-val">${t.count}</div>
      </div>
    `;
  });
}
