import { useNavigate } from 'react-router-dom'
import { Menu, LogOutIcon, UserCircle2 } from 'lucide-react'
import { useState } from 'react'

import { ChangeThemeSwitch } from './toggle-mode'
import { useAuthStore, type User } from '@/lib/useAuthStore'

import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Separator } from './ui/separator'

interface NavbarProps {
	user: User | null
	logged: boolean
	navigate: ReturnType<typeof useNavigate>
	logout: () => void
}

export default function Navbar() {
	const navigate = useNavigate()
	const { user, isLoggedIn } = useAuthStore()
	const logout = useAuthStore(state => state.logout)
	const logged = isLoggedIn()

	const sharedProps: NavbarProps = {
		user,
		logged,
		navigate,
		logout,
	}

	return (
		<nav className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-50">
			<NavbarMobile {...sharedProps} />

			<NavbarDesktop {...sharedProps} />
		</nav>
	)
}

function NavbarMobile({ user, logged, navigate, logout }: NavbarProps) {
	const [sheetOpen, setSheetOpen] = useState(false)

	const handleNavigate = (path: string) => {
		navigate(path)
		setSheetOpen(false)
	}

	return (
		<div className="flex items-center justify-between p-4 md:hidden">
			<h1 className="text-3xl font-extrabold text-primary tracking-tight cursor-pointer" onClick={() => navigate('/')}>
				CAR-RENT
			</h1>

			<div className="flex items-center gap-2">
				<ChangeThemeSwitch />

				<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon">
							<Menu className="w-5 h-5" />
						</Button>
					</SheetTrigger>

					<SheetContent side="right" className="w-75 sm:w-90">
						<SheetHeader>
							<SheetTitle className="text-left text-2xl font-bold text-primary">CAR-RENT</SheetTitle>
						</SheetHeader>

						<div className="mt-6 flex flex-col gap-2">
							<Button variant="ghost" className="justify-start h-11 text-base" onClick={() => handleNavigate('/')}>
								Home
							</Button>

							{logged && (
								<Button
									variant="ghost"
									className="justify-start h-11 text-base"
									onClick={() => handleNavigate('/my-reservations')}>
									Moje rezerwacje
								</Button>
							)}

							{logged && user?.role === 'admin' && (
								<Button
									variant="ghost"
									className="justify-start h-11 text-base"
									onClick={() => handleNavigate('/admin')}>
									Admin panel
								</Button>
							)}

							<Separator className="my-3" />

							{user ? (
								<div className="flex flex-col gap-3">
									<Button
										variant="ghost"
										className="justify-start h-11 text-base"
										onClick={() => handleNavigate('/settings')}>
										Ustawienia
									</Button>

									<div className="flex items-center gap-3 px-1">
										<Avatar>
											<AvatarFallback>{user?.name?.[0]?.toUpperCase() || 'X'}</AvatarFallback>
										</Avatar>

										<div className="leading-tight">
											<p className="font-medium">{user?.name}</p>
											<p className="text-xs text-muted-foreground">Zalogowany</p>
										</div>
									</div>

									<Button
										variant="destructive"
										className="w-full h-11"
										onClick={() => {
											logout()
											setSheetOpen(false)
										}}>
										<LogOutIcon className="mr-2 h-4 w-4" />
										Wyloguj
									</Button>
								</div>
							) : (
								<div className="flex flex-col gap-2">
									<Button className="h-11 w-full" onClick={() => handleNavigate('/auth/login')}>
										Zaloguj
									</Button>

									<Button variant="outline" className="h-11 w-full" onClick={() => handleNavigate('/auth/register')}>
										Utwórz konto
									</Button>
								</div>
							)}

							<div className="pt-4 flex justify-center">
								<ChangeThemeSwitch />
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	)
}

function NavbarDesktop({ user, logged, navigate, logout }: NavbarProps) {
	return (
		<div className="hidden md:flex justify-between items-center p-4 max-w-7xl mx-auto">
			<h1 className="text-primary font-extrabold text-4xl hover:cursor-pointer" onClick={() => navigate('/')}>
				CAR-RENT
			</h1>

			<div className="flex items-center gap-10">
				{logged && (
					<button
						onClick={() => navigate('/my-reservations')}
						className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all">
						Moje rezerwacje
					</button>
				)}

				{logged && user?.role === 'admin' && (
					<button
						onClick={() => navigate('/admin')}
						className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all">
						Admin panel
					</button>
				)}
			</div>

			<div className="flex items-center gap-3">
				{user ? (
					<AvatarDropDown letter={user?.name?.[0]?.toUpperCase() || 'X'} navigate={navigate} logout={logout} />
				) : (
					<>
						<Button size={'lg'} onClick={() => navigate('/auth/login')}>
							Zaloguj
						</Button>

						<Button variant={'outline'} onClick={() => navigate('/auth/register')}>
							Utwórz konto
						</Button>
					</>
				)}

				<ChangeThemeSwitch />
			</div>
		</div>
	)
}
interface AvatarDropDownProps {
	letter: string
	navigate: ReturnType<typeof useNavigate>
	logout: () => void
}

function AvatarDropDown({ letter, navigate, logout }: AvatarDropDownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full">
					<Avatar>
						<AvatarFallback>{letter}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel>Moje konto</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => navigate('/settings')}>
						<UserCircle2 className="mr-2 h-4 w-4" />
						Ustawienia
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="text-red-500" onClick={logout}>
					<LogOutIcon className="mr-2 h-4 w-4" />
					Wyloguj
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
