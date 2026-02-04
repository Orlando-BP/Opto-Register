

export default function ListaClientes({ clients, loading, error, }: { clients: any[]; loading: boolean; error: any; refetch: () => void }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            {loading && (
                <p className="text-sm text-slate-400">Cargando clientes...</p>
            )}
            {error && (
                <p className="text-sm text-red-300">
                    No se pudieron cargar los clientes.
                </p>
            )}
            {!loading && !error && clients.length === 0 && (
                <p className="text-sm text-slate-400">
                    No hay clientes registrados.
                </p>
            )}

            {!loading && !error && clients.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-200">
                        <thead className="text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">Nombre</th>
                                <th className="px-3 py-2">Teléfono</th>
                                <th className="px-3 py-2">Correo</th>
                                <th className="px-3 py-2">Dirección</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {clients.map((client: any) => (
                                <tr
                                    key={client?.id}
                                    className="hover:bg-slate-800/50"
                                >
                                    <td className="px-3 py-2">{client?.id}</td>
                                    <td className="px-3 py-2">
                                        {client?.name}
                                    </td>
                                    <td className="px-3 py-2">
                                        {client?.phone}
                                    </td>
                                    <td className="px-3 py-2">
                                        {client?.email}
                                    </td>
                                    <td className="px-3 py-2">
                                        {client?.address}
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
