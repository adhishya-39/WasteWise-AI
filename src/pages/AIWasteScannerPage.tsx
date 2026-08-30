import { useRef, useState } from 'react'
import { ImagePlus, Loader2, RefreshCcw, UploadCloud, X } from 'lucide-react'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { analyzeWasteDemo } from '../services/aiWasteClassification'
import type { WasteClassification, WasteType } from '../types'

const demoOptions: WasteType[] = ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'E-Waste', 'Hazardous', 'General Waste', 'Recyclable']

function inferCategoryFromFileName(fileName: string): WasteType {
  const lower = fileName.toLowerCase()

  if (/(bottle|plastic|packaging|container|cup)/.test(lower)) return 'Plastic'
  if (/(paper|newspaper|card|box|sheet|document)/.test(lower)) return 'Paper'
  if (/(glass|jar|bottle|drink|wine)/.test(lower)) return 'Glass'
  if (/(metal|can|aluminium|steel|scrap)/.test(lower)) return 'Metal'
  if (/(food|organic|fruit|vegetable|compost|scrap)/.test(lower)) return 'Organic'
  if (/(chip|board|circuit|charger|electronic|device|keyboard|mouse|phone)/.test(lower)) return 'E-Waste'
  if (/(battery|chemical|acid|hazard|medical|toxic|oil)/.test(lower)) return 'Hazardous'
  if (/(recycle|recyclable|sorted|clean)/.test(lower)) return 'Recyclable'

  return 'General Waste'
}

export function AIWasteScannerPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<WasteClassification | null>(null)
  const [error, setError] = useState('')

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setError('')
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFileChange = (file: File | null) => {
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.type) && !/\.(jpe?g|png)$/i.test(file.name)) {
      setError('Unsupported file type. Please upload a JPG, JPEG, or PNG image.')
      setResult(null)
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError('')
    setResult(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please upload an image before analyzing.')
      return
    }

    setIsAnalyzing(true)
    setError('')

    const fileName = selectedFile.name || 'demo-sample.jpg'
    const chosenCategory = inferCategoryFromFileName(fileName)

    try {
      const prediction = await analyzeWasteDemo(chosenCategory, fileName)
      setResult(prediction)
    } catch {
      setError('The demo AI system could not process the image. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDemoClick = async (category: WasteType) => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError('')
    setIsAnalyzing(true)

    try {
      const prediction = await analyzeWasteDemo(category, `${category.toLowerCase()}-demo.jpg`)
      setResult(prediction)
    } catch {
      setError('The demo AI system could not process the selected sample.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">AI Waste Scanner</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">AI Waste Scanner</h1>
          <p className="mt-1 text-slate-600">Upload a waste image to identify its category and disposal recommendation.</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">Prototype AI • Demo Model</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card title="Image Upload" subtitle="Supported JPG, JPEG, PNG files">
          <div
            className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const file = event.dataTransfer.files?.[0] ?? null
              handleFileChange(file)
            }}
          >
            {previewUrl ? (
              <div className="w-full">
                <img src={previewUrl} alt="Uploaded waste preview" className="mx-auto h-56 w-full rounded-xl object-cover shadow-sm" />
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 text-left shadow-sm">
                  <div>
                    <div className="text-sm font-medium text-slate-700">{selectedFile?.name || 'Uploaded file'}</div>
                    <div className="text-xs text-slate-500">Ready for analysis</div>
                  </div>
                  <button type="button" onClick={clearSelection} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 rounded-2xl bg-white p-4 text-emerald-600 shadow-sm">
                  <UploadCloud size={28} />
                </div>
                <p className="text-lg font-semibold text-slate-700">Drag and drop or browse a waste image</p>
                <p className="mt-2 max-w-md text-sm text-slate-500">Choose a clear image of a waste item for category analysis and disposal advice.</p>
              </>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:bg-emerald-700">
                <ImagePlus size={16} />
                Browse Image
              </button>
              {selectedFile && (
                <button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="inline-flex items-center gap-2 rounded-xl border border-emerald-600 bg-white px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60">
                  {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
                  {isAnalyzing ? 'Analyzing waste...' : 'Analyze Waste'}
                </button>
              )}
              {selectedFile && (
                <button type="button" onClick={clearSelection} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Scan Another Image
                </button>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              hidden
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
          </div>

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        </Card>

        <Card title="Demo AI Actions" subtitle="Try the prototype without uploading an image">
          <div className="space-y-3">
            {demoOptions.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleDemoClick(category)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <span className="font-medium text-slate-700">Try Demo: {category}</span>
                <Badge label="Demo" tone="success" />
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Supported categories</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
              {demoOptions.map((label) => (
                <span key={label} className="rounded-full bg-white px-2.5 py-1 shadow-sm">{label}</span>
              ))}
            </div>
          </div>

          {isAnalyzing && (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <div className="flex items-center gap-3 text-emerald-700">
                <Loader2 className="animate-spin" size={18} />
                <div>
                  <div className="font-semibold">Analyzing waste...</div>
                  <div className="text-sm text-emerald-600">Processing image... Generating classification...</div>
                </div>
              </div>
            </div>
          )}

          {!isAnalyzing && result && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700">Classification</div>
                  <div className="mt-2 text-2xl font-bold text-slate-800">{result.category}</div>
                </div>
                <Badge label="Prototype AI / Demo Model" tone="success" />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Confidence</div>
                  <div className="mt-2 text-xl font-bold text-emerald-700">{result.confidence}%</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">Recyclable</div>
                  <div className="mt-2 text-xl font-bold text-slate-800">{result.recyclability === 'High' || result.recyclability === 'Medium' ? 'Yes' : 'No'}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Confidence</span>
                  <span>{result.confidence}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${result.confidence}%` }} />
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-3">
                <div className="text-sm font-semibold text-slate-700">Recommended Disposal Method</div>
                <p className="mt-1 text-sm text-slate-600">{result.recommendation}</p>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div>
                  <span className="font-semibold text-slate-700">Waste type:</span> {result.category}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Disposal guidance:</span> {result.disposalGuidance}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Environmental advice:</span> {result.environmentalTip}
                </div>
              </div>

              <button
                type="button"
                onClick={clearSelection}
                className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 hover:bg-emerald-700"
              >
                Scan Another Image
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
