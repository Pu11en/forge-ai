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
   - Set up a Firebase project and get your config values

5. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

### Prerequisites

- A Vercel account
- A Firebase project with Firestore enabled
- A Gemini API key

### Steps

1. **Connect your repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Environment Variables**
   
   In your Vercel project settings, add the following environment variables:
   
   **Required for the application:**
   - `GEMINI_API_KEY`: Your Gemini API key
   - `VITE_FIREBASE_API_KEY`: Your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase app ID
   - `VITE_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID
   
   **Required for server-side functions:**
   - `FIREBASE_CLIENT_EMAIL`: Your Firebase service account client email
   - `FIREBASE_PRIVATE_KEY`: Your Firebase service account private key

3. **Get Firebase Service Account Credentials**
   
   - Go to your Firebase project settings
   - Navigate to "Service accounts" tab
   - Click "Generate new private key"
   - Download the JSON file
   - Extract the `client_email` and `private_key` values
   - Add them to your Vercel environment variables

4. **Deploy**
   
   - Vercel will automatically deploy when you push to your repository
   - Or trigger a manual deployment from the Vercel dashboard

### Architecture

The application is optimized for Vercel with:

- **Frontend**: React + Vite (static files)
- **Backend**: Vercel Serverless Functions in `/api` directory
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Google Gemini API

### API Endpoints

- `POST /api/generateSoulPrint` - Generates a psychological profile from questionnaire answers
- `POST /api/continueChat` - Continues a chat conversation with the AI

Both endpoints require Firebase authentication tokens in the Authorization header.

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

1. **Firebase Authentication Errors**
   - Ensure all Firebase environment variables are set correctly
   - Check that your Firebase project has Authentication enabled

2. **Gemini API Errors**
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
