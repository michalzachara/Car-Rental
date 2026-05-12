import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Switch } from "./ui/switch"

export function ChangeThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4" />
      
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
      />
      
      <Moon className="h-4 w-4" />
    </div>
  )
}