import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { BookmarksProvider } from './context/BookmarksContext'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { SkeletonCards } from './components/ui/SkeletonCards'

// Lazy load all pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const PointsSystemPage = lazy(() => import('./pages/PointsSystemPage'))
const DriversPage = lazy(() => import('./pages/DriversPage'))
const DriverProfilePage = lazy(() => import('./pages/DriverProfilePage'))
const TeamsPage = lazy(() => import('./pages/TeamsPage'))
const TeamProfilePage = lazy(() => import('./pages/TeamProfilePage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const CircuitsPage = lazy(() => import('./pages/CircuitsPage'))
const CircuitDetailPage = lazy(() => import('./pages/CircuitDetailPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const StandingsPage = lazy(() => import('./pages/StandingsPage'))
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'))
const RulesPage = lazy(() => import('./pages/RulesPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const RecordsPage = lazy(() => import('./pages/RecordsPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))
const PredictorPage = lazy(() => import('./pages/PredictorPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const DriverComparePage = lazy(() => import('./pages/DriverComparePage'))
const ChampionshipTrackerPage = lazy(() => import('./pages/ChampionshipTrackerPage'))
const TeamQuizPage = lazy(() => import('./pages/TeamQuizPage'))
const TyreStrategyPage = lazy(() => import('./pages/TyreStrategyPage'))
const HeadToHeadPage = lazy(() => import('./pages/HeadToHeadPage'))
const SeasonPreviewPage = lazy(() => import('./pages/SeasonPreviewPage'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage'))

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={
      <div className="card" style={{ textAlign: 'center', padding: 40, borderLeft: '3px solid #e10600' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
        <div style={{ fontFamily: 'Orbitron', fontSize: 11, color: '#e10600', letterSpacing: 2 }}>SECTION FAILED TO LOAD</div>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8 }}>Please refresh the page to try again.</p>
      </div>
    }>
      <div className="section-enter">
        {children}
      </div>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BookmarksProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><HomePage /></PageWrapper></Suspense>} />
            <Route path="/how-it-works" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><HowItWorksPage /></PageWrapper></Suspense>} />
            <Route path="/points-system" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><PointsSystemPage /></PageWrapper></Suspense>} />
            <Route path="/drivers" element={<Suspense fallback={<SkeletonCards count={6} />}><PageWrapper><DriversPage /></PageWrapper></Suspense>} />
            <Route path="/drivers/:driverId" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><DriverProfilePage /></PageWrapper></Suspense>} />
            <Route path="/teams" element={<Suspense fallback={<SkeletonCards count={6} />}><PageWrapper><TeamsPage /></PageWrapper></Suspense>} />
            <Route path="/teams/:teamId" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><TeamProfilePage /></PageWrapper></Suspense>} />
            <Route path="/history" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><HistoryPage /></PageWrapper></Suspense>} />
            <Route path="/circuits" element={<Suspense fallback={<SkeletonCards count={6} />}><PageWrapper><CircuitsPage /></PageWrapper></Suspense>} />
            <Route path="/circuits/:circuitId" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><CircuitDetailPage /></PageWrapper></Suspense>} />
            <Route path="/results" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><ResultsPage /></PageWrapper></Suspense>} />
            <Route path="/standings" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><StandingsPage /></PageWrapper></Suspense>} />
            <Route path="/glossary" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><GlossaryPage /></PageWrapper></Suspense>} />
            <Route path="/rules" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><RulesPage /></PageWrapper></Suspense>} />
            <Route path="/compare" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><ComparePage /></PageWrapper></Suspense>} />
            <Route path="/records" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><RecordsPage /></PageWrapper></Suspense>} />
            <Route path="/quiz" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><QuizPage /></PageWrapper></Suspense>} />
            <Route path="/predictor" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><PredictorPage /></PageWrapper></Suspense>} />
            <Route path="/news" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><NewsPage /></PageWrapper></Suspense>} />
            <Route path="/driver-compare" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><DriverComparePage /></PageWrapper></Suspense>} />
            <Route path="/championship-tracker" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><ChampionshipTrackerPage /></PageWrapper></Suspense>} />
            <Route path="/team-quiz" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><TeamQuizPage /></PageWrapper></Suspense>} />
            <Route path="/tyre-strategy" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><TyreStrategyPage /></PageWrapper></Suspense>} />
            <Route path="/head-to-head" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><HeadToHeadPage /></PageWrapper></Suspense>} />
            <Route path="/season-preview" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><SeasonPreviewPage /></PageWrapper></Suspense>} />
            <Route path="/bookmarks" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><BookmarksPage /></PageWrapper></Suspense>} />
            {/* Legacy route redirects for backward compatibility */}
            <Route path="/how" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><HowItWorksPage /></PageWrapper></Suspense>} />
            <Route path="/points" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><PointsSystemPage /></PageWrapper></Suspense>} />
            <Route path="/drivercompare" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><DriverComparePage /></PageWrapper></Suspense>} />
            <Route path="/championship" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><ChampionshipTrackerPage /></PageWrapper></Suspense>} />
            <Route path="/teamquiz" element={<Suspense fallback={<SkeletonCards count={1} />}><PageWrapper><TeamQuizPage /></PageWrapper></Suspense>} />
            <Route path="/tyrestrategy" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><TyreStrategyPage /></PageWrapper></Suspense>} />
            <Route path="/h2h" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><HeadToHeadPage /></PageWrapper></Suspense>} />
            <Route path="/preview" element={<Suspense fallback={<SkeletonCards count={4} />}><PageWrapper><SeasonPreviewPage /></PageWrapper></Suspense>} />
          </Route>
        </Routes>
      </BookmarksProvider>
    </ThemeProvider>
  )
}

export default App
