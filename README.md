# Secret Santa Generator

A beautiful Next.js web application for generating random Secret Santa gift exchange assignments with custom constraints.

## Features

- ✨ **Easy Participant Management** - Add and remove participants with a simple interface
- 🚫 **Custom Constraints** - Specify who each person cannot be assigned to (e.g., family members, partners)
- 🎲 **Random Assignments** - Generates different assignments each time you run it
- 💾 **Local Storage** - Automatically saves your participants and constraints in the browser
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Production Build

```bash
npm run build
npm start
```

## How to Use

1. **Add Participants**: Enter names in the "Participants" section and click "Add"
2. **Set Constraints**: Click on any participant to expand and select who they cannot be assigned to
3. **Generate**: Click the "Generate Assignments" button to create random pairings
4. **View Results**: Click on any assignment to see details, or copy all assignments to clipboard

## Data Persistence

All participants and constraints are automatically saved to your browser's local storage. This means:
- Your data persists between sessions
- No server or database required
- Data is stored locally on your device

## Algorithm

The app uses a greedy random algorithm with retry logic:
- Attempts to assign each participant a random valid receiver
- Retries up to 100 times if it gets stuck
- Ensures different results each time you generate

For more details on algorithms and performance, see `ALGORITHM_ANALYSIS.md` and `RANDOMNESS_ANALYSIS.md`.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **CSS-in-JS** - Styled with Next.js styled-jsx

## Deployment

### Deploy to Vercel

The easiest way to deploy is using the [Vercel CLI](https://vercel.com/docs/cli):

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy
vercel
```

Or deploy directly from the [Vercel Dashboard](https://vercel.com/new):
1. Import your Git repository
2. Vercel will automatically detect Next.js
3. Click "Deploy"

The app will be live at `https://your-project-name.vercel.app`

### Environment Variables

No environment variables are required - the app uses only browser localStorage.

## License

ISC

