# Firebase Functions Directory

**Note:** This directory contains Firebase Cloud Functions that are **not used** in the Vercel deployment.

The project has been configured to use Vercel serverless functions instead of Firebase Cloud Functions. The equivalent functionality can be found in the `/api` directory at the project root:

- `api/generateSoulPrint.ts` - Equivalent to `functions/index.ts` generateSoulPrint function
- `api/continueChat.ts` - Equivalent to `functions/index.ts` continueChat function

## Why Two Implementations?

The project originally used Firebase Cloud Functions but has been migrated to Vercel for better integration with the Vercel deployment platform. Both implementations are kept for reference and potential future use cases.

## Deployment

- **Vercel Functions**: Deployed automatically with the main application when using `vercel deploy`
- **Firebase Functions**: Would require separate deployment using `firebase deploy --only functions`

If you want to use Firebase Functions instead of Vercel functions, you would need to:
1. Update the client-side code to call the Firebase Functions endpoints
2. Configure the Firebase Functions environment variables
3. Deploy the functions using the Firebase CLI