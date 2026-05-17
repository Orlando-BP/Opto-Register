type DetallesNotaVentaProps = {
    sale: any | null;
};

type FieldConfig = {
    key: string;
    label: string;
    formatter?: (value: any) => string;
};

const formatCurrency = (value: any) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "—";
    return `$${numeric.toFixed(2)}`;
};

const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
};

const formatDate = (value: any) => {
    if (!value) return null;
    const dateValue =
        typeof value === "string" || typeof value === "number"
            ? new Date(value)
            : value;
    if (!(dateValue instanceof Date) || Number.isNaN(dateValue.getTime())) {
        return null;
    }
    return dateValue.toLocaleDateString();
};

const fields: FieldConfig[] = [
    { key: "clientName", label: "Cliente" },
    { key: "total_price", label: "Total", formatter: formatCurrency },
    { key: "advance", label: "Anticipo", formatter: formatCurrency },
    { key: "balance", label: "Saldo", formatter: formatCurrency },
    { key: "code", label: "Código" },
];

export default function DetallesNotaVenta({ sale }: DetallesNotaVentaProps) {
    if (!sale) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
                Selecciona una nota de venta de la lista para ver los detalles.
            </div>
        );
    }

    const issueDate = sale?.issue_date ?? sale?.issueDate;
    const deliveryDate = sale?.delivery_date ?? sale?.deliveryDate;
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
                    <h1 className="text-2xl font-semibold text-white">
                        Detalles de la nota de venta
                    </h1>
                    <p className="text-sm text-slate-400">
                        Información registrada en el sistema
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-md border border-slate-700 bg-slate-800 p-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            Folio
                        </p>
                        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                            {formatValue(sale?.id)}
                        </div>
                    </div>

                    {fields.map(({ key, label, formatter }) => {
                        const value = sale?.[key];
                        const displayValue =
                            typeof formatter === "function"
                                ? formatter(value)
                                : formatValue(value);
                        return (
                            <div key={key} className="space-y-1">
                                <p className="text-xs uppercase tracking-wide text-slate-400">
                                    {label}
                                </p>
                                <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                                    {displayValue}
                                </div>
                            </div>
                        );
                    })}

                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            Fecha emisión
                        </p>
                        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                            {formatDate(issueDate) ?? "—"}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            Fecha entrega
                        </p>
                        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                            {formatDate(deliveryDate) ?? "—"}
                        </div>
                    </div>
                </div>
            </div>

            {Array.isArray(productItems) && productItems.length > 0 && (
                <div className="w-full space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                    <div className="space-y-1 text-center">
                        <h2 className="text-xl font-semibold text-white">
                            Productos incluidos
                        </h2>
                        <p className="text-sm text-slate-400">
                            Cada producto se muestra como una nota de venta
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {productItems.map((item: any, index: number) => {
                            const quantity = Number(item?.quantity ?? 1);
                            const price = Number(item?.value ?? item?.price ?? 0);
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
                                                    {formatValue(productDescription)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-slate-500">
                                            Nota #{formatValue(sale?.id)}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                                        <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                            <p className="text-xs uppercase text-slate-500">
                                                Cantidad
                                            </p>
                                            <p className="font-medium text-slate-900">
                                                {formatValue(quantity)}
                                            </p>
                                        </div>
                                        <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                            <p className="text-xs uppercase text-slate-500">
                                                Precio
                                            </p>
                                            <p className="font-medium text-slate-900">
                                                {formatCurrency(price)}
                                            </p>
                                        </div>
                                        <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
                                            <p className="text-xs uppercase text-slate-500">
                                                Total
                                            </p>
                                            <p className="font-medium text-slate-900">
                                                {formatCurrency(total)}
                                            </p>
                                        </div>
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
