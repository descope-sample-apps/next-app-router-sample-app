'use server'

import { getSessionToken } from "@/descope_middleware/helpers";
import descope from "./descopeClient";

const getServerSession = async () => {
    const sessionToken = getSessionToken();
    const session = await descope.validateSession(sessionToken!);
	return session;
}

const getServerSessionUser = async () => {
    const session = await getServerSession();
    const userId = session.token.sub;
    const userRes = await descope.management.user.loadByUserId(userId!);
    const user = userRes.data;
    return user;
}

export { getServerSession, getServerSessionUser };