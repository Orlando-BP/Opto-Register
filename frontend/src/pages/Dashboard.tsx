import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>Panel de administración</h2>
            <p>Contenido protegido para administradores.</p>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
}
