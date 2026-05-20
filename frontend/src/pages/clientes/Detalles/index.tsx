import { useMemo, useState } from "react";
import { useFetch } from "@/hooks";
import { useSessionStore } from "@/stores/sessionStore";
import { ClienteNotaDetalle, ClienteNotasTable } from "@/components/ui/cliente-notas-table";

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


export default function DetallesClientes() {
    const user = useSessionStore((state) => state.user);
    const token = user?.token ?? null;
    const userId = user?.id ?? null;
    

    const { response, loading, error, refetch } = useFetch({
        url: `/v1/salesnotes/cliente/${userId}`,
        token,
        enabled: Boolean(token),
    });

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
