# Database — Auth

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `auth.users` (Supabase managed) | INSERT (signUp), SELECT (getSession, onAuthStateChange) | `id`, `email`, `user_metadata.full_name` |

## Main queries

**Sign up** (via Supabase Auth SDK, not raw SQL):
```
supabase.auth.signUp({
  email,
  password,
  options: { data: { full_name: fullName } }
})
```

**Sign in** (via Supabase Auth SDK):
```
supabase.auth.signInWithPassword({ email, password })
```

**Session restore on load** (in AuthContext):
```
supabase.auth.getSession()
```

**Realtime auth state listener** (in AuthContext):
```
supabase.auth.onAuthStateChange((_event, session) => { ... })
```

## RLS assumptions
Auth operations go through Supabase Auth endpoints, not through PostgREST, so no custom RLS policies apply here. User rows in `auth.users` are managed entirely by Supabase.

## Table relationships used
`auth.users.id` is the foreign key referenced by all other application tables (`workout_plans.user_id`, `sessions.user_id`, `body_weight.user_id`, `exercises.user_id`). Auth is the root of all user-scoped data.
