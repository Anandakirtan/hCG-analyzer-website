// Broad reference ranges for serum hCG by obstetric week (weeks since LMP).
// Source: Cleveland Clinic, medically reviewed 2025-04-21.
// These values are informational: laboratory reference intervals and clinical
// interpretation vary, and a single hCG value cannot establish viability.
export const HCG_REFERENCE_RANGES = [
  { fromWeek: 3, toWeek: 3, lower: 5, upper: 50 },
  { fromWeek: 4, toWeek: 4, lower: 5, upper: 426 },
  { fromWeek: 5, toWeek: 5, lower: 18, upper: 7340 },
  { fromWeek: 6, toWeek: 6, lower: 1080, upper: 56500 },
  { fromWeek: 7, toWeek: 8, lower: 7650, upper: 229000 },
  { fromWeek: 9, toWeek: 12, lower: 25700, upper: 288000 },
  { fromWeek: 13, toWeek: 16, lower: 13300, upper: 254000 },
  { fromWeek: 17, toWeek: 24, lower: 4060, upper: 165400 },
  { fromWeek: 25, toWeek: 40, lower: 3640, upper: 117000 },
]

export const HCG_REFERENCE_SOURCE = {
  label: 'Cleveland Clinic: уровни ХГЧ по акушерским неделям',
  url: 'https://my.clevelandclinic.org/health/body/22489-human-chorionic-gonadotropin',
}

export const HCG_TREND_SOURCE = {
  label: 'Barnhart et al., Obstetrics & Gynecology (2016)',
  url: 'https://pubmed.ncbi.nlm.nih.gov/27500326/',
}

export const ACOG_SOURCE = {
  label: 'ACOG: Early Pregnancy Loss',
  url: 'https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/11/early-pregnancy-loss',
}

export const getHcgReferenceRange = (gestationalDays) => {
  if (!Number.isFinite(gestationalDays) || gestationalDays < 0) return null

  const week = Math.floor(gestationalDays / 7) + 1
  return HCG_REFERENCE_RANGES.find(
    ({ fromWeek, toWeek }) => week >= fromWeek && week <= toWeek,
  ) ?? null
}

// Minimum observed two-day rise (first percentile) in the cited cohort of
// symptomatic patients with ultimately viable intrauterine pregnancies.
export const getMinimumTwoDayRise = (initialHcg) => {
  if (!Number.isFinite(initialHcg) || initialHcg <= 0) return null
  if (initialHcg < 1500) return 49
  if (initialHcg <= 3000) return 40
  return 33
}
