import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { X } from "lucide-react";
import DetallesGraduacion from "@/pages/admin/Graduaciones/components/DetallesGraduacion";
import ListaGraduaciones from "@/pages/admin/Graduaciones/components/ListaGraduaciones";
import RegistroGraduacionForm from "@/pages/admin/Graduaciones/components/RegistroGraduacion";
import { useFetch } from "@/hooks";

export default function RegistroGraduacion() {
    const { response, loading, error, refetch } = useFetch({
        url: "/v1/calibrations",
    });
    const graduations = useMemo(() => {
        if (Array.isArray(response?.data)) return response?.data;
        if (Array.isArray(response)) return response as any[];
        return [];
    }, [response]);

    const [activeTab, setActiveTab] = useState("registro");
    const [showDetailsTab, setShowDetailsTab] = useState(false);
    const [selectedGraduation, setSelectedGraduation] = useState<any | null>(
        null,
    );

    const handleSelectGraduation = (graduation: any) => {
        if (!graduation) return;
        setSelectedGraduation(graduation);
        if (!showDetailsTab) {
            setShowDetailsTab(true);
        }
        setActiveTab("detalles");
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    Graduaciones
                </h2>
                <p className="text-slate-400">
                    Registro y listado de graduaciones
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
                            <span>Detalles graduación</span>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setShowDetailsTab(false);
                                    setActiveTab("lista");
                                    setSelectedGraduation(null);
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
                    <RegistroGraduacionForm refetch={refetch} />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    <ListaGraduaciones
                        graduations={graduations}
                        loading={loading}
                        error={error}
                        refetch={refetch}
                        onSelectGraduation={handleSelectGraduation}
                    />
                </TabsContent>

                {showDetailsTab && (
                    <TabsContent value="detalles" className="mt-4">
                        <DetallesGraduacion graduation={selectedGraduation} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
