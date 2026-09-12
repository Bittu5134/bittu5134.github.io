import { useState, useEffect } from 'react'
import { Link as ScrollLink } from 'react-scroll'
import { Link as RouterLink, useLocation } from 'react-router'

const NAV_LINKS = [
  { label: 'Overview',   to: 'overview'   },
  { label: 'Services',   to: 'services'   },
  { label: 'Experience', to: 'experience' },
  { label: 'Projects',   to: 'projects'   },
  { label: 'About',      to: 'about'      },
  { label: 'Blog',       to: 'blog'       },
  { label: 'Contact',    to: 'contact'    },
]

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Bittu5134',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: '/discord',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/bittu5134',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'RSS',
    href: '/rss.xml',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M6.18 15.64a2.18 2.18 0 012.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 012.18-2.18M4 4.44A15.56 15.56 0 0119.56 20h-2.83A12.73 12.73 0 004 7.27V4.44m0 5.66a9.9 9.9 0 019.9 9.9h-2.83A7.07 7.07 0 004 12.93V10.1z" />
      </svg>
    ),
  },
]

export default function Header() {
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const location                    = useLocation()
  const isHome                      = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const borderClass = scrolled
    ? 'border-amber_glow/30'
    : 'border-white/10'

  return (
    <header
      style={{ position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}
      className="w-[calc(100%-2rem)] max-w-5xl"
    >
      {/* Main pill bar */}
      <nav
        className={`bg-[#0b0e17]/90 backdrop-blur-xl border ${borderClass} rounded-2xl px-6 py-3 shadow-xl transition-colors duration-300 flex items-center justify-between gap-4`}
      >
        {/* Left: avatar + brand */}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src="/images/avatar.png"
            alt="Bittu avatar"
            width={28}
            height={28}
            className="rounded-full object-cover w-7 h-7 ring-1 ring-white/10"
          />
          <span className="text-cream text-sm font-semibold tracking-wide">bittu</span>
        </div>

        {/* Center: nav links (desktop) */}
        <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ label, to }) =>
            isHome ? (
              <li key={to}>
                <ScrollLink
                  to={to}
                  smooth
                  duration={600}
                  offset={-96}
                  spy
                  activeClass="text-amber_glow"
                  className="text-sm text-cream/50 hover:text-amber_glow transition-colors duration-200 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/5 select-none"
                >
                  {label}
                </ScrollLink>
              </li>
            ) : (
              <li key={to}>
                <RouterLink
                  to={`/#${to}`}
                  className="text-sm text-cream/50 hover:text-amber_glow transition-colors duration-200 px-3 py-1.5 rounded-lg hover:bg-white/5"
                >
                  {label}
                </RouterLink>
              </li>
            )
          )}
        </ul>

        {/* Right: social icons (desktop) */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-cream/50 hover:text-cream transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Mobile: hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden text-cream/60 hover:text-cream transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-[#0b0e17]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-4 shadow-xl flex flex-col gap-1">
          {NAV_LINKS.map(({ label, to }) =>
            isHome ? (
              <ScrollLink
                key={to}
                to={to}
                smooth
                duration={600}
                offset={-96}
                spy
                activeClass="text-amber_glow bg-white/5"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-cream/60 hover:text-amber_glow hover:bg-white/5 transition-colors duration-200 cursor-pointer px-4 py-2.5 rounded-xl select-none"
              >
                {label}
              </ScrollLink>
            ) : (
              <RouterLink
                key={to}
                to={`/#${to}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-cream/60 hover:text-amber_glow hover:bg-white/5 transition-colors duration-200 px-4 py-2.5 rounded-xl"
              >
                {label}
              </RouterLink>
            )
          )}

          {/* Social links in mobile menu */}
          <div className="flex items-center gap-2 pt-3 mt-1 border-t border-white/8 px-2">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-cream/40 hover:text-cream transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
