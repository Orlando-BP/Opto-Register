import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { usePost, useToast } from "@/hooks";

export default function Login() {
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { execute, loading } = usePost();
    const { toast } = useToast();

    async function handleLogin() {
        setError(null);

        try {
            const res: any = await execute({
                url: "/v1/sales-notes/login",
                body: { code },
                method: "post",
            });

            if (res.ok ?? res.status === 200) {
                const token = res.data?.token;
                if (token) {
                    localStorage.setItem("token", token);
                    console.log("token:", token);
                } else {
                    console.log("token ausente en respuesta:", res);
                }
                toast({
                    title: "Bienvenido Cliente",
                    description: "✅ Has iniciado sesión correctamente",
                });
                navigate("/client/dashboard");
                console.log("Este Log si se imprime");
            } else {
                setError(res.message ?? "No se pudo iniciar sesión.");
                toast({
                    title: "Error al iniciar sesión",
                    description:
                        "❌ No se pudo iniciar sesión. Por favor, verifica tus credenciales.",
                });
            }
        } catch (err) {
            setError("Error de conexión");
            toast({
                title: "Error",
                description: "❌ No se pudo conectar al servidor.",
            });
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        void handleLogin();
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl"
            >
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold text-white">
                        Ingresar
                    </h1>
                    <p className="text-sm text-slate-400">
                        Accede al panel de clientes con tu código único
                    </p>
                </div>

                {error && (
                    <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-200">
                        Código
                        <input
                            value={code}
                            onChange={(e) =>
                                setCode(e.target.value.slice(0, 10))
                            }
                            maxLength={10}
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="Código (máx 10 caracteres)"
                        />
                    </label>
                </div>

                <Button
                    disabled={loading}
                    onClick={handleLogin}
                    className="w-full"
                >
                    {loading ? "Ingresando..." : "Ingresar"}
                </Button>
            </form>
        </div>
    );
}
