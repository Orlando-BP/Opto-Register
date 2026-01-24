import RegistroGraduacionForm from "@/components/RegistroGraduacion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetch } from "@/hooks";

export default function RegistroGraduacion() {
    const { response, loading, error } = useFetch({ url: "/v1/calibrations" });
    const graduations = Array.isArray(response?.data) ? response?.data : [];

    return (
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-16">
            <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">
                    Graduaciones
                </h2>
                <p className="text-slate-400">
                    Registro y listado de graduaciones
                </p>
            </div>

            <Tabs defaultValue="registro">
                <TabsList>
                    <TabsTrigger value="registro">Registrar</TabsTrigger>
                    <TabsTrigger value="lista">Lista</TabsTrigger>
                </TabsList>

                <TabsContent value="registro" className="mt-4">
                    <RegistroGraduacionForm />
                </TabsContent>

                <TabsContent value="lista" className="mt-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
                        {loading && (
                            <p className="text-sm text-slate-400">
                                Cargando graduaciones...
                            </p>
                        )}
                        {error && (
                            <p className="text-sm text-red-300">
                                No se pudieron cargar las graduaciones.
                            </p>
                        )}
                        {!loading && !error && graduations.length === 0 && (
                            <p className="text-sm text-slate-400">
                                No hay graduaciones registradas.
                            </p>
                        )}

                        {!loading && !error && graduations.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm text-slate-200">
                                    <thead className="text-xs uppercase text-slate-400">
                                        <tr>
                                            <th className="px-3 py-2">ID</th>
                                            <th className="px-3 py-2">
                                                Cliente
                                            </th>
                                            <th className="px-3 py-2">Edad</th>
                                            <th className="px-3 py-2">R-SP</th>
                                            <th className="px-3 py-2">R-CYL</th>
                                            <th className="px-3 py-2">
                                                R-Axis
                                            </th>
                                            <th className="px-3 py-2">L-SP</th>
                                            <th className="px-3 py-2">L-CYL</th>
                                            <th className="px-3 py-2">
                                                L-Axis
                                            </th>
                                            <th className="px-3 py-2">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {graduations.map((item: any) => (
                                            <tr
                                                key={item?.id}
                                                className="hover:bg-slate-800/50"
                                            >
                                                <td className="px-3 py-2">
                                                    {item?.id}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.idClient}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.age}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.right_SP}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.right_CYL}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.right_Axis}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.left_SP}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.left_CYL}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.left_Axis}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item?.registrationDate}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
