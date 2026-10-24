import './App.css'
import { AppHeader } from './components/AppHeader'
import { CheckPanel } from './components/CheckPanel'
import { DraftEditor } from './components/DraftEditor'
import { OutputPanel } from './components/OutputPanel'
import { useConvertedDraft } from './hooks/useConvertedDraft'
import { useDraft } from './hooks/useDraft'

function App() {
  const { draft, canUndoClear, saveStatus, setDraft, clearDraft, undoClear, exportDraft } = useDraft()
  const { lines, outputLines, html } = useConvertedDraft(draft)

  return (
    <>
      <AppHeader saveStatus={saveStatus} canExport={draft !== ''} onExport={exportDraft} />
      <main className="app-main">
        <DraftEditor
          value={draft}
          lines={lines}
          canUndoClear={canUndoClear}
          onChange={setDraft}
          onClear={clearDraft}
          onUndoClear={undoClear}
        />
        <OutputPanel lines={outputLines} html={html} />
        <CheckPanel />
      </main>
    </>
  )
}

export default App
