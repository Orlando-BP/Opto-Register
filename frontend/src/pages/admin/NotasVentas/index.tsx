import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { X } from "lucide-react";
import DetallesNotaVenta from "@/pages/admin/NotasVentas/components/DetallesNotaVenta";
import ListaNotasVentas from "@/pages/admin/NotasVentas/components/ListaNotasVentas";
import RegistroNotasVentas from "@/pages/admin/NotasVentas/components/RegistroNotasVentas";
import { useFetch } from "@/hooks";

export default function NotasVentasPage() {
    const { response, loading, error, refetch } = useFetch({
        url: "/v1/salesnotes/admin",
    });

    const sales = useMemo(() => {
        if (Array.isArray(response?.data?.notas)) return response.data.notas;
        if (Array.isArray(response?.data)) return response.data;
        return [];
    }, [response?.data]);

    const [activeTab, setActiveTab] = useState("registro");
    const [showDetailsTab, setShowDetailsTab] = useState(false);
    const [selectedSale, setSelectedSale] = useState<any | null>(null);

    const handleSelectSale = (sale: any) => {
        if (!sale) return;
        setSelectedSale(sale);
        if (!showDetailsTab) {
            setShowDetailsTab(true);
        }
        setActiveTab("detalles");
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    Notas de Venta
                </h2>
                <p className="text-slate-400">Crear y listar notas de venta</p>
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
                            <span>Detalles nota</span>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setShowDetailsTab(false);
                                    setActiveTab("lista");
                                    setSelectedSale(null);
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
                    <RegistroNotasVentas refetch={refetch} />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    <div className="space-y-6">
                        <ListaNotasVentas
                            sales={sales}
                            loading={loading}
                            error={error}
                            refetch={refetch}
                            onSelectSale={handleSelectSale}
                        />
                    </div>
                </TabsContent>

                {showDetailsTab && (
                    <TabsContent value="detalles" className="mt-4">
                        <DetallesNotaVenta sale={selectedSale} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
