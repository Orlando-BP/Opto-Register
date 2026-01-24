import fetchApi from "../api/fetchApi";
import { useQuery } from "@tanstack/react-query";

export interface useFetchInterface {
    url: string;
    qs?: any;
    [key: string]: any;
    enabled?: boolean;
    refreshKey?: number;
}

export const useFetch = ({
    url,
    qs,
    enabled = true,
    refreshKey,
}: useFetchInterface) => {
    // Definimos la clave de consulta, incorporando 'url', 'qs' y 'refreshKey'
    const queryKey = ["fetchData", url, qs, refreshKey];

    // Nuestro queryFn recibe un objeto que incluye 'signal' para la cancelación
    const queryFn = async ({ signal }: { signal: AbortSignal }) => {
        const res = await fetchApi.get({ url, qs, signal });

        const json = await res.json();
        const normalizedStatus = Number(json?.status ?? res?.status);
        const ok = Number.isFinite(normalizedStatus)
            ? normalizedStatus === 200
            : Boolean(res?.ok);

        if (!ok) {
            const message =
                json?.message || `Error fetching data. Status: ${res.status}`;
            throw new Error(message);
        }

        return {
            ...json,
            status: normalizedStatus,
            ok,
        };
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn,
        enabled,
    });

    return {
        response: data,
        loading: isLoading,
        error: error,
        refetch: refetch,
    };
};
