import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, CheckCircle, Loader2, MapPinned, Route, TrendingUp } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { demoCollectionPoints } from '../data/wasteData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { CollectionPoint, RouteRecommendation } from '../types'
import { computeRouteRecommendations } from '../utils/routePlanner'

// Helper to check if route order changed (compare point IDs in sequence)
function routeHasChanged(oldRoute: RouteRecommendation[], newRoute: RouteRecommendation[]): boolean {
  if (oldRoute.length !== newRoute.length) return true
  return oldRoute.some((point, index) => point.id !== newRoute[index].id)
}

export function RoutePlannerPage() {
  const [points] = useLocalStorage<CollectionPoint[]>('wastewise-collection-points', demoCollectionPoints)
  const [recommendations, setRecommendations] = useState(() => computeRouteRecommendations(points))
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const routeSummary = useMemo(
    () => recommendations.map((point, index) => ({ ...point, index: index + 1 })),
    [recommendations],
  )

  // Watch points from localStorage and update recommendations when they change
  useEffect(() => {
    setRecommendations(computeRouteRecommendations(points))
  }, [points])

  // Auto-dismiss success message after 2.5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const recalculate = async () => {
    setIsRecalculating(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const newRecommendations = computeRouteRecommendations(points)
    const routeChanged = routeHasChanged(recommendations, newRecommendations)
    
    setRecommendations(newRecommendations)
    setIsRecalculating(false)
    
    if (routeChanged) {
      setSuccessMessage('Route updated successfully')
    } else {
      setSuccessMessage('Route recalculated — current route remains optimal')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Smart Route Planner</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">Smart Route Planner</h1>
          <p className="mt-1 text-slate-600">Prioritize collection points based on urgency, fill level and service need.</p>
        </div>
        <div className="flex flex-col gap-2">
          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle size={16} className="flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          <button
            type="button"
            onClick={recalculate}
            disabled={isRecalculating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRecalculating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Recalculating...</span>
              </>
            ) : (
              <span>Recalculate Route</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Recommended Collection Order" subtitle="Prototype Route Optimization">
          <div className="space-y-4">
            {routeSummary.map((point) => (
              <div key={point.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white">{point.index}</div>
                    <div>
                      <div className="font-semibold text-slate-800">{point.location}</div>
                      <div className="text-sm text-slate-500">{point.wasteType}</div>
                    </div>
                  </div>
                  <Badge label={point.urgency} tone={point.urgency === 'HIGH' ? 'high' : point.urgency === 'MEDIUM' ? 'medium' : 'low'} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Priority Score</div>
                    <div className="mt-1 font-bold text-slate-800">{point.priorityScore}</div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Distance</div>
                    <div className="mt-1 font-bold text-slate-800">{point.estimatedDistanceKm} km</div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Estimated Time</div>
                    <div className="mt-1 font-bold text-slate-800">{point.estimatedMinutes} min</div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Fuel Savings</div>
                    <div className="mt-1 font-bold text-slate-800">{point.fuelSavingsKg} kg</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-1 text-sm text-slate-600">
                  <div className="flex items-center gap-2 font-medium text-emerald-700">
                    <Route size={14} />
                    Recommended action: {point.status === 'Urgent' ? 'Collect Now' : point.status === 'Scheduled' ? 'Schedule' : 'Monitor'}
                  </div>
                  <div className="text-slate-600">Reason: {point.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Route Logic" subtitle="Prototype scoring formula">
          <div className="space-y-4">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <TrendingUp size={18} />
                <span className="font-semibold">Priority Score = 40% Fill Level + 30% Urgency + 20% Distance Factor + 10% Service Need</span>
              </div>
            </div>

            <div className="space-y-3">
              {routeSummary.map((point) => (
                <div key={`${point.id}-timeline`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">{point.index}</div>
                    {point.index !== routeSummary.length && <div className="mt-2 h-12 w-px bg-slate-200" />}
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-200 bg-white p-3">
                    <div className="font-medium text-slate-800">{point.location}</div>
                    <div className="mt-1 flex items-center justify-between text-sm text-slate-500">
                      <span>{point.wasteType}</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700"><ArrowRight size={14} /> {point.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPinned size={17} />
                <span className="font-semibold">Prototype route optimization only</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">This version uses demo-service scoring and route sorting. GPS-based navigation is not connected in this prototype.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
