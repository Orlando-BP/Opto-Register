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
    const [selectedProducts, setSelectedProducts] = useState<
        Record<number, number>
    >({});

    const toggleProduct = (productId: number) => {
        setSelectedProducts((prev) => {
            const next = { ...prev };
            if (Object.prototype.hasOwnProperty.call(next, productId)) {
                delete next[productId];
            } else {
                next[productId] = 1;
            }
            return next;
        });
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setSelectedProducts((prev) => {
            const next = { ...prev };
            if (Number.isNaN(quantity) || quantity <= 0) {
                delete next[productId];
            } else {
                next[productId] = quantity;
            }
            return next;
        });
    };

    const totalPrice = useMemo(() => {
        return Object.entries(selectedProducts).reduce(
            (sum, [id, quantity]) => {
                const product = products.find(
                    (item: any) => item?.id === Number(id),
                );
                if (!product) return sum;
                const price = Number(product?.value) || 0;
                const qty = Number(quantity) || 0;
                return sum + price * qty;
            },
            0,
        );
    }, [selectedProducts, products]);

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

        if (Object.keys(selectedProducts).length === 0) {
            toast({
                title: "Selecciona productos",
                description:
                    "Debes añadir al menos un producto para calcular el total.",
            });
            return;
        }

        const payload = {
            id_client: Number(selectedClientId),
            issue_date: form.issue_date || null,
            delivery_date: form.delivery_date || null,
            total_price: totalPrice,
            advance: advanceValue,
            balance: Math.max(totalPrice - advanceValue, 0),
        };

        const res = await execute({
            url: "/v1/salesNotes",
            method: "post",
            body: payload,
        });

        if (res.ok) {
            setSelectedClientId("");
            setSelectedProducts({});
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
                    {products.map((product: any) => {
                        const isSelected = Object.prototype.hasOwnProperty.call(
                            selectedProducts,
                            product?.id,
                        );
                        const quantity = selectedProducts[product?.id] ?? 1;
                        return (
                            <div
                                key={product?.id}
                                className="flex flex-col gap-2 rounded-md border border-slate-700 bg-slate-900/50 p-3 md:flex-row md:items-center md:justify-between"
                            >
                                <label className="flex items-center gap-3 text-sm text-slate-200">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() =>
                                            toggleProduct(product?.id)
                                        }
                                        className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-500"
                                        disabled={productsLoading || loading}
                                    />
                                    <span className="font-medium">
                                        {product?.name ??
                                            `Producto #${product?.id}`}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        $
                                        {Number(product?.value || 0).toFixed(2)}
                                    </span>
                                </label>
                                {isSelected && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <label className="text-slate-300">
                                            Cantidad
                                            <input
                                                type="number"
                                                min={1}
                                                value={quantity}
                                                onChange={(event) =>
                                                    updateQuantity(
                                                        product?.id,
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                                className="ml-2 w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {products.length === 0 &&
                        !productsLoading &&
                        !productsError && (
                            <p className="text-xs text-slate-400">
                                No hay productos registrados.
                            </p>
                        )}
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
                        Object.keys(selectedProducts).length === 0
                    }
                >
                    {loading ? "Guardando..." : "Crear Nota"}
                </Button>
            </div>
        </form>
    );
}
