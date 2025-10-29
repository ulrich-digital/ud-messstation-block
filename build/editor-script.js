/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./block.json":
/*!********************!*\
  !*** ./block.json ***!
  \********************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"apiVersion":2,"name":"ud/messstation-block","title":"Messstation Block","category":"widgets","icon":"chart-line","description":"Zeigt Messwerte (z. B. Temperatur, Wasserstand, Gefahrenstufe) einer ausgewählten Messstation an.","editorScript":"file:./build/editor-script.js","viewScript":"file:./build/frontend-script.js","style":"file:./build/frontend-style.css","editorStyle":"file:./build/editor-style.css","attributes":{"dataUrl":{"type":"string","default":""},"visibleKeys":{"type":"array","items":{"type":"string"},"default":["waterTemperature","dangerLevel","waterLevel","discharge"]},"showStation":{"type":"boolean","default":true},"tempHeading":{"type":"string","default":"Wassertemperatur"},"messstationHeading":{"type":"string","default":"Messstation"},"levelHeading":{"type":"string","default":"Wasserstand"},"dischargeHeading":{"type":"string","default":"Abfluss"},"dangerHeading":{"type":"string","default":"Gefahrenstufe"},"dangerGeneralHint":{"type":"string","default":"Beachten Sie zusätzlich zur Gefahrenstufe die künstlichen Abflussschwankungen (Schwall und Sunk), welche durch den flexiblen Betrieb der Wasserkraftwerke in der Muota entstehen."},"dangerLevels":{"type":"array","default":[{"desc":"keine oder geringe Gefahr","behav":"Der Aufenthalt im Bereich von Gewässern ist <strong>unproblematisch</strong>. Wachsamkeit ist jedoch stets erforderlich.","effects":"Verkehrsbehinderungen und Schäden sind normalerweise nicht zu erwarten."},{"desc":"mässige Gefahr","behav":"Der Aufenthalt im Bereich von Fliessgewässern <strong>kann gefährlich sein</strong>. Halten Sie vorsichtshalber genügend Abstand.","effects":"Bei dieser Wasserführung sind lokale Ausuferungen (das Wasser verlässt das Bachbett) und Überflutungen unwahrscheinlich, aber nicht auszuschliessen. In Ausnahmefällen sind lokal Überflutungen von Strassenunterführungen, Tiefgaragen und Kellerräumen möglich. Lokale Behinderungen an exponierten Verkehrswegen sowie lokale Schäden in kleinerem Umfang sind unwahrscheinlich aber nicht auszuschliessen."},{"desc":"erhebliche Gefahr","behav":"Der Aufenthalt im Bereich von Fliessgewässern ist <strong>gefährlich</strong>. Halten Sie sich fern.","effects":"Bei dieser Wasserführung können an exponierten Stellen lokale Ausuferungen (das Wasser verlässt das Bachbett) und Überflutungen auftreten. Lokal sind Überflutungen von Strassenunterführungen, Tiefgaragen und Kellerräumen möglich. An exponierten Verkehrswegen sind lokale Behinderungen möglich und es muss mit lokalen Schäden in kleinerem Umfang gerechnet werden."},{"desc":"grosse Gefahr","behav":"Der Aufenthalt im Bereich von Fliessgewässern ist <strong>äusserst gefährlich</strong>. Halten Sie sich fern.","effects":"Bei dieser Wasserführung können vermehrt Ausuferungen (das Wasser verlässt das Bachbett) und Überflutungen auftreten. Dabei können Gebäude und Infrastrukturanlagen betroffen sein. Verkehrsbehinderungen sind möglich und es muss vermehrt mit Schäden gerechnet werden."},{"desc":"sehr grosse Gefahr","behav":"Der Aufenthalt im Bereich von Fliessgewässern ist <strong>äusserst gefährlich</strong>. Halten Sie sich fern.","effects":"Bei dieser Wasserführung können vielerorts Ausuferungen (das Wasser verlässt das Bachbett) und Überflutungen auftreten. Infrastrukturanlagen von nationaler Bedeutung wie zum Beispiel Bahnstrecken, Dörfer und Städte sowie Industrieanlagen können in grossem Masse von Überflutungen betroffen sein. Zum Teil sind massive Verkehrsbehinderungen zu erwarten. Es ist verbreitet mit zum Teil grossen Schäden zu rechnen."}]}},"supports":{"html":false}}');

/***/ }),

