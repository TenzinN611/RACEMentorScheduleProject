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

    // Close any open sidebar first
    const openSidebar = document.querySelector('.sidebar.show, .active-sidebar.show, .Completed-Module-sidebar.show');
    if (openSidebar) {
        openSidebar.classList.remove('show');
    }

    // Expand the menu
    sidebar.style.transition = 'width 0.3s ease';
    sidebar.style.width = menuWidth;
    sidebar.style.left = '0';

}

function collapseMenu() {
    const sidebar = document.getElementById('menu');

    sidebar.style.transition = 'width 0.3s ease'; // Increase transition duration and use ease timing function
    sidebar.style.width = 'auto';
    sidebar.style.left = ''; // Reset left position

}

// Function to close all sidebars except the target sidebar
function toggleSidebar(targetId) {
    const targetSidebar = document.getElementById(targetId);

    // Close all sidebars except the target
    const sidebars = document.querySelectorAll('.sidebar, .active-sidebar, .Completed-Module-sidebar');
    sidebars.forEach(sidebar => {
        if (sidebar !== targetSidebar && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Toggle target sidebar
    targetSidebar.classList.toggle('show');

}


//get report
function openGetReportBox() {
    closeCalendar();
    closeChangePasswordPopup();
    closeProfilePopup();
    document.getElementById('calendarContainer').style.display = 'none';
    var reportBox = document.getElementById('report-box');
    reportBox.style.display = 'block';
    // Initialize Flatpickr on date inputst
    flatpickr("#from-date", {
        dateFormat: "Y-m-d", // Format the date as YYYY-MM-DD
        minDate: "today" // Set the minimum date to today
        // Add any additional options here
    });

    flatpickr("#to-date", {
        dateFormat: "Y-m-d", // Format the date as YYYY-MM-DD
        minDate: "today" // Set the minimum date to today
        // Add any additional options here
    });
}

function closeGetReportBox() {
    var reportBox = document.getElementById('report-box');
    reportBox.style.display = 'none';
    document.getElementById('calendarContainer').style.display = 'block';
}

function closeCalendar() {
    document.getElementById('calendarContainer').style.display = 'none';
}

function openCalendar() {
    closeCalendar();
    closeChangePasswordPopup();
    closeProfilePopup();
    closeGetReportBox();
    document.getElementById('calendarContainer').style.display = 'block';
}

/*function toggleCalendarAndChangePasswordPopup(open) {
    if (open) {
        openCalendar();
        closeChangePasswordPopup();
    } else {
        closeCalendar();
    }
}*/

function downloadReport() {
    // Get start and end dates from the form
    var startDate = document.getElementById("from-date").value;
    var endDate = document.getElementById("to-date").value;
    var Mentor = document.getElementById("MentorName11").value;

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
    closeCalendar();
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('profileBox');

    overlay.style.display = 'block';
    popup.style.display = 'block';

    // Add event listener to close popup when overlay is clicked
    overlay.addEventListener('click', closeProfilePopup);
}

// Function to close profile popup
function closeProfilePopup() {
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('profileBox');

    overlay.style.display = 'none';
    popup.style.display = 'none';

    // Remove event listener to prevent unwanted closing
    overlay.removeEventListener('click', closeProfilePopup);
    document.getElementById('calendarContainer').style.display = 'block';
}

// Function to open change password popup
function openChangePasswordPopup() {
    closeProfilePopup();
    closeGetReportBox();
    closeCalendar();
    var overlay = document.getElementById('overlay');
    var popup = document.getElementById('changePasswordBox');

    overlay.style.display = 'block';
    popup.style.display = 'block';

    // Add event listener to close change password popup when overlay is clicked
    overlay.addEventListener('click', closeChangePasswordPopup);

    // Event listener for change password form submission
    document.getElementById('edit-profile-forms').addEventListener('submit', function (e) {
        var currentPassword = document.getElementById('Password').value;
        var newPassword = document.getElementById('NewPassword').value;

        if (currentPassword === newPassword) {
            e.preventDefault(); // Prevent the form submission
            showToastMessage('error',"Current and new passwords cannot be the same.");
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

    // Remove event listener to prevent unwanted closing
    overlay.removeEventListener('click', closeChangePasswordPopup);
    document.getElementById('calendarContainer').style.display = 'block';
}

//date 
function initializeDatePickers() {
    // Initialize the date picker for "from_date" input
    flatpickr("#from_date", {
        dateFormat: "Y-m-d", // Set the date format
        minDate: "today" // Set the minimum date to today
        // Add any additional options as needed
    });

    // Initialize the date picker for "to_date" input
    flatpickr("#to_date", {
        dateFormat: "Y-m-d", // Set the date format
        minDate: "today" // Set the minimum date to today
        // Add any additional options as needed
    });
}


// Dropdown population function
function populateDropdown(dropdown, options, defaultLabel) {
    dropdown.empty().append($('<option>').text(`Select ${defaultLabel}`).attr('value', ''));
    dropdown.append(options.map(value => $('<option>').text(value).attr('value', value)));
}

async function fetchDropdownValues() {
    try {
        const response = await fetch('/fetch_dropdown_values');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data: ", data);
        return data;
    } catch (error) {
        console.error('Error fetching dropdown values:', error);
        throw error; // Re-throw the error to handle it at a higher level if needed
    }
}

async function populateDropdownValues() {
    try {
        const data = await fetchDropdownValues();

        if (data && data.courses && data.mentors && data.programs && data.batches) {
            //populateDropdown($('#CourseName11'), data.courses, 'Course Name');
            //populateDropdown($('#MentorName11'), data.mentors, 'Mentor Name');
            populateDropdown($('#batch11'), data.batches, 'Batch');
            //populateDropdown($('#program11'), data.programs, 'Program');
        } else {
            console.log('Invalid data received from the server.');
            // Handle invalid data as needed
        }
    } catch (error) {
        // Handle the error, e.g., display an error message to the user
        console.error('Error during dropdown population:', error);
    }
}

// Replace this with your actual function to get Saturdays from the server
async function getSaturdaysInMonth() {
    try {
        const response = await fetch('/get_saturdays_in_month');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.saturdays;
    } catch (error) {
        console.error('Error fetching Saturdays:', error);
        // Handle the error, e.g., display an error message to the user
        return [];
    }
}

const scheduleData = [];

async function populateTable() {
  try {
    // Display loading indicator
    const loadingLogo = document.getElementById('loadingLogo');
    loadingLogo.style.display = 'block';
    const ca = document.getElementById('calendarContainer');
    ca.style.display = 'block';

    // Clear existing table data
    depopulateTable();

    // Fetch necessary data asynchronously
    const [mentorsData, batchNames, saturdayDates] = await Promise.all([
      fetch('/get_mentorss').then(response => response.json()),
      fetch('/get_batch_names').then(response => response.json()),
      getSaturdaysInMonth()
    ]);

    // Clear existing scheduleData
    scheduleData.length = 0;

    // Initialize the scheduleItem object with the "Batch" column header
    const scheduleItem = { batch: 'Batch' };

    // Create column headers for each Saturday date
    saturdayDates.forEach((date, index) => {
      scheduleItem[`cell${index + 1}`] = `Week ${index + 1}:<br> ${date}`;
    });

    // Push the column header object to the scheduleData array
    scheduleData.push(scheduleItem);
    let currentDate = new Date();

    // Format the date as desired
    let year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    let day = currentDate.getDate().toString().padStart(2, '0');
    let formattedDate1 = `${year}-${month}-${day}`;

    // Populate scheduleData with mentor data
    batchNames.forEach(batch => {
      const scheduleItem = { batch };
      saturdayDates.forEach((date, index) => {
        const mentorForWeek = mentorsData.find(mentor => mentor.BatchName === batch && mentor.Date === date);
        const combinedData = mentorForWeek ? `${mentorForWeek.MentorName} <br> ${mentorForWeek.ModuleName} <br> ${date}` : 'Not Scheduled';
        scheduleItem[`cell${index + 1}`] = combinedData;
      });
      scheduleData.push(scheduleItem);
    });

    // Create table rows and cells
    const table = document.getElementById('scheduleTable');
    const fragment = document.createDocumentFragment();
    scheduleData.forEach((item, rowIndex) => {
      const row = document.createElement('tr');
      Object.entries(item).forEach(([key, value], columnIndex) => {
          let cell = document.createElement('td'); // Initialize cell here
  
          if (value == 'Not Scheduled' || rowIndex === 0 || columnIndex === 0) {
              cell.innerHTML = value;
          } else {
              const parts = value.split(' <br> ');
              const mentorpart = parts[0];
              const modulepart = parts[1];
              const datepart = parts[2];

              cell.innerHTML = `<span class="invisible">${mentorpart}</span><br>${modulepart}<br><span class="invisible">${datepart}</span>`;

          }


        // Set background color based on conditions
        if (value != 'Not Scheduled' && columnIndex > 0 && !/^Week \d+$/.test(value)) {
          cell.style.backgroundColor = 'lightgreen';
          cell.addEventListener('mouseenter', function () {
            const content = cell.innerHTML;
            showPopupOnCell(cell, content);
          });
          if (value.split(' <br> ')[2] < formattedDate1) {
            cell.style.backgroundColor = 'lightgray';
          }
        }
        if (columnIndex == 0) {
          cell.style.backgroundColor = 'lightblue';
        }
        if (/^Week \d+:<br> \d{4}-\d{2}-\d{2}$/.test(value)) {
          cell.style.backgroundColor = 'orange';
      }


        row.appendChild(cell);
      });
      fragment.appendChild(row);
    });

    // Append the fragment to the table
    table.appendChild(fragment);

    // Hide loading indicator
    loadingLogo.style.display = 'none';
  } catch (error) {
    console.error('Error populating table:', error);
    // Hide loading indicator on error
    const loadingLogo = document.getElementById('loadingLogo');
    loadingLogo.style.display = 'none';
  }
}

function showPopupOnCell(cell, content) {
    // Check if the cell is scheduled
    if (content !== 'Not Scheduled') {
      const popup = document.createElement('div');
      popup.className = 'popupss';
  
      // Parse the HTML structure of content
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
  
      // Get mentor, module, and date from the parsed HTML
      const mentorElement = doc.querySelector('span:nth-of-type(1)');
      const moduleElement = doc.querySelector('br + br').previousSibling; // Adjust this line
      const dateElement = doc.querySelector('span:nth-of-type(2)');
  
      // Extract mentor, module, and date information from the cell's content
      const mentorName = mentorElement.textContent.trim();
      const moduleName = moduleElement.textContent.trim();
      const date = dateElement.textContent.trim();
  
      // Construct the popup content with mentor, module, and date information
      const popupContent = `Mentor: ${mentorName}<br>Module: ${moduleName}<br>Date: ${date}`;
  
      popup.innerHTML = popupContent;
  
      // Append the popup to the document body
      document.body.appendChild(popup);
  
      // Position the popup near the cell
      const rect = cell.getBoundingClientRect();
      popup.style.left = rect.left + 'px';
      popup.style.top = rect.top + cell.offsetHeight + 'px'; // Position below the cell
  
      // Add the 'show' class to apply opening effect
      setTimeout(function() {
        popup.classList.add('show');
      }, 50);
  
      let timeout; // Variable to hold timeout reference
  
      // Remove the popup when mouse leaves the cell
      cell.addEventListener('mouseleave', function () {
        // Clear any existing timeout
        clearTimeout(timeout);
        // Set a small delay before removing the popup
        timeout = setTimeout(function() {
          if (popup.parentNode === document.body) {
            document.body.removeChild(popup); // Remove the popup if it exists
          }
        }, 200); // Adjust the delay as needed
      });
    }
  }

//search calender
function searchCalendar() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("scheduleTable");
    tr = table.getElementsByTagName("tr");

    var batchFound = false;

    for (i = 0; i < tr.length; i++) { // Start from index 0
        td = tr[i].getElementsByTagName("td")[0]; // Assuming Batch is in the first column

        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                batchFound = true;
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    var noResultsMessage = document.getElementById("noResultsMessage");
    if (!batchFound) {
        noResultsMessage.style.display = "block";
    } else {
        noResultsMessage.style.display = "none";
    }
}


function depopulateTable() {
  try {
    const table = document.getElementById('scheduleTable');

    // Remove all rows from the table, starting from the second row
    for (let i = table.rows.length - 1; i > 0; i--) {
      table.deleteRow(i);
    }

    // Clear existing scheduleData
    scheduleData.length = 0;
  } catch (error) {
    console.error('Error depopulating table:', error);
  }
}

// Call the function to initialize date pickers when the document is ready
document.addEventListener("DOMContentLoaded", function () {
    initializeDatePickers();
    populateDropdownValues();
    populateTable();
});


// Call the function to populate dropdowns when the document is ready
//$(document).ready(populateDropdownValues);
