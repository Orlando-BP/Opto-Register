<?php
require 'conexion.php'; // Conexión a la base de datos

function validarDato($dato, $tipo) {
    if ($tipo === 'string') {
        return htmlspecialchars(trim($dato));
    } elseif ($tipo === 'float') {
        return filter_var($dato, FILTER_VALIDATE_FLOAT);
    } elseif ($tipo === 'int') {
        return filter_var($dato, FILTER_VALIDATE_INT);
    }
    return null;
}

// Verificar si se seleccionó un cliente existente o se registrará uno nuevo
if (!empty($_POST['id_cliente']) && validarDato($_POST['id_cliente'], 'int')) {
    $id_cliente = $_POST['id_cliente'];
} else {
    $nombre = validarDato($_POST['nombre'], 'string');
    $telefono = validarDato($_POST['telefono'], 'string');
    $domicilio = validarDato($_POST['domicilio'], 'string');
    
    if ($nombre && $telefono && $domicilio) {
        $stmt = $conn->prepare("INSERT INTO Clientes (nombre, telefono, domicilio) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nombre, $telefono, $domicilio);
        $stmt->execute();
        $id_cliente = $stmt->insert_id;
        $stmt->close();
    } else {
        die("Error: Datos del cliente no válidos");
    }
}

// Validar datos de la nota de venta
$fecha_expedicion = $_POST['fecha_expedicion'];
$fecha_entrega = $_POST['fecha_entrega'];
$precio_total = validarDato($_POST['precio_total'], 'float');
$anticipo = validarDato($_POST['anticipo'], 'float');
$resta = validarDato($_POST['resta'], 'float');

if ($fecha_expedicion && $precio_total !== false && $anticipo !== false && $resta !== false) {
    $stmt = $conn->prepare("INSERT INTO Notas_Venta (id_cliente, fecha_expedicion, fecha_entrega, precio_total, anticipo, resta) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issddd", $id_cliente, $fecha_expedicion, $fecha_entrega, $precio_total, $anticipo, $resta);
    $stmt->execute();
    $id_nota = $stmt->insert_id;
    $stmt->close();
} else {
    die("Error: Datos de la nota de venta no válidos");
}

// Insertar la graduación visual
$ojos = ['OD' => 'Ojo Derecho', 'OI' => 'Ojo Izquierdo'];
$distancias = ['Lejos', 'Cerca'];
$stmt = $conn->prepare("INSERT INTO Graduaciones (id_nota, ojo, distancia, esf, cil, eje) VALUES (?, ?, ?, ?, ?, ?)");
foreach ($ojos as $ojo => $nombre_ojo) {
    foreach ($distancias as $distancia) {
        $esf = validarDato($_POST['esf_' . $ojo . '_' . $distancia] ?? NULL, 'float');
        $cil = validarDato($_POST['cil_' . $ojo . '_' . $distancia] ?? NULL, 'float');
        $eje = validarDato($_POST['eje_' . $ojo . '_' . $distancia] ?? NULL, 'int');
        $stmt->bind_param("issddd", $id_nota, $ojo, $distancia, $esf, $cil, $eje);
        $stmt->execute();
    }
}
$stmt->close();

// Insertar detalles del producto
$tipo = validarDato($_POST['tipo'], 'string');
$material = validarDato($_POST['material'], 'string');
$armazon = validarDato($_POST['armazon'], 'string');
$color = validarDato($_POST['color'], 'string');
$tamano = validarDato($_POST['tamano'], 'string');
$observaciones = validarDato($_POST['observaciones'], 'string');

if ($tipo && $material && $armazon && $color && $tamano) {
    $stmt = $conn->prepare("INSERT INTO Productos (id_nota, tipo, material, armazon, color, tamano, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $id_nota, $tipo, $material, $armazon, $color, $tamano, $observaciones);
    $stmt->execute();
    $stmt->close();
} else {
    die("Error: Datos del producto no válidos");
}

// Redirigir a una página de éxito
header("Location: exito.php");
exit;
?>
