import React from "react";

type FetchResult = {
    response: any;
    loading: boolean;
    error: any;
    refetch: () => void;
};

type Form = {
    id_client: string;
    issue_date: string;
    delivery_date: string;
    total_price: string;
    advance: string;
};

export default function ListaNotasVentas({
    fetchResult,
    form,
    setForm,
    onSubmit,
}: {
    fetchResult: FetchResult;
    form: Form;
    setForm: React.Dispatch<React.SetStateAction<Form>>;
    onSubmit: (e: React.FormEvent) => void;
}) {
    const { response, loading, error } = fetchResult;

    const sales = Array.isArray(response?.data?.notas)
        ? response.data.notas
        : [];

    const clients = Array.isArray(response?.data?.clients)
        ? response.data.clients
        : [];

    return (
        <div></div>
    );
}
