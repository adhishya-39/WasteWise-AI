import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card } from '../components/Card'
import { categoryDistributionDemo, collectionEfficiencyData, collectionTrendData, fillLevelData, prioritySummaryData, recyclabilityData } from '../data/wasteData'

const pieColors = ['#10b981', '#14b8a6', '#2dd4bf', '#f59e0b', '#0ea5e9', '#22c55e', '#64748b']

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Analytics</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800">Waste Analytics Dashboard</h1>
        <p className="mt-1 text-slate-600">Prototype demo data for live demonstration and operational monitoring.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Waste Collected', value: '1,240 kg', note: 'Guided by demo trend data' },
          { label: 'Average Fill Level', value: '72%', note: 'Across active collection points' },
          { label: 'High Priority Sites', value: '6', note: 'Priority collection needs' },
          { label: 'Recycling Recovery', value: '68%', note: 'Estimated recyclable share' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="mt-2 text-2xl font-bold text-slate-800">{item.value}</div>
            <div className="mt-1 text-xs text-slate-500">{item.note}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-emerald-700">Trips Saved</div>
          <div className="mt-2 text-2xl font-bold text-slate-800">18%</div>
          <div className="mt-1 text-sm text-slate-600">Compared with static route schedules</div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-emerald-700">Emissions Reduction</div>
          <div className="mt-2 text-2xl font-bold text-slate-800">24%</div>
          <div className="mt-1 text-sm text-slate-600">Lower fuel use from route optimization</div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="text-xs uppercase tracking-[0.16em] text-emerald-700">Material Recovery</div>
          <div className="mt-2 text-2xl font-bold text-slate-800">68%</div>
          <div className="mt-1 text-sm text-slate-600">Recovered recyclable waste share</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Waste Category Distribution" subtitle="Current waste mix by material type">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistributionDemo}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {categoryDistributionDemo.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Collection Trend" subtitle="Weekly collection volume across the demo period">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="collections" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Average Bin Fill Level" subtitle="Bins approaching collection thresholds">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fillLevelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="value" fill="#14b8a6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="High Priority Collection Points" subtitle="Service groups requiring attention">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={prioritySummaryData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={92} paddingAngle={2}>
                  {prioritySummaryData.map((entry, index) => (
                    <Cell key={entry.name} fill={['#ef4444', '#f59e0b', '#10b981'][index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recyclable vs Non-Recyclable Waste" subtitle="Share of recoverable versus mixed waste">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={recyclabilityData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={88} paddingAngle={3}>
                  {recyclabilityData.map((entry, index) => (
                    <Cell key={entry.name} fill={['#10b981', '#64748b'][index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Collection Efficiency" subtitle="Operational performance across route and service metrics">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="value" fill="#2dd4bf" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
