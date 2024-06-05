import { createContext, useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getUser, listUsers } from '../graphql/queries.js';
import { useAuthenticator } from '@aws-amplify/ui-react';
const AuthContext = createContext();

const client = generateClient();

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [userId, setUserId] = useState(null);
	const [role, setRole] = useState('customer');
	const [shop, setShop] = useState('');
	const { user } = useAuthenticator((context) => [context.user]);
	useEffect(() => {
		setUserId(user.userId);
		if (userId) {
			fetchDbUser();
		}
	}, [userId, currentUser, role]);

	const fetchDbUser = async () => {
		try {
			const res = await client.graphql({
				query: listUsers,
				variables: {
					filter: {
						id: {
							eq: userId,
						},
					},
				},
			});
			setCurrentUser(res?.data?.listUsers?.items[0]);
			setRole(res?.data?.listUsers?.items[0].role.name);
			console.log(res)
		} catch (e) {
			console.warn(e);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				role,
				setRole,
				currentUser,
				setCurrentUser,
				setShop,
				shop,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContext, AuthProvider };
