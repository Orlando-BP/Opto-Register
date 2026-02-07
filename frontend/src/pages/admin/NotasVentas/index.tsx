import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import RegistroNotasVentas from "@/pages/admin/NotasVentas/components/RegistroNotasVentas";
import ListaNotasVentas from "@/pages/admin/NotasVentas/components/ListaNotasVentas";
import { useFetch } from "@/hooks";

export default function NotasVentasPage() {
    const { response, loading, error, refetch } = useFetch({
        url: "/v1/salesnotes/admin",
    });

    const sales = Array.isArray(response?.data?.notas)
        ? response.data.notas
        : [];
    // const clients = Array.isArray(response?.data?.clients)
    //     ? response.data.clients
    //     : [];

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
                    <RegistroNotasVentas refetch={refetch} />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    <div className="space-y-6">
                        <ListaNotasVentas
                            sales={sales}
                            
                            loading={loading}
                            error={error}
                            refetch={refetch}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
