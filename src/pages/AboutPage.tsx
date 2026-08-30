export function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white shadow-lg shadow-emerald-200">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-100">Project</div>
        <h1 className="mt-2 text-3xl font-bold">WasteWise AI</h1>
        <p className="mt-2 max-w-3xl text-emerald-50">AI-Powered Smart Waste Segregation & Collection Optimization Platform</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Problem</h2>
          <p className="mt-3 text-slate-600">
            Waste collection systems often depend on manual identification, fixed collection schedules and limited visibility into waste levels. This can lead to unnecessary trips, overflowing collection points and inefficient resource usage.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Solution</h2>
          <p className="mt-3 text-slate-600">
            WasteWise AI combines AI-assisted waste classification with collection-point monitoring, priority scoring and route recommendations in one web platform.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">How AI is Used</h2>
          <p className="mt-3 text-slate-600">
            The platform uses a prototype AI layer to classify waste categories from uploaded images, estimate recyclability, and recommend appropriate disposal or sorting methods. It is designed as a decision-support tool for demo and planning use, not a connected production model.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Expected Impact</h2>
          <p className="mt-3 text-slate-600">
            The system helps optimize collection operations, lower avoidable collection trips, improve resource recovery, and support cleaner urban and campus environments through smarter waste segregation.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Target Users</h2>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>• Municipal waste-management teams</li>
            <li>• Educational institutions</li>
            <li>• Apartments</li>
            <li>• Offices</li>
            <li>• Hospitals</li>
            <li>• Organizations managing multiple waste collection points</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">Technology</h2>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>• React</li>
            <li>• TypeScript</li>
            <li>• Tailwind CSS</li>
            <li>• Recharts</li>
            <li>• AI-assisted image classification</li>
            <li>• Predictive analytics</li>
            <li>• LocalStorage prototype data</li>
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Future Scope</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-slate-600">
          <span>• Real IoT smart-bin sensors</span>
          <span>• Real-time fill-level monitoring</span>
          <span>• GPS-based route optimization</span>
          <span>• Real trained waste-classification model</span>
          <span>• Cloud database</span>
          <span>• Mobile application</span>
          <span>• Municipal system integration</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Team Members</h2>
        <div className="mt-4 space-y-2 text-slate-600">
          <p>Adhishya M — Team Leader</p>
          <p>Mukesh R</p>
          <p>Abinaiyaa N</p>
          <p>Anusha L</p>
          <p className="pt-3 font-medium text-slate-700">Knowledge Institute of Technology, Salem</p>
          <p className="text-slate-700">TSM-TECHNOVA 2026</p>
        </div>
      </div>
    </div>
  )
}
