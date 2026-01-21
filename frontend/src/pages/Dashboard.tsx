import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-4 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    Panel de administración
                </h2>
                <p className="text-slate-400">
                    Contenido protegido para administradores.
                </p>
            </div>
            <button
                onClick={handleLogout}
                className="inline-flex w-fit items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            >
                Cerrar sesión
            </button>
        </div>
    );
}
