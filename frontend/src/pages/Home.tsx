import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{ padding: 20 }}>
            <h2>Bienvenido a Opto Register</h2>
            <p>Accede al panel de administración:</p>
            <Link to="/login">Ingresar</Link>
        </div>
    );
}
