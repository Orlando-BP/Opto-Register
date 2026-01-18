import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error">{error}</div>}
            <label>
                Usuario
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>
                Contraseña
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
            </button>
        </form>
    );
}
