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
                                    className="rounded-lg border border-slate-600 bg-slate-900 p-4 text-slate-800 shadow-sm"
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
											label="Nombre"
											value={formatValue(productName)}
										/>
                                        <InfoMiniCard
                                            label="Precio"
                                            value={formatCurrency(price)}
                                        />
                                        <InfoMiniCard
                                            label="Total"
                                            value={formatCurrency(total)}
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
