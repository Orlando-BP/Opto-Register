import BaseModel from "../BaseModel.js";
import ClientsModel from "./clients.model.js";

class CalibrationsModel extends BaseModel {
    constructor() {
        super("Calibrations", [
            "id",
            "id_client",
            "age",
            "right_SP",
            "right_CYL",
            "right_Axis",
            "left_SP",
            "left_CYL",
            "left_Axis",
            "registration_date",
            "is_deleted"
        ]);

        this.schema = {
            id: "number",
            id_client: "number",
            age: "number",
            right_SP: "number",
            right_CYL: "number",
            right_Axis: "number",
            left_SP: "number",
            left_CYL: "number",
            left_Axis: "number",
            registration_date: "date",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            id_client: null,
            age: null,
            right_SP: 0,
            right_CYL: 0,
            right_Axis: null,
            left_SP: 0,
            left_CYL: 0,
            left_Axis: null,
            registration_date: null,
            is_deleted: false,
        };

        this.foreignKeys = {
            id_client: {
                model: () => ClientsModel,
                refColumn: "id",
                refTable: "Clients",
            },
        };
    }
}

export default new CalibrationsModel();
