<?php
session_start();

// Credenciales de prueba
$usuarios = [
    'admin' => '1234',
    'usuario' => 'contraseña'
];

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (isset($usuarios[$username]) && $usuarios[$username] === $password) {
    $_SESSION['user'] = $username;
    header("Location: dashboard.php");
    exit();
} else {
    $_SESSION['error'] = "Usuario o contraseña incorrectos.";
    header("Location: index.php");
    exit();
}
?>
