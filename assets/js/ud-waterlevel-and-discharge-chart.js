// ud-waterlevel-and-discharge-chart.js (mit Canvas-Reuse-Fix)
window.udInitMetricChart = function initChart(canvas, {
  url,
  hasWL = false,
  hasDI = false,
  active = "waterLevel",
  labelByMetric = { waterLevel: "Wasserstand", discharge: "Abfluss" },
  units = { waterLevel: "m", discharge: "m³/s" },
  daysOverride = null,
}) {
  if (!canvas || !window.Chart) return null;

  // Verhindere doppelte Initialisierung
  if (canvas.udChartInstance) {
    canvas.udChartInstance.destroy();
    canvas.udChartInstance = null;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // --- Formatter ---
  const fmtTick = new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" });
  const fmtTooltip = new Intl.DateTimeFormat("de-CH", {
    weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
  });
  const numFmt = new Intl.NumberFormat("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 1 });

  const MS_PER_DAY = 86400000;

  const getLatestTimestamp = (rows) => {
    return Math.max(...rows.map((r) => new Date(r.time).getTime()).filter(Number.isFinite));
  };

  const pickDaysWithData = (rows, field) => {
    const cutoffTs = getLatestTimestamp(rows);
    const days = daysOverride ?? (window.innerWidth <= 500 ? 3 : window.innerWidth <= 900 ? 7 : 14);
    const cutoff = cutoffTs - days * MS_PER_DAY;
    return rows
      .map((r) => ({ x: new Date(r.time), y: r[field] }))
      .filter((p) => p.x && p.y != null && p.x.getTime() >= cutoff);
  };

  let rows = [];

  const buildConfig = (metric) => ({
    type: "line",
    data: {
      datasets: [{
        label: labelByMetric[metric],
        data: pickDaysWithData(rows, metric),
        tension: 0.2,
        borderWidth: 3,
        borderColor: getComputedStyle(canvas).getPropertyValue("--ud-chart-line")?.trim() || "#0e5258",
        pointRadius: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
  displayColors: false, // ⬅️ Deaktiviert das Farbkästchen

          callbacks: {
            title: (items) => items[0]?.parsed?.x ? fmtTooltip.format(new Date(items[0].parsed.x)) + " Uhr" : "",
 label: (ctx) => {
      const v = ctx.parsed.y;
      const txt = Number.isFinite(v) ? numFmt.format(v) : v;
      return `${labelByMetric[active]}: ${txt} ${units[active]}`;
    },          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: { unit: "day" },
          ticks: {
            source: "auto",
            autoSkip: true,
            maxRotation: 0,
            color: getComputedStyle(canvas).getPropertyValue("--ud-chart-text")?.trim() || "#8ea06a",
            callback: (val) => fmtTick.format(new Date(val)),
          },
          grid: {
            color: getComputedStyle(canvas).getPropertyValue("--ud-chart-grid")?.trim() || "#b7bf8a",
          },
        },
        y: {
          ticks: {
            color: getComputedStyle(canvas).getPropertyValue("--ud-chart-text")?.trim() || "#8ea06a",
            callback: (val) => `${numFmt.format(val)} ${units[metric]}`,
          },
          grid: {
            color: getComputedStyle(canvas).getPropertyValue("--ud-chart-grid")?.trim() || "#b7bf8a",
          },
        },
      },
    },
  });

  let chart;

  const updateChart = () => {
    chart.data.datasets[0].data = pickDaysWithData(rows, active);
    chart.data.datasets[0].label = labelByMetric[active];
    chart.options.scales.y.ticks.callback = (val) => `${numFmt.format(val)} ${units[active]}`;
chart.options.plugins.tooltip.callbacks.label = (ctx) => {
  const v = ctx.parsed.y;
  const txt = Number.isFinite(v) ? numFmt.format(v) : v;
  return `${labelByMetric[active]}: ${txt} ${units[active]}`;
};
    chart.update();
  };

  const bindToggleUI = () => {
    const header = canvas.closest(".ud-messstation-metric")?.querySelector(".ud-metric-header");
    const checkbox = header?.querySelector(".ud-metric-toggle");
    const labelWL = header?.querySelector(".ud-metric-label.wl");
    const labelDI = header?.querySelector(".ud-metric-label.di");

    const syncLabels = () => {
      labelWL?.classList.toggle("is-active", active === "waterLevel");
      labelDI?.classList.toggle("is-active", active === "discharge");
    };
    syncLabels();

    checkbox?.addEventListener("change", () => {
      active = checkbox.checked ? "discharge" : "waterLevel";
      updateChart();
      syncLabels();
    });

    labelWL?.addEventListener("click", () => {
      if (hasWL) {
        active = "waterLevel";
        if (checkbox) checkbox.checked = false;
        updateChart();
        syncLabels();
      }
    });

    labelDI?.addEventListener("click", () => {
      if (hasDI) {
        active = "discharge";
        if (checkbox) checkbox.checked = true;
        updateChart();
        syncLabels();
      }
    });

    window.addEventListener("resize", () => {
      chart.data.datasets[0].data = pickDaysWithData(rows, active);
      chart.update();
    });
  };

  fetch(url)
    .then((r) => r.json())
    .then((json) => {
      if (!Array.isArray(json)) return;
      rows = json;
      chart = new Chart(ctx, buildConfig(active));
      canvas.udChartInstance = chart; // Chart-Instanz merken
      bindToggleUI();
    });

  return chart;
};

// Auto-Init für Frontend
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.ud-metric-canvas[data-role="metric"]').forEach((canvas) => {
    if (!canvas.udChartInstance) {
      window.udInitMetricChart(canvas, {
        url: canvas.dataset.url,
        hasWL: canvas.dataset.hasWl === "1",
        hasDI: canvas.dataset.hasDi === "1",
        active: canvas.dataset.active || "waterLevel",
      });
    }
  });
});