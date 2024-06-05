import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { listUsers } from '../graphql/queries';
import UserTable from '../components/UserTable';
const client = generateClient();

const Users = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const { role } = useAuth();
	function closeModal() {
		setModalOpen(false);
	}

	const [users, setUsers] = useState([]);
	const [isReady, setIsReady] = useState(false);

	if (role !== 'admin') {
		return <Navigate to="/" replace />;
	}

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const list = await client.graphql({
				query: listUsers,
			});
			setUsers(list.data.listUsers.items);
		} catch (e) {
			console.log(e);
		} finally {
			setIsReady(true);
		}
	};

	if (!isReady) {
		return <div>Loading..</div>;
	}
	return (
		<main className="w-100">
			<h1>Users</h1>

			<table className="w-100 mx-10 rounded border bg-light">
				<thead>
					<tr>
						<th>#</th>
						<th>ID</th>
						<th>Email</th>
						<th>Store</th>
						<th>Role</th>
						<th>Buttons</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => (
						<UserTable user={user} index={index} />
					))}
				</tbody>
			</table>
		</main>
	);
};

export default Users;
