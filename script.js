let period = "yoy";

const datasets = {
  rawMaterials: [
    ["Copper", "$9,840/t", 11.2, 2.1],
    ["Aluminum", "$2,520/t", 7.8, 1.4],
    ["Steel HRC", "$720/t", -4.2, -0.8],
    ["Gold", "$2,390/oz", 18.5, 3.2],
    ["Lithium", "$13,900/t", -28.0, -5.7],
    ["Nickel", "$18,200/t", 5.4, 1.9],
    ["Cobalt", "$27,600/t", -9.6, -2.0]
  ],
  freight: [
    ["China–US West Coast", "$3,920/FEU", 48.0, 7.4],
    ["China–US East Coast", "$5,120/FEU", 36.5, 5.2],
    ["China–N. Europe", "$4,480/FEU", 29.1, 3.9],
    ["China–Med", "$4,720/FEU", 31.2, 4.1],
    ["Intra-Asia", "$840/FEU", 8.4, 1.1]
  ],
  semis: [
    ["DDR4 DRAM", "$1.78/unit", 22.0, 4.6],
    ["DDR5 DRAM", "$4.92/unit", 31.5, 6.2],
    ["HBM3", "$95.00/unit", 58.0, 9.8],
    ["NAND TLC", "$3.40/unit", 14.1, 2.3],
    ["300mm wafer", "$1,180", 7.0, 1.2]
  ],
  laborRates: [
    ["China Coastal", "$6.80/hr", 6.2, 0.8],
    ["China Inland", "$4.90/hr", 5.1, 0.6],
    ["Vietnam", "$3.10/hr", 8.9, 1.5],
    ["Thailand", "$3.80/hr", 6.7, 0.9],
    ["Malaysia", "$4.60/hr", 7.4, 1.0],
    ["India", "$2.90/hr", 9.8, 1.7]
  ],
  capex: [
    ["Amazon", "$75B FY2024", 42.0, 8.0],
    ["Microsoft", "$56B FY2024", 55.0, 10.1],
    ["Google", "$52B FY2024", 48.0, 7.8],
    ["Meta", "$39B FY2024", 37.0, 6.4]
  ],
  power: [
    ["Global DC Demand", "460 TWh", 18.0, 3.2],
    ["US", "176 TWh", 21.0, 3.8],
    ["China", "145 TWh", 17.5, 3.1],
    ["EU", "98 TWh", 12.0, 2.0],
    ["APAC ex-China", "112 TWh", 19.4, 3.3]
  ]
};

const policyTables = {
  tariffs: {
    headers: ["Category", "HTS Code", "Action", "Effective Date", "Supply Chain Impact"],
    rows: [
      ["Semiconductors", "8542", "Section 301 tariff exposure", "Jan 2025", "Potential landed-cost pressure"],
      ["Lithium Batteries", "8507", "Elevated import duties", "Jan 2025", "Battery and backup-power cost risk"],
      ["Steel / Aluminum", "72 / 76", "Section 232 exposure", "Active", "Mechanical and enclosure cost volatility"],
      ["Electronics Assemblies", "8517", "China-origin tariff exposure", "Active", "Networking equipment BOM exposure"]
    ]
  },
  exportControls: {
    headers: ["Item", "Authority", "Restriction Type", "Affected Lanes"],
    rows: [
      ["Gallium / Germanium", "MOFCOM", "Export licensing", "China → Global"],
      ["Advanced AI Accelerators", "BIS", "Export controls", "US / Global → China"],
      ["EUV Lithography", "EU / National controls", "Licensing restriction", "EU → China"],
      ["Graphite", "MOFCOM", "Export permit", "China → Battery supply chain"]
    ]
  },
  techRadar: {
    headers: ["Technology", "TRL", "CAGR", "2030 Market Signal"],
    rows: [
      ["Silicon Photonics", "7", "24%", "High"],
      ["Glass Substrates", "5", "31%", "Emerging"],
      ["Co-Packaged Optics", "6", "28%", "High"],
      ["GaN Power", "8", "19%", "Scaling"],
      ["SiC Power", "8", "22%", "Scaling"],
      ["Cryogenic Cooling", "4", "18%", "Watch"]
    ]
  }
};

