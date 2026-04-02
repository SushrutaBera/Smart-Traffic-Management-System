// =============================================
//  SmartFlow — Signal Control JS
//  signal-control.js
// =============================================

const junctionData = [
  { id: 'J1', name: 'MG Road / NH-44',  status: 'green',  queue: 120, wait: 18, vehicles: 340, fault: false },
  { id: 'J2', name: 'Anna Salai',        status: 'yellow', queue: 280, wait: 32, vehicles: 520, fault: false },
  { id: 'J3', name: 'Poonamallee HW',   status: 'red',    queue: 650, wait: 58, vehicles: 890, fault: true  },
  { id: 'J5', name: 'Tambaram',          status: 'red',    queue: 480, wait: 45, vehicles: 670, fault: false },
  { id: 'J6', name: 'Velachery',         status: 'green',  queue:  95, wait: 12, vehicles: 210, fault: false },
  { id: 'J7', name: 'OMR Toll',          status: 'yellow', queue: 310, wait: 28, vehicles: 440, fault: false },
];

const grid = document.getElementById('jGrid');

if (grid) {
  junctionData.forEach(j => {
    const redActive = j.status === 'red';
    const yelActive = j.status === 'yellow';
    const grnActive = j.status === 'green';

    const queueColor = j.queue > 400
      ? 'var(--red)'
      : j.queue > 200
        ? 'var(--accent4)'
        : 'var(--accent3)';

    const statusColor = redActive
      ? 'var(--red)'
      : yelActive
        ? 'var(--accent4)'
        : 'var(--accent3)';

    const card = document.createElement('div');
    card.className = 'j-card';
    card.innerHTML = `
      <div class="j-header">
        <div>
          <div class="j-name">${j.id} – ${j.name}</div>
          <div class="j-loc">${j.fault ? '⚠ FAULT – Manual Mode' : 'Auto-adaptive mode'}</div>
        </div>
        <div class="j-signal">
          <div class="traffic-light">
            <div class="tl-bulb ${redActive ? 'active-red' : ''}"></div>
            <div class="tl-bulb ${yelActive ? 'active-yellow' : ''}"></div>
            <div class="tl-bulb ${grnActive ? 'active-green' : ''}"></div>
          </div>
        </div>
      </div>

      <div class="j-stats">
        <div class="j-stat">
          <div class="j-stat-label">QUEUE</div>
          <div class="j-stat-val" style="color:${queueColor}">${j.queue}m</div>
        </div>
        <div class="j-stat">
          <div class="j-stat-label">WAIT</div>
          <div class="j-stat-val" style="color:var(--accent2)">${j.wait}s</div>
        </div>
        <div class="j-stat">
          <div class="j-stat-label">VEHICLES</div>
          <div class="j-stat-val">${j.vehicles}</div>
        </div>
        <div class="j-stat">
          <div class="j-stat-label">STATUS</div>
          <div class="j-stat-val" style="font-size:11px;color:${statusColor}">${j.status.toUpperCase()}</div>
        </div>
      </div>

      <div class="j-controls">
        <button class="j-btn red"    onclick="forceSignal('${j.id}', 'RED')">🔴 RED</button>
        <button class="j-btn yellow" onclick="forceSignal('${j.id}', 'YEL')">🟡 YEL</button>
        <button class="j-btn green"  onclick="forceSignal('${j.id}', 'GRN')">🟢 GRN</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --- Force signal override ---
function forceSignal(id, color) {
  alert(`Override applied: Junction ${id} forced to ${color}.\nThis will revert to adaptive mode in 120 seconds.`);
}

// --- Apply AI recommendation ---
function applyAI() {
  alert('AI Recommendation applied to J3.\nGreen phase extended to 50s. Estimated queue reduction: 35%.');
}

// --- Apply manual slider settings ---
function applyManual() {
  const r = parseInt(document.getElementById('redSlider').value);
  const y = parseInt(document.getElementById('yelSlider').value);
  const g = parseInt(document.getElementById('grnSlider').value);
  const total = r + y * 2 + g;
  document.getElementById('cycleTime').textContent = total + 's';
  alert(`Manual override applied!\nRed: ${r}s | Yellow: ${y}s | Green: ${g}s\nCycle time: ${total}s`);
}

// --- Update cycle time live when sliders move ---
function updateCycleTime() {
  const r = parseInt(document.getElementById('redSlider').value);
  const y = parseInt(document.getElementById('yelSlider').value);
  const g = parseInt(document.getElementById('grnSlider').value);
  document.getElementById('cycleTime').textContent = (r + y * 2 + g) + 's';
}

['redSlider', 'yelSlider', 'grnSlider'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      // update its own label
      const labels = { redSlider: 'redVal', yelSlider: 'yelVal', grnSlider: 'grnVal' };
      document.getElementById(labels[id]).textContent = el.value + 's';
      updateCycleTime();
    });
  }
});
