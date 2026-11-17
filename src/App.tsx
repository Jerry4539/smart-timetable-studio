import React, { useEffect } from 'react'
import { Shell } from './components/layout/Shell'
import { useValidationStore } from './store/useValidationStore'

export function App() {
  const { validateTimetable } = useValidationStore()

  useEffect(() => {
    // Initial validation check on load
    validateTimetable()
  }, [validateTimetable])

  return <Shell />
}

export default App
