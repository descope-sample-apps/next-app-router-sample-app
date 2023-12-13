import DescopeClient from '@descope/node-sdk';

if (!process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID) {
    throw new Error('NEXT_PUBLIC_DESCOPE_PROJECT_ID is not defined');
}



const descope = DescopeClient({ projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID, managementKey: process.env.DESCOPE_MANAGEMENT_KEY });
export default descope;