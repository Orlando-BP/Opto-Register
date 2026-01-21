import { Link } from "react-router-dom";
import React, { useState } from "react";
import Button from "../components/ui/Button";




export default function RegistroCliente() {
    const [clientname, setClientname] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    // logica de registro de cliente 
    return (
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
            <div className="w-full flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full  space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                    {/* Formulario de registro de cliente */}
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-semibold text-white">
                            Registro de Cliente
                        </h1>
                        <p className="text-sm text-slate-400">
                            Ingresa los datos del cliente
                        </p>
                    </div>
                    <div className="space-y-4 p-4 border border-slate-700 rounded-md bg-slate-800">
                        <label className="block text-sm font-medium text-slate-200">
                            Nombre de Cliente
                            <input
                                value={clientname}
                                onChange={(e) => setClientname(e.target.value)}
                                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                                placeholder="Nombre de Cliente"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-200">
                            Teléfono
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                                placeholder="Teléfono"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-200">
                            Correo electrónico
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                                placeholder="Correo electrónico"
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-200">
                            Dirección
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                                placeholder="Dirección"
                            />
                        </label>
                    </div>
                    <div className="max-w-md text-center mx-auto">
                        <Button
                            type="submit"
                            disabled={loading}
                            label={loading ? "Registrando..." : "Registrar"}
                            fullWidth
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
