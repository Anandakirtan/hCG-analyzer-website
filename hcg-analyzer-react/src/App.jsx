import { useState } from 'react'
import ConceptionCalculator from './components/ConceptionCalculator'
import HCGAnalysis from './components/HCGAnalysis'
import './App.css'

const parseDate = (value) => value ? new Date(`${value}T00:00:00Z`) : null

const addDays = (value, days) => {
  const date = parseDate(value)
  if (!date) return ''
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function App() {
  const [lastMenstrDate, setLastMenstrDate] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [conceptionDate, setConceptionDate] = useState('')

  const numericCycleLength = Number(cycleLength)
  const canEstimateConception = Boolean(lastMenstrDate)
    && Number.isFinite(numericCycleLength)
    && numericCycleLength >= 15
    && numericCycleLength <= 60

  const handleCalculate = () => {
    if (!canEstimateConception) return
    setConceptionDate(addDays(lastMenstrDate, numericCycleLength - 14))
  }

  const gestationalStartDate = lastMenstrDate || addDays(conceptionDate, -14)

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Динамика β-ХГЧ</p>
          <h1>Анализ результатов ХГЧ</h1>
          <p className="hero-copy">
            Сравните несколько результатов, оцените изменение во времени и
            посмотрите широкий справочный диапазон для акушерского срока.
          </p>
        </div>
        <div className="medical-note" role="note">
          <strong>Важно</strong>
          <span>
            Калькулятор не подтверждает жизнеспособность или расположение
            беременности и не заменяет врача, повторный анализ или УЗИ.
          </span>
        </div>
      </header>

      <ConceptionCalculator
        lastMenstrDate={lastMenstrDate}
        onLastMenstrDateChange={setLastMenstrDate}
        cycleLength={cycleLength}
        onCycleLengthChange={setCycleLength}
        conceptionDate={conceptionDate}
        onConceptionDateChange={setConceptionDate}
        onCalculate={handleCalculate}
        canCalculate={canEstimateConception}
      />

      <HCGAnalysis gestationalStartDate={gestationalStartDate} />
    </main>
  )
}

export default App
