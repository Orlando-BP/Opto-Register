import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="h-svh">
            <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-16">
                <h1 className="text-[6rem] leading-tight font-bold">401</h1>
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-semibold text-white">
                        No autorizado
                    </h2>
                    <p className="text-slate-400">
                        Necesitas iniciar sesión para acceder a esta página.
                    </p>
                </div>

                <p className="text-muted-foreground text-center">
                    Inicia sesión para continuar.
                </p>

                <div className="mt-6 flex gap-4">
                    <Button
                        onClick={() => navigate("/login")}
                        label="Iniciar sesión"
                    />
                    <Button
                        onClick={() => navigate("/")}
                        label="Ir al inicio"
                    />
                </div>
            </div>
        </div>
    );
}
