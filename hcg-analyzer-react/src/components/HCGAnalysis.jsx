import React, { useState } from 'react';
import { lower_hcg_by_day, upper_hcg_by_day, median_hcg_by_day } from '../constants/hcg-constants';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const getGestationalAge = (conceptionDate, analysisDate) => {
  if (!conceptionDate || !analysisDate) return null;
  return Math.ceil(Math.abs(analysisDate - conceptionDate) / MS_PER_DAY);
};

const isNormal = (hcg, days) => {
  if (!days || days < 7 || days > 84 || isNaN(hcg)) return null;
  const lower = lower_hcg_by_day[days];
  const upper = upper_hcg_by_day[days];
  return lower != null && upper != null ? hcg >= lower && hcg <= upper : null;
};

const getMedian = (days) => {
  return days && median_hcg_by_day[days] != null ? median_hcg_by_day[days] : null;
};

const getPrediction = (currentHCG, prevHCG, daysDiff) => {
  if (!prevHCG || !daysDiff || daysDiff <= 0 || isNaN(currentHCG) || isNaN(prevHCG)) return null;
  const expected = prevHCG * Math.pow(2, daysDiff / 2);
  return (((currentHCG - expected) / expected) * 100).toFixed(1);
};

const HCGAnalysis = ({ conceptionDate }) => {
  const [analyses, setAnalyses] = useState([]);

  // All derived values are computed fresh from raw inputs + current conceptionDate prop.
  // This means changing conceptionDate always reflects in all rows immediately.
  const enriched = analyses.map((a, index) => {
    const age = getGestationalAge(conceptionDate, a.date);
    const hcg = parseFloat(a.hcg);
    const prev = index > 0 ? analyses[index - 1] : null;
    const daysDiff = prev?.date && a.date ? (a.date - prev.date) / MS_PER_DAY : null;

    return {
      ...a,
      gestationalAge: age,
      normalStatus: isNormal(hcg, age),
      median: getMedian(age),
      prediction: prev ? getPrediction(hcg, parseFloat(prev.hcg), daysDiff) : null,
    };
  });

  const addAnalysis = () => {
    setAnalyses([...analyses, { date: new Date(), hcg: '' }]);
  };

  const updateAnalysis = (index, field, value) => {
    const updated = [...analyses];
    updated[index] = { ...updated[index], [field]: value };
    setAnalyses(updated);
  };

  return (
    <div id="analizy_wrapper">
      <div id="actual_hcg_analizy_wrapper">
        <div className="analyze_bar" id="analyze_header">
          <div>Дата</div>
          <div>ХГЧ</div>
          <div>Срок (дни)</div>
          <div>В норме?</div>
          <div>Норма (медиана)</div>
          <div>По предыдущему (отклонение)</div>
        </div>
        {enriched.map((analysis, index) => (
          <div key={index} className="analyze_bar">
            <input
              type="date"
              value={analysis.date ? analysis.date.toISOString().split('T')[0] : ''}
              onChange={(e) => updateAnalysis(index, 'date', e.target.value ? new Date(e.target.value) : null)}
            />
            <input
              type="number"
              value={analysis.hcg}
              onChange={(e) => updateAnalysis(index, 'hcg', e.target.value)}
              placeholder="ХГЧ"
            />
            <div>{analysis.gestationalAge != null ? `${analysis.gestationalAge} дн.` : '-'}</div>
            <div>{analysis.normalStatus === null ? '-' : analysis.normalStatus ? 'Да' : 'Нет'}</div>
            <div>{analysis.median ?? '-'}</div>
            <div>{analysis.prediction !== null ? `${analysis.prediction}%` : '-'}</div>
          </div>
        ))}
      </div>
      <div id="button_bar">
        <button onClick={addAnalysis}>Добавить анализ</button>
      </div>
    </div>
  );
};

export default HCGAnalysis;
