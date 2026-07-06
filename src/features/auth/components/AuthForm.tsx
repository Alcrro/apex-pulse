import { Input } from '../../../shared/components/atoms/Input'
import { Button } from '../../../shared/components/atoms/Button'
import type { AuthMode } from './AuthModeToggle'

interface AuthFormProps {
  mode: AuthMode
  form: { email: string; password: string; fullName: string }
  loading: boolean
  error: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function AuthForm({ mode, form, loading, error, onChange, onSubmit }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {mode === 'register' && (
        <Input
          label="Nume complet"
          name="fullName"
          type="text"
          placeholder="Ion Ionescu"
          value={form.fullName}
          onChange={onChange}
          required
          maxLength={100}
        />
      )}
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="email@exemplu.com"
        value={form.email}
        onChange={onChange}
        required
        maxLength={254}
      />
      <Input
        label="Parolă"
        name="password"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={onChange}
        required
        minLength={6}
        maxLength={128}
      />
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <Button type="submit" size="lg" disabled={loading} className="w-full mt-2">
        {loading ? 'Se procesează...' : mode === 'login' ? 'Intră în cont' : 'Creează cont'}
      </Button>
    </form>
  )
}
