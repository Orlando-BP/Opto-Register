<?php
header('Content-Type: application/json');

$host = "localhost";
$db = "optica_barba_bd";
$user = "root";
$pass = "";

$conn = @new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "error" => $conn->connect_error,
        "errno" => $conn->connect_errno
    ]);
    exit;
} else {
    echo json_encode([
        "success" => true,
        "mensaje" => "Conexión exitosa"
    ]);
}
