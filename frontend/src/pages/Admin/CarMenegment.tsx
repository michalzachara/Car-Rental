import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

import { deleteCar, getAllCars, type Car } from '@/api/admin'
import { useAuthStore } from '@/lib/useAuthStore'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useNavigate } from 'react-router-dom'

export default function CarMenegment() {
	const [cars, setCars] = useState<Car[]>([])
	const [loading, setLoading] = useState(true)
	const { token } = useAuthStore()
	const [carToDelete, setCarToDelete] = useState<string | null>(null)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchCars = async () => {
			try {
				if (!token) {
					toast.error('Błąd logowania', {
						position: 'top-center',
					})
					return
				}

				const response = await getAllCars(token)

				if (response.success && response.data) {
					setCars(response.data)
				} else {
					toast.error(response.message, {
						position: 'top-center',
					})
				}
			} catch (error) {
				console.error('Błąd pobierania aut:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchCars()
	}, [token])

	const handleDelete = async (id: string) => {
		try {
			setLoading(true)

			if (!token)
				toast.error('Bład logowania', {
					position: 'top-center',
				})

			const response = await deleteCar(id, token)
			if (response.success)
				toast.success('Pomyslnie usunieto auto', {
					position: 'top-center',
				})

			if (!response.success) throw new Error('blad podczas usuwania auta')
		} catch {
			toast.error('Bład podczas usuwania auta', {
				position: 'top-center',
			})
		} finally {
			setLoading(false)
		}
		toast.success('Usunięto auto')
		setCars(prev => prev.filter(car => car._id !== id))
	}

	if (loading) {
		return (
			<div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i} className="w-full rounded-2xl">
						<CardContent className="flex flex-col md:flex-row gap-4 p-4">
							<Skeleton className="h-40 w-full md:w-64 rounded-xl" />
							<div className="flex-1 space-y-3">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-6 w-24" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
			{cars.map(car => (
				<Card
					key={car._id}
					className="group overflow-hidden rounded-2xl shadow-sm transition hover:shadow-lg p-0 m-0"
					onClick={() => navigate(`/admin/edit/${car._id}`)}>
					<CardContent className="p-0">
						<div className="flex flex-col md:flex-row">
							<div className="w-full md:w-80 h-52 md:h-full overflow-hidden">
								<img src={car.picture} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover block" />
							</div>

							<div className="flex flex-1 flex-col justify-between p-4 md:p-6">
								<div className="space-y-4">
									<div className="flex flex-col gap-2">
										<h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
											{car.brand} {car.model}
										</h2>

										<div className="flex flex-wrap items-center gap-2">
											<Badge variant="secondary" className="text-xs md:text-sm px-3 py-1">
												{car.category}
											</Badge>

											<span className="text-sm text-muted-foreground">ID: {car._id.slice(-6)}</span>
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="text-sm md:text-base font-medium">
											<span className="text-muted-foreground">Cena:</span>{' '}
											<span className="font-semibold text-primary">{car.pricePerDay} zł / dzień</span>
										</div>
									</div>
								</div>

								<div className="flex justify-end">
									<Button
										onClick={e => {
											e.stopPropagation()
											setCarToDelete(car._id)
										}}>
										<Trash2 size={16} />
										Usuń
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
			<AlertDialog open={!!carToDelete} onOpenChange={open => !open && setCarToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
						<AlertDialogDescription>
							Czy na pewno chcesz usunąć to auto? Tej operacji nie można cofnąć.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setCarToDelete(null)}>Anuluj</AlertDialogCancel>

						<AlertDialogAction
							onClick={() => {
								if (carToDelete) handleDelete(carToDelete)
								setCarToDelete(null)
							}}>
							Usuń
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
