# AP Human Geography Skill Reflection Practice Platform - Project Plan

## Project Overview

A student-focused web platform where you can practice writing AP Human Geography skill reflections and get instant, personalized feedback. Write responses to practice questions, submit them, and receive an immediate score (out of 10) plus specific tips on how to improve your writing. Think of it as having a personal AP Human Geography tutor available 24/7 to help you master skill reflections before the exam.

### Why This Helps Students

**The Problem:**
- You want to practice skill reflections but have to wait days for teacher feedback
- You're not sure if you're using the right geographic terminology
- The rubric is confusing and you don't know what graders actually want
- You feel nervous about the AP exam because you haven't practiced enough
- You want to improve but don't know specifically what to work on

**The Solution:**
- **Practice Anytime, Anywhere**: Study at midnight, before school, on the bus - whenever works for you
- **Instant Feedback**: Get your score and improvement tips in under 30 seconds (not days!)
- **Learn at Your Own Pace**: Practice 1 question or 10 questions - whatever you need
- **Build Real Confidence**: Watch your scores improve with each attempt
- **Understand the Rubric**: Learn exactly what graders look for with clear examples
- **Zero Pressure Practice**: Make mistakes freely and learn from them - nothing goes to your teacher unless you want it to
- **Personalized Learning**: Get feedback specific to YOUR writing, not generic tips

## Who This Is For

**Perfect for:**
- AP Human Geography students preparing for the exam
- Students who want extra practice outside of class
- Visual and independent learners who like self-paced study
- Anyone who feels confused about what makes a "good" skill reflection
- Students who want to improve their scores but don't know how

**How to Use It:**
1. **Quick Practice Session** (10-15 mins): Pick a question, write a response, get feedback
2. **Deep Practice** (30+ mins): Write multiple responses, compare scores, focus on weak areas
3. **Pre-Test Prep**: Practice the night before a quiz or unit test
4. **Ongoing Study**: Use weekly to build skills throughout the school year
5. **Exam Cramming**: Rapid-fire practice in the weeks before the AP exam

## Core Features (Student Experience)

### 1. Choose Your Question
**Pick from a library or bring your own**
- **Question Library**: Browse pre-made AP Human Geography prompts
  - Filter by unit (Population, Migration, Agriculture, etc.)
  - Filter by skill type (analyzing data, explaining concepts, comparing patterns)
  - Choose difficulty level that matches your current skill
- **Custom Questions**: Paste in your own prompts
  - Practice with questions from your teacher
  - Add your own study questions
  - Include images (maps, charts, data tables) for visual questions

### 2. Write Your Response
**Clean, distraction-free writing space**
- **Main Text Area**: Large, easy-to-read writing space
  - See your word count in real-time
  - Your work auto-saves to your browser so you never lose progress
  - Focus on writing without distractions
- **Flexible Practice**:
  - No account required - just open and start practicing
  - Optional timer to simulate exam conditions
  - Upload or paste images for questions that include visuals

### 3. Get Your Score & Feedback
**Instant results that help you improve**
- **Your Score**: Clear X/10 score based on official AP rubric
  - See how you did on each part:
    - **Claim/Thesis** (2 pts): Is your main point clear?
    - **Evidence** (3 pts): Did you use good examples?
    - **Reasoning** (3 pts): Did you explain your thinking?
    - **Geographic Terms** (2 pts): Did you use proper vocabulary?
- **Personalized Feedback**:
  - What you did well (celebrate your strengths!)
  - Specific areas to improve
  - Concrete suggestions you can use right now
  - Examples of how to make your response better

### 4. Track Your Progress
**See yourself improve over time**
- **Visual Results**: Easy-to-read score display with progress bars
- **Detailed Breakdown**: Understand exactly where you gained or lost points
- **Next Steps**: Clear guidance on what to practice next
- **Local History**: Your browser saves your recent practice sessions
- **Quick Actions**:
  - Review your response alongside the feedback
  - Try another question to keep practicing

## Technical Architecture (No Backend Server)

### Frontend-Only Architecture
This is a **static website** that runs entirely in the browser - no backend server required!

- **Framework**: HTML, CSS, and JavaScript (or React/Vue if preferred)
  - Single-page application
  - Responsive design for mobile/tablet/desktop
  - Clean, distraction-free interface
  - Works offline for writing (AI grading needs internet)

