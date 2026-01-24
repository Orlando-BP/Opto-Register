import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import RegistroCliente from "./pages/RegistroCliente.jsx";
import RegistroGraduacion from "./pages/RegistroGraduacion.jsx";
import Home from "./pages/Home.js";
import Dashboard from "./pages/Dashboard.js";
import NotFound from "./pages/NotFound.js";
import RequireAuth from "./routes/RequireAuth.jsx";
import Toaster from "./components/ui/toaster";

export default function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro-cliente" element={<RegistroCliente />} />
                <Route
                    path="/registro-graduacion"
                    element={<RegistroGraduacion />}
                />
                <Route
                    path="/dashboard"
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </div>
    );
}
