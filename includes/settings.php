<?php
defined('ABSPATH') || exit;

// Menü hinzufügen
add_action('admin_menu', function () {
    add_options_page(
        'Messstation-Block – Einstellungen',
        'Einstellungen für den Messstation-Block',
        'manage_options',
        'ud_messstation_settings',
        'ud_messstation_settings_page'
    );
});

// Defaults einmalig setzen
add_action('admin_init', function () {
    if (get_option('ud_messstation_key_labels') === false) {
        update_option('ud_messstation_key_labels', wp_json_encode([
            'discharge'        => 'Abfluss',
            'waterTemperature' => 'Temperatur',
        ]));
    }
});

// Alle passenden Verzeichnisse in wp-content/
function ud_messstation_list_subdirs() {
    $wp_content = WP_CONTENT_DIR;
    $dirs = array_filter(glob($wp_content . '/*'), 'is_dir');

    return array_filter($dirs, function ($dir) {
        $basename = basename($dir);
        return !in_array($basename, ['plugins', 'themes', 'uploads', 'upgrade', 'mu-plugins', 'cache']);
    });
}

// Settings-Seite anzeigen
function ud_messstation_settings_page() {
    $current = get_option('ud_messstation_json_dir', '');
    $dirs = ud_messstation_list_subdirs();

    $dangerlevels = get_option('ud_messstation_dangerlevels', []);
    if (!is_array($dangerlevels)) {
        $dangerlevels = [];
    }

?>
    <div class="wrap">
        <h1>Messstation Block – Einstellungen</h1>

        <?php if (isset($_GET['updated']) && $_GET['updated'] === 'true') : ?>
            <div id="message" class="updated notice is-dismissible">
                <p><strong>Einstellungen gespeichert.</strong></p>
            </div>
        <?php endif; ?>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <?php wp_nonce_field('ud_messstation_save_settings'); ?>
            <input type="hidden" name="action" value="ud_messstation_save_settings">

            <div class="ud-messstation-settings">
                <section class="ud-messstation-section">
                    <h2 class="ud-settings-section-title">Verzeichnis mit Messdateien auswählen</h2>
                    <p>Der Messstation-Block benötigt eine JSON-Datei mit Messwerten, z. B. Wasserstand oder Temperatur.<br />
                        Diese kann beispielsweise über einen Cron-Job serverseitig erzeugt werden.<br />
                        Wähle hier das Verzeichnis aus, in dem die JSON-Dateien abgelegt sind.<br />
                        Im Block-Editor stehen dann nur Dateien aus diesem Verzeichnis zur Auswahl.</p>
                    <div class="inner-section">
                        <h3 class="ud-settings-section-title">Verzeichnis auswählen</h3>
                        <div class="ud-settings-group verzeichnis_waehlen">
                            <?php if (!empty($dirs)) : ?>
                                <?php foreach ($dirs as $dir) :
                                    $basename = basename($dir);
                                ?>
                                    <label class="ud-radio-option">
                                        <input type="radio" name="json_dir" value="<?php echo esc_attr($basename); ?>" <?php checked($current, $basename); ?>>
                                        <?php echo esc_html($basename); ?>
                                    </label>
                                <?php endforeach; ?>

                            <?php else : ?>
                                <p><em>Keine passenden Verzeichnisse gefunden.</em></p>
                            <?php endif; ?>

                        </div>
                        <p class="ud-description">
                            Es sind nur Verzeichnisse im <code>wp-content/</code>-Ordner auswählbar.
                        </p>
                    </div>
                    <div class="inner-section">

                        <h3 class="ud-settings-section-title">oder neues Verzeichnis erstellen</h3>

                        <div class="ud-settings-group">
                            <input type="text" id="new_dir" name="new_dir" class="regular-text" placeholder="z. B. messdaten">
                            <p class="ud-description">
                                Erstellt ein neues Verzeichnis innerhalb von <code>wp-content/</code> und wählt es direkt als Datenquelle aus. </p>

                        </div>
                    </div>
                </section>






            </div>


            <div>
                <?php submit_button(); ?>
                <input type="submit" name="ud_messstation_reset" class="button button-secondary" value="Zurücksetzen" style="margin-left: 10px;">
            </div>
        </form>

        <style>
            .ud-messstation-settings {
                max-width: 1400px;
            }

            .ud-messstation-settings section {
                background-color: #fff;
                padding: 1rem;
                border-radius: 1rem;
                margin-top: 2rem;
            }

            .ud-messstation-settings section .inner-section {
                background: #eeeeee;
                padding: 1rem;
                border-radius: 0.75rem;
            }

            .ud-messstation-settings section .inner-section+.inner-section {
                margin-top: 1rem;
            }

            .ud-messstation-settings .ud-settings-group.verzeichnis_waehlen {
                display: flex;
                flex-direction: column;
            }

            .ud-messstation-settings h2 {
                margin-top: 0em;
                padding-bottom: 0px;
            }

            .ud-messstation-settings h3 {
                margin-bottom: 1em;
                font-size: 13px;
                color: #3c434a;
                margin-top: 0;
            }

            .ud-messstation-settings .ud-description {
                margin: 1em 0 0;
                color: #666;
            }

            .ud-messstation-settings .flex-rows {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
            }

            .ud-messstation-settings .flex-rows>div {
                flex: 1 1 200px;
                min-width: 180px;
            }
        </style>

    </div>
<?php
}

// Formularverarbeitung (über admin-post.php)
add_action('admin_post_ud_messstation_save_settings', function () {
    if (!current_user_can('manage_options') || !check_admin_referer('ud_messstation_save_settings')) {
        wp_die('Nicht erlaubt');
    }

    // Reset-Button gedrückt?
    if (isset($_POST['ud_messstation_reset'])) {
        delete_option('ud_messstation_json_dir');
        delete_option('ud_messstation_key_labels');
        add_settings_error('ud_messstation_settings', 'zurueckgesetzt', 'Alle Einstellungen wurden zurückgesetzt.', 'updated');
        wp_redirect(admin_url('options-general.php?page=ud_messstation_settings&updated=true'));
        exit;
    }

    $wp_content = WP_CONTENT_DIR;
    $new_dir = sanitize_file_name($_POST['new_dir'] ?? '');
    $selected_dir = sanitize_file_name($_POST['json_dir'] ?? '');

    if (!empty($new_dir)) {
        $full_path = $wp_content . '/' . $new_dir;
        if (!is_dir($full_path)) {
            wp_mkdir_p($full_path);
        }
        update_option('ud_messstation_json_dir', $new_dir);
    } elseif (!empty($selected_dir)) {
        update_option('ud_messstation_json_dir', $selected_dir);
    }

    





    wp_redirect(admin_url('options-general.php?page=ud_messstation_settings&updated=true'));
    exit;
});

