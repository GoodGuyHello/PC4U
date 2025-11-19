// -------------------------------------------------------------
// STEP + ANIMATION SYSTEM
// -------------------------------------------------------------
let currentStep = 0;
const steps = document.querySelectorAll(".q-step");
const questionnaire = document.getElementById("questionnaire");

// hide all at start
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

// -------------------------------------------------------------
// STEP BUTTONS (Next / Back & Button Selection)
// -------------------------------------------------------------
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("next-step")) {
        showStep(currentStep + 1);
    }

    if (e.target.classList.contains("back-step")) {
        showStep(currentStep - 1);
    }

    if (e.target.classList.contains("q-btn")) {
        const parent = e.target.closest(".q-grid");
        const multi = parent.classList.contains("multi");

        if (!multi) {
            parent.querySelectorAll(".q-btn")
                  .forEach(btn => btn.classList.remove("selected"));
        }

        e.target.classList.toggle("selected");
    }
});

// -------------------------------------------------------------
// START BUTTON
// -------------------------------------------------------------
document.getElementById("show-budget-btn").addEventListener("click", () => {
    const intro = document.getElementById("intro-wrapper");
    intro.classList.add("fadeOut");

    intro.addEventListener("transitionend", () => {
        intro.remove();
        questionnaire.classList.add("show-questionnaire");
        setTimeout(() => showStep(1), 200);
    }, { once: true });
});

// -------------------------------------------------------------
// BUDGET SLIDER DISPLAY
// -------------------------------------------------------------
const slider = document.getElementById("budget-slider");
const display = document.getElementById("budget-display");

if (slider && display) {
    display.textContent = `$${slider.value}`;

    slider.addEventListener("input", () => {
        display.textContent = `$${slider.value}`;
    });
}

// -------------------------------------------------------------
// ⭐ NETLIFY + NEON SUBMISSION
// -------------------------------------------------------------
document.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("finish-step")) return;

    // Collect answers
    const selectedButtons = document.querySelectorAll(".q-btn.selected");
    const answers = Array.from(selectedButtons).map(btn => btn.textContent.trim());

    // Budget
    const budget = document.getElementById("budget-slider")?.value;

    if (!budget || budget < 50) {
        alert("Please enter a budget of at least $50.");
        return;
    }

    // Payload
    const payload = {
        answers,
        budget
    };

    try {
        const res = await fetch("/.netlify/functions/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok) {
            alert("Error: " + (data.error || "Unknown error"));
            return;
        }

        // Save for results page
        localStorage.setItem("pc4u_results", JSON.stringify(data));

        window.location.href = "results.html";

    } catch (err) {
        console.error("Netlify Error:", err);
        alert("Error sending data to server.");
    }
});
