# Vercel Deployment Guide

This guide explains how to properly configure environment variables for deploying the Forge AI application to Vercel.

## Updated Dependencies

All deprecated packages have been updated to their latest versions:
- React: Updated to v18.3.1 (stable version)
- Firebase: Updated to v10.14.1
- Firebase Admin: Updated to v12.5.0
- Google GenAI: Updated to v1.5.0
- TypeScript: Updated to v5.6.3
- Vite: Updated to v5.4.10

## Environment Variables

You need to configure the following environment variables in your Vercel dashboard:

### Client-side Variables (VITE_ prefix)

These variables are exposed to the client-side code:

- `VITE_FIREBASE_API_KEY` - Your Firebase project API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain (e.g., project.firebaseapp.com)
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Your Firebase measurement ID (optional)

### Server-side Variables

These variables are only available on the server and are used by the API routes:

- `GEMINI_API_KEY` - Your Google Gemini API key
- `FIREBASE_PROJECT_ID` - Your Firebase project ID (can be same as VITE_FIREBASE_PROJECT_ID)
- `FIREBASE_CLIENT_EMAIL` - Your Firebase service account client email
- `FIREBASE_PRIVATE_KEY` - Your Firebase service account private key (with proper newlines)

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable from the lists above

### Firebase Service Account Setup

To get the server-side Firebase variables:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the following values from the JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (make sure to preserve the newlines)

### Gemini API Key Setup

1. Go to Google AI Studio: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key to `GEMINI_API_KEY`

## Deployment Process

Once environment variables are configured:

1. Push your code to your Git repository
2. Vercel will automatically deploy the application
3. The API routes will be available at:
   - `/api/generateSoulPrint`
   - `/api/continueChat`

## API Configuration

The API routes have been updated to work with Vercel's serverless functions:
- Runtime: Node.js 18.x
- Maximum duration: 30 seconds per function
- Proper Firebase Admin SDK initialization
- Custom type definitions for Vercel compatibility

## Firestore Security Rules

The Firestore security rules are properly configured:
- Users can only access their own chat sessions
- All other access is denied by default
- Rules are compatible with both Firebase Functions and Vercel deployment

## Troubleshooting

### Firebase Admin SDK Errors

If you see errors related to Firebase Admin SDK initialization:

1. Verify all server-side Firebase environment variables are set
2. Ensure the private key is properly formatted with newlines
3. Check that the service account has the necessary permissions

### Gemini API Errors

If you see errors related to the Gemini API:

1. Verify the `GEMINI_API_KEY` is correctly set
2. Check that the API key is valid and active
3. Ensure the API key has the necessary permissions

### Build Errors

If you encounter build errors:

1. Check that all client-side variables have the `VITE_` prefix
2. Verify the build command in `vercel.json` is correct
3. Ensure all dependencies are properly installed

### NPM Deprecation Warnings

All npm deprecation warnings have been resolved:
- Updated to stable React v18.3.1
- Updated Firebase SDK to latest compatible versions
- Fixed TypeScript and Vite compatibility issues
- Resolved all Firebase Functions compatibility issues