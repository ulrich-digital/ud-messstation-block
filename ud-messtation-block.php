<?php
/**
 * Plugin Name:       UD Block: Messstation
 * Description:       Block zum Darstellen von Messwerten wie Temperatur, Wasserstand oder Gefahrenstufe aus einer JSON-Datei.
 * Version:           1.1.0
 * Author:            ulrich.digital gmbh
 * Author URI:        https://ulrich.digital/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ud-messstation-block
 */

defined('ABSPATH') || exit;

// Basis-Konstanten
define('UD_MESSBLOCK_VERSION', '0.1.0');
define('UD_MESSBLOCK_FILE', __FILE__);
define('UD_MESSBLOCK_DIR', plugin_dir_path(__FILE__));
define('UD_MESSBLOCK_URL', plugin_dir_url(__FILE__));
define('UD_MESSBLOCK_BASENAME', plugin_basename(__FILE__));


$includes = [
	//'includes/helpers.php',
	'includes/settings.php', 
	'includes/render.php', 
	'includes/block-register.php', // registriert den Block über block.json (und ggf. render_callback)
	'includes/rest-api.php', 
];

foreach ($includes as $rel) {
	$path = UD_MESSBLOCK_DIR . $rel;
	if (file_exists($path)) {
		require_once $path;
	}
}


/* =============================================================== *\
   Settings-Link in der Pluginliste hinzufügen
\* =============================================================== */
add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), function( $links ) {
    $settings_url = admin_url( 'options-general.php?page=ud_messstation_settings' );
    $settings_link = '<a href="' . esc_url( $settings_url ) . '">' . __( 'Einstellungen', 'ud-messstation-block' ) . '</a>';
    array_unshift( $links, $settings_link );
    return $links;
});

