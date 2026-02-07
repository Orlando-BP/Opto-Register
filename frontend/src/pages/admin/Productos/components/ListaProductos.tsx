import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/Table";

export default function ListaProductos({
    products,
    loading,
    error,
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
                    <Table className="min-w-full text-left text-sm text-slate-200">
                        <TableHeader className="text-xs uppercase text-slate-400">
                            <TableRow>
                                <TableHead className="px-3 py-2">ID</TableHead>
                                <TableHead className="px-3 py-2">
                                    Nombre
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Descripción
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Precio
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
                            {products.map((p: any) => (
                                <TableRow
                                    key={p?.id}
                                    className="hover:bg-slate-800/50"
                                >
                                    <TableCell className="px-3 py-2">
                                        {p?.id}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {p?.name}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {p?.description}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {p?.value}
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
