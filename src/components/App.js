// App.js
import React, { useEffect, useState } from 'react'
import Main from './Main'
import history from '../history'

const App = () => {
  const [historyUpdate, setHistoryUpdate] = useState(0)

  useEffect(() => {
    // force an update if the URL changes
    const unlisten = history.listen(() => {
      setHistoryUpdate((prev) => prev + 1)
    })

    // Clean up the listener when the component unmounts
    return () => unlisten()
  }, [])

  return <Main key={historyUpdate} />
}

export default App
