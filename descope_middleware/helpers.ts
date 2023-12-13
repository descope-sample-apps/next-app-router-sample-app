
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

    if (data.errorCode) {
      // Handle the error (e.g., invalid token)
      console.error('Error:', data.errorMessage);
      return false;
    } else {
      // If there is no error code, the session is valid
      // return { isValid: true, jwtParsed: data };
      return true;
    }
  } catch (error) {
    throw Error(`session validation failed. Error: ${error}`);
  }
};

// The /v1/auth/validate endpoint
// Returns error object if there is an error
// {
//   errorCode: 'E061005',
//   errorDescription: 'Invalid token',
//   errorMessage: 'Failed to validate invalid JWT for any token - onetime',
//   message: 'Failed to validate invalid JWT for any token - onetime'
// }

// Returns JWT object if there is no error
// {
//   "amr": [
//     "oauth"
//   ],
//   "drn": "DS",
//   "exp": "2023-12-13T01:07:21Z",
//   "iat": "2023-12-13T00:57:21Z",
//   "iss": "P2YuRTmSv8PdoasfasfWiLoBrZP92as", // Project ID
//   "permissions": [
//     "Impersonate",
//     "User Admin",
//     "SSO Admin"
//   ],
//   "rexp": "2024-01-10T00:57:21Z",
//   "roles": [
//     "Tenant Admin"
//   ],
//   "sub": "U2YualoWDiRkFAEpoyOwAEyT07jkjnj" // User ID
// }


/**
 * Gets the session token from cookies
 * @param req NextRequest to validate
 * @returns the session token
 */
 export const getSessionToken = () => {
    const cookieStore = cookies()
    const sessionJwt = cookieStore.get("DS")?.value;
    return sessionJwt;
  }