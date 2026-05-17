import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/useAuthStore'
import { toast } from 'sonner'

export default function SignUpPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const register = useAuthStore(state => state.register)
  const navigate = useNavigate()

  const handleSignup = async () => {
    setError('')

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !repeatPassword
    ) {
      setError('Pola nie mogą być puste')
      return
    }

    if (password !== repeatPassword) {
      setError('Hasła nie są takie same')
      return
    }

    try {
      setLoading(true)

      await register({
        name: `${firstName} ${lastName}`,
        email,
        password,
      })

      toast.success('Konto zostało utworzone, teraz mozesz sie zalogować', {
        position: 'top-center',
      })

      navigate('/auth/login')
    } catch (err) {
      console.log((err as Error)?.message)

      setError('Nie udało się utworzyć konta')
      
      toast.error('Nie udało się utworzyć konta', {
        position: 'top-center',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-30 flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Sign Up
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Imię"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />

          <Input
            placeholder="Nazwisko"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Powtórz hasło"
            value={repeatPassword}
            onChange={e => setRepeatPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
          />

          {error && (
            <p className="text-sm text-red-500 -mt-2">
              {error}
            </p>
          )}

          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}