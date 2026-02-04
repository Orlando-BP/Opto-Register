import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import RegistroNotasVentas from "@/pages/admin/NotasVentas/components/RegistroNotasVentas";
import ListaNotasVentas from "@/pages/admin/NotasVentas/components/ListaNotasVentas";
import { usePost, useToast, useFetch } from "@/hooks";

export default function NotasVentasPage() {
    const { execute } = usePost();
    const { toast } = useToast();
    const [form, setForm] = useState({
        id_client: "",
        issue_date: "",
        delivery_date: "",
        total_price: "",
        advance: "",
    });

    const { response, loading, error, refetch } = useFetch({
        url: "/v1/salesnotes/admin",
    });

    const clientes = Array.isArray(response?.data?.clients)
        ? response.data.clients
        : [];

    async function handleCreate(event: React.FormEvent) {
        event.preventDefault();
        const payload = {
            id_client: form.id_client ? Number(form.id_client) : null,
            issue_date: form.issue_date || null,
            delivery_date: form.delivery_date || null,
            total_price: Number(form.total_price) || 0,
            advance: Number(form.advance) || 0,
            balance:
                (Number(form.total_price) || 0) - (Number(form.advance) || 0),
        };
        execute({
            url: "/v1/salesNotes",
            method: "post",
            body: payload,
        }).then((res) => {
            if (res.ok) {
                setForm({
                    id_client: "",
                    issue_date: "",
                    delivery_date: "",
                    total_price: "",
                    advance: "",
                });
                toast({
                    title: "Nota de venta creada",
                    description: "La nota de venta se creó correctamente.",
                });
                refetch();
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo crear la nota de venta.",
                });
            }
        });
    }

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
                    <RegistroNotasVentas
                        form={form}
                        setForm={setForm}
                        onSubmit={handleCreate}
                        clients={clientes}
                    />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    {/* Lista con formulario embebido */}
                    
                    <div className="space-y-6">
                        
                        <ListaNotasVentas
                            fetchResult={{ response, loading, error, refetch }}
                            form={form}
                            setForm={setForm}
                            onSubmit={handleCreate}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