function renderMetricList(id) {
  const data = datasets[id];
  const el = document.getElementById(id);
  el.innerHTML = data.map(row => {
    const change = period === "yoy" ? row[2] : row[3];
    const cls = change > 0 ? "up" : change < 0 ? "down" : "neutral";
    const arrow = change > 0 ? "▲" : change < 0 ? "▼" : "■";
    return `
      <div class="metric-row">
        <div class="metric-name">${row[0]}</div>
        <div class="metric-value">${row[1]}</div>
        <div class="pill ${cls}">${arrow} ${change}% ${period.toUpperCase()}</div>
      </div>
    `;
  }).join("");
}

function renderTable(id) {
  const table = policyTables[id];
  const el = document.getElementById(id);
  el.innerHTML = `
    <table>
      <thead>
        <tr>${table.headers.map(h => `<th>${h}</th>`).join("")}</tr>
      </thead>
      <tbody>
        ${table.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `;
}

function regeneratePCB() {
  const prompt = document.getElementById("pcbPrompt").value || "General PCB supply chain view";
  document.getElementById("pcb").innerHTML = `
    <div class="metric-row">
      <div class="metric-name">Glass Laminate</div>
      <div class="metric-value">Signal: Tightening</div>
      <div class="pill up">▲ AI</div>
    </div>
    <div class="metric-row">
      <div class="metric-name">Copper-Clad Laminate</div>
      <div class="metric-value">Prompt: ${prompt}</div>
      <div class="pill neutral">WATCH</div>
    </div>
    <div class="metric-row">
      <div class="metric-name">8-Layer Rigid PCB</div>
      <div class="metric-value">Cost pressure: Medium</div>
      <div class="pill up">▲</div>
    </div>
  `;
}

function downloadCSV(id) {
  const rows = datasets[id];
  const csv = ["Name,Value,YoY,MoM", ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${id}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
}

function setupTheme() {
  const saved = localStorage.getItem("helix-theme") || "dark";
  document.documentElement.dataset.theme = saved;

  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("helix-theme", next);
  });
}

function setupPeriod() {
  document.getElementById("periodToggle").addEventListener("click", () => {
    period = period === "yoy" ? "mom" : "yoy";
    document.getElementById("periodToggle").innerText = period.toUpperCase();
    renderAll();
  });
}

function setupBrief() {
  document.getElementById("briefBtn").addEventListener("click", () => {
    document.getElementById("briefModal").showModal();
  });
}

function setupCorrelation() {
  const series = [
    "Hyperscaler CapEx",
    "DDR5 DRAM Pricing",
    "HBM3 Pricing",
    "China–US West Coast Freight",
    "Copper",
    "Vietnam Labor Rate",
    "Data Center Power Demand"
  ];

  const a = document.getElementById("seriesA");
  const b = document.getElementById("seriesB");

  series.forEach(s => {
    a.innerHTML += `<option>${s}</option>`;
    b.innerHTML += `<option>${s}</option>`;
  });

  a.value = "Hyperscaler CapEx";
  b.value = "DDR5 DRAM Pricing";

  drawCorrelation();

  [a, b, document.getElementById("lookback")].forEach(el => {
    el.addEventListener("change", drawCorrelation);
  });
}

function drawCorrelation() {
  const canvas = document.getElementById("correlationChart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 160;

  ctx.clearRect(0, 0, width, height);

  const pointsA = [100, 104, 108, 116, 125, 138, 151];
  const pointsB = [100, 102, 107, 114, 128, 141, 158];

  drawLine(ctx, pointsA, width, height);
  drawLine(ctx, pointsB.map(v => v - 8), width, height);

  document.getElementById("correlationResult").innerText =
    "Pearson correlation: +0.91 · Strong positive relationship";
}

function drawLine(ctx, points, width, height) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / (max - min || 1)) * (height - 20) - 10;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineWidth = 3;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent");
  ctx.stroke();
}

function renderAll() {
  Object.keys(datasets).forEach(renderMetricList);
  Object.keys(policyTables).forEach(renderTable);
  regeneratePCB();
}

setupTabs();
setupTheme();
setupPeriod();
setupBrief();
setupCorrelation();
renderAll();
