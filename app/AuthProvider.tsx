'use client'

import { AuthProvider as ReactAuthProvider } from '@descope/react-sdk';
import { ReactElement } from 'react';

interface AuthProviderProps {
    children: ReactElement;
    projectId: string;
    baseUrl?: string;
  }

const AuthProvider = ({ children, projectId, baseUrl }: AuthProviderProps ) => {
    return (
        <ReactAuthProvider
        projectId={projectId}
        sessionTokenViaCookie
        // If the Descope project manages the token response in cookies, a custom domain
        // must be configured (e.g., https://auth.app.example.com)
        // and should be set as the baseUrl property.
        baseUrl={baseUrl}
        >
            {children}
        </ReactAuthProvider>
    );
}

export default AuthProvider;