import { Info } from "lucide-react";
import { InfoCard, InfoMiniCard } from "./info-card";

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

const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
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

export function ClienteNotasTable({
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

export function ClienteNotaDetalle({ sale }: { sale: SaleItem | null }) {
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

    const rows = productItems.map((item: any) => {
        const qty = Number(item?.quantity ?? 1);
        const price = Number(item?.value ?? item?.price ?? 0);
        const total = qty * price;
        const description =
            item?.Product?.name ?? item?.productName ?? item?.name ?? "Item";
        const descExtra = item?.Product?.description ?? item?.description ?? "";
        return { qty, price, total, description, descExtra };
    });

    const subtotal = rows.reduce((s, r) => s + r.total, 0);
    const reportedTotal = Number(sale?.total_price ?? 0);
    const tax =
        reportedTotal && reportedTotal > subtotal
            ? reportedTotal - subtotal
            : 0;
    const total = reportedTotal || subtotal + tax;

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-sm text-slate-400">Nota de venta</p>
                    <h2 className="text-2xl font-semibold text-white">
                        Folio #{formatValue(sale?.id)}
                    </h2>
                    <p className="text-xs text-slate-500">
                        Código: {formatValue(sale?.code)}
                    </p>
                </div>

                <div className="text-sm text-slate-400">
                    <div>
                        Emitida:{" "}
                        <span className="text-slate-200">
                            {formatDate(sale?.issue_date)}
                        </span>
                    </div>
                    <div>
                        Entrega:{" "}
                        <span className="text-slate-200">
                            {formatDate(sale?.delivery_date)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-md border border-slate-700 bg-slate-800 p-4">
                    <p className="text-xs uppercase text-slate-400">De</p>
                    <p className="font-medium text-slate-200">
                        Tienda / Optica
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        Dirección y datos de la tienda
                    </p>
                </div>
                <div className="rounded-md border border-slate-700 bg-slate-800 p-4">
                    <p className="text-xs uppercase text-slate-400">Para</p>
                    <p className="font-medium text-slate-200">
                        Cliente #{formatValue(sale?.id_client)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        Información del cliente
                    </p>
                </div>
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-200">
                    <thead className="text-xs text-slate-400">
                        <tr>
                            <th className="px-3 py-2">Descripción</th>
                            <th className="px-3 py-2">Cantidad</th>
                            <th className="px-3 py-2">Precio</th>
                            <th className="px-3 py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {rows.map((r, i) => (
                            <tr key={i} className="align-top">
                                <td className="px-3 py-3 align-top">
                                    <div className="font-medium text-slate-100">
                                        {formatValue(r.description)}
                                    </div>
                                    {r.descExtra && (
                                        <div className="text-xs text-slate-400">
                                            {formatValue(r.descExtra)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-3 py-3 align-top">{r.qty}</td>
                                <td className="px-3 py-3 align-top">
                                    {formatCurrency(r.price)}
                                </td>
                                <td className="px-3 py-3 text-right align-top">
                                    {formatCurrency(r.total)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end md:items-center">
                <div className="w-full md:w-1/2">
                    <div className="rounded-md border border-slate-700 bg-slate-800 p-4">
                        <div className="flex justify-between text-sm text-slate-400">
                            <div>Subtotal</div>
                            <div className="text-slate-200">
                                {formatCurrency(subtotal)}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-slate-400 mt-2">
                            <div>Impuestos</div>
                            <div className="text-slate-200">
                                {formatCurrency(tax)}
                            </div>
                        </div>
                        <div className="flex justify-between text-lg font-semibold text-white mt-4">
                            <div>Total</div>
                            <div>{formatCurrency(total)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
