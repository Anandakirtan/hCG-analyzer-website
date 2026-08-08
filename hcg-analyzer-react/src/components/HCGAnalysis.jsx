import { useRef, useState } from 'react'
import {
  ACOG_SOURCE,
  HCG_REFERENCE_SOURCE,
  HCG_TREND_SOURCE,
  getHcgReferenceRange,
  getMinimumTwoDayRise,
} from '../constants/hcg-constants'
import HCGChart from './HCGChart'

const MS_PER_DAY = 24 * 60 * 60 * 1000

const createAnalysis = (id) => ({
  id,
  date: '',
  hcg: '',
  referenceLower: null,
  referenceUpper: null,
})

const parseDate = (value) => value ? new Date(`${value}T00:00:00Z`) : null

const dateDiff = (later, earlier) => {
  const laterDate = parseDate(later)
  const earlierDate = parseDate(earlier)
  if (!laterDate || !earlierDate) return null
  return Math.round((laterDate - earlierDate) / MS_PER_DAY)
}

const formatGestationalAge = (days) => {
  if (!Number.isFinite(days) || days < 0) return '—'
  return `${Math.floor(days / 7)} нед. ${days % 7} дн.`
}

const getRangeResult = (hcg, range) => {
  if (!Number.isFinite(hcg) || !range) return null
  if (hcg < range.lower) return { label: 'Ниже справочного', tone: 'warning' }
  if (hcg > range.upper) return { label: 'Выше справочного', tone: 'warning' }
  return { label: 'В диапазоне', tone: 'positive' }
}

const getReferenceState = (analysis, tableRange) => {
  const lowerValue = analysis.referenceLower ?? tableRange?.lower ?? ''
  const upperValue = analysis.referenceUpper ?? tableRange?.upper ?? ''
  const lower = lowerValue === '' ? Number.NaN : Number(lowerValue)
  const upper = upperValue === '' ? Number.NaN : Number(upperValue)
  const hasAnyValue = lowerValue !== '' || upperValue !== ''
  const isValid = Number.isFinite(lower)
    && Number.isFinite(upper)
    && lower >= 0
    && upper >= lower

  return {
    lowerValue,
    upperValue,
    range: isValid ? { lower, upper } : null,
    isInvalid: hasAnyValue && !isValid,
    isCustom: analysis.referenceLower !== null || analysis.referenceUpper !== null,
  }
}

const getPreviousAnalysis = (analysis, analyses) => analyses
  .filter((candidate) => (
    candidate.id !== analysis.id
    && candidate.date
    && candidate.hcg !== ''
    && candidate.date < analysis.date
  ))
  .sort((left, right) => right.date.localeCompare(left.date))[0] ?? null

const getTrend = (analysis, previous) => {
  if (!previous) return null

  const currentHcg = Number(analysis.hcg)
  const previousHcg = Number(previous.hcg)
  const elapsedDays = dateDiff(analysis.date, previous.date)
  if (
    !Number.isFinite(currentHcg)
    || !Number.isFinite(previousHcg)
    || currentHcg < 0
    || previousHcg <= 0
    || !elapsedDays
    || elapsedDays <= 0
  ) return null

  const ratio = currentHcg / previousHcg
  const equivalentTwoDayRise = (Math.pow(ratio, 2 / elapsedDays) - 1) * 100
  const minimumTwoDayRise = getMinimumTwoDayRise(previousHcg)
  const doublingDays = ratio > 1 ? elapsedDays * Math.log(2) / Math.log(ratio) : null

  return {
    equivalentTwoDayRise,
    minimumTwoDayRise,
    doublingDays,
    isRising: ratio > 1,
  }
}

const formatTrend = (trend, gestationalDays) => {
  if (!trend) return { primary: '—', secondary: '' }

  const prefix = trend.equivalentTwoDayRise > 0 ? '+' : ''
  const primary = `${prefix}${trend.equivalentTwoDayRise.toFixed(1)}% за 48 ч`

  if (gestationalDays > 70) {
    return { primary, secondary: 'После 10 недель без оценки' }
  }

  if (!trend.isRising) return { primary, secondary: 'Уровень снизился' }

  const doubling = Number.isFinite(trend.doublingDays)
    ? ` · удвоение ${trend.doublingDays.toFixed(1)} дн.`
    : ''
  const comparison = trend.equivalentTwoDayRise >= trend.minimumTwoDayRise
    ? 'Не ниже исследовательского ориентира'
    : 'Ниже исследовательского ориентира'

  return { primary: `${primary}${doubling}`, secondary: comparison }
}

