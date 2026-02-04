import { useState, useCallback } from "react";

import fetchApi from "../api/fetchApi";

export interface usePostInterface {
    url: string;
    body?: any;
    method?: any;
    hasFiles?: boolean;
    qs?: any;
}

export const usePost = () => {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const execute = useCallback(
        async ({
            url = "",
            body,
            method = "post",
            hasFiles = false,
            qs = {},
        }: usePostInterface) => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            let res, data;
            setLoading(true);

            try {
                res = await fetchApi[method]({
                    url,
                    body,
                    headers: {},
                    hasFiles,

                    qs,
                    signal,
                });
                data = await res.json();

                if (!res.ok) {
                    throw res;
                }

                if (!signal.aborted) {
                    setResponse(data);
                    setError(null);
                }
            } catch (error) {
                if (!signal.aborted) {
                    setResponse(null);
                    setError(error);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }

            const normalizedStatus = Number(data?.status ?? res?.status);
            const ok = Number.isFinite(normalizedStatus)
                ? normalizedStatus >= 200 && normalizedStatus < 300
                : Boolean(res?.ok);

            return {
                ...data,
                payload: data,
                status: normalizedStatus,
                ok,
                res,
            };
        },
        [],
    );

    return {
        execute,
        response,
        loading,
        error,
    };
};
