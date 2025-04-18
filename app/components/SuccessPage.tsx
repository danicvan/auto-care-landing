"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            setLoading(false);
        }
    }, [sessionId]);

    if (loading) return <p>Carregando detalhes da assinatura...</p>

    return (
        <div className="text-center mt-20">
            <h1 className="text-3xl font-bold">Assinatura Confirmada!</h1>
            <p className="mt-4">Obrigado por assinar nosso serviço.</p>
        </div>
    );
}