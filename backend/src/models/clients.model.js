import BaseModel from "../BaseModel.js";
import CalibrationsModel from "./calibrations.model.js";
import SalesNotesModel from "./salesNotes.model.js";

class ClientsModel extends BaseModel {
    constructor() {
        super("clients", ["id", "name", "phone", "email", "address", "is_deleted"]);

        this.schema = {
            id: "number",
            name: "string",
            phone: "string",
            email: "string",
            address: "string",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            name: "",
            phone: "",
            email: "",
            address: "",
            is_deleted: false,
        };

        this.relations = {
            Calibration: {
                type: "hasOne",
                model: () => CalibrationsModel,
                foreignKey: "id_client",
                localKey: "id",
                as: "Calibration",
            },
            SalesNotes: {
                type: "hasMany",
                model: () => SalesNotesModel,
                foreignKey: "id_client",
                localKey: "id",
                as: "SalesNotes",
            },
        };
    }
}

export default new ClientsModel();
