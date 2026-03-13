/**
 * Rendering functions for lists and charts
 */

// ==================== LIST RENDERING ====================

/**
 * Renders the audits list in the UI
 * @param {Array} audits - Array of audit objects
 */
function renderAuditsList(audits) {
  if (!auditsListEl) return;

  if (!audits || audits.length === 0) {
    auditsListEl.innerHTML = `<div class="muted">No audits found.</div>`;
    return;
  }

  auditsListEl.innerHTML = audits.slice(0, 30).map(a => {
    const gradeNum = typeof a.grade === "number" ? a.grade : null;
    const grade = gradeNum === null ? "—" : gradeNum.toFixed(2);

    const pass = gradeNum !== null && gradeNum >= 1;
    const statusText = pass ? "PASS" : "FAIL";
    const badgeClass = pass ? "badge pass" : "badge fail";

    const name = a.group?.object?.name || `Group #${a.groupId}`;
    const date = fmtDate(a.createdAt);

    return `
      <div class="audit-item">
        <div class="audit-top">
          <div class="audit-name">${escapeHTML(name)}</div>
          <div class="audit-date">${escapeHTML(date)}</div>
        </div>
        <div class="audit-meta">
          <span>Grade: <strong>${escapeHTML(grade)}</strong></span>
          <span class="${badgeClass}">${statusText}</span>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Renders transaction list in specified element
 * @param {HTMLElement} listEl - Element to render transactions in
 * @param {Array} transactions - Array of transaction objects
 * @param {number|null} limit - Maximum number of transactions to show
 */
function renderTx(listEl, transactions, limit = null) {
  if (!listEl) return;

  const items = limit ? (transactions || []).slice(0, limit) : (transactions || []);

  if (!items.length) {
    listEl.innerHTML = `<div class="muted">No transactions found.</div>`;
    return;
  }

  listEl.innerHTML = items.map(t => {
    const name = t.object?.name || t.path || "—";
    const type = t.object?.type || "xp";
    const amount = formatBytes(t.amount);

    return `
      <div class="tx-item">
        <div class="tx-name">${escapeHTML(name)}</div>
        <div class="tx-meta">
          <span>${escapeHTML(fmtDate(t.createdAt))}</span>
          <span class="muted">${escapeHTML(type)}</span>
          <strong>${escapeHTML(amount)}</strong>
        </div>
      </div>
    `;
  }).join("");
}

// ==================== CHART RENDERING ====================

/**
 * Draws XP progression line chart
 * @param {SVGElement} svgEl - SVG element to draw chart in
 * @param {Array} transactions - Array of transaction objects
 */
function drawXpLineChart(svgEl, transactions) {
  if (!svgEl) return;

  const w = 700, h = 220;
  const padL = 105, padR = 16, padT = 18, padB = 34;

  const items = (transactions || [])
    .filter(t => t.createdAt && typeof t.amount === "number")
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  if (items.length < 2) {
    svgEl.innerHTML = `<text x="20" y="40" fill="rgba(255,255,255,0.6)" font-size="14">Not enough XP data</text>`;
    return;
  }

  let cum = 0;
  const pts = items.map(t => {
    cum += t.amount;
    return { date: new Date(t.createdAt).getTime(), value: cum };
  });

  const minX = pts[0].date;
  const maxX = pts[pts.length - 1].date;
  const maxY = Math.max(...pts.map(p => p.value)) || 1;

  const xScale = x => padL + ((x - minX) / (maxX - minX || 1)) * (w - padL - padR);
  const yScale = y => padT + (1 - y / (maxY || 1)) * (h - padT - padB);

  const x0 = padL, y0 = h - padB, x1 = w - padR, y1 = padT;

  const d = pts.map((p, i) => {
    const x = xScale(p.date);
    const y = yScale(p.value);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  const ticks = 4;
  const tickEls = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = (maxY / ticks) * i;
    const y = yScale(v);
    return `
      <line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="rgba(255,255,255,0.08)"/>
      <text x="${x0 - 10}" y="${y}" text-anchor="end" font-size="10" fill="rgba(255,255,255,0.65)">
        ${escapeHTML(formatXP(v))}
      </text>
    `;
  }).join("");

  const startLabel = new Date(minX).toISOString().slice(0,10);
  const endLabel = new Date(maxX).toISOString().slice(0,10);

  svgEl.innerHTML = `
    <g>
      ${tickEls}
      <line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="rgba(255,255,255,0.18)"/>
      <line x1="${x0}" y1="${y1}" x2="${x0}" y2="${y0}" stroke="rgba(255,255,255,0.18)"/>
      <path d="${d}" fill="none" stroke="rgba(122,162,255,0.9)" stroke-width="2.5"/>
      <text x="${x0}" y="${h - 10}" font-size="11" fill="rgba(255,255,255,0.55)">${startLabel}</text>
      <text x="${x1}" y="${h - 10}" font-size="11" fill="rgba(255,255,255,0.55)" text-anchor="end">${endLabel}</text>
    </g>
  `;
}

/**
 * Draws horizontal bar chart showing XP by project
 * @param {SVGElement} svgEl - SVG element to draw chart in
 * @param {Array} transactions - Array of transaction objects
 */
function drawXpByProjectBars(svgEl, transactions) {
  if (!svgEl) return;

  const w = 700;
  const rowH = 28;
  const padL = 260; // space for names
  const padR = 90;  // space for amounts
  const padT = 18;
  const padB = 18;

  const items = (transactions || [])
    .filter(t => typeof t.amount === "number" && t.amount > 0)
    .map(t => ({
      name: t.object?.name || t.path || "—",
      amount: t.amount
    }));

  if (!items.length) {
    svgEl.innerHTML = `<text x="20" y="40" fill="rgba(255,255,255,0.6)" font-size="14">No project XP</text>`;
    return;
  }

  // group by project name
  const map = new Map();
  for (const it of items) map.set(it.name, (map.get(it.name) || 0) + it.amount);

  const grouped = [...map.entries()]
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  const h = padT + padB + grouped.length * rowH;
  svgEl.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const max = grouped[0]?.amount || 1;
  const xScale = v => padL + (v / max) * (w - padL - padR);

  const rows = grouped.map((g, i) => {
    const y = padT + i * rowH;
    const yMid = y + rowH / 2;

    const barX2 = xScale(g.amount);
    const barW = Math.max(2, barX2 - padL);

    const label = g.name.length > 34 ? g.name.slice(0, 34) + "…" : g.name;

    return `
      <text x="${padL - 10}" y="${yMid}" text-anchor="end" font-size="12"
        fill="rgba(255,255,255,0.85)">${escapeHTML(label)}</text>

      <rect x="${padL}" y="${y + 7}" width="${barW}" height="14" rx="6" ry="6"
        fill="rgba(122,162,255,0.85)"/>

      <text x="${w - 10}" y="${yMid}" text-anchor="end" font-size="12"
        fill="rgba(255,255,255,0.80)">${escapeHTML(formatXP(g.amount))}</text>
    `;
  }).join("");

  svgEl.innerHTML = `<g>${rows}</g>`;
}