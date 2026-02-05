import RegistroProducto from "@/pages/admin/Productos/components/RegistroProducto";
import ListaProductos from "@/pages/admin/Productos/components/ListaProductos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useFetch } from "@/hooks";

export default function ProductosPage() {
    const { response, loading, error, refetch } = useFetch({
        url: "/v1/products",
    });
    const products = Array.isArray(response?.data) ? response.data : [];

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">Productos</h2>
                <p className="text-slate-400">
                    Registro y listado de productos
                </p>
            </div>

            <Tabs defaultValue="registro">
                <TabsList>
                    <TabsTrigger value="registro">Registrar</TabsTrigger>
                    <TabsTrigger value="lista">Lista</TabsTrigger>
                </TabsList>

                <TabsContent value="registro" className="mt-4">
                    <RegistroProducto refetch={refetch} />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    <ListaProductos
                        products={products}
                        loading={loading}
                        error={error}
                        refetch={refetch}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
