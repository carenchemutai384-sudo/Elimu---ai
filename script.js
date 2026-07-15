const askBtn = document.getElementById("askBtn");
const questionInput = document.getElementById("question");
const apiKeyInput = document.getElementById("apiKey");
const answerBox = document.getElementById("answer");

askBtn.addEventListener("click", askAI);

async function askAI() {

    const question = questionInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (apiKey === "") {
        alert("Please paste your Gemini API key.");
        return;
    }

    if (question === "") {
        alert("Please enter a question.");
        return;
    }

    answerBox.innerHTML = `
        <p><strong>Thinking...</strong></p>
    `;

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
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
${question}`
                                }
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
            return;
        }

        const answer =
            data.candidates[0].content.parts[0].text;

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
                ${answer}
            </div>
        `;

    } catch (error) {

        answerBox.innerHTML =
            "<p style='color:red;'>Something went wrong. Check your internet connection or API key.</p>";

        console.error(error);

    }

}
