// Tab switching functionality
var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    // Loop through all tab links to remove the active class
    for (var tablink of tablinks) {
        tablink.classList.remove("active-link");
    }

    // Loop through all tab contents to remove the active class
    for (var tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }

    // Add the active class to the current tab and tab content
    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");
}

// Form submission to Formspree
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const formData = new FormData(event.target);

    // Send data to Formspree
    fetch("https://formspree.io/f/YOUR_FORM_ID", { // Replace YOUR_FORM_ID with your actual Formspree form ID
        method: "POST",
        body: formData,
        headers: {
            "Accept": "application/json" // Accept JSON response
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById("formResponse").innerText = "Thank you for your message! I'll get back to you soon.";
            document.getElementById("contactForm").reset(); // Reset form after successful submission
        } else {
            document.getElementById("formResponse").innerText = "Oops! There was a problem with your submission.";
        }
    })
    .catch(error => {
        document.getElementById("formResponse").innerText = "Oops! There was a problem with your submission.";
        console.error("Error:", error);
    });
});
