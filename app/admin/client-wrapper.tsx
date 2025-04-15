"use client"

import { useEffect, useState } from "react"
import AuthProvider from "./components/auth-provider"

export default function ClientWrapper() {
  // Usando um estado para garantir que o componente só seja renderizado no cliente
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <AuthProvider />
}
