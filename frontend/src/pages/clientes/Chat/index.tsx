import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { API_URL } from "@/api/config";

type ClientItem = {
    id: number;
    name: string;
};

type ChatMessage = {
    id: string;
    chatId: string;
    sender: "me" | "other";
    text: string;
    time?: string;
};

export default function ClientChatPage() {
    const [clients, setClients] = useState<ClientItem[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");

    const socketRef = useRef<any>(null);

    useEffect(() => {
        // load clients list
        fetch(`${API_URL}/v1/clients`)
            .then((r) => r.json())
            .then((json) => {
                const data = Array.isArray(json?.data) ? json.data : json?.data?.clients ?? [];
                const mapped = data.map((c: any) => ({ id: c.id, name: c.name }));
                setClients(mapped);
                if (mapped.length > 0 && selectedClientId == null) setSelectedClientId(mapped[0].id);
            })
            .catch((err) => {
                console.error("Error loading clients", err);
            });
    }, []);

    useEffect(() => {
        const socket = io(API_URL, { transports: ["websocket"] });
        socketRef.current = socket;

        let chatRoomId: number | null = null;

        socket.on("connect", () => {
            // nothing yet
        });

        // Recibe el id real del chat y se une a la sala correcta
        socket.on("chat:assign", ({ chatId }) => {
            chatRoomId = chatId;
            socket.emit("client:join", { chatId });
        });

        const onMessage = (payload: any) => {
            if (!payload) return;
            const chatId = String(payload.idChat ?? payload.chatId ?? chatRoomId ?? selectedClientId ?? "");
            const sender = payload.sender === "client" ? "me" : "other";
            const time = payload.timestamp ? new Date(payload.timestamp).toLocaleTimeString() : undefined;
            const newMsg: ChatMessage = {
                id: String(payload.id ?? `s_${Date.now()}`),
                chatId,
                sender,
                text: String(payload.message ?? payload.text ?? ""),
                time,
            };
            setMessages((prev) => [...prev, newMsg]);
        };

        socket.on("chat message", onMessage);

        return () => {
            socket.off("chat message", onMessage);
            socket.off("chat:assign");
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        // join selected client's chat room
        if (!socketRef.current) return;
        if (selectedClientId == null) return;
        socketRef.current.emit("client:join", { chatId: selectedClientId });
        // reset messages when switching
        setMessages([]);
    }, [selectedClientId]);

    function handleSend() {
        const text = draft.trim();
        if (!text || !selectedClientId) return;

        const now = new Date();
        const time = now.toLocaleTimeString();

        const outgoing: ChatMessage = {
            id: `c_${Date.now()}`,
            chatId: String(selectedClientId),
            sender: "me",
            text,
            time,
        };

        setMessages((prev) => [...prev, outgoing]);
        setDraft("");

        socketRef.current?.emit("chat message", {
            text,
            chatId: selectedClientId,
            sender: "client",
            remitent: "admin",
        });
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Chat cliente (simulación)</h2>

            <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-1">Seleccionar cliente</label>
                <select
                    className="w-full p-2 border rounded"
                    value={selectedClientId ?? ""}
                    onChange={(e) => setSelectedClientId(Number(e.target.value) || null)}
                >
                    {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name} ({c.id})
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4 border rounded p-3 h-60 overflow-y-auto bg-white/5">
                {messages.length === 0 ? (
                    <div className="text-sm text-slate-400">Sin mensajes aún</div>
                ) : (
                    messages.map((m) => (
                        <div key={m.id} className={`mb-2 max-w-3/4 ${m.sender === "me" ? "ml-auto text-right" : "mr-auto text-left"}`}>
                            <div className={`inline-block px-3 py-2 rounded ${m.sender === "me" ? "bg-sky-600" : "bg-slate-700"}`}>
                                <div className="text-sm">{m.text}</div>
                                {m.time && <div className="text-xs text-slate-300 mt-1">{m.time}</div>}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex gap-2">
                <input
                    className="flex-1 p-2 border rounded"
                    placeholder="Escribe un mensaje..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />
                <button className="px-4 py-2 bg-sky-600 rounded text-white" onClick={handleSend}>
                    Enviar
                </button>
            </div>
        </div>
    );
}
