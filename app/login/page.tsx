'use client'

import { useEffect } from 'react';
import Descope from '../Descope';
import { useDescope, useSession, useUser } from "@descope/react-sdk"

export default function Page() {

    const { isAuthenticated, isSessionLoading } = useSession();
	const { isUserLoading } = useUser();
    // Redirect to login if not authenticated
    useEffect(() => {
        if (!(isSessionLoading || isUserLoading) && isAuthenticated) {
            window.location.href = '/dashboard';
        } 
    });

    return (
        <div className="flex flex-col items-center p-24 rounded-md">
            <Descope
                flowId="sign-up-or-in"
            />
        </div>
    )
}