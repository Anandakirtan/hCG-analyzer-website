# hCG analyzer

A small client-side web app for reviewing serial quantitative β-hCG results.
It estimates gestational age, plots dated results against a broad reference
range, and normalizes the change between results to a 48-hour interval.

The project is designed for static hosting on GitHub Pages. No entered medical
data is sent to a server.

## Important limitation

This app is an informational calculator, not a diagnostic tool. A single hCG
result — or a trend calculated from several results — cannot by itself confirm
pregnancy viability or location. Laboratory reference intervals differ, and
the result should be interpreted together with symptoms, repeat testing,
ultrasound, and a clinician's assessment.

The React version uses:

- broad ranges by gestational week from [Cleveland Clinic](https://my.clevelandclinic.org/health/body/22489-human-chorionic-gonadotropin);
- level-dependent two-day rise estimates from [Barnhart et al. (2016)](https://pubmed.ncbi.nlm.nih.gov/27500326/);
- the diagnostic caution described by [ACOG](https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/11/early-pregnancy-loss).

Always prioritize the reference interval printed by the laboratory that
performed the test.

## Available versions

- [React version](https://anandakirtan.github.io/hCG-analyzer-website/react/) — current version
- [Original JavaScript version](https://anandakirtan.github.io/hCG-analyzer-website/original/) — retained for comparison

## Project structure

```text
hcg-analyzer-website/
├── original/            # Original JavaScript version
├── react/               # Production build published by GitHub Pages
├── hcg-analyzer-react/  # React source
└── README.md
```

## Development

```bash
cd hcg-analyzer-react
npm ci
npm run dev
```

Quality checks and production build:

```bash
npm run lint
npm run build
```

`npm run build` replaces the contents of `react/` with a GitHub Pages-ready
bundle. GitHub Pages serves this repository from `main`, so publishing means
committing the generated `react/` directory and pushing `main`.

## License

MIT
