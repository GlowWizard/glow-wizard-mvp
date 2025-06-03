# AGENTS.md - Glow Wizard MVP Guidance

## Project Structure
- `/backend`: Core Express.js modules
  - `auth-middleware.js` (Module 1 - Authentication)
  - `data-validator.js` (Module 5 - Input Validation)
  - `server.js` (Module 6 - Orchestration)
- `.env`: Environment variables (never commit)
- `firebase.json`: Emulator config

## Coding Rules
1. All modules must stay under 500 lines of code
2. Use Firebase Auth Emulator on port 9100 for local development
3. Never expose API keys in code or commits
4. Maintain MUI-only frontend constraints (when added)
5. Error handling must use centralized middleware

## Testing Protocol
1. Always start emulators first:
   ```
   firebase emulators:start
   ```
2. Test endpoints with:
   ```
   curl -X POST http://localhost:3000/apirecommendations -H "Authorization: Bearer <token>" -d '{"test":true}'
   ```
3. Validate responses against API contract

## Critical Paths
- `server.js` lines 45-62 (Express middleware order)
- `auth-middleware.js` lines 28-41 (token extraction)
```

