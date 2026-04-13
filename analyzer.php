<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$url = $_GET['url'] ?? '';
if (!$url) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Falta la URL']);
    exit;
}

if (!preg_match('#^https?://#i', $url)) {
    $url = 'https://' . $url;
}

if (!filter_var($url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'URL inválida']);
    exit;
}

$contextHeaders = [
    'User-Agent: Mozilla/5.0 (compatible; WebAnalyzer/1.0; +https://example.com)',
    'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language: es-ES,es;q=0.9,en;q=0.8',
    'Cache-Control: no-cache',
    'Pragma: no-cache'
];

$html = '';
$status = 0;
$error = '';

if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_CONNECTTIMEOUT => 12,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_HTTPHEADER => $contextHeaders,
        CURLOPT_ENCODING => '',
    ]);
    $html = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($html === false) {
        $error = curl_error($ch);
    }
    curl_close($ch);
}

if ((!$html || strlen(trim($html)) < 80) && ini_get('allow_url_fopen')) {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => implode("\r\n", $contextHeaders),
            'timeout' => 20,
            'ignore_errors' => true,
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ]
    ]);
    $fallback = @file_get_contents($url, false, $context);
    if ($fallback !== false && strlen(trim($fallback)) > 80) {
        $html = $fallback;
        $status = $status ?: 200;
    }
}

if (!$html || strlen(trim($html)) < 80) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'status' => $status,
        'error' => $error ?: 'No se pudo leer el HTML del sitio remoto.'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

echo json_encode([
    'ok' => true,
    'status' => $status ?: 200,
    'html' => $html,
    'url' => $url,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
