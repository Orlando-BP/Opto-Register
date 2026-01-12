<?php

// Incluir la conexión a la base de datos
require_once __DIR__ . '/conexion.php';

// Recibir los datos del formulario de registro de cliente

$nombre = isset($_POST['nombre']) ? $_POST['nombre'] : '';
$telefono = isset($_POST['telefono']) ? $_POST['telefono'] : '';
$correo = isset($_POST['correo']) ? $_POST['correo'] : '';
$domicilio = isset($_POST['domicilio']) ? $_POST['domicilio'] : '';
$edad = isset($_POST['edad']) ? $_POST['edad'] : '';

// Datos de graduación
$right_SP = isset($_POST['right_SP']) ? $_POST['right_SP'] : '';
$right_CYL = isset($_POST['right_CYL']) ? $_POST['right_CYL'] : '';
$right_Axis = isset($_POST['right_Axis']) ? $_POST['right_Axis'] : '';
$left_SP = isset($_POST['left_SP']) ? $_POST['left_SP'] : '';
$left_CYL = isset($_POST['left_CYL']) ? $_POST['left_CYL'] : '';
$left_Axis = isset($_POST['left_Axis']) ? $_POST['left_Axis'] : '';

// Insertar datos en la tabla clientes
$sql = "INSERT INTO clientes (nombre, telefono, correo, domicilio) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if ($stmt) {
	$stmt->bind_param("ssss", $nombre, $telefono, $correo, $domicilio);
	if ($stmt->execute()) {
		echo "Cliente registrado correctamente.";
		// Obtener el id_cliente recién insertado
		$id_cliente = $conn->insert_id;
		echo "<br>ID del cliente registrado: " . $id_cliente;
	} else {
		echo "Error al registrar cliente: " . $stmt->error;
	}
	$stmt->close();
} else {
	echo "Error en la preparación de la consulta: " . $conn->error;
}
if (isset($id_cliente)) {
    $fecha_registro = date('Y-m-d');
    $sql_graduacion = "INSERT INTO graduaciones (id_cliente, edad, right_SP, right_CYL, right_Axis, left_SP, left_CYL, left_Axis, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_graduacion = $conn->prepare($sql_graduacion);
    if ($stmt_graduacion) {
        $stmt_graduacion->bind_param(
            "iisssssss",
            $id_cliente,
            $edad,
            $right_SP,
            $right_CYL,
            $right_Axis,
            $left_SP,
            $left_CYL,
            $left_Axis,
            $fecha_registro
        );
        if ($stmt_graduacion->execute()) {
            echo "<br>Graduación registrada correctamente.";
        } else {
            echo "<br>Error al registrar graduación: " . $stmt_graduacion->error;
        }
        $stmt_graduacion->close();
    } else {
        echo "<br>Error en la preparación de la consulta de graduación: " . $conn->error;
    }
}
?>