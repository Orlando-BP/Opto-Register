import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import RegistroNotasVentas from "@/components/RegistroNotasVentas";
import { usePost, useToast, useFetch } from "@/hooks";
import { describe } from "node:test";

type SaleNote = {
    id: number;
    id_client: number | null;
    issue_date: string | null;
    delivery_date: string | null;
    total_price: number;
    advance: number;
    balance: number;
};

export default function NotasVentasPage() {
    const { execute } = usePost();
    const { toast } = useToast();
    const [form, setForm] = useState({
        id_client: "",
        issue_date: "",
        delivery_date: "",
        total_price: "",
        advance: "",
    });

    const { response, loading, error, refetch } = useFetch({
        url: "/v1/salesnotes/admin",
    });

    const sales: SaleNote[] = Array.isArray(response?.data?.notas)
        ? response.data.notas
        : [];

    const clientes = Array.isArray(response?.data?.clients)
        ? response.data.clients
        : [];
    console.log(clientes);

    async function handleCreate(event: React.FormEvent) {
        event.preventDefault();
        const payload = {
            id_client: form.id_client ? Number(form.id_client) : null,
            issue_date: form.issue_date || null,
            delivery_date: form.delivery_date || null,
            total_price: Number(form.total_price) || 0,
            advance: Number(form.advance) || 0,
            balance:
                (Number(form.total_price) || 0) - (Number(form.advance) || 0),
        };
        execute({
            url: "/v1/salesNotes",
            method: "post",
            body: payload,
        }).then((res) => {
            if (res.ok) {
                setForm({
                    id_client: "",
                    issue_date: "",
                    delivery_date: "",
                    total_price: "",
                    advance: "",
                });
                toast({
                    title: "Nota de venta creada",
                    description: "La nota de venta se creó correctamente.",
                });
                refetch();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo crear la nota de venta.",
                });
            }
        });
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    Notas de Venta
                </h2>
                <p className="text-slate-400">Crear y listar notas de venta</p>
            </div>

            <Tabs defaultValue="registro">
                <TabsList>
                    <TabsTrigger value="registro">Registrar</TabsTrigger>
                    <TabsTrigger value="lista">Lista</TabsTrigger>
                </TabsList>

                <TabsContent value="registro" className="mt-4">
                    <RegistroNotasVentas
                        form={form}
                        setForm={setForm}
                        onSubmit={handleCreate}
                        clients={clientes}
                    />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                        {loading && (
                            <p className="text-sm text-slate-400">
                                Cargando notas...
                            </p>
                        )}
                        {error && (
                            <p className="text-sm text-red-300">
                                No se pudieron cargar las notas.
                            </p>
                        )}

                        {!loading && !error && sales.length === 0 && (
                            <p className="text-sm text-slate-400">
                                No hay notas registradas.
                            </p>
                        )}

                        {!loading && !error && sales.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm text-slate-200">
                                    <thead className="text-xs uppercase text-slate-400">
                                        <tr>
                                            <th className="px-3 py-2">ID</th>
                                            <th className="px-3 py-2">
                                                Cliente
                                            </th>
                                            <th className="px-3 py-2">
                                                Emitida
                                            </th>
                                            <th className="px-3 py-2">
                                                Entrega
                                            </th>
                                            <th className="px-3 py-2">Total</th>
                                            <th className="px-3 py-2">
                                                Anticipo
                                            </th>
                                            <th className="px-3 py-2">Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {sales.map((s) => (
                                            <tr
                                                key={s.id}
                                                className="hover:bg-slate-800/50"
                                            >
                                                <td className="px-3 py-2">
                                                    {s.id}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {s.id_client ?? "-"}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {s.issue_date ?? "-"}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {s.delivery_date ?? "-"}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {s.total_price}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {s.advance}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {s.balance}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
