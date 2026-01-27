import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function ServerError() {
    const navigate = useNavigate();

    return (
        <div className="h-svh">
            <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-16">
                <h1 className="text-[6rem] leading-tight font-bold">500</h1>
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-semibold text-white">
                        Error interno del servidor
                    </h2>
                    <p className="text-slate-400">
                        Ocurrió un problema en el servidor. Intenta nuevamente.
                    </p>
                </div>

                <p className="text-muted-foreground text-center">
                    Si el problema persiste, contacta al administrador.
                </p>

                <div className="mt-6 flex gap-4">
                    <Button
                        onClick={() => window.location.reload()}
                        
                    >
                        Reintentar
                    </Button>
                    <Button
                        onClick={() => navigate("/")}
                    >
                        Ir al inicio
                    </Button>
                </div>
            </div>
        </div>
    );
}
