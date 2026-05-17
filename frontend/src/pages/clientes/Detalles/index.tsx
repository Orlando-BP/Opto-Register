import { useMemo, useState } from "react";
import { useFetch } from "@/hooks";
import { useSessionStore } from "@/stores/sessionStore";

type SaleItem = {
    id?: number | string;
    id_client?: number | string | null;
    issue_date?: string | null;
    delivery_date?: string | null;
    total_price?: number | string | null;
    advance?: number | string | null;
    balance?: number | string | null;
    code?: string | null;
    ProductsNoteSale?: any[];
    products?: any[];
    details?: any[];
};

const formatCurrency = (value: any) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "—";
    return `$${numeric.toFixed(2)}`;
};

const formatDate = (value: any) => {
    if (!value) return "—";
    const dateValue =
        typeof value === "string" || typeof value === "number"
            ? new Date(value)
            : value;
    if (!(dateValue instanceof Date) || Number.isNaN(dateValue.getTime())) {
        return String(value);
    }
    return dateValue.toLocaleDateString();
};

const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
};

function InfoCard({ label, value }: { label: string; value: any }) {
    return (
        <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                {formatValue(value)}
            </div>
        </div>
    );
}

function InfoMiniCard({ label, value }: { label: string; value: any }) {
    return (
        <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <p className="font-medium text-slate-900">{formatValue(value)}</p>
        </div>
    );
}

