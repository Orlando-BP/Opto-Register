<?php
require 'conexion.php'; // Archivo de conexión a la base de datos

if (isset($_GET['id_cliente'])) {
    $id_cliente = $_GET['id_cliente'];

    // Obtener datos del cliente
    $query_cliente = "SELECT * FROM clientes WHERE id_cliente = ?";
    $stmt_cliente = $conn->prepare($query_cliente);
    $stmt_cliente->bind_param("i", $id_cliente);
    $stmt_cliente->execute();
    $result_cliente = $stmt_cliente->get_result();
    $cliente = $result_cliente->fetch_assoc();

    // Obtener notas de venta del cliente
    $query_notas = "SELECT * FROM notas_venta WHERE id_cliente = ?";
    $stmt_notas = $conn->prepare($query_notas);
    $stmt_notas->bind_param("i", $id_cliente);
    $stmt_notas->execute();
    $result_notas = $stmt_notas->get_result();
    
    $notas = [];
    while ($row = $result_notas->fetch_assoc()) {
        $nota_id = $row['id_nota'];
        
        // Obtener graduación de la nota
        $query_graduacion = "SELECT * FROM graduaciones WHERE id_nota = ?";
        $stmt_graduacion = $conn->prepare($query_graduacion);
        $stmt_graduacion->bind_param("i", $nota_id);
        $stmt_graduacion->execute();
        $result_graduacion = $stmt_graduacion->get_result();
        
        // Obtener productos de la nota
        $query_producto = "SELECT * FROM productos WHERE id_nota = ?";
        $stmt_producto = $conn->prepare($query_producto);
        $stmt_producto->bind_param("i", $nota_id);
        $stmt_producto->execute();
        $result_producto = $stmt_producto->get_result();
        
        $notas[] = [
            'nota' => $row,
            'graduacion' => $result_graduacion->fetch_assoc(),
            'producto' => $result_producto->fetch_assoc()
        ];
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultar Cliente</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-4">
        <h2 class="text-center">Consultar Cliente</h2>
        <?php if (isset($cliente)) { ?>
            <div class="card p-3">
                <h4>Datos del Cliente</h4>
                <p><strong>Nombre:</strong> <?= $cliente['nombre'] ?></p>
                <p><strong>Teléfono:</strong> <?= $cliente['telefono'] ?></p>
                <p><strong>Domicilio:</strong> <?= $cliente['domicilio'] ?></p>
            </div>

            <h4 class="mt-4">Notas de Venta</h4>
            <?php foreach ($notas as $nota) { ?>
                <div class="card mt-3 p-3">
                    <p><strong>Fecha de Expedición:</strong> <?= $nota['nota']['fecha_expedicion'] ?></p>
                    <p><strong>Precio Total:</strong> <?= $nota['nota']['precio_total'] ?></p>
                    <p><strong>Anticipo:</strong> <?= $nota['nota']['anticipo'] ?></p>
                    <p><strong>Resta:</strong> <?= $nota['nota']['resta'] ?></p>
                    
                    <h5>Graduación</h5>
                    <p><strong>Ojo Izquierdo - Lejos:</strong> <?= $nota['graduacion']['esf'] ?> / <?= $nota['graduacion']['cil'] ?> / <?= $nota['graduacion']['eje'] ?></p>
                    <p><strong>Ojo Izquierdo - Cerca:</strong> <?= $nota['graduacion']['esf'] ?> / <?= $nota['graduacion']['cil'] ?> / <?= $nota['graduacion']['eje'] ?></p>
                    <p><strong>Ojo Derecho - Lejos:</strong> <?= $nota['graduacion']['esf'] ?> / <?= $nota['graduacion']['cil_lejos_od'] ?> / <?= $nota['graduacion']['eje_lejos_od'] ?></p>
                    <p><strong>Ojo Derecho - Cerca:</strong> <?= $nota['graduacion']['esf_cerca_od'] ?> / <?= $nota['graduacion']['cil_cerca_od'] ?> / <?= $nota['graduacion']['eje_cerca_od'] ?></p>
                    
                    <h5>Producto</h5>
                    <p><strong>Tipo:</strong> <?= $nota['producto']['tipo'] ?></p>
                    <p><strong>Material:</strong> <?= $nota['producto']['material'] ?></p>
                    <p><strong>Armazón:</strong> <?= $nota['producto']['armazon'] ?></p>
                    <p><strong>Color:</strong> <?= $nota['producto']['color'] ?></p>
                    <p><strong>Tamaño:</strong> <?= $nota['producto']['tamano'] ?></p>
                    <p><strong>Observaciones:</strong> <?= $nota['producto']['observaciones'] ?></p>
                </div>
            <?php } ?>
        <?php } else { ?>
            <p class="text-danger">Cliente no encontrado.</p>
        <?php } ?>
    </div>
</body>
</html>