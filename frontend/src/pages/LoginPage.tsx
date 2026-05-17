import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/useAuthStore'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')

    if (!email || !password) {
      setError('Pola nie mogą być puste')
      return
    }

    try {
      setLoading(true)
      await login({ email, password })

      toast.success('Pomyślnie zalogowano', {
        position: 'top-center',
      })

      navigate('/')
    } catch (err) {
      console.log((err as Error)?.message)

      setError('Niepoprawne dane')

      toast.error('Niepoprawne dane', {
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
            Login
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

          {error && (
            <p className="text-sm text-red-500 -mt-2">
              {error}
            </p>
          )}

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}