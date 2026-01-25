import BaseModel from "../BaseModel.js";
import CalibrationsModel from "./calibrations.model.js";
import SalesNotesModel from "./salesNotes.model.js";

class ClientsModel extends BaseModel {
    constructor() {
        super("Clients", ["id", "name", "phone", "email", "address"]);

        this.schema = {
            id: "number",
            name: "string",
            phone: "string",
            email: "string",
            address: "string",
        };

        this.attributes = {
            id: null,
            name: "",
            phone: "",
            email: "",
            address: "",
        };

        this.relations = {
            Calibration: {
                type: "hasOne",
                model: () => CalibrationsModel,
                foreignKey: "idClient",
                localKey: "id",
                as: "Calibration",
            },
            SalesNotes: {
                type: "hasMany",
                model: () => SalesNotesModel,
                foreignKey: "idClient",
                localKey: "id",
                as: "SalesNotes",
            },
        };
    }
}

export default new ClientsModel();