function ClienteNotasTable({
    sales,
    loading,
    error,
    onSelectSale,
}: {
    sales: SaleItem[];
    loading: boolean;
    error: any;
    onSelectSale: (sale: SaleItem) => void;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            {loading && (
                <p className="text-sm text-slate-400">
                    Cargando notas de venta...
                </p>
            )}
            {error && (
                <p className="text-sm text-red-300">
                    No se pudieron cargar las notas de venta.
                </p>
            )}
            {!loading && !error && sales.length === 0 && (
                <p className="text-sm text-slate-400">No hay notas de venta.</p>
            )}

            {!loading && !error && sales.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-200">
                        <thead className="text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">Código</th>
                                <th className="px-3 py-2">Total</th>
                                <th className="px-3 py-2">Anticipo</th>
                                <th className="px-3 py-2">Saldo</th>
                                <th className="px-3 py-2">Emisión</th>
                                <th className="px-3 py-2">Entrega</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {sales.map((sale) => (
                                <tr
                                    key={sale?.id}
                                    className="cursor-pointer hover:bg-slate-800/50"
                                    onClick={() => onSelectSale(sale)}
                                >
                                    <td className="px-3 py-2">
                                        {formatValue(sale?.id)}
                                    </td>
                                    <td className="px-3 py-2">
                                        {formatValue(sale?.code)}
                                    </td>
                                    <td className="px-3 py-2">
                                        {formatCurrency(sale?.total_price)}
                                    </td>
                                    <td className="px-3 py-2">
                                        {formatCurrency(sale?.advance)}
                                    </td>
                                    <td className="px-3 py-2">
                                        {formatCurrency(sale?.balance)}
                                    </td>
                                    <td className="px-3 py-2">
                                        {formatDate(sale?.issue_date)}
                                    </td>
                                    <td className="px-3 py-2">
                                        {formatDate(sale?.delivery_date)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function ClienteNotaDetalle({ sale }: { sale: SaleItem | null }) {
    if (!sale) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
                Selecciona una nota de venta para ver los detalles.
            </div>
        );
    }

    const productItems = Array.isArray(sale?.ProductsNoteSale)
        ? sale.ProductsNoteSale
        : Array.isArray(sale?.products)
          ? sale.products
          : Array.isArray(sale?.details)
            ? sale.details
            : [];

    return (
        <div className="space-y-8">
            <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                <div className="space-y-1 text-center">
                    <h3 className="text-2xl font-semibold text-white">
                        Detalle de la nota de venta
                    </h3>
                    <p className="text-sm text-slate-400">
                        Vista tipo recibo con los productos incluidos
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-md border border-slate-700 bg-slate-800 p-4 md:grid-cols-2">
                    <InfoCard label="Folio" value={sale?.id} />
                    <InfoCard label="Código" value={sale?.code} />
                    <InfoCard
                        label="Total"
                        value={formatCurrency(sale?.total_price)}
                    />
                    <InfoCard
                        label="Anticipo"
                        value={formatCurrency(sale?.advance)}
                    />
                    <InfoCard
                        label="Saldo"
                        value={formatCurrency(sale?.balance)}
                    />
                    <InfoCard
                        label="Fecha emisión"
                        value={formatDate(sale?.issue_date)}
                    />
                    <InfoCard
                        label="Fecha entrega"
                        value={formatDate(sale?.delivery_date)}
                    />
                </div>
            </div>

            {productItems.length > 0 && (
                <div className="w-full space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                    <div className="space-y-1 text-center">
                        <h4 className="text-xl font-semibold text-white">
                            Productos incluidos
                        </h4>
                        <p className="text-sm text-slate-400">
                            Cada producto se muestra como una sección de recibo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {productItems.map((item: any, index: number) => {
                            const quantity = Number(item?.quantity ?? 1);
                            const price = Number(
                                item?.value ?? item?.price ?? 0,
                            );
                            const total = quantity * price;
                            const productName =
                                item?.Product?.name ??
                                item?.productName ??
                                item?.name;
                            const productDescription =
                                item?.Product?.description ?? item?.description;

                            return (
                                <div
                                    key={item?.id ?? `sale-detail-${index}`}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-800 shadow-sm"
                                >
                                    <div className="flex flex-col gap-3 border-b border-dashed border-slate-300 pb-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-wide text-slate-500">
                                                Producto
                                            </p>
                                            <p className="text-base font-semibold text-slate-900">
                                                {formatValue(productName)}
                                            </p>
                                            {productDescription && (
                                                <p className="text-xs text-slate-500">
                                                    {formatValue(
                                                        productDescription,
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-slate-500">
                                            Ítem #{index + 1}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                                        <InfoMiniCard
                                            label="Cantidad"
                                            value={quantity}
                                        />
                                        <InfoMiniCard
                                            label="Precio"
                                            value={formatCurrency(price)}
                                        />
                                        <InfoMiniCard
                                            label="Total"
                                            value={formatCurrency(total)}
                                        />
                                        <InfoMiniCard
                                            label="ID producto"
                                            value={
                                                item?.id_product ??
                                                item?.Product?.id
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DetallesClientes() {
    const user = useSessionStore((state) => state.user);
    const token = user?.token ?? null;

    const { response, loading, error, refetch } = useFetch({
        url: "/v1/salesnotes/cliente",
        token,
        enabled: Boolean(token),
    });

    const sales = useMemo(() => {
        const rawNotes = response?.data?.results ?? response?.data?.notas;
        const list = Array.isArray(rawNotes)
            ? rawNotes
            : Array.isArray(response?.data)
              ? response.data
              : [];

        return list.map((note: any) => ({
            ...note,
            issue_date: note?.issue_date ?? note?.issueDate ?? null,
            delivery_date: note?.delivery_date ?? note?.deliveryDate ?? null,
            ProductsNoteSale: Array.isArray(note?.ProductsNoteSale)
                ? note.ProductsNoteSale
                : [],
        }));
    }, [response?.data]);

    const [selectedSale, setSelectedSale] = useState<SaleItem | null>(null);

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    Mis notas de venta
                </h2>
                <p className="text-slate-400">
                    Selecciona una nota para ver sus detalles
                </p>
            </div>

            <ClienteNotasTable
                sales={sales}
                loading={loading}
                error={error}
                onSelectSale={setSelectedSale}
            />

            <ClienteNotaDetalle sale={selectedSale} />

            {!token && (
                <p className="text-sm text-amber-300">
                    No hay sesión activa. Inicia sesión para ver tus notas de
                    venta.
                </p>
            )}

            <button
                type="button"
                onClick={() => refetch()}
                className="hidden"
            />
        </div>
    );
}
