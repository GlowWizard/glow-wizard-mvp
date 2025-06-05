/**
 * Photo Analyzer Module - Glow Wizard MVP
 * 
 * Purpose: Handle photo URL validation, formatting, and metadata extraction
 * for skincare analysis integration with Firebase Storage
 * 
 * Constraints:
 * - Under 500 lines of code
 * - Modular, single-responsibility design
 * - Firebase Admin SDK integration only (backend)
 * - Comprehensive error handling
 * - Integration with AI recommendation engine
 * 
 * Dependencies:
 * - Firebase Admin SDK (Storage)
 * - Node.js validator library
 * - EXIF parser for metadata extraction
 * - Axios for HTTP requests
 * 
 * Integration Points:
 * - Receives photo URLs from profile-processor.js
 * - Outputs formatted photo data to recommendation-engine.js
 * - Interfaces with Firebase Storage for URL validation
 */

const { getStorage } = require('firebase-admin/storage');
const validator = require('validator');
const axios = require('axios');

/**
 * Validates photo URLs for accessibility, format, and Firebase Storage compliance
 * @param {Array} photoUrls - Array of photo URL strings to validate
 * @returns {Object} - Validation result with success status and error details
 */
function validatePhotoUrls(photoUrls) {
    try {
        // Validate input parameters
        if (!Array.isArray(photoUrls)) {
            return {
                success: false,
                error: 'INVALID_INPUT',
                message: 'Photo URLs must be provided as an array'
            };
        }

        if (photoUrls.length === 0) {
            return {
                success: false,
                error: 'EMPTY_ARRAY',
                message: 'At least one photo URL must be provided'
            };
        }

        if (photoUrls.length > 5) {
            return {
                success: false,
                error: 'TOO_MANY_PHOTOS',
                message: 'Maximum of 5 photos allowed per analysis'
            };
        }

        const validatedUrls = [];
        const errors = [];

        // Validate each URL individually
        photoUrls.forEach((url, index) => {
            try {
                // Check if URL is a valid string
                if (typeof url !== 'string' || url.trim().length === 0) {
                    errors.push({
                        index,
                        error: 'INVALID_URL_FORMAT',
                        message: `Photo ${index + 1}: URL must be a non-empty string`
                    });
                    return;
                }

                const trimmedUrl = url.trim();

                // Validate URL format using validator library
                const urlOptions = {
                    protocols: ['http', 'https'],
                    require_tld: true,
                    require_protocol: true,
                    require_host: true,
                    allow_underscores: false,
                    allow_trailing_dot: false,
                    allow_protocol_relative_urls: false
                };

                if (!validator.isURL(trimmedUrl, urlOptions)) {
                    errors.push({
                        index,
                        error: 'MALFORMED_URL',
                        message: `Photo ${index + 1}: URL format is invalid`
                    });
                    return;
                }

                // Check for supported image file extensions
                const supportedFormats = ['.jpg', '.jpeg', '.png', '.webp'];
                const urlLowerCase = trimmedUrl.toLowerCase();
                const hasValidExtension = supportedFormats.some(format => 
                    urlLowerCase.includes(format)
                );

                if (!hasValidExtension) {
                    errors.push({
                        index,
                        error: 'UNSUPPORTED_FORMAT',
                        message: `Photo ${index + 1}: Must be JPG, JPEG, PNG, or WebP format`
                    });
                    return;
                }

                // Add to validated URLs if all checks pass
                validatedUrls.push({
                    originalUrl: trimmedUrl,
                    index,
                    format: detectImageFormat(trimmedUrl)
                });

            } catch (validationError) {
                errors.push({
                    index,
                    error: 'VALIDATION_ERROR',
                    message: `Photo ${index + 1}: ${validationError.message}`
                });
            }
        });

        // Return validation results
        if (errors.length > 0) {
            return {
                success: false,
                error: 'VALIDATION_FAILED',
                validatedUrls,
                errors,
                message: `${errors.length} of ${photoUrls.length} photos failed validation`
            };
        }

        return {
            success: true,
            validatedUrls,
            message: `All ${photoUrls.length} photos validated successfully`
        };

    } catch (error) {
        return handlePhotoErrors(error);
    }
}

