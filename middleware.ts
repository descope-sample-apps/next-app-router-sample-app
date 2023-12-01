import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

const includesRoute = (route: string, routes: string[]) => {
    return routes.find((x) =>
    route.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
}

export async function middleware(req: NextRequest) {
    const pathName = req.nextUrl.pathname;

    if (isPublic(pathName)) {
        return NextResponse.next();
    }

    // For API routes, check for auth header
    if (isAPI(pathName)) {
        const auth = req.headers.get("authorization");
        if (!auth) {
            return new Response(JSON.stringify({ error: "Unauthorized!" }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Actual validation of the token will occur in your API route
        return NextResponse.next();
    }

    return NextResponse.next();
}
