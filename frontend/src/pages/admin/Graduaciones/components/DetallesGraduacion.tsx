import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePost } from "@/hooks";
import { toast } from "@/hooks/useToast";

type DetallesGraduacionProps = {
    graduation: any | null;
};

const generalFields: { key: string; label: string }[] = [
    { key: "clientName", label: "Cliente" },
    { key: "age", label: "Edad" },
];

const measurementFields: { key: string; label: string }[] = [
    { key: "right_sp", label: "Right SP" },
    { key: "right_cyl", label: "Right CYL" },
    { key: "right_axis", label: "Right Axis" },
    { key: "left_sp", label: "Left SP" },
    { key: "left_cyl", label: "Left CYL" },
    { key: "left_axis", label: "Left Axis" },
];

const conditionFields: { key: string; label: string }[] = [
    { key: "right_condition", label: "Ojo derecho" },
    { key: "left_condition", label: "Ojo izquierdo" },
];

const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
};

const formatDate = (value: any) => {
    if (!value) return null;
    const dateValue =
        typeof value === "string" || typeof value === "number"
            ? new Date(value)
            : value;
    if (!(dateValue instanceof Date) || Number.isNaN(dateValue.getTime())) {
        return null;
    }
    return dateValue.toLocaleDateString();
};

export default function DetallesGraduacion({
    graduation,
}: DetallesGraduacionProps) {
    const { execute } = usePost();
    const calcularCondicion = async (graduation: any) => {
        const payload = {
            id_client: Number(graduation?.idClient),
            right_sp: Number(graduation?.right_sp),
            right_cyl: Number(graduation?.right_cyl),
            right_axis: Number(graduation?.right_axis),
            left_sp: Number(graduation?.left_sp),
            left_cyl: Number(graduation?.left_cyl),
            left_axis: Number(graduation?.left_axis),
            right_condition: graduation?.right_condition,
            left_condition: graduation?.left_condition,
        };

        const res = await execute({
            url: "/v1/calibrations/" + graduation?.id + "/condition",
            method: "post",
            body: payload,
        });

        if (res.status === 200) {
            toast({
                title: "Éxito",
                description: "Condicion detectada.",
            });
            return;
        }

        toast({
            title: "Error",
            description: "No se pudo registrar la graduación.",
        });
    };
    if (!graduation) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
                Selecciona una graduación de la lista para ver los detalles.
            </div>
        );
    }

    const registrationDate =
        graduation?.registration_date ?? graduation?.registrationDate;
    const formattedDate = formatDate(registrationDate);
    // console.log("Graduation details:", graduation);
    return (
        <div className="space-y-8">
            <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-semibold text-white">
                        Detalles de la graduación
                    </h1>
                    <p className="text-sm text-slate-400">
                        Información Del cliente y su graduacion
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-md border border-slate-700 bg-slate-800 p-4 md:grid-cols-3">
                    {generalFields.map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                {label}
                            </p>
                            <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                                {formatValue(graduation?.[key])}
                            </div>
                        </div>
                    ))}
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                            Fecha registro
                        </p>
                        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                            {formattedDate ?? "—"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                <div className="space-y-1 text-center">
                    <h2 className="text-xl font-semibold text-white">
                        Medición
                    </h2>
                    <p className="text-sm text-slate-400">
                        Valores registrados para ambos ojos
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {measurementFields.map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                {label}
                            </p>
                            <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                                {formatValue(graduation?.[key])}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border border-yellow-900/70 bg-yellow-950/60 p-6 text-yellow-100 shadow-lg shadow-yellow-900/40">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-900/70">
                        <AlertTriangle className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-sm uppercase tracking-wide text-yellow-200">
                                Condición Actual de los ojos
                            </p>
                            {graduation?.right_condition || graduation?.left_condition ? (
                                conditionFields.map(({ key, label }) => (
                                    <p className="text-lg font-semibold text-yellow-100" key={key}>
                                        {label}: {formatValue(graduation?.[key])}
                                    </p>
                                ))
                            ) : (
                                <p className="text-lg font-semibold text-yellow-100">
                                    No hay condiciones registradas
                                    <Button 
                                        // disabled={loading} 
                                        onClick={() => {
                                            calcularCondicion(graduation);
                                        }}
                                        className="w-full"
                                    >
                                        calcular condicion{/* {loading ? "Ingresando..." : "Ingresar"} */}
                                    </Button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>                
            </div>
        </div>
    );
}
