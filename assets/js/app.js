/**
 * CropYield.ml - Interactive Machine Learning Project Showcase
 * Client-side Ridge inference, feature contribution waterfall, and evaluation benchmarks.
 */

// Model mathematical parameters trained in Ridge_Regression_Crop_Yieldd.ipynb
const MODEL = {
  intercept: 8.533832,
  alpha: 1.526418,
  metrics: {
    r2: 0.862736,
    rmse: 0.718245,
    mae: 0.579318,
    trainSamples: 2076,
    testSamples: 520,
    totalSamples: 2596
  },
  features: {
    fert: { name: "Fertilizer", unit: "kg/ha", mean: 66.487433, std: 9.747669, coef: -0.531745 },
    temp: { name: "Temperature", unit: "°C", mean: 33.848237, std: 5.371279, coef: -0.688737 },
    n:    { name: "Nitrogen (N)", unit: "mg/kg", mean: 69.522900, std: 6.802806, coef: 0.828513 },
    p:    { name: "Phosphorus (P)", unit: "mg/kg", mean: 20.708194, std: 1.973419, coef: 0.421919 },
    k:    { name: "Potassium (K)", unit: "mg/kg", mean: 17.806268, std: 1.940037, coef: 0.504554 }
  },
  presets: {
    optimal: { fert: 75.0, temp: 26.0, n: 80.0, p: 24.5, k: 21.0 },
    heat:    { fert: 68.0, temp: 39.5, n: 61.0, p: 18.0, k: 15.0 },
    excess:  { fert: 80.0, temp: 34.0, n: 62.0, p: 18.5, k: 16.0 },
    mean:    { fert: 66.5, temp: 33.8, n: 69.5, p: 20.7, k: 17.8 }
  }
};

let chartInstances = {};

document.addEventListener("DOMContentLoaded", async () => {
  setupTheme();
  setupSliders();
  setupPresets();
  setupLightbox();

  // Load sample dataset
  try {
    const res = await fetch("assets/data.json");
    if (res.ok) {
      const data = await res.json();
      renderSampleTable(data.sample_records || []);
    }
  } catch (err) {
    console.warn("Notice: data.json fetch error, using default sample display", err);
  }

  // Render Charts
  initBenchmarkCharts();

  // Initial calculation
  computePrediction();
});

/* ==========================================================================
   1. Interactive Predictor & Agronomic Engine
   ========================================================================== */
function setupSliders() {
  const inputs = ["fert", "temp", "n", "p", "k"];
  inputs.forEach(id => {
    const slider = document.getElementById(`in-${id}`);
    const display = document.getElementById(`val-${id}`);
    if (slider && display) {
      slider.addEventListener("input", (e) => {
        display.textContent = Number(e.target.value).toFixed(1);
        // Clear active preset button state when manually moved
        document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
        computePrediction();
      });
    }
  });
}

function setupPresets() {
  const buttons = document.querySelectorAll(".btn-preset");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const presetKey = btn.getAttribute("data-preset");
      const values = MODEL.presets[presetKey];
      if (!values) return;

      setSlider("fert", values.fert);
      setSlider("temp", values.temp);
      setSlider("n", values.n);
      setSlider("p", values.p);
      setSlider("k", values.k);

      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      computePrediction();
    });
  });
}

function setSlider(id, val) {
  const slider = document.getElementById(`in-${id}`);
  const display = document.getElementById(`val-${id}`);
  if (slider && display) {
    slider.value = val;
    display.textContent = Number(val).toFixed(1);
  }
}

