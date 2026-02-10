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

    return (
        <div className="space-y-8">
            <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-semibold text-white">
                        Detalles de la graduación
                    </h1>
                    <p className="text-sm text-slate-400">
                        Información registrada en el sistema
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
            </div>
        </div>
    );
}
