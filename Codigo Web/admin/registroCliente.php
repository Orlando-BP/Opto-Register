<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registro de Cliente</title>
    <style>
        form {
            max-width: 400px;
            margin: 40px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #f9f9f9;
        }
        label {
            display: block;
            margin-top: 15px;
        }
        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="number"]{
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            box-sizing: border-box;
        }
        button {
            margin-top: 20px;
            padding: 10px 20px;
        }
    </style>
</head>
<body>
    <form name="registroCliente" action="procesarRegistroCliente.php" method="post">
        <h2>Registro de Cliente</h2>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>

        <label for="telefono">Teléfono:</label>
        <input type="tel" id="telefono" name="telefono" required pattern="[0-9]{10,15}" title="Ingrese un número válido">

        <label for="correo">Correo:</label>
        <input type="email" id="correo" name="correo" required>

        <label for="domicilio">Domicilio:</label>
        <input type="text" id="domicilio" name="domicilio" required>

        <label for="edad">Edad:</label>
        <input type="number" id="edad" name="edad" required>

        <h2>Graduacion</h2>
        <!-- Datos de ojo derecho --> 

    <label for="right_SP">right_SP:</label>
    <input type="number" id="right_SP" name="right_SP" step="any" required>

    <label for="right_CYL">right_CYL:</label>
    <input type="number" id="right_CYL" name="right_CYL" step="any" required>

    <label for="right_Axis">right_Axis:</label>
    <input type="number" id="right_Axis" name="right_Axis" step="any" required>
    <!-- Datos de ojo izquierdo -->
    <label for="left_SP">left_SP:</label>
    <input type="number" id="left_SP" name="left_SP" step="any" required>

    <label for="left_CYL">left_CYL:</label>
    <input type="number" id="left_CYL" name="left_CYL" step="any" required>

    <label for="left_Axis">left_Axis:</label>
    <input type="number" id="left_Axis" name="left_Axis" step="any" required>

        <button type="submit">Registrar</button>
    </form>
</body>
</html>