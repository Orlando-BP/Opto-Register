import { useState, useCallback } from "react";
import { toast } from "sonner";

import { fetchApi } from "@/api/fetchApi";
//  Si el alias '@' no funciona con Vite: añade "paths" en tsconfig.json y configura "resolve.alias" en vite.config.ts

/**
 * Recursively normalize string values in an object or array
 * @param value - The value to normalize (can be nested object/array)
 * @param strategy - 'uppercase' or 'lowercase'
 * @returns Normalized copy of the value
 */
function normalizeBodyStrings(
    value: any,
    strategy: "uppercase" | "lowercase",
    keyName?: string,
): any {
    // Handle null/undefined
    if (value == null) return value;

    // Handle strings
    if (typeof value === "string") {
        const key = keyName ? String(keyName).toLowerCase() : "";

        const looksLikeBase64 =
            typeof value === "string" &&
            value.length > 100 &&
            /^[A-Za-z0-9+/=\s]+$/.test(value);

        if (
            key.includes("base64") ||
            value.startsWith("data:") ||
            looksLikeBase64
        ) {
            return value;
        }

        return strategy === "uppercase"
            ? value.toLocaleUpperCase("es")
            : value.toLocaleLowerCase("es");
    }

    // Handle arrays
    if (Array.isArray(value)) {
        return value.map((item) =>
            normalizeBodyStrings(item, strategy, undefined),
        );
    }

    // Handle plain objects (exclude File, FormData, Blob, etc.)
    if (typeof value === "object" && value.constructor === Object) {
        const normalized: Record<string, any> = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                normalized[key] = normalizeBodyStrings(
                    value[key],
                    strategy,
                    key,
                );
            }
        }
        return normalized;
    }

    return value;
}

export interface usePostInterface {
    url: string;
    body?: any;
    method?: any;
    hasFiles?: boolean;
    qs?: any;
    token?: string | null;
    /**
     * String normalization strategy:
     * - 'uppercase' (default): convert all string values to uppercase
     * - 'lowercase': convert all string values to lowercase
     * - 'none': do not transform strings
     */
    normalizeStrings?: "uppercase" | "lowercase" | "none";
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
            normalizeStrings = "uppercase",
            token = null,
        }: usePostInterface) => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            let res, data, errors;
            setLoading(true);

            // Normalize string values in body before sending
            const normalizedBody =
                normalizeStrings !== "none" && body && !hasFiles
                    ? normalizeBodyStrings(body, normalizeStrings)
                    : body;

            try {
                
                res = await fetchApi[method]({
                    url,
                    body: normalizedBody,
                    headers: {},
                    hasFiles,
                    
                    qs,
                    signal,
                });
                data = await res.json();

                if (!res.ok) {
                    throw res;
                }

                if (data.status === 401) {
                    toast.error(
                        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
                        {
                            duration: 5000,
                        },
                    );
                    
                    // Redirigir al login después de un breve delay
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 1000);
                    return;
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

            return {
                ...data,
                res,
                errors,
            };
        },
        
    );

    return {
        execute,
        response,
        loading,
        error,
    };
};
