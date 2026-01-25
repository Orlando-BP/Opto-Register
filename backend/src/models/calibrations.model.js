import BaseModel from "../BaseModel.js";
import ClientsModel from "./clients.model.js";

class CalibrationsModel extends BaseModel {
    constructor() {
        super("Calibrations", [
            "id",
            "idClient",
            "age",
            "right_SP",
            "right_CYL",
            "right_Axis",
            "left_SP",
            "left_CYL",
            "left_Axis",
            "registrationDate",
        ]);

        this.schema = {
            id: "number",
            idClient: "number",
            age: "number",
            right_SP: "number",
            right_CYL: "number",
            right_Axis: "number",
            left_SP: "number",
            left_CYL: "number",
            left_Axis: "number",
            registrationDate: "date",
        };

        this.attributes = {
            id: null,
            idClient: null,
            age: null,
            right_SP: 0,
            right_CYL: 0,
            right_Axis: null,
            left_SP: 0,
            left_CYL: 0,
            left_Axis: null,
            registrationDate: null,
        };

        this.foreignKeys = {
            idClient: {
                model: () => ClientsModel,
                refColumn: "id",
                refTable: "Clients",
            },
        };
    }
}

export default new CalibrationsModel();
