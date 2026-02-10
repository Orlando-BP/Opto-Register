type DetallesProductoProps = {
    product: any | null;
};

const fields: { key: string; label: string }[] = [
    { key: "name", label: "Nombre" },
    { key: "description", label: "Descripción" },
    { key: "value", label: "Precio" },
    { key: "stock", label: "Stock" },
    { key: "brand", label: "Marca" },
    { key: "category", label: "Categoría" },
];

const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined || value === "") return "—";

    if (key === "value" && typeof value === "number") {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            maximumFractionDigits: 2,
        }).format(value);
    }

    return String(value);
};

export default function DetallesProducto({ product }: DetallesProductoProps) {
    if (!product) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
                Selecciona un producto de la lista para ver los detalles.
            </div>
        );
    }

    const createdAt = product?.created_at ?? product?.createdAt;
    const updatedAt = product?.updated_at ?? product?.updatedAt;

    const formatDateTime = (value: any) => {
        if (!value) return "—";
        const dateValue =
            typeof value === "string" || typeof value === "number"
                ? new Date(value)
                : value;
        if (!(dateValue instanceof Date) || Number.isNaN(dateValue.getTime())) {
            return "—";
        }
        return dateValue.toLocaleString();
    };

    return (
        <div className="space-y-8">
            <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-semibold text-white">
                        Detalles del producto
                    </h1>
                    <p className="text-sm text-slate-400">
                        Información registrada en el sistema
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-md border border-slate-700 bg-slate-800 p-4 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            ID
                        </p>
                        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                            {formatValue("id", product?.id)}
                        </div>
                    </div>

                    {fields.map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                {label}
                            </p>
                            <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                                {formatValue(key, product?.[key])}
                            </div>
                        </div>
                    ))}

                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            Creado
                        </p>
                        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                            {formatDateTime(createdAt)}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            Actualizado
                        </p>
                        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                            {formatDateTime(updatedAt)}
                        </div>
                    </div>
                </div>
            </div>

            {product?.notes && (
                <div className="w-full space-y-3 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                    <div className="space-y-1 text-center">
                        <h2 className="text-xl font-semibold text-white">
                            Notas adicionales
                        </h2>
                        <p className="text-sm text-slate-400">
                            Información extra proporcionada en el registro
                        </p>
                    </div>
                    <p className="rounded-md border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100">
                        {String(product.notes)}
                    </p>
                </div>
            )}
        </div>
    );
}
