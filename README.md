# ArcheForge SoulPrint

A React application that creates personalized AI chat experiences based on psychological profiles.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your environment variables:
   - Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

5. Start the development server:
   ```bash
   npm run dev
   ```

#### Alternative Development Modes

- **For local development with API server**: `npm run dev`
- **For Vercel-style development (serverless functions)**: `npm run dev:vercel`
- **Build for production**: `npm run build`

## Deployment to Vercel

### Prerequisites

- A Vercel account
- A Gemini API key

### Steps

1. **Connect your repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Environment Variables**
   
   In your Vercel project settings, add the following environment variable:
   
   - `GEMINI_API_KEY`: Your Gemini API key

3. **Deploy**
   
   - Vercel will automatically deploy when you push to your repository
   - Or trigger a manual deployment from the Vercel dashboard

### Architecture

The application is optimized for Vercel with:

- **Frontend**: React + Vite (static files)
- **Backend**: Vercel Serverless Functions in `/api` directory
- **AI**: Google Gemini API

### API Endpoints

- `POST /api/generateSoulPrint` - Generates a psychological profile from questionnaire answers
- `POST /api/continueChat` - Continues a chat conversation with the AI

## Local Development with API Functions

To test the API functions locally:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. In another terminal, start the Vercel dev server for functions:
   ```bash
   vercel dev
   ```

This will make the API functions available at `http://localhost:3000/api/*`.

## Troubleshooting

### Common Issues

1. **Gemini API Errors**
   - Verify your API key is valid and has quota
   - Check that the API key is set in environment variables

3. **Build Errors**
   - Ensure all dependencies are installed
   - Check that TypeScript compilation succeeds

### Environment Variable Debugging

To debug environment variables in Vercel:

1. Go to your project's Function Logs
2. Check for any missing environment variable warnings
3. Ensure all required variables are set in the Environment Variables tab

## License

MIT