### AI Integration - Google Gemini (Free Tier)
**Why Gemini Free Plan:**
- **Free**: Up to 1,000 requests per day at no cost
- **Fast**: Low latency responses
- **Multimodal**: Supports text AND images (maps, charts, data tables)
- **Generous Limits**: 250,000 tokens per minute, 15 requests per minute

**Gemini Free Tier Specs:**
- Models: Gemini 1.5 Flash, Gemini 2.5 Flash, or newer
- Rate limits: 5-15 requests per minute (depending on model)
- Daily limit: ~1,000 requests per day
- Image support: Yes! Images count as ~258-1290 tokens each
- Max file size: 100 MB per file

**API Key Handling Options:**
1. **User provides their own API key** (recommended for privacy)
   - User gets a free Gemini API key from Google AI Studio
   - Key is stored locally in their browser (localStorage)
   - Key never leaves their device
2. **Environment variable at build time** (for demo/class use)
   - API key embedded during deployment
   - Good for teacher-hosted instances

### Data Storage (Browser-Based)
**No database needed!** Everything is stored locally:

- **localStorage**:
  - User's API key (encrypted)
  - Recent practice history
  - Saved responses
  - Preferences (theme, timer settings)
- **Question Bank**:
  - JSON file bundled with the app
  - Can be updated by editing the JSON file
  - No server calls needed

### Hosting (Free Options)
Since there's no backend, hosting is simple and free:
- **GitHub Pages**: Free, automatic deployment from repo
- **Netlify**: Free tier, drag-and-drop deployment
- **Vercel**: Free tier, great for React apps
- **Cloudflare Pages**: Free, fast global CDN

## Student Interface Design

### Main Practice Page (What Students See)

```
+----------------------------------------------------------+
|            AP Human Geo Skill Reflection Practice         |
+----------------------------------------------------------+
|                                                           |
|  Choose a question:  [Question Library v] [Paste Your Own]|
|                                                           |
|  +-----------------------------------------------------+  |
|  |                                                     |  |
|  |  YOUR QUESTION:                                    |  |
|  |                                                     |  |
|  |  Explain how urbanization has affected migration   |  |
|  |  patterns in developing countries. Use specific    |  |
|  |  examples in your response.                        |  |
|  |                                                     |  |
|  |  [+ Add Image (map, chart, etc.)]                  |  |
|  |                                                     |  |
|  +-----------------------------------------------------+  |
|                                                           |
|  Write your skill reflection below:                       |
|  +-----------------------------------------------------+  |
|  |                                                     |  |
|  |  Urbanization in developing countries has led to   |  |
|  |  increased rural-to-urban migration because...     |  |
|  |                                                     |  |
|  |  [Student types their response here]               |  |
|  |                                                     |  |
|  |                                                     |  |
|  +-----------------------------------------------------+  |
|  Words: 127                       Auto-saved locally      |
|                                                           |
|  [     Get My Score & Feedback     ]                     |
|                                                           |
+----------------------------------------------------------+
```

### Results Page (Your Feedback)

```
+----------------------------------------------------------+
|                  Your Results                             |
+----------------------------------------------------------+
|                                                           |
|                  You Scored: 7/10                        |
|                  ████████████░░░░░░   Nice work!         |
|                                                           |
|  How You Did on Each Part:                                |
|  ✓ Claim/Thesis: 2/2         Perfect! Clear claim        |
|  ○ Evidence: 2/3             Room to improve             |
|  ○ Reasoning: 2/3            Getting there               |
|  ○ Geographic Terms: 1/2     Could be stronger           |
|                                                           |
|  What You Did Well:                                       |
|  - Your thesis clearly answered the question              |
|  - Good attempt at connecting ideas                       |
|                                                           |
|  How to Improve (Start Here!):                            |
|                                                           |
|  1. Add More Specific Evidence                            |
|     What to do: Include actual data, statistics, or      |
|     specific city names instead of general statements    |
|                                                           |
|     Example: Instead of "many people moved to cities,"   |
|     try "In Mexico City, the population grew from 3M to  |
|     21M between 1950-2000 due to rural-urban migration"  |
|                                                           |
|  2. Use Precise Geographic Vocabulary                     |
|     What to do: Replace everyday words with AP terms     |
|                                                           |
|     Example: Use "rural-to-urban migration" instead of   |
|     "people moving to cities" and "urbanization" instead |
|     of "city growth"                                      |
|                                                           |
|  3. Explain Your Thinking More                            |
|     What to do: Don't just state facts - explain WHY     |
|     and HOW they connect to your claim                   |
|                                                           |
|     Example: After mentioning an example, add "This      |
|     demonstrates urbanization's impact because..."       |
|                                                           |
|  [See My Response] [Practice Another Question]           |
|                                                           |
+----------------------------------------------------------+
```

