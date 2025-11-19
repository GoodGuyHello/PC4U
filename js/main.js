document.getElementById("show-budget-btn").addEventListener("click", () => {
    document.getElementById("intro-wrapper").style.display = "none";

    const questionnaire = document.getElementById("questionnaire");
    questionnaire.classList.add("show-questionnaire");

    showStep(1);
});
