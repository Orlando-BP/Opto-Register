import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

type ApiResponse = {
    status: string;
    message: string;
    data: any;
};

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:3000/v1/admins/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const body: ApiResponse = await res.json();
            if (!res.ok) {
                setError(body.message || "Error");
                setLoading(false);
                return;
            }
            setUser(body.data.user);
            if (body.data?.token) {
                localStorage.setItem("token", body.data.token);
            }
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    }

    // Nota: redirección tras login maneja la vista del dashboard.

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
                        Accede al panel de administración
                    </p>
                </div>

                {error && (
                    <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-200">
                        Usuario
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="Usuario"
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-200">
                        Contraseña
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="••••••••"
                        />
                    </label>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    label={loading ? "Ingresando..." : "Ingresar"}
                    fullWidth
                />
            </form>
        </div>
    );
}
