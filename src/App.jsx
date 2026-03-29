import { NarrativeProvider, useNarrative } from './context/NarrativeContext.jsx'
import LandingPage from './components/LandingPage.jsx'
import TrackIntro from './components/TrackIntro.jsx'
import ScenarioContainer from './components/ScenarioContainer.jsx'
import TransitionScreen from './components/TransitionScreen.jsx'
import OutcomeScreen from './components/OutcomeScreen.jsx'
import ReflectionScreen from './components/ReflectionScreen.jsx'
import ProgressIndicator from './components/ProgressIndicator.jsx'
import { getOutcomeNarrative } from './lib/narrative.js'
import './App.css'

function AppRoutes() {
  const { phase, navigateTo, decisions, feedbackTags, reset, goBack, canGoBack } = useNarrative()

  const showProgress = phase !== 'landing'

  return (
    <div className="app-shell">
      {showProgress ? <ProgressIndicator phase={phase} /> : null}
      <main className="app-main">
        {phase === 'landing' && (
          <LandingPage
            onSelectTrack={(id) => {
              if (id === 'conflict') navigateTo('track_intro')
            }}
          />
        )}
        {phase === 'track_intro' && (
          <TrackIntro onBegin={() => navigateTo('scenario1')} onBack={goBack} canGoBack={canGoBack} />
        )}
        {phase === 'scenario1' && <ScenarioContainer scenario={1} />}
        {phase === 'transition' && (
          <TransitionScreen
            title="A few days later…"
            subtitle="The deadline is getting close. The group thread wakes up again."
            onContinue={() => navigateTo('scenario2')}
            onBack={goBack}
            canGoBack={canGoBack}
          />
        )}
        {phase === 'scenario2' && <ScenarioContainer scenario={2} />}
        {phase === 'outcome' && (
          <OutcomeScreen
            {...getOutcomeNarrative(decisions)}
            feedbackTags={feedbackTags}
            onReflect={() => navigateTo('reflection')}
            onBack={goBack}
            canGoBack={canGoBack}
          />
        )}
        {phase === 'reflection' && (
          <ReflectionScreen onRestart={reset} onBack={goBack} canGoBack={canGoBack} />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <NarrativeProvider>
      <AppRoutes />
    </NarrativeProvider>
  )
}
