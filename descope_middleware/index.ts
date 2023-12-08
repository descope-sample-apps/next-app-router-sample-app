import { NextResponse } from 'next/server'
import type { NextMiddleware, NextRequest } from 'next/server'
import validateSession from './helpers';
import { cookies } from 'next/headers'

const DEFAULT_IGNORED_ROUTES = [`/((?!api|trpc))(_next.*|.+\\.[\\w]+$)`]
const DEFAULT_API_ROUTES = ['/api/(.*)', '/trpc/(.*)']
const DEFAULT_PUBLIC_ROUTES = ['/', '/login*', '/signup*']
const DEFAULT_REDIRECT_URL = '/login';

const includesRoute = (route: string, routes: string[]) => {
    return routes.find((x) =>
    route.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
}

export interface DescopeMiddlewareConfig {
    publicRoutes?: Array<string>;
    ignoredRoutes?: Array<string>;
    apiRoutes?: Array<string>;
    redirectUrl?: string;
    debug?: boolean;
}

export default function DescopeMiddleware(params?: DescopeMiddlewareConfig): NextMiddleware {
    return async function(req: NextRequest) {
        const { publicRoutes, ignoredRoutes, apiRoutes, debug } = params || {};

        const pathName = req.nextUrl.pathname;
        const isPublicRoute = includesRoute(pathName, publicRoutes || DEFAULT_PUBLIC_ROUTES)
        const isIgnoredRoute = includesRoute(pathName, ignoredRoutes || DEFAULT_IGNORED_ROUTES)
        const isApiRoute = includesRoute(pathName, apiRoutes || DEFAULT_API_ROUTES)


        // For public routes, ignore
        if (isPublicRoute || isIgnoredRoute) {
            return NextResponse.next();
        }

        const cookieStore = cookies()
        const sessionJwt = cookieStore.get("DS")?.value;

        // For API routes, check for auth header
        if (isApiRoute && !sessionJwt) {
            return new Response(JSON.stringify({ error: "Unauthorized (Invalid Token)!" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        if (!sessionJwt) {
            return NextResponse.redirect(new URL(DEFAULT_REDIRECT_URL, req.url))
        }

        const isSessionValid = await validateSession(sessionJwt);

        if (!isSessionValid) {
            if (isApiRoute) {
                return new Response(JSON.stringify({ error: "Unauthorized (Invalid Token)!" }), {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            return NextResponse.redirect(new URL(DEFAULT_REDIRECT_URL, req.url))
        }

        return NextResponse.next();
    }
}