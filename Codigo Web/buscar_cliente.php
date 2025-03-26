<?php
require 'conexion.php'; // Asegúrate de tener este archivo con la conexión a la base de datos

if (isset($_POST['query'])) {
    $query = "%" . $_POST['query'] . "%";
    $sql = "SELECT id_cliente, nombre FROM clientes WHERE nombre LIKE ? LIMIT 10";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $query);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo '<a href="#" class="list-group-item list-group-item-action cliente-item" data-id="' . $row['id_cliente'] . '">' . htmlspecialchars($row['nombre']) . '</a>';
        }
    } else {
        echo '<p class="list-group-item">No se encontraron resultados</p>';
    }
    
    $stmt->close();
    $conn->close();
}
?>