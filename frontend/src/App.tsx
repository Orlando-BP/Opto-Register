import AppRoutes from "./routes";
import Toaster from "./components/ui/toaster";

export default function App() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
            <AppRoutes />
            <Toaster />
        </div>
    );
}
