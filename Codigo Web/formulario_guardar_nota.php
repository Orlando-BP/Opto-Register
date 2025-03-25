<?php
require 'conexion.php'; // Asegúrate de tener un archivo para conectar a la BD

// Obtener lista de clientes existentes
$clientes = $conn->query("SELECT id_cliente, nombre FROM Clientes");
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar Nota de Venta</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<body class="container mt-4">
    <h2>Registrar Nota de Venta</h2>
    <form action="guardar_nota.php" method="POST">
        
        <!-- Selección o registro de cliente -->
        <div class="mb-3">
            <label class="form-label">Seleccionar Cliente:</label>
            <select name="id_cliente" class="form-select" id="selectCliente">
                <option value="">-- Cliente Nuevo --</option>
                <?php while ($cliente = $clientes->fetch_assoc()) { ?>
                    <option value="<?php echo $cliente['id_cliente']; ?>">
                        <?php echo $cliente['nombre']; ?>
                    </option>
                <?php } ?>
            </select>
        </div>
        
        <div id="nuevoCliente" style="display: none;">
            <h5>Datos del Nuevo Cliente</h5>
            <input type="text" name="nombre" class="form-control mb-2" placeholder="Nombre">
            <input type="text" name="telefono" class="form-control mb-2" placeholder="Teléfono">
            <textarea name="domicilio" class="form-control mb-2" placeholder="Domicilio"></textarea>
        </div>

        <!-- Datos de la Nota de Venta -->
        <h5>Datos de la Nota</h5>
        <input type="date" name="fecha_expedicion" class="form-control mb-2" required>
        <input type="date" name="fecha_entrega" class="form-control mb-2">
        <input type="number" step="0.01" name="precio_total" class="form-control mb-2" placeholder="Precio Total" required>
        <input type="number" step="0.01" name="anticipo" class="form-control mb-2" placeholder="Anticipo" required>
        <input type="number" step="0.01" name="resta" class="form-control mb-2" placeholder="Resta" required>

        <!-- Datos de la Graduación -->
        <h5>Graduación</h5>
        <?php $ojos = ['OD' => 'Ojo Derecho', 'OI' => 'Ojo Izquierdo']; ?>
        <?php $distancias = ['Lejos', 'Cerca']; ?>
        
        <?php foreach ($ojos as $ojo => $nombre_ojo) { ?>
            <h6><?php echo $nombre_ojo; ?></h6>
            <?php foreach ($distancias as $distancia) { ?>
                <div class="mb-2">
                    <label><?php echo "$distancia ($ojo)"; ?></label>
                    <input type="number" step="0.25" name="esf_<?php echo $ojo . '_' . $distancia; ?>" placeholder="ESF">
                    <input type="number" step="0.25" name="cil_<?php echo $ojo . '_' . $distancia; ?>" placeholder="CIL">
                    <input type="number" name="eje_<?php echo $ojo . '_' . $distancia; ?>" placeholder="EJE">
                </div>
            <?php } ?>
        <?php } ?>
        
        <!-- Datos del Producto -->
        <h5>Detalles del Producto</h5>
        <input type="text" name="tipo" class="form-control mb-2" placeholder="Tipo">
        <input type="text" name="material" class="form-control mb-2" placeholder="Material">
        <input type="text" name="armazon" class="form-control mb-2" placeholder="Armazón">
        <input type="text" name="color" class="form-control mb-2" placeholder="Color">
        <input type="text" name="tamano" class="form-control mb-2" placeholder="Tamaño">
        <textarea name="observaciones" class="form-control mb-2" placeholder="Observaciones"></textarea>
        
        <button type="submit" class="btn btn-primary">Guardar Nota</button>
    </form>

    <script>
        document.getElementById('selectCliente').addEventListener('change', function() {
            document.getElementById('nuevoCliente').style.display = this.value ? 'none' : 'block';
        });
    </script>
</body>
</html>