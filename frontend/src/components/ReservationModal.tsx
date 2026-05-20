import { useState } from 'react'
import { format, differenceInDays } from 'date-fns'
import { pl } from 'date-fns/locale'
import { CalendarDays, Car, CheckCircle2, Loader2, X } from 'lucide-react'
import { createReservation } from '@/api/cars'
import { useAuthStore } from '@/lib/useAuthStore'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

interface ReservationModalProps {
	open: boolean
	onClose: () => void
	carId: string
	carBrand: string
	carModel: string
	carPicture: string
	pricePerDay: number
	startDate: string
	endDate: string
}

export default function ReservationModal({
	open,
	onClose,
	carId,
	carBrand,
	carModel,
	carPicture,
	pricePerDay,
	startDate,
	endDate,
}: ReservationModalProps) {
	const { token } = useAuthStore()
	const [loading, setLoading] = useState(false)
	const [confirmed, setConfirmed] = useState(false)

	const start = new Date(startDate)
	const end = new Date(endDate)

	const days = differenceInDays(end, start)
	const totalPrice = days * pricePerDay

	const handleConfirm = async () => {
		setLoading(true)
		try {
			await createReservation(carId, startDate, endDate, token)
			setConfirmed(true)
		} catch (err: unknown) {
			toast.error(err instanceof Error ? err.message : 'Błąd tworzenia rezerwacji', {
				position: 'top-center',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleClose = () => {
		setConfirmed(false)
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
				{confirmed ? (
					<div className="flex flex-col items-center justify-center py-14 px-8 text-center gap-4">
						<div className="rounded-full bg-green-100 dark:bg-green-950 p-4">
							<CheckCircle2 className="w-10 h-10 text-green-500" />
						</div>
						<h2 className="text-2xl font-bold tracking-tight">Rezerwacja potwierdzona!</h2>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Twoja rezerwacja{' '}
							<span className="font-semibold text-foreground">
								{carBrand} {carModel}
							</span>{' '}
							została pomyślnie złożona. Szczegóły znajdziesz w swoim profilu.
						</p>
						<Button onClick={handleClose} className="mt-4 rounded-xl px-8">
							Zamknij
						</Button>
					</div>
				) : (
					<>
						<div className="relative h-44 w-full">
							<img src={carPicture} alt={`${carBrand} ${carModel}`} className="w-full h-full object-cover" />
							<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
							<button
								onClick={handleClose}
								className="absolute top-3 right-3 rounded-full bg-black/40 hover:bg-black/60 p-1.5 transition-colors">
								<X className="w-4 h-4 text-white" />
							</button>
							<div className="absolute bottom-4 left-5">
								<h3 className="text-white text-xl font-bold">
									{carBrand} {carModel}
								</h3>
							</div>
						</div>

						<div className="px-6 pt-5 pb-6 flex flex-col gap-5">
							<DialogHeader>
								<DialogTitle className="text-lg">Potwierdź rezerwację</DialogTitle>
							</DialogHeader>

							<div className="rounded-2xl bg-muted/50 border p-4 flex flex-col gap-3">
								<div className="flex items-center gap-3">
									<CalendarDays className="w-5 h-5 text-primary shrink-0" />
									<div className="flex-1 flex justify-between items-center text-sm">
										<span className="text-muted-foreground">Od</span>
										<span className="font-semibold">{format(start, 'dd MMM yyyy', { locale: pl })}</span>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<CalendarDays className="w-5 h-5 text-primary shrink-0" />
									<div className="flex-1 flex justify-between items-center text-sm">
										<span className="text-muted-foreground">Do</span>
										<span className="font-semibold">{format(end, 'dd MMM yyyy', { locale: pl })}</span>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Car className="w-5 h-5 text-primary shrink-0" />
									<div className="flex-1 flex justify-between items-center text-sm">
										<span className="text-muted-foreground">Czas najmu</span>
										<span className="font-semibold">
											{days} {days === 1 ? 'dzień' : 'dni'}
										</span>
									</div>
								</div>
							</div>

							<Separator />

							<div className="flex flex-col gap-2 text-sm">
								<div className="flex justify-between text-muted-foreground">
									<span>
										{pricePerDay} zł/dzień x {days} dni
									</span>
									<span>{totalPrice} zł</span>
								</div>
								<div className="flex justify-between font-bold text-base mt-1">
									<span>Łącznie</span>
									<span className="text-primary">{totalPrice} zł</span>
								</div>
							</div>

							<div className="flex gap-3 mt-1">
								<Button variant="outline" className="flex-1 rounded-xl h-11" onClick={handleClose} disabled={loading}>
									Anuluj
								</Button>
								<Button className="flex-1 rounded-xl h-11" onClick={handleConfirm} disabled={loading}>
									{loading ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Rezerwuję...
										</>
									) : (
										'Potwierdź rezerwację'
									)}
								</Button>
							</div>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	)
}
