import { wasteCategoryMeta } from '../data/wasteData'
import type { WasteClassification, WasteType } from '../types'

const demoClassificationMap: Record<WasteType, WasteClassification> = {
  Plastic: {
    category: 'Plastic',
    confidence: 94,
    recyclability: 'High',
    recommendation: 'Place this item in the plastic recycling collection stream.',
    environmentalTip: 'Rinse and dry plastic containers before disposal to preserve recycling quality.',
    disposalGuidance: 'Separate plastic bottles, lids and packaging into the designated recyclable stream.',
  },
  Paper: {
    category: 'Paper',
    confidence: 96,
    recyclability: 'High',
    recommendation: 'Send this material to the paper recovery and recycling stream.',
    environmentalTip: 'Keep paper dry and free from food residue to improve recycling efficiency.',
    disposalGuidance: 'Place clean office paper, prints and cartons in the paper recycling bin.',
  },
  Cardboard: {
    category: 'Cardboard',
    confidence: 91,
    recyclability: 'High',
    recommendation: 'Flatten cardboard and place it in the cardboard collection point.',
    environmentalTip: 'Flatten boxes to reduce volume and make collection more efficient.',
    disposalGuidance: 'Separate packaging cartons from mixed waste and stack them neatly.',
  },
  Glass: {
    category: 'Glass',
    confidence: 90,
    recyclability: 'High',
    recommendation: 'Transfer this material to the glass recycling collection container.',
    environmentalTip: 'Avoid mixing broken glass with other waste streams to reduce handling risks.',
    disposalGuidance: 'Place bottles and jars into dedicated glass bins or safe recovery containers.',
  },
  Metal: {
    category: 'Metal',
    confidence: 89,
    recyclability: 'High',
    recommendation: 'Deposit metal waste in the scrap or metal recovery collection stream.',
    environmentalTip: 'Separate cans and scrap from mixed waste to improve material recovery value.',
    disposalGuidance: 'Use a metal recovery bin or a designated recyclable collection point.',
  },
  Organic: {
    category: 'Organic',
    confidence: 93,
    recyclability: 'Low',
    recommendation: 'Move this waste to the composting or organic processing channel.',
    environmentalTip: 'Composting food waste helps reduce methane emissions and creates soil nutrients.',
    disposalGuidance: 'Place fruit peels, food scraps and garden waste into the compost collection stream.',
  },
  'E-Waste': {
    category: 'E-Waste',
    confidence: 90,
    recyclability: 'Medium',
    recommendation: 'Send this item to a certified e-waste processing and recovery center.',
    environmentalTip: 'Proper handling prevents toxic substances from entering landfill and helps recover valuable metals.',
    disposalGuidance: 'Separate chargers, cables and old electronics and hand them to an authorised e-waste collection point.',
  },
  Hazardous: {
    category: 'Hazardous',
    confidence: 88,
    recyclability: 'Low',
    recommendation: 'Place in a sealed hazardous-waste container and route to trained handlers.',
    environmentalTip: 'Hazardous waste requires controlled storage to avoid fire, contamination and health impacts.',
    disposalGuidance: 'Use safety-rated containers for batteries, chemicals or sharps and notify trained site personnel.',
  },
  'General Waste': {
    category: 'General Waste',
    confidence: 82,
    recyclability: 'Low',
    recommendation: 'Dispose this in the general waste stream and review contamination issues.',
    environmentalTip: 'Reduce contamination by separating reusable and recyclable material before disposal.',
    disposalGuidance: 'Place mixed, non-separable items in the general waste container only after sorting.',
  },
  Recyclable: {
    category: 'Recyclable',
    confidence: 92,
    recyclability: 'High',
    recommendation: 'Route this material to the nearest recyclable collection bin.',
    environmentalTip: 'Clean, dry and sort recyclable material to increase collection efficiency and recovery value.',
    disposalGuidance: 'Deposit sorted clean recyclable items into the appropriate recycling stream.',
  },
}

export async function analyzeWasteDemo(
  selectedCategory?: WasteType,
  fileName?: string,
): Promise<WasteClassification> {
  const category = selectedCategory ?? 'Plastic'
  const base = demoClassificationMap[category]
  const fileBonus = fileName ? Math.min(7, fileName.length % 6) : 0

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...base,
        confidence: Math.min(99, base.confidence + fileBonus),
        recommendation: wasteCategoryMeta[base.category].recommendation,
      })
    }, 1800)
  })
}
