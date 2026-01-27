import React from "react";

type Form = {
    id_sales_note: string;
    id_calibration: string;
    name: string;
    description: string;
    value: string;
};

export default function RegistroNotasVentas({
    form,
    setForm,
    onSubmit,
    // calibrations,
}: {
    form: Form;
    setForm: React.Dispatch<React.SetStateAction<Form>>;
    onSubmit: (e: React.FormEvent) => void;
    // calibrations: any[];
}) {
    return (
        <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
            
            <form onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-700 rounded-md bg-slate-800">
                    <label className="md:col-span-2block text-sm font-medium text-slate-200">
                        Nombre de producto
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    name: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="Nombre de Producto"
                        />
                    </label>

                    <label className="col-span-2 block text-sm font-medium text-slate-200">
                        Descripcion
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    description: e.target.value,
                                }))
                            }
                            rows={3}
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="Descripcion del Producto"
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-200">
                        Precio
                        <input
                            type="number"
                            value={form.value}
                            onChange={(e) =>
                                setForm((s) => ({
                                    ...s,
                                    value: e.target.value,
                                }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                            placeholder="Precio"
                        />
                    </label>
                </div>
                {/* Aqui va un select de graduaciones y al seleccionarla llenara unos campos que permite previsualizarla */}
            </form>
        </div>
    );
}
