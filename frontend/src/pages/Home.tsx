import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    Bienvenido a Opto Register
                </h2>
                <p className="text-slate-400">
                    Accede al panel de administración:
                </p>
            </div>
            <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
            >
                Ingresar
            </Link>
        </div>
    );
}
