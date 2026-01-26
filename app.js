/**
 * GeoReflect - Main Application
 * AP Human Geography Skill Reflection Practice Platform
 */

import GeminiAPI from './gemini.js';

(function () {
    'use strict';

    // ============================================
    // State Management
    // ============================================
    const state = {
        apiKey: null,
        currentImage: null,
        imageMimeType: null,
        isLoading: false,
        lastSaved: null
    };

    // ============================================
    // DOM Elements
    // ============================================
    const elements = {
        // Modal
        apiModal: document.getElementById('apiModal'),
        apiKeyInput: document.getElementById('apiKeyInput'),
        toggleKey: document.getElementById('toggleKey'),
        saveApiKey: document.getElementById('saveApiKey'),

        // Header
        settingsBtn: document.getElementById('settingsBtn'),

        // Practice Panel
        practicePanel: document.getElementById('practicePanel'),
        questionInput: document.getElementById('questionInput'),
        responseInput: document.getElementById('responseInput'),
        wordCount: document.getElementById('wordCount'),
        autoSaveStatus: document.getElementById('autoSaveStatus'),
        submitBtn: document.getElementById('submitBtn'),

        // Image Upload
        imageUploadArea: document.getElementById('imageUploadArea'),
        imageInput: document.getElementById('imageInput'),
        uploadPrompt: document.getElementById('uploadPrompt'),
        imagePreview: document.getElementById('imagePreview'),
        previewImg: document.getElementById('previewImg'),
        removeImage: document.getElementById('removeImage'),

        // Results Panel
        resultsPanel: document.getElementById('resultsPanel'),
        backBtn: document.getElementById('backBtn'),
        scoreRing: document.getElementById('scoreRing'),
        scoreNum: document.getElementById('scoreNum'),
        scoreMessage: document.getElementById('scoreMessage'),
        rubricClaim: document.getElementById('rubricClaim'),
        rubricEvidence: document.getElementById('rubricEvidence'),
        rubricReasoning: document.getElementById('rubricReasoning'),
        rubricTerms: document.getElementById('rubricTerms'),
        strengthsList: document.getElementById('strengthsList'),
        improvementsList: document.getElementById('improvementsList'),
        encouragementText: document.getElementById('encouragementText'),

        // Toast
        errorToast: document.getElementById('errorToast'),
        errorMessage: document.getElementById('errorMessage')
    };

    // ============================================
    // Initialization
    // ============================================
    function init() {
        loadState();
        bindEvents();
        checkApiKey();
        restoreDraft();
    }

    function loadState() {
        // First check for API key in config.js
        const configKey = GeminiAPI.getConfigApiKey();
        if (configKey) {
            state.apiKey = configKey;
            state.keySource = 'config';
            return;
        }

        // Fall back to localStorage
        const savedKey = localStorage.getItem('gemini_api_key');
        if (savedKey) {
            state.apiKey = savedKey;
            state.keySource = 'localStorage';
        }
    }

    function checkApiKey() {
        if (state.apiKey) {
            hideModal();
        } else {
            showModal();
        }
    }

    // ============================================
    // Event Bindings
    // ============================================
    function bindEvents() {
        // Modal events
        elements.toggleKey.addEventListener('click', togglePasswordVisibility);
        elements.saveApiKey.addEventListener('click', saveApiKey);
        elements.apiKeyInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveApiKey();
        });

        // Settings button
        elements.settingsBtn.addEventListener('click', showModal);

        // Text inputs
        elements.responseInput.addEventListener('input', handleResponseInput);
        elements.questionInput.addEventListener('input', saveDraft);

        // Image upload
        elements.uploadPrompt.addEventListener('click', () => elements.imageInput.click());
        elements.imageInput.addEventListener('change', handleImageSelect);
        elements.removeImage.addEventListener('click', removeImage);

        // Drag and drop
        elements.imageUploadArea.addEventListener('dragover', handleDragOver);
        elements.imageUploadArea.addEventListener('dragleave', handleDragLeave);
        elements.imageUploadArea.addEventListener('drop', handleDrop);

        // Submit
        elements.submitBtn.addEventListener('click', submitForGrading);

        // Back button
        elements.backBtn.addEventListener('click', showPracticePanel);
    }

    // ============================================
    // Modal Functions
    // ============================================
    function showModal() {
        // If key is from config, show a different message
        if (state.keySource === 'config') {
            showError('API key is set in config.js. Edit that file to change it.');
            return;
        }
        elements.apiModal.classList.remove('hidden');
        elements.apiKeyInput.focus();
    }

    function hideModal() {
        elements.apiModal.classList.add('hidden');
    }

    function togglePasswordVisibility() {
        const input = elements.apiKeyInput;
        const button = elements.toggleKey;

        if (input.type === 'password') {
            input.type = 'text';
            button.classList.add('showing');
        } else {
            input.type = 'password';
            button.classList.remove('showing');
        }
    }

    async function saveApiKey() {
        const key = elements.apiKeyInput.value.trim();

        if (!key) {
            showError('Please enter your API key');
            return;
        }

        // Show loading state
        elements.saveApiKey.disabled = true;
        elements.saveApiKey.innerHTML = '<span class="spinner"></span> Validating...';

        // Test the API key
        const isValid = await GeminiAPI.testApiKey(key);

        if (isValid) {
            state.apiKey = key;
            localStorage.setItem('gemini_api_key', key);
            hideModal();
        } else {
            showError('Invalid API key. Please check and try again.');
        }

        // Reset button
        elements.saveApiKey.disabled = false;
        elements.saveApiKey.innerHTML = '<span>Start Practicing</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
    }

    // ============================================
    // Text Input Handling
    // ============================================
    function handleResponseInput() {
        updateWordCount();
        saveDraft();
    }

    function updateWordCount() {
        const text = elements.responseInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        elements.wordCount.textContent = words;
    }

    function saveDraft() {
        const draft = {
            question: elements.questionInput.value,
            response: elements.responseInput.value,
            timestamp: Date.now()
        };

        localStorage.setItem('draft', JSON.stringify(draft));

        // Show auto-save indicator
        elements.autoSaveStatus.classList.add('visible');
        clearTimeout(state.autoSaveTimeout);
        state.autoSaveTimeout = setTimeout(() => {
            elements.autoSaveStatus.classList.remove('visible');
        }, 2000);
    }

    function restoreDraft() {
        const saved = localStorage.getItem('draft');
        if (saved) {
            try {
                const draft = JSON.parse(saved);
                elements.questionInput.value = draft.question || '';
                elements.responseInput.value = draft.response || '';
                updateWordCount();
            } catch (e) {
                console.error('Failed to restore draft:', e);
            }
        }
    }

    // ============================================
    // Image Upload Handling
    // ============================================
    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            processImage(file);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        elements.imageUploadArea.classList.add('dragover');
    }

    function handleDragLeave(e) {
        e.preventDefault();
        elements.imageUploadArea.classList.remove('dragover');
    }

    function handleDrop(e) {
        e.preventDefault();
        elements.imageUploadArea.classList.remove('dragover');

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processImage(file);
        } else {
            showError('Please drop an image file');
        }
    }

    function processImage(file) {
        // Validate file size (max 20MB for Gemini)
        if (file.size > 20 * 1024 * 1024) {
            showError('Image too large. Please use an image under 20MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            // Extract base64 data (remove the data:image/xxx;base64, prefix)
            const base64Data = dataUrl.split(',')[1];

            state.currentImage = base64Data;
            state.imageMimeType = file.type;

            // Show preview
            elements.previewImg.src = dataUrl;
            elements.uploadPrompt.hidden = true;
            elements.imagePreview.hidden = false;
        };
        reader.readAsDataURL(file);
    }

    function removeImage() {
        state.currentImage = null;
        state.imageMimeType = null;
        elements.imageInput.value = '';
        elements.previewImg.src = '';
        elements.uploadPrompt.hidden = false;
        elements.imagePreview.hidden = true;
    }

    // ============================================
    // Grading Submission
    // ============================================
    async function submitForGrading() {
        // Validate inputs
        const question = elements.questionInput.value.trim();
        const response = elements.responseInput.value.trim();

        if (!question) {
            showError('Please enter a question first');
            elements.questionInput.focus();
            return;
        }

        if (!response) {
            showError('Please write your response first');
            elements.responseInput.focus();
            return;
        }

        if (response.split(/\s+/).length < 10) {
            showError('Your response seems too short. Try writing at least a few sentences.');
            return;
        }

        if (!state.apiKey) {
            showModal();
            return;
        }

        // Show loading state
        setLoading(true);

        try {
            const result = await GeminiAPI.gradeResponse(
                state.apiKey,
                question,
                response,
                state.currentImage,
                state.imageMimeType
            );

            displayResults(result);
        } catch (error) {
            console.error('Grading error:', error);
            showError(error.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    }

    function setLoading(loading) {
        state.isLoading = loading;
        elements.submitBtn.classList.toggle('loading', loading);
        elements.submitBtn.disabled = loading;
    }

    // ============================================
    // Results Display
    // ============================================
    function displayResults(result) {
        // Hide practice panel, show results
        elements.practicePanel.hidden = true;
        elements.resultsPanel.hidden = false;

        // Reset loading state
        setLoading(false);

        // Animate score ring
        const percentage = result.totalScore / 10;
        const circumference = 2 * Math.PI * 54; // r=54 from SVG
        const offset = circumference * (1 - percentage);

        // Reset animation
        elements.scoreRing.style.strokeDashoffset = circumference;

        // Trigger reflow
        void elements.scoreRing.offsetWidth;

        // Animate to final value
        setTimeout(() => {
            elements.scoreRing.style.strokeDashoffset = offset;
        }, 100);

        // Animate score number
        animateNumber(elements.scoreNum, 0, result.totalScore, 1000);

        // Set score message
        elements.scoreMessage.textContent = getScoreMessage(result.totalScore);

        // Update rubric breakdown
        updateRubricItem('rubricClaim', result.breakdown.claim);
        updateRubricItem('rubricEvidence', result.breakdown.evidence);
        updateRubricItem('rubricReasoning', result.breakdown.reasoning);
        updateRubricItem('rubricTerms', result.breakdown.terms);

        // Display strengths
        elements.strengthsList.innerHTML = result.strengths
            .map(s => `<li>${escapeHtml(s)}</li>`)
            .join('');

        // Display improvements
        elements.improvementsList.innerHTML = result.improvements
            .map(imp => `
                <div class="improvement-card">
                    <h4>${escapeHtml(imp.title)}</h4>
                    <p class="tip">${escapeHtml(imp.tip)}</p>
                    ${imp.example ? `<div class="example">${escapeHtml(imp.example)}</div>` : ''}
                </div>
            `)
            .join('');

        // Display encouragement
        elements.encouragementText.textContent = result.encouragement;

        // Save to history
        saveToHistory(result);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateRubricItem(elementId, data) {
        const element = document.getElementById(elementId);
        const earnedEl = element.querySelector('.rubric-earned');
        const fillEl = element.querySelector('.rubric-fill');
        const commentEl = element.querySelector('.rubric-comment');

        earnedEl.textContent = data.score;
        commentEl.textContent = data.comment;

        // Animate fill bar
        setTimeout(() => {
            fillEl.style.width = `${(data.score / data.max) * 100}%`;
        }, 200);
    }

    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (end - start) * eased);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    function getScoreMessage(score) {
        if (score >= 9) return 'Outstanding! 🌟';
        if (score >= 7) return 'Great work! Keep it up!';
        if (score >= 5) return 'Good effort! Room to grow.';
        if (score >= 3) return 'Keep practicing!';
        return 'Every attempt helps you learn!';
    }

    // ============================================
    // Panel Navigation
    // ============================================
    function showPracticePanel() {
        elements.resultsPanel.hidden = true;
        elements.practicePanel.hidden = false;

        // Reset rubric fills for next time
        document.querySelectorAll('.rubric-fill').forEach(el => {
            el.style.width = '0%';
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============================================
    // History Management
    // ============================================
    function saveToHistory(result) {
        const history = JSON.parse(localStorage.getItem('practice_history') || '[]');

        const entry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            question: elements.questionInput.value,
            response: elements.responseInput.value,
            result: result
        };

        history.unshift(entry);

        // Keep only last 50 entries
        if (history.length > 50) {
            history.pop();
        }

        localStorage.setItem('practice_history', JSON.stringify(history));
    }

    // ============================================
    // Error Handling
    // ============================================
    function showError(message) {
        elements.errorMessage.textContent = message;
        elements.errorToast.classList.add('visible', 'error');

        clearTimeout(state.errorTimeout);
        state.errorTimeout = setTimeout(() => {
            elements.errorToast.classList.remove('visible', 'error');
        }, 4000);
    }

    // ============================================
    // Utility Functions
    // ============================================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // Start the App
    // ============================================
    document.addEventListener('DOMContentLoaded', init);

})();
