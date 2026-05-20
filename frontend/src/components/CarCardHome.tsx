import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

interface CarCardHomeProps {
	id: string
	brand: string
	model: string
	picture: string
	pricePerDay: number
	startDate?: string
	endDate?: string
}

export default function CarCardHome({ id, brand, model, picture, pricePerDay, startDate, endDate }: CarCardHomeProps) {
	const navigate = useNavigate()

	const handleClick = () => {
		const params = new URLSearchParams()
		if (startDate) params.set('startDate', startDate)
		if (endDate) params.set('endDate', endDate)

		const query = params.toString()
		navigate(`/cars/${id}${query ? `?${query}` : ''}`)
	}
	return (
		<div
			onClick={() => handleClick()}
			key={id}
			className="group overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl shadow-sm transition-all hover:shadow-md flex flex-col hover:cursor-pointer">
			<div className="overflow-hidden aspect-video bg-muted relative">
				<img
					src={picture}
					alt={`${brand} ${model}`}
					className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
				/>
			</div>
			<div className="p-5 flex flex-col flex-1 justify-between">
				<div>
					<h3 className="text-xl font-bold tracking-tight">
						{brand} {model}
					</h3>
					<p className="text-sm text-muted-foreground mt-1">Dostępny w wybranym terminie</p>
				</div>
				<div className="mt-6 flex items-center justify-between">
					<div>
						<span className="text-2xl font-black text-primary">{pricePerDay}</span>
						<span className="text-xs text-muted-foreground font-medium">PLN / h</span>
					</div>
					<Button
						size="sm"
						className="rounded-xl hover:px-5 hover:cursor-pointer"
						onClick={() => handleClick()}>
						Zarezerwuj
					</Button>
				</div>
			</div>
		</div>
	)
}
