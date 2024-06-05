import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Table from '../components/Table';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getUser, listOrders, listOrders2 } from '../graphql/queries.js';
import {
	onCreateOrder,
	onUpdateOrder,
	onDeleteOrder,
} from '../graphql/subscriptions.js';
import { updateOrder } from '../graphql/mutations.js';

import { Button } from 'react-bootstrap';

const client = generateClient();

const Store = () => {
	const { currentUser, role } = useAuth();
	const [orders, setOrders] = useState([]);
	if (role !== 'owner') {
		return <Navigate to="/" replace />;
	}

	const fetchOrders = async () => {
		try {
			const data = await client.graphql({
				query: listOrders,
				variables: {
					filter: {
						orderStoreId: {
							eq: currentUser.userDefaultStoreId,
						},
					},
				},
			});
			console.log(data.data);

			setOrders(data?.data?.listOrders?.items);
		} catch (e) {
			console.warn(e);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	

	useEffect(() => {
		const createSub = client
			.graphql({
				query: onCreateOrder,
				variables: {
					filter: {
						orderStoreId: {
							eq: currentUser?.userDefaultStoreId,
						},
					},
				},
			})
			.subscribe({
				next: ({ data }) => {
					console.log(data);
					let temp = orders;
					temp.push(data?.onCreateOrder);
					setOrders(temp);
				},
				error: (error) => console.warn(error),
			});

		const updateSub = client.graphql({ query: onUpdateOrder }).subscribe({
			next: ({ data }) => {
				const newStatus = data.onUpdateOrder.status;
				const indexOfObject = orders.findIndex(
					(obj) => obj.id === data.onUpdateOrder.id
				);
				console.log(indexOfObject);
				setOrders((prevState) => {
					const temp = [...prevState];
					temp[indexOfObject] = {
						...temp[indexOfObject],
						status: newStatus,
					};
					return temp;
				});
			},
			error: (error) => console.warn(error),
		});
		return () => {
			createSub.unsubscribe();
			updateSub.unsubscribe();
		};
	}, [orders]);

	return (
		<main className="w-100">
			<h1>Orders</h1>
			<div className="container mt-4">
				<div className="row">
					{orders?.length > 0 ? (
						orders?.map(order => (
							<Item order={order}/>
						))
					) : <div>nie ma </div>}
					
				</div>
			</div>
		</main>
	);
};

const Item = ({order}) => {
	const updateStatus = async (status, id) => {
		await client.graphql({
			query: updateOrder,
			variables: {
				input: {
					id: id,
					status: status,
				},
			},
		});
	};
	return(
		<div key={order?.id} className="col-md-4 mb-4">
								<div className="card">
									<div className="card-body">
										<h5 className="card-title">
											{order?.user?.email}
											{order?.user?.username}
										</h5>
										<Table order={order?.items?.items} />
										<h5 className="card-title">
											Status: <b>{order?.status}</b>
										</h5>
										<section className="d-flex justify-content-around">
											{order?.status === 'paid' && (
												<>
													<Button
														variant="danger"
														onClick={() =>
															updateStatus(
																'cancelled',
																order?.id
															)
														}
													>
														Decline
													</Button>
													<Button
														onClick={() =>
															updateStatus(
																'confirmed',
																order?.id
															)
														}
													>
														Accept
													</Button>
												</>
											)}
											{order?.status === 'confirmed' && (
												<>
													<Button
														variant="success"
														onClick={() =>
															updateStatus(
																'ready',
																order?.id
															)
														}
													>
														Ready
													</Button>
												</>
											)}
											{order?.status === 'ready' && (
												<>
													<Button
														variant="success"
														onClick={() =>
															updateStatus(
																'picked up',
																order?.id
															)
														}
													>
														Picked up
													</Button>
												</>
											)}
											<Button
												onClick={() =>
													updateStatus('paid', order?.id)
												}
											>
												Back
											</Button>
										</section>
									</div>
								</div>
							</div>
	)
}

export default Store;
