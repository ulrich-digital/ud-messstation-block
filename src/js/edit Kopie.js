import { useEffect, useState } from "@wordpress/element";
import { useBlockProps, InspectorControls, InnerBlocks } from "@wordpress/block-editor";
import {
	PanelBody,
	PanelRow,
	SelectControl,
	Spinner,
	ToggleControl,
} from "@wordpress/components";
import ServerSideRender from "@wordpress/server-side-render";

export default function Edit({ attributes, setAttributes }) {
	const { dataUrl, visibleKeys = [] } = attributes;
	const [fileOptions, setFileOptions] = useState([
		{ label: "Lade…", value: "" },
	]);
	const [loading, setLoading] = useState(true);
	const [availableKeys, setAvailableKeys] = useState([]);
	const [keyLabels, setKeyLabels] = useState({});
	const [noDirSelected, setNoDirSelected] = useState(false);

	// JSON-Dateien laden
	useEffect(() => {
		fetch("/wp-json/ud/messstation/scan-json")
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					if (data.length > 0) {
						setFileOptions([
							{ label: "Bitte auswählen", value: "" },
							...data,
						]);
						setNoDirSelected(false);
					} else {
						setFileOptions([
							{ label: "Keine JSON-Dateien gefunden", value: "" },
						]);
						setNoDirSelected(false);
					}
				} else if (data?.error === "no_dir_selected") {
					setFileOptions([]);
					setNoDirSelected(true);
				} else {
					setFileOptions([
						{ label: "Unbekannter Fehler beim Laden", value: "" },
					]);
					setNoDirSelected(false);
				}
			})
			.catch(() => {
				setFileOptions([
					{ label: "Fehler beim Laden der Dateien", value: "" },
				]);
			})
			.finally(() => setLoading(false));
	}, []);

	// Keys der gewählten JSON-Datei laden
	useEffect(() => {
		if (!dataUrl) {
			setAvailableKeys([]);
			return;
		}

		fetch(dataUrl)
			.then((res) => res.json())
			.then((json) => {
				if (Array.isArray(json) && json.length > 0) {
					const keys = Object.keys(json[0]).filter(
						(k) => k !== "time",
					);
					setAvailableKeys(keys);
				} else {
					setAvailableKeys([]);
				}
			})
			.catch(() => setAvailableKeys([]));
	}, [dataUrl]);

	// Labels laden
	useEffect(() => {
		fetch("/wp-json/ud/messstation/key-labels")
			.then((res) => res.json())
			.then((data) => {
				if (data && typeof data === "object") {
					setKeyLabels(data);
				}
			})
			.catch(() => setKeyLabels({}));
	}, []);

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title="Datei-Auswahl" initialOpen={true}>
					{loading ? (
						<Spinner />
					) : fileOptions.length > 0 ? (
						<PanelRow>
							<SelectControl
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
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
				<PanelBody title="Anzuzeigende Parameter" initialOpen={true}>
					{availableKeys.map((key) => {
						if (key === "waterTemperature") {
							return (
								<PanelRow key={key}>
									<ToggleControl
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
										label="Wassertemperatur (°C)"
										checked={visibleKeys.includes(key)}
										onChange={(isChecked) => {
											const next = isChecked
												? [...visibleKeys, key]
												: visibleKeys.filter(
														(k) => k !== key,
												  );
											setAttributes({
												visibleKeys: next,
											});
										}}
									/>
								</PanelRow>
							);
						}
					})}

					{availableKeys.map((key) => {
						if (key === "dangerLevel") {
							return (
								<PanelRow key={key}>
									<ToggleControl
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
										label="Gefahrenstufe"
										checked={visibleKeys.includes(key)}
										onChange={(isChecked) => {
											const next = isChecked
												? [...visibleKeys, key]
												: visibleKeys.filter(
														(k) => k !== key,
												  );
											setAttributes({
												visibleKeys: next,
											});
										}}
									/>
								</PanelRow>
							);
						}
					})}

					{availableKeys.map((key) => {
						if (key === "waterLevel") {
							return (
								<PanelRow key={key}>
									<ToggleControl
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
										label="Wasserstand"
										checked={visibleKeys.includes(key)}
										onChange={(isChecked) => {
											const next = isChecked
												? [...visibleKeys, key]
												: visibleKeys.filter(
														(k) => k !== key,
												  );
											setAttributes({
												visibleKeys: next,
											});
										}}
									/>
								</PanelRow>
							);
						}
					})}
					{availableKeys.map((key) => {
						if (key === "discharge") {
							return (
								<PanelRow key={key}>
									<ToggleControl
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
										label="Abfluss"
										checked={visibleKeys.includes(key)}
										onChange={(isChecked) => {
											const next = isChecked
												? [...visibleKeys, key]
												: visibleKeys.filter(
														(k) => k !== key,
												  );
											setAttributes({
												visibleKeys: next,
											});
										}}
									/>
								</PanelRow>
							);
						}
					})}
				</PanelBody>
			</InspectorControls>

			{/* Vorschau des Blocks */}
			<ServerSideRender
				block="ud/messstation-block"
				attributes={attributes}
			/>
 {/* Editor-Slot: Karte zur Messstation (echter muotamap-Block) */}
   <div className="ud-messstation-map-slot">
     <InnerBlocks
       allowedBlocks={['muotamap/single-map']}
       template={[
         ['muotamap/single-map', {
           latitude: 47.0064174,
           longitude: 8.6322735,
           zoom: 13,
           markers: []
         }]
      ]}
       templateLock="insert"  // genau 1 Karte, aber Attribute/Marker frei bearbeitbar
     />
   </div>
		</div>
	);
}
