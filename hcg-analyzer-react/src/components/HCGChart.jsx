import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { getHcgReferenceRange } from '../constants/hcg-constants'

const MS_PER_DAY = 24 * 60 * 60 * 1000
const Y_TICK_CANDIDATES = [0, 10, 100, 1000, 10000, 100000, 500000, 1000000]
const valueFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })
const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const parseDate = (value) => value ? new Date(`${value}T00:00:00Z`) : null

const getDateDiff = (laterTimestamp, earlierDate) => {
  const earlier = parseDate(earlierDate)
  if (!earlier) return null
  return Math.round((laterTimestamp - earlier.getTime()) / MS_PER_DAY)
}

const getTickValues = (maximum) => {
  const ceiling = Y_TICK_CANDIDATES.find((tick) => tick >= maximum)
    ?? Math.pow(10, Math.ceil(Math.log10(maximum)))
  return [...Y_TICK_CANDIDATES.filter((tick) => tick < ceiling), ceiling]
}

const createDateTicks = (minimum, maximum, count) => {
  if (count <= 1) return [minimum]
  return Array.from({ length: count }, (_, index) => (
    minimum + (maximum - minimum) * index / (count - 1)
  ))
}

const HCGChart = ({ analyses, gestationalStartDate }) => {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(760)
  const clipId = `hcg-chart-${useId().replaceAll(':', '')}`

  const points = useMemo(() => analyses
    .filter((analysis) => (
      analysis.date
      && analysis.hcg !== ''
      && Number.isFinite(Number(analysis.hcg))
      && Number(analysis.hcg) >= 0
    ))
    .map((analysis) => ({
      id: analysis.id,
      date: analysis.date,
      timestamp: parseDate(analysis.date).getTime(),
      value: Number(analysis.hcg),
      range: analysis.range,
      hasCustomRange: analysis.hasCustomRange,
    }))
    .sort((left, right) => left.timestamp - right.timestamp), [analyses])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return undefined

    const updateWidth = () => setWidth(Math.max(300, Math.round(element.getBoundingClientRect().width)))
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(element)
    return () => observer.disconnect()
  }, [points.length])

  if (points.length === 0) return null

  const height = width < 520 ? 310 : 350
  const margin = width < 520
    ? { top: 28, right: 16, bottom: 50, left: 62 }
    : { top: 30, right: 24, bottom: 52, left: 74 }
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom

  const pointMinimum = points[0].timestamp
  const pointMaximum = points[points.length - 1].timestamp
  const datePadding = pointMinimum === pointMaximum
    ? MS_PER_DAY
    : Math.max(MS_PER_DAY / 2, (pointMaximum - pointMinimum) * 0.04)
  const xMinimum = pointMinimum - datePadding
  const xMaximum = pointMaximum + datePadding

  const referenceSamples = []
  if (gestationalStartDate) {
    for (let timestamp = pointMinimum; timestamp <= pointMaximum; timestamp += MS_PER_DAY) {
      const gestationalDays = getDateDiff(timestamp, gestationalStartDate)
      const range = getHcgReferenceRange(gestationalDays)
      if (range) referenceSamples.push({ timestamp, ...range })
    }

    if (pointMaximum !== pointMinimum) {
      const gestationalDays = getDateDiff(pointMaximum, gestationalStartDate)
      const range = getHcgReferenceRange(gestationalDays)
      if (range && referenceSamples.at(-1)?.timestamp !== pointMaximum) {
        referenceSamples.push({ timestamp: pointMaximum, ...range })
      }
    }
  }

  const allValues = [
    ...points.map(({ value }) => value),
    ...referenceSamples.flatMap(({ lower, upper }) => [lower, upper]),
    ...points
      .filter(({ hasCustomRange, range }) => hasCustomRange && range)
      .flatMap(({ range }) => [range.lower, range.upper]),
  ]
  const maximumValue = Math.max(10, ...allValues)
  const yTicks = getTickValues(maximumValue)
  const yMaximum = yTicks.at(-1)
  const logMaximum = Math.log10(yMaximum + 1)

  const xScale = (timestamp) => (
    margin.left + (timestamp - xMinimum) / (xMaximum - xMinimum) * plotWidth
  )
  const yScale = (value) => (
    margin.top + (1 - Math.log10(value + 1) / logMaximum) * plotHeight
  )

  const linePath = points.map((point, index) => (
    `${index === 0 ? 'M' : 'L'} ${xScale(point.timestamp)} ${yScale(point.value)}`
  )).join(' ')

  const bandPath = referenceSamples.length > 0
    ? [
        ...referenceSamples.map((sample, index) => (
          `${index === 0 ? 'M' : 'L'} ${xScale(sample.timestamp)} ${yScale(sample.upper)}`
        )),
        ...referenceSamples.slice().reverse().map((sample) => (
          `L ${xScale(sample.timestamp)} ${yScale(sample.lower)}`
        )),
        'Z',
      ].join(' ')
    : null

  const xTicks = createDateTicks(xMinimum, xMaximum, width < 520 ? 3 : 5)
  const customReferences = points.filter(({ hasCustomRange, range }) => (
    hasCustomRange && range
  ))
  const accessibleSummary = points.map((point) => (
    `${fullDateFormatter.format(point.timestamp)}: ${valueFormatter.format(point.value)} мМЕ/мл${
      point.hasCustomRange && point.range
        ? `, пользовательский диапазон ${valueFormatter.format(point.range.lower)}–${valueFormatter.format(point.range.upper)}`
        : ''
    }`
  )).join('; ')

  return (
    <section className="chart-section" aria-labelledby="hcg-chart-title">
      <div className="chart-heading">
        <div>
          <h3 id="hcg-chart-title">График динамики</h3>
          <p>Логарифмическая шкала помогает видеть и ранние, и высокие значения.</p>
        </div>
        <div className="chart-legend" aria-label="Легенда графика">
          <span><i className="legend-line" aria-hidden="true" />Результаты</span>
          {bandPath && <span><i className="legend-band" aria-hidden="true" />Справочный диапазон</span>}
          {customReferences.length > 0 && (
            <span><i className="legend-custom-reference" aria-hidden="true" />Ваши референсы</span>
          )}
        </div>
      </div>

      <div className="chart-canvas" ref={containerRef}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Динамика ХГЧ. ${accessibleSummary}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect x={margin.left} y={margin.top} width={plotWidth} height={plotHeight} />
            </clipPath>
          </defs>

          <rect
            className="chart-frame"
            x={margin.left}
            y={margin.top}
            width={plotWidth}
            height={plotHeight}
          />

          {yTicks.map((tick) => {
            const y = yScale(tick)
            return (
              <g key={tick}>
                <line className="chart-grid-line" x1={margin.left} x2={width - margin.right} y1={y} y2={y} />
                <text className="chart-axis-label" x={margin.left - 10} y={y + 4} textAnchor="end">
                  {valueFormatter.format(tick)}
                </text>
              </g>
            )
          })}

          {xTicks.map((tick, index) => {
            const x = xScale(tick)
            return (
              <g key={`${tick}-${index}`}>
                <line className="chart-tick" x1={x} x2={x} y1={height - margin.bottom} y2={height - margin.bottom + 5} />
                <text
                  className="chart-axis-label"
                  x={x}
                  y={height - margin.bottom + 22}
                  textAnchor={index === 0 ? 'start' : index === xTicks.length - 1 ? 'end' : 'middle'}
                >
                  {dateFormatter.format(tick)}
                </text>
              </g>
            )
          })}

          <text className="chart-axis-title" x={margin.left + plotWidth / 2} y={height - 8} textAnchor="middle">
            Дата анализа
          </text>
          <text
            className="chart-axis-title"
            x={15}
            y={margin.top + plotHeight / 2}
            textAnchor="middle"
            transform={`rotate(-90 15 ${margin.top + plotHeight / 2})`}
          >
            β-ХГЧ, мМЕ/мл
          </text>

          <g clipPath={`url(#${clipId})`}>
            {bandPath && <path className="reference-band" d={bandPath} />}
            {customReferences.map((point) => {
              const x = xScale(point.timestamp)
              const upperY = yScale(point.range.upper)
              const lowerY = yScale(point.range.lower)
              return (
                <g className="custom-reference" key={`reference-${point.id}`}>
                  <title>{`Ваш диапазон: ${valueFormatter.format(point.range.lower)}–${valueFormatter.format(point.range.upper)} мМЕ/мл`}</title>
                  <line x1={x} x2={x} y1={upperY} y2={lowerY} />
                  <line x1={x - 5} x2={x + 5} y1={upperY} y2={upperY} />
                  <line x1={x - 5} x2={x + 5} y1={lowerY} y2={lowerY} />
                </g>
              )
            })}
            {points.length > 1 && <path className="result-line" d={linePath} />}
            {points.map((point, index) => {
              const x = xScale(point.timestamp)
              const y = yScale(point.value)
              const showLabel = points.length <= 5 || index === 0 || index === points.length - 1
              return (
                <g key={point.id}>
                  <circle className="result-hit-area" cx={x} cy={y} r="16">
                    <title>{`${fullDateFormatter.format(point.timestamp)} — ${valueFormatter.format(point.value)} мМЕ/мл`}</title>
                  </circle>
                  <circle className="result-point" cx={x} cy={y} r="5" />
                  {showLabel && (
                    <text
                      className="chart-value-label"
                      x={x}
                      y={Math.max(margin.top + 14, y - 11)}
                      textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
                    >
                      {valueFormatter.format(point.value)}
                    </text>
                  )}
                </g>
              )
            })}
          </g>
        </svg>
      </div>
    </section>
  )
}

export default HCGChart
