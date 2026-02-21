(function () {
  const root = document.querySelector('[data-platform-experience]');
  if (!root) return;

  const content = document.getElementById('experience-content');
  const routeButtons = root.querySelectorAll('[data-route]');
  const defaultRoute = 'platforms';

  const pickerData = [
    { name: 'Picker 01', rate: 132 },
    { name: 'Picker 02', rate: 118 },
    { name: 'Picker 03', rate: 96 },
    { name: 'Picker 04', rate: 141 },
    { name: 'Picker 05', rate: 102 },
    { name: 'Picker 06', rate: 88 },
  ];

  const templates = {
    platforms: () => `
      <h3>Three platforms, one operational advantage</h3>
      <p>Select a platform tile to open the dedicated experience.</p>
      <div class="xp-grid platform-grid">
        <button class="xp-card platform-launch" data-open-route="operis"><h4>Operis</h4><p>Direct Labour control tower, live picker performance and throughput KPI steering.</p></button>
        <button class="xp-card platform-launch" data-open-route="astra"><h4>Astra</h4><p>Drone-based autonomous cycle counting mission simulator and inventory variance reporting.</p></button>
        <button class="xp-card platform-launch" data-open-route="scs"><h4>SCS Consultancy</h4><p>Multidisciplinary transformation team spanning operations, data, engineering and governance.</p></button>
      </div>
    `,
    operis: () => `
      <h3>Operis | Direct Labour Performance Studio</h3>
      <p>Click to open the full-screen dashboard and interact with picker productivity, norms, and warehouse KPI controls.</p>
      <button class="btn btn-primary" id="open-operis-dashboard">Open full-screen Operis dashboard</button>
      <div class="kpi-inline">
        <div class="kpi-tile"><small>Warehouse UPH</small><strong>121</strong></div>
        <div class="kpi-tile"><small>Norm attainment</small><strong>84%</strong></div>
        <div class="kpi-tile"><small>Labour utilisation</small><strong>91%</strong></div>
      </div>
      <div class="operis-overlay" id="operis-overlay" aria-hidden="true">
        <div class="operis-panel">
          <div class="operis-head">
            <h4>Operis Performance Dashboard</h4>
            <button class="ui-dot" id="close-operis-dashboard" aria-label="Close dashboard">×</button>
          </div>
          <div class="roi-controls">
            <label>Norm target (UPH) <span id="norm-target-value">110</span><input id="norm-target" type="range" min="80" max="150" value="110" /></label>
            <label>Shift pressure % <span id="shift-pressure-value">100</span><input id="shift-pressure" type="range" min="70" max="130" value="100" /></label>
            <label>Support interventions <span id="support-value">2</span><input id="support" type="range" min="0" max="8" value="2" /></label>
          </div>
          <div class="operis-chart" id="operis-chart"></div>
          <div class="picker-table-wrap"><table class="picker-table"><thead><tr><th>Picker</th><th>UPH</th><th>Status</th></tr></thead><tbody id="picker-table-body"></tbody></table></div>
        </div>
      </div>
    `,
    astra: () => `
      <h3>Astra | Autonomous Drone Cycle Count</h3>
      <p>Select mission profile and run a live mock mission across racking aisles.</p>
      <div class="mission-controls">
        <button class="mission-btn active" data-mission="A">Count A</button>
        <button class="mission-btn" data-mission="B">Count B</button>
        <button class="mission-btn" data-mission="C">Count C</button>
        <button class="mission-btn" data-mission="ALL">Count ALL</button>
        <button class="btn btn-primary" id="start-mission">Start mission</button>
      </div>
      <div class="warehouse-sim" id="warehouse-sim">
        <div class="drone" id="drone"></div>
        ${Array.from({length:18}).map((_,i)=>`<div class="rack">R${String(i+1).padStart(2,'0')}</div>`).join('')}
      </div>
      <p id="mission-log">Mission idle. Awaiting command.</p>
      <div class="xp-kpis" id="astra-report">
        <div class="kpi-tile"><small>Locations scanned</small><strong id="loc-scanned">0</strong></div>
        <div class="kpi-tile"><small>Articles counted</small><strong id="sku-counted">0</strong></div>
        <div class="kpi-tile"><small>Boxes counted</small><strong id="boxes-counted">0</strong></div>
        <div class="kpi-tile"><small>Inventory accuracy</small><strong id="inv-accuracy">--</strong></div>
      </div>
    `,
    scs: () => `
      <h3>SCS Consultancy | Multidisciplinary Team</h3>
      <p>Our SCS bench combines strategy, warehousing, industrial engineering, analytics and transformation leadership.</p>
      <div class="chip-row">
        <button class="mission-btn active" data-team-filter="all">All</button>
        <button class="mission-btn" data-team-filter="operations">Operations</button>
        <button class="mission-btn" data-team-filter="data">Data</button>
        <button class="mission-btn" data-team-filter="delivery">Delivery</button>
      </div>
      <div class="xp-grid" id="team-grid"></div>
    `,
  };

  const team = [
    { name: 'Warehouse Excellence Lead', d: 'operations', text: 'Direct labour diagnostics and flow-control redesign.' },
    { name: 'Automation Program Architect', d: 'delivery', text: 'AS/RS integration, mission orchestration and rollout leadership.' },
    { name: 'Data & KPI Strategist', d: 'data', text: 'KPI model design, benchmark calibration and decision dashboards.' },
    { name: 'Change & Governance Principal', d: 'delivery', text: 'Steering rhythm, PMO controls and executive stakeholder cadence.' },
    { name: 'Inventory Accuracy Specialist', d: 'operations', text: 'Cycle count governance, root cause elimination and SOP uplift.' },
    { name: 'Applied Operations Analyst', d: 'data', text: 'Scenario simulation and continuous improvement scorecards.' },
  ];

  function getRoute() {
    const route = new URLSearchParams(location.search).get('xp');
    return templates[route] ? route : defaultRoute;
  }

  function setActive(route) {
    routeButtons.forEach((button) => button.classList.toggle('active', button.dataset.route === route));
  }

  function render(route, push) {
    const safeRoute = templates[route] ? route : defaultRoute;
    content.innerHTML = templates[safeRoute]();
    setActive(safeRoute);

    if (push) {
      const url = new URL(location.href);
      url.searchParams.set('xp', safeRoute);
      history.pushState({ xp: safeRoute }, '', url);
    }

    if (safeRoute === 'platforms') initPlatforms();
    if (safeRoute === 'operis') initOperis();
    if (safeRoute === 'astra') initAstra();
    if (safeRoute === 'scs') initSCS();
  }

  function initPlatforms() {
    content.querySelectorAll('[data-open-route]').forEach((button) => {
      button.addEventListener('click', () => render(button.dataset.openRoute, true));
    });
  }

  function initOperis() {
    const overlay = document.getElementById('operis-overlay');
    const open = document.getElementById('open-operis-dashboard');
    const close = document.getElementById('close-operis-dashboard');
    const chart = document.getElementById('operis-chart');
    const table = document.getElementById('picker-table-body');

    const norm = document.getElementById('norm-target');
    const shift = document.getElementById('shift-pressure');
    const support = document.getElementById('support');
    const normValue = document.getElementById('norm-target-value');
    const shiftValue = document.getElementById('shift-pressure-value');
    const supportValue = document.getElementById('support-value');

    const draw = () => {
      const normTarget = Number(norm.value);
      const pressure = Number(shift.value) / 100;
      const supportBoost = Number(support.value) * 2;

      normValue.textContent = normTarget;
      shiftValue.textContent = shift.value;
      supportValue.textContent = support.value;

      chart.innerHTML = '';
      table.innerHTML = '';

      pickerData.forEach((picker) => {
        const adjusted = Math.max(55, Math.round((picker.rate * pressure) + supportBoost));
        const below = adjusted < normTarget;

        const bar = document.createElement('div');
        bar.className = 'bar-row';
        bar.innerHTML = `<span>${picker.name}</span><div><i style="width:${Math.min(100, adjusted / 1.6)}%"></i></div><strong>${adjusted} UPH</strong>`;
        if (below) bar.classList.add('below');
        chart.appendChild(bar);

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${picker.name}</td><td>${adjusted}</td><td>${below ? 'Below norm' : 'On target'}</td>`;
        if (below) tr.classList.add('below');
        table.appendChild(tr);
      });
    };

    [norm, shift, support].forEach((el) => el.addEventListener('input', draw));
    draw();

    open.addEventListener('click', () => overlay.classList.add('active'));
    close.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) overlay.classList.remove('active');
    });
  }

  function initAstra() {
    const buttons = content.querySelectorAll('.mission-btn[data-mission]');
    const start = document.getElementById('start-mission');
    const drone = document.getElementById('drone');
    const racks = Array.from(content.querySelectorAll('.rack'));
    const log = document.getElementById('mission-log');

    const loc = document.getElementById('loc-scanned');
    const sku = document.getElementById('sku-counted');
    const boxes = document.getElementById('boxes-counted');
    const acc = document.getElementById('inv-accuracy');

    let mission = 'A';

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        mission = button.dataset.mission;
        buttons.forEach((b) => b.classList.toggle('active', b === button));
      });
    });

    function rackSet() {
      if (mission === 'A') return racks.slice(0, 6);
      if (mission === 'B') return racks.slice(6, 12);
      if (mission === 'C') return racks.slice(12);
      return racks;
    }

    start.addEventListener('click', async () => {
      const targets = rackSet();
      let scanned = 0;
      log.textContent = `Mission ${mission} started. Drone taking off…`;

      for (const rack of targets) {
        const rect = rack.getBoundingClientRect();
        const parent = rack.parentElement.getBoundingClientRect();
        drone.style.left = `${rect.left - parent.left + 8}px`;
        drone.style.top = `${rect.top - parent.top + 8}px`;
        rack.classList.add('scanned');
        scanned += 1;
        loc.textContent = String(scanned);
        sku.textContent = String(scanned * 37);
        boxes.textContent = String(scanned * 19);
        log.textContent = `Scanning ${rack.textContent}…`; 
        await new Promise((r) => setTimeout(r, 280));
      }

      const mismatch = mission === 'ALL' ? 'Mismatch found in aisle R11' : `Mismatch found in ${targets[Math.floor(targets.length / 2)].textContent}`;
      acc.textContent = `${(99.2 - (mission === 'ALL' ? .7 : .4)).toFixed(1)}%`;
      log.textContent = `Mission complete. ${mismatch}. Report ready.`;
    });
  }

  function initSCS() {
    const grid = document.getElementById('team-grid');
    const filters = content.querySelectorAll('[data-team-filter]');

    const draw = (filter) => {
      grid.innerHTML = '';
      team.filter((item) => filter === 'all' || item.d === filter).forEach((item) => {
        const card = document.createElement('article');
        card.className = 'xp-card';
        card.innerHTML = `<h4>${item.name}</h4><p>${item.text}</p><small>${item.d.toUpperCase()}</small>`;
        grid.appendChild(card);
      });
    };

    filters.forEach((button) => {
      button.addEventListener('click', () => {
        filters.forEach((b) => b.classList.toggle('active', b === button));
        draw(button.dataset.teamFilter);
      });
    });

    draw('all');
  }

  routeButtons.forEach((button) => button.addEventListener('click', () => render(button.dataset.route, true)));
  window.addEventListener('popstate', () => render(getRoute(), false));
  render(getRoute(), false);

  document.querySelectorAll('[data-enter-platform]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!link.getAttribute('href')?.startsWith('#')) return;
      event.preventDefault();
      root.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      root.classList.toggle('in-view', entry.isIntersecting);
      document.body.classList.toggle('experience-active', entry.isIntersecting);
    });
  }, { threshold: .25 });

  observer.observe(root);
})();
