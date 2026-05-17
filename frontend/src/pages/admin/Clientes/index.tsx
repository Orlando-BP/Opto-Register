import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { X } from "lucide-react";
import { useFetch } from "@/hooks";
import DetallesCliente from "@/pages/admin/Clientes/components/DetallesCliente";
import ListaClientes from "@/pages/admin/Clientes/components/ListaClientes";
import RegistroClienteForm from "@/pages/admin/Clientes/components/RegistroCliente";
import EditarCliente from "@/pages/admin/Clientes/components/EditarCliente";

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
    const [showEditTab, setShowEditTab] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any | null>(null);
    const [selectedClientForEdit, setSelectedClientForEdit] = useState<
        any | null
    >(null);
    const [selectedCalibrationForEdit, setSelectedCalibrationForEdit] =
        useState<any | null>(null);
    const [selectedClientIdForEdit, setSelectedClientIdForEdit] = useState<
        any | null
    >(null);
    const [selectedCalibrations, setSelectedCalibrations] = useState<any[]>([]);

    const selectedClientNameForEdit = useMemo(() => {
        if (selectedClientForEdit?.name) return selectedClientForEdit.name;
        const fallbackClient = clients.find(
            (item: any) => item?.id === selectedClientIdForEdit,
        );
        return fallbackClient?.name ?? "";
    }, [clients, selectedClientForEdit, selectedClientIdForEdit]);

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

    const handleEditClient = (client: any) => {
        const clientId = client?.id;
        if (!clientId) return;

        const clientCalibrations = Array.isArray(calibrations)
            ? calibrations.filter(
                  (item: any) =>
                      item?.id_client === clientId ||
                      item?.idClient === clientId,
              )
            : [];

        setSelectedClientForEdit(client);
        setSelectedCalibrationForEdit(clientCalibrations[0] ?? null);
        setSelectedClientIdForEdit(clientId);
        if (!showEditTab) setShowEditTab(true);
        setActiveTab("editar");
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
                    {showEditTab && (
                        <TabsTrigger
                            value="editar"
                            className="group flex items-center gap-2"
                        >
                            <span>
                                Editando cliente
                                {selectedClientNameForEdit
                                    ? `: ${selectedClientNameForEdit}`
                                    : ""}
                            </span>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setShowEditTab(false);
                                    setActiveTab("lista");
                                    setSelectedClientIdForEdit(null);
                                    setSelectedClientForEdit(null);
                                    setSelectedCalibrationForEdit(null);
                                }}
                                className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                aria-label="Cerrar editar"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </TabsTrigger>
                    )}
                    {showDetailsTab && (
                        <TabsTrigger
                            value="detalles"
                            className="group flex items-center gap-2"
                        >
                            <span>Detalles cliente</span>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    setShowDetailsTab(false);
                                    setActiveTab("lista");
                                    setSelectedClient(null);
                                    setSelectedCalibrations([]);
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
                    <RegistroClienteForm refetch={refetch} />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    <ListaClientes
                        clients={clients}
                        loading={loading}
                        error={error}
                        refetch={refetch}
                        onSelectClient={handleSelectClient}
                        onEditClient={handleEditClient}
                    />
                </TabsContent>

                {showEditTab && (
                    <TabsContent value="editar" className="mt-4">
                        <EditarCliente
                            clientId={selectedClientIdForEdit}
                            initialClient={selectedClientForEdit}
                            initialCalibration={selectedCalibrationForEdit}
                            refetch={refetch}
                            onClose={() => {
                                setShowEditTab(false);
                                setActiveTab("lista");
                                setSelectedClientIdForEdit(null);
                                setSelectedClientForEdit(null);
                                setSelectedCalibrationForEdit(null);
                            }}
                        />
                    </TabsContent>
                )}

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
