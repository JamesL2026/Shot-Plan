import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'

const Home = lazy(() =>
  import('./pages/Home').then((module) => ({ default: module.Home })),
)
const CheckIn = lazy(() =>
  import('./pages/CheckIn').then((module) => ({ default: module.CheckIn })),
)
const Results = lazy(() =>
  import('./pages/Results').then((module) => ({ default: module.Results })),
)
const DrillDetail = lazy(() =>
  import('./pages/DrillDetail').then((module) => ({
    default: module.DrillDetail,
  })),
)
const RecentSessions = lazy(() =>
  import('./pages/RecentSessions').then((module) => ({
    default: module.RecentSessions,
  })),
)
const Library = lazy(() =>
  import('./pages/Library').then((module) => ({ default: module.Library })),
)

function PageFallback() {
  return <div className="page-fallback" aria-hidden="true" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<PageFallback />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="check-in"
            element={
              <Suspense fallback={<PageFallback />}>
                <CheckIn />
              </Suspense>
            }
          />
          <Route
            path="results"
            element={
              <Suspense fallback={<PageFallback />}>
                <Results />
              </Suspense>
            }
          />
          <Route
            path="drills/:drillId"
            element={
              <Suspense fallback={<PageFallback />}>
                <DrillDetail />
              </Suspense>
            }
          />
          <Route
            path="sessions"
            element={
              <Suspense fallback={<PageFallback />}>
                <RecentSessions />
              </Suspense>
            }
          />
          <Route
            path="library"
            element={
              <Suspense fallback={<PageFallback />}>
                <Library />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
