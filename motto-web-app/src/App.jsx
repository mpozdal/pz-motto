/* eslint-disable react-refresh/only-export-components */
import './App.css';
import Nav from './components/Nav';
import Home from './pages/Home';

import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Store from './pages/Store';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Menu from './pages/Menu';
import { AuthProvider } from './contexts/AuthContext';
function App() {
	return (
		<AuthProvider>
			<Nav />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/users" element={<Users />} />
				<Route path="/menu" element={<Menu />} />
				<Route path="/store" element={<Store />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</AuthProvider>
	);
}

export default withAuthenticator(App);
