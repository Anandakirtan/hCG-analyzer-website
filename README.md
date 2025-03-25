# hCG analyzer

A website for analyzing hCG test results. It uses conception date (which can be calculated using the last menstruation date) and hCG scores to tell if everything's alright or should scores should be higher or lower.

Don't understand much about it, just implemented what my mom had always been doing by hand. **She says it saves her a lot of time!**

## Available Versions

### Original Version (JavaScript)
Available [**here**](https://anandakirtan.github.io/hCG-analyzer-website/original)

### React Version (New!)
Available [**here**](https://anandakirtan.github.io/hCG-analyzer-website/react)

The React version includes a modern UI and improved user experience while maintaining all the functionality of the original version.

## Project Structure
```
hCG-analyzer-website/
├── original/           # Original JavaScript version
├── react/             # Built React version
├── hcg-analyzer-react/ # React source code
└── README.md
```

## Development

### Original Version
The original version is a simple HTML/JavaScript application located in the `original` directory.

### React Version
The React version is located in the `hcg-analyzer-react` directory. To work on it:

1. Navigate to the React project:
```bash
cd hcg-analyzer-react
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. To deploy both versions:
```bash
cd hcg-analyzer-react
npm run deploy
```

## License
This project is open source and available under the MIT License.
