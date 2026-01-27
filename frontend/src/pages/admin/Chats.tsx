import { useEffect, useMemo, useState } from "react";
import ChatMiniTab from "@/components/ChatMiniTab";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
// Datos hardcodeados de ejemplo (sin conexión a base de datos)

type ChatItem = {
    id: string;
    title: string;
    subtitle?: string;
    avatarUrl?: string;
    online?: boolean;
    unreadCount?: number;
    lastMessage?: string;
};

type ChatMessage = {
    id: string;
    chatId: string;
    sender: "me" | "other";
    text: string;
    time: string;
};

// No hay tipos de API aquí: todo es local y hardcodeado

const initialChats: ChatItem[] = [];
const initialMessages: ChatMessage[] = [];

export default function ChatPage() {
    const [chats, setChats] = useState<ChatItem[]>(initialChats);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [activeChatId, setActiveChatId] = useState("");
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");
    const [, setLoadingChats] = useState(false);
    const [, setLoadingMessages] = useState(false);

    const activeChat = useMemo(
        () => chats.find((chat) => chat.id === activeChatId) ?? chats[0],
        [activeChatId, chats],
    );

    const filteredChats = useMemo(() => {
        const normalized = search.trim().toLowerCase();
        if (!normalized) return chats;
        return chats.filter((chat) =>
            [chat.title, chat.subtitle, chat.lastMessage]
                .filter(Boolean)
                .some((value) => value?.toLowerCase().includes(normalized)),
        );
    }, [chats, search]);

    const chatMessages = useMemo(
        () => messages.filter((message) => message.chatId === activeChat?.id),
        [messages, activeChat?.id],
    );

    function handleSelectChat(chatId: string) {
        setActiveChatId(chatId);
        setChats((prev) =>
            prev.map((chat) =>
                chat.id === chatId ? { ...chat, unreadCount: 0 } : chat,
            ),
        );
    }

    useEffect(() => {}, [activeChatId]);

    // Cargar chats hardcodeados (sin conexión a la API)
    useEffect(() => {
        setLoadingChats(true);
        const sampleChats: ChatItem[] = [
            {
                id: "1",
                title: "Juan Pérez",
                subtitle: "juan.perez@example.com",
                online: true,
                unreadCount: 2,
                lastMessage: "Hola, ¿tienen la graduación lista?",
            },
            {
                id: "2",
                title: "María Gómez",
                subtitle: "maria.gomez@example.com",
                online: false,
                unreadCount: 0,
                lastMessage: "Gracias por la ayuda!",
            },
        ];

        setChats(sampleChats);
        if (sampleChats.length > 0 && !activeChatId) {
            setActiveChatId(sampleChats[0].id);
        }
        setLoadingChats(false);
    }, []);

    // Cargar mensajes hardcodeados por chat (sin conexión a la API)
    useEffect(() => {
        if (!activeChatId) return;
        setLoadingMessages(true);

        const sampleMessages: Record<string, ChatMessage[]> = {
            "1": [
                {
                    id: "m1",
                    chatId: "1",
                    sender: "other",
                    text: "Hola, ¿tienen la graduación lista?",
                    time: "09:12",
                },
                {
                    id: "m2",
                    chatId: "1",
                    sender: "me",
                    text: "Sí, estará lista mañana.",
                    time: "09:15",
                },
            ],
            "2": [
                {
                    id: "m3",
                    chatId: "2",
                    sender: "other",
                    text: "Muchas gracias por la atención",
                    time: "11:05",
                },
            ],
        };

        const msgs = sampleMessages[activeChatId] ?? [];
        setMessages((prev) => {
            const rest = prev.filter(
                (message) => message.chatId !== activeChatId,
            );
            return [...rest, ...msgs];
        });
        setLoadingMessages(false);
    }, [activeChatId]);

    function handleSendMessage() {
        const text = draft.trim();
        if (!text || !activeChat) return;

        const now = new Date();
        const time = now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });

        const newMessage: ChatMessage = {
            id: `m${messages.length + 1}`,
            chatId: activeChat.id,
            sender: "me",
            text,
            time,
        };

        setMessages((prev) => [...prev, newMessage]);
        setDraft("");
        setChats((prev) =>
            prev.map((chat) =>
                chat.id === activeChat.id
                    ? { ...chat, lastMessage: text }
                    : chat,
            ),
        );
        // Sin envío a servidor: quedan guardados en estado local (hardcode temporal)
    }

    return (
        <div className="h-svh bg-slate-950 text-slate-100">
            <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 px-6 py-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold">Centro de chat</h1>
                    <p className="text-sm text-slate-400">
                        Atiende consultas de clientes en tiempo real.
                    </p>
                </div>

                <div className="grid h-full min-h-135 grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
                    <section className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                        <div className="space-y-2">
                            <h2 className="text-sm font-semibold text-slate-200">
                                Conversaciones
                            </h2>
                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Buscar por nombre"
                            />
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                            {filteredChats.map((chat) => (
                                <ChatMiniTab
                                    key={chat.id}
                                    title={chat.title}
                                    subtitle={chat.lastMessage ?? chat.subtitle}
                                    unreadCount={chat.unreadCount}
                                    online={chat.online}
                                    active={chat.id === activeChat?.id}
                                    onClick={() => handleSelectChat(chat.id)}
                                />
                            ))}
                            {filteredChats.length === 0 && (
                                <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
                                    No hay conversaciones que coincidan.
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/70">
                        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold">
                                    {activeChat?.title ?? "Chat"}
                                </h2>
                                <p className="text-xs text-slate-400">
                                    {activeChat?.online
                                        ? "En línea"
                                        : "Última conexión recientemente"}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-700 text-slate-200"
                                >
                                    Ver perfil
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-700 text-slate-200"
                                >
                                    Marcar como resuelto
                                </Button>
                            </div>
                        </header>

                        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
                            {chatMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${
                                        message.sender === "me"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[78%] space-y-1 rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                            message.sender === "me"
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-800 text-slate-100"
                                        }`}
                                    >
                                        <p>{message.text}</p>
                                        <span className="text-[10px] opacity-70">
                                            {message.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <footer className="border-t border-slate-800 px-5 py-4">
                            <form
                                className="flex flex-wrap gap-2"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    handleSendMessage();
                                }}
                            >
                                <Input
                                    value={draft}
                                    onChange={(event) =>
                                        setDraft(event.target.value)
                                    }
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1"
                                />
                                <Button type="submit">Enviar</Button>
                            </form>
                        </footer>
                    </section>
                </div>
            </div>
        </div>
    );
}
