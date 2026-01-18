import ClientsModel from "../models/clients.model.js";

class Clients {
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
            const result = await ClientsModel.create(data);
            res.status(201).json({ status: "201", message: "Created", data: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async readAll(req, res) {
        try {
            const results = await ClientsModel.findAll();
            res.json({ status: "200", message: "OK", data: results });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async readOne(req, res) {
        try {
            const { id } = req.params;
            const result = await ClientsModel.findById(id);
            if (!result)
                return res
                    .status(404)
                    .json({ status: "404", message: "Usuario no encontrado", data: null });
            res.json({ status: "200", message: "OK", data: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await ClientsModel.update(id, data);
            res.json({ status: "200", message: "Updated", data: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async replace(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await ClientsModel.replace(id, data);
            res.json({ status: "200", message: "Replaced", data: result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await ClientsModel.delete(id);
            if (!result)
                return res
                    .status(404)
                    .json({ status: "404", message: "Usuario no encontrado", data: null });
            return res.status(200).json({ status: "200", message: "Deleted", data: null });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "500", message: "Internal server error", data: null });
        }
    }
}

export default new Clients();
