import { useMemo, useState } from 'react'

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 6,
})

const percentFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 1,
})

const parseNumber = (value) => {
  if (!value.trim()) return Number.NaN
  return Number(value.replaceAll(' ', '').replace(',', '.'))
}

const formatNumber = (value) => numberFormatter.format(value)

const getResult = (lower, value, upper) => {
  const width = upper - lower
  const third = width / 3
  const position = (value - lower) / width * 100
  const midpoint = lower + width / 2

  if (value < lower) {
    const distance = lower - value
    return {
      tone: 'below',
      label: 'Ниже референса',
      segment: 'Ниже диапазона',
      summary: `Результат ниже нижней границы на ${formatNumber(distance)}.`,
      distance,
      distanceLabel: 'До нижней границы',
      relativeDistance: distance / width * 100,
      position,
      markerPosition: 14 * (1 - Math.min(distance / width, 1)),
      midpointDelta: value - midpoint,
    }
  }

  if (value > upper) {
    const distance = value - upper
    return {
      tone: 'above',
      label: 'Выше референса',
      segment: 'Выше диапазона',
      summary: `Результат выше верхней границы на ${formatNumber(distance)}.`,
      distance,
      distanceLabel: 'Сверх верхней границы',
      relativeDistance: distance / width * 100,
      position,
      markerPosition: 86 + 14 * Math.min(distance / width, 1),
      midpointDelta: value - midpoint,
    }
  }

  const zeroBasedSegment = Math.min(2, Math.floor((value - lower) / third))
  const segmentLabels = ['Нижняя треть', 'Средняя треть', 'Верхняя треть']
  const segmentForms = ['нижней трети', 'средней трети', 'верхней трети']
  const distanceToLower = value - lower
  const distanceToUpper = upper - value
  const nearestIsLower = distanceToLower <= distanceToUpper

  return {
    tone: `inside-${zeroBasedSegment + 1}`,
    label: 'В референсном интервале',
    segment: segmentLabels[zeroBasedSegment],
    summary: `Результат находится в ${segmentForms[zeroBasedSegment]} референсного интервала.`,
    distance: Math.min(distanceToLower, distanceToUpper),
    distanceLabel: nearestIsLower ? 'До нижней границы' : 'До верхней границы',
    relativeDistance: Math.min(distanceToLower, distanceToUpper) / width * 100,
    position,
    markerPosition: 14 + position * 0.72,
    midpointDelta: value - midpoint,
  }
}

