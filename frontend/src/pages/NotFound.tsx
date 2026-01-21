import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    404 — Página no encontrada
                </h2>
                <p className="text-slate-400">La ruta que buscas no existe.</p>
            </div>
            <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800"
            >
                Ir al inicio
            </Link>
        </div>
    );
}
