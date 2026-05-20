// @/components/CarFilters.tsx
import { type GetCarsFilters } from '@/api/cars'

interface CarFiltersProps {
  filters: GetCarsFilters
  onChange: (key: keyof GetCarsFilters, value: string) => void
  onClear: () => void
}

export function CarFilters({ filters, onChange, onClear }: CarFiltersProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 bg-background/60 backdrop-blur-xl border rounded-2xl p-4 shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
      
      {/* Wyszukiwarka tekstowa */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Marka lub model</label>
        <input
          type="text"
          placeholder="np. Audi, BMW..."
          value={filters.search || ''}
          onChange={(e) => onChange('search', e.target.value)}
          className="w-full h-10 px-3 text-sm rounded-xl border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {/* Kategoria */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Kategoria</label>
        <select
          value={filters.category || ''}
          onChange={(e) => onChange('category', e.target.value)}
          className="w-full h-10 px-3 text-sm rounded-xl border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Wszystkie</option>
          <option value="miejskie">Miejskie</option>
          <option value="kompaktowe">Kompaktowe</option>
          <option value="SUV">SUV</option>
          <option value="rodzinne">Rodzinne</option>
          <option value="premium">Premium</option>
          <option value="dostawcze">Dostawcze</option>
        </select>
      </div>

      {/* Skrzynia biegów */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Skrzynia biegów</label>
        <select
          value={filters.gearbox || ''}
          onChange={(e) => onChange('gearbox', e.target.value)}
          className="w-full h-10 px-3 text-sm rounded-xl border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Wszystkie</option>
          <option value="manual">Manualna</option>
          <option value="automatyczna">Automatyczna</option>
        </select>
      </div>

      {/* Rodzaj paliwa */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Paliwo</label>
        <select
          value={filters.fuelType || ''}
          onChange={(e) => onChange('fuelType', e.target.value)}
          className="w-full h-10 px-3 text-sm rounded-xl border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="">Wszystkie</option>
          <option value="benzyna">Benzyna</option>
          <option value="disel">Diesel</option>
          <option value="gaz">LPG / Gaz</option>
        </select>
      </div>

      {/* Przedział cenowy */}
      <div className="space-y-1.5 md:col-span-2 grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Cena min (zł)</label>
          <input
            type="number"
            placeholder="Od"
            value={filters.minPrice || ''}
            onChange={(e) => onChange('minPrice', e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-xl border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Cena max (zł)</label>
          <input
            type="number"
            placeholder="Do"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            className="w-full h-10 px-3 text-sm rounded-xl border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Przycisk czyszczenia filtrów */}
      <div className="md:col-span-2">
        <button
          onClick={onClear}
          type="button"
          className="w-full h-10 text-sm font-medium text-muted-foreground hover:text-foreground border border-dashed rounded-xl hover:bg-muted/50 transition-colors"
        >
          Resetuj filtry
        </button>
      </div>
    </div>
  )
}