export default function ListaGraduaciones({
    graduations,
    loading,
    error,
}: {
    graduations: any[];
    loading: boolean;
    error: any;
    refetch: () => void;
}) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            {loading && (
                <p className="text-sm text-slate-400">
                    Cargando graduaciones...
                </p>
            )}
            {error && (
                <p className="text-sm text-red-300">
                    No se pudieron cargar las graduaciones.
                </p>
            )}
            {!loading && !error && graduations.length === 0 && (
                <p className="text-sm text-slate-400">
                    No hay graduaciones registradas.
                </p>
            )}

            {!loading && !error && graduations.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-200">
                        <thead className="text-xs uppercase text-slate-400">
                            <tr>
                                <th className="px-3 py-2">ID</th>
                                <th className="px-3 py-2">Cliente</th>
                                <th className="px-3 py-2">Edad</th>
                                <th className="px-3 py-2">R-SP</th>
                                <th className="px-3 py-2">R-CYL</th>
                                <th className="px-3 py-2">R-Axis</th>
                                <th className="px-3 py-2">L-SP</th>
                                <th className="px-3 py-2">L-CYL</th>
                                <th className="px-3 py-2">L-Axis</th>
                                <th className="px-3 py-2">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {graduations.map((item: any) => (
                                <tr
                                    key={item?.id}
                                    className="hover:bg-slate-800/50"
                                >
                                    <td className="px-3 py-2">{item?.id}</td>
                                    <td className="px-3 py-2">
                                        {item?.clientName}
                                    </td>
                                    <td className="px-3 py-2">{item?.age}</td>
                                    <td className="px-3 py-2">
                                        {item?.right_sp}
                                    </td>
                                    <td className="px-3 py-2">
                                        {item?.right_cyl}
                                    </td>
                                    <td className="px-3 py-2">
                                        {item?.right_axis}
                                    </td>
                                    <td className="px-3 py-2">
                                        {item?.left_sp}
                                    </td>
                                    <td className="px-3 py-2">
                                        {item?.left_cyl}
                                    </td>
                                    <td className="px-3 py-2">
                                        {item?.left_axis}
                                    </td>
                                    <td className="px-3 py-2">
                                        {item?.registration_date}
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
