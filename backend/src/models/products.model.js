import BaseModel from "../BaseModel.js";
import SalesNotesModel from "./salesNotes.model.js";

class ProductsModel extends BaseModel {
    constructor() {
        super("Products", [
            "id",
            "idNote",
            "type",
            "material",
            "frame",
            "color",
            "size",
            "observations",
        ]);

        this.schema = {
            id: "number",
            idNote: "number",
            type: "string",
            material: "string",
            frame: "string",
            color: "string",
            size: "string",
            observations: "string",
        };

        this.attributes = {
            id: null,
            idNote: null,
            type: "",
            material: "",
            frame: "",
            color: "",
            size: "",
            observations: "",
        };

        this.foreignKeys = {
            idNote: {
                model: SalesNotesModel,
                refColumn: "id",
                refTable: "SalesNotes",
            },
        };
    }
}

export default new ProductsModel();
