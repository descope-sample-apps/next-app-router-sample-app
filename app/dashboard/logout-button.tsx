'use client'

import { useDescope } from "@descope/react-sdk";

export default function LogoutButton() {
    const { logout } = useDescope();
    const onLogout = async () => {
        await logout();
        window.location.href = '/';
    }
    return (
        <button onClick={onLogout}>Logout</button>
    )
}