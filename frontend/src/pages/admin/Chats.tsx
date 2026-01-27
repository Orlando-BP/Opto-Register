import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatMiniTab from "@/components/ChatMiniTab";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/api/config";
import { useFetch } from "@/hooks/useFetch";

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

type ApiChat = {
    id: number;
    idClient: number | null;
    Client?: {
        id: number;
        name: string;
        phone?: string | null;
        email?: string | null;
    } | null;
    Messages?: ApiMessage[];
};

type ApiMessage = {
    id: number;
    idChat: number;
    sender: string;
    remitent: string;
    message: string;
    timestamp?: string | null;
};

const initialChats: ChatItem[] = [];
const initialMessages: ChatMessage[] = [];

const formatTime = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function ChatPage() {
    const [chats, setChats] = useState<ChatItem[]>(initialChats);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [activeChatId, setActiveChatId] = useState("");
    const [search, setSearch] = useState("");
    const [draft, setDraft] = useState("");
    const [socketId, setSocketId] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const activeChatIdRef = useRef(activeChatId);
    const {
        response: chatsResponse,
        loading: chatsLoading,
        error: chatsError,
    } = useFetch({ url: "/v1/chats" });

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

    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);

    useEffect(() => {
        const data = Array.isArray(chatsResponse?.data)
            ? (chatsResponse?.data as ApiChat[])
            : [];

        const mappedChats = data.map((chat) => {
            const id = String(chat.id);
            const sortedMessages = (chat.Messages ?? [])
                .slice()
                .sort((a, b) =>
                    String(a.timestamp ?? "").localeCompare(
                        String(b.timestamp ?? ""),
                    ),
                );
            const lastMessage =
                sortedMessages.length > 0
                    ? sortedMessages[sortedMessages.length - 1].message
                    : "";

            return {
                id,
                title:
                    chat.Client?.name ?? `Cliente ${chat.idClient ?? chat.id}`,
                subtitle: chat.Client?.email ?? undefined,
                online: true,
                unreadCount: 0,
                lastMessage,
            };
        });

        const mappedMessagesWithTimestamp: Array<
            ChatMessage & { timestamp: string }
        > = data.flatMap((chat) =>
            (chat.Messages ?? []).map((msg) => {
                const sender: ChatMessage["sender"] =
                    msg.sender === "admin" ? "me" : "other";
                return {
                    id: String(msg.id),
                    chatId: String(msg.idChat),
                    sender,
                    text: msg.message,
                    time: formatTime(msg.timestamp),
                    timestamp: msg.timestamp ?? "",
                };
            }),
        );

        const mappedMessages = mappedMessagesWithTimestamp
            .sort((a, b) =>
                String(a.timestamp ?? "").localeCompare(
                    String(b.timestamp ?? ""),
                ),
            )
            .map(({ timestamp, ...rest }) => rest);

        setChats(mappedChats);
        setMessages(mappedMessages);

        if (mappedChats.length > 0) {
            const stillExists = mappedChats.some(
                (chat) => chat.id === activeChatIdRef.current,
            );
            if (!activeChatIdRef.current || !stillExists) {
                setActiveChatId(mappedChats[0].id);
            }
        }
    }, [chatsResponse]);

    useEffect(() => {
        const socket = io(API_URL, {
            transports: ["websocket"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setSocketId(socket.id ?? null);
            socket.emit("admin:join");
        });

        socket.on("disconnect", () => {
            setSocketId(null);
        });

        const onMessage = (payload: {
            text: string;
            senderId: string;
            chatId: string | number;
            sender?: string;
        }) => {
            if (!payload?.text || !payload?.chatId) return;
            if (payload.senderId && payload.senderId === socket.id) return;

            const now = new Date();
            const time = now.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            });

            const currentChatId = String(payload.chatId);
            const newMessage: ChatMessage = {
                id: `m${Date.now()}`,
                chatId: currentChatId,
                sender: payload.sender === "admin" ? "me" : "other",
                text: payload.text,
                time,
            };

            setMessages((prev) => [...prev, newMessage]);
            setChats((prev) => {
                const existing = prev.find((chat) => chat.id === currentChatId);
                const isActive = currentChatId === activeChatIdRef.current;
                if (!existing) {
                    const label = currentChatId.slice(0, 4).toUpperCase();
                    return [
                        {
                            id: currentChatId,
                            title: `Cliente ${label}`,
                            online: true,
                            unreadCount: isActive ? 0 : 1,
                            lastMessage: payload.text,
                        },
                        ...prev,
                    ];
                }

                return prev.map((chat) =>
                    chat.id === currentChatId
                        ? {
                              ...chat,
                              lastMessage: payload.text,
                              unreadCount: isActive
                                  ? 0
                                  : (chat.unreadCount ?? 0) + 1,
                          }
                        : chat,
                );
            });
        };

        socket.on("chat message", onMessage);

        return () => {
            socket.off("chat message", onMessage);
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

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
        socketRef.current?.emit("chat message", {
            text,
            senderId: socketId ?? undefined,
            chatId: activeChat.id,
            sender: "admin",
            remitent: "client",
        });
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
                            {chatsLoading && (
                                <div className="rounded-xl border border-dashed border-slate-700 p-4 text-center text-sm text-slate-400">
                                    Cargando conversaciones...
                                </div>
                            )}
                            {chatsError && !chatsLoading && (
                                <div className="rounded-xl border border-dashed border-red-700/60 p-4 text-center text-sm text-red-300">
                                    No se pudieron cargar las conversaciones.
                                </div>
                            )}
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
                            {filteredChats.length === 0 &&
                                !chatsLoading &&
                                !chatsError && (
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
