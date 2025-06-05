// backend/data-validator.js
const validator = require('validator');
const Joi = require('joi');

function sanitizeUserInput(input) {
  let sanitized = validator.escape(input.stringInput || '');
  sanitized = sanitized.replace(/"/g, '&quot;');
  return {
    stringInput: sanitized,
    emailInput: validator.normalizeEmail(input.emailInput || ''),
    urlInput: validator.trim(input.urlInput || '')
  };
}

function validateAPIRequest(data) {
  const schema = Joi.object({
    userId: Joi.string().alphanum().min(20).max(28).required(),
    skinType: Joi.string().valid('dry', 'oily', 'combination', 'sensitive').required(),
    concerns: Joi.array().items(Joi.string().max(50)).max(5).required()
  });
  return schema.validate(data);
}

function preventInjectionAttacks(input) {
  const bannedPatterns = /(\bSELECT\b|\bINSERT\b|\bDELETE\b|;|--)/gi;
  return !bannedPatterns.test(JSON.stringify(input));
}

module.exports = {
  sanitizeUserInput,
  validateAPIRequest,
  preventInjectionAttacks
};
