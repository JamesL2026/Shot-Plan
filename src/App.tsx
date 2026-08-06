import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CheckIn } from './pages/CheckIn'
import { DrillDetail } from './pages/DrillDetail'
import { Home } from './pages/Home'
import { Library } from './pages/Library'
import { RecentSessions } from './pages/RecentSessions'
import { Results } from './pages/Results'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="check-in" element={<CheckIn />} />
          <Route path="results" element={<Results />} />
          <Route path="drills/:drillId" element={<DrillDetail />} />
          <Route path="sessions" element={<RecentSessions />} />
          <Route path="library" element={<Library />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
