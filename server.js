require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requireAuth = require('./auth-middleware');
const { validateAPIRequest } = require('./data-validator');
const { processQuestionnaireAnswers } = require('./profile-processor');
const { validatePhotoUrls } = require('./photo-analyzer');
const { generateRecommendations } = require('./recommendation-engine');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Configuration
app.use(cors());
app.use(express.json());

// Debugging Middleware (Remove in Prod)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Recommendations Endpoint
app.post('/apirecommendations', 
  requireAuth, // Auth Middleware
  (req, res, next) => validateAPIRequest(req.body) ? next() : res.status(400).json({ error: "INVALID_REQUEST" }), // Validation
  async (req, res) => {
    try {
      const { profileData, questionnaireAnswers, photos } = req.body;
      
      // Process Inputs
      const processedProfile = processQuestionnaireAnswers(questionnaireAnswers);
      const validatedPhotos = validatePhotoUrls(photos);
      
      // Generate Recommendations
      const recommendations = await generateRecommendations({
        profileData,
        processedAnswers: processedProfile,
        photos: validatedPhotos
      });

      res.json({
        success: true,
        recommendations,
        user: req.user
      });

    } catch (error) {
      console.error('[SERVER ERROR]', error);
      res.status(500).json({ error: "INTERNAL_ERROR" });
    }
});

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`🔧 Auth Emulator: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
});
