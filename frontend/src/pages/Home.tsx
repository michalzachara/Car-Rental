"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getCars, type Car } from '@/api/cars';


// --- GŁÓWNY KOMPONENT ---
export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCars();
  }, [])

  const fetchCars = async (startDate?: string, endDate?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCars(startDate, endDate)
      if (data.success) {
        setCars(data.cars)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Wystąpił nieoczekiwany błąd.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (startDate: string, endDate: string) => {
    // Funkcja wywoływana z komponentu DatePickerWithRange po kliknięciu "Szukaj"
    fetchCars(startDate, endDate)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/30">
      <section className="relative flex items-center justify-center px-4 pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-30 left-1/2 -translate-x-1/2 w-125 h-125 bg-primary/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Znajdź idealny <span className="text-primary">samochód</span>
            <br />
            do wypożyczenia
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Wybierz interesujący Cię termin rezerwacji i sprawdź, jakie pojazdy czekają na Ciebie w naszym garażu.
          </p>

          {/* Przekazujemy funkcję handleSearch do DatePickera */}
          <DatePickerWithRange onSearch={handleSearch} />

          <p className="text-xs text-muted-foreground">Popularne: BMW • Audi • Mercedes • Toyota</p>
        </div>
      </section>

			<section className="max-w-6xl mx-auto px-4 pb-24 grid md:grid-cols-3 gap-6">
        <div className="group rounded-2xl border bg-background/60 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
          <div className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Szybka rezerwacja</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Znajdź i zarezerwuj auto w mniej niż minutę bez zbędnych formalności.
          </p>
        </div>

        <div className="group rounded-2xl border bg-background/60 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
          <div className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Duży wybór</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Od miejskich aut po luksusowe SUV-y i sportowe modele premium.
          </p>
        </div>

        <div className="group rounded-2xl border bg-background/60 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
          <div className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            Transparentne ceny
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bez ukrytych kosztów, jasne warunki i pełna kontrola nad rezerwacją.
          </p>
        </div>
      </section>

      {/* --- SEKCJA WYNIKÓW WYSZUKIWANIA / KATALOGU --- */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        {loading && (
          <div className="text-center py-10 text-muted-foreground">
            Sprawdzam dostępność samochodów w bazie danych...
          </div>
        )}
        
        {error && (
          <div className="text-center py-10 text-destructive font-medium">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && cars.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            Brak wolnych samochodów w wybranym przedziale czasowym. Spróbuj zmienić daty.
          </div>
        )}

        {!loading && !error && cars.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div key={car._id} className="group overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl shadow-sm transition-all hover:shadow-md flex flex-col">
                <div className="overflow-hidden aspect-video bg-muted relative">
                  <img 
                    src={car.picture} 
                    alt={`${car.brand} ${car.model}`} 
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{car.brand} {car.model}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Dostępny w wybranym terminie</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-primary">{car.pricePerHour}</span>
                      <span className="text-xs text-muted-foreground font-medium"> PLN / h</span>
                    </div>
                    <Button size="sm" className="rounded-xl">Zarezerwuj</Button>
                  </div>
                </div>
              </div>
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
    if (date?.from) {
      const startDateISO = date.from.toISOString()
      const endDateISO = date.to ? date.to.toISOString() : startDateISO
      onSearch(startDateISO, endDateISO)
    }
  }

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
                  format(date.from, 'dd LLL yyyy', { locale: pl })
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
              disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
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