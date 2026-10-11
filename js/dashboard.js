
 // =========================================
 // MEMBER 4 - REGISTRATION & DASHBOARD
 // Enhanced validation and safe rendering
 // =========================================

const registrationForm = document.getElementById("registrationForm");
const registrationMessage = document.getElementById("registrationMessage");
const registeredEvents = document.getElementById("registeredEvents");
const emptyMessage = document.getElementById("emptyMessage");

const totalRegistrations = document.getElementById("totalRegistrations");
const uniqueEvents = document.getElementById("uniqueEvents");
const studentCount = document.getElementById("studentCount");

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

// =========================================
// LOCAL STORAGE
// =========================================

function getRegistrations() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            return [];
        }

        const registrations = JSON.parse(savedData);

        return Array.isArray(registrations) ? registrations : [];
    } catch (error) {
        console.error("Could not read registrations:", error);
        showMessage("Unable to load saved registrations.", "red");
        return [];
    }
}

function saveRegistrations(registrations) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
        return true;
    } catch (error) {
        console.error("Could not save registrations:", error);
        showMessage("Unable to save. Check your browser storage.", "red");
        return false;
    }
}

// =========================================
// FORM FEEDBACK
// =========================================

function showMessage(message, color) {
    registrationMessage.textContent = message;
    registrationMessage.style.color = color;
}

function clearMessage() {
    registrationMessage.textContent = "";
}

[studentNameInput, studentEmailInput, rollNumberInput, eventSelect]
    .forEach(function (input) {
        input.addEventListener("input", clearMessage);
        input.addEventListener("change", clearMessage);
    });

// Live name-length guidance
studentNameInput.addEventListener("input", function () {
    const remaining = 60 - studentNameInput.value.length;

    nameHint.textContent = remaining + " characters remaining";
});

// =========================================
// VALIDATE FORM
// =========================================

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

// =========================================
// REGISTER STUDENT
// =========================================

registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearMessage();

    const studentName = studentNameInput.value.trim();
    const studentEmail = studentEmailInput.value.trim().toLowerCase();
    const rollNumber = rollNumberInput.value.trim();
    const eventName = eventSelect.value;

    if (!validateRegistration(studentName, studentEmail, rollNumber, eventName)) {
        return;
    }

    const registrations = getRegistrations();

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

    displayRegistrations();
});

// =========================================
// DISPLAY REGISTERED EVENTS
// =========================================

function createTextElement(tag, label, value) {
    const element = document.createElement(tag);

    if (label) {
        const strong = document.createElement("strong");
        strong.textContent = label + " ";
        element.appendChild(strong);
    }

    element.appendChild(document.createTextNode(String(value ?? "")));

    return element;
}

function displayRegistrations() {
    const registrations = getRegistrations();

    registeredEvents.replaceChildren();

    emptyMessage.style.display =
        registrations.length === 0 ? "block" : "none";

    registrations.forEach(function (registration) {
        const card = document.createElement("div");
        card.className = "registered-card";

        const title = document.createElement("h3");
        title.textContent = registration.eventName || "Unnamed Event";
        card.appendChild(title);

        card.appendChild(createTextElement("p", "Student:", registration.studentName));
        card.appendChild(createTextElement("p", "Email:", registration.studentEmail));
        card.appendChild(createTextElement("p", "Roll Number:", registration.rollNumber));
        card.appendChild(createTextElement("p", "Registered On:", registration.registrationDate));

        const unregisterButton = document.createElement("button");
        unregisterButton.type = "button";
        unregisterButton.className = "unregister-btn";
        unregisterButton.textContent = "Unregister";

        unregisterButton.addEventListener("click", function () {
            unregisterEvent(registration.id);
        });

        card.appendChild(unregisterButton);
        registeredEvents.appendChild(card);
    });

    updateStatistics(registrations);
}

// =========================================
// UNREGISTER EVENT
// =========================================

function unregisterEvent(id) {
    const registrations = getRegistrations();

    const updatedRegistrations = registrations.filter(function (registration) {
        return registration.id !== id;
    });

    if (updatedRegistrations.length === registrations.length) {
        return;
    }

    if (!saveRegistrations(updatedRegistrations)) {
        return;
    }

    showMessage("Registration removed successfully.", "green");
    displayRegistrations();
}

// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics(registrations) {
    totalRegistrations.textContent = registrations.length;

    const events = new Set(
        registrations.map(function (registration) {
            return registration.eventName;
        })
    );

    uniqueEvents.textContent = events.size;

    const students = new Set(
        registrations.map(function (registration) {
            return String(registration.studentEmail || "").toLowerCase();
        })
    );

    studentCount.textContent = students.size;
}

// =========================================
// INITIAL LOAD
// =========================================

displayRegistrations();
