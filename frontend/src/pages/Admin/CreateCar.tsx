import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Label } from '@/components/ui/label'
import { addCar, type CreateCarData } from '@/api/admin'

import { toast } from 'sonner'
import { useAuthStore } from '@/lib/useAuthStore'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function AddCarForm() {
	const [loading, setLoading] = useState(false)

	const [formData, setFormData] = useState<
		Omit<CreateCarData, 'seats' | 'pricePerDay' | 'productionYear'> & {
			seats: number | ''
			pricePerDay: number | ''
			productionYear: number | ''
		}
	>({
		brand: '',
		model: '',
		category: 'miejskie',
		productionYear: 2020,
		fuelType: 'benzyna',
		gearbox: 'manual',
		seats: 5,
		pricePerDay: 100,
		picture: '',
	})

	const [errors, setErrors] = useState<Record<string, string>>({})
	const { token } = useAuthStore()
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target

		setFormData({
			...formData,
			[name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
		})

		setErrors({
			...errors,
			[name]: '',
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const newErrors: Record<string, string> = {}

		if (!formData.brand) newErrors.brand = 'Podaj markę'
		if (!formData.model) newErrors.model = 'Podaj model'
		if (!formData.category) newErrors.category = 'Wybierz kategorię'
		if (!formData.productionYear) newErrors.productionYear = 'Podaj rok produkcji'
		if (!formData.fuelType) newErrors.fuelType = 'Wybierz paliwo'
		if (!formData.gearbox) newErrors.gearbox = 'Wybierz skrzynię'
		if (!formData.seats) newErrors.seats = 'Podaj liczbę miejsc'
		if (!formData.pricePerDay) newErrors.pricePerDay = 'Podaj cenę'
		if (!formData.picture) newErrors.picture = 'Podaj zdjęcie'

		setErrors(newErrors)

		if (Object.keys(newErrors).length > 0) return

		try {
			setLoading(true)

			if (!token)
				toast.error('Bład logowania', {
					position: 'top-center',
				})

			const response = await addCar(formData as CreateCarData, token)
			if (response.success)
				toast.success('Pomyslnie dodano auto', {
					position: 'top-center',
				})
			else {
				toast.error(response.message, {
					position: 'top-center',
				})
			}

			if (!response.success) throw new Error('blad podczas dodawania auta')
		} catch {
			toast.error('Bład podczas dodawania auta', {
				position: 'top-center',
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="container max-w-3xl py-10">
			<div className="h-52">
				{!formData.picture && !formData.brand && !formData.model ? (
					<Card className="w-full rounded-2xl h-full">
						<CardContent className="flex flex-col md:flex-row gap-4 p-4 h-full">
							<Skeleton className="h-full w-full md:w-80 rounded-xl" />
							<div className="flex-1 space-y-3 p-2">
								<Skeleton className="h-7 w-48" />
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-5 w-32" />
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className="overflow-hidden rounded-2xl shadow-sm p-0 m-0 h-full">
						<CardContent className="p-0 h-full">
							<div className="flex flex-col md:flex-row h-full">
								<div className="w-full md:w-80 h-full overflow-hidden">
									{formData.picture ? (
										<img
											src={formData.picture}
											alt={`${formData.brand} ${formData.model}`}
											className="h-full w-full object-cover block"
										/>
									) : (
										<Skeleton className="h-full w-full" />
									)}
								</div>

								<div className="flex flex-1 flex-col justify-between p-4 md:p-6">
									<div className="space-y-4">
										<div className="flex flex-col gap-2">
											<h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight">
												{formData.brand || <Skeleton className="h-7 w-36" />} {formData.model}
											</h2>

											<div className="flex flex-wrap items-center gap-2">
												{formData.category ? (
													<Badge variant="secondary" className="text-xs md:text-sm px-3 py-1">
														{formData.category}
													</Badge>
												) : (
													<Skeleton className="h-5 w-20" />
												)}
											</div>
										</div>

										<div className="text-sm md:text-base font-medium">
											<span className="text-muted-foreground">Cena:</span>{' '}
											{formData.pricePerDay ? (
												<span className="font-semibold text-primary">{formData.pricePerDay} zł / dzień</span>
											) : (
												<Skeleton className="inline-block h-4 w-24" />
											)}
										</div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
			<Card className="mt-10">
				<CardHeader>
					<CardTitle className="text-2xl">Dodaj samochód</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Marka</Label>

								<Input name="brand" placeholder="BMW" value={formData.brand} onChange={handleChange} />

								{errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
							</div>

							<div className="space-y-2">
								<Label>Model</Label>

								<Input name="model" placeholder="M5" value={formData.model} onChange={handleChange} />

								{errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Kategoria</Label>

								<Select
									value={formData.category}
									onValueChange={value =>
										setFormData({
											...formData,
											category: value as CreateCarData['category'],
										})
									}>
									<SelectTrigger className="focus:ring-2 focus:ring-black focus:ring-offset-2">
										<SelectValue placeholder="Wybierz kategorię" />
									</SelectTrigger>

									<SelectContent className="rounded-xl border shadow-lg">
										<SelectGroup>
											<SelectItem value="miejskie">Miejskie</SelectItem>

											<SelectItem value="kompaktowe">Kompaktowe</SelectItem>

											<SelectItem value="SUV">SUV</SelectItem>

											<SelectItem value="rodzinne">Rodzinne</SelectItem>

											<SelectItem value="premium">Premium</SelectItem>

											<SelectItem value="dostawcze">Dostawcze</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>

								{errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
							</div>

							<div className="space-y-2">
								<Label>Skrzynia biegów</Label>
								<Select
									value={formData.gearbox}
									onValueChange={value =>
										setFormData({
											...formData,
											gearbox: value as CreateCarData['gearbox'],
										})
									}>
									<SelectTrigger className="focus:ring-2 focus:ring-black focus:ring-offset-2">
										<SelectValue placeholder="Wybierz skrzynię" />
									</SelectTrigger>

									<SelectContent className="rounded-xl border shadow-lg">
										<SelectGroup>
											<SelectItem value="manual">Manualna</SelectItem>

											<SelectItem value="automatyczna">Automatyczna</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>

								{errors.gearbox && <p className="text-sm text-red-500">{errors.gearbox}</p>}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Rok produkcji</Label>

								<Input type="number" name="productionYear" value={formData.productionYear} onChange={handleChange} />

								{errors.productionYear && <p className="text-sm text-red-500">{errors.productionYear}</p>}
							</div>

							<div className="space-y-2">
								<Label>Rodzaj paliwa</Label>

								<Select
									value={formData.fuelType}
									onValueChange={value =>
										setFormData({
											...formData,
											fuelType: value as CreateCarData['fuelType'],
										})
									}>
									<SelectTrigger className="focus:ring-2 focus:ring-black focus:ring-offset-2">
										<SelectValue placeholder="Wybierz paliwo" />
									</SelectTrigger>

									<SelectContent className="rounded-xl border shadow-lg">
										<SelectGroup>
											<SelectItem value="benzyna">Benzyna</SelectItem>

											<SelectItem value="gaz">Gaz</SelectItem>

											<SelectItem value="disel">Disel</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>

								{errors.fuelType && <p className="text-sm text-red-500">{errors.fuelType}</p>}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Liczba miejsc</Label>

								<Input type="number" name="seats" value={formData.seats} onChange={handleChange} />

								{errors.seats && <p className="text-sm text-red-500">{errors.seats}</p>}
							</div>

							<div className="space-y-2">
								<Label>Cena za dzień</Label>

								<Input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} />

								{errors.pricePerDay && <p className="text-sm text-red-500">{errors.pricePerDay}</p>}
							</div>
						</div>

						<div className="space-y-2">
							<Label>Zdjęcie URL</Label>

							<Input
								name="picture"
								placeholder="https://example.com/car.jpg"
								value={formData.picture}
								onChange={handleChange}
							/>

							{errors.picture && <p className="text-sm text-red-500">{errors.picture}</p>}
						</div>

						<Button type="submit" disabled={loading} className="w-full">
							{loading ? 'Dodawanie...' : 'Dodaj samochód'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