const HCGAnalysis = ({ gestationalStartDate }) => {
  const [analyses, setAnalyses] = useState([createAnalysis(1)])
  const nextId = useRef(2)

  const addAnalysis = () => {
    const id = nextId.current
    nextId.current += 1
    setAnalyses((current) => [...current, createAnalysis(id)])
  }

  const updateAnalysis = (id, field, value) => {
    setAnalyses((current) => current.map((analysis) => (
      analysis.id === id ? { ...analysis, [field]: value } : analysis
    )))
  }

  const removeAnalysis = (id) => {
    setAnalyses((current) => current.length === 1
      ? [createAnalysis(current[0].id)]
      : current.filter((analysis) => analysis.id !== id))
  }

  const resetReference = (id) => {
    setAnalyses((current) => current.map((analysis) => (
      analysis.id === id
        ? { ...analysis, referenceLower: null, referenceUpper: null }
        : analysis
    )))
  }

  const enriched = analyses.map((analysis) => {
    const gestationalDays = gestationalStartDate
      ? dateDiff(analysis.date, gestationalStartDate)
      : null
    const hcg = analysis.hcg === '' ? Number.NaN : Number(analysis.hcg)
    const tableRange = getHcgReferenceRange(gestationalDays)
    const reference = getReferenceState(analysis, tableRange)
    const previous = getPreviousAnalysis(analysis, analyses)

    return {
      ...analysis,
      gestationalDays,
      tableRange,
      range: reference.range,
      referenceLowerValue: reference.lowerValue,
      referenceUpperValue: reference.upperValue,
      hasCustomRange: reference.isCustom,
      rangeIsInvalid: reference.isInvalid,
      rangeResult: getRangeResult(hcg, reference.range),
      trend: getTrend(analysis, previous),
    }
  })

  return (
    <section className="section-card" aria-labelledby="analyses-title">
      <div className="section-heading analyses-heading">
        <div>
          <p className="step-label">Шаг 2</p>
          <h2 id="analyses-title">Добавьте результаты</h2>
        </div>
        <button className="primary-button" type="button" onClick={addAnalysis}>
          <span aria-hidden="true">+</span> Добавить анализ
        </button>
      </div>

      {!gestationalStartDate && (
        <p className="inline-notice" role="status">
          Укажите дату выше, чтобы табличные референсы заполнились автоматически.
          Свой диапазон и динамику между анализами можно указать и рассчитать без неё.
        </p>
      )}

      <div className="analysis-table" role="table" aria-label="Результаты анализов ХГЧ">
        <div className="analysis-row analysis-header" role="row">
          <div role="columnheader">Дата анализа</div>
          <div role="columnheader">β-ХГЧ, мМЕ/мл</div>
          <div role="columnheader">Акушерский срок</div>
          <div role="columnheader">Референсы, мМЕ/мл</div>
          <div role="columnheader">Динамика</div>
          <div role="columnheader"><span className="sr-only">Действия</span></div>
        </div>

        {enriched.map((analysis, index) => {
          const trend = formatTrend(analysis.trend, analysis.gestationalDays)
          return (
            <div className="analysis-row" role="row" key={analysis.id}>
              <div className="table-cell input-cell" role="cell" data-label="Дата анализа">
                <label className="sr-only" htmlFor={`analysis-date-${analysis.id}`}>
                  Дата анализа {index + 1}
                </label>
                <input
                  id={`analysis-date-${analysis.id}`}
                  type="date"
                  value={analysis.date}
                  onChange={(event) => updateAnalysis(analysis.id, 'date', event.target.value)}
                />
              </div>
              <div className="table-cell input-cell" role="cell" data-label="β-ХГЧ, мМЕ/мл">
                <label className="sr-only" htmlFor={`analysis-hcg-${analysis.id}`}>
                  Значение ХГЧ для анализа {index + 1}
                </label>
                <input
                  id={`analysis-hcg-${analysis.id}`}
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  placeholder="Например, 1250"
                  value={analysis.hcg}
                  onChange={(event) => updateAnalysis(analysis.id, 'hcg', event.target.value)}
                />
              </div>
              <div className="table-cell" role="cell" data-label="Акушерский срок">
                <strong>{formatGestationalAge(analysis.gestationalDays)}</strong>
              </div>
              <div className="table-cell range-cell" role="cell" data-label="Референсы, мМЕ/мл">
                <div
                  className="reference-inputs"
                  role="group"
                  aria-label={`Референсный диапазон для анализа ${index + 1}`}
                >
                  <label className="sr-only" htmlFor={`reference-lower-${analysis.id}`}>
                    Нижняя граница референса для анализа {index + 1}
                  </label>
                  <input
                    id={`reference-lower-${analysis.id}`}
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="От"
                    aria-invalid={analysis.rangeIsInvalid}
                    value={analysis.referenceLowerValue}
                    onChange={(event) => updateAnalysis(analysis.id, 'referenceLower', event.target.value)}
                  />
                  <span aria-hidden="true">—</span>
                  <label className="sr-only" htmlFor={`reference-upper-${analysis.id}`}>
                    Верхняя граница референса для анализа {index + 1}
                  </label>
                  <input
                    id={`reference-upper-${analysis.id}`}
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    placeholder="До"
                    aria-invalid={analysis.rangeIsInvalid}
                    value={analysis.referenceUpperValue}
                    onChange={(event) => updateAnalysis(analysis.id, 'referenceUpper', event.target.value)}
                  />
                </div>
                <div className="reference-meta">
                  <span>
                    {analysis.hasCustomRange
                      ? 'Ваш диапазон'
                      : analysis.tableRange ? 'Cleveland Clinic' : 'Введите вручную'}
                  </span>
                  {analysis.hasCustomRange && analysis.tableRange && (
                    <button
                      className="reference-reset-button"
                      type="button"
                      onClick={() => resetReference(analysis.id)}
                    >
                      Вернуть табличный
                    </button>
                  )}
                </div>
                {analysis.rangeIsInvalid && (
                  <span className="field-error" role="alert">
                    Проверьте обе границы
                  </span>
                )}
                {analysis.rangeResult && (
                  <span className={`status-badge ${analysis.rangeResult.tone}`}>
                    {analysis.rangeResult.label}
                  </span>
                )}
              </div>
              <div className="table-cell trend-cell" role="cell" data-label="Динамика">
                <strong>{trend.primary}</strong>
                {trend.secondary && <span>{trend.secondary}</span>}
              </div>
              <div className="table-cell action-cell" role="cell">
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => removeAnalysis(analysis.id)}
                  aria-label={`Удалить анализ ${index + 1}`}
                  title="Удалить анализ"
                >
                  ×
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <HCGChart analyses={enriched} gestationalStartDate={gestationalStartDate} />

      <div className="methodology">
        <h3>Как читать результат</h3>
        <div className="method-grid">
          <p>
            <strong>Откуда взяты референсы</strong>
            Диапазоны в таблице и зелёная область на графике взяты из{' '}
            <a href={HCG_REFERENCE_SOURCE.url} target="_blank" rel="noreferrer">
              таблицы Cleveland Clinic
            </a>{' '}
            для сывороточного ХГЧ по акушерским неделям — от первого дня последней
            менструации. Это широкие справочные интервалы: референсы конкретной
            лаборатории могут отличаться. Их можно изменить в каждой строке;
            пользовательский диапазон применяется к оценке результата и отмечается
            на графике отдельной вертикальной линией.
          </p>
          <div className="method-item">
            <strong>Что означают 49%, 40% и 33%</strong>
            <p>
              Это нижние исследовательские ориентиры прироста ХГЧ за 48 часов
              (1-й процентиль), а не «процент нормы»:
            </p>
            <ul>
              <li><b>49%</b> — если исходный ХГЧ ниже 1 500 мМЕ/мл;</li>
              <li><b>40%</b> — при исходном ХГЧ от 1 500 до 3 000 мМЕ/мл;</li>
              <li><b>33%</b> — если исходный ХГЧ выше 3 000 мМЕ/мл.</li>
            </ul>
            <p>
              Порог выбирается по предыдущему результату, а изменение приводится
              к эквиваленту за 48 часов. Рост ниже ориентира сам по себе не
              устанавливает диагноз. Источник —{' '}
              <a href={HCG_TREND_SOURCE.url} target="_blank" rel="noreferrer">
                исследование Barnhart et al.
              </a>
            </p>
          </div>
          <p>
            <strong>Последовательность</strong>
            Предыдущий результат выбирается по дате, поэтому строки можно добавлять
            в любом порядке.
          </p>
        </div>
        <p className="source-list">
          Источники: <a href={HCG_REFERENCE_SOURCE.url} target="_blank" rel="noreferrer">{HCG_REFERENCE_SOURCE.label}</a>
          {' · '}<a href={HCG_TREND_SOURCE.url} target="_blank" rel="noreferrer">{HCG_TREND_SOURCE.label}</a>
          {' · '}<a href={ACOG_SOURCE.url} target="_blank" rel="noreferrer">{ACOG_SOURCE.label}</a>
        </p>
      </div>
    </section>
  )
}

export default HCGAnalysis
