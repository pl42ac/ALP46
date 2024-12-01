

// Labels and coordinates
const labels = [
    { name: "Filling Aperture For Sand, F-End", coords: [1507, 329, 1553, 360] },
    { name: "Filling Aperture For Sand, B-End", coords: [193, 331, 227, 363] },
    { name: "Rear View Mirror, B-End", coords: [240, 258, 261, 327] },
    { name: "Antenna for train radio equipment", coords: [259, 192, 303, 218] },
    { name: "Cab Door, B-End", coords: [307, 260, 370, 396] },
    { name: "Pantograph 2", coords: [361, 129, 580, 220] },
    { name: "Pantograph 1", coords: [1161, 138, 1383, 224] },
    { name: "Parking Brake Applied Indicators", coords: [1348, 267, 1368, 294] },
    { name: "Horn, F-End", coords: [1390, 182, 1430, 210] },
    { name: "Horn, B-End", coords: [312, 177, 356, 214] },
    { name: "Side Window, F-End", coords: [1447, 260, 1497, 319] },
    { name: "Coupler, F-End", coords: [1615, 434, 1664, 470] },
    { name: "Coupler, B-End", coords: [78, 428, 140, 473] },
    { name: "Snow Plow, F-end, Two ATC antennas are mounted on each snow plow", coords: [1577, 485, 1620, 523] },
    { name: "Snow Plow, B-end, Two ATC antennas are mounted on each snow plow", coords: [120, 486, 159, 513] },
    { name: "Truck", coords: [1164, 438, 1454, 522] },
    { name: "Traction Rod, B-End", coords: [606, 475, 747, 504] },
    { name: "Traction Rod, F-End", coords: [1021, 480, 1134, 513] },
    { name: "Transformer", coords: [761, 444, 900, 496] },
    { name: "Wayside Power Receptacle", coords: [1091, 420, 1130, 477] },
    { name: "Battery Box", coords: [1031, 441, 1088, 475] },
    { name: "Battery Fuses", coords: [969, 464, 1001, 502] },
    { name: "ACSES Antenna (At B-End Only)", coords: [184, 476, 236, 525] },
    { name: "Truck, B-end", coords: [324, 441, 581, 520] },
];




let currentIndex = 0;
const missedLabels = []; // Track missed labels
let correctCount = 0;
let incorrectCount = 0;

// Shuffle the labels array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle labels before starting the quiz
shuffle(labels);

// Set the initial question
function setQuestion() {
    if (currentIndex < labels.length) {
        document.getElementById("question").textContent = `Click on: ${labels[currentIndex].name}`;
    } else {
        endQuiz();
    }
}

// Add a highlight for correct or incorrect answers
function addHighlight(coords, container, color, label = null) {
    const diagram = document.getElementById("diagram");
    const scaleX = diagram.clientWidth / diagram.naturalWidth;
    const scaleY = diagram.clientHeight / diagram.naturalHeight;

    const x1 = coords[0] * scaleX;
    const y1 = coords[1] * scaleY;
    const x2 = coords[2] * scaleX;
    const y2 = coords[3] * scaleY;

    const highlight = document.createElement("div");
    highlight.classList.add("highlight");
    highlight.style.left = `${x1}px`;
    highlight.style.top = `${y1}px`;
    highlight.style.width = `${x2 - x1}px`;
    highlight.style.height = `${y2 - y1}px`;
    highlight.style.borderColor = color;
    highlight.style.backgroundColor = color === "green" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";

    if (label) {
        highlight.addEventListener("mouseover", () => {
            label.style.display = "block";
            label.style.left = `${x2 + 5}px`; // Position label to the right of the highlight
            label.style.top = `${y1}px`; // Align vertically
        });
        highlight.addEventListener("mouseout", () => {
            label.style.display = "none";
        });
    }

    container.appendChild(highlight);
    return highlight; // Return the highlight for additional controls
}

// End the quiz and display the summary
function endQuiz() {
    const questionElement = document.getElementById("question");
    const feedbackElement = document.getElementById("feedback");
    const diagramContainer = document.getElementById("diagram-container");

    const score = ((correctCount / labels.length) * 100).toFixed(2); // Calculate score percentage

    questionElement.textContent = "Quiz Completed!";
    feedbackElement.innerHTML = `
        <p>Score: ${score}%</p>
        <p>Correct: ${correctCount}</p>
        <p>Incorrect: ${incorrectCount}</p>
        <p>Missed Labels:</p>
        <ul>
            ${missedLabels
                .map(
                    (label) =>
                        `<li class="missed-label" data-label="${label.name}">${label.name}</li>`
                )
                .join("")}
        </ul>
    `;

    // Highlight missed areas in red when hovered and show labels
    const missedLabelElements = document.querySelectorAll(".missed-label");
    missedLabelElements.forEach((element) => {
        const label = labels.find((l) => l.name === element.dataset.label);
        let tempHighlight = null; // Track the temporary highlight
        let tempLabel = null; // Track the temporary label
        element.addEventListener("mouseover", () => {
            tempHighlight = addHighlight(label.coords, diagramContainer, "red");
            tempLabel = document.createElement("div");
            tempLabel.classList.add("label");
            tempLabel.textContent = label.name;
            tempLabel.style.left = `${tempHighlight.style.left}`;
            tempLabel.style.top = `${parseInt(tempHighlight.style.top) + 20}px`; // Below the highlight
            diagramContainer.appendChild(tempLabel);
        });
        element.addEventListener("mouseout", () => {
            if (tempHighlight) tempHighlight.remove(); // Remove the highlight
            if (tempLabel) tempLabel.remove(); // Remove the label
        });
    });
}

// Start the quiz
setQuestion();

function checkAnswer(isCorrect) {
    const feedback = document.getElementById("feedback");
    const diagramContainer = document.getElementById("diagram-container");
    const currentLabel = labels[currentIndex];

    if (isCorrect) {
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
        correctCount++;

        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = currentLabel.name;
        label.style.display = "none";

        addHighlight(currentLabel.coords, diagramContainer, "green", label);
        diagramContainer.appendChild(label);
    } else {
        feedback.textContent = "Incorrect! Moving to the next label.";
        feedback.style.color = "red";
        incorrectCount++;
        missedLabels.push(currentLabel);
    }

    currentIndex++;
    setQuestion();
}

const diagram = document.getElementById("diagram");
diagram.addEventListener("click", (event) => {
    const scaleX = diagram.naturalWidth / diagram.clientWidth;
    const scaleY = diagram.naturalHeight / diagram.clientHeight;

    const x = Math.round(event.offsetX * scaleX);
    const y = Math.round(event.offsetY * scaleY);

    const coords = labels[currentIndex].coords;

    // Check if the click is within the bounds
    const isCorrect =
        x >= coords[0] && x <= coords[2] && y >= coords[1] && y <= coords[3];

    checkAnswer(isCorrect);
});
