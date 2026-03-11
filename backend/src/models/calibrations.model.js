import BaseModel from "../BaseModel.js";
import ClientsModel from "./clients.model.js";

class CalibrationsModel extends BaseModel {
    constructor() {
        super("Calibrations", [
            "id",
            "id_client",
            "age",
            "right_sp",
            "right_cyl",
            "right_axis",
            "left_sp",
            "left_cyl",
            "left_axis",
            "registration_date",
            "right_condition",
            "left_condition",
            "is_deleted"
        ]);

        this.schema = {
            id: "number",
            id_client: "number",
            age: "number",
            right_sp: "number",
            right_cyl: "number",
            right_axis: "number",
            left_sp: "number",
            left_cyl: "number",
            left_axis: "number",
            registration_date: "date",
            right_condition: "string",
            left_condition: "string",
            is_deleted: "boolean",
        };

        this.attributes = {
            id: null,
            id_client: null,
            age: null,
            right_sp: 0,
            right_cyl: 0,
            right_axis: null,
            left_sp: 0,
            left_cyl: 0,
            left_axis: null,
            registration_date: null,
            right_condition: null,
            left_condition: null,
            is_deleted: false,
        };

        this.foreignKeys = {
            id_client: {
                model: () => ClientsModel,
                refColumn: "id",
                refTable: "clients",
            },
        };
    }
}

export default new CalibrationsModel();
