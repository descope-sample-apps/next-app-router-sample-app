'use client'

import { useDescope, useSession, useUser } from "@descope/react-sdk"
import { useCallback, useEffect } from "react";

export default function Page() {

    const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
	const { user, isUserLoading } = useUser();
	const { logout } = useDescope();

	const handleLogout = useCallback(() => {
		logout();
	}, [logout]);

    if (isSessionLoading || isUserLoading) {
		return <p>Loading...</p>;
	}

	if (isAuthenticated) {
		return (
			<>
				<p>Hello {user.name}</p>
				<button onClick={handleLogout}>Logout</button>
			</>
		);
	}

	return <p>You are not logged in</p>;
}