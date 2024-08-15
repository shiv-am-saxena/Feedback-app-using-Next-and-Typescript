import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";
export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request });
	const url = request.nextUrl;

	if (token && (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up") || url.pathname.startsWith("/verify-email") || url.pathname.startsWith("/"))) {
		return NextResponse.redirect(new URL("/home", request.url));
	}
	if(!token && url.pathname.startsWith("/home")){
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/home", "/profile", "/feedback", "/feedback-list", "/feedback-detail", "/sign-in", "/sign-up", "/verify-email"],
};
