import React, { useState } from "react";
import { usePost, useToast } from "@/hooks";

export default function RegistroNotasVentas({
    refetch,
}: {
    refetch: () => void;
}) {
    const { execute } = usePost();
    const { toast } = useToast();

    const [form, setForm] = useState({
        id_client: "",
        issue_date: "",
        delivery_date: "",
        total_price: "",
        advance: "",
    });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            id_client: form.id_client ? Number(form.id_client) : null,
            issue_date: form.issue_date || null,
            delivery_date: form.delivery_date || null,
            total_price: Number(form.total_price) || 0,
            advance: Number(form.advance) || 0,
            balance:
                (Number(form.total_price) || 0) - (Number(form.advance) || 0),
        };

        execute({ url: "/v1/salesNotes", method: "post", body: payload }).then(
            (res) => {
                if (res.ok) {
                    setForm({
                        id_client: "",
                        issue_date: "",
                        delivery_date: "",
                        total_price: "",
                        advance: "",
                    });
                    toast({
                        title: "Nota de venta creada",
                        description: "La nota de venta se creó correctamente.",
                    });
                    refetch();
                } else {
                    toast({
                        title: "Error",
                        description: "No se pudo crear la nota de venta.",
                    });
                }
            },
        );
    }

    return (
        <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">
                    Registro de Nota de Venta
                </h1>
                <p className="text-sm text-slate-400">
                    Ingresa los datos de la nota de venta
                </p>
            </div>

            <form onSubmit={handleCreate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-700 rounded-md bg-slate-800">
                    <label className="col-span-2 block text-sm font-medium text-slate-200">
                        Cliente
                        <input
                            value={form.id_client}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    id_client: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                            placeholder="ID Cliente"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-200">
                        Fecha de emisión
                        <input
                            type="date"
                            value={form.issue_date}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    issue_date: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-200">
                        Fecha de entrega
                        <input
                            type="date"
                            value={form.delivery_date}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    delivery_date: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-200">
                        Precio total
                        <input
                            type="number"
                            value={form.total_price}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    total_price: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                            placeholder="Precio total"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-200">
                        Anticipo
                        <input
                            type="number"
                            value={form.advance}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    advance: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                            placeholder="Anticipo"
                        />
                    </label>
                </div>

                <div className="max-w-md text-center mx-auto mt-4">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                    >
                        Crear Nota
                    </button>
                </div>
            </form>
        </div>
    );
}
