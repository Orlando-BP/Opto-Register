<?php
// Incluir la conexión a la base de datos
require_once __DIR__ . '/conexion.php';

$columnas = [
    'id_cliente',
    'nombre',
    'telefono',
    'correo',
    'domicilio'
];
$tabla = 'clientes';

$campoBuscar = isset($_POST['buscar']) ? $conn->real_escape_string($_POST['buscar']) : null;

$sql = "SELECT " . implode(", ", $columnas) . " FROM $tabla";
$resultado = $conn->query($sql);
$numRegistros = $resultado->num_rows;

$html = '';

if ($numRegistros > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $html .= "<tr>";
        foreach ($columnas as $columna) {
            $html .= "<td>" . htmlspecialchars($fila[$columna]) . "</td>";
        }
        $html .= "<td><a href=''>Editar</a></td>";
        $html .= "<td><a href=''>Eliminar</a></td>";
        $html .= "</tr>";
    }
} else {
    $html = "<tr><td colspan='" . (count($columnas) + 2) . "'>No se encontraron clientes.</td></tr>";
}
echo json_encode($html, JSON_UNESCAPED_UNICODE);