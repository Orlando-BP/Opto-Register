//ARCHIVO PARA CREAR LAS RUTAS DE LA APLICACION
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Dashboard from "../pages/Dashboard";
import RegistroCliente from "@/pages/RegistroCliente";
import RegistroGraduacion from "@/pages/RegistroGraduacion";
import Unauthorized from "@/pages/errors/401";
import Forbidden from "@/pages/errors/403";
import NotFound from "@/pages/errors/404";
import ServerError from "@/pages/errors/500";
import ServiceUnavailable from "@/pages/errors/503";
import RequireAuth from "./RequireAuth";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <RequireAuth>
                        <Dashboard />
                    </RequireAuth>
                }
            />
            <Route
                path="/clientes"
                element={
                    <RequireAuth>
                        <RegistroCliente />
                    </RequireAuth>
                }
            />
            <Route
                path="/graduaciones"
                element={
                    <RequireAuth>
                        <RegistroGraduacion />
                    </RequireAuth>
                }
            />
            <Route path="/401" element={<Unauthorized />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="/503" element={<ServiceUnavailable />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
