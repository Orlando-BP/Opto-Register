import RegistroClienteForm from "@/components/RegistroCliente";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useFetch } from "@/hooks";

export default function RegistroCliente() {
    const { response, loading, error } = useFetch({ url: "/v1/clients" });
    const clients = Array.isArray(response?.data) ? response?.data : [];

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">Clientes</h2>
                <p className="text-slate-400">
                    Registro y listado de clientes
                </p>
            </div>

            <Tabs defaultValue="registro">
                <TabsList>
                    <TabsTrigger value="registro">Registrar</TabsTrigger>
                    <TabsTrigger value="lista">Lista</TabsTrigger>
                </TabsList>

                <TabsContent value="registro" className="mt-4">
                    <RegistroClienteForm />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
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
                                            <tr key={client?.id} className="hover:bg-slate-800/50">
                                                <td className="px-3 py-2">{client?.id}</td>
                                                <td className="px-3 py-2">{client?.name}</td>
                                                <td className="px-3 py-2">{client?.phone}</td>
                                                <td className="px-3 py-2">{client?.email}</td>
                                                <td className="px-3 py-2">{client?.address}</td>
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
