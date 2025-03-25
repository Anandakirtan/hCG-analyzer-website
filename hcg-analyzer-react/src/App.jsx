import React, { useState } from 'react'
import ConceptionCalculator from './components/ConceptionCalculator'
import HCGAnalysis from './components/HCGAnalysis'
import './App.css'

function App() {
  const [conceptionDate, setConceptionDate] = useState(null)

  return (
    <div className="container">
      <div id="wrapper">
        <ConceptionCalculator onConceptionDateChange={setConceptionDate} />
        <HCGAnalysis conceptionDate={conceptionDate} />
      </div>
    </div>
  )
}

export default App
