import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathName = req.nextUrl.pathname;

  // if (pathName === "/" && token) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  if (pathName.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/validate", {
        method: "GET",
        headers: { Cookie: `token=${token}` },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
