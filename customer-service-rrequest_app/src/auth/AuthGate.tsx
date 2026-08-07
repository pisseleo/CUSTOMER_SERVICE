import { useEffect, type ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { oidcMisconfigured } from './oidcConfig';
import { registerAccessTokenProvider, registerUnauthorizedHandler } from '../api/client';
import { ErrorScreen } from '../components/common/ErrorScreen';
import { LoadingScreen } from '../components/common/LoadingScreen';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const auth = useAuth();
  useEffect(() => {
    registerAccessTokenProvider(() => auth.user?.access_token);
  }, [auth.user]);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
        auth.signinRedirect();
    })
  }, [auth])

  if(oidcMisconfigured){
    return (
        <ErrorScreen
        title="Authentication not configured"
        message="Set VITE_OIDC_AUTHORITY and VITE_OIDC_CLIENT in .env file points this app at your OpenID Connect provider (KeyCloak, Auth0, etc.)"
    />)
  }

  if(auth.isLoading){
    return <LoadingScreen label="Checking Your session" />
  }

  if(!auth.isAuthenticated){
    return <SignInScreen onSignIn={() => auth.signinRedirect()} />
  }

  return <>{children}</>;
}

function SignInScreen({onSignIn}: {onSignIn: () => void}){
    return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-paper-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-desk-500 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path
              d="M4 6h16M4 12h16M4 18h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-ink-900">Service Desk</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Sign in with your organization account and start managing requests.
        </p>
        <button
          onClick={onSignIn}
          className="mt-6 w-full rounded-md bg-desk-500 px-4 py-2.5 text-sm font-medium text-white bg-teal-500 transition-colors hover:bg-desk-600 focus-visible:outline-offset-2"
        >
          Sign in
        </button>
      </div>
    </div>
    );
}