# TODO - Fix Vercel API Connection Error

## Task: Fix server error when using API functions on Vercel

### Steps:
- [x] 1. Analyze the codebase and understand the API key usage
- [x] 2. Update vite.config.server.ts to expose GROQ_API_KEY at build time
- [x] 3. Update vercel.json to properly configure environment variables
- [x] 4. Remove Gemini routes (user only has Groq API key)
- [ ] 5. Push changes to GitHub

### Issue Summary:
- The API keys (GROQ_API_KEY) stored in Vercel secrets are not being passed to the serverless functions
- Need to expose environment variables in the server build

