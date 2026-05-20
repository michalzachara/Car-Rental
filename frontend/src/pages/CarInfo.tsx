import { getCarById, type Car } from '@/api/cars'
import { useAuthStore } from '@/lib/useAuthStore'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { Calendar, CarFront, Cog, Fuel, Users } from 'lucide-react'
import ReservationModal from '@/components/ReservationModal'

export default function CarInfo() {
	const { id } = useParams<{ id: string }>()
	const { token } = useAuthStore()
	const [searchParams] = useSearchParams()

	const [loading, setLoading] = useState(true)
	const [car, setCar] = useState<Car | null>(null)
	const [modalOpen, setModalOpen] = useState(false)

	const startDate = searchParams.get('startDate') ?? ''
	const endDate = searchParams.get('endDate') ?? ''

	useEffect(() => {
		const fetchCar = async () => {
			if (!id) return

			try {
				const response = await getCarById(id, token)

				if (response.success) {
					setCar(response.cars)
				}
			} catch {
				toast.error('Błąd pobierania danych auta', {
					position: 'top-center',
				})
			} finally {
				setLoading(false)
			}
		}

		fetchCar()
	}, [id, token])

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<p className="text-muted-foreground text-lg">Ładowanie...</p>
			</div>
		)
	}

	if (!car) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<p className="text-red-500 text-lg">Nie znaleziono auta</p>
			</div>
		)
	}

	const canReserve = Boolean(startDate && endDate)

	return (
		<div className="max-w-7xl mx-auto px-4 mt-10">
			<Card className="overflow-hidden rounded-3xl shadow-xl border-0 p-0">
				<div className="grid lg:grid-cols-2 gap-0">
					<div className="relative h-75 lg:h-full">
						<img src={car.picture} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />

						<Badge className="absolute top-5 left-5 text-sm px-4 py-1 rounded-full">{car.category}</Badge>
					</div>

					<CardContent className="p-8 flex flex-col justify-between">
						<div>
							<div className="flex items-center justify-between gap-4 flex-wrap">
								<div>
									<h1 className="text-4xl font-bold tracking-tight">
										{car.brand} {car.model}
									</h1>

									<p className="text-muted-foreground mt-2">Idealny wybór na komfortową podróż</p>
								</div>

								<div className="text-right">
									<p className="text-sm text-muted-foreground">Cena za dzień</p>

									<h2 className="text-3xl font-bold">{car.pricePerDay} zł</h2>
								</div>
							</div>

							<Separator className="my-8" />

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
								<div className="flex items-center gap-4 rounded-2xl border p-4">
									<CarFront className="w-6 h-6" />

									<div>
										<p className="text-sm text-muted-foreground">Kategoria</p>

										<p className="font-semibold">{car.category}</p>
									</div>
								</div>

								<div className="flex items-center gap-4 rounded-2xl border p-4">
									<Calendar className="w-6 h-6" />

									<div>
										<p className="text-sm text-muted-foreground">Rok produkcji</p>

										<p className="font-semibold">{car.productionYear}</p>
									</div>
								</div>

								<div className="flex items-center gap-4 rounded-2xl border p-4">
									<Fuel className="w-6 h-6" />

									<div>
										<p className="text-sm text-muted-foreground">Paliwo</p>

										<p className="font-semibold">{car.fuelType}</p>
									</div>
								</div>

								<div className="flex items-center gap-4 rounded-2xl border p-4">
									<Cog className="w-6 h-6" />

									<div>
										<p className="text-sm text-muted-foreground">Skrzynia</p>

										<p className="font-semibold">{car.gearbox || 'Brak danych'}</p>
									</div>
								</div>

								<div className="flex items-center gap-4 rounded-2xl border p-4 sm:col-span-2">
									<Users className="w-6 h-6" />

									<div>
										<p className="text-sm text-muted-foreground">Liczba miejsc</p>

										<p className="font-semibold">{car.seats}</p>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-10 flex flex-col gap-3">
							{!canReserve && (
								<p className="text-sm text-muted-foreground text-center">
									Wróć na stronę główną i wybierz termin, aby zarezerwować auto.
								</p>
							)}

							<Button
								className="flex-1 py-4 h-12 text-base rounded-xl hover:cursor-pointer"
								disabled={!canReserve}
								onClick={() => setModalOpen(true)}>
								Zarezerwuj teraz
							</Button>
						</div>
					</CardContent>
				</div>
			</Card>

			{canReserve && (
				<ReservationModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					carId={car._id}
					carBrand={car.brand}
					carModel={car.model}
					carPicture={car.picture}
					pricePerDay={car.pricePerDay}
					startDate={startDate}
					endDate={endDate}
				/>
			)}
		</div>
	)
}
