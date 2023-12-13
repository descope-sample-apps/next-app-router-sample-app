import DescopeMiddleware from "./descope_middleware";
import { authConfig } from "./auth.config";

export default DescopeMiddleware(authConfig);

export const config = {
  matcher: [
    /*
      * Match all request paths except for the ones starting with:
      * - api (API routes)
      * - _next/static (static files)
      * - _next/image (image optimization files)
      * - favicon.ico (favicon file)
      */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


  


// import { NextRequest, NextResponse } from "next/server";
// import { getSessionToken, validateSessionToken } from "./descope_middleware/helpers";
  

// export async function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/dashboard')) {
//     const sessionJwt = getSessionToken(request);
//     const isSessionValid = await validateSessionToken(sessionJwt);
//     if (!isSessionValid) {
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//   }
  
//   return NextResponse.next()
// }