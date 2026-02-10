import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useFetch } from "@/hooks";
import DetallesCliente from "@/pages/admin/Clientes/components/DetallesCliente";
import ListaClientes from "@/pages/admin/Clientes/components/ListaClientes";
import RegistroClienteForm from "@/pages/admin/Clientes/components/RegistroCliente";

export default function RegistroCliente() {
    const { response, loading, error, refetch } = useFetch({
        url: "/v1/clients/admin",
        qs: {},
    });

    const clients = useMemo(() => {
        if (Array.isArray(response?.data?.clientes))
            return response?.data?.clientes;
        if (Array.isArray(response?.data)) return response?.data;
        return [];
    }, [response?.data]);

    const calibrations = useMemo(() => {
        if (Array.isArray(response?.data?.calibraciones))
            return response?.data?.calibraciones;
        return [];
    }, [response?.data]);

    const [activeTab, setActiveTab] = useState("registro");
    const [showDetailsTab, setShowDetailsTab] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [selectedCalibrations, setSelectedCalibrations] = useState<any[]>([]);

    const handleSelectClient = (client: any) => {
        if (!client) return;
        setSelectedClient(client);
        const clientCalibrations = Array.isArray(calibrations)
            ? calibrations.filter((item: any) => item?.id_client === client?.id)
            : [];
        setSelectedCalibrations(clientCalibrations);
        if (!showDetailsTab) {
            setShowDetailsTab(true);
        }
        setActiveTab("detalles");
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">Clientes</h2>
                <p className="text-slate-400">Registro y listado de clientes</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="registro">Registrar</TabsTrigger>
                    <TabsTrigger value="lista">Lista</TabsTrigger>
                    {showDetailsTab && (
                        <TabsTrigger value="detalles">
                            Detalles cliente
                        </TabsTrigger>
                    )}
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
                        onSelectClient={handleSelectClient}
                    />
                </TabsContent>

                {showDetailsTab && (
                    <TabsContent value="detalles" className="mt-4">
                        <DetallesCliente
                            client={selectedClient}
                            calibrations={selectedCalibrations}
                        />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
