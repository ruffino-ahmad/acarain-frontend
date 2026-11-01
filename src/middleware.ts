import { type NextRequest, NextResponse } from "next/server";
import { JWTExtended } from "./types/Auth";
import { getToken } from "next-auth/jwt";
import environment from "./config/environment";

const ADMIN_HOME = "/admin/event";
const MEMBER_HOME = "/member/transaction";
const AUTH_PAGES = ["/auth/login", "/auth/register"];

const isPath = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

const isRootOf = (pathname: string, base: string) =>
  pathname === base || pathname === `${base}/`;

const redirectToLogin = (request: NextRequest) => {
  const url = new URL("/auth/login", request.url);
  url.searchParams.set(
    "callbackUrl",
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  );
  return NextResponse.redirect(url);
};

export async function middleware(request: NextRequest) {
  const token: JWTExtended | null = await getToken({
    req: request,
    secret: environment.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isAdmin = token?.user?.role === "admin";

  if (AUTH_PAGES.includes(pathname)) {
    if (token) {
      return NextResponse.redirect(
        new URL(isAdmin ? ADMIN_HOME : MEMBER_HOME, request.url)
      );
    }

    return NextResponse.next();
  }

  if (isPath(pathname, "/admin")) {
    if (!token) {
      return redirectToLogin(request);
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL(MEMBER_HOME, request.url));
    }

    if (isRootOf(pathname, "/admin")) {
      return NextResponse.redirect(new URL(ADMIN_HOME, request.url));
    }
  }

  if (isPath(pathname, "/member")) {
    if (!token) {
      return redirectToLogin(request);
    }

    // Admin tidak punya area profile/member.
    if (isAdmin) {
      return NextResponse.redirect(new URL(ADMIN_HOME, request.url));
    }

    if (isRootOf(pathname, "/member")) {
      return NextResponse.redirect(new URL(MEMBER_HOME, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/admin/:path*", "/member/:path*"],
};
