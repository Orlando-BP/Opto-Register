import React from "react";

export default function ListaNotasVentas({
    sales,
    clients,
    loading,
    error,
    refetch,
}: {
    sales: any[];
    clients: any[];
    loading: boolean;
    error: any;
    refetch: () => void;
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
                                <th className="px-3 py-2">Cliente</th>
                                <th className="px-3 py-2">Total</th>
                                <th className="px-3 py-2">Anticipo</th>
                                <th className="px-3 py-2">Saldo</th>
                                <th className="px-3 py-2">Emisión</th>
                                <th className="px-3 py-2">Entrega</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {sales.map((s: any) => (
                                <tr
                                    key={s?.id}
                                    className="hover:bg-slate-800/50"
                                >
                                    <td className="px-3 py-2">{s?.id}</td>
                                    <td className="px-3 py-2">
                                        {s?.clientName ?? `#${s?.id_client}`}
                                    </td>
                                    <td className="px-3 py-2">
                                        {s?.total_price}
                                    </td>
                                    <td className="px-3 py-2">{s?.advance}</td>
                                    <td className="px-3 py-2">{s?.balance}</td>
                                    <td className="px-3 py-2">
                                        {s?.issue_date}
                                    </td>
                                    <td className="px-3 py-2">
                                        {s?.delivery_date}
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
