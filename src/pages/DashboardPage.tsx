import { useMemo } from 'react'
import { ArrowRight, CircleAlert, Factory, Leaf, Recycle, Trash2 } from 'lucide-react'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { categoryDistributionDemo, demoCollectionPoints, recentActivities, statusDistributionDemo, wasteCategoryMeta } from '../data/wasteData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { calculatePriorityDetails } from '../utils/routePlanner'
import type { CollectionPoint } from '../types'

const pieColors = ['#10b981', '#34d399', '#14b8a6', '#2dd4bf', '#f59e0b', '#64748b', '#a3e635']

export function DashboardPage() {
  const [points] = useLocalStorage<CollectionPoint[]>('wastewise-collection-points', demoCollectionPoints)

  // Calculate dynamic KPI values
  const kpis = useMemo(() => {
    const totalPoints = points.length
    const highPriorityPoints = points.filter((p) => p.urgency === 'HIGH').length
    const avgFillLevel = points.length > 0 ? Math.round(points.reduce((sum, p) => sum + p.fillLevel, 0) / points.length) : 0

    // Calculate recyclable waste percentage (% of waste types that are recyclable)
    const recyclableCount = points.filter((p) => wasteCategoryMeta[p.wasteType]?.recyclable === true).length
    const recyclablePercentage = points.length > 0 ? Math.round((recyclableCount / points.length) * 100) : 0

    // Calculate estimated collections saved (based on priority optimization)
    const priorityScores = points.map((p) => calculatePriorityDetails(p).score)
    const avgPriorityScore = priorityScores.length > 0 ? Math.round(priorityScores.reduce((a, b) => a + b, 0) / priorityScores.length) : 0
    const estimatedSavings = Math.min(Math.round((avgPriorityScore / 100) * 25), 30)

    return [
      { label: 'Total Collection Points', value: totalPoints.toString(), detail: 'Active sites', icon: Factory },
      { label: 'High Priority Points', value: highPriorityPoints.toString(), detail: 'Urgent service needs', icon: CircleAlert },
      { label: 'Average Bin Fill Level', value: `${avgFillLevel}%`, detail: 'Across active sites', icon: Trash2 },
      { label: 'Recyclable Waste', value: `${recyclablePercentage}%`, detail: 'Recoverable material', icon: Recycle },
      { label: 'Estimated Collections Saved', value: `${estimatedSavings}%`, detail: 'From optimized routing', icon: Leaf },
    ]
  }, [points])

  // Generate priority rows from current collection points, sorted by priority
  const priorityRows = useMemo(() => {
    return points
      .map((point) => ({
        location: point.location,
        wasteType: point.wasteType,
        fill: `${point.fillLevel}%`,
        priority: point.urgency,
        status: point.status,
        action: point.status === 'Urgent' ? 'Collect Now' : point.status === 'Scheduled' ? 'Schedule' : 'Monitor',
      }))
      .sort((a, b) => {
        const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }
        return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
      })
      .slice(0, 4)
  }, [points])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-200">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-100">Waste Management Intelligence</p>
            <h1 className="mt-2 text-3xl font-bold">Monitor, analyze and optimize waste collection.</h1>
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-50">Prototype • Demo Data</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {kpis.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <Icon size={18} />
              </div>
              <span className="text-[10px] uppercase tracking-wide text-slate-400">Live</span>
            </div>
            <div className="mt-4 text-2xl font-bold text-slate-800">{value}</div>
            <div className="mt-1 text-sm font-medium text-slate-700">{label}</div>
            <div className="mt-1 text-xs text-slate-500">{detail}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Collection Priority" subtitle="Priority-based monitoring for the current collection cycle">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Waste Type</th>
                  <th className="pb-3 font-medium">Fill Level</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Recommended Action</th>
                </tr>
              </thead>
              <tbody>
                {priorityRows.map((row) => (
                  <tr key={row.location} className="border-b border-slate-100 last:border-none">
                    <td className="py-3 font-medium text-slate-700">{row.location}</td>
                    <td className="py-3 text-slate-600">{row.wasteType}</td>
                    <td className="py-3 text-slate-600">{row.fill}</td>
                    <td className="py-3">
                      <Badge
                        label={row.priority}
                        tone={row.priority === 'HIGH' ? 'high' : row.priority === 'MEDIUM' ? 'medium' : 'low'}
                      />
                    </td>
                    <td className="py-3 text-slate-600">{row.status}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                        {row.action}
                        <ArrowRight size={14} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Collection Status" subtitle="Current collection readiness">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistributionDemo} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={2}>
                  {statusDistributionDemo.map((entry, index) => (
                    <Cell key={entry.name} fill={['#ef4444', '#f59e0b', '#10b981'][index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {statusDistributionDemo.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: ['#ef4444', '#f59e0b', '#10b981'][idx] }}
                  />
                  {item.name}
                </div>
                <span className="font-medium text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Recent Activity" subtitle="Live operational updates from the current route cycle">
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.title} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-800">{activity.title}</div>
                    <span className="text-[11px] text-slate-500">{activity.time}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{activity.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Operational Summary" subtitle="Priority and impact snapshot">
          <div className="space-y-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-emerald-700">Route Efficiency</div>
              <div className="mt-2 text-3xl font-bold text-slate-800">92%</div>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Completed pickups</span>
                <span className="font-semibold text-slate-800">84/96</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fuel saved</span>
                <span className="font-semibold text-slate-800">14.8 L</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Collection alerts</span>
                <span className="font-semibold text-slate-800">3 active</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Waste Category Distribution" subtitle="Prototype material mix in active sites">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistributionDemo}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {categoryDistributionDemo.map((entry: { name: string; value: number }, index: number) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Site Overview" subtitle="Operational snapshot for current route planning">
          <div className="space-y-4">
            {points.slice(0, 4).map((point) => (
              <div key={point.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-800">{point.location}</div>
                  <Badge label={point.urgency} tone={point.urgency === 'HIGH' ? 'high' : point.urgency === 'MEDIUM' ? 'medium' : 'low'} />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>{point.wasteType}</span>
                  <span>Fill: {point.fillLevel}%</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${point.fillLevel}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