## Implementation Phases

### Phase 1: Core Practice Experience (MVP)
**What Students Get:**
- Simple, clean interface to write responses
- Paste in any practice question
- Optional: Upload an image with the question
- Submit and get instant score (X/10)
- Receive specific improvement tips
- Works on any device

**Technical Build:**
- [ ] Set up project structure (HTML/CSS/JS or React)
- [ ] Build question input area with image upload support
- [ ] Build response text area with word count
- [ ] Integrate Gemini API for grading
- [ ] Display score and feedback
- [ ] Add API key setup flow (user enters their own key)
- [ ] Deploy to GitHub Pages or Netlify

### Phase 2: Question Library & Better Feedback
**What Students Get:**
- Browse 20-30 ready-made practice questions
- Filter questions by unit and skill type
- See score breakdown for each rubric part
- More detailed, helpful feedback
- Examples showing how to improve

**Technical Build:**
- [ ] Create questions.json with practice questions
- [ ] Build question browser/selector UI
- [ ] Add filtering by unit and skill type
- [ ] Enhanced rubric-based grading prompt
- [ ] Score breakdown visualization
- [ ] Improved feedback display with examples

### Phase 3: Better UX & Local Storage
**What Students Get:**
- Auto-save (never lose your work!)
- Practice history saved in browser
- Visual score display with progress bars
- Dark mode option
- Works perfectly on phones

**Technical Build:**
- [ ] Implement localStorage for saving work
- [ ] Add practice history view
- [ ] Visual score presentation (charts/progress bars)
- [ ] Mobile responsive improvements
- [ ] Dark mode toggle
- [ ] Loading states and animations

### Phase 4: Advanced Features
**What Students Get:**
- Timer mode for exam simulation
- Compare your response to example answers
- Export/print your results
- Streak tracking for motivation

**Technical Build:**
- [ ] Add optional timer feature
- [ ] Sample high-scoring response library
- [ ] Export to PDF/print functionality
- [ ] Practice streak counter
- [ ] Achievement badges (stored locally)

## How You're Graded (The Rubric Explained)

### Total Score: 10 Points

Every skill reflection is scored on four parts. Here's what graders look for:

#### 1. Claim/Thesis (2 points)
**What it is:** Your main answer to the question

**How to get full points:**
- Make your answer clear and specific (not vague)
- Directly answer the question being asked
- Take a position you can support with evidence
- Usually this is your first sentence

**Example:**
- Good: "Urbanization increases rural-to-urban migration because cities offer better economic opportunities"
- Weak: "Urbanization affects migration in many ways"

#### 2. Evidence (3 points)
**What it is:** Examples, data, or facts that support your claim

**How to get full points:**
- Use specific examples (names of places, actual numbers, real events)
- Make sure your examples actually relate to your claim
- Include enough evidence to prove your point (usually 2-3 examples)

**Example:**
- Good: "Mexico City grew from 3 million to 21 million people between 1950-2000"
- Weak: "Many cities got bigger"

#### 3. Reasoning (3 points)
**What it is:** Explaining HOW and WHY your evidence supports your claim

**How to get full points:**
- Don't just list facts - explain what they mean
- Connect your evidence back to your claim
- Show your thinking process
- Use words like "because," "therefore," "this shows that"

**Example:**
- Good: "This rapid growth occurred because rural farmers migrated to cities seeking factory jobs, demonstrating how urbanization creates economic pull factors"
- Weak: "This shows urbanization affects migration"

#### 4. Geographic Terminology (2 points)
**What it is:** Using proper AP Human Geography vocabulary

