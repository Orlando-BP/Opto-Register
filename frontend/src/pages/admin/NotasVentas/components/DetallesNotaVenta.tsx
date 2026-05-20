import { ClienteNotaDetalle } from "../../../../components/ui/cliente-notas-table";

type DetallesNotaVentaProps = {
    sale: any | null;
};

export default function DetallesNotaVenta({ sale }: DetallesNotaVentaProps) {
    return <ClienteNotaDetalle sale={sale} />;
}
