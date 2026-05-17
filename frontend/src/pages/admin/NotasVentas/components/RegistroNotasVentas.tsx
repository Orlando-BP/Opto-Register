import React, { useMemo, useState } from "react";
import { useFetch, usePost, useToast } from "@/hooks";
import { Button } from "@/components/ui/Button";

export default function RegistroNotasVentas({
    refetch,
}: {
    refetch: () => void;
}) {
    const { execute, loading } = usePost();
    const { toast } = useToast();
    const {
        response: clientsResponse,
        loading: clientsLoading,
        error: clientsError,
    } = useFetch({
        url: "/v1/clients",
    });
    const {
        response: productsResponse,
        loading: productsLoading,
        error: productsError,
    } = useFetch({
        url: "/v1/products",
    });

    const clients = useMemo(() => {
        if (Array.isArray(clientsResponse?.data)) return clientsResponse.data;
        if (Array.isArray(clientsResponse)) return clientsResponse as any[];
        return [];
    }, [clientsResponse]);

    const products = useMemo(() => {
        if (Array.isArray(productsResponse?.data)) return productsResponse.data;
        if (Array.isArray(productsResponse)) return productsResponse as any[];
        return [];
    }, [productsResponse]);

    const [form, setForm] = useState({
        issue_date: "",
        delivery_date: "",
        advance: "",
    });
    const [selectedClientId, setSelectedClientId] = useState("");
    const [items, setItems] = useState<
        Array<{ id: number; quantity: number; value: number; name?: string }>
    >([]);

    // temporary inputs for adding a product
    const [newProductId, setNewProductId] = useState<number | "">("");
    const [newQuantity, setNewQuantity] = useState<number>(1);
    const [newValue, setNewValue] = useState<number>(0);

    const addItem = (productId: number, quantity: number, value: number) => {
        const product = products.find((p: any) => p?.id === productId);
        if (!product) return;
        setItems((prev) => [
            ...prev,
            {
                id: productId,
                quantity: Number(quantity) || 1,
                value: Number(value) || Number(product?.value) || 0,
                name: product?.name,
            },
        ]);
        // reset new inputs
        setNewProductId("");
        setNewQuantity(1);
        setNewValue(0);
    };

    const updateItem = (
        index: number,
        patch: Partial<{ quantity: number; value: number }>,
    ) => {
        setItems((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], ...patch } as any;
            // remove if quantity invalid
            if (
                !Number.isFinite(copy[index].quantity) ||
                copy[index].quantity <= 0
            ) {
                copy.splice(index, 1);
            }
            return copy;
        });
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const totalPrice = useMemo(() => {
        return items.reduce((sum, it) => {
            const qty = Number(it.quantity) || 0;
            const val = Number(it.value) || 0;
            return sum + qty * val;
        }, 0);
    }, [items]);

    const advanceValue = useMemo(
        () => Number(form.advance) || 0,
        [form.advance],
    );
    const balance = useMemo(() => {
        const result = totalPrice - advanceValue;
        return Number.isFinite(result) ? Math.max(result, 0) : 0;
    }, [totalPrice, advanceValue]);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedClientId) {
            toast({
                title: "Selecciona un cliente",
                description: "Debes elegir un cliente para registrar la nota.",
            });
            return;
        }

        if (items.length === 0) {
            toast({
                title: "Selecciona productos",
                description:
                    "Debes añadir al menos un producto para calcular el total.",
            });
            return;
        }
        const productsPayload = items.map((it) => ({
            id: it.id,
            value: it.value,
            quantity: it.quantity,
        }));

        const payload = {
            id_client: Number(selectedClientId),
            issue_date: form.issue_date || null,
            delivery_date: form.delivery_date || null,
            total_price: totalPrice,
            advance: advanceValue,
            balance: Math.max(totalPrice - advanceValue, 0),
            products: productsPayload,
        };

        const res = await execute({
            url: "/v1/salesNotes",
            method: "post",
            body: payload,
        });

        if (res.ok) {
            setSelectedClientId("");
            setItems([]);
            setForm({
                issue_date: "",
                delivery_date: "",
                advance: "",
            });
            toast({
                title: "Nota de venta creada",
                description: "La nota de venta se creó correctamente.",
            });
            refetch();
            return;
        }

        toast({
            title: "Error",
            description: "No se pudo crear la nota de venta.",
        });
    }

    return (
        <form
            className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl"
            onSubmit={handleCreate}
        >
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">
                    Registro de Nota de Venta
                </h1>
                <p className="text-sm text-slate-400">
                    Ingresa los datos de la nota de venta
                </p>
            </div>

            <div className="space-y-4 rounded-md border border-slate-700 bg-slate-800 p-4">
                <label className="block text-sm font-medium text-slate-200">
                    Cliente
                    <select
                        value={selectedClientId}
                        onChange={(event) =>
                            setSelectedClientId(event.target.value)
                        }
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        disabled={clientsLoading || loading}
                    >
                        <option value="">Selecciona un cliente</option>
                        {clients.map((client: any) => (
                            <option key={client?.id} value={client?.id ?? ""}>
                                {client?.name ?? `Cliente #${client?.id}`}
                            </option>
                        ))}
                    </select>
                </label>
                {clientsError && (
                    <p className="text-xs text-red-300">
                        No se pudieron cargar los clientes.
                    </p>
                )}
                {clientsLoading && !clientsError && (
                    <p className="text-xs text-slate-400">
                        Cargando clientes disponibles...
                    </p>
                )}
            </div>

            <div className="space-y-4 rounded-md border border-slate-700 bg-slate-800 p-4">
                <p className="text-sm font-medium text-slate-200">Productos</p>
                {productsError && (
                    <p className="text-xs text-red-300">
                        No se pudieron cargar los productos.
                    </p>
                )}
                {productsLoading && !productsError && (
                    <p className="text-xs text-slate-400">
                        Cargando productos disponibles...
                    </p>
                )}
                <div className="space-y-3">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="block text-xs text-slate-300">
                                Producto
                            </label>
                            <select
                                value={String(newProductId)}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setNewProductId("");
                                        setNewValue(0);
                                        return;
                                    }
                                    const id = Number(val);
                                    setNewProductId(id);
                                    const prod = products.find(
                                        (p: any) => p?.id === id,
                                    );
                                    setNewValue(Number(prod?.value) || 0);
                                }}
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                            >
                                <option value="">Selecciona producto</option>
                                {products.map((p: any) => (
                                    <option key={p?.id} value={p?.id}>
                                        {p?.name} — $
                                        {Number(p?.value || 0).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-28">
                            <label className="block text-xs text-slate-300">
                                Cantidad
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={newQuantity}
                                onChange={(e) =>
                                    setNewQuantity(Number(e.target.value) || 1)
                                }
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-100"
                            />
                        </div>

                        <div className="w-36">
                            <label className="block text-xs text-slate-300">
                                Precio
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={newValue}
                                onChange={(e) =>
                                    setNewValue(Number(e.target.value) || 0)
                                }
                                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-100"
                            />
                        </div>

                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!newProductId) return;
                                    addItem(
                                        Number(newProductId),
                                        newQuantity,
                                        newValue,
                                    );
                                }}
                                className="mt-1 rounded bg-sky-600 px-3 py-2 text-sm text-white"
                            >
                                Añadir
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {items.map((it, idx) => (
                            <div
                                key={`${it.id}-${idx}`}
                                className="flex items-center justify-between gap-3 rounded-md border border-slate-700 bg-slate-900/50 p-3"
                            >
                                <div className="flex-1">
                                    <div className="font-medium text-slate-100">
                                        {it.name ?? `#${it.id}`}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        value={it.quantity}
                                        onChange={(e) =>
                                            updateItem(idx, {
                                                quantity:
                                                    Number(e.target.value) || 0,
                                            })
                                        }
                                        className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        value={it.value}
                                        onChange={(e) =>
                                            updateItem(idx, {
                                                value:
                                                    Number(e.target.value) || 0,
                                            })
                                        }
                                        className="w-28 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                                    />
                                    <div className="text-sm text-slate-200">
                                        ${(it.quantity * it.value).toFixed(2)}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(idx)}
                                        className="text-xs text-red-400"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                        {items.length === 0 && (
                            <p className="text-xs text-slate-400">
                                No hay productos añadidos.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-md border border-slate-700 bg-slate-800 p-4 md:grid-cols-2">
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
                        disabled={loading}
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
                        disabled={loading}
                    />
                </label>

                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-200">
                        Total calculado
                    </p>
                    <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                        ${totalPrice.toFixed(2)}
                    </div>
                </div>

                <label className="block text-sm font-medium text-slate-200">
                    Anticipo
                    <input
                        type="number"
                        min={0}
                        value={form.advance}
                        onChange={(e) =>
                            setForm((s) => ({
                                ...s,
                                advance: e.target.value,
                            }))
                        }
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                        placeholder="Anticipo"
                        disabled={loading}
                    />
                </label>

                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-200">
                        Saldo pendiente
                    </p>
                    <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                        ${balance.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto text-center">
                <Button
                    type="submit"
                    disabled={
                        loading ||
                        clientsLoading ||
                        productsLoading ||
                        !selectedClientId ||
                        items.length === 0
                    }
                >
                    {loading ? "Guardando..." : "Crear Nota"}
                </Button>
            </div>
        </form>
    );
}
