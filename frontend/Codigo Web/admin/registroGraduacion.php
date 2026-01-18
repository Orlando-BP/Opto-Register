<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Registro de Graduaciones</title>
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
        input[type="number"] {
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
    <form action="procesarRegistroGraduacion.php" method="post">
        <h2>Registro de Graduaciones</h2>
        <!-- Datos de ojo derecho --> 
        <label for="right_SP">right_SP:</label>
        <input type="number" id="right_SP" name="right_SP" required>

        <label for="right_CYL">right_CYL:</label>
        <input type="number" id="right_CYL" name="right_CYL" required>

        <label for="right_Axis">right_Axis:</label>
        <input type="number" id="right_Axis" name="right_Axis" required>
        <!-- Datos de ojo izquierdo -->
        <label for="left_SP">left_SP:</label>
        <input type="number" id="left_SP" name="left_SP" required>

        <label for="left_CYL">left_CYL:</label>
        <input type="number" id="left_CYL" name="left_CYL" required>

        <label for="left_Axis">left_Axis:</label>
        <input type="number" id="left_Axis" name="left_Axis" required>

        <label for="edad">Edad:</label>
        <input type="number" id="edad" name="edad" required>

        <button type="submit">Registrar</button>
    </form>
</body>
</html>