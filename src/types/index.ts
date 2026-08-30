export type WasteType =
  | 'Plastic'
  | 'Paper'
  | 'Cardboard'
  | 'Glass'
  | 'Metal'
  | 'Organic'
  | 'E-Waste'
  | 'Hazardous'
  | 'General Waste'
  | 'Recyclable'

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW'
export type PriorityBand = 'Critical' | 'High' | 'Medium' | 'Low'
export type StatusType = 'Urgent' | 'Scheduled' | 'Monitoring'
export type Recyclability = 'High' | 'Medium' | 'Low'

export interface WasteCategoryMeta {
  label: WasteType
  recyclable: boolean
  summary: string
  recommendation: string
  color: string
  icon: string
  exampleItems: string[]
}

export interface CollectionPoint {
  id: string
  location: string
  wasteType: WasteType
  fillLevel: number
  urgency: PriorityLevel
  distanceFactor: number
  serviceNeed: number
  lastCollection: string
  status: StatusType
  notes?: string
}

export interface WasteClassification {
  category: WasteType
  confidence: number
  recyclability: Recyclability
  recommendation: string
  environmentalTip: string
  disposalGuidance: string
}

export interface CollectionPriorityInsight {
  score: number
  level: PriorityBand
  reason: string
}

export interface NavItem {
  label: string
  path: string
  icon: string
}

export interface RouteRecommendation extends CollectionPoint {
  priorityScore: number
  estimatedDistanceKm: number
  estimatedMinutes: number
  fuelSavingsKg: number
  reason: string
}
