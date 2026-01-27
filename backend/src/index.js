import express from "express";
import { PORT } from "./config.js";
import mainRoutes from "./api/v1/routes/index.js";
import morgan from "morgan";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import MessagesService from "./services/messages.service.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
    },
});

const ADMIN_ROOM = "admins";

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);
    socket.join(socket.id);

    socket.on("admin:join", () => {
        socket.join(ADMIN_ROOM);
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });

    socket.on("chat message", async (msg) => {
        const payload =
            typeof msg === "string"
                ? {
                    text: msg,
                    senderId: socket.id,
                    chatId: socket.id,
                    sender: "client",
                    remitent: "admin",
                }
                : {
                    text: msg?.text ?? "",
                    senderId: msg?.senderId ?? socket.id,
                    chatId: msg?.chatId ?? socket.id,
                    sender: msg?.sender ?? "client",
                    remitent: msg?.remitent ?? "admin",
                };

        if (!payload.text) return;

        console.log("Mensaje recibido:", payload);
        try {
            if (payload.chatId && Number.isFinite(Number(payload.chatId))) {
                await MessagesService.create({
                    idChat: Number(payload.chatId),
                    sender: String(payload.sender ?? "client"),
                    remitent: String(payload.remitent ?? "admin"),
                    message: String(payload.text),
                });
            }
        } catch (error) {
            console.error("Error guardando mensaje:", error);
        }
        io.to(payload.chatId).emit("chat message", payload);
        io.to(ADMIN_ROOM).emit("chat message", payload);
    });
});

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/v1", mainRoutes);

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/src/pages/chat.html");
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
