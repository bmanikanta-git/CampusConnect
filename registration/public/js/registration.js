
const registrationForm = document.getElementById("registrationForm");
const registrationMessage = document.getElementById("registrationMessage");

const studentNameInput = document.getElementById("studentName");
const studentEmailInput = document.getElementById("studentEmail");
const rollNumberInput = document.getElementById("rollNumber");
const eventSelect = document.getElementById("eventSelect");
const nameHint = document.getElementById("nameHint");

const STORAGE_KEY = "campusConnectRegistrations";

const allowedEvents = [
    "CodeSprint 2026",
    "Campus Beats",
    "AI Future Lab",
    "Inter College Cricket",
    "Web Development Bootcamp",
    "Photography Workshop"
];

// Read registrations from browser storage
function getRegistrations() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) return [];

        const registrations = JSON.parse(savedData);

        return Array.isArray(registrations) ? registrations : [];
    } catch (error) {
        console.error("Could not read registrations:", error);
        showMessage("Unable to load saved registrations.", "red");
        return [];
    }
}

// Save registrations to browser storage
function saveRegistrations(registrations) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(registrations)
        );
        return true;
    } catch (error) {
        console.error("Could not save registrations:", error);
        showMessage("Unable to save. Check your browser storage.", "red");
        return false;
    }
}

// Display feedback
function showMessage(message, color) {
    registrationMessage.textContent = message;
    registrationMessage.style.color = color;
}

function clearMessage() {
    registrationMessage.textContent = "";
}

// Clear messages when fields change
[
    studentNameInput,
    studentEmailInput,
    rollNumberInput,
    eventSelect
].forEach(function (input) {
    input.addEventListener("input", clearMessage);
    input.addEventListener("change", clearMessage);
});

// Live name-length guidance
studentNameInput.addEventListener("input", function () {
    const remaining = 60 - studentNameInput.value.length;
    nameHint.textContent = remaining + " characters remaining";
});

// Validate student information
function validateRegistration(name, email, rollNumber, eventName) {

    if (name.length < 2 || name.length > 60) {
        showMessage("Name must contain between 2 and 60 characters.", "red");
        studentNameInput.focus();
        return false;
    }

    if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(name)) {
        showMessage("Enter a valid name using letters and normal name punctuation.", "red");
        studentNameInput.focus();
        return false;
    }

    if (!studentEmailInput.checkValidity() || email.length === 0) {
        showMessage("Please enter a valid email address.", "red");
        studentEmailInput.focus();
        return false;
    }

    if (rollNumber.length < 2 || rollNumber.length > 20) {
        showMessage("Roll number must contain 2–20 characters.", "red");
        rollNumberInput.focus();
        return false;
    }

    if (!/^[a-zA-Z0-9/-]+$/.test(rollNumber)) {
        showMessage("Roll number may contain letters, numbers, hyphens or slashes only.", "red");
        rollNumberInput.focus();
        return false;
    }

    if (!allowedEvents.includes(eventName)) {
        showMessage("Please select a valid event.", "red");
        eventSelect.focus();
        return false;
    }

    return true;
}

// Register student
registrationForm.addEventListener("submit", function (event) {

    event.preventDefault();
    clearMessage();

    const studentName = studentNameInput.value.trim();
    const studentEmail = studentEmailInput.value.trim().toLowerCase();
    const rollNumber = rollNumberInput.value.trim();
    const eventName = eventSelect.value;

    if (!validateRegistration(
        studentName,
        studentEmail,
        rollNumber,
        eventName
    )) {
        return;
    }

    const registrations = getRegistrations();

    // Prevent duplicate registrations
    const alreadyRegistered = registrations.some(function (registration) {
        return (
            String(registration.studentEmail || "").toLowerCase() === studentEmail &&
            registration.eventName === eventName
        );
    });

    if (alreadyRegistered) {
        showMessage("This email is already registered for this event.", "red");
        return;
    }

    const registration = {
        id: Date.now(),
        studentName: studentName,
        studentEmail: studentEmail,
        rollNumber: rollNumber,
        eventName: eventName,
        registrationDate: new Date().toLocaleDateString()
    };

    registrations.push(registration);

    if (!saveRegistrations(registrations)) {
        return;
    }

    showMessage("Registration successful!", "green");

    registrationForm.reset();
    nameHint.textContent = "2–60 characters";
});
