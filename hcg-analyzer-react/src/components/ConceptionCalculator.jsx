import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

const dateDiff = (date) => {
  if (!date) return null;
  const elapsed = new Date() - date;
  const weeks = Math.floor(elapsed / MS_PER_WEEK);
  const days = Math.floor((elapsed % MS_PER_WEEK) / MS_PER_DAY);
  return `${weeks} недель и ${days} дней`;
};

const ConceptionCalculator = ({
  lastMenstrDate,
  onLastMenstrDateChange,
  cycleLength,
  onCycleLengthChange,
  conceptionDate,
  onConceptionDateChange,
}) => {
  return (
    <div id="conception_wrapper">
      <div className="conception_bar">
        <div className="conception_input">
          <p className="conception_title">Дата последней менструации</p>
          <DatePicker
            selected={lastMenstrDate}
            onChange={onLastMenstrDateChange}
            dateFormat="dd/MM/yyyy"
          />
          <input
            type="number"
            value={cycleLength}
            onChange={e => onCycleLengthChange(e.target.value)}
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
            onChange={onConceptionDateChange}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="conception_output">
          <p>{dateDiff(conceptionDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default ConceptionCalculator;
