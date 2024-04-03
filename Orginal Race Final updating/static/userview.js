// Function to hide the preloader and show the content
function showContent() {
    document.getElementById('preloader-overlay').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

// Simulating the preloader completion with a timeout (you can replace this with your actual preloader logic)
setTimeout(showContent, 2000); // Adjust the timeout as needed /* Hide content initially */

//menu
function expandMenu() {
    const menuWidth = '15%';
    const sidebar = document.getElementById('menu');
    const dashboardContainer = document.querySelector('.dashboard-containers');

    // Close any open sidebar first
    const openSidebar = document.querySelector('.sidebar.show, .active-sidebar.show, .Completed-Module-sidebar.show');
    if (openSidebar) {
        openSidebar.classList.remove('show');
        dashboardContainer.style.width = '90%'; // Reset dashboard container width
    }

    // Expand the menu
    sidebar.style.transition = 'width 0.3s ease';
    sidebar.style.width = menuWidth;
    sidebar.style.left = '0';

    // Adjust dashboard container width and left position based on expanded menu
    dashboardContainer.style.transition = 'width 0.3s ease, margin-left 0.3s ease';
    dashboardContainer.style.width = 'calc(90% - ' + menuWidth + ')';
    dashboardContainer.style.marginLeft = menuWidth;
}

function collapseMenu() {
    const sidebar = document.getElementById('menu');
    const dashboardContainer = document.querySelector('.dashboard-containers');

    sidebar.style.transition = 'width 0.3s ease'; // Increase transition duration and use ease timing function
    sidebar.style.width = 'auto';
    sidebar.style.left = ''; // Reset left position

    // Set dashboard container width and left position to normal
    dashboardContainer.style.transition = 'width 0.3s ease, margin-left 0.3s ease'; // Increase transition duration and use ease timing function
    dashboardContainer.style.width = '90%';
    dashboardContainer.style.marginLeft = '';
}

// Function to close all sidebars except the target sidebar
function toggleSidebar(targetId) {
    const targetSidebar = document.getElementById(targetId);
    const dashboardContainer = document.querySelector('.dashboard-containers');

    // Close all sidebars except the target
    const sidebars = document.querySelectorAll('.sidebar, .active-sidebar, .Completed-Module-sidebar');
    sidebars.forEach(sidebar => {
        if (sidebar !== targetSidebar && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Toggle target sidebar
    targetSidebar.classList.toggle('show');

    // Adjust dashboard container width based on sidebar visibility
    if (targetSidebar.classList.contains('show')) {
        dashboardContainer.style.width = 'calc(90% - 300px)'; // Adjusted width with sidebar
    } else {
        dashboardContainer.style.width = '90%'; // Normal width without sidebar
    }
}


//get report
function openGetReportBox() {
    closeChangePasswordPopup();
    closeProfilePopup();
    var reportBox = document.getElementById('report-box');
    reportBox.style.display = 'block';
    // Initialize Flatpickr on date inputst
    flatpickr("#from-date", {
        dateFormat: "Y-m-d", // Format the date as YYYY-MM-DD
        // Add any additional options here
    });

    flatpickr("#to-date", {
        dateFormat: "Y-m-d", // Format the date as YYYY-MM-DD
        // Add any additional options here
    });
    document.querySelector('.dashboard-containers').style.display = 'none';
}

function closeGetReportBox() {
    var reportBox = document.getElementById('report-box');
    reportBox.style.display = 'none';
    // Show the dashboard-container and reset its styles
    var dashboardContainer = document.querySelector('.dashboard-containers');
    dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
}

function downloadReport() {
    // Get start and end dates from the form
    var startDate = document.getElementById("from-date").value;
    var endDate = document.getElementById("to-date").value;

    // Make an AJAX request to Flask route
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/generate_csv?start_date=" + startDate + "&end_date=" + endDate);
    xhr.responseType = "blob"; // Expecting a blob response
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Create a temporary anchor element
            var anchor = document.createElement("a");
            anchor.href = URL.createObjectURL(xhr.response);
            anchor.download = "schedule.csv"; // Filename for the downloaded file

            // Trigger the download
            anchor.click();
        }
    };
    xhr.send();
}

// Function to open profile popup
function openProfilePopup() {
    closeChangePasswordPopup();
    closeGetReportBox();
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('profileBox');

    overlay.style.display = 'block';
    popup.style.display = 'block';
    // Hide the dashboard-container
    document.querySelector('.dashboard-containers').style.display = 'none';

    // Add event listener to close popup when overlay is clicked
    overlay.addEventListener('click', closeProfilePopup);
}

// Function to close profile popup
function closeProfilePopup() {
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('profileBox');

    overlay.style.display = 'none';
    popup.style.display = 'none';

    // Show the dashboard-container and reset its styles
    var dashboardContainer = document.querySelector('.dashboard-containers');
    dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox

    // Remove event listener to prevent unwanted closing
    overlay.removeEventListener('click', closeProfilePopup);
}

// Function to open change password popup
function openChangePasswordPopup() {
    closeProfilePopup();
    closeGetReportBox();
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('changePasswordBox');

    overlay.style.display = 'block';
    popup.style.display = 'block';

    // Hide the dashboard-container
    document.querySelector('.dashboard-containers').style.display = 'none';

    // Add event listener to close change password popup when overlay is clicked
    overlay.addEventListener('click', closeChangePasswordPopup);

    // Event listener for change password form submission
    document.getElementById('edit-profile-forms').addEventListener('submit', function (e) {
        var currentPassword = document.getElementById('Password').value;
        var newPassword = document.getElementById('NewPassword').value;

        if (currentPassword === newPassword) {
            e.preventDefault(); // Prevent the form submission
            alert("Current and new passwords cannot be the same.");
            document.getElementById('NewPassword').value = ""; // Reset the new password field
        }
    });
}

// Function to close change password popup
function closeChangePasswordPopup() {
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('changePasswordBox');

    overlay.style.display = 'none';
    popup.style.display = 'none';

    // Show the dashboard-container and reset its styles
    var dashboardContainer = document.querySelector('.dashboard-containers');
    dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox

    // Remove event listener to prevent unwanted closing
    overlay.removeEventListener('click', closeChangePasswordPopup);

}

//date 
function initializeDatePickers() {
    // Initialize the date picker for "from_date" input
    flatpickr("#from_date", {
        dateFormat: "Y-m-d", // Set the date format
        // Add any additional options as needed
    });

    // Initialize the date picker for "to_date" input
    flatpickr("#to_date", {
        dateFormat: "Y-m-d", // Set the date format
        // Add any additional options as needed
    });
}

// Call the function to initialize date pickers when the document is ready
document.addEventListener("DOMContentLoaded", function () {
    initializeDatePickers();
});