function computePrediction() {
  const fert = parseFloat(document.getElementById("in-fert")?.value || 66.5);
  const temp = parseFloat(document.getElementById("in-temp")?.value || 33.8);
  const n    = parseFloat(document.getElementById("in-n")?.value || 69.5);
  const p    = parseFloat(document.getElementById("in-p")?.value || 20.7);
  const k    = parseFloat(document.getElementById("in-k")?.value || 17.8);

  const f = MODEL.features;
  const z_fert = (fert - f.fert.mean) / f.fert.std;
  const z_temp = (temp - f.temp.mean) / f.temp.std;
  const z_n    = (n - f.n.mean) / f.n.std;
  const z_p    = (p - f.p.mean) / f.p.std;
  const z_k    = (k - f.k.mean) / f.k.std;

  const c_fert = z_fert * f.fert.coef;
  const c_temp = z_temp * f.temp.coef;
  const c_n    = z_n * f.n.coef;
  const c_p    = z_p * f.p.coef;
  const c_k    = z_k * f.k.coef;

  const totalYield = MODEL.intercept + c_fert + c_temp + c_n + c_p + c_k;
  const finalYield = Math.max(0, totalYield);

  // Update Main Number
  const outVal = document.getElementById("out-yield-val");
  if (outVal) {
    outVal.textContent = finalYield.toFixed(2);
  }

  // Update Status Pill
  const statusPill = document.getElementById("yield-status");
  if (statusPill) {
    if (finalYield >= 10.0) {
      statusPill.className = "yield-status-tag tag-optimal";
      statusPill.textContent = "High Productivity Yield";
    } else if (finalYield >= 7.5) {
      statusPill.className = "yield-status-tag tag-average";
      statusPill.textContent = "Average Regional Yield";
    } else {
      statusPill.className = "yield-status-tag tag-low";
      statusPill.textContent = "Sub-Optimal / Stressed Yield";
    }
  }

  // Update Feature Contributions in UI
  setContributionItem("c-n", c_n);
  setContributionItem("c-k", c_k);
  setContributionItem("c-p", c_p);
  setContributionItem("c-fert", c_fert);
  setContributionItem("c-temp", c_temp);

  // Practical Advisory
  const advText = document.getElementById("advisory-content");
  if (advText) {
    let notes = [];
    if (n >= 76) {
      notes.push("High soil nitrogen is providing substantial yield gains (+ vegetative biomass).");
    } else if (n < 65) {
      notes.push("Nitrogen deficiency is acting as the primary constraint on harvest volume.");
    }

    if (temp >= 36) {
      notes.push("Ambient temperature above 36°C creates significant thermal heat stress.");
    } else if (temp <= 28) {
      notes.push("Moderate temperature maintains minimal evapotranspiration loss.");
    }

    if (fert > 74 && (n < 68 || p < 19)) {
      notes.push("Gross fertilizer application is high relative to available active NPK, showing diminishing returns.");
    }

    if (notes.length === 0) {
      notes.push("Soil nutrient balances and climate conditions are close to baseline test means.");
    }

    advText.textContent = notes.join(" ");
  }
}

function setContributionItem(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  const sign = val >= 0 ? "+" : "";
  el.textContent = `${sign}${val.toFixed(2)} t/ha`;
  el.className = `contrib-val ${val >= 0 ? "pos" : "neg"}`;
}

/* ==========================================================================
   2. Clean Benchmark & Coefficient Visualizations (Chart.js)
   ========================================================================== */
