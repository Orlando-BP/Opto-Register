export default function ListaProductos({
    products,
    loading,
    error,
    refetch,
}: {
    products: any[];
    loading: boolean;
    error: any;
    refetch: () => void;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            {loading && (
                <p className="text-sm text-slate-400">Cargando productos...</p>
            )}
            {error && (
                <p className="text-sm text-red-300">
                    No se pudieron cargar los productos.
                </p>
            )}
            {!loading && !error && products.length === 0 && (
                <p className="text-sm text-slate-400">
                    No hay productos registrados.
                </p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-200">
                        <thead className="text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">Nombre</th>
                                <th className="px-3 py-2">Descripción</th>
                                <th className="px-3 py-2">Precio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {products.map((p: any) => (
                                <tr
                                    key={p?.id}
                                    className="hover:bg-slate-800/50"
                                >
                                    <td className="px-3 py-2">{p?.id}</td>
                                    <td className="px-3 py-2">{p?.name}</td>
                                    <td className="px-3 py-2">
                                        {p?.description}
                                    </td>
                                    <td className="px-3 py-2">{p?.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
