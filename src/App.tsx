import { useState } from 'react'
import './App.css'
import { AppHeader } from './components/AppHeader'
import { CheckPanel } from './components/CheckPanel'
import { DraftEditor } from './components/DraftEditor'
import { OutputPanel } from './components/OutputPanel'
import { useConvertedDraft } from './hooks/useConvertedDraft'

function App() {
  const [draft, setDraft] = useState('')
  const { lines, outputLines, html } = useConvertedDraft(draft)

  return (
    <>
      <AppHeader />
      <main className="app-main">
        <DraftEditor value={draft} lines={lines} onChange={setDraft} />
        <OutputPanel lines={outputLines} html={html} />
        <CheckPanel />
      </main>
    </>
  )
}

export default App
