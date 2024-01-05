import { AuthUserContext } from "../providers/user";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

interface AuthProtectionWrapperProps {
	children: React.ReactNode;
}

export const AuthProtection = ({ children }: AuthProtectionWrapperProps) => {
	const authUser = useContext(AuthUserContext);

	if (authUser.state === "initializing") {
		return null;
	}

	if (authUser.state === "unauthenticated") {
		return <Navigate to="/login" />;
	}

	return <>{children}</>;
};

export const UnauthProtection = ({ children }: AuthProtectionWrapperProps) => {
	const authUser = useContext(AuthUserContext);

	if (authUser.state === "initializing") {
		return null;
	}

	if (authUser.state === "authenticated") {
		return <Navigate to="/admin" />;
	}

	return <>{children}</>;
};