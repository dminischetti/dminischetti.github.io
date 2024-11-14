<?php
    $code = isset($_GET['code']) ? $_GET['code'] : ''; // Get the 'code' parameter from the query string

    // Check if the 'code' parameter is not empty
    if (!empty($code)) {
        $baseURL = 'http://127.0.0.1:8082/dominic/php_files/podium.php';
        $authorizedUrl = $baseURL . '?' . http_build_query(['code' => $code]); // Build the authorized URL with the 'code' parameter
        echo $autorizedUrl;
        // Redirect the user's browser to the authorized URL
        // header("Location: $authorizedUrl");
        // exit; // Terminate further execution
    } else {
        echo "Code parameter is missing or empty.";
    }
