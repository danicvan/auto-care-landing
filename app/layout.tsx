import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "./components/ThemeProvider"
import { SupabaseProvider } from "./components/SupabaseProvider"
import { Toaster } from "sonner" // ✅ novo
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Auto Care - O Futuro da Estética Automotiva",
  description:
    "Experimente o futuro do cuidado automotivo com os serviços de lavagem e detalhamento por assinatura da Auto Care.",
  icons: { icon: "/favicon.ico" },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors closeButton position="top-center" /> {/* ✅ */}
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
