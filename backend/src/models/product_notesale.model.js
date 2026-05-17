import BaseModel from "../BaseModel.js";
import SalesNotesModel from "./salesNotes.model.js";
import ProductsModel from "./products.model.js";
import CalibrationModel from "./calibrations.model.js";

class ProductsNoteSaleModel extends BaseModel {
    constructor() {
        // table name and columns must match the DB schema (see src/db/db.sql)
        super("product_notesale", [
            "id",
            "id_sales_note",
            "id_product",
            "id_calibration",
            "value",
            "quantity",
            "is_deleted",
        ]);

        this.schema = {
            id: "number",
            id_sales_note: "number",
            id_product: "number",
            id_calibration: "number",
            value: "number",
            quantity: "number",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            id_sales_note: null,
            id_product: null,
            id_calibration: null,
            value: 0,
            quantity: 0,
            is_deleted: false,
        };

        this.foreignKeys = {
            id_sales_note: {
                model: () => SalesNotesModel,
                refColumn: "id",
                refTable: "sales_notes",
            },
            id_product: {
                model: () => ProductsModel,
                refColumn: "id",
                refTable: "product",
            },
            id_calibration: {
                model: () => null, // Replace with actual CalibrationModel when available
                refColumn: "id",
                refTable: "calibration",
            },
        };

        this.relations = {
            Product: {
                type: "hasOne",
                model: () => ProductsModel,
                foreignKey: "id",
                localKey: "id_product",
                as: "Product",
            },
        };
    }
}

export default new ProductsNoteSaleModel();
