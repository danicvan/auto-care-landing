import ClientWrapper from "./client-wrapper"

// Configuração para evitar pré-renderização
export const dynamic = "force-dynamic"

export default function AdminPage() {
  return <ClientWrapper />
}