const ReferenceAnalysis = () => {
  const [lowerInput, setLowerInput] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [upperInput, setUpperInput] = useState('')

  const analysis = useMemo(() => {
    const lower = parseNumber(lowerInput)
    const value = parseNumber(valueInput)
    const upper = parseNumber(upperInput)
    const isFilled = [lowerInput, valueInput, upperInput].every((input) => input.trim())
    const isComplete = [lower, value, upper].every(Number.isFinite)
    const isRangeValid = !isComplete || lower < upper

    return {
      lower,
      value,
      upper,
      hasInvalidNumber: isFilled && !isComplete,
      isComplete,
      isRangeValid,
      result: isComplete && isRangeValid ? getResult(lower, value, upper) : null,
    }
  }, [lowerInput, valueInput, upperInput])

  const boundaries = analysis.result
    ? [
        analysis.lower,
        analysis.lower + (analysis.upper - analysis.lower) / 3,
        analysis.lower + (analysis.upper - analysis.lower) * 2 / 3,
        analysis.upper,
      ]
    : []

  const midpointDirection = !analysis.result
    ? ''
    : analysis.result.midpointDelta === 0
      ? 'Совпадает с серединой'
      : analysis.result.midpointDelta > 0
        ? `На ${formatNumber(analysis.result.midpointDelta)} выше середины`
        : `На ${formatNumber(Math.abs(analysis.result.midpointDelta))} ниже середины`

  return (
    <div className="reference-page">
      <header className="reference-hero">
        <p className="eyebrow">Универсальная шкала</p>
        <h1>Где результат внутри референса?</h1>
        <p className="hero-copy">
          Введите границы из бланка лаборатории и своё значение. Шкала покажет
          положение результата и разделит референсный интервал на три равные части.
        </p>
      </header>

      <section className="section-card reference-card" aria-labelledby="reference-input-title">
        <div className="section-heading reference-heading">
          <div>
            <p className="step-label">Три значения</p>
            <h2 id="reference-input-title">Референсы и результат</h2>
          </div>
          <p>Перенесите числа и единицы измерения из одного лабораторного бланка.</p>
        </div>

        <div className="reference-form">
          <div className="field-group">
            <label htmlFor="reference-lower">Нижняя граница</label>
            <input
              id="reference-lower"
              type="text"
              inputMode="decimal"
              placeholder="Например, 4,0"
              aria-invalid={Boolean(lowerInput.trim()) && !Number.isFinite(parseNumber(lowerInput))}
              value={lowerInput}
              onChange={(event) => setLowerInput(event.target.value)}
            />
          </div>
          <div className="field-group result-input">
            <label htmlFor="reference-value">Ваш результат</label>
            <input
              id="reference-value"
              type="text"
              inputMode="decimal"
              placeholder="Например, 6,2"
              aria-invalid={Boolean(valueInput.trim()) && !Number.isFinite(parseNumber(valueInput))}
              value={valueInput}
              onChange={(event) => setValueInput(event.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="reference-upper">Верхняя граница</label>
            <input
              id="reference-upper"
              type="text"
              inputMode="decimal"
              placeholder="Например, 10,0"
              aria-invalid={Boolean(upperInput.trim()) && !Number.isFinite(parseNumber(upperInput))}
              value={upperInput}
              onChange={(event) => setUpperInput(event.target.value)}
            />
          </div>
        </div>

        {analysis.isComplete && !analysis.isRangeValid && (
          <p className="reference-error" role="alert">
            Верхняя граница должна быть больше нижней.
          </p>
        )}

        {analysis.hasInvalidNumber && (
          <p className="reference-error" role="alert">
            Введите три числа. Для дробной части можно использовать запятую или точку.
          </p>
        )}

        {!analysis.result ? (
          <div className="reference-empty" aria-live="polite">
            <div className="empty-scale" aria-hidden="true">
              <span /><span /><span />
            </div>
            <strong>Шкала появится после ввода трёх значений</strong>
            <p>Можно вводить целые, дробные и отрицательные числа.</p>
          </div>
        ) : (
          <div className="reference-result" aria-live="polite">
            <div className="result-title-row">
              <div>
                <span className={`result-status ${analysis.result.tone}`}>{analysis.result.label}</span>
                <h3>{analysis.result.segment}</h3>
              </div>
              <p>{analysis.result.summary}</p>
            </div>

            <div
              className="reference-scale-wrap"
              role="img"
              aria-label={`Результат ${formatNumber(analysis.value)}. Референсный интервал от ${formatNumber(analysis.lower)} до ${formatNumber(analysis.upper)}. ${analysis.result.summary}`}
            >
              <div className="scale-marker" style={{ left: `${analysis.result.markerPosition}%` }}>
                <span>{formatNumber(analysis.value)}</span>
                <i aria-hidden="true" />
              </div>
              <div className="reference-scale" aria-hidden="true">
                <div className="outside-zone below-zone">Ниже</div>
                <div className="reference-zone zone-one">1</div>
                <div className="reference-zone zone-two">2</div>
                <div className="reference-zone zone-three">3</div>
                <div className="outside-zone above-zone">Выше</div>
              </div>
              <div className="scale-values" aria-hidden="true">
                {boundaries.map((boundary, index) => (
                  <span key={`${boundary}-${index}`} style={{ left: `${14 + index * 24}%` }}>
                    {formatNumber(boundary)}
                  </span>
                ))}
              </div>
              <div className="scale-caption" aria-hidden="true">
                <span>нижняя треть</span>
                <span>средняя треть</span>
                <span>верхняя треть</span>
              </div>
            </div>

            <div className="reference-metrics">
              <div>
                <span>Положение относительно интервала</span>
                <strong>{percentFormatter.format(analysis.result.position)}%</strong>
                <small>0% — нижняя, 100% — верхняя граница</small>
              </div>
              <div>
                <span>{analysis.result.distanceLabel}</span>
                <strong>{formatNumber(analysis.result.distance)}</strong>
                <small>{percentFormatter.format(analysis.result.relativeDistance)}% ширины интервала</small>
              </div>
              <div>
                <span>Относительно центра</span>
                <strong>{midpointDirection}</strong>
                <small>Середина: {formatNumber((analysis.lower + analysis.upper) / 2)}</small>
              </div>
            </div>
          </div>
        )}

        <div className="reference-note" role="note">
          <strong>Как трактовать</strong>
          <p>
            Три сегмента — это равные математические части указанного интервала,
            а не медицинские категории риска. Положение внутри референса само по
            себе не исключает заболевание, а выход за границы не устанавливает
            диагноз. Учитывайте единицы, метод лаборатории и рекомендации врача.
          </p>
        </div>
      </section>
    </div>
  )
}

export default ReferenceAnalysis
