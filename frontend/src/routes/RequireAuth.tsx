import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
    id: number;
    code: string;
    role: "admin" | "client";
    exp: number;
};

type Props = {
    children: JSX.Element;
    allowedRoles?: Array<"admin" | "client">;
};

export default function RequireAuth({ children, allowedRoles }: Props) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/401" replace />;
    }

    try {
        const decoded = jwtDecode<TokenPayload>(token);

        // validar expiración
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem("token");
            return <Navigate to="/" replace />;
            
        }

        // validar roles
        if (allowedRoles && !allowedRoles.includes(decoded.role)) {
            return <Navigate to="/403" replace />;
        }

        return children;
    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }
}
