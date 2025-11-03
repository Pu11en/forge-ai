# Vercel Environment Variables Setup Guide

This guide will help you properly configure the environment variables for your Soul Print application in Vercel.

## Fixed Configuration

The `vercel.json` file has been updated to use the literal Firebase project ID "soul-print" instead of referencing a non-existent secret. This resolves the deployment error you were experiencing.

## Required Environment Variables

You need to create the following environment variables in your Vercel project:

### Firebase Client Configuration (for client-side access)

1. **VITE_FIREBASE_API_KEY**
   - Get this from your Firebase project settings
   - Location: Firebase Console > Project Settings > General > Your apps > Web app > Firebase SDK snippet > Config

2. **VITE_FIREBASE_AUTH_DOMAIN**
   - Format: `your-project-id.firebaseapp.com`
   - For your project: `soul-print.firebaseapp.com`

3. **VITE_FIREBASE_STORAGE_BUCKET**
   - Format: `your-project-id.firebasestorage.app`
   - For your project: `soul-print.firebasestorage.app`

4. **VITE_FIREBASE_MESSAGING_SENDER_ID**
   - Get this from your Firebase project settings
   - Location: Firebase Console > Project Settings > Cloud Messaging > Sender ID

5. **VITE_FIREBASE_APP_ID**
   - Get this from your Firebase project settings
   - Location: Firebase Console > Project Settings > General > Your apps > Web app > Firebase SDK snippet > Config

### Firebase Admin SDK (for server-side functions)

6. **FIREBASE_CLIENT_EMAIL**
   - Get this from your Firebase service account key
   - Location: Firebase Console > Project Settings > Service Accounts > Generate new private key

7. **FIREBASE_PRIVATE_KEY**
   - Get this from your Firebase service account key
   - Important: Include the entire key including the "-----BEGIN PRIVATE KEY-----" and "-----END PRIVATE KEY-----" lines
   - Make sure to properly escape newlines in Vercel (use \n)

### API Keys

8. **GEMINI_API_KEY**
   - Get this from Google AI Studio: https://makersuite.google.com/app/apikey

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on the "Settings" tab
3. Select "Environment Variables" from the sidebar
4. Add each variable using the "Add" button:
   - Enter the variable name (e.g., `VITE_FIREBASE_API_KEY`)
   - Enter the value
   - Select the appropriate environments (Production, Preview, Development)
   - Click "Save"

5. After adding all variables, redeploy your application for the changes to take effect.

## Important Notes

- Variables starting with `VITE_` are exposed to the client-side code
- Variables without `VITE_` prefix are only available on the server-side
- Make sure to never expose sensitive server-side information in client-side variables
- The Firebase project ID is now hardcoded as "soul-print" in the vercel.json file
- Always double-check that you've copied the values correctly, especially the private key

## Troubleshooting

If you still encounter deployment errors:

1. Verify all environment variables are correctly set in Vercel
2. Check that the Firebase project ID matches your actual project
3. Ensure the private key is properly formatted with correct newline characters
4. Make sure all required variables are added to the correct environments (Production, Preview, Development)

For more information, refer to the [Vercel Environment Variables documentation](https://vercel.com/docs/concepts/projects/environment-variables).