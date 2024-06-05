import { useEffect } from 'react';
import useAdmin from '../hooks/useAdmin';

const Table = ({ order }) => {
	return (
		<table className="w-100 mx-10 rounded border bg-light">
			<thead>
				<tr>
					<th>#</th>
					<th>Name</th>
					<th>Milk</th>
					<th>Size</th>
				</tr>
			</thead>
			<tbody>
				{order?.map((item, index) => (
					<tr key={index}>
						<td>{index + 1}</td>
						<td>{item?.drink?.name}</td>
						<td>{item?.milk?.name}</td>
						<td>{item?.size?.value} ml</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
