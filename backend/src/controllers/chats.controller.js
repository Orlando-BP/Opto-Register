import ChatsService from "../services/chats.service.js";
import { ModelValidationError } from "../BaseModel.js";

const numericKeys = ["id", "idClient", "isDeleted"];

const normalizeFilters = (payload = {}) => {
    const filters = { ...payload };
    for (const key of numericKeys) {
        if (filters[key] === undefined) continue;
        if (key === "isDeleted") {
            if (filters[key] === "true" || filters[key] === true)
                filters[key] = true;
            else if (filters[key] === "false" || filters[key] === false)
                filters[key] = false;
            continue;
        }
        const value = Number(filters[key]);
        if (!Number.isNaN(value)) filters[key] = value;
    }
    return filters;
};

class Chats {
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
            const result = await ChatsService.create(data);
            res.status(201).json({
                status: "201",
                message: "Created",
                data: result,
            });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res
                    .status(400)
                    .json({
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

    async readAll(req, res) {
        try {
            const baseFilters =
                req.body &&
                typeof req.body === "object" &&
                Object.keys(req.body).length > 0
                    ? req.body
                    : req.query;
            const filters = normalizeFilters(baseFilters || {});
            const results = await ChatsService.findAll(filters);
            res.json({ status: "200", message: "OK", data: results });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res
                    .status(400)
                    .json({
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
            const baseFilters =
                req.body &&
                typeof req.body === "object" &&
                Object.keys(req.body).length > 0
                    ? req.body
                    : req.query;
            const filters = normalizeFilters(baseFilters || {});
            const hasFilters = Object.keys(filters).length > 0;
            let result = null;
            if (hasFilters) {
                result = await ChatsService.findOneByWhere(filters);
            } else {
                result = await ChatsService.findById(id);
            }
            if (!result)
                return res
                    .status(404)
                    .json({
                        status: "404",
                        message: "Chat no encontrado",
                        data: null,
                    });
            res.json({ status: "200", message: "OK", data: result });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res
                    .status(400)
                    .json({
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
            const result = await ChatsService.update(id, data);
            res.json({ status: "200", message: "Updated", data: result });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res
                    .status(400)
                    .json({
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
            const result = await ChatsService.replace(id, data);
            res.json({ status: "200", message: "Replaced", data: result });
        } catch (error) {
            console.error(error);
            if (
                error instanceof ModelValidationError ||
                error?.name === "ModelValidationError"
            ) {
                return res
                    .status(400)
                    .json({
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
            const result = await ChatsService.delete(id);
            if (!result)
                return res
                    .status(404)
                    .json({
                        status: "404",
                        message: "Chat no encontrado",
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
                return res
                    .status(400)
                    .json({
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

export default new Chats();
