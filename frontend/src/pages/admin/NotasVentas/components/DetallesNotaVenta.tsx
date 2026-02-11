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
    const productItems = Array.isArray(sale?.Products)
        ? sale.Products
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
                            Lista de productos asociados a la nota
                        </p>
                    </div>

                    <div className="space-y-3">
                        {productItems.map((item: any, index: number) => {
                            const quantity = item?.quantity;
                            const price = item?.price ?? item?.value;
                            const total = item?.total;
                            return (
                                <div
                                    key={item?.id ?? `sale-detail-${index}`}
                                    className="flex flex-col gap-2 rounded-lg border border-slate-700 bg-slate-800 p-4 text-sm text-slate-200 md:flex-row md:items-center md:justify-between"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {formatValue(
                                                item?.productName ?? item?.name,
                                            )}
                                        </p>
                                        {item?.description && (
                                            <p className="text-xs text-slate-400">
                                                {formatValue(item.description)}
                                            </p>
                                        )}
                                        {quantity !== undefined && (
                                            <p className="text-xs text-slate-400">
                                                Cantidad:{" "}
                                                {formatValue(quantity)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <span>
                                            Precio: {formatCurrency(price)}
                                        </span>
                                        {total !== undefined &&
                                            total !== null && (
                                                <span>
                                                    Total:{" "}
                                                    {formatCurrency(total)}
                                                </span>
                                            )}
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
