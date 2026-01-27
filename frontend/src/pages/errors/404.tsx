import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="h-svh">
            <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-16">
                <h1 className="text-[6rem] leading-tight font-bold">404</h1>
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-semibold text-white">
                        Página no encontrada
                    </h2>
                    <p className="text-slate-400">
                        La ruta que buscas no existe o ha sido eliminada.
                    </p>
                </div>

                <p className="text-muted-foreground text-center">
                    Parece que estás intentando acceder a una sección que no
                    existe.
                </p>

                <div className="mt-6 flex gap-4">
                    <Button
                        onClick={() => window.history.back()}
                    >
                        Regresar
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
