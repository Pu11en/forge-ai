# Vercel Environment Variables Setup Guide

This guide will help you properly configure the environment variables for your Soul Print application in Vercel.

## Required Environment Variables

You need to create the following environment variable in your Vercel project:

### API Keys

1. **GEMINI_API_KEY**
   - Get this from Google AI Studio: https://aistudio.google.com/app/apikey

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on the "Settings" tab
3. Select "Environment Variables" from the sidebar
4. Add each variable using the "Add" button:
   - Enter the variable name (e.g., `GEMINI_API_KEY`)
   - Enter the value
   - Select the appropriate environments (Production, Preview, Development)
   - Click "Save"

5. After adding all variables, redeploy your application for the changes to take effect.

## Important Notes

- Variables without `VITE_` prefix are only available on the server-side
- Make sure to never expose sensitive server-side information in client-side variables
- Always double-check that you've copied the values correctly

## Troubleshooting

If you still encounter deployment errors:

1. Verify all environment variables are correctly set in Vercel
2. Make sure all required variables are added to the correct environments (Production, Preview, Development)

For more information, refer to the [Vercel Environment Variables documentation](https://vercel.com/docs/concepts/projects/environment-variables).