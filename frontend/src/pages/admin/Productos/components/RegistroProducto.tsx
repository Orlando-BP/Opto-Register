import React, { useState } from "react";
import { usePost, useToast } from "@/hooks";

type Form = {
    name: string;
    description: string;
};

export default function RegistroProducto({ refetch }: { refetch: () => void }) {
    const { execute } = usePost();
    const { toast } = useToast();

    const [form, setForm] = useState<Form>({
        name: "",
        description: "",
    });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const payload = {
            name: form.name,
            description: form.description,
        };

        execute({ url: "/v1/products", method: "post", body: payload }).then(
            (res) => {
                if (res.ok) {
                    setForm({
                        name: "",
                        description: "",
                    });
                    toast({
                        title: "Producto creado",
                        description: "Producto registrado correctamente.",
                    });
                    refetch();
                } else {
                    toast({
                        title: "Error",
                        description: "No se pudo crear el producto.",
                    });
                }
            },
        );
    }

    return (
        <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
            <form onSubmit={handleCreate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-slate-700 rounded-md bg-slate-800">
                    <label className="md:col-span-2block text-sm font-medium text-slate-200">
                        Nombre de producto
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm((s) => ({ ...s, name: e.target.value }))
                            }
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
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
                            className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                            placeholder="Descripcion del Producto"
                        />
                    </label>
                </div>
                <div className="max-w-md text-center mx-auto mt-4">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                    >
                        Crear Producto
                    </button>
                </div>
            </form>
        </div>
    );
}
