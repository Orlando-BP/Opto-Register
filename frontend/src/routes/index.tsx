//ARCHIVO PARA CREAR LAS RUTAS DE LA APLICACION
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/admin/Login";
import Home from "@/pages/Home";
import Chat from "@/pages/admin/Chats";
import Dashboard from "../pages/admin/Dashboard";
import RegistroCliente from "@/pages/admin/RegistroCliente";
import RegistroGraduacion from "@/pages/admin/RegistroGraduacion";
import SidebarLayout from "@/components/SidebarLayout";
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
            <Route path="/home" element={<Home />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
                element={
                    <RequireAuth>
                        <SidebarLayout />
                    </RequireAuth>
                }
            >
                <Route path="/admin/chats" element={<Chat />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/clientes" element={<RegistroCliente />} />
                <Route
                    path="/admin/graduaciones"
                    element={<RegistroGraduacion />}
                />
            </Route>
            <Route path="/401" element={<Unauthorized />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/500" element={<ServerError />} />
            <Route path="/503" element={<ServiceUnavailable />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
