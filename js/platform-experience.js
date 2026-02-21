(function () {
  const root = document.querySelector('[data-platform-experience]');
  if (!root) return;

  const content = root.querySelector('#experience-content');
  const routeButtons = root.querySelectorAll('[data-route]');
  const defaults = { route: 'platforms' };

  const pickerData = [
    { name: 'A. Vermeer', base: 146, role: 'Pick to Light' },
    { name: 'B. Janssen', base: 131, role: 'Decanting' },
    { name: 'C. Visser', base: 112, role: 'Replenishment Truck' },
    { name: 'D. Bakker', base: 98, role: 'Loading' },
    { name: 'E. Smit', base: 124, role: 'Pick to Light' },
    { name: 'F. de Jong', base: 89, role: 'Decanting' },
    { name: 'G. Peters', base: 138, role: 'Replenishment Truck' },
    { name: 'H. Willems', base: 116, role: 'Loading' }
  ];

  const teamData = [
    { name: 'Nina de Wit', d: 'operations', text: 'Flow engineering, shift orchestration and labour balancing.' },
    { name: 'Marco van den Berg', d: 'analytics', text: 'KPI architecture, forecasting and sensitivity modelling.' },
    { name: 'Elena Rosa', d: 'tech', text: 'Platform engineering, system integration and OT tooling.' },
    { name: 'Sven Kuiper', d: 'governance', text: 'Program governance, value realization and board reporting.' },
    { name: 'Leah Vos', d: 'operations', text: 'Warehouse operating model redesign and process assurance.' },
    { name: 'Tom Jans', d: 'tech', text: 'Automation interfaces and controls modernization.' }
  ];

  const templates = {
    platforms: () => `
      <h3>Three platforms, one control narrative</h3>
      <p>Ascentra combines Operis, Astra and SCS Consultancy in one state-of-the-art operating layer for performance, inventory intelligence and transformation delivery.</p>
      <div class="xp-grid platform-grid">
        <button class="xp-card platform-launch" data-open-route="operis"><h4>Operis</h4><p>Direct Labour command center with deep KPI analytics, SCADA-like live flow and intervention guidance.</p></button>
        <button class="xp-card platform-launch" data-open-route="astra"><h4>Astra</h4><p>Drone mission control with scan visualisation, mismatch signaling and cycle-count dispatch.</p></button>
        <button class="xp-card platform-launch" data-open-route="scs"><h4>SCS Consultancy</h4><p>Multidisciplinary team support from strategic diagnostics to implementation governance.</p></button>
      </div>
    `,

    operis: () => `
      <h3>Operis | Direct Labour Command Center</h3>
      <p>Launch the full-screen dashboard to explore operational pressure, real-time flow quality, shift simulation and staffing recommendations.</p>
      <button class="btn btn-primary" id="open-operis-dashboard">Open full-screen Operis dashboard</button>
      <div class="kpi-inline">
        <div class="kpi-tile"><small>Direct Labour control</small><strong>94%</strong></div>
        <div class="kpi-tile"><small>Current throughput</small><strong>+18%</strong></div>
        <div class="kpi-tile"><small>Norm deviation</small><strong>-7%</strong></div>
      </div>

      <div class="operis-overlay" id="operis-overlay" aria-hidden="true">
        <div class="operis-panel">
          <div class="operis-head"><h4>Operis Performance Dashboard</h4><button class="ui-dot" id="close-operis-dashboard" aria-label="Close dashboard">×</button></div>
          <p class="ops-explainer">Simulate pressure and interventions. Hover SCADA nodes and stations to inspect live handling quality and bottleneck risk.</p>

          <div class="roi-controls">
            <label>Norm target UPH <span id="norm-target-value">118</span><input id="norm-target" type="range" min="90" max="160" value="118" /></label>
            <label>Shift pressure % <span id="shift-pressure-value">100</span><input id="shift-pressure" type="range" min="75" max="130" value="100" /></label>
            <label>Support interventions <span id="support-value">3</span><input id="support" type="range" min="0" max="12" value="3" /></label>
          </div>

          <div class="day-target"><strong id="day-target-status">Day target status: on track</strong><p id="day-target-actions">Action focus: keep current staffing balance and maintain replenishment cadence.</p></div>

          <div class="chart-grid">
            <section class="chart-card"><h5>Picker productivity bars</h5><div class="operis-chart" id="operis-bar-chart"></div></section>
            <section class="chart-card"><h5>Hourly trend line</h5><svg id="operis-line-chart" viewBox="0 0 360 170" class="line-chart"></svg></section>
            <section class="chart-card"><h5>Labour contribution pie</h5><div id="operis-pie-chart" class="pie-chart"></div><ul id="pie-legend" class="pie-legend"></ul></section>
          </div>

          <section class="chart-card">
            <h5>SCADA process footprint</h5>
            <p>End-to-end live handling map across inbound, decanting, pick-to-light, replenishment and loading.</p>
            <div class="scada-map" id="scada-map">
              <button class="flow-node" data-flow="Inbound Dock">Inbound Dock</button>
              <button class="flow-node" data-flow="Decanting">Decanting</button>
              <button class="flow-node" data-flow="Pick-to-Light">Pick-to-Light</button>
              <button class="flow-node" data-flow="Replenishment Trucks">Replenishment Trucks</button>
              <button class="flow-node" data-flow="Loading">Loading</button>
              <div class="flow-line l1"></div><div class="flow-line l2"></div><div class="flow-line l3"></div><div class="flow-line l4"></div>
            </div>
            <p id="flow-inspector" class="flow-inspector">Hover a process node to inspect live status.</p>
          </section>

          <section class="chart-card"><h5>Station components</h5><div class="station-grid" id="station-grid"></div></section>
          <section class="chart-card"><h5>Picker performance table</h5><div class="picker-table-wrap"><table class="picker-table"><thead><tr><th>Picker</th><th>Process</th><th>UPH</th><th>Norm gap</th><th>Status</th></tr></thead><tbody id="picker-table-body"></tbody></table></div></section>
          <section class="chart-card chatbot"><h5>Operis Assistant</h5><div class="chat-log" id="chat-log"><div class="msg bot">Ask: "How can I increase output?"</div></div><div class="chat-input"><input id="chat-input" type="text" placeholder="Type your question..." /><button id="chat-send">Send</button></div></section>
        </div>
      </div>
    `,

    astra: () => `
      <h3>Astra | Mission Control</h3>
      <p>Select mission scope and simulation speed. Astra visualizes scan-lines, box-edge detection and mismatch escalation in real time.</p>
      <div class="mission-controls">
        <button class="mission-btn active" data-mission="A">Count A</button>
        <button class="mission-btn" data-mission="B">Count B</button>
        <button class="mission-btn" data-mission="C">Count C</button>
        <button class="mission-btn" data-mission="ALL">Count ALL</button>
      </div>
      <div class="mission-controls">
        <button class="mission-btn active" data-speed="normal">Normal</button>
        <button class="mission-btn" data-speed="high">High speed</button>
        <button class="btn btn-secondary" id="start-mission">Launch mission</button>
      </div>

      <div class="xp-kpis">
        <div class="kpi-tile"><small>Locations scanned</small><strong id="loc-scanned">0</strong></div>
        <div class="kpi-tile"><small>SKU faces counted</small><strong id="sku-counted">0</strong></div>
        <div class="kpi-tile"><small>Boxes segmented</small><strong id="boxes-counted">0</strong></div>
        <div class="kpi-tile"><small>Inventory accuracy</small><strong id="inv-accuracy">99.1%</strong></div>
      </div>

      <p id="vision-toast" class="vision-toast">Drone vision standby.</p>

      <div class="warehouse-sim" id="warehouse-sim">
        <div class="drone-vehicle" id="drone"><span class="drone-body"></span><span class="rotor r1"></span><span class="rotor r2"></span><span class="rotor r3"></span><span class="rotor r4"></span></div>
        ${Array.from({ length: 24 }, (_, i) => `
          <article class="rack" data-rack="R${String(i + 1).padStart(2, '0')}">
            <strong>R${String(i + 1).padStart(2, '0')}</strong>
            <div class="pallet-face">
              <div class="box-grid">${Array.from({ length: 9 }, () => '<span class="box"></span>').join('')}</div>
              <div class="scan-lines"></div>
            </div>
            <small>Aisle ${Math.floor(i / 6) + 1}</small>
          </article>
        `).join('')}
      </div>

      <p class="status" id="mission-log">Choose mission parameters and press launch.</p>
      <div class="chip-row"><button class="btn btn-secondary" id="send-cycle-task">Send cycle count task</button></div>
      <ul class="report-list" id="mission-report-list"></ul>
    `,

    scs: () => `
      <h3>SCS Consultancy | Multidisciplinary Team</h3>
      <p>Operational excellence requires a broad team: operations, analytics, technology and governance in one delivery model.</p>
      <div class="chip-row">
        <button class="mission-btn active" data-team-filter="all">All disciplines</button>
        <button class="mission-btn" data-team-filter="operations">Operations</button>
        <button class="mission-btn" data-team-filter="analytics">Analytics</button>
        <button class="mission-btn" data-team-filter="tech">Technology</button>
        <button class="mission-btn" data-team-filter="governance">Governance</button>
      </div>
      <div class="xp-grid" id="team-grid"></div>
    `
  };

  function activeRoute() {
    const params = new URLSearchParams(window.location.search);
    const queryRoute = params.get('view');
    return templates[queryRoute] ? queryRoute : defaults.route;
  }

  function setActiveButtons(route) {
    routeButtons.forEach((b) => b.classList.toggle('active', b.dataset.route === route));
  }

  function navigate(route, push) {
    if (!templates[route]) route = defaults.route;

    content.innerHTML = templates[route]();
    setActiveButtons(route);

    if (push) {
      const next = new URL(window.location.href);
      if (route === defaults.route) next.searchParams.delete('view');
      else next.searchParams.set('view', route);
      history.pushState({ route }, '', next);
    }

    content.querySelectorAll('[data-open-route]').forEach((button) => {
      button.addEventListener('click', () => navigate(button.dataset.openRoute, true));
    });

    if (route === 'operis') initOperis();
    if (route === 'astra') initAstra();
    if (route === 'scs') initSCS();
  }

  function initOperis() {
    const open = content.querySelector('#open-operis-dashboard');
    const overlay = content.querySelector('#operis-overlay');
    const close = content.querySelector('#close-operis-dashboard');
    if (!open || !overlay || !close) return;

    const norm = content.querySelector('#norm-target');
    const shift = content.querySelector('#shift-pressure');
    const support = content.querySelector('#support');
    const normLabel = content.querySelector('#norm-target-value');
    const shiftLabel = content.querySelector('#shift-pressure-value');
    const supportLabel = content.querySelector('#support-value');

    const barChart = content.querySelector('#operis-bar-chart');
    const lineChart = content.querySelector('#operis-line-chart');
    const pie = content.querySelector('#operis-pie-chart');
    const legend = content.querySelector('#pie-legend');
    const stationGrid = content.querySelector('#station-grid');
    const tableBody = content.querySelector('#picker-table-body');
    const targetStatus = content.querySelector('#day-target-status');
    const targetActions = content.querySelector('#day-target-actions');
    const flowInspector = content.querySelector('#flow-inspector');
    const scadaNodes = Array.from(content.querySelectorAll('.flow-node'));

    let pulseTimer = null;

    function draw() {
      const normTarget = Number(norm.value);
      const shiftPressure = Number(shift.value);
      const supportBoost = Number(support.value);

      normLabel.textContent = String(normTarget);
      shiftLabel.textContent = String(shiftPressure);
      supportLabel.textContent = String(supportBoost);

      barChart.innerHTML = '';
      tableBody.innerHTML = '';
      stationGrid.innerHTML = '';

      const values = pickerData.map((picker) => {
        const adjusted = Math.max(68, Math.round(picker.base * (shiftPressure / 100) + supportBoost * 1.8 - 7));
        const below = adjusted < normTarget;

        const row = document.createElement('div');
        row.className = `bar-row ${below ? 'below' : 'ok'}`;
        row.innerHTML = `<span>${picker.name}</span><div class="bar"><i style="width:${Math.min(adjusted, 175) / 1.75}%"></i></div><strong>${adjusted} UPH</strong>`;
        barChart.appendChild(row);

        const tr = document.createElement('tr');
        const gap = adjusted - normTarget;
        if (below) tr.classList.add('below');
        tr.innerHTML = `<td>${picker.name}</td><td>${picker.role}</td><td>${adjusted}</td><td>${gap >= 0 ? '+' : ''}${gap}</td><td>${below ? 'Below norm' : 'On target'}</td>`;
        tableBody.appendChild(tr);

        return adjusted;
      });

      drawLine(lineChart, values);
      drawPie(pie, legend, values);
      drawStations(stationGrid, values, normTarget);
      drawTarget(targetStatus, targetActions, values, normTarget);
      colorScada(scadaNodes, values, normTarget);
    }

    [norm, shift, support].forEach((el) => el.addEventListener('input', draw));

    scadaNodes.forEach((node) => {
      node.addEventListener('mouseenter', () => {
        flowInspector.textContent = `${node.dataset.flow}: throughput and handling pressure actively monitored.`;
      });
    });

    open.addEventListener('click', () => {
      overlay.classList.add('active');
      pulseTimer = setInterval(() => {
        scadaNodes.forEach((node) => node.classList.toggle('pulse'));
      }, 1300);
    });

    function closeOverlay() {
      overlay.classList.remove('active');
      if (pulseTimer) {
        clearInterval(pulseTimer);
        pulseTimer = null;
      }
    }

    close.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });

    initChatbot();
    draw();
  }

  function drawLine(svg, values) {
    const labels = [6, 8, 10, 12, 14, 16, 18, 20];
    const points = values.map((value, idx) => {
      const x = 24 + idx * 44;
      const y = 145 - (value - 70) * 0.82;
      return `${x},${Math.max(18, Math.min(148, y))}`;
    });

    svg.innerHTML = `<rect x="0" y="0" width="360" height="170" fill="rgba(255,255,255,.02)"></rect>
      <polyline points="${points.join(' ')}" fill="none" stroke="#8fc0ff" stroke-width="3"></polyline>
      ${points.map((p) => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="4" fill="#e8c89a"></circle>`).join('')}
      ${labels.map((h, i) => `<text x="${24 + i * 44}" y="164" fill="#d8cbb9" font-size="10">${h}:00</text>`).join('')}`;
  }

  function drawPie(node, legend, values) {
    const total = values.length || 1;
    const high = values.filter((v) => v >= 130).length;
    const mid = values.filter((v) => v >= 110 && v < 130).length;
    const low = total - high - mid;

    const a = Math.round((high / total) * 100);
    const b = Math.round((mid / total) * 100);
    const c = Math.max(0, 100 - a - b);

    node.style.background = `conic-gradient(#77d49c 0 ${a}%, #d8b46a ${a}% ${a + b}%, #d47a7a ${a + b}% 100%)`;
    legend.innerHTML = `<li><span class="dot green"></span>Above target ${a}%</li><li><span class="dot amber"></span>At risk ${b}%</li><li><span class="dot red"></span>Below target ${c}%</li>`;
    if (low < 0) legend.innerHTML += '';
  }

  function drawStations(node, values, normTarget) {
    const components = ['Pick to Light', 'Decanting', 'Replenishment Truck', 'Loading'];
    components.forEach((component, i) => {
      const value = values[i * 2] || values[0];
      const status = value >= normTarget + 8 ? 'green' : value >= normTarget ? 'amber' : 'red';
      const station = document.createElement('button');
      station.className = `station ${status}`;
      station.innerHTML = `<strong>${component}</strong><small>${value} UPH equivalent</small>`;
      station.addEventListener('mouseenter', () => {
        station.title = `${component}: ${status.toUpperCase()} performance state`;
      });
      node.appendChild(station);
    });
  }

  function drawTarget(statusNode, actionsNode, values, normTarget) {
    const avg = values.reduce((sum, n) => sum + n, 0) / values.length;
    const gap = Math.round(avg - normTarget);

    if (gap >= 0) {
      statusNode.textContent = `Day target status: achieved (+${gap} UPH)`;
      actionsNode.textContent = 'Recommended action: maintain replenishment rhythm and keep current staffing matrix stable.';
    } else {
      statusNode.textContent = `Day target status: off-track (${gap} UPH)`;
      actionsNode.textContent = 'Recommended action: swap low-performing loading operator with replenishment specialist, add 2 interventions and move one decanting expert to Pick-to-Light wave 3.';
    }
  }

  function colorScada(nodes, values, normTarget) {
    const avg = values.reduce((sum, n) => sum + n, 0) / values.length;
    nodes.forEach((node, idx) => {
      const local = values[idx % values.length];
      node.classList.remove('ok', 'warn', 'bad');
      if (local >= normTarget + 5 && avg >= normTarget) node.classList.add('ok');
      else if (local >= normTarget - 4) node.classList.add('warn');
      else node.classList.add('bad');
    });
  }

  function initChatbot() {
    const input = content.querySelector('#chat-input');
    const send = content.querySelector('#chat-send');
    const log = content.querySelector('#chat-log');
    if (!input || !send || !log) return;

    const reply = () => {
      const question = input.value.trim();
      if (!question) return;

      log.insertAdjacentHTML('beforeend', `<div class="msg user">${question}</div>`);
      log.insertAdjacentHTML('beforeend', '<div class="msg bot">Recommendation: move D. Bakker from Loading to Decanting, move G. Peters from Replenishment to Loading, and assign B. Janssen to Pick-to-Light wave 3. Estimated efficiency gain: +11% throughput and +7% norm attainment this shift.</div>');
      input.value = '';
      log.scrollTop = log.scrollHeight;
    };

    send.addEventListener('click', reply);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') reply(); });
  }

  function initAstra() {
    const missionButtons = content.querySelectorAll('.mission-btn[data-mission]');
    const speedButtons = content.querySelectorAll('.mission-btn[data-speed]');
    const start = content.querySelector('#start-mission');
    const drone = content.querySelector('#drone');
    const sim = content.querySelector('#warehouse-sim');
    const racks = Array.from(content.querySelectorAll('.rack'));

    const log = content.querySelector('#mission-log');
    const report = content.querySelector('#mission-report-list');
    const toast = content.querySelector('#vision-toast');
    const sendTask = content.querySelector('#send-cycle-task');

    const loc = content.querySelector('#loc-scanned');
    const sku = content.querySelector('#sku-counted');
    const boxes = content.querySelector('#boxes-counted');
    const acc = content.querySelector('#inv-accuracy');

    let mission = 'A';
    let speed = 320;
    let mismatchRack = null;

    function setActive(btns, active) {
      btns.forEach((b) => b.classList.toggle('active', b === active));
    }

    missionButtons.forEach((b) => b.addEventListener('click', () => {
      mission = b.dataset.mission;
      setActive(missionButtons, b);
    }));

    speedButtons.forEach((b) => b.addEventListener('click', () => {
      speed = b.dataset.speed === 'high' ? 180 : 320;
      setActive(speedButtons, b);
    }));

    function targetRacks() {
      if (mission === 'A') return racks.slice(0, 8);
      if (mission === 'B') return racks.slice(8, 16);
      if (mission === 'C') return racks.slice(16);
      return racks;
    }

    start.addEventListener('click', async () => {
      const targets = targetRacks();
      mismatchRack = null;
      report.innerHTML = '';
      racks.forEach((rack) => rack.classList.remove('scanned', 'mismatch'));
      loc.textContent = '0';
      sku.textContent = '0';
      boxes.textContent = '0';

      log.textContent = `Mission ${mission} launched. Drone takeoff and route planning active.`;
      let scanned = 0;

      for (const rack of targets) {
        const rackRect = rack.getBoundingClientRect();
        const simRect = sim.getBoundingClientRect();

        drone.style.left = `${rackRect.left - simRect.left + 16}px`;
        drone.style.top = `${rackRect.top - simRect.top + 8}px`;

        rack.classList.add('scanned');
        rack.querySelector('.scan-lines')?.classList.add('active');

        toast.classList.add('show');
        toast.textContent = `Drone vision @ ${rack.dataset.rack}: breakline segmentation and box-edge extraction active.`;

        scanned += 1;
        loc.textContent = String(scanned);
        sku.textContent = String(scanned * 42);
        boxes.textContent = String(scanned * 24);

        await new Promise((resolve) => setTimeout(resolve, speed));

        rack.querySelector('.scan-lines')?.classList.remove('active');
        toast.classList.remove('show');

        if (scanned % 6 === 0) {
          report.insertAdjacentHTML('beforeend', `<li>Checkpoint ${scanned}: validated counts uploaded for ${rack.dataset.rack}.</li>`);
        }
      }

      mismatchRack = targets[Math.max(0, Math.floor(targets.length * 0.62) - 1)]?.dataset.rack || 'R11';
      const mismatchNode = targets.find((r) => r.dataset.rack === mismatchRack);
      if (mismatchNode) mismatchNode.classList.add('mismatch');

      acc.textContent = `${(99.1 - (mission === 'ALL' ? 0.9 : 0.5)).toFixed(1)}%`;
      log.textContent = `Mission complete. Inventory mismatch detected at ${mismatchRack}.`;
      report.insertAdjacentHTML('beforeend', `<li>Final finding: ${mismatchRack} counted box quantity deviates from WMS snapshot.</li>`);
    });

    sendTask.addEventListener('click', () => {
      if (!mismatchRack) {
        report.insertAdjacentHTML('beforeend', '<li>No mismatch selected yet. Run a mission first.</li>');
      } else {
        report.insertAdjacentHTML('beforeend', `<li>Cycle count task sent for ${mismatchRack}. Supervisor queue updated.</li>`);
      }
    });
  }

  function initSCS() {
    const grid = content.querySelector('#team-grid');
    const filters = content.querySelectorAll('[data-team-filter]');
    if (!grid || !filters.length) return;

    const renderTeam = (filter) => {
      grid.innerHTML = '';
      teamData
        .filter((member) => filter === 'all' || member.d === filter)
        .forEach((member) => {
          const card = document.createElement('article');
          card.className = 'xp-card';
          card.innerHTML = `<h4>${member.name}</h4><p>${member.text}</p><small>${member.d.toUpperCase()}</small>`;
          grid.appendChild(card);
        });
    };

    filters.forEach((btn) => btn.addEventListener('click', () => {
      filters.forEach((f) => f.classList.toggle('active', f === btn));
      renderTeam(btn.dataset.teamFilter);
    }));

    renderTeam('all');
  }

  routeButtons.forEach((button) => {
    button.addEventListener('click', () => navigate(button.dataset.route, true));
  });

  window.addEventListener('popstate', () => navigate(activeRoute(), false));
  navigate(activeRoute(), false);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      root.classList.toggle('in-view', entry.isIntersecting);
      document.body.classList.toggle('experience-active', entry.isIntersecting);
    });
  }, { threshold: 0.25 });

  observer.observe(root);
})();
