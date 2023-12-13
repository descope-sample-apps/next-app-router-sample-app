
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

if (!process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID) {
    throw Error('NEXT_PUBLIC_DESCOPE_PROJECT_ID is required');
}

const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;

/**
 * Validate an active session
 * @param sessionToken session JWT to validate
 * @returns AuthenticationInfo promise or throws Error if there is an issue with JWTs
 */
export async function validateSessionToken(sessionToken: string | undefined): Promise<any> {
  try {
    const res = await fetch('https://api.descope.com/v1/auth/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${projectId}:${sessionToken}`,
        'Content-Type': 'application/json',
      }
    })

    const data = await res.json()

    return data;
  } catch (error) {
    throw Error(`session validation failed. Error: ${error}`);
  }
};


/**
 * Gets the session token from cookies
 * @param req NextRequest to validate
 * @returns the session token
 */
 export const getSessionToken = (req: NextRequest) => {
    const cookieStore = cookies()
    const sessionJwt = cookieStore.get("DS")?.value;
    return sessionJwt;
  }