**How to get full points:**
- Use official AP terms instead of everyday words
- Use terms correctly in context
- Show you understand what the terms mean

**Common Terms to Use:**
- Instead of "people moving": use "migration," "rural-to-urban migration"
- Instead of "city growth": use "urbanization," "urban sprawl"
- Instead of "reasons to move": use "push factors," "pull factors"
- Instead of "cities": use "urban areas," "metropolitan areas," "megacities"

## AI Grading with Gemini

### Gemini API Setup

**Getting Your Free API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key
5. Copy the key and paste it into the app when prompted

**API Call Structure:**
```javascript
const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [
        { text: systemPrompt + questionText + studentResponse },
        // Optional: include image if question has one
        { inline_data: { mime_type: "image/jpeg", data: base64ImageData }}
      ]
    }]
  })
});
```

### System Prompt Template
```
You are a supportive AP Human Geography tutor helping a student improve their skill reflection writing.
Grade this response and provide encouraging, specific feedback.

Question: [QUESTION_TEXT]
[If image attached: "The image shows a map/chart/data table that the student should reference."]

Rubric:
- Claim/Thesis (2 pts): Clear, specific claim that directly answers the question
- Evidence (3 pts): Specific examples, data, or facts that support the claim
- Reasoning (3 pts): Explanation of HOW and WHY evidence supports the claim
- Geographic Terms (2 pts): Correct use of AP Human Geography vocabulary

Student Response:
[STUDENT_RESPONSE]

Provide feedback in this exact JSON format:
{
  "totalScore": 7,
  "maxScore": 10,
  "breakdown": {
    "claim": { "score": 2, "max": 2, "comment": "Clear thesis statement" },
    "evidence": { "score": 2, "max": 3, "comment": "Good examples but could be more specific" },
    "reasoning": { "score": 2, "max": 3, "comment": "Connections could be stronger" },
    "terms": { "score": 1, "max": 2, "comment": "Limited geographic vocabulary" }
  },
  "strengths": ["Your thesis clearly answered the question", "Good attempt at connecting ideas"],
  "improvements": [
    {
      "title": "Add More Specific Evidence",
      "tip": "Include actual data, statistics, or specific city names",
      "example": "Instead of 'many people moved to cities,' try 'Mexico City grew from 3M to 21M between 1950-2000'"
    }
  ],
  "encouragement": "Nice work! Focus on adding more specific examples and you'll see your score improve."
}
```

## File Structure

```
she-reflect-on-my-skill/
├── index.html              # Main HTML file
├── styles.css              # All styling
├── app.js                  # Main application logic
├── gemini.js               # Gemini API integration
├── questions.json          # Question bank
├── README.md               # Setup instructions
└── assets/
    └── images/             # Any static images
```

## Your Privacy (What Happens to Your Data)

### 100% Local - Your Data Stays With You
Since there's no backend server:
- **Everything stays in your browser** - nothing is sent to any server (except the AI API)
- **Your API key stays local** - stored only in your browser's localStorage
- **Your responses stay local** - saved in your browser, not uploaded anywhere
- **Clear anytime** - just clear your browser data to erase everything

### What Goes to Gemini API
When you click "Get My Score":
- Your question text is sent to Google's Gemini API
- Your response text is sent to Google's Gemini API
- Any attached images are sent to Google's Gemini API
- Gemini returns the score and feedback

**Google's AI Studio Terms:**
- Free tier data may be used to improve Google's models (unless you use a paid plan)
- Don't include personal information in your practice responses
- See [Google's AI Studio Terms](https://ai.google.dev/terms) for full details

## Getting Started (For Developers)

### Prerequisites
- A code editor (VS Code recommended)
- A web browser
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Setup Steps
1. Clone or download this repository
2. Open `index.html` in your browser
3. Enter your Gemini API key when prompted
4. Start practicing!

### Deployment
**GitHub Pages:**
1. Push code to a GitHub repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" > main
4. Your site will be live at `https://username.github.io/repo-name`

**Netlify (Drag & Drop):**
1. Go to [netlify.com](https://netlify.com)
2. Drag your project folder onto the page
3. Done! You'll get a free URL

---

*This plan is a living document and should be updated as the project evolves.*
