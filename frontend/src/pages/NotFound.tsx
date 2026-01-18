import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div style={{ padding: 20 }}>
            <h2>404 — Página no encontrada</h2>
            <Link to="/">Ir al inicio</Link>
        </div>
    );
}
