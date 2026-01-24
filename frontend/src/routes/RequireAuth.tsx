//ARCHIVO PARA RESTRINGIR EL ACCESO A RUTAS PROTEGIDAS
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem("token");
    if (!token)  return <Navigate to="/401" replace />;
    return children;
}
