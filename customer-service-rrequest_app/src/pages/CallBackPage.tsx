import { Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { ErrorScreen } from '../components/common/ErrorScreen';
import { LoadingScreen } from '../components/common/LoadingScreen';

export function CallbackPage() {
  const auth = useAuth();

  if (auth.error) {
    return (
      <ErrorScreen
        title="Sign-in failed"
        message={auth.error.message}
        action={{ label: 'Return to sign-in', onClick: () => void auth.signinRedirect() }}
      />
    );
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoadingScreen label="Completing sign-in…" />;
}
