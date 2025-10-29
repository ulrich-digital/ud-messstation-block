<?php
defined('ABSPATH') || exit;

/**
 * Registriert den Block `ud/messstation-block` über block.json.
 */


function ud_messstation_register_block() {
    register_block_type(
        __DIR__ . '/../',
        [
            'render_callback' => 'ud_messstation_render',
        ]
    );
}
add_action('init', 'ud_messstation_register_block');





add_action('wp_enqueue_scripts', function () {
    if (has_block('ud/messstation-block')) {
        wp_enqueue_script(
            'raphael',
            plugin_dir_url(__DIR__) . 'assets/js/raphael-2.1.4.min.js',
            [],
            null,
            true
        );
        wp_enqueue_script(
            'justgage',
            plugin_dir_url(__DIR__) . 'assets/js/justgage.js',
            [],
            null,
            true
        );


        wp_enqueue_script(
            'chart',
            plugin_dir_url(__DIR__) . 'assets/js/chart.umd.min.js',
            [],
            null,
            true
        );

        wp_enqueue_script(
            'chartjs-adapter-date-fns',
            plugin_dir_url(__DIR__) . 'assets/js/chartjs-adapter-date-fns.bundle.min.js',
            [],
            null,
            true
        );

        wp_enqueue_script(
            'ud-waterlevel-and-discharge-chart',
            plugin_dir_url(__DIR__) . 'assets/js/ud-waterlevel-and-discharge-chart.js',
            [],
            null,
            true
        );



        wp_enqueue_script(
            'ud-dangerlevel-chart',
            plugin_dir_url(__DIR__) . 'assets/js/ud-dangerlevel-chart.js',
            [],
            null,
            true
        );

    }
});


add_action('enqueue_block_editor_assets', function () {
    // Nur im Block-Editor
    if (!function_exists('get_current_screen')) return;
    $screen = get_current_screen();
    if (!$screen || !$screen->is_block_editor()) return;

    wp_enqueue_script('raphael', plugin_dir_url(__DIR__) . 'assets/js/raphael-2.1.4.min.js', [], null, true);
    wp_enqueue_script('justgage', plugin_dir_url(__DIR__) . 'assets/js/justgage.js', ['raphael'], null, true);

    // Falls deine Editor-Preview Chart.js braucht (hier nur, wenn nötig)
    wp_enqueue_script('chart', plugin_dir_url(__DIR__) . 'assets/js/chart.umd.min.js', [], null, true);
    wp_enqueue_script('chartjs-adapter-date-fns', plugin_dir_url(__DIR__) . 'assets/js/chartjs-adapter-date-fns.bundle.min.js', ['chart'], null, true);


    wp_enqueue_script('ud-waterlevel-and-discharge-chart', plugin_dir_url(__DIR__) . 'assets/js/ud-waterlevel-and-discharge-chart.js', [], null, true);
    wp_enqueue_script('ud-dangerlevel-chart', plugin_dir_url(__DIR__) . 'assets/js/ud-dangerlevel-chart.js', [], null, true);

    // Dein Editor-spezifisches Script kann optional hier rein (wenn du eines nutzt)
    // wp_enqueue_script('ud-messstation-editor', plugin_dir_url(__DIR__) . 'assets/js/ud-messstation-editor.js', ['justgage','wp-edit-post','wp-element'], null, true);
});