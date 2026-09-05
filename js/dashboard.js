// =========================================
// MEMBER 4 - REGISTRATION & DASHBOARD
// =========================================


// Get elements

const registrationForm =
    document.getElementById("registrationForm");

const registrationMessage =
    document.getElementById("registrationMessage");

const registeredEvents =
    document.getElementById("registeredEvents");

const emptyMessage =
    document.getElementById("emptyMessage");

const totalRegistrations =
    document.getElementById("totalRegistrations");

const uniqueEvents =
    document.getElementById("uniqueEvents");

const studentCount =
    document.getElementById("studentCount");


// =========================================
// LOCAL STORAGE
// =========================================

// Get existing registrations

function getRegistrations() {

    const registrations =
        localStorage.getItem("campusConnectRegistrations");

    if (registrations) {

        return JSON.parse(registrations);

    }

    return [];
}


// Save registrations

function saveRegistrations(registrations) {

    localStorage.setItem(
        "campusConnectRegistrations",
        JSON.stringify(registrations)
    );

}


// =========================================
// REGISTER STUDENT
// =========================================

registrationForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const studentName =
            document.getElementById("studentName").value.trim();

        const studentEmail =
            document.getElementById("studentEmail").value.trim();

        const rollNumber =
            document.getElementById("rollNumber").value.trim();

        const eventName =
            document.getElementById("eventSelect").value;


        let registrations =
            getRegistrations();


        // Check duplicate registration

        const alreadyRegistered =
            registrations.some(function(registration) {

                return (
                    registration.studentEmail === studentEmail &&
                    registration.eventName === eventName
                );

            });


        if (alreadyRegistered) {

            registrationMessage.textContent =
                "You are already registered for this event.";

            registrationMessage.style.color = "red";

            return;

        }


        // Create registration object

        const registration = {

            id: Date.now(),

            studentName: studentName,

            studentEmail: studentEmail,

            rollNumber: rollNumber,

            eventName: eventName,

            registrationDate:
                new Date().toLocaleDateString()

        };


        // Add registration

        registrations.push(registration);


        // Save to LocalStorage

        saveRegistrations(registrations);


        // Show success message

        registrationMessage.textContent =
            "Registration successful!";

        registrationMessage.style.color = "green";


        // Reset form

        registrationForm.reset();


        // Refresh dashboard

        displayRegistrations();

    }
);


// =========================================
// DISPLAY REGISTERED EVENTS
// =========================================

function displayRegistrations() {

    const registrations =
        getRegistrations();


    registeredEvents.innerHTML = "";


    if (registrations.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";


        registrations.forEach(
            function(registration) {

                const card =
                    document.createElement("div");

                card.className =
                    "registered-card";


                card.innerHTML = `

                    <h3>${registration.eventName}</h3>

                    <p>
                        <strong>Student:</strong>
                        ${registration.studentName}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${registration.studentEmail}
                    </p>

                    <p>
                        <strong>Roll Number:</strong>
                        ${registration.rollNumber}
                    </p>

                    <p>
                        <strong>Registered On:</strong>
                        ${registration.registrationDate}
                    </p>

                    <button
                        class="unregister-btn"
                        onclick="unregisterEvent(${registration.id})"
                    >
                        Unregister
                    </button>

                `;


                registeredEvents.appendChild(card);

            }
        );

    }


    updateStatistics(registrations);

}


// =========================================
// UNREGISTER EVENT
// =========================================

function unregisterEvent(id) {

    let registrations =
        getRegistrations();


    registrations =
        registrations.filter(
            function(registration) {

                return registration.id !== id;

            }
        );


    saveRegistrations(registrations);


    displayRegistrations();

}


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics(registrations) {

    // Total registrations

    totalRegistrations.textContent =
        registrations.length;


    // Unique events

    const events =
        new Set(
            registrations.map(
                function(registration) {

                    return registration.eventName;

                }
            )
        );


    uniqueEvents.textContent =
        events.size;


    // Unique students

    const students =
        new Set(
            registrations.map(
                function(registration) {

                    return registration.studentEmail;

                }
            )
        );


    studentCount.textContent =
        students.size;

}


// =========================================
// INITIAL LOAD
// =========================================

displayRegistrations();