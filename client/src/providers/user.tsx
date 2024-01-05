import { createContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
	id: string;
	email: string;
	username: string;
}

type UserState =
	| { state: "initializing" }
	| { state: "authenticated"; user: User }
	| { state: "unauthenticated" };

type AuthUserContextProps = {
	updateUser: () => Promise<void>;
} & UserState;

export const AuthUserContext = createContext<AuthUserContextProps>({
	state: "initializing",
	updateUser: async () => void 0,
});

interface AuthUserProviderProps {
	children: React.ReactNode;
}

export const AuthUserProvider = ({ children }: AuthUserProviderProps) => {
	const [userState, setUserState] = useState<UserState>({
		state: "initializing",
	});

	const fetchUser = async () => {
		//const res = await getClient().users.me.$get();
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }
        const res = await axios.get(import.meta.env.VITE_SERVER_URL + '/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
	};

	const updateUser = async () => {
		setUserState({ state: "initializing" });
		const user = await fetchUser();
		if (!user) {
			setUserState({ state: "unauthenticated" });
			return;
		}
		setUserState({ state: "authenticated", user });
	};

	useEffect(() => {
		updateUser()
	}, []);

	return (
		<AuthUserContext.Provider value={{ ...userState, updateUser }}>
			{children}
		</AuthUserContext.Provider>
	);
};