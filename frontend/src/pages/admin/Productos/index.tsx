import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { X } from "lucide-react";
import DetallesProducto from "@/pages/admin/Productos/components/DetallesProducto";
import ListaProductos from "@/pages/admin/Productos/components/ListaProductos";
import RegistroProducto from "@/pages/admin/Productos/components/RegistroProducto";
import { useFetch } from "@/hooks";

export default function ProductosPage() {
    const { response, loading, error, refetch } = useFetch({
        url: "/v1/products",
    });
    const products = useMemo(() => {
        if (Array.isArray(response?.data)) return response.data;
        return [];
    }, [response?.data]);

    const [activeTab, setActiveTab] = useState("registro");
    const [showDetailsTab, setShowDetailsTab] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const handleSelectProduct = (product: any) => {
        if (!product) return;
        setSelectedProduct(product);
        if (!showDetailsTab) {
            setShowDetailsTab(true);
        }
        setActiveTab("detalles");
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">Productos</h2>
                <p className="text-slate-400">
                    Registro y listado de productos
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="registro">Registrar</TabsTrigger>
                    <TabsTrigger value="lista">Lista</TabsTrigger>
                    {showDetailsTab && (
                        <TabsTrigger
                            value="detalles"
                            className="group flex items-center gap-2"
                        >
                            <span>Detalles producto</span>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setShowDetailsTab(false);
                                    setActiveTab("lista");
                                    setSelectedProduct(null);
                                }}
                                className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                aria-label="Cerrar detalles"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </TabsTrigger>
                    )}
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
                        onSelectProduct={handleSelectProduct}
                    />
                </TabsContent>

                {showDetailsTab && (
                    <TabsContent value="detalles" className="mt-4">
                        <DetallesProducto product={selectedProduct} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
