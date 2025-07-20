<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "optica_barba_bd";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$mensaje = $_POST['mensaje'];

$sql = "INSERT INTO correos (nombre, email, mensaje) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $nombre, $email, $mensaje);

if ($stmt->execute()) {
    echo "<script>alert('Mensaje enviado con éxito'); window.location.href='contacto.html';</script>";
} else {
    echo "Error al guardar el mensaje: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
