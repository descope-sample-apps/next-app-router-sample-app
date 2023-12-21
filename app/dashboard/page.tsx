import LogoutButton from "./logout-button";
import { getServerSession, getServerSessionUser } from "@/lib/helpers";

export default async function Page() {
	const session = await getServerSession();
	const user = await getServerSessionUser();

	if (!session) {
		return <p>No session found</p>;
	}

	if (user) {
		return <>
			<p>Hello {user.name}</p>
			<LogoutButton/>
		</>;
	
	} else {
		return <p>Error getting user</p>;
	}
}



// 'use client'

// import { useDescope, useSession, useUser } from "@descope/react-sdk"
// import { useCallback } from "react";
// import { useRouter } from 'next/navigation'
// import LogoutButton from "./logout-button";

// export default function Page() {

//     const { isAuthenticated, isSessionLoading, sessionToken } = useSession();
// 	const { user, isUserLoading } = useUser();
// 	const { logout } = useDescope();
// 	const router = useRouter()
// 	const onLogout = async () => {
// 		await logout();
// 		router.push('/');
// 	}

//     if (isSessionLoading || isUserLoading) {
// 		return <p>Loading...</p>;
// 	}

// 	if (isAuthenticated) {
// 		return (
// 			<>
// 				<p>Hello {user.name}</p>
// 				<LogoutButton/>
// 			</>
// 		);
// 	}

// 	return <p>You are not logged in</p>;
// }