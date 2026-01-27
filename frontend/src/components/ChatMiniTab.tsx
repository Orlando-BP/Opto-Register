import { cn } from "@/lib/utils";

export type ChatMiniTabProps = {
    title: string;
    subtitle?: string;
    unreadCount?: number;
    active?: boolean;
    online?: boolean;
    avatarUrl?: string;
    onClick?: () => void;
    onClose?: () => void;
    className?: string;
};

export function ChatMiniTab({
    title,
    subtitle,
    unreadCount = 0,
    active = false,
    online = false,
    avatarUrl,
    onClick,
    onClose,
    className,
}: ChatMiniTabProps) {
    return (
        <div
            className={cn(
                "group flex items-center gap-3 rounded-xl border border-primary bg-background px-3 py-2 shadow-sm transition",
                "hover:bg-muted/60",
                active && "bg-primary text-primary-foreground hover:bg-primary",
                className,
            )}
        >
            <button
                type="button"
                onClick={onClick}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                aria-pressed={active}
            >
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-primary/30">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-semibold">
                            {title
                                .split(" ")
                                .slice(0, 2)
                                .map((part) => part.charAt(0).toUpperCase())
                                .join("")}
                        </div>
                    )}
                    <span
                        className={cn(
                            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-background",
                            online
                                ? "bg-emerald-500"
                                : "bg-muted-foreground/40",
                        )}
                        aria-label={online ? "En línea" : "Desconectado"}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold">
                            {title}
                        </span>
                        {unreadCount > 0 && (
                            <span
                                className={cn(
                                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                    active
                                        ? "bg-white/20 text-white"
                                        : "bg-blue-600 text-white",
                                )}
                                aria-label={`${unreadCount} mensajes sin leer`}
                            >
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p
                            className={cn(
                                "truncate text-xs text-muted-foreground",
                                active && "text-primary-foreground/80",
                            )}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
            </button>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                        "rounded-md p-1 text-muted-foreground transition",
                        "hover:bg-black/5 hover:text-foreground",
                        active && "text-primary-foreground hover:bg-white/10",
                    )}
                    aria-label="Cerrar chat"
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export default ChatMiniTab;
