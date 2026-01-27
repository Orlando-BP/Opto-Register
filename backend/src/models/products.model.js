import BaseModel from "../BaseModel.js";
import SalesNotesModel from "./salesNotes.model.js";

class ProductsModel extends BaseModel {
    constructor() {
        super("Products", [
            "id",
            "id_note",
            "type",
            "material",
            "frame",
            "color",
            "size",
            "observations",
            "is_deleted"
        ]);

        this.schema = {
            id: "number",
            id_note: "number",
            type: "string",
            material: "string",
            frame: "string",
            color: "string",
            size: "string",
            observations: "string",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            id_note: null,
            type: "",
            material: "",
            frame: "",
            color: "",
            size: "",
            observations: "",
            is_deleted: false,
        };

        this.foreignKeys = {
            id_note: {
                model: () => SalesNotesModel,
                refColumn: "id",
                refTable: "Sales_Notes",
            },
        };
    }
}

export default new ProductsModel();
