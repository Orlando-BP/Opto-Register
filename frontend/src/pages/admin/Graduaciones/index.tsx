import RegistroGraduacionForm from "@/pages/admin/Graduaciones/components/RegistroGraduacion";
import ListaGraduaciones from "@/pages/admin/Graduaciones/components/ListaGraduaciones";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useFetch } from "@/hooks";

export default function RegistroGraduacion() {
    const { response, loading, error, refetch } = useFetch({
        url: "/v1/calibrations",
    });
    const graduations = Array.isArray(response?.data) ? response?.data : [];

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

            <Tabs defaultValue="registro">
                <TabsList>
                    <TabsTrigger value="registro">Registrar</TabsTrigger>
                    <TabsTrigger value="lista">Lista</TabsTrigger>
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
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
