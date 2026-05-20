const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
};

export function InfoCard({ label, value }: { label: string; value: any }) {
    return (
        <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100">
                {formatValue(value)}
            </div>
        </div>
    );
}

export function InfoMiniCard({ label, value }: { label: string; value: any }) {
    return (
        <div className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2">
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <p className="font-medium text-slate-100">{formatValue(value)}</p>
        </div>
    );
}
