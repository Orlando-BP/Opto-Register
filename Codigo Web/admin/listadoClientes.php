<?php

// conexión a la base de datos
require_once __DIR__ . '/PHP/conexion.php';

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado de Clientes</title>
    <style>
        .control{
            max-width: 400px;
            margin: 40px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #f9f9f9;
        }
        h2{
            text-align: center;
        }
        label{
            display: block;
            margin-top: 15px;
        }
        input {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            box-sizing: border-box;
        }
        table,th, td {
            border: 1px solid black;
            
        }
        table{
            border-collapse: collapse;
            width: 80%;
            margin: 40px auto;
        }
        
    </style>
</head>
<body>

    <h2>Listado de Clientes</h2>
    <div class="control"> 
        <label>Buscar: </label>
        <input type="text" id="buscar" placeholder="Ingrese nombre, correo o teléfono">
        <label>Mostrar: </label>
        <select id="numRegistros">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="0">Todos</option>
        </select>
        <Label>Registros </Label>
    </div>
    <p></p>
    <table>
        <thead>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Domicilio</th>
            <th></th>
            <th></th>
        </thead>
        <tbody id="contenidoTabla">
            

        </tbody>
    </table>
    <script>
        // Cargar los clientes al cargar la página
        cargarClientes()

        document.getElementById('buscar').addEventListener('keyup', cargarClientes)
        document.getElementById('numRegistros').addEventListener('change', cargarClientes)

        function cargarClientes(){
            let campoBuscar = document.getElementById('buscar').value
            let numRegistros = document.getElementById('numRegistros').value
            let contenidoTabla = document.getElementById('contenidoTabla')
            let url = 'PHP/cargarClientes.php'
            let formData = new FormData()
            formData.append('buscar', campoBuscar)
            formData.append('registros', numRegistros)

            fetch(url, {
                method: 'POST',
                body: formData
            }).then(response => response.json())
            .then(data => {
                contenidoTabla.innerHTML = data
            }).catch(error => console.log('Error:', error))
        }

    </script>
</body>
</html>