/***/ "./src/js/edit.js":
/*!************************!*\
  !*** ./src/js/edit.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function Edit({
  attributes,
  setAttributes,
  clientId
}) {
  var _attributes$dangerGen;
  /* =============================================================== *\
    		1. Block-Props
  \* =============================================================== */
  const {
    dataUrl,
    visibleKeys = []
  } = attributes;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps)();

  /* =============================================================== *\
    		2. Stammdaten / Datei-Auswahl / Labels
  \* =============================================================== */
  const [fileOptions, setFileOptions] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([{
    label: "Lade…",
    value: ""
  }]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [availableKeys, setAvailableKeys] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [rows, setRows] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [keyLabels, setKeyLabels] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let off = false;
    fetch("/wp-json/ud/messstation/scan-json").then(r => r.json()).then(data => {
      if (off) return;
      if (Array.isArray(data)) {
        setFileOptions(data.length ? [{
          label: "Bitte auswählen",
          value: ""
        }, ...data] : [{
          label: "Keine JSON-Dateien gefunden",
          value: ""
        }]);
      } else if (data?.error === "no_dir_selected") {
        setFileOptions([]);
      } else {
        setFileOptions([{
          label: "Unbekannter Fehler beim Laden",
          value: ""
        }]);
      }
    }).catch(() => !off && setFileOptions([{
      label: "Fehler beim Laden",
      value: ""
    }])).finally(() => !off && setLoading(false));
    return () => {
      off = true;
    };
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let off = false;
    if (!dataUrl) {
      setAvailableKeys([]);
      setRows([]);
      return;
    }
    fetch(dataUrl).then(r => r.json()).then(json => {
      if (off) return;
      if (Array.isArray(json) && json.length) {
        const keys = Object.keys(json[0]).filter(k => k !== "time");
        setAvailableKeys(keys);
        setRows(json);
      } else {
        setAvailableKeys([]);
        setRows([]);
      }
    }).catch(() => {
      if (!off) {
        setAvailableKeys([]);
        setRows([]);
      }
    });
    return () => {
      off = true;
    };
  }, [dataUrl]);

  /* =============================================================== *\
  	3. Sichtbare Metriken / Zustand
  \* =============================================================== */

  const hasWL = visibleKeys.includes("waterLevel");
  const hasDI = visibleKeys.includes("discharge");
  const hasDangerLevel = visibleKeys.includes("dangerLevel"); // ⬅️ hier ergänzen

  const [activeEditorMetric, setActiveEditorMetric] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(hasWL ? "waterLevel" : hasDI ? "discharge" : null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (hasWL && hasDI) {
      if (activeEditorMetric !== "waterLevel" && activeEditorMetric !== "discharge") {
        setActiveEditorMetric("waterLevel");
      }
    } else if (hasWL) {
      setActiveEditorMetric("waterLevel");
    } else if (hasDI) {
      setActiveEditorMetric("discharge");
    } else {
      setActiveEditorMetric(null);
    }
  }, [hasWL, hasDI]);

  /* =============================================================== *\
     	4. Chart-Vorschau (Editor)
  \* =============================================================== */

  const metricCanvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const metricInstRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!metricCanvasRef.current || !window.udInitMetricChart || !window.Chart) return;
    metricInstRef.current?.destroy();
    const active = activeEditorMetric || (hasWL ? "waterLevel" : "discharge");
    metricInstRef.current = window.udInitMetricChart(metricCanvasRef.current, {
      url: dataUrl,
      hasWL,
      hasDI,
      active,
      labelByMetric: {
        waterLevel: keyLabels?.waterLevel || "Wasserstand",
        discharge: keyLabels?.discharge || "Abfluss"
      },
      units: {
        waterLevel: "m",
        discharge: "m³/s"
      },
      daysOverride: 14
    });
    return () => {
      metricInstRef.current?.destroy();
      metricInstRef.current = null;
    };
  }, [dataUrl, hasWL, hasDI, activeEditorMetric, keyLabels]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (metricInstRef.current && activeEditorMetric) {
      metricInstRef.current.setActive(activeEditorMetric);
    }
  }, [activeEditorMetric]);

  /* =============================================================== *\
  	5. Gauge (Gefahrenstufe)
  \* =============================================================== */

  const latest = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows[rows.length - 1];
  }, [rows]);
  const dangerValue = latest?.dangerLevel != null ? Math.round(latest.dangerLevel) : null;
  const gaugeRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const gaugeInstRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const gaugeId = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useId)();
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (gaugeRef.current && window.udInitDangerLevelGauge) {
      window.udInitDangerLevelGauge(gaugeRef.current);
    }
  }, [dangerValue, hasDangerLevel]);

  /* =============================================================== *\
    		6. Hilfswerte
  \* =============================================================== */

  const has = k => visibleKeys.includes(k);
  const toggleKey = key => isChecked => {
    const next = isChecked ? [...visibleKeys, key] : visibleKeys.filter(k => k !== key);
    setAttributes({
      visibleKeys: next
    });
  };
  const tempValue = latest?.waterTemperature != null ? `${Math.round(latest.waterTemperature)}°` : "–";
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: "Datei-Auswahl",
        initialOpen: true,
        children: loading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, {}) : fileOptions.length > 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: "Messdaten-Datei",
            options: fileOptions,
            value: dataUrl,
            onChange: value => setAttributes({
              dataUrl: value
            })
          })
        }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("p", {
          className: "components-base-control__help",
          children: ["Bitte zuerst ein Verzeichnis in den", " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("a", {
            href: "/wp-admin/options-general.php?page=ud_messstation_settings",
            target: "_blank",
            rel: "noopener noreferrer",
            children: "Einstellungen des Messstation-Blocks"
          }), " ", "w\xE4hlen."]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
        title: "Anzuzeigende Parameter",
        initialOpen: true,
        children: [availableKeys.includes("waterTemperature") && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: "Wassertemperatur (\xB0C)",
            checked: has("waterTemperature"),
            onChange: toggleKey("waterTemperature")
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: "Messstation",
            checked: attributes.showStation,
            onChange: val => setAttributes({
              showStation: val
            })
          })
        }), availableKeys.includes("dangerLevel") && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: "Gefahrenstufe",
            checked: has("dangerLevel"),
            onChange: toggleKey("dangerLevel")
          })
        }), availableKeys.includes("waterLevel") && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: "Wasserstand",
            checked: has("waterLevel"),
            onChange: toggleKey("waterLevel")
          })
        }), availableKeys.includes("discharge") && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: "Abfluss",
            checked: has("discharge"),
            onChange: toggleKey("discharge")
          })
        })]
      })]
    }), has("waterTemperature") && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "ud-messstation-output ud-messstation-temperature",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "h2",
        value: attributes.tempHeading || "Wassertemperatur",
        onChange: val => setAttributes({
          tempHeading: val
        }),
        placeholder: "Wassertemperatur",
        inlineToolbar: true,
        allowedFormats: []
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "value_container",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "value",
          children: tempValue
        })
      })]
    }), attributes.showStation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "ud-messstation-output ud-messstation-messstation",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "h2",
        value: attributes.maessstationHeading || "Messstation",
        onChange: val => setAttributes({
          maessstationHeading: val
        }),
        placeholder: "Messstation",
        allowedFormats: []
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.InnerBlocks, {
        allowedBlocks: ["muotamap/single-map"],
        template: [["muotamap/single-map"]],
        templateLock: "insert"
      })]
    }), has("dangerLevel") && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "ud-messstation-output ud-messstation-dangerlevel",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
        tagName: "h2",
        value: attributes.dangerHeading || "Gefahrenstufe",
        onChange: val => setAttributes({
          dangerHeading: val
        }),
        placeholder: "Gefahrenstufe",
        allowedFormats: []
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "ud-dangerlevel-generalhint",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
          tagName: "p",
          placeholder: "Allgemeiner Hinweistext\u2026",
          value: (_attributes$dangerGen = attributes.dangerGeneralHint) !== null && _attributes$dangerGen !== void 0 ? _attributes$dangerGen : "",
          onChange: val => setAttributes({
            dangerGeneralHint: val
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "ud-dangerlevel-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          className: "ud-gauge-wrap",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            ref: gaugeRef,
            className: "ud-gauge-canvas"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            ref: gaugeRef,
            className: "ud-dangerlevel-gauge",
            id: `ud-gauge-${clientId}` // z. B. über Block-ID eindeutig
            ,
            "data-value": dangerValue || 0,
            "data-min": "1",
            "data-max": "5"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
            className: "ud-dangerlevel-current",
            children: ["Aktuelle Stufe:", " ", Number.isFinite(dangerValue) ? dangerValue : "—"]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "ud-dangerlevel-accordion",
          children: [0, 1, 2, 3, 4].map(i => {
            var _attributes$dangerLev;
            const level = (_attributes$dangerLev = attributes.dangerLevels?.[i]) !== null && _attributes$dangerLev !== void 0 ? _attributes$dangerLev : {
              desc: "",
              behav: "",
              effects: ""
            };
            return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("details", {
              className: "ud-dangerlevel-item",
              open: i === 0,
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("summary", {
                children: ["Stufe ", i + 1]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                className: "ud-dangerlevel-content",
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                  className: "ud-dangerlevel-field",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
                    children: "Beschreibung"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                    tagName: "p",
                    inlineToolbar: true,
                    allowedFormats: [],
                    value: level.desc,
                    onChange: val => {
                      var _attributes$dangerLev2;
                      const next = [...((_attributes$dangerLev2 = attributes.dangerLevels) !== null && _attributes$dangerLev2 !== void 0 ? _attributes$dangerLev2 : [])];
                      next[i] = {
                        ...next[i],
                        desc: val
                      };
                      setAttributes({
                        dangerLevels: next
                      });
                    }
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                  className: "ud-dangerlevel-field",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
                    children: "Verhalten"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                    tagName: "p",
                    inlineToolbar: true,
                    allowedFormats: ["core/bold", "core/italic", "core/link"],
                    value: level.behav,
                    onChange: val => {
                      var _attributes$dangerLev3;
                      const next = [...((_attributes$dangerLev3 = attributes.dangerLevels) !== null && _attributes$dangerLev3 !== void 0 ? _attributes$dangerLev3 : [])];
                      next[i] = {
                        ...next[i],
                        behav: val
                      };
                      setAttributes({
                        dangerLevels: next
                      });
                    }
                  })]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
                  className: "ud-dangerlevel-field",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("strong", {
                    children: "Auswirkungen"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
                    tagName: "p",
                    value: level.effects,
                    onChange: val => {
                      var _attributes$dangerLev4;
                      const next = [...((_attributes$dangerLev4 = attributes.dangerLevels) !== null && _attributes$dangerLev4 !== void 0 ? _attributes$dangerLev4 : [])];
                      next[i] = {
                        ...next[i],
                        effects: val
                      };
                      setAttributes({
                        dangerLevels: next
                      });
                    }
                  })]
                })]
              })]
            }, i);
          })
        })]
      })]
    }), (hasWL || hasDI) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
      className: "ud-messstation-output ud-messstation-metric",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "ud-metric-header",
        children: [hasWL && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
          tagName: "h2",
          className: `ud-metric-label wl ${activeEditorMetric === "waterLevel" ? "is-active" : ""}`,
          value: attributes.levelHeading || "Wasserstand",
          onChange: val => setAttributes({
            levelHeading: val
          }),
          placeholder: "Wasserstand",
          allowedFormats: [],
          onClick: () => setActiveEditorMetric("waterLevel")
        }), hasWL && hasDI && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "ud-metric-sep",
          style: {
            opacity: 0.4,
            margin: "0 .5rem"
          },
          children: "/"
        }), hasDI && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText, {
          tagName: "h2",
          className: `ud-metric-label di ${activeEditorMetric === "discharge" ? "is-active" : ""}`,
          value: attributes.dischargeHeading || "Abfluss",
          onChange: val => setAttributes({
            dischargeHeading: val
          }),
          placeholder: "Abfluss",
          allowedFormats: [],
          onClick: () => setActiveEditorMetric("discharge")
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "ud-metric-chart",
        children: (hasWL || hasDI) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("section", {
          className: "ud-messstation-output ud-messstation-metric",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "ud-metric-header"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "ud-metric-chart",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: "ud-metric-canvas",
              "data-role": "metric",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("canvas", {
                ref: metricCanvasRef,
                className: "ud-metric-canvas-el",
                height: "240"
              })
            })
          })]
        })
      })]
    })]
  });
}

/***/ }),

/***/ "./src/js/save.js":
/*!************************!*\
  !*** ./src/js/save.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function save() {
  // Speichert die verschachtelten Blöcke im Post-Inhalt,
  // damit sie in render.php als $content ankommen.
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, {});
}

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/js/editor.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ "./src/js/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./save */ "./src/js/save.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../block.json */ "./block.json");
/**
 * editor.js
 *
 * JavaScript für den Block-Editor (Gutenberg).
 * Wird ausschließlich im Backend geladen.
 *
 * Hinweis:
 * Diese Datei enthält editor-spezifische Interaktionen oder React-Komponenten.
 * Wird über webpack zu editor.js gebündelt und in block.json oder enqueue.php eingebunden.
 */




wp.blocks.registerBlockType(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_2__,
  edit: _edit__WEBPACK_IMPORTED_MODULE_0__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_1__["default"]
});
})();

/******/ })()
;
//# sourceMappingURL=editor-script.js.map