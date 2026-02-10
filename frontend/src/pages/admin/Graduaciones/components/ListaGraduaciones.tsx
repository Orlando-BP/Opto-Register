import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/Table";

type ListaGraduacionesProps = {
    graduations: any[];
    loading: boolean;
    error: any;
    refetch: () => void;
    onSelectGraduation?: (graduation: any) => void;
};

export default function ListaGraduaciones({
    graduations,
    loading,
    error,
    onSelectGraduation,
}: ListaGraduacionesProps) {
    const handleRowClick = (graduation: any) => {
        if (typeof onSelectGraduation === "function") {
            onSelectGraduation(graduation);
        }
    };

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
                    <Table className="min-w-full text-left text-sm text-slate-200">
                        <TableHeader className="text-xs uppercase text-slate-400">
                            <TableRow>
                                <TableHead className="px-3 py-2">ID</TableHead>
                                <TableHead className="px-3 py-2">
                                    Cliente
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Edad
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    R-SP
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    R-CYL
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    R-Axis
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    L-SP
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    L-CYL
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    L-Axis
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Fecha
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Editar
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Eliminar
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-slate-800">
                            {graduations.map((item: any) => (
                                <TableRow
                                    key={item?.id}
                                    className="cursor-pointer hover:bg-slate-800/50"
                                    onClick={() => handleRowClick(item)}
                                >
                                    <TableCell className="px-3 py-2">
                                        {item?.id}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.clientName}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.age}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.right_sp}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.right_cyl}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.right_axis}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.left_sp}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.left_cyl}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.left_axis}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {item?.registration_date}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        Editar
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        Eliminar
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
