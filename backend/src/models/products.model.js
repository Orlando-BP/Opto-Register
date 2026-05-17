import BaseModel from "../BaseModel.js";
import SalesNotesModel from "./salesNotes.model.js";

class ProductsModel extends BaseModel {
    constructor() {
        // table name and columns must match the DB schema (see src/db/db.sql)
        super("product", [
            "id",
            "name",
            "description",
            "is_deleted",
        ]);

        this.schema = {
            id: "number",
            name: "string",
            description: "string",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            name: "",
            description: "",
            is_deleted: false,
        };

        this.relations = {
            ProductsNoteSale: {
                type: "hasMany",
                model: () => ProductsNoteSaleModel,
                foreignKey: "id_product",
                localKey: "id",
                as: "ProductsNoteSale",
            },
        };
    }
}

export default new ProductsModel();
