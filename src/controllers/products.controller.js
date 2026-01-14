import ProductsModel from "../models/products.model.js";

class Products {
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
            const result = await ProductsModel.create(data);
            res.status(201).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async readAll(req, res) {
        try {
            const results = await ProductsModel.findAll();
            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async readOne(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductsModel.findById(id);
            if (!result)
                return res
                    .status(404)
                    .json({ message: "Producto no encontrado" });
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await ProductsModel.update(id, data);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async replace(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await ProductsModel.replace(id, data);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const result = await ProductsModel.delete(id);
            if (!result)
                return res
                    .status(404)
                    .json({ message: "Producto no encontrado" });
            return res.sendStatus(204);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default new Products();
