import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function RegistroGraduacion() {
    const [right_SP, setRight_SP] = useState("");
    const [right_CYL, setRight_CYL] = useState("");
    const [right_Axis, setRight_Axis] = useState("");
    const [left_SP, setLeft_SP] = useState("");
    const [left_CYL, setLeft_CYL] = useState("");
    const [left_Axis, setLeft_Axis] = useState("");
    const [loading, ] = useState(false);

    return (
        <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">
                    Registro de Graduación
                </h1>
                <p className="text-sm text-slate-400">
                    Ingresa los datos de la graduación
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-700 rounded-md bg-slate-800">
                <label className="block text-sm font-medium text-slate-200">
                    Right SP
                    <input
                        value={right_SP}
                        onChange={(e) => setRight_SP(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Right SP"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Right CYL
                    <input
                        value={right_CYL}
                        onChange={(e) => setRight_CYL(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Right CYL"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Right Axis
                    <input
                        value={right_Axis}
                        onChange={(e) => setRight_Axis(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Right Axis"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Left SP
                    <input
                        value={left_SP}
                        onChange={(e) => setLeft_SP(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Left SP"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Left CYL
                    <input
                        value={left_CYL}
                        onChange={(e) => setLeft_CYL(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Left CYL"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Left Axis
                    <input
                        value={left_Axis}
                        onChange={(e) => setLeft_Axis(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Left Axis"
                    />
                </label>
            </div>

            <div className="max-w-md text-center mx-auto">
                <Button type="submit" disabled={loading}>
                    {loading ? "Añadiendo..." : "Añadir Graduación"}
                </Button>
            </div>
        </div>
    );
}
