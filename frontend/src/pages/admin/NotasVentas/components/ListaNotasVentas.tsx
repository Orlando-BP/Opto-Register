import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/Table";

type ListaNotasVentasProps = {
    sales: any[];
    loading: boolean;
    error: any;
    refetch: () => void;
    onSelectSale?: (sale: any) => void;
};

export default function ListaNotasVentas({
    sales,
    loading,
    error,
    onSelectSale,
}: ListaNotasVentasProps) {
    const handleRowClick = (sale: any) => {
        if (typeof onSelectSale === "function") {
            onSelectSale(sale);
        }
    };

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
                    <Table className="min-w-full text-left text-sm text-slate-200">
                        <TableHeader className="text-xs uppercase text-slate-400">
                            <TableRow>
                                <TableHead className="px-3 py-2">ID</TableHead>
                                <TableHead className="px-3 py-2">
                                    Cliente
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Total
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Anticipo
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Saldo
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Emisión
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Entrega
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
                            {sales.map((s: any) => (
                                <TableRow
                                    key={s?.id}
                                    className="cursor-pointer hover:bg-slate-800/50"
                                    onClick={() => handleRowClick(s)}
                                >
                                    <TableCell className="px-3 py-2">
                                        {s?.id}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {s?.clientName ?? `#${s?.id_client}`}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {s?.total_price}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {s?.advance}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {s?.balance}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {s?.issue_date}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {s?.delivery_date}
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
