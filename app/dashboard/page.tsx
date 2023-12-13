'use client'

import { useDescope, useSession, useUser } from "@descope/react-sdk"
import { useCallback } from "react";
import { useRouter } from 'next/navigation'

export default function Page() {

    const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
	const { user, isUserLoading } = useUser();
	const { logout } = useDescope();
	const router = useRouter()
	const onLogout = async () => {
		await logout();
		router.push('/');
	}

    if (isSessionLoading || isUserLoading) {
		return <p>Loading...</p>;
	}

	if (isAuthenticated) {
		return (
			<>
				<p>Hello {user.name}</p>
				<button onClick={onLogout}>Logout</button>
			</>
		);
	}

	return <p>You are not logged in</p>;
}