import { useCallback, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, Mail, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { buildLoginPayload } from '../lib/auth/buildLoginPayload'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: { pathname?: string } } }
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setError('')

      if (!email) {
        setError('Email is required.')
        return
      }
      if (!password) {
        setError('Password is required.')
        return
      }

      setLoading(true)
      try {
        const payload = await buildLoginPayload(email, password)
        login(payload, rememberMe)
        const redirectTo = location.state?.from?.pathname || '/'
        navigate(redirectTo, { replace: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [email, password, rememberMe, navigate, login, location.state],
  )

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent1/20 text-accent1">
            <Zap className="h-6 w-6" strokeWidth={2.25} aria-hidden />
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-text-primary">FlowState</h1>
            <p className="mt-1 text-sm text-text-muted">Sign in with your iStreams ERP account</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-lg shadow-black/20 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-accent3/40 bg-accent3/10 px-4 py-3 text-sm text-accent3">
                {error}
              </div>
            )}

            <label className="block text-sm text-text-muted">
              Email address
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-text-primary outline-none ring-accent1/40 focus:ring-2"
                  required
                />
              </div>
            </label>

            <label className="block text-sm text-text-muted">
              Password
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-10 text-text-primary outline-none ring-accent1/40 focus:ring-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted transition hover:bg-surface2 hover:text-text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent1"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent1 px-4 py-2.5 text-sm font-semibold text-background transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
