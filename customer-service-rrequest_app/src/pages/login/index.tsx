import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, signIn } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/customers', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return (
    <section className="card">
      <p className="eyebrow">Authentication</p>
      <h2>Sign in to manage service requests</h2>
      <p>Use an OIDC-enabled provider when configured, or use the demo sign-in flow for local development.</p>
      <button className="primary-button" onClick={signIn} disabled={isLoading}>
        {isLoading ? 'Preparing…' : 'Sign in'}
      </button>
    </section>
  )
}

export default LoginPage
