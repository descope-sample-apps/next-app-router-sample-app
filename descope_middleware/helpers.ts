import { JWK, JWTHeaderParameters, KeyLike, errors, importJWK, jwtVerify } from "jose";
import descopeSdk from '@descope/web-js-sdk';

if (!process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID) {
    throw Error('NEXT_PUBLIC_DESCOPE_PROJECT_ID is required');
}

const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;

const sdk = descopeSdk({ projectId });


const keys: Record<string, KeyLike | Uint8Array> = {};

/** Get the key that can validate the given JWT KID in the header. Can retrieve the public key from local cache or from Descope. */
async function getKey(header: JWTHeaderParameters): Promise<any> {
    if (!header?.kid) throw Error('header.kid must not be empty');

    if (keys[header.kid]) return keys[header.kid];

    // do we need to fetch once or every time?
    Object.assign(keys, await fetchKeys());

    if (!keys[header.kid]) {
        throw Error('failed to fetch matching key');
    }

    return keys[header.kid];
  };


  /** Fetch the public keys (JWKs) from Descope for the configured project */
  const fetchKeys = async () => {
    const keysWrapper = await sdk.httpClient
      .get(`v2/keys/${projectId}`)
      .then((resp) => resp.json());
    const publicKeys: JWK[] = keysWrapper.keys;
    if (!Array.isArray(publicKeys)) return {};
    const kidJwksPairs = await Promise.all(
      publicKeys.map(async (key) => [key.kid, await importJWK(key)]),
    );

    return kidJwksPairs.reduce(
      (acc, [kid, jwk]) => (kid ? { ...acc, [kid.toString()]: jwk } : acc),
      {},
    );
  };


  /**
     * Validate the given JWT with the right key and make sure the issuer is correct
     * @param jwt the JWT string to parse and validate
     * @returns AuthenticationInfo with the parsed token and JWT. Will throw an error if validation fails.
     */
async function validateJwt(jwt: string): Promise<any> {
    // Do not hard-code the algo because library does not support `None` so all are valid
    const res = await jwtVerify(jwt, getKey, { clockTolerance: 5 });
    const token = res.payload;

    if (token) {
      token.iss = token.iss?.split('/').pop(); // support both url and project id as issuer
      if (token.iss !== projectId) {
        // We must do the verification here, since issuer can be either project ID or URL
        throw new errors.JWTClaimValidationFailed(
          'unexpected "iss" claim value',
          'iss',
          'check_failed',
        );
      }
    }

    return { jwt, token };
  };

   /**
     * Validate an active session
     * @param sessionToken session JWT to validate
     * @returns AuthenticationInfo promise or throws Error if there is an issue with JWTs
     */
  export default async function validateSession(sessionToken: string): Promise<any> {
    if (!sessionToken) throw Error('session token is required for validation');

    try {
      const token = await validateJwt(sessionToken);
      return token;
    } catch (error) {
      throw Error(`session validation failed. Error: ${error}`);
    }
  };