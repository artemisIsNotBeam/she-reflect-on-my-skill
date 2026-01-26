/**
 * GeoReflect - Gemini API Integration
 * Uses the official @google/generative-ai SDK
 */

import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai';

const GeminiAPI = {
    client: null,
    model: null,

    /**
     * Get API key from config or return null
     */
    getConfigApiKey() {
        if (typeof CONFIG !== 'undefined' &&
            CONFIG.GEMINI_API_KEY &&
            CONFIG.GEMINI_API_KEY !== 'YOUR_API_KEY_HERE') {
            return CONFIG.GEMINI_API_KEY;
        }
        return null;
    },

    /**
     * Get model name from config
     */
    getModelName() {
        return (typeof CONFIG !== 'undefined' && CONFIG.GEMINI_MODEL)
            ? CONFIG.GEMINI_MODEL
            : 'gemini-2.5-flash';
    },

    /**
     * Initialize or get the Gemini client
     */
    getClient(apiKey) {
        if (!this.client || this.currentApiKey !== apiKey) {
            this.client = new GoogleGenerativeAI(apiKey);
            this.currentApiKey = apiKey;
            this.model = null;
        }
        return this.client;
    },

    /**
     * Get the generative model
     */
    getModel(apiKey) {
        const client = this.getClient(apiKey);
        if (!this.model) {
            this.model = client.getGenerativeModel({
                model: this.getModelName(),
                generationConfig: {
                    temperature: 0.3,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json',
                },
            });
        }
        return this.model;
    },

    // System prompt for grading
    systemPrompt: `You are an AP Human Geography tutor. Grade the student's response and return JSON.

RUBRIC (10 points total):
- claim (2 pts): Clear thesis answering the question
- evidence (3 pts): Specific examples/data supporting the claim
- reasoning (3 pts): Explains HOW/WHY evidence supports claim
- terms (2 pts): Uses AP Human Geography vocabulary

Return this JSON structure:
{"totalScore":7,"breakdown":{"claim":{"score":2,"max":2,"comment":"..."},"evidence":{"score":2,"max":3,"comment":"..."},"reasoning":{"score":2,"max":3,"comment":"..."},"terms":{"score":1,"max":2,"comment":"..."}},"strengths":["strength1","strength2"],"improvements":[{"title":"...","tip":"...","example":"..."}],"encouragement":"..."}

Keep comments brief (under 15 words). Include 2 strengths and 2-3 improvements.`,

    /**
     * Grade a student response using Gemini API
     * @param {string} apiKey - User's Gemini API key
     * @param {string} question - The question text
     * @param {string} response - Student's response text
     * @param {string|null} imageBase64 - Optional base64-encoded image data
     * @param {string|null} imageMimeType - MIME type of the image (e.g., 'image/jpeg')
     * @returns {Promise<Object>} - Grading result object
     */
    async gradeResponse(apiKey, question, response, imageBase64 = null, imageMimeType = null) {
        const userPrompt = `
QUESTION:
${question}
${imageBase64 ? '\n[An image (map, chart, or data table) is attached that the student should reference in their response.]' : ''}

STUDENT RESPONSE:
${response}

Grade this response according to the rubric and provide feedback in the exact JSON format specified.`;

        const fullPrompt = this.systemPrompt + '\n\n' + userPrompt;

        try {
            const model = this.getModel(apiKey);

            // Build content parts
            const parts = [];

            // Add text prompt
            parts.push({ text: fullPrompt });

            // Add image if provided
            if (imageBase64 && imageMimeType) {
                parts.push({
                    inlineData: {
                        mimeType: imageMimeType,
                        data: imageBase64
                    }
                });
            }

            // Generate content
            const result = await model.generateContent(parts);
            const textResponse = result.response.text();

            if (!textResponse) {
                throw new Error('No response received from Gemini. Please try again.');
            }

            // Parse the JSON response
            let cleanedResponse = textResponse.trim();
            if (cleanedResponse.startsWith('```json')) {
                cleanedResponse = cleanedResponse.slice(7);
            } else if (cleanedResponse.startsWith('```')) {
                cleanedResponse = cleanedResponse.slice(3);
            }
            if (cleanedResponse.endsWith('```')) {
                cleanedResponse = cleanedResponse.slice(0, -3);
            }
            cleanedResponse = cleanedResponse.trim();

            try {
                const parsed = JSON.parse(cleanedResponse);
                return this.validateAndNormalizeResult(parsed);
            } catch (parseError) {
                console.error('Failed to parse Gemini response:', cleanedResponse);
                throw new Error('Failed to parse grading response. Please try again.');
            }

        } catch (error) {
            console.error('Gemini API error:', error);

            // Handle specific error types
            if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
                throw new Error('Invalid API key. Please check your key in config.js');
            }
            if (error.message?.includes('RATE_LIMIT') || error.message?.includes('429')) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            }
            if (error.message?.includes('PERMISSION_DENIED')) {
                throw new Error('API key does not have permission. Check your Gemini API key.');
            }
            if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
                throw new Error('Network error. Please check your internet connection.');
            }

            throw new Error(error.message || 'Something went wrong. Please try again.');
        }
    },

    /**
     * Validate and normalize the grading result
     */
    validateAndNormalizeResult(result) {
        const normalized = {
            totalScore: Math.min(10, Math.max(0, result.totalScore || 0)),
            maxScore: 10,
            breakdown: {
                claim: {
                    score: Math.min(2, Math.max(0, result.breakdown?.claim?.score || 0)),
                    max: 2,
                    comment: result.breakdown?.claim?.comment || 'No comment provided'
                },
                evidence: {
                    score: Math.min(3, Math.max(0, result.breakdown?.evidence?.score || 0)),
                    max: 3,
                    comment: result.breakdown?.evidence?.comment || 'No comment provided'
                },
                reasoning: {
                    score: Math.min(3, Math.max(0, result.breakdown?.reasoning?.score || 0)),
                    max: 3,
                    comment: result.breakdown?.reasoning?.comment || 'No comment provided'
                },
                terms: {
                    score: Math.min(2, Math.max(0, result.breakdown?.terms?.score || 0)),
                    max: 2,
                    comment: result.breakdown?.terms?.comment || 'No comment provided'
                }
            },
            strengths: Array.isArray(result.strengths) ? result.strengths : ['Good effort on your response'],
            improvements: Array.isArray(result.improvements) ? result.improvements.map(imp => ({
                title: imp.title || 'Improvement Area',
                tip: imp.tip || 'Keep practicing',
                example: imp.example || ''
            })) : [],
            encouragement: result.encouragement || 'Keep practicing! Every attempt helps you improve.'
        };

        // Recalculate total score from breakdown
        const calculatedTotal =
            normalized.breakdown.claim.score +
            normalized.breakdown.evidence.score +
            normalized.breakdown.reasoning.score +
            normalized.breakdown.terms.score;

        normalized.totalScore = calculatedTotal;

        return normalized;
    },

    /**
     * Test if an API key is valid
     */
    async testApiKey(apiKey) {
        try {
            const client = new GoogleGenerativeAI(apiKey);
            const model = client.getGenerativeModel({ model: this.getModelName() });
            const result = await model.generateContent('Say "ok"');
            return !!result.response.text();
        } catch (error) {
            console.error('API key test failed:', error);
            return false;
        }
    }
};

// Export for use in app.js
window.GeminiAPI = GeminiAPI;
export default GeminiAPI;
