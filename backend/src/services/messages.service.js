import MessagesModel from "../models/messages.model.js";

const MessagesService = {
    async create(data) {
        return MessagesModel.create(data);
    },

    async findAll(where = {}) {
        return MessagesModel.findAll({
            where,
            include: [
                {
                    name: "Chat",
                    attributes: ["id", "idClient"],
                },
            ],
        });
    },

    async findById(id) {
        return MessagesModel.findById(id, {
            include: [
                {
                    name: "Chat",
                    attributes: ["id", "idClient"],
                },
            ],
        });
    },

    async findOneByWhere(where = {}) {
        return MessagesModel.findOne(where, {
            include: [
                {
                    name: "Chat",
                    attributes: ["id", "idClient"],
                },
            ],
        });
    },

    async update(id, data) {
        return MessagesModel.update(id, data);
    },

    async replace(id, data) {
        return MessagesModel.replace(id, data);
    },

    async delete(id) {
        return MessagesModel.delete(id);
    },
};

export default MessagesService;
