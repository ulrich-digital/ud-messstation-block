
(function () {
  // Debounce-Helper
  const debounce = (fn, ms = 120) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  // SVG färben
  const colorize = (el) => {
    const svg = el.querySelector("svg");
    if (!svg) return;
    const paths = svg.querySelectorAll("path");
    if (paths.length >= 1) {
      paths[0].setAttribute("fill", "#B5BC85"); // Hintergrund
    }
    const pointer = paths[paths.length - 1];
    if (pointer) {
      pointer.setAttribute("fill", "#004C5B"); // Zeiger
    }
  };

  // Init-Funktion einzeln aufrufbar
  window.udInitDangerLevelGauge = (el) => {
    if (!window.JustGage || !el) return;

    const w = Math.floor(el.clientWidth || el.getBoundingClientRect().width);
    const size = Math.max(220, w);

    el.innerHTML = "";

    new window.JustGage({
      id: el.id,
      value: parseInt(el.dataset.value || "0", 10),
      min: parseInt(el.dataset.min || "0", 10),
      max: parseInt(el.dataset.max || "5", 10),
      pointer: true,
      relativeGaugeSize: true,
      gaugeWidthScale: 0.7,
      counter: false,
      label: "Gefahrenstufe",
      levelColors: ["#004C5B", "#004C5B", "#004C5B", "#004C5B", "#004C5B"],
      labelFontColor: "#004C5B",
      titleFontColor: "#004C5B",
      valueFontColor: "#004C5B",
      width: size,
      height: size,
    });

    setTimeout(() => colorize(el), 50);
  };

  // Automatisch alle .ud-dangerlevel-gauge beim Laden initialisieren
  document.addEventListener("DOMContentLoaded", () => {
    const els = document.querySelectorAll(".ud-dangerlevel-gauge");
    if (!els.length) return;

    const ro = new ResizeObserver(
      debounce((entries) => {
        entries.forEach((e) => window.udInitDangerLevelGauge(e.target));
      }, 120)
    );

    els.forEach((el) => {
      if (!el.id) {
        el.id = "dangerLevelChart_" + Math.random().toString(36).slice(2);
      }
      window.udInitDangerLevelGauge(el);
      ro.observe(el);
    });
  });
})();
