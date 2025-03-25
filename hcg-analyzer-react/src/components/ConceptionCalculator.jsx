import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ConceptionCalculator = ({ onConceptionDateChange }) => {
  const [lastMenstrDate, setLastMenstrDate] = useState(null);
  const [cycleLength, setCycleLength] = useState('');
  const [conceptionDate, setConceptionDate] = useState(null);
  const [menstrDiff, setMenstrDiff] = useState('');
  const [conceptionDiff, setConceptionDiff] = useState('');

  const calculateDates = () => {
    if (!lastMenstrDate) return;

    // Calculate conception date if not manually set
    if (!conceptionDate && cycleLength) {
      const ovulationDay = parseInt(cycleLength) - 14;
      const calculatedDate = new Date(lastMenstrDate);
      calculatedDate.setDate(calculatedDate.getDate() + ovulationDay);
      setConceptionDate(calculatedDate);
    }

    // Calculate differences
    const today = new Date();
    const menstrWeeks = Math.floor((today - lastMenstrDate) / (7 * 24 * 60 * 60 * 1000));
    const menstrDays = Math.floor(((today - lastMenstrDate) % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    setMenstrDiff(`${menstrWeeks} недель и ${menstrDays} дней`);

    if (conceptionDate) {
      const concWeeks = Math.floor((today - conceptionDate) / (7 * 24 * 60 * 60 * 1000));
      const concDays = Math.floor(((today - conceptionDate) % (7 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
      setConceptionDiff(`${concWeeks} недель и ${concDays} дней`);
      onConceptionDateChange(conceptionDate);
    }
  };

  return (
    <div id="conception_wrapper">
      <div className="conception_bar">
        <div className="conception_input">
          <p className="conception_title">Дата последней менструации</p>
          <DatePicker
            selected={lastMenstrDate}
            onChange={date => {
              setLastMenstrDate(date);
              calculateDates();
            }}
            dateFormat="dd/MM/yyyy"
          />
          <input
            type="number"
            value={cycleLength}
            onChange={e => {
              setCycleLength(e.target.value);
              calculateDates();
            }}
            placeholder="Длина цикла"
          />
        </div>
        <div className="conception_output">
          <p>{menstrDiff}</p>
        </div>
      </div>
      <div className="conception_bar">
        <div className="conception_input">
          <p className="conception_title">Дата зачатия</p>
          <DatePicker
            selected={conceptionDate}
            onChange={date => {
              setConceptionDate(date);
              calculateDates();
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="conception_output">
          <p>{conceptionDiff}</p>
        </div>
      </div>
    </div>
  );
};

export default ConceptionCalculator; 