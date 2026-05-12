import { createBrowserRouter } from 'react-router-dom'

import HomeLayout from './layout/HomeLayout'
import AdminPage from './pages/AdminPage'
import Home from './pages/Home'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <HomeLayout />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'admin', element: <AdminPage /> },
		],
	},
])
