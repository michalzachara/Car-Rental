import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, Settings, LayoutDashboard, Car, Users, CarFront } from 'lucide-react'
// 1. Import SheetTitle and SheetDescription (or SheetHeader if your shadcn setup uses it)
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
	href: string
	label: string
	icon: LucideIcon
}

const navItems: NavItem[] = [
	{ href: '/admin', label: 'Panel', icon: LayoutDashboard },
	{ href: '/admin/create-car', label: 'Dodaj auto', icon: Car },
	{ href: '/admin/car-menegment', label: 'Zarzadzaj autami', icon: CarFront },
	{ href: '/admin/reservations', label: 'Rezerwacje', icon: Users },
]

export default function AdminLayout() {
	const location = useLocation()

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[20%_1fr]">
			<AdminSidebarDesktop items={navItems} currentPath={location.pathname} />

			<div className="flex flex-col">
				<AdminSidebarMobile items={navItems} currentPath={location.pathname} />

				<main className="flex-1 bg-muted/40 p-4 md:p-6 lg:p-8">
					<div className="mx-auto max-w-6xl">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	)
}

interface AdminNavLinkProps {
	item: NavItem
	currentPath: string
	onClick?: () => void
}

function AdminNavLink({ item, currentPath, onClick }: AdminNavLinkProps) {
	const { href, label, icon: Icon } = item
	const isActive = currentPath === href

	return (
		<Link
			onClick={onClick}
			to={href}
			className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary ${
				isActive ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-secondary/50'
			}`}>
			<Icon className="h-4 w-4" />
			{label}
		</Link>
	)
}

interface AdminSidebarDesktopProps {
	items: NavItem[]
	currentPath: string
}

function AdminSidebarDesktop({ items, currentPath }: AdminSidebarDesktopProps) {
	return (
		<aside className="hidden border-r bg-background md:block">
			<div className="flex h-full flex-col gap-2">
				<div className="flex h-14 items-center border-b px-4 lg:h-15">
					<Link to="/admin" className="flex items-center gap-2 font-semibold">
						<Settings className="h-6 w-6 text-primary" />
						<span>Panel Admina</span>
					</Link>
				</div>
				<div className="flex-1 px-2 py-4">
					<div className="grid items-start gap-1 text-sm font-medium">
						{items.map(item => (
							<AdminNavLink key={item.href} item={item} currentPath={currentPath} />
						))}
					</div>
				</div>
			</div>
		</aside>
	)
}

interface AdminSidebarMobileProps {
	items: NavItem[]
	currentPath: string
}

function AdminSidebarMobile({ items, currentPath }: AdminSidebarMobileProps) {
	const [sheetOpen, setSheetOpen] = useState(false)

	return (
		<header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-15 md:hidden">
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Otwórz menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="flex flex-col w-62.5">
					<div className="sr-only">
						<SheetTitle>Menu nawigacyjne</SheetTitle>
						<SheetDescription>Przełączaj się między sekcjami panelu administratora</SheetDescription>
					</div>

					<nav className="grid gap-2 mt-4 text-lg font-medium">
						<Link
							to="/admin"
							className="flex items-center gap-2 text-lg font-semibold mb-4"
							onClick={() => setSheetOpen(false)}>
							<Settings className="h-5 w-5 text-primary" />
							<span>Panel Admina</span>
						</Link>
						{items.map(item => (
							<AdminNavLink key={item.href} item={item} currentPath={currentPath} onClick={() => setSheetOpen(false)} />
						))}
					</nav>
				</SheetContent>
			</Sheet>
			<div className="w-full flex-1">
				<h1 className="font-semibold text-sm">Panel Zarządzania</h1>
			</div>
		</header>
	)
}
