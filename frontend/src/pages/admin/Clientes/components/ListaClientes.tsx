import { useState } from "react";
import Button from "@/components/ui/Button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/Table";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { usePost, useToast } from "@/hooks";
import { Edit, Trash2 } from "lucide-react";

export default function ListaClientes({
    clients,
    loading,
    error,
    refetch,
    onSelectClient,
}: {
    clients: any[];
    loading: boolean;
    error: any;
    refetch: () => void;
    onSelectClient?: (client: any) => void;
}) {
    const { execute } = usePost();
    const { toast } = useToast();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDelete = (id: string) => {
        setSelectedId(Number(id));
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedId === null) return;
        const res = await execute({
            url: `/v1/clients/${selectedId}`,
            method: "delete",
        });

        if (res?.status === 200 || res?.status === 204) {
            toast({
                title: "Éxito",
                description: "Cliente eliminado correctamente.",
            });
            setDeleteDialogOpen(false);
            refetch();
            return;
        }

        toast({
            title: "Error",
            description: "No se pudo eliminar el cliente.",
        });
    };

    const handleRowClick = (client: any) => {
        if (typeof onSelectClient === "function") {
            onSelectClient(client);
        }
    };

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
                    <Table className="min-w-full text-left text-sm text-slate-200">
                        <TableHeader className="text-xs uppercase text-slate-400">
                            <TableRow>
                                <TableHead className="px-3 py-2">ID</TableHead>
                                <TableHead className="px-3 py-2">
                                    Nombre
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Teléfono
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Correo
                                </TableHead>
                                <TableHead className="px-3 py-2">
                                    Dirección
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
                            {clients.map((client: any) => (
                                <TableRow
                                    key={client?.id}
                                    className="hover:bg-slate-800/50 cursor-pointer"
                                    onClick={() => handleRowClick(client)}
                                >
                                    <TableCell className="px-3 py-2">
                                        {client?.id}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {client?.name}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {client?.phone}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {client?.email}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        {client?.address}
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="px-3 py-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDelete(client?.id);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <ConfirmDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        title="Confirmar Borrado"
                        description="¿Estás seguro de que deseas Borrar el Cliente Seleccionado?"
                        okText="Borrar"
                        cancelText="Cancelar"
                        onOk={confirmDelete}
                        onCancel={() => setDeleteDialogOpen(false)}
                    />
                </div>
            )}
        </div>
    );
}
