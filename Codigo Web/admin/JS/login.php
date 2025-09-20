<?php
session_start();
header('Content-Type: application/json');

// Datos de conexión a MySQL
$host = "localhost";
$db = "optica_barba_bd";
$user = "root";
$pass = "";
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$user = $data['username'] ?? '';
$password = $data['password'] ?? '';

$stmt = $conn->prepare("SELECT password FROM admins WHERE user = ? AND password = ?");
$stmt->bind_param("ss", $user, $password);
$stmt->execute();
$result = $stmt->get_result();


if ($result->num_rows > 0) {
    $_SESSION['user'] = $user;
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}

$stmt->close();
$conn->close();