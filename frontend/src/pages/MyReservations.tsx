import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, CalendarX, CheckCircle, Clock, Calendar, CreditCard, CarFront, Armchair, Gauge } from 'lucide-react'
import { useAuthStore } from '@/lib/useAuthStore'
import { getMyReservations } from '@/api/user'
import { cancelReservation } from '@/api/cars'

import { type Reservation } from '@/api/admin'

export default function MyReservations() {
	const token = useAuthStore(state => state.token)

	const [reservations, setReservations] = useState<Reservation[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [cancellingId, setCancellingId] = useState<string | null>(null)

	useEffect(() => {
		async function fetchReservations() {
			if (!token) {
				setLoading(false)
				return
			}
			try {
				setLoading(true)
				const response = await getMyReservations(token)

				if (response && response.data) {
					setReservations(response.data)
				} else if (Array.isArray(response)) {
					setReservations(response)
				}
			} catch (error) {
				console.log(error)
				toast.error('Nie udało się pobrać rezerwacji')
			} finally {
				setLoading(false)
			}
		}

		fetchReservations()
	}, [token])

	const handleCancel = async (reservationId: string) => {
		try {
			setCancellingId(reservationId)

			await cancelReservation(reservationId, token || undefined)

			setReservations(prev => prev.map(res => (res._id === reservationId ? { ...res, status: 'anulowana' } : res)))

			toast.success('Rezerwacja została pomyślnie anulowana.')
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd podczas anulowania.'
			toast.error(message || 'Wystąpił nieoczekiwany błąd podczas anulowania.')
		} finally {
			setCancellingId(null)
		}
	}

	const renderStatusBadge = (status: Reservation['status']) => {
		switch (status) {
			case 'aktywna':
				return (
					<Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 shadow-sm px-2.5 py-1 flex items-center gap-1.5 w-fit font-medium rounded-full">
						<CheckCircle className="w-3.5 h-3.5" /> Aktywna
					</Badge>
				)
			case 'zakonczona':
				return (
					<Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 border-blue-500/30 shadow-sm px-2.5 py-1 flex items-center gap-1.5 w-fit font-medium rounded-full">
						<Clock className="w-3.5 h-3.5" /> Zakończona
					</Badge>
				)
			case 'anulowana':
				return (
					<Badge
						variant="secondary"
						className="px-2.5 py-1 flex items-center gap-1.5 w-fit font-medium rounded-full">
						<CalendarX className="w-3.5 h-3.5" /> Anulowana
					</Badge>
				)
			default:
				return (
					<Badge variant="outline" className="rounded-full px-2.5 py-1">
						{status}
					</Badge>
				)
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pl-PL', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		})
	}

	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center min-h-[500px] gap-3">
				<Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
				<p className="text-muted-foreground text-sm font-medium animate-pulse">Wczytywanie Twoich rezerwacji...</p>
			</div>
		)
	}

	if (!token) {
		return (
			<div className="text-center mt-20 max-w-sm mx-auto p-6 border rounded-2xl bg-muted/50 shadow-sm">
				<p className="text-xl font-bold text-foreground">Brak dostępu</p>
				<p className="text-sm text-muted-foreground mt-2 mb-4">
					Zaloguj się na swoje konto, aby zobaczyć i zarządzać swoimi rezerwacjami.
				</p>
			</div>
		)
	}

	return (
		<div className="container mx-auto py-12 px-4 max-w-5xl">
			<div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
				<div>
					<h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Moje Rezerwacje</h1>
					<p className="text-muted-foreground mt-2 text-base">
						Zarządzaj swoimi aktywnymi oraz historycznymi rezerwacjami samochodów.
					</p>
				</div>
				<div className="bg-muted text-muted-foreground px-4 py-2 rounded-xl text-sm font-medium w-fit self-start md:self-auto">
					Łącznie: <span className="font-bold text-indigo-500">{reservations.length}</span>
				</div>
			</div>

			{reservations.length === 0 ? (
				<div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/20 flex flex-col items-center justify-center max-w-md mx-auto px-6">
					<div className="bg-muted p-4 rounded-full mb-4">
						<CarFront className="h-8 w-8 text-muted-foreground" />
					</div>
					<p className="text-xl font-bold text-foreground">Brak rezerwacji</p>
					<p className="text-sm text-muted-foreground mt-2">
						Nie masz jeszcze żadnych rezerwacji. Wybierz idealny samochód dla siebie i wyrusz w drogę!
					</p>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
					{reservations.map(reservation => {
						const isActive = reservation.status === 'aktywna'
						const carBrand = reservation.car
							? reservation.car.brand || (reservation.car as { make?: string }).make || ''
							: ''
						const carModel = reservation.car ? reservation.car.model : ''
						const carName = reservation.car ? `${carBrand} ${carModel}` : 'Nieznany pojazd'

						return (
							<div
								key={reservation._id}
								className="group border border-border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
								<div className="relative bg-muted/50 h-48 flex items-center justify-center overflow-hidden border-b border-border">
									{reservation.car?.picture ? (
										<img
											src={reservation.car.picture}
											alt={carName}
											className="object-contain h-full w-full p-4 group-hover:scale-105 transition-transform duration-300"
										/>
									) : (
										<CarFront className="h-16 w-16 text-muted-foreground/40" />
									)}
									<div className="absolute top-4 right-4">{renderStatusBadge(reservation.status)}</div>
									<div className="absolute bottom-3 left-4 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm font-mono tracking-wider">
										ID: {reservation._id.slice(-6).toUpperCase()}
									</div>
								</div>

								<div className="p-6 flex-1 flex flex-col justify-between gap-6">
									<div>
										<h3 className="font-bold text-xl text-card-foreground tracking-tight">{carName}</h3>

										{reservation.car && (
											<div className="flex gap-4 mt-2 text-xs text-muted-foreground font-medium">
												<span className="flex items-center gap-1">
													<Gauge className="w-3.5 h-3.5" /> {reservation.car.fuelType}
												</span>
												{reservation.car.gearbox && (
													<span className="flex items-center gap-1">
														<Armchair className="w-3.5 h-3.5" /> {reservation.car.gearbox}
													</span>
												)}
											</div>
										)}

										<hr className="my-4 border-border" />

										<div className="space-y-3">
											<div className="flex items-center gap-3 text-sm text-muted-foreground">
												<Calendar className="w-4 h-4 flex-shrink-0" />
												<div className="flex items-center gap-2 font-medium">
													<span>{formatDate(reservation.startDate)}</span>
													<span className="text-border">➔</span>
													<span>{formatDate(reservation.endDate)}</span>
												</div>
											</div>

											<div className="flex items-center gap-3 text-sm text-muted-foreground">
												<CreditCard className="w-4 h-4 flex-shrink-0" />
												<div className="font-medium">
													Koszt całkowity:{' '}
													<span className="text-base font-bold text-card-foreground">{reservation.priceSummary} PLN</span>
												</div>
											</div>
										</div>
									</div>

									<div>
										{isActive ? (
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="outline"
														className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold rounded-xl transition-colors"
														disabled={cancellingId === reservation._id}>
														{cancellingId === reservation._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
														Anuluj rezerwację
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent className="rounded-2xl">
													<AlertDialogHeader>
														<AlertDialogTitle>Czy na pewno chcesz anulować?</AlertDialogTitle>
														<AlertDialogDescription>
															Ta akcja zmieni status rezerwacji pojazdu{' '}
															<span className="font-semibold text-foreground">"{carName}"</span> na anulowaną. Wolny
															termin wróci do puli. Tej operacji nie można cofnąć.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel className="rounded-xl">Wróć</AlertDialogCancel>
														<AlertDialogAction
															onClick={() => handleCancel(reservation._id)}
															className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-medium">
															Tak, anuluj rezerwację
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										) : (
											<div className="text-center py-2 bg-muted rounded-xl text-xs font-semibold text-muted-foreground border border-border uppercase tracking-wider">
												Rezerwacja archiwalna
											</div>
										)}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}