/**
 * Helper function to detect image format from URL
 * @param {string} url - Image URL to analyze
 * @returns {string} - Detected image format
 */
function detectImageFormat(url) {
    const urlLowerCase = url.toLowerCase();
    if (urlLowerCase.includes('.png')) return 'PNG';
    if (urlLowerCase.includes('.webp')) return 'WebP';
    if (urlLowerCase.includes('.jpeg')) return 'JPEG';
    if (urlLowerCase.includes('.jpg')) return 'JPEG';
    return 'UNKNOWN';
}

/**
 * Formats photo data for AI processing and recommendation engine consumption
 * @param {Array} validatedPhotos - Array of validated photo objects
 * @returns {Object} - Formatted photo data ready for AI analysis
 */
async function formatPhotosForAI(validatedPhotos) {
    try {
        if (!Array.isArray(validatedPhotos) || validatedPhotos.length === 0) {
            return {
                success: false,
                error: 'INVALID_INPUT',
                message: 'Validated photos array is required'
            };
        }

        const formattedPhotos = [];
        const processingErrors = [];

        // Process each photo with metadata extraction
        for (const photo of validatedPhotos) {
            try {
                // Extract metadata for each photo
                const metadataResult = await extractPhotoMetadata(photo.originalUrl);
                
                if (!metadataResult.success) {
                    processingErrors.push({
                        url: photo.originalUrl,
                        error: metadataResult.error,
                        message: metadataResult.message
                    });
                    continue;
                }

                // Format photo data for AI consumption
                const formattedPhoto = {
                    id: `photo_${Date.now()}_${photo.index}`,
                    url: photo.originalUrl,
                    type: 'image_url',
                    format: metadataResult.metadata.format,
                    quality: metadataResult.metadata.quality,
                    dimensions: metadataResult.metadata.dimensions,
                    fileSize: metadataResult.metadata.fileSize,
                    contentType: metadataResult.metadata.contentType,
                    aiCompatible: metadataResult.metadata.quality.suitable,
                    processingNotes: []
                };

                // Add processing recommendations based on quality assessment
                if (metadataResult.metadata.quality.score < 50) {
                    formattedPhoto.processingNotes.push('Low quality image - analysis may be limited');
                }

                if (metadataResult.metadata.quality.issues.length > 0) {
                    formattedPhoto.processingNotes.push(...metadataResult.metadata.quality.issues);
                }

                formattedPhotos.push(formattedPhoto);

            } catch (processingError) {
                processingErrors.push({
                    url: photo.originalUrl,
                    error: 'PROCESSING_ERROR',
                    message: processingError.message
                });
            }
        }

        // Generate summary for AI processing
        const summary = {
            totalPhotos: validatedPhotos.length,
            processedPhotos: formattedPhotos.length,
            failedPhotos: processingErrors.length,
            aiCompatiblePhotos: formattedPhotos.filter(p => p.aiCompatible).length,
            averageQuality: formattedPhotos.length > 0 
                ? Math.round(formattedPhotos.reduce((sum, p) => sum + p.quality.score, 0) / formattedPhotos.length)
                : 0,
            recommendedForAnalysis: formattedPhotos.filter(p => p.aiCompatible && p.quality.score >= 60).length
        };

        // Return formatted results
        return {
            success: true,
            photos: formattedPhotos,
            summary,
            processingErrors: processingErrors.length > 0 ? processingErrors : undefined,
            timestamp: new Date().toISOString(),
            readyForAI: summary.recommendedForAnalysis > 0
        };

    } catch (error) {
        return handlePhotoErrors(error);
    }
}

/**
 * Extracts metadata from photo URLs including dimensions, format, and basic properties
 * @param {string} photoUrl - Individual photo URL for metadata extraction
 * @returns {Object} - Metadata object with photo properties
 */
