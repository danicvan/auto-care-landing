import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const pathname = url.pathname

  const isAdminRoute = pathname.startsWith("/admin")
  const userEmail = req.cookies.get("sb-user")?.value

  // Se for rota admin e o cookie do Supabase não existir, bloqueia
  if (isAdminRoute && !userEmail) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin"],
}
