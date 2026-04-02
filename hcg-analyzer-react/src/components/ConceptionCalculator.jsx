import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

const dateDiff = (date) => {
  if (!date) return null;
  const today = new Date();
  const elapsed = today - date;
  const weeks = Math.floor(elapsed / MS_PER_WEEK);
  const days = Math.floor((elapsed % MS_PER_WEEK) / MS_PER_DAY);
  return `${weeks} недель и ${days} дней`;
};

const ConceptionCalculator = ({ onConceptionDateChange }) => {
  const [lastMenstrDate, setLastMenstrDate] = useState(null);
  const [cycleLength, setCycleLength] = useState('');
  const [conceptionDate, setConceptionDate] = useState(null);

  const handleCalculate = () => {
    if (!lastMenstrDate || !cycleLength) return;
    const ovulationDay = parseInt(cycleLength) - 14;
    if (isNaN(ovulationDay)) return;

    const calculated = new Date(lastMenstrDate);
    calculated.setDate(calculated.getDate() + ovulationDay);
    setConceptionDate(calculated);
    onConceptionDateChange(calculated);
  };

  const handleManualConceptionChange = (date) => {
    setConceptionDate(date);
    onConceptionDateChange(date);
  };

  const canCalculate = lastMenstrDate && cycleLength;

  return (
    <div id="conception_wrapper">
      <div className="conception_bar">
        <div className="conception_input">
          <p className="conception_title">Дата последней менструации</p>
          <DatePicker
            selected={lastMenstrDate}
            onChange={setLastMenstrDate}
            dateFormat="dd/MM/yyyy"
          />
          <input
            type="number"
            value={cycleLength}
            onChange={e => setCycleLength(e.target.value)}
            placeholder="Длина цикла"
          />
        </div>
        <div className="conception_output">
          <p>{dateDiff(lastMenstrDate)}</p>
        </div>
      </div>
      <div className="conception_bar">
        <div className="conception_input">
          <p className="conception_title">Дата зачатия</p>
          <DatePicker
            selected={conceptionDate}
            onChange={handleManualConceptionChange}
            dateFormat="dd/MM/yyyy"
          />
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            title="Рассчитать дату зачатия по дате последней менструации и длине цикла"
          >
            Рассчитать
          </button>
        </div>
        <div className="conception_output">
          <p>{dateDiff(conceptionDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default ConceptionCalculator;
