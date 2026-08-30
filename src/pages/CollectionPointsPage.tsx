import { useMemo, useState, type FormEvent } from 'react'
import { Plus, Search, Trash2 } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { demoCollectionPoints } from '../data/wasteData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { calculatePriorityDetails } from '../utils/routePlanner'
import type { CollectionPoint, PriorityLevel, WasteType } from '../types'

const wasteTypes: Array<'All' | WasteType> = ['All', 'Plastic', 'Paper', 'Cardboard', 'Glass', 'Metal', 'Organic', 'General Waste']
const priorities: Array<'All' | PriorityLevel> = ['All', 'HIGH', 'MEDIUM', 'LOW']

const emptyPointState = {
  location: '',
  wasteType: 'Plastic' as WasteType,
  fillLevel: 50,
  urgency: 'MEDIUM' as PriorityLevel,
  distanceFactor: 60,
  serviceNeed: 70,
  lastCollection: new Date().toISOString().slice(0, 10),
  status: 'Scheduled' as 'Urgent' | 'Scheduled' | 'Monitoring',
  notes: '',
}

export function CollectionPointsPage() {
  const [points, setPoints] = useLocalStorage<CollectionPoint[]>('wastewise-collection-points', demoCollectionPoints)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'All' | PriorityLevel>('All')
  const [wasteFilter, setWasteFilter] = useState<'All' | WasteType>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(emptyPointState)

  const filteredPoints = useMemo(() => {
    return points.filter((point) => {
      const matchesSearch = point.location.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = priorityFilter === 'All' || point.urgency === priorityFilter
      const matchesWaste = wasteFilter === 'All' || point.wasteType === wasteFilter
      return matchesSearch && matchesPriority && matchesWaste
    })
  }, [points, search, priorityFilter, wasteFilter])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextPoint: CollectionPoint = {
      id: `cp-${Date.now()}`,
      location: formData.location,
      wasteType: formData.wasteType,
      fillLevel: Number(formData.fillLevel),
      urgency: formData.urgency,
      distanceFactor: Number(formData.distanceFactor),
      serviceNeed: Number(formData.serviceNeed),
      lastCollection: formData.lastCollection,
      status: formData.status,
      notes: formData.notes,
    }

    if (!nextPoint.location.trim()) return
    setPoints((current) => [nextPoint, ...current])
    setFormData(emptyPointState)
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setPoints((current) => current.filter((point) => point.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Collection Points</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">Collection Point Management</h1>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:bg-emerald-700"
        >
          <Plus size={16} />
          Add Collection Point
        </button>
      </div>

      <Card title="Collection Points" subtitle="Monitor active waste collection zones and service priorities">
        <div className="mb-4 grid gap-3 md:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search location"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as 'All' | PriorityLevel)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
          >
            {priorities.map((option) => (
              <option key={option} value={option}>{option === 'All' ? 'All Priorities' : option}</option>
            ))}
          </select>

          <select
            value={wasteFilter}
            onChange={(event) => setWasteFilter(event.target.value as 'All' | WasteType)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-400"
          >
            {wasteTypes.map((option) => (
              <option key={option} value={option}>{option === 'All' ? 'All Waste Types' : option}</option>
            ))}
          </select>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {points.slice(0, 3).map((point) => {
            const insight = calculatePriorityDetails(point)
            return (
              <div key={point.id} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-700">{point.location}</span>
                  <Badge
                    label={insight.level}
                    tone={insight.level === 'Critical' ? 'high' : insight.level === 'High' ? 'medium' : insight.level === 'Medium' ? 'warning' : 'success'}
                  />
                </div>
                <div className="mt-2 text-xs text-slate-600">Priority score: {insight.score}</div>
                <div className="mt-1 text-xs text-slate-600">Reason: {insight.reason}</div>
              </div>
            )
          })}
        </div>

        {filteredPoints.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-slate-500">
            No collection points match the current filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPoints.map((point) => {
              const insight = calculatePriorityDetails(point)
              return (
                <div key={point.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-800">{point.location}</h3>
                        <Badge label={point.urgency} tone={point.urgency === 'HIGH' ? 'high' : point.urgency === 'MEDIUM' ? 'medium' : 'low'} />
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-600">
                        <span>{point.wasteType}</span>
                        <span>•</span>
                        <span>Fill: {point.fillLevel}%</span>
                        <span>•</span>
                        <span>Last collection: {point.lastCollection}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{point.status}</span>
                      <button type="button" onClick={() => handleDelete(point.id)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl bg-white p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Priority Score</div>
                      <div className="mt-2 font-medium text-slate-700">{insight.score}</div>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Next Collection</div>
                      <div className="mt-2 font-medium text-slate-700">{point.status === 'Urgent' ? 'Today' : point.status === 'Scheduled' ? 'Tomorrow' : 'Within 3 days'}</div>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Distance Factor</div>
                      <div className="mt-2 font-medium text-slate-700">{point.distanceFactor}</div>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Service Need</div>
                      <div className="mt-2 font-medium text-slate-700">{point.serviceNeed}</div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-emerald-100 bg-white p-3 text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">Priority reason:</span> {insight.reason}
                  </div>

                  {point.notes && <div className="mt-3 text-sm text-slate-600">Notes: {point.notes}</div>}
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Add Collection Point</div>
                <h2 className="mt-1 text-2xl font-bold text-slate-800">New service location</h2>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-slate-200 p-2 text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Location</span>
                <input
                  value={formData.location}
                  onChange={(event) => handleInputChange('location', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                  placeholder="Campus Block C"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Waste Type</span>
                <select
                  value={formData.wasteType}
                  onChange={(event) => handleInputChange('wasteType', event.target.value as WasteType)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                >
                  {wasteTypes.filter((type) => type !== 'All').map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Fill Level</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.fillLevel}
                  onChange={(event) => handleInputChange('fillLevel', Number(event.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Last Collection</span>
                <input
                  type="date"
                  value={formData.lastCollection}
                  onChange={(event) => handleInputChange('lastCollection', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Priority</span>
                <select
                  value={formData.urgency}
                  onChange={(event) => handleInputChange('urgency', event.target.value as PriorityLevel)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                >
                  {priorities.filter((priority) => priority !== 'All').map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Distance Factor</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.distanceFactor}
                  onChange={(event) => handleInputChange('distanceFactor', Number(event.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Service Need</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.serviceNeed}
                  onChange={(event) => handleInputChange('serviceNeed', Number(event.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">Notes</span>
                <textarea
                  value={formData.notes}
                  onChange={(event) => handleInputChange('notes', event.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                  placeholder="Notes about the collection point"
                />
              </label>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:bg-emerald-700">
                  Save Collection Point
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
