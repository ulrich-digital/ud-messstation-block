import {
	useEffect,
	useMemo,
	useState,
	useId,
	useRef,
} from "@wordpress/element";
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	RichText,
} from "@wordpress/block-editor";
import {
	PanelBody,
	PanelRow,
	SelectControl,
	Spinner,
	ToggleControl,
} from "@wordpress/components";

export default function Edit({ attributes, setAttributes, clientId }) {

	/* =============================================================== *\
   		1. Block-Props
	\* =============================================================== */
	const { dataUrl, visibleKeys = [] } = attributes;
	const blockProps = useBlockProps();

	/* =============================================================== *\
   		2. Stammdaten / Datei-Auswahl / Labels
	\* =============================================================== */
	const [fileOptions, setFileOptions] = useState([
		{ label: "Lade…", value: "" },
	]);


	const [loading, setLoading] = useState(true);
	const [availableKeys, setAvailableKeys] = useState([]);
	const [rows, setRows] = useState([]);
	const [keyLabels, setKeyLabels] = useState({});

	useEffect(() => {
		let off = false;
		fetch("/wp-json/ud/messstation/scan-json")
			.then((r) => r.json())
			.then((data) => {
				if (off) return;
				if (Array.isArray(data)) {
					setFileOptions(
						data.length
							? [{ label: "Bitte auswählen", value: "" }, ...data]
							: [
									{
										label: "Keine JSON-Dateien gefunden",
										value: "",
									},
							  ],
					);
				} else if (data?.error === "no_dir_selected") {
					setFileOptions([]);
				} else {
					setFileOptions([
						{ label: "Unbekannter Fehler beim Laden", value: "" },
					]);
				}
			})
			.catch(
				() =>
					!off &&
					setFileOptions([{ label: "Fehler beim Laden", value: "" }]),
			)
			.finally(() => !off && setLoading(false));
		return () => {
			off = true;
		};
	}, []);

	useEffect(() => {
		let off = false;
		if (!dataUrl) {
			setAvailableKeys([]);
			setRows([]);
			return;
		}
		fetch(dataUrl)
			.then((r) => r.json())
			.then((json) => {
				if (off) return;
				if (Array.isArray(json) && json.length) {
					const keys = Object.keys(json[0]).filter(
						(k) => k !== "time",
					);
					setAvailableKeys(keys);
					setRows(json);
				} else {
					setAvailableKeys([]);
					setRows([]);
				}
			})
			.catch(() => {
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

	const [activeEditorMetric, setActiveEditorMetric] = useState(
		hasWL ? "waterLevel" : hasDI ? "discharge" : null,
	);

	useEffect(() => {
		if (hasWL && hasDI) {
			if (
				activeEditorMetric !== "waterLevel" &&
				activeEditorMetric !== "discharge"
			) {
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

	const metricCanvasRef = useRef(null);
	const metricInstRef = useRef(null);

	useEffect(() => {
		if (
			!metricCanvasRef.current ||
			!window.udInitMetricChart ||
			!window.Chart
		)
			return;

		metricInstRef.current?.destroy();

		const active =
			activeEditorMetric || (hasWL ? "waterLevel" : "discharge");

		metricInstRef.current = window.udInitMetricChart(
			metricCanvasRef.current,
			{
				url: dataUrl,
				hasWL,
				hasDI,
				active,
				labelByMetric: {
					waterLevel: keyLabels?.waterLevel || "Wasserstand",
					discharge: keyLabels?.discharge || "Abfluss",
				},
				units: { waterLevel: "m", discharge: "m³/s" },
				daysOverride: 14,
			},
		);

		return () => {
			metricInstRef.current?.destroy();
			metricInstRef.current = null;
		};
	}, [dataUrl, hasWL, hasDI, activeEditorMetric, keyLabels]);

	useEffect(() => {
		if (metricInstRef.current && activeEditorMetric) {
			metricInstRef.current.setActive(activeEditorMetric);
		}
	}, [activeEditorMetric]);

	/* =============================================================== *\
		5. Gauge (Gefahrenstufe)
	\* =============================================================== */

	const latest = useMemo(() => {
		if (!Array.isArray(rows) || rows.length === 0) return null;
		return rows[rows.length - 1];
	}, [rows]);
	const dangerValue =
		latest?.dangerLevel != null ? Math.round(latest.dangerLevel) : null;
	const gaugeRef = useRef(null);
	const gaugeInstRef = useRef(null);
	const gaugeId = useId();

	useEffect(() => {
		if (gaugeRef.current && window.udInitDangerLevelGauge) {
			window.udInitDangerLevelGauge(gaugeRef.current);
		}
	}, [dangerValue, hasDangerLevel]);


	/* =============================================================== *\
   		6. Hilfswerte
	\* =============================================================== */

	const has = (k) => visibleKeys.includes(k);
	const toggleKey = (key) => (isChecked) => {
		const next = isChecked
			? [...visibleKeys, key]
			: visibleKeys.filter((k) => k !== key);
		setAttributes({ visibleKeys: next });
	};

	const tempValue =
		latest?.waterTemperature != null
			? `${Math.round(latest.waterTemperature)}°`
			: "–";

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title="Datei-Auswahl" initialOpen>
					{loading ? (
						<Spinner />
					) : fileOptions.length > 0 ? (
						<PanelRow>
							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label="Messdaten-Datei"
								options={fileOptions}
								value={dataUrl}
								onChange={(value) =>
									setAttributes({ dataUrl: value })
								}
							/>
						</PanelRow>
					) : (
						<p className="components-base-control__help">
							Bitte zuerst ein Verzeichnis in den{" "}
							<a
								href="/wp-admin/options-general.php?page=ud_messstation_settings"
								target="_blank"
								rel="noopener noreferrer"
							>
								Einstellungen des Messstation-Blocks
							</a>{" "}
							wählen.
						</p>
					)}
				</PanelBody>

				<PanelBody title="Anzuzeigende Parameter" initialOpen>
					{availableKeys.includes("waterTemperature") && (
						<PanelRow>
							<ToggleControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label="Wassertemperatur (°C)"
								checked={has("waterTemperature")}
								onChange={toggleKey("waterTemperature")}
							/>
						</PanelRow>
					)}

					<PanelRow>
						<ToggleControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label="Messstation"
							checked={attributes.showStation}
							onChange={(val) =>
								setAttributes({ showStation: val })
							}
						/>
					</PanelRow>
					{availableKeys.includes("dangerLevel") && (
						<PanelRow>
							<ToggleControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label="Gefahrenstufe"
								checked={has("dangerLevel")}
								onChange={toggleKey("dangerLevel")}
							/>
						</PanelRow>
					)}

					{availableKeys.includes("waterLevel") && (
						<PanelRow>
							<ToggleControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label="Wasserstand"
								checked={has("waterLevel")}
								onChange={toggleKey("waterLevel")}
							/>
						</PanelRow>
					)}

					{availableKeys.includes("discharge") && (
						<PanelRow>
							<ToggleControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label="Abfluss"
								checked={has("discharge")}
								onChange={toggleKey("discharge")}
							/>
						</PanelRow>
					)}
				</PanelBody>
			</InspectorControls>

			{/* ==== Live-Editor-Ansicht (spiegelt das Frontend) ==== */}

			{/* Temperatur */}
			{has("waterTemperature") && (
				<section className="ud-messstation-output ud-messstation-temperature">
					<RichText
						tagName="h2"
						value={attributes.tempHeading || "Wassertemperatur"}
						onChange={(val) => setAttributes({ tempHeading: val })}
						placeholder="Wassertemperatur"
						inlineToolbar
						allowedFormats={[]}
					/>
					<div className="value_container">
						<div className="value">{tempValue}</div>
					</div>
				</section>
			)}

			{/* Messstation: Karte sitzt hier und bleibt editierbar */}
			{attributes.showStation && (
				<section className="ud-messstation-output ud-messstation-messstation">
					<RichText
						tagName="h2"
						value={attributes.maessstationHeading || "Messstation"}
						onChange={(val) =>
							setAttributes({ maessstationHeading: val })
						}
						placeholder="Messstation"
						allowedFormats={[]}
					/>
					<InnerBlocks
						allowedBlocks={["muotamap/single-map"]}
						template={[["muotamap/single-map"]]}
						templateLock="insert"
					/>
				</section>
			)}

			{/* Gefahrenstufe (Editor-Hinweis mit Live-Zahl) */}
			{has("dangerLevel") && (
				<section className="ud-messstation-output ud-messstation-dangerlevel">
					<RichText
						tagName="h2"
						value={attributes.dangerHeading || "Gefahrenstufe"}
						onChange={(val) =>
							setAttributes({ dangerHeading: val })
						}
						placeholder="Gefahrenstufe"
						allowedFormats={[]}
					/>
					<div className="ud-dangerlevel-generalhint">
						<RichText
							tagName="p"
							placeholder="Allgemeiner Hinweistext…"
							value={attributes.dangerGeneralHint ?? ""}
							onChange={(val) =>
								setAttributes({ dangerGeneralHint: val })
							}
						/>
					</div>

					<div className="ud-dangerlevel-grid">
						{/* Gauge links */}
						<div className="ud-gauge-wrap">
							<div ref={gaugeRef} className="ud-gauge-canvas" />
							<div
								ref={gaugeRef}
								className="ud-dangerlevel-gauge"
								id={`ud-gauge-${clientId}`} // z. B. über Block-ID eindeutig
								data-value={dangerValue || 0}
								data-min="1"
								data-max="5"
							/>
							<div className="ud-dangerlevel-current">
								Aktuelle Stufe:{" "}
								{Number.isFinite(dangerValue)
									? dangerValue
									: "—"}
							</div>
						</div>

						{/* Rechte Spalte: 5 fix definierte Accordion-Felder */}
						<div className="ud-dangerlevel-accordion">
							{[0, 1, 2, 3, 4].map((i) => {
								const level = attributes.dangerLevels?.[i] ?? {
									desc: "",
									behav: "",
									effects: "",
								};

								return (
									<details
										key={i}
										className="ud-dangerlevel-item"
										open={i === 0}
									>
										<summary>Stufe {i + 1}</summary>

										<div className="ud-dangerlevel-content">
											<div className="ud-dangerlevel-field">
												<strong>Beschreibung</strong>
												<RichText
													tagName="p"
													inlineToolbar
													allowedFormats={[]}
													value={level.desc}
													onChange={(val) => {
														const next = [
															...(attributes.dangerLevels ??
																[]),
														];
														next[i] = {
															...next[i],
															desc: val,
														};
														setAttributes({
															dangerLevels: next,
														});
													}}
												/>
											</div>

											<div className="ud-dangerlevel-field">
												<strong>Verhalten</strong>
												<RichText
													tagName="p"
													inlineToolbar
													allowedFormats={[
														"core/bold",
														"core/italic",
														"core/link",
													]}
													value={level.behav}
													onChange={(val) => {
														const next = [
															...(attributes.dangerLevels ??
																[]),
														];
														next[i] = {
															...next[i],
															behav: val,
														};
														setAttributes({
															dangerLevels: next,
														});
													}}
												/>
											</div>

											<div className="ud-dangerlevel-field">
												<strong>Auswirkungen</strong>
												<RichText
													tagName="p"
													value={level.effects}
													onChange={(val) => {
														const next = [
															...(attributes.dangerLevels ??
																[]),
														];
														next[i] = {
															...next[i],
															effects: val,
														};
														setAttributes({
															dangerLevels: next,
														});
													}}
												/>
											</div>
										</div>
									</details>
								);
							})}
						</div>
					</div>
				</section>
			)}

			{/* Wasserstand/Abfluss (Editor-Hinweis) */}
			{(hasWL || hasDI) && (
				<section className="ud-messstation-output ud-messstation-metric">
					<div className="ud-metric-header">
						{/* Wasserstand */}
						{hasWL && (
							<RichText
								tagName="h2"
								className={`ud-metric-label wl ${
									activeEditorMetric === "waterLevel"
										? "is-active"
										: ""
								}`}
								value={attributes.levelHeading || "Wasserstand"}
								onChange={(val) =>
									setAttributes({ levelHeading: val })
								}
								placeholder="Wasserstand"
								allowedFormats={[]}
								onClick={() =>
									setActiveEditorMetric("waterLevel")
								}
							/>
						)}

						{/* Trenner */}
						{hasWL && hasDI && (
							<span
								className="ud-metric-sep"
								style={{ opacity: 0.4, margin: "0 .5rem" }}
							>
								/
							</span>
						)}

						{/* Abfluss */}
						{hasDI && (
							<RichText
								tagName="h2"
								className={`ud-metric-label di ${
									activeEditorMetric === "discharge"
										? "is-active"
										: ""
								}`}
								value={attributes.dischargeHeading || "Abfluss"}
								onChange={(val) =>
									setAttributes({ dischargeHeading: val })
								}
								placeholder="Abfluss"
								allowedFormats={[]}
								onClick={() =>
									setActiveEditorMetric("discharge")
								}
							/>
						)}
					</div>

					<div className="ud-metric-chart">
						{(hasWL || hasDI) && (
							<section className="ud-messstation-output ud-messstation-metric">
								<div className="ud-metric-header">
									{/* dein bestehender Header mit RichText h2 usw. bleibt unverändert */}
								</div>

								<div className="ud-metric-chart">
									<div
										className="ud-metric-canvas"
										data-role="metric"
									>
										<canvas
											ref={metricCanvasRef}
											className="ud-metric-canvas-el"
											height="240"
										/>
									</div>
								</div>
							</section>
						)}
					</div>
				</section>
			)}
		</div>
	);
}
