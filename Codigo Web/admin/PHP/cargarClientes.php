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

$where = '';
if($campoBuscar != null){
    $where = "Where (";
    $cont = count($columnas);
    for($i = 0; $i < $cont; $i++){
        $where .= $columnas[$i] . " LIKE '%" . $campoBuscar . "%' OR ";
    }
    $where = substr_replace($where, "", -3);
    $where .= ")";
}

$registros = isset($_POST['registros']) ? $conn->real_escape_string($_POST['registros']) : 0;
$limit = '';
if($registros != 0){
    $limit = " LIMIT $registros";
}


$sql = "SELECT " . implode(", ", $columnas) . " FROM $tabla $where $limit";
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