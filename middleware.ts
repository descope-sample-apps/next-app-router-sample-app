import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import validateSession from './descope_middleware';
import { cookies } from 'next/headers'

// Set the routes that don't require the user to be signed in
const publicRoutes = ["/", "/login*", "/signup*"];
 
const isPublic = (route: string) => {
    return includesRoute(route, publicRoutes);
};

// Set the routes that are api endpoints
const apiRoutes = [`^/api`];
const isAPI = (route: string) => {
    return includesRoute(route, apiRoutes);
}

// Set the routes that are static assets
const isStaticAsset = (path: string) => {
    return /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|eot|ttf)$/.test(path);
  };

const includesRoute = (route: string, routes: string[]) => {
    return routes.find((x) =>
    route.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
}


export async function middleware(req: NextRequest) {
    const pathName = req.nextUrl.pathname;
    const cookieStore = cookies()
    const sessionJwt = cookieStore.get("DS")?.value

    if (isStaticAsset(pathName)) {
        return NextResponse.next();
    }
    if (isPublic(pathName)) {
        return NextResponse.next();
    }

    // For API routes, check for auth header
    if (isAPI(pathName)) {
        const auth = req.headers.get("authorization");
        const token = auth?.split(' ')[1];
        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized!" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const isTokenValid = await validateSession(token);
        if (!isTokenValid) {
            return new Response(JSON.stringify({ error: "Unauthorized (Invalid Token)!" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        return NextResponse.next();
    }


    if (!sessionJwt) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    const isSessionValid = await validateSession(sessionJwt);

    if (!isSessionValid) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next();
}
