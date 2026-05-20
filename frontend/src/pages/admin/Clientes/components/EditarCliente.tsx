import { useEffect, useState } from "react";
import { useFetch, usePost, useToast } from "@/hooks";
import { Button } from "@/components/ui/Button";

export default function EditarCliente({
    clientId,
    initialClient,
    initialCalibration,
    refetch,
    onClose,
}: {
    clientId: any | null;
    initialClient?: any | null;
    initialCalibration?: any | null;
    refetch: () => void;
    onClose: () => void;
}) {
    const { response } = useFetch({
        url: clientId ? `/v1/clients/${clientId}` : "/v1/clients/0",
        enabled: Boolean(clientId),
    });

    const { execute } = usePost();
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [right_SP, setRight_SP] = useState("");
    const [right_CYL, setRight_CYL] = useState("");
    const [right_Axis, setRight_Axis] = useState("");
    const [left_SP, setLeft_SP] = useState("");
    const [left_CYL, setLeft_CYL] = useState("");
    const [left_Axis, setLeft_Axis] = useState("");
    const [showGraduaciones, setShowGraduaciones] = useState(false);
    const [calibrationId, setCalibrationId] = useState<any | null>(null);

    const fillCalibration = (calibration: any) => {
        if (!calibration) {
            setShowGraduaciones(false);
            setCalibrationId(null);
            setRight_SP("");
            setRight_CYL("");
            setRight_Axis("");
            setLeft_SP("");
            setLeft_CYL("");
            setLeft_Axis("");
            return;
        }

        setShowGraduaciones(true);
        setCalibrationId(calibration?.id ?? null);
        setRight_SP(String(calibration?.right_sp ?? ""));
        setRight_CYL(String(calibration?.right_cyl ?? ""));
        setRight_Axis(String(calibration?.right_axis ?? ""));
        setLeft_SP(String(calibration?.left_sp ?? ""));
        setLeft_CYL(String(calibration?.left_cyl ?? ""));
        setLeft_Axis(String(calibration?.left_axis ?? ""));
    };

    useEffect(() => {
        if (!initialClient) return;
        setName(initialClient?.name ?? "");
        setPhone(initialClient?.phone ?? "");
        setEmail(initialClient?.email ?? "");
        setAddress(initialClient?.address ?? "");
        fillCalibration(initialCalibration ?? null);
    }, [clientId, initialClient, initialCalibration]);

    useEffect(() => {
        const data = response?.data ?? response ?? {};
        const client = data?.cliente ?? data?.client ?? data;
        if (!client || !client?.id) return;

        setName(client?.name ?? "");
        setPhone(client?.phone ?? "");
        setEmail(client?.email ?? "");
        setAddress(client?.address ?? "");

        const calibration = client?.Calibration
            ? Array.isArray(client.Calibration)
                ? client.Calibration[0]
                : client.Calibration
            : null;

        // si el endpoint de cliente no trae los campos completos de graduación,
        // se conserva la precarga recibida desde la fila seleccionada.
        const hasCalibrationDetails =
            calibration &&
            (calibration?.right_sp !== undefined ||
                calibration?.right_cyl !== undefined ||
                calibration?.left_sp !== undefined ||
                calibration?.left_cyl !== undefined);

        if (hasCalibrationDetails) {
            fillCalibration(calibration);
        }
    }, [response]);

    const save = async () => {
        if (!clientId) return;

        const payload = {
            name,
            phone,
            email,
            address,
        };

        const res = await execute({
            url: `/v1/clients/${clientId}`,
            method: "patch",
            body: payload,
        });

        if (res?.ok) {
            toast({ title: "Éxito", description: "Cliente actualizado." });

            if (showGraduaciones) {
                const gradPayload = {
                    id_client: Number(clientId),
                    right_sp: Number(right_SP || 0),
                    right_cyl: Number(right_CYL || 0),
                    right_axis: Number(right_Axis || 0),
                    left_sp: Number(left_SP || 0),
                    left_cyl: Number(left_CYL || 0),
                    left_axis: Number(left_Axis || 0),
                    right_condition: "",
                    left_condition: "",
                };

                if (calibrationId) {
                    const resGrad = await execute({
                        url: `/v1/calibrations/${calibrationId}`,
                        method: "post",
                        body: gradPayload,
                    });
                    if (resGrad?.ok) {
                        toast({
                            title: "Éxito",
                            description: "Graduación actualizada.",
                        });
                    } else {
                        toast({
                            title: "Error",
                            description: "No se pudo actualizar la graduación.",
                        });
                    }
                } else {
                    const resGrad = await execute({
                        url: `/v1/calibrations`,
                        method: "post",
                        body: gradPayload,
                    });
                    if (resGrad?.ok) {
                        toast({
                            title: "Éxito",
                            description: "Graduación creada.",
                        });
                    } else {
                        toast({
                            title: "Error",
                            description: "No se pudo crear la graduación.",
                        });
                    }
                }
            }

            refetch();
            onClose();
            return;
        }

        toast({
            title: "Error",
            description: "No se pudo actualizar el cliente.",
        });
    };

    return (
        <div className="w-full space-y-6 rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-white">
                    Editar Cliente
                </h1>
                <p className="text-sm text-slate-400">
                    Modifica los datos del cliente
                </p>
            </div>

            <div className="space-y-4 p-4 border border-slate-700 rounded-md bg-slate-800">
                <label className="block text-sm font-medium text-slate-200">
                    Nombre de Cliente
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Nombre de Cliente"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Teléfono
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Teléfono"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Correo electrónico
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Correo electrónico"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Dirección
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Dirección"
                    />
                </label>
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-slate-200 cursor-pointer">
                <input
                    type="checkbox"
                    checked={showGraduaciones}
                    onChange={(e) => setShowGraduaciones(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-sky-500 cursor-pointer"
                />
                <span>Editar Graduación</span>
            </label>

            <div
                className={`${!showGraduaciones ? "hidden" : ""} grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-slate-700 rounded-md bg-slate-800`}
            >
                <label className="block text-sm font-medium text-slate-200">
                    Right SP
                    <input
                        value={right_SP}
                        onChange={(e) => setRight_SP(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Right SP"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Right CYL
                    <input
                        value={right_CYL}
                        onChange={(e) => setRight_CYL(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Right CYL"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Right Axis
                    <input
                        value={right_Axis}
                        onChange={(e) => setRight_Axis(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Right Axis"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Left SP
                    <input
                        value={left_SP}
                        onChange={(e) => setLeft_SP(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Left SP"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Left CYL
                    <input
                        value={left_CYL}
                        onChange={(e) => setLeft_CYL(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Left CYL"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-200">
                    Left Axis
                    <input
                        value={left_Axis}
                        onChange={(e) => setLeft_Axis(e.target.value)}
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                        placeholder="Left Axis"
                    />
                </label>
            </div>

            <div className="max-w-md text-center mx-auto flex gap-2">
                <Button onClick={save}>Guardar</Button>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
            </div>
        </div>
    );
}
