type DetallesNotaVentaProps = {
    sale: any | null;
};

const fields: { key: string; label: string }[] = [
    { key: "clientName", label: "Cliente" },
    { key: "total_price", label: "Total" },
    { key: "advance", label: "Anticipo" },
    { key: "balance", label: "Saldo" },
];

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

                    {fields.map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                {label}
                            </p>
                            <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                                {formatValue(sale?.[key])}
                            </div>
                        </div>
                    ))}

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

            {Array.isArray(sale?.details) && sale.details.length > 0 && (
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
                        {sale.details.map((item: any, index: number) => (
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
                                    <p className="text-xs text-slate-400">
                                        Cantidad: {formatValue(item?.quantity)}
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <span>
                                        Precio: {formatValue(item?.price)}
                                    </span>
                                    <span>
                                        Total: {formatValue(item?.total)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