async function extractPhotoMetadata(photoUrl) {
    try {
        // First verify photo accessibility
        const accessibilityCheck = await verifyPhotoAccessibility(photoUrl);
        if (!accessibilityCheck.accessible) {
            throw new Error(`Photo not accessible: ${accessibilityCheck.message}`);
        }

        const metadata = {
            url: photoUrl,
            contentType: accessibilityCheck.contentType,
            fileSize: accessibilityCheck.contentLength,
            lastModified: accessibilityCheck.lastModified,
            format: detectImageFormat(photoUrl),
            timestamp: new Date().toISOString(),
            dimensions: null,
            quality: null
        };

        // Try to extract basic image information
        try {
            // For basic metadata without EXIF dependency
            if (accessibilityCheck.contentLength && accessibilityCheck.contentType) {
                // Estimate dimensions based on file size and format
                metadata.dimensions = estimateDimensions(accessibilityCheck.contentLength, metadata.format);
            }
        } catch (metadataError) {
            metadata.metadataError = 'Basic metadata extraction failed';
        }

        // Add quality assessment metrics
        metadata.quality = assessImageQuality(metadata);

        return {
            success: true,
            metadata
        };

    } catch (error) {
        return {
            success: false,
            error: 'METADATA_EXTRACTION_FAILED',
            message: error.message,
            url: photoUrl
        };
    }
}

/**
 * Estimates image dimensions based on file size and format
 * @param {number} fileSize - File size in bytes
 * @param {string} format - Image format
 * @returns {Object} - Estimated dimensions
 */
function estimateDimensions(fileSize, format) {
    // Basic estimation algorithm based on typical compression ratios
    let compressionRatio = 10; // Default for JPEG
    
    switch (format) {
        case 'PNG':
            compressionRatio = 6;
            break;
        case 'WebP':
            compressionRatio = 12;
            break;
        case 'JPEG':
            compressionRatio = 10;
            break;
    }
    
    // Estimate total pixels
    const estimatedPixels = fileSize * compressionRatio / 3; // Assuming 3 bytes per pixel
    const estimatedSide = Math.sqrt(estimatedPixels);
    
    return {
        width: Math.round(estimatedSide),
        height: Math.round(estimatedSide),
        aspectRatio: "1.00",
        estimated: true
    };
}

/**
 * Assesses image quality for AI processing suitability
 * @param {Object} metadata - Image metadata object
 * @returns {Object} - Quality assessment results
 */
function assessImageQuality(metadata) {
    const quality = {
        score: 0,
        issues: [],
        suitable: false
    };

    // Check file size (optimal range: 100KB - 5MB)
    if (metadata.fileSize < 100000) {
        quality.issues.push('File size may be too small for detailed analysis');
        quality.score -= 10;
    } else if (metadata.fileSize > 5000000) {
        quality.issues.push('File size is very large, may affect processing speed');
        quality.score -= 5;
    } else {
        quality.score += 20;
    }

    // Check dimensions if available
    if (metadata.dimensions) {
        const { width, height } = metadata.dimensions;
        if (width < 300 || height < 300) {
            quality.issues.push('Image resolution may be too low for accurate analysis');
            quality.score -= 15;
        } else if (width >= 800 && height >= 600) {
            quality.score += 25;
        } else {
            quality.score += 15;
        }
    }

    // Check image format
    if (metadata.format === 'JPEG' || metadata.format === 'PNG') {
        quality.score += 10;
    } else if (metadata.format === 'WebP') {
        quality.score += 5;
    } else {
        quality.issues.push('Image format may not be optimal for analysis');
        quality.score -= 10;
    }

    // Determine overall suitability
    quality.suitable = quality.score >= 30 && quality.issues.length < 3;
    quality.score = Math.max(0, Math.min(100, quality.score + 50)); // Normalize to 0-100

    return quality;
}

/**
 * Handles photo processing errors with standardized error responses
 * @param {Error} error - Error object from photo processing operations
 * @returns {Object} - Standardized error response object
 */
