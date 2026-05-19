import SalesNotesService from "../services/salesNotes.service.js";
import ClientsService from "../services/clients.service.js";
import jwt from "jsonwebtoken";
import { ModelValidationError } from "../BaseModel.js";
import ProductsNoteSaleService from "../services/product_notesale.service.js";

class SalesNotes {
    constructor() {
        this.create = this.create.bind(this);
        this.readAll = this.readAll.bind(this);
        this.readAllCliente = this.readAllCliente.bind(this);
        this.readAllAdmin = this.readAllAdmin.bind(this);
        this.readOne = this.readOne.bind(this);
        this.update = this.update.bind(this);
        this.replace = this.replace.bind(this);
        this.delete = this.delete.bind(this);
    }

    async generarCodigoNota(date) {
        // Asegurar objeto Date
        const fecha = new Date(date);

        // Obtener partes de la fecha
        const year = fecha.getFullYear().toString().slice(-2); // 26
        const month = String(fecha.getMonth() + 1).padStart(2, "0"); // 05
        const day = String(fecha.getDate()).padStart(2, "0"); // 16

        // Prefijo YYMMDD
        const prefijo = `${year}${month}${day}`;

        // Buscar el último código del día
        const ultimaNota = await SalesNotesService.findOne({
            codigo: { $regex: `^${prefijo}` }
        })
            .sort({ codigo: -1 }) // obtiene el mayor
            .lean();

        let consecutivo = 1;

        if (ultimaNota) {
            // Obtener los últimos 4 dígitos
            const ultimoNumero = parseInt(
                ultimaNota.codigo.slice(-4),
                10
            );

            consecutivo = ultimoNumero + 1;
        }

        // Formatear consecutivo a 4 dígitos
        const consecutivoFormateado = String(consecutivo).padStart(4, "0");

        // Código final
        return `${prefijo}${consecutivoFormateado}`;
    }

    async create(req, res) {
        try {
            console.log("Creating sales note with data:", req.body);
            const { products, ...salesNoteData } = req.body;

            console.log("Extracted sales note data:", salesNoteData);
            console.log("Extracted products data:", products);
            const result = await SalesNotesService.create({
                ...salesNoteData,
            });

            const productsData = products.map((product) => ({
                id_sales_note: result.id,
                id_product: product.id,
                id_calibration: product.id_calibration ?? null,
                value: product.value,
                quantity: product.quantity,
            }));

            if (!Array.isArray(productsData) || productsData.length === 0) {
                return res.status(400).json({
                    status: "400",
                    message: "Debe incluir al menos un producto en la nota de venta.",
                });
            }

            const result2 = await ProductsNoteSaleService.create(productsData);

            

            if (!result || !result2) {
                return res.status(500).json({
                    status: "500",
                    message: "Error al crear la nota de venta.",
                });
            }

            res.status(200).json({
                status: "200",
                message: "Nota de venta creada exitosamente.",
                data: result,
            });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res.status(400).json({
                    status: "400",
                    message: error.message,
                    data: error.details ?? null,
                });
            }
            res.status(500).json({
                status: "500",
                message: "Error interno del servidor.",
                data: null,
            });
        }
    }

    async readAll(req, res) {
        try {
            const filters =
                req.body && typeof req.body === "object" ? req.body : {};
            const results = await SalesNotesService.findAll(filters);
            res.json({
                status: "200",
                message: "OK",
                data: {
                    results,
                },
            });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res.status(400).json({
                    status: "400",
                    message: error.message,
                    data: error.details ?? null,
                });
            }
            res.status(500).json({
                status: "500",
                message: "Internal server error",
                data: null,
            });
        }
    }

    async readAllCliente(req, res) {
        try {
            console.log("params:", req.params);
            const { id } = req.params;
            const filters = {
                id_client: Number(id),
            };
            const results = await SalesNotesService.findAll(filters);
            res.json({
                status: "200",
                message: "OK",
                data: {
                    results,
                },
            });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res.status(400).json({
                    status: "400",
                    message: error.message,
                    data: error.details ?? null,
                });
            }
            res.status(500).json({
                status: "500",
                message: "Internal server error",
                data: null,
            });
        }
    }

    async readAllAdmin(req, res) {
        try {
            const filters =
                req.body && typeof req.body === "object" ? req.body : {};

            const notas = await SalesNotesService.findAll({});
            const clients = await ClientsService.findAll({});
            res.json({
                status: "200",
                message: "OK",
                data: {
                    notas,
                    clients,
                },
            });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res.status(400).json({
                    status: "400",
                    message: error.message,
                    data: error.details ?? null,
                });
            }
            res.status(500).json({
                status: "500",
                message: "Internal server error",
                data: null,
            });
        }
    }

    async readOne(req, res) {
        try {
            const { id } = req.params;
            const filters =
                req.body && typeof req.body === "object" ? req.body : {};
            const hasFilters = Object.keys(filters).length > 0;
            let result = null;
            if (hasFilters) {
                result = await SalesNotesService.findOneByWhere(filters);
            } else {
                result = await SalesNotesService.findById(id);
            }
            if (!result)
                return res.status(404).json({
                    status: "404",
                    message: "Nota de venta no encontrada",
                    data: null,
                });
            res.json({
                status: "200",
                message: "OK",
                data: result,
            });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res.status(400).json({
                    status: "400",
                    message: error.message,
                    data: error.details ?? null,
                });
            }
            res.status(500).json({
                status: "500",
                message: "Internal server error",
                data: null,
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await SalesNotesService.update(id, data);
            res.json({ status: "200", message: "Updated", data: result });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res.status(400).json({
                    status: "400",
                    message: error.message,
                    data: error.details ?? null,
                });
            }
            res.status(500).json({
                status: "500",
                message: "Internal server error",
                data: null,
            });
        }
    }

    async replace(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await SalesNotesService.replace(id, data);
            res.json({ status: "200", message: "Replaced", data: result });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res.status(400).json({
                    status: "400",
                    message: error.message,
                    data: error.details ?? null,
                });
            }
            res.status(500).json({
                status: "500",
                message: "Internal server error",
                data: null,
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await SalesNotesService.delete(id);
            if (!result)
                return res.status(404).json({
                    status: "404",
                    message: "Nota de venta no encontrada",
                    data: null,
                });
            return res
                .status(200)
                .json({ status: "200", message: "Deleted", data: null });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res.status(400).json({
                    status: "400",
                    message: error.message,
                    data: error.details ?? null,
                });
            }
            res.status(500).json({
                status: "500",
                message: "Internal server error",
                data: null,
            });
        }
    }
}

export default new SalesNotes();
