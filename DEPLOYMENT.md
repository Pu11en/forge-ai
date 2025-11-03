# Vercel Deployment Guide

This guide explains how to properly configure environment variables for deploying the Forge AI application to Vercel.

## Updated Dependencies

All deprecated packages have been updated to their latest versions:
- React: Updated to v18.3.1 (stable version)
- Google GenAI: Updated to v1.5.0
- TypeScript: Updated to v5.6.3
- Vite: Updated to v5.4.10

## Environment Variables

You need to configure the following environment variable in your Vercel dashboard:

### Server-side Variables

These variables are only available on the server and are used by the API routes:

- `GEMINI_API_KEY` - Your Google Gemini API key

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable from the lists above

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
- Custom type definitions for Vercel compatibility

## Troubleshooting

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
- Fixed TypeScript and Vite compatibility issues