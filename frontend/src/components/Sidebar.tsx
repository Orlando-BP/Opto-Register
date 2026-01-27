import { NavLink } from "react-router-dom";

const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/clientes", label: "Clientes" },
    { to: "/admin/graduaciones", label: "Graduaciones" },
    { to: "/admin/chats", label: "Chats" },
];

export default function Sidebar() {
    return (
        <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950/90 px-4 py-6">
            <div className="mb-8 px-2">
                <h1 className="text-lg font-semibold text-white">
                    Opto Register
                </h1>
                <p className="text-xs text-slate-400">
                    Panel de administración
                </p>
            </div>
            <nav className="flex flex-1 flex-col gap-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            [
                                "rounded-lg px-3 py-2 text-sm transition",
                                isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-300 hover:bg-slate-900 hover:text-white",
                            ].join(" ")
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
