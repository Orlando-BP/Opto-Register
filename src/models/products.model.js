import BaseModel from "./BaseModel.js";

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
    }
}

export default new ProductsModel();
