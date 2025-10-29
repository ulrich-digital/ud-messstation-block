<?php

/**
 * Server-Side Rendering Callback für den Messstation-Block
 */

defined('ABSPATH') || exit;

function ud_messstation_render($attributes, $content, $block) {
    // --- Attribut-Vorverarbeitung ---
    $dataUrl = $attributes['dataUrl'] ?? '';
    $visibleKeys  = $attributes['visibleKeys'] ?? [];
    $showStation  = $attributes['showStation'] ?? [];

    // --- Wrapper generieren ---
    $wrapper_attributes = get_block_wrapper_attributes();

    // --- Validierungen & Frühzeitiger Abbruch ---
    if (empty($dataUrl)) {
        return '<div ' . $wrapper_attributes . '>
            <div class="ud-messstation-notice ud-messstation-no-dir">
                Bitte zuerst ein Verzeichnis in den
                <a href="' . esc_url(admin_url('options-general.php?page=ud_messstation_settings')) . '" target="_blank" rel="noopener noreferrer">Einstellungen des Messstation-Blocks</a>
                wählen.
            </div>
        </div>';
    }
    if (empty($visibleKeys)) {
        return '<div ' . $wrapper_attributes . '>
            <div class="ud-messstation-notice ud-messstation-no-keys">
                Bitte mindestens einen Mess-Parameter auswählen.
            </div>
        </div>';
    }

    // --- JSON-Datei einlesen ---
    $fullPath = ABSPATH . ltrim($dataUrl, '/');
    if (!file_exists($fullPath)) {
        return '<div ' . $wrapper_attributes . '>
            <div class="ud-messstation-notice ud-messstation-fetch-error">
                Datei nicht gefunden: ' . esc_html($dataUrl) . '
            </div>
        </div>';
    }

    $body = file_get_contents($fullPath);
    $data = json_decode($body, true);
    if (!is_array($data) || empty($data)) {
        return '<div ' . $wrapper_attributes . '>
            <div class="ud-messstation-notice ud-messstation-empty">Keine Daten gefunden.</div>
        </div>';
    }

    $latest = end($data);
    if (!is_array($latest)) {
        return '<div ' . $wrapper_attributes . '>
            <div class="ud-messstation-notice ud-messstation-empty">Keine verwertbaren Daten gefunden.</div>
        </div>';
    }

    // --- Sichtbare Messwerte feststellen ---
    $hasTemp = in_array('waterTemperature', $visibleKeys, true);
    $hasWL   = in_array('waterLevel',       $visibleKeys, true);
    $hasDI   = in_array('discharge',        $visibleKeys, true);
    $hasDL   = in_array('dangerLevel',      $visibleKeys, true);

    // --- IDs für Charts ---
    $dl_id     = 'dangerLevelChart_' . uniqid();
    $metric_id = 'ud_metric_' . uniqid();

    // --- Werte auslesen ---
    $tempVal = isset($latest['waterTemperature']) ? (float)$latest['waterTemperature'] : null;
    $dlVal   = isset($latest['dangerLevel']) ? (int)round($latest['dangerLevel']) : null;
    $dlVal   = max(1, min(5, $dlVal)); // Wertebereich: 1 bis 5


    $tempHeading = $attributes['tempHeading'];
    $messstationHeading = $attributes['messstationHeading'];
    $dangerHeading = $attributes['dangerHeading'];
    $levelHeading = $attributes['levelHeading'];
    $dischargeHeading = $attributes['dischargeHeading'];
    $dangerLevels = $attributes['dangerLevels'] ?? [];
    $index = $dlVal - 1;
    $dlEntry = isset($dangerLevels[$index]) ? $dangerLevels[$index] : ['desc' => '', 'behav' => '', 'effects' => ''];
    $generalHint = $attributes['dangerGeneralHint'] ?? '';


    ob_start();
?>
    <div <?php echo $wrapper_attributes; ?>>

        <?php if ($hasTemp) : ?>
            <!-- Wassertemperatur -->
            <section class="ud-messstation-output ud-messstation-temperature">
                <h2><?php echo esc_html($tempHeading); ?></h2>
                <div class="value_container">
                    <svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 288 512">
                        <path d="M144,48c-35.2999878,0-64,28.6999969-64,64v174.3999939c0,6.1000061-2.3000031,11.8999939-6.3999939,16.3000183-15.9000092,17.0999756-25.6000061,40-25.6000061,65.2999878,0,53,43,96,96,96s96-43,96-96c0-25.2000122-9.7000122-48.1000061-25.6000061-65.2999878-4.1000061-4.4000244-6.3999939-10.3000183-6.3999939-16.3000183V112c0-35.3000031-28.7000122-64-64-64ZM32,112C32,50.0999985,82.1000061,0,144,0s112,50.0999985,112,112v165.5c20,24.7000122,32,56.2000122,32,90.5,0,79.5-64.5,144-144,144S0,447.5,0,368c0-34.2999878,12-65.7999878,32-90.5V112ZM192,368c0,26.5-21.5,48-48,48s-48-21.5-48-48c0-17.7999878,9.7000122-33.2999878,24-41.6000061V112c0-13.3000031,10.7000122-24,24-24s24,10.6999969,24,24v214.3999939c14.2999878,8.3000183,24,23.8000183,24,41.6000061Z" />
                    </svg>
                    <div class="value">
                        <?php echo ($tempVal !== null) ? intval(round($tempVal)) . '°' : '–'; ?>
                    </div>
                </div>
            </section>
        <?php endif; ?>


        <?php if ($showStation) : ?>
            <!-- InnerBlocks für Messstation (z. B. muotamap/single-map) -->
            <section class="ud-messstation-output ud-messstation-messstation">
                <h2><?php echo esc_html($messstationHeading); ?></h2>
                <?php echo do_blocks($content); ?>
            </section>
        <?php endif; ?>


        <?php if ($hasDL) : ?>
            <!-- Gefahrenstufe (Gauge + Texte) -->
            <section class="ud-messstation-output ud-messstation-dangerlevel">
                <h2><?php echo esc_html($dangerHeading); ?></h2>

                <div class="row_1">
                    <?php if (!empty($generalHint)) : ?>
                        <div class="ud-messstation-dangerlevel-notice">
                            <?php echo wpautop(wp_kses_post($generalHint)); ?>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="row_2">
                    <div class="danger_level_section">

                        <div id="<?php echo esc_attr($dl_id); ?>"
                            class="ud-dangerlevel-gauge"
                            data-value="<?php echo esc_attr($dlVal); ?>"
                            data-min="1" data-max="5"></div>

                        <div class="descriptions">
                            <?php if (!empty($dlEntry['desc'])) : ?>
                                <p class="description"><?php echo wp_kses_post($dlEntry['desc']); ?></p>
                            <?php else : ?>
                                <p class="description">Keine Beschreibung für diese Stufe hinterlegt.</p>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="behavior_and_effects">
                        <div class="row behavior">
                            <div class="svg_container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path d="M320 144C350.9 144 376 118.9 376 88C376 57.1 350.9 32 320 32C289.1 32 264 57.1 264 88C264 118.9 289.1 144 320 144zM233.4 291.9L256 269.3L256 338.6C256 366.6 268.2 393.3 289.5 411.5L360.9 472.7C366.8 477.8 370.7 484.8 371.8 492.5L384.4 580.6C386.9 598.1 403.1 610.3 420.6 607.8C438.1 605.3 450.3 589.1 447.8 571.6L435.2 483.5C431.9 460.4 420.3 439.4 402.6 424.2L368.1 394.6L368.1 279.4L371.9 284.1C390.1 306.9 417.7 320.1 446.9 320.1L480.1 320.1C497.8 320.1 512.1 305.8 512.1 288.1C512.1 270.4 497.8 256.1 480.1 256.1L446.9 256.1C437.2 256.1 428 251.7 421.9 244.1L404 221.7C381 192.9 346.1 176.1 309.2 176.1C277 176.1 246.1 188.9 223.4 211.7L188.1 246.6C170.1 264.6 160 289 160 314.5L160 352C160 369.7 174.3 384 192 384C209.7 384 224 369.7 224 352L224 314.5C224 306 227.4 297.9 233.4 291.9zM245.8 471.3C244.3 476.5 241.5 481.3 237.7 485.1L169.4 553.4C156.9 565.9 156.9 586.2 169.4 598.7C181.9 611.2 202.2 611.2 214.7 598.7L283 530.4C294.5 518.9 302.9 504.6 307.4 488.9L309.6 481.3L263.6 441.9C261.1 439.7 258.6 437.5 256.2 435.1L245.8 471.3z" />
                                </svg></div>
                            <div class="text dl-behaviour"><?php echo wpautop(wp_kses_post($dlEntry['behav'] ?? '')); ?></div>
                        </div>
                        <div class="row effects">
                            <div class="svg_container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                    <path d="M432.6 320.2C419.6 320.8 406.7 323.1 394.6 326.2C382.8 329.2 369.4 326.8 359.1 320.3C349 313.9 343.9 305.2 343.9 296C343.9 247.4 383.3 208 431.9 208C445.4 208 458.2 211 469.6 216.5C479.5 221.2 491.2 218.6 498.2 210.3C505.2 202 505.8 189.9 499.5 181C463.3 129.7 403.5 96 335.9 96C225.4 96 135.9 185.5 135.9 296L135.9 297.6C135.9 329 115.5 356.8 85.6 366.3L80.7 367.8C68.9 371.6 61.9 383.8 64.6 395.9C67.3 408 78.9 416.1 91.2 414.5C119.4 410.7 144.8 395.6 165.4 380C186.7 363.9 215.3 363.9 236.6 380C260.8 398.3 288.9 415.9 320 415.9C351.1 415.9 379.1 398.2 403.4 380C413.1 372.7 424.2 368.8 435.3 368.1C436.8 368 438.3 368 439.8 368C451.9 368.2 464.1 372.1 474.6 380.1C495.3 395.7 520.6 410.8 548.8 414.6C561.9 416.4 574 407.1 575.8 394C577.6 380.9 568.3 368.8 555.2 367C539.3 364.9 522 355.7 503.5 341.8C484.7 327.6 462.6 320.4 440.3 320.1C437.8 320.1 435.2 320.1 432.7 320.3zM403.4 508.1C424.7 492 453.3 492 474.6 508.1C495.3 523.7 520.6 538.8 548.8 542.6C561.9 544.4 574 535.1 575.8 522C577.6 508.9 568.3 496.8 555.2 495C539.3 492.9 522 483.7 503.5 469.8C465.1 440.8 413 440.8 374.5 469.8C350.5 487.9 333.8 496.1 320 496.1C306.2 496.1 289.5 487.9 265.5 469.8C227.1 440.8 175 440.8 136.5 469.8C118 483.7 100.7 492.9 84.8 495C71.7 496.8 62.4 508.8 64.2 522C66 535.2 78 544.4 91.2 542.6C119.4 538.8 144.8 523.7 165.4 508.1C186.7 492 215.3 492 236.6 508.1C260.8 526.4 288.9 544 320 544C351.1 544 379.1 526.3 403.4 508.1z" />
                                </svg></div>
                            <div class="text dl-effects"><?php echo wpautop(wp_kses_post($dlEntry['effects'] ?? '')); ?></div>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <?php if ($hasWL || $hasDI) : ?>
            <!-- Wasserstand / Abfluss (umschaltbar) -->
            <?php $activeMetric = $hasWL ? 'waterLevel' : 'discharge'; ?>
            <section class="ud-messstation-output ud-messstation-metric">
                <div class="ud-metric-header">
                    <span class="ud-metric-label wl <?php echo $activeMetric === 'waterLevel' ? 'is-active' : ''; ?>"><?php echo esc_html($levelHeading); ?></span>
                    <?php if ($hasWL && $hasDI) : ?>
                        <label class="ud-metric-switch">
                            <input type="checkbox"
                                class="ud-metric-toggle"
                                aria-label="Wasserstand / Abfluss umschalten"
                                <?php echo $activeMetric === 'discharge' ? 'checked' : ''; ?>>
                            <span class="slider"></span>
                        </label>
                    <?php endif; ?>
                    <span class="ud-metric-label di <?php echo $activeMetric === 'discharge' ? 'is-active' : ''; ?>"><?php echo esc_html($dischargeHeading); ?></span>
                </div>

                <div class="ud-waterlevel-chart-wrap">
                    <canvas id="<?php echo esc_attr($metric_id); ?>"
                        class="ud-metric-canvas"
                        data-role="metric"
                        data-url="<?php echo esc_attr($dataUrl); ?>"
                        data-has-wl="<?php echo $hasWL ? '1' : '0'; ?>"
                        data-has-di="<?php echo $hasDI ? '1' : '0'; ?>"
                        data-active="<?php echo esc_attr($activeMetric); ?>">
                    </canvas>
                </div>
            </section>
        <?php endif; ?>

    </div>



<?php
    return ob_get_clean();
}
