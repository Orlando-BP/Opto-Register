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

$registros = isset($_POST['registros']) ? $conn->real_escape_string($_POST['registros']) : 10;

$pagina = isset($_POST['pagina']) ? $conn->real_escape_string($_POST['pagina']) : null;

if(!$pagina){
    $inicio = 0;
    $pagina = 1;
} else {
    $inicio = ($pagina - 1) * $registros;
}

$limit = " LIMIT $inicio, $registros";

$sql = "SELECT " . implode(", ", $columnas) . " FROM $tabla $where $limit";
$resultado = $conn->query($sql);
$numRegistros = $resultado->num_rows;

//Consultar el total de registros filtrados
$respuestaFiltro = $conn->query("SELECT COUNT($columnas[0]) AS num FROM $tabla $where ");
$registroFiltro = $respuestaFiltro->fetch_array();
$totalFiltro = $registroFiltro[0];

$respuestaTotal = $conn->query("SELECT COUNT($columnas[0]) FROM $tabla");
$registroTotal = $respuestaTotal->fetch_array();
$totalRegistros = $registroTotal[0];


$outPut = [];
$outPut['totalRegistros'] = $totalRegistros;
$outPut['totalFiltro'] = $totalFiltro;  
$outPut['data'] = '';
$outPut['paginacion'] = '';

if ($numRegistros > 0) {
    while ($fila = $resultado->fetch_assoc()) {
        $outPut['data'] .= "<tr>";
        foreach ($columnas as $columna) {
            $outPut['data'] .= "<td>" . htmlspecialchars($fila[$columna]) . "</td>";
        }
        $outPut['data'] .= "<td><a href=''>Editar</a></td>";
        $outPut['data'] .= "<td><a href=''>Eliminar</a></td>";
        $outPut['data'] .= "</tr>";
    }
} else {
    $outPut['data'] = "<tr><td colspan='" . (count($columnas) + 2) . "'>No se encontraron clientes.</td></tr>";
}

if($outPut['totalRegistros'] > 0){
    $totalPaginas = ceil($outPut['totalRegistros'] / $registros);
    $outPut['paginacion'] .= '<ul class="pagination">';

    // $numeroInicio = 1;
    // if(($pagina - 4) > 1){
    //     $numeroInicio = $pagina - 4;
    // }

    // $numeroFin = $numeroInicio + 9;

    // if($numeroFin > $totalPaginas){
    //     $numeroFin = $totalPaginas;
    // }
    $numeroInicio = max(1, $pagina - 4);
    $numeroFin = min($totalPaginas, $numeroInicio + 9);

    for($i = $numeroInicio; $i <= $numeroFin; $i++){
        if($i == $pagina){
            $outPut['paginacion'] .= '<li class="active"><a href="#" onclick="cargarClientes(' . $i . ')">' . $i . '</a></li>';
        } else {
            $outPut['paginacion'] .= '<li><a href="#" onclick="cargarClientes(' . $i . ')">' . $i . '</a></li>';
        }
    }
    $outPut['paginacion'] .= '</ul>';
}

echo json_encode($outPut, JSON_UNESCAPED_UNICODE);