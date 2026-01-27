import CalibrationsService from "../services/calibrations.service.js";
import { ModelValidationError } from "../BaseModel.js";
import ClientsService from "../services/clients.service.js";

class Calibrations {
    constructor() {
        this.create = this.create.bind(this);
        this.readAll = this.readAll.bind(this);
        this.readOne = this.readOne.bind(this);
        this.update = this.update.bind(this);
        this.replace = this.replace.bind(this);
        this.delete = this.delete.bind(this);
    }

    async create(req, res) {
        try {
            const data = req.body;
            const result = await CalibrationsService.create(data);
            res.status(201).json({ status: "201", message: "Created", data: result });
        } catch (error) {
            console.error(error);
            if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
                return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
            }
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async readAll(req, res) {
        try {
            const filters = req.body && typeof req.body === "object" ? req.body : {};
            const results = await CalibrationsService.findAll(filters);
            const clients = await ClientsService.findAll();
            const data = results.map((item) => ({
                id: item.id,
                idClient: item.id_client,
                clientName: clients.find(client => client.id === item.id_client)?.name || null,
                age: item.age,
                right_sp: item.right_sp,
                right_cyl: item.right_cyl,
                right_axis: item.right_axis,
                left_sp: item.left_sp,
                left_cyl: item.left_cyl,
                left_axis: item.left_axis,
                registration_date: item.registration_date,
                is_deleted: item.is_deleted,
            }));
            res.json({ status: "200", message: "OK", data: data });
        } catch (error) {
            console.error(error);
            if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
                return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
            }
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async readOne(req, res) {
        try {
            const { id } = req.params;
            const filters = req.body && typeof req.body === "object" ? req.body : {};
            const hasFilters = Object.keys(filters).length > 0;
            let result = null;
            if (hasFilters) {
                result = await CalibrationsService.findOneByWhere(filters);
            } else {
                result = await CalibrationsService.findById(id);
            }
            if (!result)
                return res
                    .status(404)
                    .json({ status: "404", message: "Calibración no encontrada", data: null });
            res.json({ status: "200", message: "OK", data: result });
        } catch (error) {
            console.error(error);
            if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
                return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
            }
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await CalibrationsService.update(id, data);
            res.json({ status: "200", message: "Updated", data: result });
        } catch (error) {
            console.error(error);
            if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
                return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
            }
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async replace(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await CalibrationsService.replace(id, data);
            res.json({ status: "200", message: "Replaced", data: result });
        } catch (error) {
            console.error(error);
            if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
                return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
            }
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await CalibrationsService.delete(id);
            if (!result)
                return res
                    .status(404)
                    .json({ status: "404", message: "Calibración no encontrada", data: null });
            return res.status(200).json({ status: "200", message: "Deleted", data: null });
        } catch (error) {
            console.error(error);
            if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
                return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
            }
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }
}

export default new Calibrations();
