"use client";

import { useState } from "react";

export default function AdminPage() {
  const [price, setPrice] = useState("");
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/create-plan", {
      method: "POST",
      body: JSON.stringify({ price: Number(price), isAnnual }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setMessage(res.ok ? "Plano criado com sucesso!" : `Erro: ${data.error}`);
    setLoading(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Painel do Admin - Criar Plano</h1>
      <form onSubmit={handleSubmit}>
        <label>Valor do Plano (em reais):</label>
        <input 
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>
          <input 
            type="checkbox"
            checked={isAnnual}
            onChange={(e) => setIsAnnual(e.target.checked)}
          />
          Plano Anual?
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar plano"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}