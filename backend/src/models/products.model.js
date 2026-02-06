import BaseModel from "../BaseModel.js";
import SalesNotesModel from "./salesNotes.model.js";

class ProductsModel extends BaseModel {
    constructor() {
        // table name and columns must match the DB schema (see src/db/db.sql)
        super("product", [
            "id",
            "id_sales_note",
            "id_calibration",
            "name",
            "description",
            "value",
            "is_deleted",
        ]);

        this.schema = {
            id: "number",
            id_sales_note: "number",
            id_calibration: "number",
            name: "string",
            description: "string",
            value: "number",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            id_sales_note: null,
            id_calibration: null,
            name: "",
            description: "",
            value: 0,
            is_deleted: false,
        };

        this.foreignKeys = {
            id_sales_note: {
                model: () => SalesNotesModel,
                refColumn: "id",
                refTable: "sales_notes",
            },
        };
    }
}

export default new ProductsModel();
