<?php
add_action('rest_api_init', function () {
    // Endpoint für Dateien
    register_rest_route('ud/messstation', '/scan-json', [
        'methods'  => 'GET',
        'callback' => function () {
            $selected = get_option('ud_messstation_json_dir');
            $dir = WP_CONTENT_DIR . '/' . ltrim($selected, '/');
            if (!get_option('ud_messstation_json_dir')) {
                return new WP_REST_Response(['error' => 'no_dir_selected'], 200);
            }

            $base_url = content_url('/' . ltrim($selected, '/'));

            if (!is_dir($dir)) {
                return new WP_REST_Response([], 200);
            }

            $files = glob($dir . '/*.json');
            $results = [];

            foreach ($files as $file) {
                $filename = basename($file);
                $results[] = [
                    'label' => $filename,
                    'value' => '/wp-content/' . $selected . '/' . $filename,
                ];
            }

            return new WP_REST_Response($results, 200);
        },
        'permission_callback' => '__return_true',
    ]);
    // Endpoint für Key-Übersetzungen
    register_rest_route('ud/messstation', '/key-labels', [
        'methods'  => 'GET',
        'callback' => function () {
            $json = get_option('ud_messstation_key_labels', '{}');
            $data = json_decode($json, true);
            if (!is_array($data)) {
                $data = [];
            }
            return rest_ensure_response($data);
        },
        'permission_callback' => '__return_true',
    ]);
});
