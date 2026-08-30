interface BadgeProps {
  label: string
  tone?: 'high' | 'medium' | 'low' | 'success' | 'warning' | 'neutral'
}

const badgeStyles = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-sky-100 text-sky-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  neutral: 'bg-slate-100 text-slate-700',
}

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[tone]}`}>
      {label}
    </span>
  )
}
