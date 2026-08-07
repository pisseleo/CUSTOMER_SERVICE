import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AuthProvider as OidcAuthProvider, useAuth as useOidcAuth } from 'oidc-react'
import { AuthContext, type AuthContextValue } from './auth'

function AuthProviderInner({ children, oidcConfigured }: { children: ReactNode; oidcConfigured: boolean }) {
  const oidcAuth = useOidcAuth()
  const [demoUser, setDemoUser] = useState<{ name?: string; email?: string } | null>(null)

  const signIn = useCallback(() => {
    if (oidcConfigured) {
      void oidcAuth.signIn()
      return
    }

    setDemoUser({ name: 'Demo User', email: 'demo@example.com' })
  }, [oidcConfigured, oidcAuth])

  const signOut = useCallback(() => {
    if (oidcConfigured) {
      void oidcAuth.signOutRedirect()
      return
    }

    setDemoUser(null)
  }, [oidcConfigured, oidcAuth])

  const value = useMemo<AuthContextValue>(
    () => {
      const profile = oidcAuth.userData?.profile as Record<string, unknown> | undefined

      return {
        isAuthenticated: oidcConfigured ? Boolean(oidcAuth.userData) : Boolean(demoUser),
        isLoading: oidcConfigured ? oidcAuth.isLoading : false,
        user: oidcConfigured
          ? {
              name: typeof profile?.name === 'string' ? profile.name : undefined,
              email: typeof profile?.email === 'string' ? profile.email : undefined,
            }
          : demoUser,
        signIn,
        signOut,
      }
    },
    [demoUser, oidcAuth.isLoading, oidcAuth.userData, oidcConfigured, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authority = import.meta.env.VITE_OIDC_AUTHORITY || import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_OIDC_CLIENT_ID || import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectUri = import.meta.env.VITE_OIDC_REDIRECT_URI || window.location.origin
  const scope = import.meta.env.VITE_OIDC_SCOPE || 'openid profile email'
  const audience = import.meta.env.VITE_OIDC_AUDIENCE
  const oidcConfigured = Boolean(authority && clientId)
  const extraQueryParams = audience ? { audience } : undefined

  return (
    <OidcAuthProvider
      authority={authority}
      clientId={clientId}
      redirectUri={redirectUri}
      scope={scope}
      extraQueryParams={extraQueryParams}
    >
      <AuthProviderInner oidcConfigured={oidcConfigured}>{children}</AuthProviderInner>
    </OidcAuthProvider>
  )
}