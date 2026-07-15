const askBtn = document.getElementById("askBtn");
const quizBtn = document.getElementById("quizBtn");
const notesBtn = document.getElementById("notesBtn");
const dailyBtn = document.getElementById("dailyBtn");
const themeToggle = document.getElementById("themeToggle");
const subjectSelect = document.getElementById("subjectSelect");

const questionInput = document.getElementById("question");
const apiKeyInput = document.getElementById("apiKey");
const chatLog = document.getElementById("chatLog");

const allActionButtons = [askBtn, quizBtn, notesBtn, dailyBtn].filter(Boolean);

askBtn.addEventListener("click", handleAskAI);

if (quizBtn) {
    quizBtn.addEventListener("click", handleGenerateQuiz);
}

if (notesBtn) {
    notesBtn.addEventListener("click", handleGenerateNotes);
}

if (dailyBtn) {
    dailyBtn.addEventListener("click", handleDailyChallenge);
}

if (questionInput) {
    questionInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAskAI();
        }
    });

    questionInput.addEventListener("input", function () {
        questionInput.style.height = "auto";
        questionInput.style.height = questionInput.scrollHeight + "px";
    });
}

function applyStoredTheme() {
    const savedTheme = localStorage.getItem("mwalimu-theme");
    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
    } else {
        document.documentElement.removeAttribute("data-theme");
        themeToggle.textContent = "🌙";
    }
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("mwalimu-theme", "light");
        themeToggle.textContent = "🌙";
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("mwalimu-theme", "dark");
        themeToggle.textContent = "☀️";
    }
}

if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
    applyStoredTheme();
}

function getSubjectContext() {
    const subject = subjectSelect ? subjectSelect.value : "";
    if (subject === "") {
        return "You are Elimu AI, an AI tutor for Kenyan KCSE students.";
    }
    return `You are an expert KCSE ${subject} teacher. Answer according to the Kenyan curriculum, using clear, exam-focused language appropriate for a KCSE student studying ${subject}.`;
}

function scrollChatToBottom() {
    chatLog.scrollTop = chatLog.scrollHeight;
}

function appendUserMessage(text) {
    const bubble = document.createElement("div");
    bubble.className = "message user";
    bubble.textContent = text;
    chatLog.appendChild(bubble);
    scrollChatToBottom();
}

function appendAIMessage(text) {
    const bubble = document.createElement("div");
    bubble.className = "message ai";
    bubble.textContent = text;
    chatLog.appendChild(bubble);
    scrollChatToBottom();
}

function appendTypingIndicator() {
    const bubble = document.createElement("div");
    bubble.className = "message typing";
    bubble.innerHTML = `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
    chatLog.appendChild(bubble);
    scrollChatToBottom();
    return bubble;
}

function removeTypingIndicator(indicatorEl) {
    if (indicatorEl && indicatorEl.parentNode) {
        indicatorEl.parentNode.removeChild(indicatorEl);
    }
}

function setButtonsDisabled(disabled) {
    allActionButtons.forEach((btn) => {
        if (!btn.hasAttribute("data-permanently-disabled")) {
            btn.disabled = disabled;
        }
    });
}

function getApiKey() {
    return apiKeyInput.value.trim();
}

async function callGemini(prompt) {

    const apiKey = getApiKey();

    if (apiKey === "") {
        alert("Please paste your Gemini API key.");
        return null;
    }

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
            return "⚠️ Error: " + data.error.message;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error(error);
        return "⚠️ Something went wrong. Check your internet connection or API key.";
    }

}

async function handleAskAI() {

    const question = questionInput.value.trim();

    if (question === "") {
        return;
    }

    if (getApiKey() === "") {
        alert("Please paste your Gemini API key.");
        return;
    }

    appendUserMessage(question);
    questionInput.value = "";
    questionInput.style.height = "auto";

    setButtonsDisabled(true);
    const typingIndicator = appendTypingIndicator();

    const prompt =
`${getSubjectContext()}

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

    const answer = await callGemini(prompt);

    removeTypingIndicator(typingIndicator);
    setButtonsDisabled(false);

    if (answer) appendAIMessage(answer);

}

async function handleGenerateQuiz() {

    const question = questionInput.value.trim();

    if (question === "") {
        alert("Type a topic in the box first (e.g. 'Photosynthesis' or 'Quadratic equations'), then tap Generate Quiz.");
        return;
    }

    if (getApiKey() === "") {
        alert("Please paste your Gemini API key.");
        return;
    }

    appendUserMessage("⭐ Generate Quiz: " + question);
    questionInput.value = "";
    questionInput.style.height = "auto";

    setButtonsDisabled(true);
    const typingIndicator = appendTypingIndicator();

    const prompt =
`${getSubjectContext()}

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

    const quiz = await callGemini(prompt);

    removeTypingIndicator(typingIndicator);
    setButtonsDisabled(false);

    if (quiz) appendAIMessage(quiz);

}

async function handleGenerateNotes() {

    const question = questionInput.value.trim();

    if (question === "") {
        alert("Type a topic in the box first (e.g. 'The French Revolution' or 'Cell division'), then tap Revision Notes.");
        return;
    }

    if (getApiKey() === "") {
        alert("Please paste your Gemini API key.");
        return;
    }

    appendUserMessage("📄 Revision Notes: " + question);
    questionInput.value = "";
    questionInput.style.height = "auto";

    setButtonsDisabled(true);
    const typingIndicator = appendTypingIndicator();

    const prompt =
`${getSubjectContext()}

You are helping a KCSE student revise quickly before an exam.

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

    const notes = await callGemini(prompt);

    removeTypingIndicator(typingIndicator);
    setButtonsDisabled(false);

    if (notes) appendAIMessage(notes);

}

async function handleDailyChallenge() {

    if (getApiKey() === "") {
        alert("Please paste your Gemini API key.");
        return;
    }

    const subjects = [
        "Biology", "Chemistry", "Mathematics", "Computer Studies",
        "English", "Kiswahili", "Physics", "Geography",
        "History", "CRE", "Agriculture", "Business Studies"
    ];

    const selectedSubject = subjectSelect && subjectSelect.value !== ""
        ? subjectSelect.value
        : subjects[Math.floor(Math.random() * subjects.length)];

    appendUserMessage("🔥 Daily Challenge: " + selectedSubject);

    setButtonsDisabled(true);
    const typingIndicator = appendTypingIndicator();

    const prompt =
`You are Mwalimu AI, setting today's KCSE Daily Challenge question.

Subject: ${selectedSubject}

Create ONE challenging KCSE-style question on this subject (any topic within it), formatted like this:

🔥 Daily Challenge — ${selectedSubject}

Question:
[question text]

Take a moment to think, then check the answer below.

Answer:
[correct answer]

Explanation:
[1-2 sentence explanation]

Make it genuinely challenging — the kind of question that separates a B student from an A student.`;

    const challenge = await callGemini(prompt);

    removeTypingIndicator(typingIndicator);
    setButtonsDisabled(false);

    if (challenge) appendAIMessage(challenge);

}