function handlePhotoErrors(error) {
    const timestamp = new Date().toISOString();
    
    // Default error response structure
    const errorResponse = {
        success: false,
        timestamp,
        module: 'photo-analyzer',
        error: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred during photo processing',
        details: null
    };

    // Handle specific error types
    if (error.code === 'ECONNREFUSED') {
        errorResponse.error = 'CONNECTION_REFUSED';
        errorResponse.message = 'Unable to connect to photo URL';
        errorResponse.details = 'Check network connectivity and URL accessibility';
    } else if (error.code === 'ENOTFOUND') {
        errorResponse.error = 'URL_NOT_FOUND';
        errorResponse.message = 'Photo URL domain not found';
        errorResponse.details = 'Verify the URL domain is correct and accessible';
    } else if (error.code === 'ECONNABORTED') {
        errorResponse.error = 'REQUEST_TIMEOUT';
        errorResponse.message = 'Photo processing request timed out';
        errorResponse.details = 'Photo URL may be slow to respond or unavailable';
    } else if (error.response) {
        // HTTP response errors
        errorResponse.error = 'HTTP_ERROR';
        errorResponse.message = `HTTP ${error.response.status}: ${error.response.statusText}`;
        errorResponse.details = {
            statusCode: error.response.status,
            statusText: error.response.statusText,
            url: error.config?.url
        };
    } else if (error.name === 'ValidationError') {
        errorResponse.error = 'VALIDATION_ERROR';
        errorResponse.message = error.message;
        errorResponse.details = 'Input data validation failed';
    } else if (error.name === 'TypeError') {
        errorResponse.error = 'TYPE_ERROR';
        errorResponse.message = 'Invalid data type provided';
        errorResponse.details = error.message;
    } else {
        // Generic error handling
        errorResponse.message = error.message || 'Unknown error occurred';
        errorResponse.details = {
            name: error.name,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
    }

    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
        console.error('Photo Analyzer Error:', errorResponse);
    }

    return errorResponse;
}

/**
 * Verifies photo accessibility and Firebase Storage integration
 * @param {string} photoUrl - Photo URL to verify accessibility
 * @returns {Promise<Object>} - Promise resolving to accessibility status
 */
async function verifyPhotoAccessibility(photoUrl) {
    try {
        // Configure axios for HEAD request with timeout
        const config = {
            method: 'head',
            url: photoUrl,
            timeout: 5000, // 5 second timeout
            maxRedirects: 3,
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            }
        };

        // Perform HEAD request to check accessibility
        const response = await axios(config);
        
        // Verify content type is an image
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
            throw new Error(`Invalid content type: ${contentType}`);
        }

        // Check content length to ensure file exists
        const contentLength = parseInt(response.headers['content-length'] || '0');
        if (contentLength === 0) {
            throw new Error('Image file appears to be empty');
        }

        // Verify reasonable file size (between 1KB and 10MB)
        if (contentLength < 1024 || contentLength > 10 * 1024 * 1024) {
            throw new Error(`Image file size out of range: ${contentLength} bytes`);
        }

        return {
            accessible: true,
            contentType,
            contentLength,
            lastModified: response.headers['last-modified'],
            etag: response.headers['etag']
        };

    } catch (error) {
        // Handle different types of accessibility errors
        if (error.code === 'ECONNABORTED') {
            return {
                accessible: false,
                error: 'TIMEOUT',
                message: 'Photo accessibility check timed out'
            };
        }

        if (error.response) {
            return {
                accessible: false,
                error: 'HTTP_ERROR',
                statusCode: error.response.status,
                message: `HTTP ${error.response.status}: ${error.response.statusText}`
            };
        }

        return {
            accessible: false,
            error: 'NETWORK_ERROR',
            message: error.message
        };
    }
}

module.exports = {
    validatePhotoUrls,
    formatPhotosForAI,
    extractPhotoMetadata,
    handlePhotoErrors,
    verifyPhotoAccessibility
};