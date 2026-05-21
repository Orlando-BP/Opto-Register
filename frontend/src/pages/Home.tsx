import { Link } from "react-router-dom";
import FelizJueves from "../assets/FelizJueves.jpg";

export default function Home() {
    return (
        <div className="min-h-screen flex items-stretch">
            <div className="w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full flex flex-col items-center justify-center gap-6 px-6 py-16">
                    <div className="space-y-2 text-center">
                        <h2 className="text-3xl font-semibold text-white">
                            Bienvenido a Opto Register
                        </h2>
                        <p className="text-slate-400">
                            Accede al sitio según tu rol:
                        </p>
                    </div>
                    <Link
                        to="/admin/login"
                        className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                    >
                        Ingresa como Administrador
                    </Link>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
                    >
                        Ingresa Como Cliente
                    </Link>
                </div>
            </div>
            <div className="w-1/2 flex items-center justify-center p-8">
                <img
                    src={FelizJueves}
                    className="max-w-full h-auto"
                    alt="FelizJueves"
                />
            </div>
        </div>
    );
}
