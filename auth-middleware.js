const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.GCLOUD_PROJECT || 'glow-wizard-mvp-cfa97',
    credential: {
      getAccessToken: () => Promise.resolve({
        access_token: 'owner',
        expires_in: 3600
      })
    }
  });
}

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const idToken = authHeader.split('Bearer ')[1].trim();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      authTime: decodedToken.auth_time
    };
    
    next();
  } catch (error) {
    console.error('Auth failed:', error);
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = requireAuth;
