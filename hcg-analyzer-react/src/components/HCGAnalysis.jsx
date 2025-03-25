import React, { useState, useEffect } from 'react';
import { hcgNorms, hcgMedians } from '../constants/hcg-constants';

const HCGAnalysis = ({ conceptionDate }) => {
  const [analyses, setAnalyses] = useState([]);

  const calculateGestationalAge = (analysisDate) => {
    if (!conceptionDate || !analysisDate) return null;
    const diffTime = Math.abs(analysisDate - conceptionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };

  const isNormal = (hcg, weeks) => {
    if (!weeks || weeks < 3 || weeks > 20) return null;
    const norm = hcgNorms[weeks];
    return norm ? hcg >= norm.min && hcg <= norm.max : null;
  };

  const getMedian = (weeks) => {
    return weeks && hcgMedians[weeks] ? hcgMedians[weeks] : null;
  };

  const calculatePrediction = (currentHCG, prevHCG, daysDiff) => {
    if (!prevHCG || !daysDiff) return null;
    const expectedDoubling = Math.pow(2, daysDiff / 2);
    const expected = prevHCG * expectedDoubling;
    const deviation = ((currentHCG - expected) / expected) * 100;
    return deviation.toFixed(1);
  };

  const addAnalysis = () => {
    setAnalyses([...analyses, {
      date: new Date(),
      hcg: '',
      gestationalAge: null,
      isNormal: null,
      median: null,
      prediction: null
    }]);
  };

  const updateAnalysis = (index, field, value) => {
    const newAnalyses = [...analyses];
    newAnalyses[index] = {
      ...newAnalyses[index],
      [field]: value
    };

    // Recalculate values
    if (field === 'date' || field === 'hcg') {
      const analysis = newAnalyses[index];
      analysis.gestationalAge = calculateGestationalAge(analysis.date);
      analysis.isNormal = isNormal(parseFloat(analysis.hcg), analysis.gestationalAge);
      analysis.median = getMedian(analysis.gestationalAge);

      if (index > 0) {
        const prevAnalysis = newAnalyses[index - 1];
        const daysDiff = (analysis.date - prevAnalysis.date) / (1000 * 60 * 60 * 24);
        analysis.prediction = calculatePrediction(
          parseFloat(analysis.hcg),
          parseFloat(prevAnalysis.hcg),
          daysDiff
        );
      }
    }

    setAnalyses(newAnalyses);
  };

  return (
    <div id="analizy_wrapper">
      <div id="actual_hcg_analizy_wrapper">
        <div className="analyze_bar" id="analyze_header">
          <div>Дата</div>
          <div>ХГЧ</div>
          <div>Срок</div>
          <div>В норме?</div>
          <div>Норма (медиана)</div>
          <div>По предыдущему (отклонение)</div>
        </div>
        {analyses.map((analysis, index) => (
          <div key={index} className="analyze_bar">
            <input
              type="date"
              value={analysis.date ? analysis.date.toISOString().split('T')[0] : ''}
              onChange={(e) => updateAnalysis(index, 'date', new Date(e.target.value))}
            />
            <input
              type="number"
              value={analysis.hcg}
              onChange={(e) => updateAnalysis(index, 'hcg', e.target.value)}
              placeholder="ХГЧ"
            />
            <div>{analysis.gestationalAge ? `${analysis.gestationalAge} нед.` : '-'}</div>
            <div>{analysis.isNormal === null ? '-' : analysis.isNormal ? 'Да' : 'Нет'}</div>
            <div>{analysis.median || '-'}</div>
            <div>{analysis.prediction ? `${analysis.prediction}%` : '-'}</div>
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