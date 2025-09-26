<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "optica_barba_bd";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer el conjunto de caracteres a UTF-8
$conn->set_charset("utf8");
?>