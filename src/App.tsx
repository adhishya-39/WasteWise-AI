import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { AIWasteScannerPage } from './pages/AIWasteScannerPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { CollectionPointsPage } from './pages/CollectionPointsPage'
import { DashboardPage } from './pages/DashboardPage'
import { RoutePlannerPage } from './pages/RoutePlannerPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/scanner" element={<AIWasteScannerPage />} />
          <Route path="/collection-points" element={<CollectionPointsPage />} />
          <Route path="/routes" element={<RoutePlannerPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
