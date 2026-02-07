import RegistroClienteForm from "@/pages/admin/Clientes/components/RegistroCliente";
import ListaClientes from "@/pages/admin/Clientes/components/ListaClientes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useFetch } from "@/hooks";

export default function RegistroCliente() {
    
    const { response, loading, error, refetch } = useFetch({
        url: "/v1/clients",
        qs: {},
    });
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
                    <RegistroClienteForm refetch={refetch} />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    <ListaClientes 
                        clients={clients}
                        loading={loading}
                        error={error}
                        refetch={refetch}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
