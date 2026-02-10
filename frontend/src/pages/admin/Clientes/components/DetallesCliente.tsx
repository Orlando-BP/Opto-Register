import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

type DetallesClienteProps = {
    client: any | null;
    calibrations?: any[];
};

const fields: { key: string; label: string }[] = [
    { key: "name", label: "Nombre" },
    { key: "phone", label: "Teléfono" },
    { key: "email", label: "Correo" },
    { key: "address", label: "Dirección" },
];

const calibrationFields: { key: string; label: string }[] = [
    { key: "right_sp", label: "Right SP" },
    { key: "right_cyl", label: "Right CYL" },
    { key: "right_axis", label: "Right Axis" },
    { key: "left_sp", label: "Left SP" },
    { key: "left_cyl", label: "Left CYL" },
    { key: "left_axis", label: "Left Axis" },
];

const normalizeCalibrations = (client: any, calibrations?: any[]) => {
    const list: any[] = Array.isArray(calibrations) ? calibrations : [];
    const relation = client?.Calibration
        ? Array.isArray(client.Calibration)
            ? client.Calibration
            : [client.Calibration]
        : [];

    if (list.length === 0 && relation.length > 0) {
        return relation;
    }

    const listIds = new Set(
        list
            .map((item: any) => item?.id)
            .filter((value: any) => value !== undefined && value !== null),
    );

    const merged = [...list];
    for (const item of relation) {
        const itemId = item?.id;
        if (itemId === undefined || itemId === null || !listIds.has(itemId)) {
            merged.push(item);
            if (itemId !== undefined && itemId !== null) {
                listIds.add(itemId);
            }
        }
    }

    return merged;
};

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

export default function DetallesCliente({
    client,
    calibrations,
}: DetallesClienteProps) {
    const normalizedCalibrations = useMemo(
        () => normalizeCalibrations(client, calibrations),
        [client, calibrations],
    );

    if (!client) {
        return (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
                Selecciona un cliente de la lista para ver los detalles.
            </div>
        );
    }

    return (
        <div className="space-y-8">
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

            <div className="w-full space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                <div className="space-y-1 text-center">
                    <h2 className="text-xl font-semibold text-white">
                        Graduación
                    </h2>
                    <p className="text-sm text-slate-400">
                        Información de graduaciones asociadas al cliente
                    </p>
                </div>

                {normalizedCalibrations.length === 0 && (
                    <p className="text-center text-sm text-slate-400">
                        No se encontraron graduaciones registradas.
                    </p>
                )}

                {normalizedCalibrations.map(
                    (calibration: any, index: number) => {
                        const registrationDate =
                            calibration?.registration_date ||
                            calibration?.registrationDate;
                        const formattedDate = formatDate(registrationDate);

                        return (
                            <div
                                key={calibration?.id ?? `calibration-${index}`}
                                className="space-y-4 rounded-lg border border-slate-700 bg-slate-800 p-4"
                            >
                                <div className="flex flex-col gap-2 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
                                    <span>
                                        ID Calibración:{" "}
                                        {formatValue(calibration?.id)}
                                    </span>
                                    <span>
                                        Edad: {formatValue(calibration?.age)}
                                    </span>
                                    {formattedDate && (
                                        <span>
                                            Fecha registro: {formattedDate}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    {calibrationFields.map(({ key, label }) => (
                                        <div key={key} className="space-y-1">
                                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                                {label}
                                            </p>
                                            <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                                                {formatValue(
                                                    calibration?.[key],
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    },
                )}
            </div>

                    <div className="rounded-xl border border-yellow-900/70 bg-yellow-950/60 p-6 text-yellow-100 shadow-lg shadow-yellow-900/40">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-900/70">
                                <AlertTriangle className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-sm uppercase tracking-wide text-yellow-200">
                                    Condición detectada
                                </p>
                                <p className="text-lg font-semibold text-yellow-100">
                                    Miopía
                                </p>
                            </div>
                        </div>
                    </div>

        </div>
    );
}
