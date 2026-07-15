const askBtn = document.getElementById("askBtn");
const quizBtn = document.getElementById("quizBtn");
const notesBtn = document.getElementById("notesBtn");
const dailyBtn = document.getElementById("dailyBtn");

const questionInput = document.getElementById("question");
const apiKeyInput = document.getElementById("apiKey");
const answerBox = document.getElementById("answer");

askBtn.addEventListener("click", askAI);

if (quizBtn) {
    quizBtn.addEventListener("click", generateQuiz);
}

if (notesBtn) {
    notesBtn.addEventListener("click", generateNotes);
}

if (dailyBtn) {
    dailyBtn.addEventListener("click", dailyChallenge);
}

function getApiKey() {
    return apiKeyInput.value.trim();
}

async function callGemini(prompt, loadingMessage) {

    const apiKey = getApiKey();

    if (apiKey === "") {
        alert("Please paste your Gemini API key.");
        return null;
    }

    answerBox.innerHTML = `<p><strong>${loadingMessage}</strong></p>`;

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            answerBox.innerHTML =
                "<p style='color:red;'><strong>Error:</strong> " +
                data.error.message +
                "</p>";
            return null;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {

        answerBox.innerHTML =
            "<p style='color:red;'>Something went wrong. Check your internet connection or API key.</p>";

        console.error(error);
        return null;

    }

}

function showResult(text) {
    answerBox.innerHTML = `
        <div style="
            margin-top:20px;
            padding:20px;
            background:white;
            border-radius:10px;
            box-shadow:0 2px 10px rgba(0,0,0,.1);
            white-space:pre-wrap;
            line-height:1.7;
        ">
            ${text}
        </div>
    `;
}

async function askAI() {

    const question = questionInput.value.trim();

    if (question === "") {
        alert("Please enter a question.");
        return;
    }

    const prompt =
`You are Elimu AI, an AI tutor for Kenyan KCSE students.

Always answer using this format:

📘 Topic

Simple Explanation

Key Points
• Bullet 1
• Bullet 2
• Bullet 3

Worked Example

Practice Question

KCSE Tip

Student's Question:
${question}`;

    const answer = await callGemini(prompt, "Thinking...");
    if (answer) showResult(answer);

}

async function generateQuiz() {

    const question = questionInput.value.trim();

    if (question === "") {
        alert("Type a topic in the question box first (e.g. 'Photosynthesis' or 'Quadratic equations'), then tap Generate Quiz.");
        return;
    }

    const prompt =
`You are Mwalimu AI, a KCSE quiz generator.

Create a 5-question multiple choice quiz on this topic: "${question}"

Format each question exactly like this:

1. [Question text]
   A) [option]
   B) [option]
   C) [option]
   D) [option]
   ✅ Correct answer: [letter]
   💡 Why: [one short sentence explaining the correct answer]

Make the questions KCSE exam-style, and make the wrong answer options genuinely plausible, not obviously wrong.`;

    const quiz = await callGemini(prompt, "Generating quiz...");
    if (quiz) showResult(quiz);

}

async function generateNotes() {

    const question = questionInput.value.trim();

    if (question === "") {
        alert("Type a topic in the question box first (e.g. 'The French Revolution' or 'Cell division'), then tap Revision Notes.");
        return;
    }

    const prompt =
`You are Mwalimu AI, helping a KCSE student revise quickly before an exam.

Create concise revision notes on this topic: "${question}"

Format like this:

📝 Revision Notes: [Topic]

Quick Summary
(2-3 sentences max)

Must-Know Facts
• Fact 1
• Fact 2
• Fact 3
• Fact 4
• Fact 5

Common Exam Mistakes
(1-2 sentences on what students usually get wrong)

Keep it short and scannable — this is for last-minute revision, not a full lesson.`;

    const notes = await callGemini(prompt, "Generating notes...");
    if (notes) showResult(notes);

}

async function dailyChallenge() {

    const subjects = [
        "Biology", "Chemistry", "Mathematics", "Computer Studies",
        "English", "Kiswahili", "Physics", "Geography",
        "History", "CRE", "Agriculture", "Business Studies"
    ];

    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];

    const prompt =
`You are Mwalimu AI, setting today's KCSE Daily Challenge question.

Subject: ${randomSubject}

Create ONE challenging KCSE-style question on this subject (any topic within it), formatted like this:

🔥 Daily Challenge — ${randomSubject}

Question:
[question text]

Take a moment to think, then check the answer below.

Answer:
[correct answer]

Explanation:
[1-2 sentence explanation]

Make it genuinely challenging — the kind of question that separates a B student from an A student.`;

    const challenge = await callGemini(prompt, "Loading today's challenge...");
    if (challenge) showResult(challenge);

}
