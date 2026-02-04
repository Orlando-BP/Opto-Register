import React from "react";

type Form = {
    id_client: string;
    issue_date: string;
    delivery_date: string;
    total_price: string;
    advance: string;
};

export default function RegistroNotasVentas({
    form,
    setForm,
    onSubmit,
    clients,
}: {
    form: Form;
    setForm: React.Dispatch<React.SetStateAction<Form>>;
    onSubmit: (e: React.FormEvent) => void;
    clients: any[];
}) {
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

            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-700 rounded-md bg-slate-800">
                    <label className="col-span-2 block text-sm font-medium text-slate-200">
                        Cliente
                        <select
                            value={form.id_client}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    id_client: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        >
                            <option value="">- Seleccionar -</option>
                            {clients &&
                                clients.map((c: any) => (
                                    <option key={c?.id} value={String(c?.id)}>
                                        {c?.name ?? `Cliente #${c?.id}`}
                                    </option>
                                ))}
                        </select>
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
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
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
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
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
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
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
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
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
