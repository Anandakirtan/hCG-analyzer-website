const MS_PER_DAY = 24 * 60 * 60 * 1000

const parseDate = (value) => value ? new Date(`${value}T00:00:00Z`) : null

const formatElapsed = (value, offsetDays = 0) => {
  const date = parseDate(value)
  if (!date) return 'Укажите дату'

  const now = new Date()
  const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.floor((todayUtc - date.getTime()) / MS_PER_DAY) + offsetDays
  if (days < 0) return 'Дата находится в будущем'

  const weeks = Math.floor(days / 7)
  const remainder = days % 7
  return `${weeks} нед. ${remainder} дн.`
}

const ConceptionCalculator = ({
  lastMenstrDate,
  onLastMenstrDateChange,
  cycleLength,
  onCycleLengthChange,
  conceptionDate,
  onConceptionDateChange,
  onCalculate,
  canCalculate,
}) => (
  <section className="section-card" aria-labelledby="dates-title">
    <div className="section-heading">
      <div>
        <p className="step-label">Шаг 1</p>
        <h2 id="dates-title">Уточните срок</h2>
      </div>
      <p>Можно заполнить дату менструации или известную дату зачатия.</p>
    </div>

    <div className="date-grid">
      <div className="date-card">
        <div className="field-group">
          <label htmlFor="last-menstruation">Первый день последней менструации</label>
          <input
            id="last-menstruation"
            type="date"
            value={lastMenstrDate}
            onChange={(event) => onLastMenstrDateChange(event.target.value)}
          />
        </div>
        <div className="field-group cycle-field">
          <label htmlFor="cycle-length">Средняя длина цикла</label>
          <div className="input-suffix">
            <input
              id="cycle-length"
              type="number"
              min="15"
              max="60"
              inputMode="numeric"
              value={cycleLength}
              onChange={(event) => onCycleLengthChange(event.target.value)}
            />
            <span>дней</span>
          </div>
        </div>
        <div className="date-summary">
          <span>Акушерский срок сегодня</span>
          <strong>{formatElapsed(lastMenstrDate)}</strong>
        </div>
      </div>

      <div className="date-card accent-card">
        <div className="field-group">
          <label htmlFor="conception-date">Предполагаемая дата зачатия</label>
          <input
            id="conception-date"
            type="date"
            value={conceptionDate}
            onChange={(event) => onConceptionDateChange(event.target.value)}
          />
        </div>
        <button
          className="secondary-button"
          type="button"
          onClick={onCalculate}
          disabled={!canCalculate}
        >
          Рассчитать по циклу
        </button>
        <div className="date-summary">
          <span>От зачатия сегодня</span>
          <strong>{formatElapsed(conceptionDate)}</strong>
        </div>
      </div>
    </div>

    <p className="supporting-copy">
      Дата зачатия по циклу — ориентировочная. Для справочных диапазонов используется
      акушерский срок от последней менструации; если известна только дата зачатия,
      калькулятор условно добавляет 14 дней.
    </p>
  </section>
)

export default ConceptionCalculator
