import { Routes, Route } from "react-router-dom";
import Login from "./features/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";

export default function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
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
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}
