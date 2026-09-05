// =========================================
// MEMBER 3 - EVENT SEARCH, FILTER & DETAILS
// =========================================


// Get required elements

const searchInput = document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const eventCards =
    document.querySelectorAll(".event-card");

const noResults =
    document.getElementById("noResults");

const detailsButtons =
    document.querySelectorAll(".details-btn");

const detailsModal =
    document.getElementById("detailsModal");

const closeModal =
    document.getElementById("closeModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalCategory =
    document.getElementById("modalCategory");

const modalDate =
    document.getElementById("modalDate");

const modalDescription =
    document.getElementById("modalDescription");


// Current selected category

let selectedCategory = "All";


// =========================================
// SEARCH + FILTER
// =========================================

function filterEvents() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    let visibleEvents = 0;


    eventCards.forEach(function(card) {

        const title =
            card.dataset.title.toLowerCase();

        const category =
            card.dataset.category;


        const matchesSearch =
            title.includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            category === selectedCategory;


        if (matchesSearch && matchesCategory) {

            card.style.display = "block";

            visibleEvents++;

        } else {

            card.style.display = "none";

        }

    });


    if (visibleEvents === 0) {

        noResults.style.display = "block";

    } else {

        noResults.style.display = "none";

    }

}


// Search while typing

searchInput.addEventListener(
    "input",
    filterEvents
);


// Category filter buttons

filterButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            selectedCategory =
                button.dataset.category;


            filterButtons.forEach(
                function(btn) {

                    btn.classList.remove("active");

                }
            );


            button.classList.add("active");


            filterEvents();

        }
    );

});


// =========================================
// EVENT DETAILS
// =========================================

detailsButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const card =
                button.closest(".event-card");


            const title =
                card.querySelector("h3").textContent;


            const category =
                card.dataset.category;


            const date =
                card.querySelector(".event-date").textContent;


            const description =
                card.querySelector(
                    "p:not(.event-category)"
                ).textContent;


            modalTitle.textContent =
                title;

            modalCategory.textContent =
                "Category: " + category;

            modalDate.textContent =
                "Date: " + date;

            modalDescription.textContent =
                description;


            detailsModal.style.display =
                "flex";

        }
    );

});


// Close popup

closeModal.addEventListener(
    "click",
    function() {

        detailsModal.style.display =
            "none";

    }
);


// Close popup when clicking outside

detailsModal.addEventListener(
    "click",
    function(event) {

        if (event.target === detailsModal) {

            detailsModal.style.display =
                "none";

        }

    }
);


// Initial display

filterEvents();