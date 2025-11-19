let currentStep = 0;
const steps = document.querySelectorAll(".q-step");
const questionnaire = document.getElementById("questionnaire");
steps.forEach(s => s.classList.add("hideOption"));
function showStep(step) {

    steps.forEach(s => {
        s.classList.remove("showOption");
        s.classList.add("hideOption");
    });

    const active = document.querySelector(`.q-step[data-step="${step}"]`);
    if (!active) return;

    active.classList.remove("hideOption");
    active.classList.add("showOption");

    currentStep = step;
}

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("next-step")) {
        showStep(currentStep + 1);
    }

    if (e.target.classList.contains("back-step")) {
        showStep(currentStep - 1);
    }

    if (e.target.classList.contains("finish-step")) {
        const budget = document.getElementById("budget-slider")?.value;

        if (!b || b < 50) {
            alert("Please enter at least $50.");
            return;
        }

        alert("Completed.");
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("q-btn")) return;

    const parent = e.target.closest(".q-grid");
    const multi = parent.classList.contains("multi");

    if (!multi) {
        parent.querySelectorAll(".q-btn").forEach(btn => btn.classList.remove("selected"));
    }

    e.target.classList.toggle("selected");
});

document.getElementById("show-budget-btn").addEventListener("click", () => {

    const intro = document.getElementById("intro-wrapper");
    intro.classList.add("fadeOut");

    intro.addEventListener("transitionend", () => {
        intro.remove();  

        questionnaire.classList.add("show-questionnaire");
        setTimeout(() => showStep(1), 200);
    }, { once: true });
});

const slider = document.getElementById("budget-slider");
const display = document.getElementById("budget-display");

if (slider) {
    display.textContent = `$${slider.value}`;

    slider.addEventListener("input", () => {
        display.textContent = `$${slider.value}`;
    });
}