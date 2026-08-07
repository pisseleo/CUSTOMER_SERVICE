import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export function Header() {
  const auth = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const name = auth.user?.profile.name ?? auth.user?.profile.email ?? 'Signed in';
  const initials = getInitials(name);

  return (
    <header className="sticky top-0 z-20 border-b border-paper-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/list" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-desk-500 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink-900">Service Desk</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              to="/list"
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'bg-desk-50 text-desk-700' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              Requests
            </Link>
            <Link
              to="/new"
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === '/new' ? 'bg-desk-50 text-desk-700' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              New request
            </Link>
          </nav>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-desk-100 text-xs font-semibold text-desk-700"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            {initials}
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-52 rounded-md border border-paper-200 bg-white py-1.5 shadow-lg">
                <p className="truncate px-3 py-1.5 text-xs text-ink-500">{name}</p>
                <button
                  onClick={() => void auth.removeUser().then(() => auth.signoutRedirect())}
                  className="block w-full px-3 py-1.5 text-left text-sm text-ink-900 hover:bg-paper-50"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <nav className="flex items-center gap-1 border-t border-paper-200 px-4 py-1.5 sm:hidden">
        <Link
          to="/list"
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            location.pathname === '/' ? 'bg-desk-50 text-desk-700' : 'text-ink-500'
          }`}
        >
          Requests
        </Link>
        <Link
          to="/new"
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            location.pathname === '/new' ? 'bg-desk-50 text-desk-700' : 'text-ink-500'
          }`}
        >
          New request
        </Link>
      </nav>
    </header>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
