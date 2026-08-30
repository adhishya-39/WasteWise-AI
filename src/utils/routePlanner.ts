import type {
  CollectionPoint,
  CollectionPriorityInsight,
  PriorityBand,
  PriorityLevel,
  RouteRecommendation,
  WasteType,
} from '../types'

const urgencyMap: Record<PriorityLevel, number> = {
  HIGH: 100,
  MEDIUM: 60,
  LOW: 30,
}

const wasteImpactMap: Record<WasteType, number> = {
  Plastic: 80,
  Paper: 70,
  Cardboard: 65,
  Glass: 72,
  Metal: 75,
  Organic: 78,
  'E-Waste': 88,
  Hazardous: 95,
  'General Waste': 58,
  Recyclable: 84,
}

function getDaysSinceCollection(lastCollection: string) {
  const today = new Date()
  const last = new Date(lastCollection)
  const diffMs = today.getTime() - last.getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

function getLocationPriorityScore(location: string) {
  const lower = location.toLowerCase()
  if (/(campus|hostel|library|school|lab|administrative|institution|clinic|hospital)/.test(lower)) {
    return 92
  }
  if (/(food court|market|complex|gate|residential|station)/.test(lower)) {
    return 78
  }
  return 58
}

export function calculatePriorityDetails(point: CollectionPoint): CollectionPriorityInsight {
  const daysSinceCollection = getDaysSinceCollection(point.lastCollection)
  const fillScore = point.fillLevel
  const wasteScore = wasteImpactMap[point.wasteType] ?? 50
  const ageScore = Math.min(daysSinceCollection * 9, 100)
  const locationScore = getLocationPriorityScore(point.location)
  const urgencyScore = urgencyMap[point.urgency]

  const score = Math.round(
    0.32 * fillScore + 0.18 * wasteScore + 0.2 * ageScore + 0.14 * locationScore + 0.16 * urgencyScore,
  )

  let level: PriorityBand = 'Low'
  if (score >= 85) level = 'Critical'
  else if (score >= 70) level = 'High'
  else if (score >= 50) level = 'Medium'

  const reasons: string[] = []
  if (point.fillLevel >= 80) reasons.push('high bin fill')
  if (point.wasteType === 'Hazardous' || point.wasteType === 'E-Waste') reasons.push('sensitive waste stream')
  if (daysSinceCollection >= 4) reasons.push(`${daysSinceCollection} days since last collection`)
  if (locationScore >= 80) reasons.push('high-traffic institutional location')
  if (point.urgency === 'HIGH') reasons.push('urgency already flagged by operator')

  return {
    score,
    level,
    reason: reasons.length > 0 ? reasons.join('; ') : 'routine monitoring only',
  }
}

export function calculatePriorityScore(point: CollectionPoint) {
  return calculatePriorityDetails(point).score
}

export function computeRouteRecommendations(points: CollectionPoint[]): RouteRecommendation[] {
  return points
    .map((point) => {
      const summary = calculatePriorityDetails(point)
      const distanceKm = Math.max(1.4, Number(((point.distanceFactor / 10) + (point.fillLevel / 22)).toFixed(1)))
      const minutes = Math.max(12, Math.round((distanceKm * 6.5) + (point.fillLevel * 0.35)))
      const fuelSavingsKg = Number((Math.max(1.2, (summary.score / 100) * 4.8)).toFixed(1))

      return {
        ...point,
        priorityScore: summary.score,
        estimatedDistanceKm: distanceKm,
        estimatedMinutes: minutes,
        fuelSavingsKg,
        reason: summary.reason,
      }
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
}
