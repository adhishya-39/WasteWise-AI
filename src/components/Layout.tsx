import {
  BarChart3,
  ChartColumnBig,
  Info,
  Leaf,
  MapPinned,
  Menu,
  ScanSearch,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', path: '/', icon: ChartColumnBig },
  { label: 'AI Waste Scanner', path: '/scanner', icon: ScanSearch },
  { label: 'Collection Points', path: '/collection-points', icon: MapPinned },
  { label: 'Smart Route Planner', path: '/routes', icon: Leaf },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'About', path: '/about', icon: Info },
]

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-emerald-100 bg-white/90 p-5 shadow-[0_20px_45px_rgba(16,185,129,0.08)] backdrop-blur-sm lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200">
              <Leaf size={20} />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900">WasteWise AI</div>
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700">
                Demo Mode
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <Sparkles size={16} />
              AI Prototype
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              Demo model for live presentation and environmental decision support.
            </p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3 lg:hidden">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md">
                    <Leaf size={16} />
                  </div>
                  <div className="text-sm font-bold text-slate-900">WasteWise AI</div>
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 lg:flex">
                <Trash2 size={12} />
                Prototype • Demo Data
              </div>
            </div>

            {mobileMenuOpen && (
              <nav className="border-t border-slate-200 bg-white p-3 lg:hidden">
                <div className="space-y-2">
                  {navItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      end={path === '/'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`
                      }
                    >
                      <Icon size={16} />
                      {label}
                    </NavLink>
                  ))}
                </div>
              </nav>
            )}
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>

          <footer className="border-t border-slate-200 bg-white/80 px-4 py-5 text-sm text-slate-600 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Leaf size={16} />
                </div>
                WasteWise AI
              </div>
              <p>AI-powered smart waste management platform.</p>
              <p className="text-slate-500">Built for sustainable communities.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
