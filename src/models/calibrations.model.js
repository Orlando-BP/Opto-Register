import BaseModel from "./BaseModel.js";

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
    }
}

export default new CalibrationsModel();
