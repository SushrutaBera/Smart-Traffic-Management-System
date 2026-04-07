// ── CLOCK
function updateClock() {
    document.getElementById('clock').textContent =
        new Date().toLocaleTimeString('en-IN', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// ── JUNCTION DATA
const junctionData = [
    { id: 'J1', name: 'MG Road / NH-44',  status: 'green',  queue: 120, wait: 18, vehicles: 340 },
    { id: 'J2', name: 'Anna Salai',        status: 'yellow', queue: 280, wait: 32, vehicles: 520 },
    { id: 'J3', name: 'Poonamallee HW',    status: 'red',    queue: 650, wait: 58, vehicles: 890 },
    { id: 'J5', name: 'Tambaram',          status: 'red',    queue: 480, wait: 45, vehicles: 670 },
    { id: 'J6', name: 'Velachery',         status: 'green',  queue: 95,  wait: 12, vehicles: 210 },
    { id: 'J7', name: 'OMR Toll',          status: 'yellow', queue: 310, wait: 28, vehicles: 440 },
];

// ── RENDER JUNCTION CARDS
const grid = document.getElementById('jGrid');
junctionData.forEach(j => {
    const qColor = j.queue > 400 ? 'var(--red)' : j.queue > 200 ? 'var(--accent4)' : 'var(--accent3)';
    const sLabel = j.status.toUpperCase();
    const card = document.createElement('div');
    card.className = 'j-card';
    card.innerHTML = `
        <div class="j-header">
            <div>
                <div class="j-name">${j.id} – ${j.name}</div>
                <div class="j-loc">${j.id === 'J3' ? '⚠ FAULT – Manual Mode' : 'Auto-adaptive mode'}</div>
            </div>
            <div class="traffic-light">
                <div class="tl-bulb ${j.status === 'red'    ? 'active-red'    : ''}"></div>
                <div class="tl-bulb ${j.status === 'yellow' ? 'active-yellow' : ''}"></div>
                <div class="tl-bulb ${j.status === 'green'  ? 'active-green'  : ''}"></div>
            </div>
        </div>
        <div class="j-stats">
            <div class="j-stat"><div class="j-stat-label">QUEUE</div>
                <div class="j-stat-val" style="color:${qColor}">${j.queue}m</div></div>
            <div class="j-stat"><div class="j-stat-label">WAIT</div>
                <div class="j-stat-val" style="color:var(--accent2)">${j.wait}s</div></div>
            <div class="j-stat"><div class="j-stat-label">VEHICLES</div>
                <div class="j-stat-val">${j.vehicles}</div></div>
            <div class="j-stat"><div class="j-stat-label">STATUS</div>
                <div class="j-stat-val" style="font-size:11px;color:${
                    j.status === 'red' ? 'var(--red)' :
                    j.status === 'yellow' ? 'var(--accent4)' : 'var(--accent3)'
                }">${sLabel}</div></div>
        </div>
        <div class="j-controls">
            <div class="j-btn red"    onclick="forceSignal('${j.id}', 'RED')">🔴 RED</div>
            <div class="j-btn yellow" onclick="forceSignal('${j.id}', 'YELLOW')">🟡 YEL</div>
            <div class="j-btn green"  onclick="forceSignal('${j.id}', 'GREEN')">🟢 GRN</div>
        </div>
    `;
    grid.appendChild(card);
});

// ── FORCE SIGNAL OVERRIDE
function forceSignal(id, color) {
    alert(`Override applied: Junction ${id} forced to ${color}.\nReverts to adaptive mode in 120 seconds.`);
}

// ── AI PHASE OPTIMIZATION LOGIC
function calculateOptimalPhase(queueA, queueB) {
    const ratio = queueA / queueB;
    if (ratio > 2.5) return 50;   // heavy congestion → long green
    if (ratio > 1.5) return 40;   // moderate → slightly extended
    return 30;                     // balanced → default
}

function applyAI() {
    // J3: 650 vehicles on main road vs 200 on side road
    const recommended = calculateOptimalPhase(650, 200);
    alert(
        `AI Recommendation Applied to J3 Poonamallee!\n\n` +
        `Queue ratio: 3.2× (650 vs 200 vehicles)\n` +
        `New green phase: ${recommended}s (was 30s)\n` +
        `Estimated wait time reduction: ~35%`
    );
}

// ── MANUAL SLIDER LOGIC
const redSlider = document.getElementById('redSlider');
const yelSlider = document.getElementById('yelSlider');
const grnSlider = document.getElementById('grnSlider');

function updateCycleTime() {
    const r = parseInt(redSlider.value);
    const y = parseInt(yelSlider.value);
    const g = parseInt(grnSlider.value);
    document.getElementById('redVal').textContent = r + 's';
    document.getElementById('yelVal').textContent = y + 's';
    document.getElementById('grnVal').textContent = g + 's';
    document.getElementById('cycleTime').textContent = (r + y * 2 + g) + 's';
}

redSlider.addEventListener('input', updateCycleTime);
yelSlider.addEventListener('input', updateCycleTime);
grnSlider.addEventListener('input', updateCycleTime);

function applyManual() {
    const r = redSlider.value;
    const y = yelSlider.value;
    const g = grnSlider.value;
    alert(
        `Manual Override Applied!\n\n` +
        `Red: ${r}s | Yellow: ${y}s | Green: ${g}s\n` +
        `Total cycle time: ${parseInt(r) + parseInt(y)*2 + parseInt(g)}s`
    );
}