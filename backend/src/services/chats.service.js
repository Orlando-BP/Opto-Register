import ChatsModel from "../models/chats.model.js";

const ChatsService = {
    async create(data) {
        return ChatsModel.create(data);
    },

    async findAll(where = {}) {
        return ChatsModel.findAll({
            where,
            include: [
                {
                    name: "Client",
                    attributes: ["id", "name", "phone", "email"],
                },
                {
                    name: "Messages",
                    attributes: [
                        "id",
                        "idChat",
                        "sender",
                        "remitent",
                        "message",
                        "timestamp",
                    ],
                },
            ],
        });
    },

    async findById(id) {
        return ChatsModel.findById(id, {
            include: [
                {
                    name: "Client",
                    attributes: ["id", "name", "phone", "email"],
                },
                {
                    name: "Messages",
                    attributes: [
                        "id",
                        "idChat",
                        "sender",
                        "remitent",
                        "message",
                        "timestamp",
                    ],
                },
            ],
        });
    },

    async findOneByWhere(where = {}) {
        return ChatsModel.findOne(where, {
            include: [
                {
                    name: "Client",
                    attributes: ["id", "name", "phone", "email"],
                },
                {
                    name: "Messages",
                    attributes: [
                        "id",
                        "idChat",
                        "sender",
                        "remitent",
                        "message",
                        "timestamp",
                    ],
                },
            ],
        });
    },

    async update(id, data) {
        return ChatsModel.update(id, data);
    },

    async replace(id, data) {
        return ChatsModel.replace(id, data);
    },

    async delete(id) {
        return ChatsModel.delete(id);
    },
};

export default ChatsService;
