# Glow Wizard MVP - Codex Instructions

## Project Overview
- Personalized skincare MVP with AI-powered recommendations
- React frontend with Material-UI components ONLY
- Node.js/Express backend with Firebase authentication
- OpenAI GPT-4o integration for recommendations

## Critical Constraints
- Each backend module MUST be under 500 lines
- Material-UI exclusive - no other UI libraries
- Single router in App.js only
- Backend API keys only - never expose to frontend
- Firebase Auth Emulator on port 9099
- Backend server on port 3000

## Completed Modules (DO NOT MODIFY)
1. auth-middleware.js - Firebase token validation
2. profile-processor.js - User data processing  
3. photo-analyzer.js - Image validation
4. recommendation-engine.js - OpenAI integration
5. data-validator.js - Input sanitization

## Module 6 Requirements
- Integrate all five modules as Express middleware
- Define POST /api/recommendations endpoint
- Define GET /health endpoint  
- CORS configuration for frontend
- Global error handling
- Must stay under 500 lines

## Testing Requirements
- Test endpoints with Firebase emulator tokens
- Validate middleware integration
- Confirm CORS functionality
- Check error handling paths

## Environment Variables
- FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
- GCLOUD_PROJECT=glow-wizard-mvp-cfa97
- PORT=3000
- OPENAI_API_KEY=(backend only)
