import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  subtitle?: string
  rightAction?: ReactNode
  children: ReactNode
  className?: string
}

export function Card({ title, subtitle, rightAction, children, className = '' }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {(title || subtitle || rightAction) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {rightAction}
        </div>
      )}
      {children}
    </div>
  )
}
