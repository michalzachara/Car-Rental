import { createBrowserRouter, Navigate } from 'react-router-dom'

import HomeLayout from './layout/HomeLayout'
import Panel from './pages/Admin/Panel'
import Home from './pages/Home'
import AuthLayout from './layout/AuthLayout'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import SettingsPage from './pages/SettingsPage'
import MyReservations from './pages/MyReservations'
import AdminLayout from './layout/AdminLayout'
import CreateCar from './pages/Admin/CreateCar'
import Reservations from './pages/Admin/Reservations'
import { RequireAdmin, RequireNotLogIn, RequireAuth } from './components/guard/guard'
import CarMenegment from './pages/Admin/CarMenegment'
import EditCarForm from './pages/Admin/EditCarForm'
import CarInfo from './pages/CarInfo'

export const router = createBrowserRouter([
	{
		path: '/',
		Component: HomeLayout,
		children: [
			{ index: true, Component: Home },
			{
				path: 'admin',
				element: <RequireAdmin />,
				children: [
					{
						Component: AdminLayout,
						children: [
							{ index: true, Component: Panel },
							{ path: 'create-car', Component: CreateCar },
							{ path: 'reservations', Component: Reservations },
							{ path: 'car-menegment', Component: CarMenegment },
							{ path: 'edit/:id', Component: EditCarForm },
						],
					},
				],
			},
			{
				path: 'auth',
				element: <RequireNotLogIn />,
				children: [
					{
						Component: AuthLayout,
						children: [
							{ path: 'login', Component: LoginPage },
							{ path: 'register', Component: SignUpPage },
						],
					},
				],
			},
			{
				element: <RequireAuth />,
				children: [
					{
						path: 'settings',
						Component: SettingsPage,
					},
					{
						path: 'my-reservations',
						Component: MyReservations,
					},
					{
						path: 'cars/:id',
						Component: CarInfo,
					},
				],
			},
		],
	},
	{
		path: '*',
		element: <Navigate to="/" replace />,
	},
])
