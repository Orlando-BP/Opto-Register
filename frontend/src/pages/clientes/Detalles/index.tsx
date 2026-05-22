import { useMemo, useState } from "react";
import { useFetch } from "@/hooks";
import { useSessionStore } from "@/stores/sessionStore";
import { ClienteNotaDetalle, ClienteNotasTable } from "@/components/ui/cliente-notas-table";
import { AlertTriangle } from "lucide-react";

type SaleItem = {
    id?: number | string;
    id_client?: number | string | null;
    issue_date?: string | null;
    delivery_date?: string | null;
    total_price?: number | string | null;
    advance?: number | string | null;
    balance?: number | string | null;
    code?: string | null;
    ProductsNoteSale?: any[];
    products?: any[];
    details?: any[];
};


const fields: { key: string; label: string }[] = [
    { key: "name", label: "Nombre" },
    { key: "phone", label: "Teléfono" },
    { key: "email", label: "Correo" },
    { key: "address", label: "Dirección" },
];

const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
};

export default function DetallesClientes() {
    const user = useSessionStore((state) => state.user);
    const token = user?.token ?? null;
    const userId = user?.id ?? null;
    

    const { response, loading, error, refetch } = useFetch({
        url: `/v1/salesnotes/cliente/${userId}`,
        token,
        enabled: Boolean(token),
    });

    const { response: response2 } = useFetch({
        url: `/v1/clients/${userId}`,
        token,
        enabled: Boolean(token),
    });

    const { response: response3 } = useFetch({
        url: `/v1/calibrations/`,
        token,
        qs:{
            id_client: `${userId}`
        },
        enabled: Boolean(token),
    });

    const calibration = response3?.data

    const userID = Number(`${userId}`)
    let condition
    if(calibration){
        condition = calibration.find((item: any) => item.idClient === userID)
    }

    const client = response2?.data
 
    
    const sales = useMemo(() => {
        const rawNotes = response?.data?.results ?? response?.data?.notas;
        const list = Array.isArray(rawNotes)
            ? rawNotes
            : Array.isArray(response?.data)
              ? response.data
              : [];

        return list.map((note: any) => ({
            ...note,
            issue_date: note?.issue_date ?? note?.issueDate ?? null,
            delivery_date: note?.delivery_date ?? note?.deliveryDate ?? null,
            ProductsNoteSale: Array.isArray(note?.ProductsNoteSale)
                ? note.ProductsNoteSale
                : [],
        }));
    }, [response?.data]);

    const [selectedSale, setSelectedSale] = useState<SaleItem | null>(null);

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
            
            <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-semibold text-white">
                        Detalles del cliente
                    </h1>
                    <p className="text-sm text-slate-400">
                        Información registrada en el sistema
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 p-4 rounded-md border border-slate-700 bg-slate-800 md:grid-cols-2">
                    {fields.map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                {label}
                            </p>
                            <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                                {formatValue(client?.[key])}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {condition && (
            <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-900/70">
                    <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                    <p className="text-sm uppercase tracking-wide text-yellow-200">
                        Condición Actual de los ojos
                    </p>
                    <p className="text-lg font-semibold text-yellow-100"> Ojo derecho: {condition.right_condition}</p>
                    <p className="text-lg font-semibold text-yellow-100"> Ojo izquierdo: {condition.left_condition}</p>
                    
                    
                </div>
            </div>
            )
            }
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    Mis notas de venta
                </h2>
                <p className="text-slate-400">
                    Selecciona una nota para ver sus detalles
                </p>
            </div>
            <ClienteNotasTable
                sales={sales}
                loading={loading}
                error={error}
                onSelectSale={setSelectedSale}
            />

            <ClienteNotaDetalle sale={selectedSale} />

            {!token && (
                <p className="text-sm text-amber-300">
                    No hay sesión activa. Inicia sesión para ver tus notas de
                    venta.
                </p>
            )}

            <button
                type="button"
                onClick={() => refetch()}
                className="hidden"
            />
        </div>
    );
}
