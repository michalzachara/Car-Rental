import { useState } from 'react'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getCars, type Car, type GetCarsFilters } from '@/api/cars'
import CarCardHome from '@/components/CarCardHome'
import { CarFilters } from '@/components/CarFilters';

export default function Home() {
  const [allCars, setAllCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dates, setDates] = useState<{ startDate?: string; endDate?: string }>({})
  const [filters, setFilters] = useState<Omit<GetCarsFilters, 'startDate' | 'endDate'>>({
    search: '',
    category: '',
    fuelType: '',
    gearbox: '',
    minPrice: '',
    maxPrice: '',
  })

  const handleSearchDates = React.useCallback(async (startDate: string, endDate: string) => {
    setDates({ startDate, endDate })
    setLoading(true)
    setError(null)
    try {
      const data = await getCars({ startDate, endDate })
      if (data.success) {
        setAllCars(data.cars)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd.')
    } finally {
      setLoading(false)
    }
  }, [])

  const filteredCars = allCars.filter((car) => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!car.brand.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q)) return false
    }
    if (filters.category && car.category !== filters.category) return false
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false
    if (filters.gearbox && car.gearbox !== filters.gearbox) return false
    if (filters.minPrice && car.pricePerDay < Number(filters.minPrice)) return false
    if (filters.maxPrice && car.pricePerDay > Number(filters.maxPrice)) return false
    return true
  })

  const handleFilterChange = (key: keyof GetCarsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ search: '', category: '', fuelType: '', gearbox: '', minPrice: '', maxPrice: '' })
  }

  const hasDates = !!dates.startDate && !!dates.endDate

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/30">
      <section className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-30 left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-3xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Znajdź idealny <span className="text-primary">samochód</span>
            <br />
            do wypożyczenia
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Wybierz interesujący Cię termin rezerwacji i dostosuj filtry, aby wyświetlić idealne auto.
          </p>

          <DatePickerWithRange onSearch={handleSearchDates} />

          {hasDates && (
            <CarFilters
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          )}
        </div>
      </section>


      <section className="max-w-6xl mx-auto px-4 pb-16">
        {!hasDates && (
          <div className="text-center py-10 text-muted-foreground">
            Wybierz termin rezerwacji, aby zobaczyć dostępne pojazdy.
          </div>
        )}

        {loading && (
          <div className="text-center py-10 text-muted-foreground animate-pulse">
            Aktualizuję listę pojazdów...
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-destructive font-medium">⚠️ {error}</div>
        )}

        {!loading && !error && hasDates && filteredCars.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Brak samochodów spełniających wybrane kryteria. Spróbuj zmienić filtry.
          </div>
        )}

        {!loading && !error && filteredCars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCardHome
                key={car._id}
                id={car._id}
                brand={car.brand}
                model={car.model}
                picture={car.picture}
                pricePerDay={car.pricePerDay}
                startDate={dates.startDate}
                endDate={dates.endDate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

interface DatePickerWithRangeProps {
	onSearch: (startDate: string, endDate: string) => void
}

export function DatePickerWithRange({ onSearch }: DatePickerWithRangeProps) {
	const [date, setDate] = React.useState<DateRange | undefined>({
		from: new Date(),
		to: undefined,
	})

	const handleSearchClick = () => {
  if (date?.from && date?.to) {
    const start = new Date(date.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date.to);
    end.setHours(0, 0, 0, 0);

    if (end <= start) return;

    onSearch(start.toISOString(), end.toISOString());
  }
};

	return (
		<div className="mt-8 flex items-center gap-3 max-w-xl mx-auto bg-background/60 backdrop-blur-xl border rounded-2xl p-2 shadow-lg">
			<div className="relative flex-1">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							id="date-picker-range"
							className="w-full h-12 justify-start px-3 font-normal text-base rounded-xl hover:bg-transparent focus-visible:ring-0">
							<CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
							{date?.from ? (
								date.to ? (
									<>
										{format(date.from, 'dd LLL yyyy', { locale: pl })} -{' '}
										{format(date.to, 'dd LLL yyyy', { locale: pl })}
									</>
								) : (
									<span className="text-muted-foreground">
										{format(date.from, 'dd LLL yyyy', { locale: pl })} – wybierz datę końcową...
									</span>
								)
							) : (
								<span className="text-muted-foreground">Wybierz termin rezerwacji...</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0 rounded-2xl" align="start">
						<Calendar
							mode="range"
							defaultMonth={date?.from}
							selected={date}
							onSelect={setDate}
							numberOfMonths={2}
							locale={pl}
							disabled={day => {
								const today = new Date(new Date().setHours(0, 0, 0, 0))
								if (day < today) return true
								if (date?.from && !date?.to) {
									const from = new Date(date.from)
									from.setHours(0, 0, 0, 0)
									const d = new Date(day)
									d.setHours(0, 0, 0, 0)
									return d <= from
								}
								return false
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<Button onClick={handleSearchClick} className="h-12 px-6 rounded-xl font-medium" disabled={!date?.from}>
				Szukaj
			</Button>
		</div>
	)
}
