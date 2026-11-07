
const STORAGE_KEY = "campusConnectRegistrations";

const registeredEvents = document.getElementById("registeredEvents");
const emptyMessage = document.getElementById("emptyMessage");

const totalRegistrations = document.getElementById("totalRegistrations");
const uniqueEvents = document.getElementById("uniqueEvents");
const studentCount = document.getElementById("studentCount");

// Read saved registrations
function getRegistrations() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            return [];
        }

        const registrations = JSON.parse(savedData);

        return Array.isArray(registrations) ? registrations : [];

    } catch (error) {
        console.error("Unable to read registrations:", error);
        return [];
    }
}

// Create safe text elements
function createTextElement(tag, label, value) {
    const element = document.createElement(tag);

    if (label) {
        const strong = document.createElement("strong");
        strong.textContent = label + " ";
        element.appendChild(strong);
    }

    element.appendChild(
        document.createTextNode(String(value ?? ""))
    );

    return element;
}

// Update statistics
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

// Display registrations
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

        card.appendChild(
            createTextElement("p", "Student:", registration.studentName)
        );

        card.appendChild(
            createTextElement("p", "Email:", registration.studentEmail)
        );

        card.appendChild(
            createTextElement("p", "Roll Number:", registration.rollNumber)
        );

        card.appendChild(
            createTextElement("p", "Registered On:", registration.registrationDate)
        );

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

// Remove registration
function unregisterEvent(id) {

    const registrations = getRegistrations();

    const updatedRegistrations = registrations.filter(
        function (registration) {
            return registration.id !== id;
        }
    );

    if (updatedRegistrations.length === registrations.length) {
        return;
    }

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedRegistrations)
        );

        displayRegistrations();

    } catch (error) {
        console.error("Unable to remove registration:", error);
        alert("Unable to update registration. Please try again.");
    }
}

// Refresh when registration data changes in another tab
window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY) {
        displayRegistrations();
    }
});

// Initial dashboard load
displayRegistrations();
