/**
 * profile-processor.js
 *
 * Glow Wizard MVP Backend Module
 *
 * Responsibility:
 *   - Validate and process user profile/questionnaire data.
 *   - Integrate with Firestore for storing and retrieving profile data.
 *   - All code under 500 lines, modular, and independently testable.
 *   - No sensitive data exposure; robust error handling.
 *
 * Integration Points:
 *   - Consumes data from authentication middleware (auth-middleware.js).
 *   - Outputs processed profile data for recommendation engine.
 *   - Reads/writes user profiles to Firestore.
 *
 * Constraints:
 *   - Must follow context anchor and session protocols.
 *   - No deprecated libraries or naming convention violations.
 *   - All functions exported for independent testing.
 */

const admin = require('./firebase-admin-init');

/**
 * Validate the structure and content of the user's profile data.
 *
 * @param {Object} profileData - The profile data object submitted by the user.
 * @returns {Object|true} Returns true if valid, or an error object with details if invalid.
 */
function validateProfileData(profileData) {
    const requiredFields = [
        { key: 'name', type: 'string', minLength: 1 },
        { key: 'age', type: 'number', min: 13, max: 120 },
        { key: 'skinType', type: 'string', allowed: ['dry', 'oily', 'combination', 'normal', 'sensitive'] },
        { key: 'concerns', type: 'object', isArray: true, allowed: ['acne', 'wrinkles', 'redness', 'dryness', 'dark spots', 'sensitivity'] },
        { key: 'location', type: 'string', minLength: 2 }
    ];

    let errors = [];

    if (!profileData || typeof profileData !== 'object') {
        return { valid: false, errors: ['Profile data must be an object.'] };
    }

    for (const field of requiredFields) {
        const value = profileData[field.key];

        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
            errors.push(`Missing required field: ${field.key}`);
            continue;
        }

        if (field.type === 'string' && typeof value !== 'string') {
            errors.push(`Field ${field.key} must be a string.`);
        }
        if (field.type === 'number') {
            if (typeof value !== 'number' || isNaN(value)) {
                errors.push(`Field ${field.key} must be a number.`);
            } else {
                if (field.min !== undefined && value < field.min) {
                    errors.push(`Field ${field.key} must be at least ${field.min}.`);
                }
                if (field.max !== undefined && value > field.max) {
                    errors.push(`Field ${field.key} must be at most ${field.max}.`);
                }
            }
        }
        if (field.type === 'object' && field.isArray) {
            if (!Array.isArray(value)) {
                errors.push(`Field ${field.key} must be an array.`);
            } else if (field.allowed) {
                const invalid = value.filter(v => !field.allowed.includes(v));
                if (invalid.length > 0) {
                    errors.push(`Field ${field.key} contains invalid values: ${invalid.join(', ')}.`);
                }
            }
        }
        if (field.allowed && field.type === 'string' && !field.allowed.includes(value)) {
            errors.push(`Field ${field.key} must be one of: ${field.allowed.join(', ')}.`);
        }
        if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
            errors.push(`Field ${field.key} must be at least ${field.minLength} characters.`);
        }
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return true;
}

/**
 * Process and transform questionnaire answers from frontend format
 * to backend-ready structure for storage and AI processing.
 *
 * @param {Object} answers - The questionnaire answers from the user.
 * @returns {Object} Transformed answers object, ready for storage or AI input.
 */
function processQuestionnaireAnswers(answers) {
    if (!answers || typeof answers !== 'object') {
        return { error: 'Answers must be an object.' };
    }

    // Example transformation: flatten nested answers, normalize keys, convert scales to numbers
    let processed = {};

    // Example expected keys: hydration, sunExposure, sleepHours, stressLevel
    if ('hydration' in answers) {
        processed.hydration = parseInt(answers.hydration, 10);
        if (isNaN(processed.hydration)) processed.hydration = null;
    }
    if ('sunExposure' in answers) {
        processed.sunExposure = answers.sunExposure.toString().toLowerCase();
    }
    if ('sleepHours' in answers) {
        processed.sleepHours = parseFloat(answers.sleepHours);
        if (isNaN(processed.sleepHours)) processed.sleepHours = null;
    }
    if ('stressLevel' in answers) {
        processed.stressLevel = parseInt(answers.stressLevel, 10);
        if (isNaN(processed.stressLevel)) processed.stressLevel = null;
    }
    // Add more mappings as needed for your questionnaire

    // Remove any keys with null/undefined values
    Object.keys(processed).forEach(key => {
        if (processed[key] === null || processed[key] === undefined) {
            delete processed[key];
        }
    });

    return processed;
}
/**
 * Save a validated user profile to Firestore.
 *
 * @param {Object} profileData - The validated profile data to store.
 * @returns {Promise<Object>} Resolves to Firestore write result or error object.
 */
async function saveProfileToFirestore(profileData) {
    if (!profileData || typeof profileData !== 'object') {
        return { error: 'Invalid profile data.' };
    }
    if (!profileData.userId) {
        return { error: 'Missing userId in profile data.' };
    }
    try {
        const db = admin.firestore();
        const profileRef = db.collection('profiles').doc(profileData.userId);
        await profileRef.set(profileData, { merge: true });
        return { success: true };
    } catch (error) {
        return handleProfileError(error);
    }
}

/**
 * Retrieve a user profile from Firestore by userId.
 *
 * @param {string} userId - The unique identifier for the user.
 * @returns {Promise<Object|null>} Resolves to profile data or null if not found.
 */
async function getProfileFromFirestore(userId) {
    if (!userId || typeof userId !== 'string') {
        return { error: 'Invalid userId.' };
    }
    try {
        const db = admin.firestore();
        const profileRef = db.collection('profiles').doc(userId);
        const doc = await profileRef.get();
        if (!doc.exists) {
            return null;
        }
        return doc.data();
    } catch (error) {
        return handleProfileError(error);
    }
}

/**
 * Centralized error handler for profile processing operations.
 *
 * @param {Error} error - The error object thrown during processing.
 * @returns {Object} Standardized error response for API.
 */
function handleProfileError(error) {
    if (process.env.NODE_ENV === 'development') {
        console.error('Profile Processor Error:', error);
    }
    return {
        error: 'Profile processing error.',
        code: error.code || 500,
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
}

// Export all functions for independent testing and integration.
module.exports = {
    validateProfileData,
    processQuestionnaireAnswers,
    saveProfileToFirestore,
    getProfileFromFirestore,
    handleProfileError
};