function initBenchmarkCharts() {
  if (typeof Chart === "undefined") return;

  const isDark = document.documentElement.getAttribute("data-theme") !== "light";
  const textColor = isDark ? "#8b949e" : "#656d76";
  const gridColor = isDark ? "rgba(48, 54, 61, 0.6)" : "rgba(208, 215, 222, 0.6)";

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;
  Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // 1. Model Comparative Evaluation Chart
  const elModel = document.getElementById("chart-benchmark");
  if (elModel) {
    chartInstances.model = new Chart(elModel, {
      type: "bar",
      data: {
        labels: ["Ridge (L2) ★", "Lasso (L1)", "ElasticNet", "Linear (OLS)"],
        datasets: [
          {
            label: "Test R² (Higher is better)",
            data: [0.8627, 0.8637, 0.8636, 0.8626],
            backgroundColor: ["#2ea043", "#388bfd", "#8957e5", "#8b949e"],
            borderRadius: 4
          },
          {
            label: "Test RMSE (Lower is better)",
            data: [0.7182, 0.7157, 0.7159, 0.7185],
            backgroundColor: isDark ? "rgba(248, 81, 73, 0.35)" : "rgba(207, 34, 46, 0.25)",
            borderColor: "#da3633",
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { boxWidth: 12 } }
        },
        scales: {
          y: { min: 0.5, max: 1.0, grid: { color: gridColor } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Feature Coefficients Comparison Chart
  const elCoef = document.getElementById("chart-coefficients");
  if (elCoef) {
    chartInstances.coef = new Chart(elCoef, {
      type: "bar",
      data: {
        labels: ["Nitrogen (N)", "Potassium (K)", "Phosphorus (P)", "Fertilizer", "Temperature"],
        datasets: [
          {
            label: "Ridge Regression Weights",
            data: [0.8285, 0.5046, 0.4219, -0.5317, -0.6887],
            backgroundColor: [
              "#2ea043",
              "#2ea043",
              "#2ea043",
              "#da3633",
              "#da3633"
            ],
            borderRadius: 4
          },
          {
            label: "Linear (OLS) Weights",
            data: [0.8329, 0.5038, 0.4229, -0.5379, -0.6908],
            backgroundColor: isDark ? "rgba(56, 139, 253, 0.4)" : "rgba(9, 105, 218, 0.3)",
            borderColor: "#388bfd",
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { boxWidth: 12 } }
        },
        scales: {
          y: {
            title: { display: true, text: "Standardized Coefficient (β)" },
            grid: { color: gridColor }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }
}



/* ==========================================================================
   4. Lightbox Modal for Figures
   ========================================================================== */
function setupLightbox() {
  const modal = document.getElementById("figure-modal");
  const modalImg = document.getElementById("modal-figure-img");
  const modalTitle = document.getElementById("modal-figure-title");
  const modalDesc = document.getElementById("modal-figure-desc");
  const closeBtn = document.getElementById("btn-close-modal");

  const cards = document.querySelectorAll(".figure-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      const title = card.querySelector(".figure-name")?.textContent || "Figure";
      const desc = card.querySelector(".figure-caption")?.textContent || "";

      if (img && modal && modalImg) {
        modalImg.src = img.src;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        modal.classList.add("active");
      }
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }
}

/* ==========================================================================
   5. Sample Table Rendering
   ========================================================================== */
function renderSampleTable(records) {
  const tbody = document.getElementById("sample-tbody");
  if (!tbody || !records || records.length === 0) return;

  tbody.innerHTML = records.map(r => `
    <tr>
      <td class="mono" style="font-weight: 600;">${r.id}</td>
      <td class="mono">${r.fertilizer.toFixed(1)}</td>
      <td class="mono">${r.temperature.toFixed(1)}°C</td>
      <td class="mono">${r.nitrogen.toFixed(1)}</td>
      <td class="mono">${r.phosphorus.toFixed(1)}</td>
      <td class="mono">${r.potassium.toFixed(1)}</td>
      <td class="mono" style="font-weight: 600;">${r.actual_yield.toFixed(2)}</td>
      <td class="mono" style="color: var(--accent-green-text); font-weight: 600;">${r.predicted_yield.toFixed(2)}</td>
      <td class="mono" style="color: ${r.residual >= 0 ? 'var(--accent-green-text)' : 'var(--accent-red-text)'};">
        ${r.residual >= 0 ? '+' : ''}${r.residual.toFixed(2)}
      </td>
    </tr>
  `).join("");
}

/* ==========================================================================
   6. Theme Toggle Handler
   ========================================================================== */
function setupTheme() {
  const toggleBtn = document.getElementById("btn-theme");
  const current = localStorage.getItem("cropyield_theme") || "dark";
  document.documentElement.setAttribute("data-theme", current);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const active = document.documentElement.getAttribute("data-theme") || "dark";
      const next = active === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("cropyield_theme", next);

      // Re-render chart colors
      initBenchmarkCharts();
    });
  }
}
