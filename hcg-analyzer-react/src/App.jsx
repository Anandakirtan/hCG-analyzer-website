import React, { useState } from 'react'
import ConceptionCalculator from './components/ConceptionCalculator'
import HCGAnalysis from './components/HCGAnalysis'
import './App.css'

function App() {
  const [lastMenstrDate, setLastMenstrDate] = useState(null)
  const [cycleLength, setCycleLength] = useState('')
  const [conceptionDate, setConceptionDate] = useState(null)

  const handleCalculate = () => {
    if (!lastMenstrDate || !cycleLength) return
    const ovulationDay = parseInt(cycleLength) - 14
    if (isNaN(ovulationDay)) return
    const calculated = new Date(lastMenstrDate)
    calculated.setDate(calculated.getDate() + ovulationDay)
    setConceptionDate(calculated)
  }

  const canCalculate = lastMenstrDate && cycleLength

  return (
    <div className="container">
      <div id="wrapper">
        <ConceptionCalculator
          lastMenstrDate={lastMenstrDate}
          onLastMenstrDateChange={setLastMenstrDate}
          cycleLength={cycleLength}
          onCycleLengthChange={setCycleLength}
          conceptionDate={conceptionDate}
          onConceptionDateChange={setConceptionDate}
        />
        <div id="calculate_bar">
          <button
            className="calculate-btn"
            onClick={handleCalculate}
            disabled={!canCalculate}
            title="Рассчитать дату зачатия и обновить все анализы"
          >
            Рассчитать всё
          </button>
        </div>
        <HCGAnalysis conceptionDate={conceptionDate} />
      </div>
    </div>
  )
}

export default App
