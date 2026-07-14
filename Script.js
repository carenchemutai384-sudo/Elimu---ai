document.getElementById("askBtn").addEventListener("click", function () {

    const question = document.getElementById("question").value;

    if (question.trim() === "") {
        alert("Please enter a KCSE question.");
        return;
    }

    alert("Coming soon!\n\nAI will answer:\n\n" + question);

});
