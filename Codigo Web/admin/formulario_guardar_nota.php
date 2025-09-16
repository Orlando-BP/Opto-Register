<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Nota de Venta</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>
    <div class="container mt-4">
        <h2 class="text-center">Registro de Nota de Venta</h2>
        <form action="guardar_nota.php" method="POST">
            
            <!-- Selección o Registro de Cliente -->
            <fieldset class="border p-3 mb-3">
                <legend>Datos del Cliente</legend>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="buscar_cliente">Buscar Cliente:</label>
                        <input type="text" id="buscar_cliente" class="form-control" placeholder="Escriba para buscar...">
                        <div id="lista_clientes" class="list-group"></div>
                        <input type="hidden" id="id_cliente" name="id_cliente">
                    </div>
                </div>
                <div id="nuevoCliente">
                    <div class="row">
                        <div class="col-md-6">
                            <label for="nombre">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label for="telefono">Teléfono:</label>
                            <input type="text" id="telefono" name="telefono" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label for="domicilio">Domicilio:</label>
                            <input type="text" id="domicilio" name="domicilio" class="form-control">
                        </div>
                    </div>
                </div>
            </fieldset>

            <fieldset class="border p-3 mb-3">
                <legend>Datos de la Nota</legend>
                <div class="row">
                    <div class="col-md-4">
                        <label for="fecha_expedicion">Fecha de Expedición:</label>
                        <input type="date" id="fecha_expedicion" name="fecha_expedicion" class="form-control" required>
                    </div>
                    <div class="col-md-4">
                        <label for="fecha_entrega">Fecha Estimada de Entrega:</label>
                        <input type="date" id="fecha_entrega" name="fecha_entrega" class="form-control">
                    </div>
                    <div class="col-md-4">
                        <label for="precio_total">Precio Total:</label>
                        <input type="number" step="0.01" id="precio_total" name="precio_total" class="form-control" required>
                    </div>
                    <div class="col-md-4">
                        <label for="anticipo">Anticipo:</label>
                        <input type="number" step="0.01" id="anticipo" name="anticipo" class="form-control" required>
                    </div>
                    <div class="col-md-4">
                        <label for="resta">Resta:</label>
                        <input type="number" step="0.01" id="resta" name="resta" class="form-control" required>
                    </div>
                </div>
            </fieldset>

            <!-- Graduación -->
            <fieldset class="border p-3 mb-3">
                <legend>Graduación</legend>
                <div class="row">
                    <div class="col-md-6">
                        <h5>Ojo Izquierdo</h5>
                        <label>Lejos:</label>
                        <div class="row">
                            <div class="col">
                                <input type="text" name="esf_lejos_oi" placeholder="Esf" class="form-control">
                            </div>
                            <div class="col">
                                <input type="text" name="cil_lejos_oi" placeholder="Cil" class="form-control">
                            </div>
                            <div class="col">
                                <input type="text" name="eje_lejos_oi" placeholder="Eje" class="form-control">
                            </div>
                        </div>
                        <label>Cerca:</label>
                        <div class="row">
                            <div class="col">
                                <input type="text" name="esf_cerca_oi" placeholder="Esf" class="form-control">
                            </div>
                            <div class="col">
                                <input type="text" name="cil_cerca_oi" placeholder="Cil" class="form-control">
                            </div>
                            <div class="col">
                                <input type="text" name="eje_cerca_oi" placeholder="Eje" class="form-control">
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5>Ojo Derecho</h5>
                        <label>Lejos:</label>
                        <div class="row">
                            <div class="col">
                                <input type="text" name="esf_lejos_od" placeholder="Esf" class="form-control">
                            </div>
                            <div class="col">
                                <input type="text" name="cil_lejos_od" placeholder="Cil" class="form-control">
                            </div>
                            <div class="col">
                                <input type="text" name="eje_lejos_od" placeholder="Eje" class="form-control">
                            </div>
                        </div>
                        <label>Cerca:</label>
                        <div class="row">
                            <div class="col">
                                <input type="text" name="esf_cerca_od" placeholder="Esf" class="form-control">
                            </div>
                            <div class="col">
                                <input type="text" name="cil_cerca_od" placeholder="Cil" class="form-control">
                            </div>
                            <div class="col">
                                <input type="text" name="eje_cerca_od" placeholder="Eje" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

           <!-- Datos del Producto -->
           <fieldset class="border p-3 mb-3">
                <legend>Datos del Producto</legend>
                <div class="row">
                    <div class="col-md-4">
                        <label for="tipo">Tipo:</label>
                        <input type="text" id="tipo" name="tipo" class="form-control" required>
                    </div>
                    <div class="col-md-4">
                        <label for="material">Material:</label>
                        <input type="text" id="material" name="material" class="form-control">
                    </div>
                    <div class="col-md-4">
                        <label for="armazon">Armazón:</label>
                        <input type="text" id="armazon" name="armazon" class="form-control">
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-md-4">
                        <label for="color">Color:</label>
                        <input type="text" id="color" name="color" class="form-control">
                    </div>
                    <div class="col-md-4">
                        <label for="tamano">Tamaño:</label>
                        <input type="text" id="tamano" name="tamano" class="form-control">
                    </div>
                    <div class="col-md-4">
                        <label for="observaciones">Observaciones:</label>
                        <textarea id="observaciones" name="observaciones" class="form-control"></textarea>
                    </div>
                </div>
            </fieldset>

            <!-- Botón de envío -->
            <div class="text-center">
                <button type="submit" class="btn btn-primary">Guardar Nota</button>
            </div>
        </form>
    </div>

    <script>
        $(document).ready(function() {
            $("#buscar_cliente").on("input", function() {
                let query = $(this).val();
                if (query.length > 1) {
                    $.ajax({
                        url: "buscar_cliente.php",
                        method: "POST",
                        data: { query: query },
                        success: function(data) {
                            $("#lista_clientes").html(data).show();
                        }
                    });
                } else {
                    $("#lista_clientes").hide();
                }
            });

            $(document).on("click", ".cliente-item", function() {
                let id = $(this).data("id");
                let nombre = $(this).text();
                $("#id_cliente").val(id);
                $("#buscar_cliente").val(nombre);
                $("#lista_clientes").hide();
                $("#nuevoCliente").hide();
            });

            $("#buscar_cliente").on("focus", function() {
                if ($("#id_cliente").val() === "") {
                    $("#nuevoCliente").show();
                }
            });
        });
    </script>
</body>
</html>
