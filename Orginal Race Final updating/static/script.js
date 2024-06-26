// Function to hide the preloader and show the content
function showContent() {
  document.getElementById('preloader-overlay').style.display = 'none';
  document.getElementById('content').style.display = 'block';
}

// Simulating the preloader completion with a timeout (you can replace this with your actual preloader logic)
setTimeout(showContent, 2000); // Adjust the timeout as needed /* Hide content initially */


const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const courseBox = document.getElementById('courseBox');
const mentorBox = document.getElementById('mentorBox');
const BatchBox = document.getElementById('BatchBox');
const ProgramBox = document.getElementById('ProgramBox');
const ScheduleBox = document.getElementById('scheduleBox');
const rescheduleBox = document.getElementById('rescheduleBox');
let courseBoxOpen = false;
let mentorBoxOpen = false;
let BatchBoxOpen = false;
let ProgramBoxOpen = false;
let ScheduleBoxOpen = false;
let mentorDetailsVisible = false;
let rescheduleBoxOpen = false;

//menu
function expandMenu() {
  const menuWidth = '15%';
  const sidebar = document.getElementById('menu');
  const dashboardContainer = document.querySelector('.dashboard-container');

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
  const dashboardContainer = document.querySelector('.dashboard-container');

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
  const dashboardContainer = document.querySelector('.dashboard-container');

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

//title
function addTooltipToButtons() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    const title = button.getAttribute('data-title');
    const tooltip = document.createElement('span');
    tooltip.classList.add('tooltip');
    tooltip.innerText = title;
    button.appendChild(tooltip);
  });
}

// Call the function to add tooltips to buttons
addTooltipToButtons();

// Function to display toast messages
function showToastMessage(type, message) {
  // Display toast message using Toastr library
  toastr.options = {
    "closeButton": true,
    "positionClass": "toast-container",
    "timeOut": 3000,
    "extendedTimeOut": 0,
    "onShown": function () {
    },
    "onHidden": function () {
    }
  };
  toastr[type](message);
}

//course
function openCourseBox() {
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
  if (!courseBoxOpen) {
    courseBox.style.display = 'block';
    courseBoxOpen = true;
    // Hide the dashboard-container
    document.querySelector('.dashboard-container').style.display = 'none';
  }
}

// Adding
function AddCourseDetails() {
  const CourseID = document.getElementById('CourseID').value;
  const courseName = document.getElementById('courseName').value;
  const description = document.getElementById('description').value;

  // Validate fields
  if (!CourseID || !courseName || !description) {
    showToastMessage('error', 'Please fill in all fields before adding the course.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(CourseID)) {
    showToastMessage('error', 'Course ID should be a number. Special characters are not allowed.');
    resetField('CourseID');
    return;
  }

  // Validate courseName
  if (!isValidSentenceCase(courseName)) {
    showToastMessage('error', 'Course name should be in sentence case.');
    resetField('courseName');
    return;
  }

  // Validate description
  if (!isValidSentenceCase(description)) {
    showToastMessage('error', 'Description should be in sentence case.');
    resetField('description');
    return;
  }


  const formData = {
    CourseID: CourseID,
    courseName: courseName,
    description: description,
  };

  fetch('/submit_form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(response => {
      if (response.ok) {
        // Use SweetAlert for success message
        Swal.fire({
          icon: 'success',
          title: 'Course added successfully!',
          showConfirmButton: false,
          timer: 3000 // Close the alert after 3 seconds
        });

        // Reset the form
        resetForm();
      } else {
        // Handle non-successful responses here if needed
        throw new Error('Error adding course. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Use SweetAlert for error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error adding course. Please try again.'
      });
    });
}

// Editing
function EditCourseDetails() {
  const CourseID = document.getElementById('CourseID').value;
  const courseName = document.getElementById('courseName').value;
  const description = document.getElementById('description').value;

  // Validate fields
  if (!CourseID || !courseName || !description) {
    showToastMessage('error', 'Please fill in all fields before editing the course.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(CourseID)) {
    showToastMessage('error', 'Course ID should be a number. Special characters are not allowed.');
    resetField('CourseID');
    return;
  }

  // Validate courseName
  if (!isValidSentenceCase(courseName)) {
    showToastMessage('error', 'Course name should be in sentence case.');
    resetField('courseName');
    return;
  }

  // Validate description
  if (!isValidSentenceCase(description)) {
    showToastMessage('error', 'Description should be in sentence case.');
    resetField('description');
    return;
  }

  // SweetAlert confirmation dialog
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to edit this course. Proceed with caution.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, edit it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, proceed with editing
      fetch('/edit_course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CourseID: CourseID,
          courseName: courseName,
          description: description,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Use SweetAlert for success message
            Swal.fire({
              icon: 'success',
              title: 'Course edited successfully!',
              showConfirmButton: false,
              timer: 2000 // Close the alert after 2 seconds
            });

            // Reset the form
            resetForm();
          } else {
            // Use SweetAlert for error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error editing course: ' + data.message
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });

}

// Deleting
function DeleteCourseDetails() {
  const CourseID = document.getElementById('CourseID').value;

  // Validate fields
  if (!CourseID) {
    showToastMessage('error', 'Please enter the Course ID before deleting the course.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(CourseID)) {
    showToastMessage('error', 'Course ID should be a number. Special characters are not allowed.');
    resetForm();
    return;
  }

  // Ask for confirmation using SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this course. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, proceed with deletion
      console.log('Deleting course with ID:', CourseID);

      fetch('/delete_course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CourseID: CourseID,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);
          if (data.success) {
            // Use SweetAlert for success message
            Swal.fire({
              icon: 'success',
              title: 'Course deleted successfully!',
              showConfirmButton: false,
              timer: 2000 // Close the alert after 2 seconds
            });

            // Reset the form
            resetForm();
            // Additional logic or UI update as needed
          } else {
            // Use SweetAlert for error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting course: ' + data.message
            });
          }
        })
        .catch(error => {
          console.error('Fetch Error:', error);
          // Use SweetAlert for error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while deleting the course. Please try again.'
          });
        });
    }
  });

}

// Function to validate that the input is a number
function isValidNumber(number) {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(number);
}

function isValidSentenceCase(text) {
  // Validate that the text is in sentence case with at least one space between words
  const sentenceCaseRegex = /([A-Za-z]+( [A-Za-z]+)+)/i;
  return sentenceCaseRegex.test(text);
}

// Function to reset a specific input field
function resetField(fieldName) {
  document.getElementById(fieldName).value = '';
}
// Function to reset the entire form
function resetForm() {
  document.getElementById('CourseID').value = '';
  document.getElementById('courseName').value = '';
  document.getElementById('description').value = '';
}

function closeCourseBox() {
  courseBox.style.display = 'none';
  courseBoxOpen = false;
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
  fetchAndUpdateCounts();
}

//Mentor:
function openMentorBox() {
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
  if (!mentorBoxOpen) {
    mentorBox.style.display = 'block';
    mentorBoxOpen = true;
    // Hide the dashboard-container
    document.querySelector('.dashboard-container').style.display = 'none';
  }
}

// Adding Details
function AddMentorDetails() {
  const mentorId = document.getElementById('mentorId').value;
  let mentorName = document.getElementById('mentorName').value;
  const mentorRaceEmailAddress = document.getElementById('mentorRaceEmailAddress').value.toLowerCase(); // Convert email to lowercase
  let mentorEmailAddress = document.getElementById('mentorEmailAddress').value.toLowerCase(); // Convert email to lowercase
  const mentorProfile = document.getElementById('mentorProfile').value;
  const mentorWhatsapp = document.getElementById('mentorWhatsapp').value;

  // Validate fields
  if (!mentorId || !mentorName || !mentorRaceEmailAddress || !mentorEmailAddress || !mentorProfile || !mentorWhatsapp) {
    showToastMessage('error', 'Please fill in all fields before adding the mentor.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(mentorId)) {
    showToastMessage('error', 'Mentor ID should be a number. Special characters are not allowed.');
    resetMentorField('mentorId');
    return;
  }

  // Validate mentorName
  if (!isValidSentenceCase(mentorName)) {
    showToastMessage('error', 'Mentor name should be in sentence case.');
    resetMentorField('mentorName');
    return;
  }

  // Validate mentorRaceEmailAddress
  if (!isValidRevaEmail(mentorRaceEmailAddress)) {
    showToastMessage('error', 'Invalid Race email format. Please use the correct email format for Race. Example: example@reva.edu.in');
    resetMentorField('mentorRaceEmailAddress');
    return;
  }

  // Validate mentorEmailAddress
  if (!isValidGmailEmail(mentorEmailAddress)) {
    showToastMessage('error', 'Invalid Gmail email format. Please use the correct email format for Gmail.Example: example@gmail.com');
    resetMentorField('mentorEmailAddress');
    return;
  }

  // Validate mentorWhatsapp
  if (!isValidWhatsApp(mentorWhatsapp)) {
    showToastMessage('error', 'Phone number should be a 10-digit number.');
    resetMentorField('mentorWhatsapp');
    return;
  }

  const formData = {
    mentorId: mentorId,
    mentorName: mentorName,
    mentorRaceEmailAddress: mentorRaceEmailAddress,
    mentorEmailAddress: mentorEmailAddress,
    mentorProfile: mentorProfile,
    mentorWhatsapp: mentorWhatsapp,
  };

  fetch('/submit_mentor_form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // Use SweetAlert for success message
      Swal.fire({
        icon: 'success',
        title: 'Mentor Added successfully!',
        showConfirmButton: false,
        timer: 2000 // Close the alert after 2 seconds
      });
      // Reset the form
      resetMentorForm();
    })
    .catch(error => {
      console.error('Error:', error);
      // Use SweetAlert for error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error adding mentor. Please try again.'
      });
    });
}


//Editing
function EditMentorDetails() {
  const mentorId = document.getElementById('mentorId').value;
  const mentorName = document.getElementById('mentorName').value;
  const mentorRaceEmailAddress = document.getElementById('mentorRaceEmailAddress').value.toLowerCase(); // Convert email to lowercase;
  const mentorEmailAddress = document.getElementById('mentorEmailAddress').value.toLowerCase(); // Convert email to lowercase;
  const mentorProfile = document.getElementById('mentorProfile').value;
  const mentorWhatsapp = document.getElementById('mentorWhatsapp').value;

  // Validate fields
  if (!mentorId || !mentorName || !mentorRaceEmailAddress || !mentorEmailAddress || !mentorProfile || !mentorWhatsapp) {
    showToastMessage('error', 'Please fill in all fields before editing the mentor.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(mentorId)) {
    showToastMessage('error', 'Mentor ID should be a number. Special characters are not allowed.');
    resetMentorField('mentorId');
    return;
  }

  // Validate mentorName
  if (!isValidSentenceCase(mentorName)) {
    showToastMessage('error', 'Mentor name should be in sentence case.');
    resetMentorField('mentorName');
    return;
  }

  // Validate mentorRaceEmailAddress
  if (!isValidRevaEmail(mentorRaceEmailAddress)) {
    showToastMessage('error', 'Invalid Race email format. Please use the correct email format for Race. Example: example@reva.edu.in');
    resetMentorField('mentorRaceEmailAddress');
    return;
  }

  // Validate mentorEmailAddress
  if (!isValidGmailEmail(mentorEmailAddress)) {
    showToastMessage('error', 'Invalid Gmail email format. Please use the correct email format for Gmail.Example: example@gmail.com');
    resetMentorField('mentorEmailAddress');
    return;
  }

  // Validate mentorWhatsapp
  if (!isValidWhatsApp(mentorWhatsapp)) {
    showToastMessage('error', 'Phone number should be a 10-digit number.');
    resetMentorField('mentorWhatsapp');
    return;
  }

  // Show confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to edit this mentor. Proceed with caution.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, edit it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Proceed with editing mentor
      fetch('/edit_mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: mentorId,
          mentorName: mentorName,
          mentorRaceEmailAddress: mentorRaceEmailAddress,
          mentorEmailAddress: mentorEmailAddress,
          mentorProfile: mentorProfile,
          mentorWhatsapp: mentorWhatsapp,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Use SweetAlert for success message
            Swal.fire({
              icon: 'success',
              title: 'Mentor edited successfully!',
              showConfirmButton: false,
              timer: 2000 // Close the alert after 2 seconds
            });
            // Reset the form
            resetMentorForm();
          } else {
            // Use SweetAlert for error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error editing mentor: ' + data.message
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          // Use SweetAlert for error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while editing the mentor. Please try again.'
          });
        });
    }
  });

}

//Deleting
function DeleteMentorDetails() {
  const mentorId = document.getElementById('mentorId').value;

  // Validate fields
  if (!mentorId) {
    showToastMessage('error', 'Please enter the Mentor ID before deleting the mentor.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(mentorId)) {
    showToastMessage('error', 'Mentor ID should be a number. Special characters are not allowed.');
    resetMentorForm();
    return;
  }

  // Show confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this mentor. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, proceed with deletion
      console.log('Deleting mentor with ID:', mentorId);

      fetch('/delete_mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: mentorId,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);
          if (data.success) {
            // Use SweetAlert for success message
            Swal.fire({
              icon: 'success',
              title: 'Mentor deleted successfully!',
              showConfirmButton: false,
              timer: 2000 // Close the alert after 2 seconds
            });

            // Reset the form
            resetMentorForm();
            // Additional logic or UI update as needed
          } else {
            // Use SweetAlert for error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting mentor: ' + data.message
            });
          }
        })
        .catch(error => {
          console.error('Fetch Error:', error);
          // Use SweetAlert for error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while deleting the mentor. Please try again.'
          });
        });
    }
  });
}

// Function to validate that the input is a number
function isValidNumber(number) {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(number);
}

function isValidSentenceCase(text) {
  // Validate that the text is in sentence case with at least one space between words
  const sentenceCaseRegex = /([A-Za-z]+( [A-Za-z]+)+)/i;
  return sentenceCaseRegex.test(text);
}

function isValidRevaEmail(email) {
  // Validate REVA email format (username@reva.edu.in)
  const revaEmailRegex = /^[a-zA-Z0-9._-]+@reva\.edu\.in$/;
  return revaEmailRegex.test(email);
}

function isValidGmailEmail(email) {
  // Validate Gmail email format
  const gmailEmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
  return gmailEmailRegex.test(email);
}

function isValidWhatsApp(number) {
  // Validate WhatsApp number format (10 digits)
  const whatsappRegex = /^\d{10}$/;
  return whatsappRegex.test(number);
}

// Function to reset a specific input field
function resetMentorField(fieldName) {
  document.getElementById(fieldName).value = '';
}

//reset mentor form
function resetMentorForm() {
  document.getElementById('mentorId').value = '';
  document.getElementById('mentorName').value = '';
  document.getElementById('mentorRaceEmailAddress').value = '';
  document.getElementById('mentorEmailAddress').value = '';
  document.getElementById('mentorProfile').value = '';
  document.getElementById('mentorWhatsapp').value = '';
}


function closeMentorBox() {
  mentorBox.style.display = 'none';
  mentorBoxOpen = false;
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
  fetchAndUpdateCounts();
}

//Batch
function openBatchBox() {
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
  if (!BatchBoxOpen) {
    BatchBox.style.display = 'block';
    BatchBoxOpen = true;
    // Hide the dashboard-container
    document.querySelector('.dashboard-container').style.display = 'none';
  }
}

//adding
function AddBatchDetails() {
  const BatchID = document.getElementById('BatchID').value;
  const batchName = document.getElementById('Batch_Name').value;

  // Validate fields
  if (!BatchID || !batchName) {
    showToastMessage('error', 'Please fill in all fields before adding the batch.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(BatchID)) {
    showToastMessage('error', 'Batch ID should be a number. Special characters are not allowed.');
    resetBatchField('BatchID');
    return;
  }

  // Validate batchName
  if (!isValidSentenceCaseWithNumbers(batchName)) {
    showToastMessage('error', 'Batch name with batch number.');
    resetBatchField('Batch_Name');
    return;
  }

  const formData = {
    BatchID: BatchID,
    batchName: batchName,
  };

  fetch('/submit_batch_form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // Use SweetAlert for success message
      Swal.fire({
        icon: 'success',
        title: 'Batch Added successfully!',
        showConfirmButton: false,
        timer: 2000 // Close the alert after 2 seconds
      });
      // Reset the form
      resetBatchForm();
    })
    .catch(error => {
      console.error('Error:', error);
      // Use SweetAlert for error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving batch. Please try again.'
      });
    });
}

//editing
function EditBatchDetails() {
  const BatchID = document.getElementById('BatchID').value;
  const batchName = document.getElementById('Batch_Name').value;

  // Validate fields
  if (!BatchID || !batchName) {
    showToastMessage('error', 'Please fill in all fields before editing the batch.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(BatchID)) {
    showToastMessage('error', 'Batch ID should be a number. Special characters are not allowed.');
    resetBatchField('BatchID');
    return;
  }

  // Validate batchName
  if (!isValidSentenceCaseWithNumbers(batchName)) {
    showToastMessage('error', 'Batch name should be in sentence case and with batch number.');
    resetBatchField('Batch_Name');
    return;
  }

  // Show confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to edit this batch. Proceed with caution.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, edit it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, proceed with editing
      fetch('/edit_batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BatchID: BatchID,
          batchName: batchName,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Use SweetAlert for success message
            Swal.fire({
              icon: 'success',
              title: 'Batch edited successfully!',
              showConfirmButton: false,
              timer: 2000 // Close the alert after 2 seconds
            });
            // Reset the form
            resetBatchForm();
          } else {
            // Use SweetAlert for error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error editing batch: ' + data.message
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          // Use SweetAlert for error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while editing the batch. Please try again.'
          });
        });
    }
  });
}

//deleting
function DeleteBatchDetails() {
  const BatchID = document.getElementById('BatchID').value;
  // Validate fields
  if (!BatchID) {
    showToastMessage('error', 'Please enter the Batch ID before deleting the batch.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(BatchID)) {
    showToastMessage('error', 'Batch ID should be a number. Special characters are not allowed.');
    resetBatchForm();
    return;
  }

  // Show confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this batch. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, proceed with deletion
      console.log('Deleting batch with ID:', BatchID);

      fetch('/delete_batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BatchID: BatchID,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);
          if (data.success) {
            // Use SweetAlert for success message
            Swal.fire({
              icon: 'success',
              title: 'Batch deleted successfully!',
              showConfirmButton: false,
              timer: 2000 // Close the alert after 2 seconds
            });

            // Reset the form
            resetBatchForm();
            // Additional logic or UI update as needed
          } else {
            // Use SweetAlert for error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting batch: ' + data.message
            });
          }
        })
        .catch(error => {
          console.error('Fetch Error:', error);
          // Use SweetAlert for error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while deleting the batch. Please try again.'
          });
        });
    }
  });
}

// Function to validate that the input is a number
function isValidNumber(number) {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(number);
}

function isValidSentenceCaseWithNumbers(text) {
  // Validate that the text is in sentence case and may include numbers
  const sentenceCaseWithNumbersRegex = /^[A-Z][a-zA-Z0-9]*(\s[A-Z][a-zA-Z0-9]*)*$/;
  return sentenceCaseWithNumbersRegex.test(text);
}


// Function to reset a specific input field
function resetBatchField(fieldName) {
  document.getElementById(fieldName).value = '';
}

//Reset Batch form
function resetBatchForm() {
  document.getElementById('BatchID').value = '';
  document.getElementById('Batch_Name').value = '';
}

function closeBatchBox() {
  BatchBox.style.display = 'none';
  BatchBoxOpen = false;
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
  fetchAndUpdateCounts();
}

//Program
function openProgramBox() {
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
  if (!ProgramBoxOpen) {
    ProgramBox.style.display = 'block';
    ProgramBoxOpen = true;
    // Hide the dashboard-container
    document.querySelector('.dashboard-container').style.display = 'none';
  }
}

//Adding
function AddProgramDetails() {
  const ProgramID = document.getElementById('ProgramID').value;
  const programName = document.getElementById('Program_Name').value;

  // Validate fields
  if (!ProgramID || !programName) {
    showToastMessage('error', 'Please fill in all fields before adding the program.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(ProgramID)) {
    showToastMessage('error', 'Program ID should be a number. Special characters are not allowed.');
    resetProgramField('ProgramID')
    return;
  }

  // Validate programName
  if (!isValidSentenceCase(programName)) {
    showToastMessage('error', 'Program name should be in sentence case.');
    resetProgramField('Program_Name')
    return;
  }

  const formData = {
    ProgramID: ProgramID,
    programName: programName,
  };

  fetch('/submit_program_form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // Use SweetAlert for success message
      Swal.fire({
        icon: 'success',
        title: 'Program added successfully!',
        showConfirmButton: false,
        timer: 2000 // Close the alert after 2 seconds
      });
      // Reset the form
      resetProgramForm();
    })
    .catch(error => {
      console.error('Error:', error);
      // Use SweetAlert for error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error saving program. Please try again.'
      });
    });
}


//editing
function EditProgramDetails() {
  const ProgramID = document.getElementById('ProgramID').value;
  const programName = document.getElementById('Program_Name').value;

  // Validate fields
  if (!ProgramID || !programName) {
    showToastMessage('error', 'Please fill in all fields before editing the program.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(ProgramID)) {
    showToastMessage('error', 'Program ID should be a number. Special characters are not allowed.');
    resetProgramField('ProgramID')
    return;
  }

  // Validate programName
  if (!isValidSentenceCase(programName)) {
    showToastMessage('error', 'Program name should be in sentence case.');
    resetProgramField('Program_Name')
    return;
  }

  // Show confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to edit this program. Proceed with caution.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, edit it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, proceed with editing
      fetch('/edit_program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ProgramID: ProgramID,
          programName: programName,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Use SweetAlert for success message
            Swal.fire({
              icon: 'success',
              title: 'Program edited successfully!',
              showConfirmButton: false,
              timer: 2000 // Close the alert after 2 seconds
            });
            // Reset the form
            resetProgramForm();
          } else {
            // Use SweetAlert for error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error editing program: ' + data.message
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          // Use SweetAlert for error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while editing the program. Please try again.'
          });
        });
    }
  });
}

//delete program
function DeleteProgramDetails() {
  const ProgramID = document.getElementById('ProgramID').value;

  // Validate fields
  if (!ProgramID) {
    showToastMessage('error', 'Please enter the Program ID before deleting the program.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(ProgramID)) {
    showToastMessage('error', 'Program ID should be a number. Special characters are not allowed.');
    resetProgramForm();
    return;
  }


  // Show confirmation dialog using SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this program. This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // User confirmed, proceed with deletion
      fetch('/delete_program', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ProgramID: ProgramID,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Server response:', data);
          if (data.success) {
            // Use SweetAlert for success message
            Swal.fire({
              icon: 'success',
              title: 'Program deleted successfully!',
              showConfirmButton: false,
              timer: 2000 // Close the alert after 2 seconds
            });

            // Reset the form
            resetProgramForm();
            // Additional logic or UI update as needed
          } else {
            // Use SweetAlert for error message
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error deleting program: ' + data.message
            });
          }
        })
        .catch(error => {
          console.error('Fetch Error:', error);
          // Use SweetAlert for error message
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while deleting the program. Please try again.'
          });
        });
    }
  });
}

// Function to validate that the input is a number
function isValidNumber(number) {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(number);
}

function isValidSentenceCase(text) {
  // Validate that the text is in sentence case (allowing all uppercase)
  const sentenceCaseRegex = /^[A-Z][a-z]*$/;
  const allUppercaseRegex = /^[A-Z]+$/;
  return sentenceCaseRegex.test(text) || allUppercaseRegex.test(text);
}

// Function to reset a specific input field
function resetProgramField(fieldName) {
  document.getElementById(fieldName).value = '';
}

function resetProgramForm() {
  // Clear the input values
  document.getElementById('ProgramID').value = '';
  document.getElementById('Program_Name').value = '';
}

function closeProgramBox() {
  ProgramBox.style.display = 'none';
  ProgramBoxOpen = false;
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
  fetchAndUpdateCounts();
}

//schedule
function openScheduleBox() {
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
  if (!ScheduleBoxOpen) {
    document.getElementById('scheduleBox').style.display = 'block';
    ScheduleBoxOpen = true;
    // Hide the dashboard-container
    document.querySelector('.dashboard-container').style.display = 'none';
  }
}

function closeScheduleBox() {
  document.getElementById('scheduleBox').style.display = 'none';
  ScheduleBoxOpen = false; // Reset the flag when closing the schedule box
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
  fetchAndUpdateCounts();
}

function openRescheduleBox() {
  closeScheduleBox()
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
  if (!rescheduleBoxOpen) {
    document.getElementById('rescheduleBox').style.display = 'block';
    rescheduleBoxOpen = true;
    // Initialize Flatpickr on date inputst
    flatpickr("#dateReschedule", {
      dateFormat: "Y-m-d", // Format the date as YYYY-MM-DD
      // Add any additional options here
    });
    // Hide the dashboard-container
    document.querySelector('.dashboard-container').style.display = 'none';
  }
}

function closeRescheduleBox() {
  openScheduleBox()
  document.getElementById('rescheduleBox').style.display = 'none';
  rescheduleBoxOpen = false; // Reset the flag when closing the schedule box
}

//close all boxes
function closeAllBoxes() {
  ['Course', 'Mentor', 'Batch', 'Program', 'Schedule'].forEach(box => {
    const closeFunction = window[`close${box}Box`];
    if (closeFunction) {
      closeFunction();
    }
  });
  fetchAndUpdateCounts();
}


// Calendar functions
function openCalendar() {
  closeScheduleBox(); // Close schedule box when opening calendar
  populateTable();
  closeUploadBox();
  closeUserManagement();
  document.getElementById('calendarContainer').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
  document.querySelector('.dashboard-container').style.display = 'none';

  // Pass the ID of the sidebar you want to toggle to toggleSidebar
  toggleSidebar('targetId'); // Replace 'yourSidebarId' with the actual ID of your sidebar
}

const scheduleData = [];

async function populateTable() {
  try {
    // Display loading indicator
    const loadingLogo = document.getElementById('loadingLogo');
    loadingLogo.style.display = 'block';

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

    // Track seen mentor names
    const seenMentorNames = {};
    const seenmoduleNames = {};

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
              //const parts2 = value.split(' :<br> ')[1].split(' <br> ');
              const modulepart = parts[1];
              const datepart = parts[2];
  
              /*console.log("Mentor Name:", mentorpart);
              console.log("Module Name:", modulepart);
              console.log("Date:", datepart);*/
  
              cell.innerHTML = `<span class="invisible">${mentorpart}</span><br>${modulepart}<br><span class="invisible">${datepart}</span>`;

              cell.addEventListener('click', function (event) {
                const clickedRowIndex = rowIndex;
                const topCellData = value;
                const leftCellData = scheduleData[clickedRowIndex][Object.keys(scheduleData[0])[0]];
                const datePart = topCellData.split(' <br> ')[2];
                console.log('leftcelldata: ', leftCellData);
                console.log('datePart:', datePart);
    
                showPopup(datePart, leftCellData);
    
                console.log(`Clicked Cell: (${datePart},${leftCellData})`);
              });
          }


        // Set background color based on conditions
        if (value != 'Not Scheduled' && columnIndex > 0 && !/^Week \d+$/.test(value)) {
          cell.style.backgroundColor = 'lightgreen';
        }
        if (columnIndex == 0) {
          cell.style.backgroundColor = 'lightblue';
        }
        if (/^Week \d+:<br> \d{4}-\d{2}-\d{2}$/.test(value)) {
          cell.style.backgroundColor = 'orange';
      }
           

        // Add drag-and-drop functionality to each cell
        makeCellDraggable(cell);
        makeDropTarget(cell);

        // Set background color based on seen mentor and module names
        if (columnIndex > 0) {
          const mentorModuleName = value.split(' <br> ');
          if (mentorModuleName.length >= 2) { // Check if the split operation yielded at least two parts
            const mentorName = mentorModuleName[0];
            const moduleName = mentorModuleName[1];
            /*const moduleName = moduleName1.split(' <br> ')[0];*/
            if (seenMentorNames[columnIndex] && seenMentorNames[columnIndex].hasOwnProperty(mentorName) && seenmoduleNames[columnIndex] && seenmoduleNames[columnIndex].hasOwnProperty(moduleName) && mentorName != 'Not Scheduled' && mentorName != 'Exam') {
              cell.style.backgroundColor = 'orange';
            }
            else if (seenMentorNames[columnIndex] && seenMentorNames[columnIndex].hasOwnProperty(mentorName) && mentorName != 'Not Scheduled' && mentorName != 'Exam') {
              cell.style.backgroundColor = 'red';
            }
          }
        }

        if (value.split(' <br> ')[2] < formattedDate1) {
          cell.style.backgroundColor = 'lightgray';
        }

        // Track seen mentor names
        seenMentorNames[columnIndex] = seenMentorNames[columnIndex] || {};
        const mentorName = value.split(' <br> ')[0];
        seenMentorNames[columnIndex][mentorName] = true;

        // Track seen module names
        seenmoduleNames[columnIndex] = seenmoduleNames[columnIndex] || {};
        /*const moduleName1 = value.split(' <br> ')[1];*/
        //if (moduleName1) { // Ensure moduleName1 exists before splitting it
        const moduleName = value.split(' <br> ')[1]; // Corrected splitting for moduleName
        seenmoduleNames[columnIndex][moduleName] = true;
        //}

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

const scheduleData1 = [];
async function populateTable1() {
  var rcount = 0;
  try {
    depopulateTable1();
    // Fetch mentor data
    // Fetch necessary data asynchronously
    const [mentorsData1, batchNames1, saturdayDates1] = await Promise.all([
      fetch('/get_mentorss').then(response => response.json()),
      fetch('/get_batch_names').then(response => response.json()),
      getSaturdaysInMonth()
    ]);

    // Clear existing scheduleData
    scheduleData1.length = 0;

    const scheduleItem1 = { batch: 'Batch' };

    // Create column headers for each Saturday date
    saturdayDates1.forEach((date, index) => {
      scheduleItem1[`cell${index + 1}`] = `Week ${index + 1}`;
    });


    // Populate scheduleData
    batchNames1.forEach(batch => {
      const scheduleItem1 = { batch };
      saturdayDates1.forEach((date, index) => {
        const mentorForWeek1 = mentorsData1.find(mentor => mentor.BatchName === batch && mentor.Date === date);
        const combinedData1 = mentorForWeek1 ? `${mentorForWeek1.MentorName} :<br> ${mentorForWeek1.ModuleName} <br> ${date}` : 'Not Scheduled';
        scheduleItem1[`cell${index + 1}`] = combinedData1;
      });
      scheduleData1.push(scheduleItem1);
    });

    // Now populate the table with the updated dynamic scheduleData
    const table1 = document.getElementById('scheduleTable1');
    const seenMentorNames1 = {};
    const seenmoduleNames1 = {};

    scheduleData1.forEach((item) => {
      const row = table1.insertRow();
      Object.values(item).forEach((value1, columnIndex) => { // Changed variable name to value1
        const cell = row.insertCell();
        cell.innerHTML = value1;

        if (columnIndex > 0) {
          const mentorModuleName1 = value1.split(' :<br> '); // Changed variable name to value1
          if (mentorModuleName1.length >= 2) { // Check if the split operation yielded at least two parts
            const mentorName1 = mentorModuleName1[0];
            const moduleName11 = mentorModuleName1[1];
            const moduleName1 = moduleName11.split(' <br> ')[0];
            if (seenMentorNames1[columnIndex] && seenMentorNames1[columnIndex].hasOwnProperty(mentorName1) && seenmoduleNames1[columnIndex] && seenmoduleNames1[columnIndex].hasOwnProperty(moduleName1) && mentorName1 != 'Not Scheduled' && mentorName1 != 'Exam') {
              cell.style.backgroundColor = 'blue';
            } else if (seenMentorNames1[columnIndex] && seenMentorNames1[columnIndex].hasOwnProperty(mentorName1) && mentorName1 != 'Not Scheduled' && mentorName1 != 'Exam') {
              cell.style.backgroundColor = 'red';
              rcount = rcount + 1;
            }
          }
        }

        // Track seen mentor names
        seenMentorNames1[columnIndex] = seenMentorNames1[columnIndex] || {};
        const mentorName1 = value1.split(' :<br> ')[0]; // Changed variable name to value1
        seenMentorNames1[columnIndex][mentorName1] = true;

        // Track seen module names
        seenmoduleNames1[columnIndex] = seenmoduleNames1[columnIndex] || {};
        const moduleName11 = value1.split(' :<br> ')[1]; // Changed variable name to value1
        if (moduleName11) { // Ensure moduleName1 exists before splitting it
          const moduleName1 = moduleName11.split(' <br> ')[0]; // Corrected splitting for moduleName
          seenmoduleNames1[columnIndex][moduleName1] = true;
        }
      });
    });

    //console.log("populate rcount:", rcount);
    return rcount;
  } catch (error) {
    //console.error('Error populating table:', error);
  }
}

function depopulateTable1() {
  try {
    const table1 = document.getElementById('scheduleTable1');

    // Remove all rows from the table, starting from the second row
    for (let i = table1.rows.length - 1; i > 1; i--) {
      table1.deleteRow(i);
    }

    // Clear existing scheduleData
    scheduleData1.length = 0;
  } catch (error) {
    console.error('Error depopulating table:', error);
  }
}

async function makeDropTarget(cell) {
  cell.addEventListener('dragover', function (event) {
    event.preventDefault();
  });

  const sat1 = await getSaturdaysInMonth();

  cell.addEventListener('drop', function (event) {
    event.preventDefault();

    const draggedData = event.dataTransfer.getData('text/plain');
    const draggedRowIndex = parseInt(event.dataTransfer.getData('rowIndex'));
    const draggedColumnIndex = parseInt(event.dataTransfer.getData('columnIndex'));
    //console.log("draggedColumnIndex: ", draggedColumnIndex);
    const droppedRowIndex = cell.parentNode.rowIndex;
    const currentCellData = cell.textContent || cell.innerText;
    //console.log('current cell data: ', currentCellData);
    const topColumnValue = getTopColumnValue(cell);

    console.log('topcolumnvalue: ', topColumnValue);
    console.log('scheduleData: ', scheduleData);
    console.log('draggedRowIndex: ', draggedRowIndex);
    console.log('droppedRowIndex: ', droppedRowIndex);
    console.log('Array.isArray(scheduleData): ', Array.isArray(scheduleData));
    console.log('scheduleData[droppedRowIndex]: ', scheduleData[droppedRowIndex - 2]);

    if (currentCellData == 'Not Scheduled') {
      if (scheduleData && Array.isArray(scheduleData) && scheduleData[droppedRowIndex - 2] && (draggedRowIndex === droppedRowIndex)) {
        // Set the HTML content of the drop target cell
        cell.innerHTML = draggedData;

        // Extract information from the dragged cell
        const topCellData = draggedData;
        console.log('topcelldata: ', topCellData);

        // Parse the HTML structure of topcelldata
        const parser = new DOMParser();
        const doc = parser.parseFromString(topCellData, 'text/html');

        // Get mentor, module, and date from the parsed HTML
        const mentorElement = doc.querySelector('span:nth-of-type(1)');
        const moduleElement = doc.querySelector('br + br');
        const dateElement = doc.querySelector('span:nth-of-type(2)');

        // Extract the text content from the elements
        const mentor = mentorElement.textContent.trim();
        const module = moduleElement.textContent.trim();
        const datePart = dateElement.textContent.trim();

        // Extract the batch from the dropped row
        const batch = scheduleData[droppedRowIndex - 1].batch;
        console.log('batch: ', batch);

        // Extract the value of the dropped cell column using cellIndex
        const droppedCellColumnValue = cell.cellIndex - 1;
        console.log('droppedCellColumnValue: ', droppedCellColumnValue);

        // Extract the date part from the dragged cell's content
        //const datePart = topCellData.split(' <br> ')[2];
        console.log('date: ', datePart);

        const currentDate1 = new Date().toLocaleDateString();


        //const mentor = topCellData.split(' <br> ')[0];
        console.log('mentor: ', mentor);
        console.log('datePart:', datePart);
        console.log('currentDate1:', currentDate1);

        const parts = currentDate1.split('/'); // Split the string into parts based on '/'
        const formattedDate = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
        console.log('formattedDate:', formattedDate);
        const cdate = formattedDate.toISOString().split('T')[0];
        console.log('cdate:', cdate);

        if (sat1[topColumnValue - 1] < cdate) {
          cell.innerHTML = 'Not Scheduled';
          showToastMessage('error', 'Cannot Schedule as the Date is before today')
        }
        else {
          dropcell11(datePart, batch, droppedCellColumnValue, mentor);
        }

        // Call your function with the extracted information

      } else {
        // Prevent dropping in a different row and display an alert
        showToastMessage('error', 'You can only drop in the same batch.');
      }
    }
    else {
      showToastMessage('error', " Sorry, this week is already scheduled with another mentor. Please choose a different week  ")
    }
  });
}

function getTopColumnValue(cell) {
  // Find the table element containing the cell
  const table = cell.closest('table');
  if (!table) return null;

  // Find the first row (header row) of the table
  const headerRow = table.querySelector('tr');
  if (!headerRow) return null;

  // Find the cell in the same column as the dropped cell
  const columnIndex = cell.cellIndex;
  console.log(columnIndex)


  // Extract the value from the top column cell
  return columnIndex
}

async function dropcell11(datePart, batch, droppedCellColumnValue, mentor) {

  const sat = await getSaturdaysInMonth();
  console.log('sat: ', sat);
  console.log('sat: ', sat[droppedCellColumnValue]);

  const url = `/drop_schedule?datePart=${encodeURIComponent(datePart)}&batch=${encodeURIComponent(batch)}&newdate=${encodeURIComponent(sat[droppedCellColumnValue])}&mentor=${encodeURIComponent(mentor)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      console.log('Schedule Updated');
      populateTable();
    });
}


function makeCellDraggable(cell) {
  cell.setAttribute('draggable', true);

  cell.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text/plain', cell.innerHTML);
    event.dataTransfer.setData('rowIndex', cell.parentNode.rowIndex);
    const topColumnValue = getTopColumnValue(cell);
    event.dataTransfer.setData('columnIndex', topColumnValue);
    cell.classList.add('dragging');
  });

  cell.addEventListener('dragend', function () {
    cell.classList.remove('dragging');
  });
  cell.addEventListener('mouseenter', function () {
    const content = cell.innerHTML;
    showPopupOnCell(cell, content);
  });
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

function closeCalendar() {
  document.getElementById('calendarContainer').style.display = 'none';
  document.getElementById('overlay').style.display = 'none';

  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
  dashboardContainer.style.width = ''; // Reset width to its original value
  fetchAndUpdateCounts();
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

// Helper function to create and populate a dropdown
function createAndPopulateDropdown(parentElement, id, dvalue, options) {
  const dropdown = parentElement.querySelector(`#${id}`);
  dropdown.innerHTML = `<option value="">${dvalue}</option>`;
  dropdown.innerHTML += options.map(value => `<option value="${value}">${value}</option>`).join('');
}

//show popup
function showPopup(td, ld) {
  closeCalendar();
  // Hide the dashboard-container
  document.querySelector('.dashboard-container').style.display = 'none';

  const popupContainer = document.getElementById('PopupContainer');
  const scheduleItemElement = document.getElementById('scheduleItem');
  const overlayElement = document.getElementById('overlay');

  // Show loading indicator
  const popupLoading = document.getElementById('popupLoading');
  popupLoading.style.display = 'block';

  scheduleItemElement.style.display = 'block';
  overlayElement.style.display = 'block';

  // Add event listener to close popup when overlay is clicked
  overlay.addEventListener('click', closePopups);

  const url = `/show_schedule?td=${encodeURIComponent(td)}&ld=${encodeURIComponent(ld)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(async data => {
      console.log('Schedule Data received:', data);

      // Call populateDropdownValues function to populate dropdowns
      const data1 = await fetchDropdownValues();
      return ({ data, data1 });
    })
    .then(({ data, data1 }) => {
      const scheduleItemsContainer = document.createElement('div');
      scheduleItemsContainer.id = 'schedulePopup';

      const closeButtonContainer = document.createElement('div');
      closeButtonContainer.id = 'closeButtonContainer';
      closeButtonContainer.onclick = closePopups;
      closeButtonContainer.innerHTML = '&times;';

      scheduleItemsContainer.appendChild(closeButtonContainer);

      const heading = document.createElement('h2');
      heading.innerText = 'Schedule Details';
      scheduleItemsContainer.appendChild(heading);

      data.forEach(schedule => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'scheduleItem';
        scheduleItem.innerHTML = `
          <p><strong><i class="fas fa-book"></i> Module Name:</strong></p>
          <select id="CourseName12" name="CourseName12" required></select>
          <p><strong><i class="fas fa-user"></i> Mentor Name:</strong></p>
          <select id="MentorName12" name="MentorName12" required></select>
          <p><strong><i class="fas fa-book"></i> Batch Name:</strong></p>
          <select id="batch12" name="batch12" required></select>
          <p><strong><i class="fas fa-book"></i> Program Name:</strong></p>
          <select id="program12" name="program12" required></select>
          <p><strong><i class="far fa-calendar-alt"></i> Date:</strong><span>${schedule.SDate}</span></p>
          <input type="text" id="scheduleDate12" name="scheduleDate12" placeholder="Select a date" required style="color: black; padding: 10px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 15px; font-family: 'Martain'; transition: background-color 0.3s ease, box-shadow 0.3s ease; cursor: pointer;">
          <div style="justify-content: space-between; align-items: center;">
            <button style="background-color: orange; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 15px; font-family: 'Poppins'; transition: background-color 0.3s ease, box-shadow 0.3s ease; margin-top: 10px;" onmouseover="this.style.backgroundColor='darkorange'" onmouseout="this.style.backgroundColor='orange'" onclick="saveChanges('${schedule.ScheduleID}', '${schedule.Name}', '${schedule.MentorName}', '${schedule.BatchName}', '${schedule.ProgramName}', '${schedule.SDate}' )"><i class="fas fa-save" style="margin-right: 5px;"></i> Save Changes</button>
            <button style="background-color: orange; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 15px; font-family: 'Poppins'; transition: background-color 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.backgroundColor='darkorange'" onmouseout="this.style.backgroundColor='orange'" onclick="deleteSchedule('${schedule.ScheduleID}')"><i class="fas fa-trash-alt" style="margin-right: 5px;"></i> Delete</button>
          </div>
        `;
        createAndPopulateDropdown(scheduleItem, 'CourseName12', schedule.Name, data1.courses);
        createAndPopulateDropdown(scheduleItem, 'MentorName12', schedule.MentorName, data1.mentors);
        createAndPopulateDropdown(scheduleItem, 'batch12', schedule.BatchName, data1.batches);
        createAndPopulateDropdown(scheduleItem, 'program12', schedule.ProgramName, data1.programs);

        // Set minimum date for the dynamically created date input
        const dateInput = scheduleItem.querySelector('#scheduleDate12');
        dateInput.min = new Date().toISOString().split('T')[0];

        scheduleItemsContainer.appendChild(scheduleItem);
        // Initialize Flatpickr for the dynamically created date input
        const dateInput1 = scheduleItem.querySelector('#scheduleDate12');
        flatpickr(dateInput1, {
          dateFormat: 'Y-m-d', // Set the date format
          allowInput: true, // Allow manual input in addition to date selection
          minDate: 'today' // Set minimum date to today
        });
      });

      popupContainer.innerHTML = '';
      popupContainer.appendChild(scheduleItemsContainer);
      popupContainer.style.display = 'block';

      // Hide loading indicator
      popupLoading.style.display = 'none';
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



function saveChanges(ScheduleID, ScheduleModule, ScheduleMentor, ScheduleBatch, ScheduleProgram, ScheduleDate) {
  const courseNameElement = document.getElementById('CourseName12');
  const mentorNameElement = document.getElementById('MentorName12');
  const batchNameElement = document.getElementById('batch12');
  const programNameElement = document.getElementById('program12');
  const scheduleDateElement = document.getElementById('scheduleDate12');

  const courseName = courseNameElement.value || ScheduleModule;
  const mentorName = mentorNameElement.value || ScheduleMentor;
  const batchName = batchNameElement.value || ScheduleBatch;
  const programName = programNameElement.value || ScheduleProgram;
  const scheduleDate = scheduleDateElement.value || ScheduleDate;

  const confirmationMessage = 'Are you sure you want to save changes?';

  Swal.fire({
    title: 'Confirmation',
    text: confirmationMessage,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, save changes',
    cancelButtonText: 'No, cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      if (ScheduleID && courseName !== '' && mentorName !== '' && batchName !== '' && programName !== '' && scheduleDate !== '') {
        const data = {
          ScheduleID: ScheduleID,
          courseName: courseName,
          mentorName: mentorName,
          batchName: batchName,
          programName: programName,
          scheduleDate: scheduleDate,
        };

        const url = '/update_schedule';
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }).then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        }).then(updatedData => {
          if (updatedData.error) {
            Swal.fire('Error', updatedData.error, 'error');
          } else {
            console.log('Schedule updated:', updatedData);
            courseNameElement.innerText = updatedData.courseName;
            mentorNameElement.innerText = updatedData.mentorName;
            batchNameElement.innerText = updatedData.batchName;
            programNameElement.innerText = updatedData.programName;
            scheduleDateElement.innerText = updatedData.scheduleDate;

            Swal.fire('Success', 'Schedule edited successfully', 'success').then(() => {
              closePopups();
            });
          }
        }).catch(error => {
          console.error('Error:', error);
          Swal.fire('Error', 'An error occurred while processing your request', 'error');
        });
      } else {
        console.error('Invalid parameters for update_schedule request');
        console.log('ScheduleID:', ScheduleID);
        console.log('courseName:', courseName);
        console.log('mentorName:', mentorName);
        console.log('batchName:', batchName);
        console.log('programName:', programName);
        console.log('scheduleDate:', scheduleDate);
      }
    } else {
      console.log('Changes not saved.');
    }
  });
}

function deleteSchedule(scheduleID) {
  // Display a confirmation prompt using SweetAlert before deleting the schedule
  Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to delete this schedule?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'No, cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Perform an AJAX request or fetch to send the data to the server
      const url = '/delete_schedule';
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ScheduleID: scheduleID }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(responseData => {
          console.log('Schedule deleted:', responseData);

          // Display a success message using SweetAlert when the schedule is deleted successfully
          Swal.fire('Success', 'Schedule deleted successfully', 'success').then(() => {
            // Close the popup or perform any other necessary actions
            closePopups();
          });
        })
        .catch(error => console.error('Error:', error));
    } else {
      // User clicked "Cancel" in the confirmation prompt
      console.log('Deletion canceled.');
    }
  });
}

function closePopups() {
  const popupContainer = document.getElementById('schedulePopup');
  popupContainer.style.display = 'none';
  // Remove event listener to prevent unwanted closing
  overlay.removeEventListener('click', closePopups);
  // Open the calendar after closing popups
  openCalendar();
}


function initializeFlatpickr() {
  flatpickr("#date", {
    dateFormat: "Y-m-d",
    minDate: "today" // Set the minimum date to today
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
      populateDropdown($('#CourseName11'), data.courses, 'Course Name');
      populateDropdown($('#MentorName11'), data.mentors, 'Mentor Name');
      populateDropdown($('#batch11'), data.batches, 'Batch');
      populateDropdown($('#program11'), data.programs, 'Program');
    } else {
      console.log('Invalid data received from the server.');
      // Handle invalid data as needed
    }
  } catch (error) {
    // Handle the error, e.g., display an error message to the user
    console.error('Error during dropdown population:', error);
  }
}

// Call the function to populate dropdowns when the document is ready
$(document).ready(populateDropdownValues);


//Schedule successful!
function redirectToIndex() {
  // Redirect to index.html
  window.location.href = '/index';  // Adjust the URL as needed
}

//landing page
function redirectToIndex1() {
  window.location.href = '/index';
}

// Function to open user management
function openUserManagement() {
  closeAllBoxes();
  closeUploadBox();
  closeGetReportBox();
  // Show the user management div
  document.getElementById('userManagement').style.display = 'block';
  // Call function to populate user list
  populateUserList();
  document.querySelector('.dashboard-container').style.display = 'none';
}

// Function to populate user list
function populateUserList() {
  // User data
  $(document).off('click', '.delete-btn');
  $(document).off('click', '.edit-btn');

  fetch('/users') // URL of the Flask route to fetch user data
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // On success, populate user list with the fetched data
      var userListData = data;
      var userListHTML = '';
      for (var i = 0; i < userListData.length; i++) {
        userListHTML += '<tr>';
        userListHTML += '<td>' + userListData[i].userName + '</td>';
        userListHTML += '<td class="roles-column">';
        userListHTML += '<select class="role-dropdown">';
        userListHTML += '<option value="" disabled selected>' + userListData[i].userRole + '</option>'; // Placeholder
        userListHTML += '<option value="user">User</option>'; // User role
        userListHTML += '<option value="admin">Admin</option>'; // Admin role
        userListHTML += '</select>';
        userListHTML += '</td>';
        userListHTML += '<td>';
        userListHTML += '<button class="edit-btn" data-userid="' + userListData[i].userId + '"><i class="fas fa-edit"></i> Edit</button>';
        userListHTML += '<button class="delete-btn" data-userid="' + userListData[i].userId + '"><i class="fas fa-trash-alt"></i> Delete</button>';
        userListHTML += '</td>';
        userListHTML += '</tr>';
      }
      $('#userList').html(userListHTML); // Populate the table body with user list HTML
    })
    .catch(error => {
      // On error, log the error message
      console.error('Error fetching user data:', error);
    });

  // Event listener for edit button click
  $(document).on('click', '.edit-btn', function () {
    var userId = $(this).data('userid');
    var selectedRole = $(this).closest('tr').find('.role-dropdown').val(); // Get selected role value from the closest row

    // Display confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to edit this user's role?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, edit it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/edit_userr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userId, userRole: selectedRole }) // Send userId in JSON format
        })
          .then(response => response.json())
          .then(data => {
            // Display success alert using SweetAlert
            Swal.fire(
              'Success!',
              'User Role Edited Successfully',
              'success'
            );
            // Close and open user management after a delay
            setTimeout(() => {
              closeUserManagement();
              openUserManagement();
            }, 2000); // Adjust the delay as needed
          })
          .catch(error => {
            // Handle error response from the server
            console.error('Error:', error); // Log the error
            Swal.fire(
              'Error!',
              'An error occurred while editing user.',
              'error'
            );
          });
      }
    });
  });

  // Event listener for delete button click
  $(document).on('click', '.delete-btn', function () {
    var userId = $(this).data('userid');

    // Display confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/delete_userr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId: userId }) // Send userId in JSON format
        })
          .then(response => response.json())
          .then(data => {
            // Handle success response from the server
            Swal.fire(
              'Deleted!',
              'User has been deleted.',
              'success'
            );
            closeUserManagement();
            openUserManagement();
          })
          .catch(error => {
            // Handle error response from the server
            console.error('Error:', error); // Log the error
            Swal.fire(
              'Error!',
              'An error occurred while deleting user.',
              'error'
            );
          });
      }
    });
  });

  // Search functionality
  $('#searchInputs').on('input', function () {
    var searchText = $(this).val().toLowerCase();
    $('#userList tr').each(function () {
      var userName = $(this).find('td:first').text().toLowerCase();
      if (userName.includes(searchText)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
}

// Function to close user management
function closeUserManagement() {
  document.getElementById('userManagement').style.display = 'none';
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
}

//get report
function openGetReportBox() {
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
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
  document.querySelector('.dashboard-container').style.display = 'none';
}

function closeGetReportBox() {
  var reportBox = document.getElementById('report-box');
  reportBox.style.display = 'none';
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
}

function resetFromDateInput() {
  // Assuming you're using Flatpickr, you can reset the 'from-date' input like this
  var fromDateInput = document.getElementById('from-date');
  var toDateInput = document.getElementById('to-date');
  fromDateInput._flatpickr.clear();
  toDateInput._flatpickr.clear();  // Clear the selected date
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
      resetFromDateInput();
    }
  };
  xhr.send();
}

//upload box
function openUploadBox() {
  closeAllBoxes();
  closeUserManagement();
  closeGetReportBox();
  document.getElementById('uploadBox').style.display = 'block';
  document.querySelector('.dashboard-container').style.display = 'none';
}


//file upload
var storedData = [];
var currentPage = 0;
var rowsPerPage = 10; // Set the number of rows per page

function uploadFile() {
  var modal = document.getElementById("uploadBox");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  var fileInput = document.getElementById('fileInput');
  var uploadedFile = fileInput.files[0];

  if (!uploadedFile) {
    showToastMessage('error', 'Please select a file to upload.');
    return;
  }

  // Check if the file is an Excel file
  if (!uploadedFile.name.endsWith('.xlsx') && !uploadedFile.name.endsWith('.xls')) {
    showToastMessage('error', 'Please upload an Excel file.');
    return;
  }

  var reader = new FileReader();
  reader.onload = function (e) {
    try {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, { type: 'array' });
      var sheetName = workbook.SheetNames[0];
      var sheet = workbook.Sheets[sheetName];

      // Check if the first row contains required headers
      var requiredHeaders = ['module', 'mentor', 'program', 'batch', 'Date'];
      var headerRow = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];
      var headerRowLowercase = headerRow.map(header => header.toLowerCase());
      var requiredHeadersLowercase = requiredHeaders.map(header => header.toLowerCase());
      var missingHeaders = requiredHeadersLowercase.filter(header => !headerRowLowercase.includes(header));
      if (missingHeaders.length > 0) {
        showToastMessage('error', 'The uploaded file is missing the following headers or misspelled: ' + missingHeaders.join(', '));
        return;
      }

      // Convert all data to strings
      var range = XLSX.utils.decode_range(sheet['!ref']);
      for (var rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        for (var colNum = range.s.c; colNum <= range.e.c; colNum++) {
          var cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
          if (sheet[cellAddress]) {
            sheet[cellAddress].v = sheet[cellAddress].v.toString();
            sheet[cellAddress].t = 's'; // Set the cell type to string
          }
        }
      }

      // Read and validate data row-wise
      var rows = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 });
      var nonEmptyRows = [];
      rows.forEach(row => {
        if (row.every(cell => cell.trim() !== '')) {
          nonEmptyRows.push(row);
        }
      });

      // Check if there are empty rows
      if (nonEmptyRows.length !== rows.length) {
        showToastMessage('error', 'Please upload the file with all rows filled.');
        return;
      }

      // Send non-empty rows to Flask Python function
      if (nonEmptyRows.length > 0) {
        // Assuming you have a function sendDataToFlask() to send data to Flask
        sendDataToFlask(nonEmptyRows);
      } else {
        showToastMessage('error', 'No data to upload.');
      }

      // Display the modal at the top
      modal.style.display = "block";
      //modal.style.top = "55%"; // Adjusting modal to appear at the top
    } catch (error) {
      console.error('Error converting Excel to HTML:', error);
      // Provide specific error messages based on the type of error
      if (error instanceof SyntaxError) {
        alert('Invalid Excel file format. Please ensure the file is in a valid Excel format.');
      } else if (error instanceof ReferenceError) {
        alert('Error processing Excel file. Please try again later or contact support.');
      } else {
        showToastMessage('error', 'Error converting Excel to HTML. Please try again.');
      }
    }
  };
  reader.readAsArrayBuffer(uploadedFile);
}

function sendDataToFlask(data) {
  // Convert JavaScript array to JSON string
  var jsonData = JSON.stringify(data);

  const url = `/upload_schedule11`;

  // Fetch request to send data to Flask route
  fetch(url, {
    method: 'POST', // Specify the HTTP method as POST
    headers: {
      'Content-Type': 'application/json' // Set the content type header
    },
    body: jsonData // Pass the JSON data as the request body
  })
    .then(response => {
      if (response.ok) {
        // Reset file input after successful upload
        document.getElementById('fileInput').value = '';
        // Display success dialog using SweetAlert
        Swal.fire(
          'Success!',
          'Data Uploaded successfully!',
          'success'
        ).then((result) => {
          if (result.isConfirmed) {
            // Close the upload box after successful upload
            closeUploadBox();
            // Show the dashboard-container
            var dashboardContainer = document.querySelector('.dashboard-container');
            dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
          }
        });
      } else if (response.status === 400) {
        showToastMessage('error', 'Failed to upload data. Please enter correct data or ensure date is after today.');
      } else {
        showToastMessage('error', 'Failed to upload data. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error uploading data:', error);
      showToastMessage('error', 'Failed to upload data. Please try again later.');
    });
}

function closeUploadBox() {
  var uploadBox = document.getElementById('uploadBox');
  uploadBox.style.display = 'none';
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
}

//counts
function fetchAndUpdateCounts() {
  var rcount1 = 0;
  // Call the populateTable1 function asynchronously
  populateTable1().then(rcount => {
    console.log("Number of red cells:", rcount);
    rcount1 = rcount;

    // Fetch counts after populateTable1 is finished
    fetch("/get_counts")
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch counts');
        }
        return response.json();
      })
      .then(data => {
        console.log("Server response:", data);
        // Update counts on the dashboard
        document.getElementById("module_count").textContent = data.module_count;
        console.log("module count: ", data.module_count);
        document.getElementById("mentor_count").textContent = data.mentor_count;
        document.getElementById("batch_count").textContent = data.batch_count;
        document.getElementById("program_count").textContent = data.program_count;
        document.getElementById("scheduled_count").textContent = data.scheduled_count;
        document.getElementById("conflict_count").textContent = rcount1;
        document.getElementById("complete_count").textContent = data.completed_count;
        document.getElementById("Active_count").textContent = data.active_count;

        // Update active module list
        const activityModuleList = document.getElementById("activeModule");
        activityModuleList.innerHTML = ''; // Clear previous content
        data.Active_count1.forEach(moduleName => {
          const listItem = document.createElement('li');
          listItem.textContent = moduleName;
          activityModuleList.appendChild(listItem);
        });

        // Update complete module list
        const completeModuleList = document.getElementById("Completed-Module");
        completeModuleList.innerHTML = ''; // Clear previous content
        data.completed_count1.forEach(moduleName11 => {
          const listItem = document.createElement('li');
          listItem.textContent = moduleName11;
          completeModuleList.appendChild(listItem);
        });

        // Show the dashboard container after updating counts
        document.getElementById("dashboard-container").style.display = "block";
      })
      .catch(error => {
        console.error(error.message);
      });
  }).catch(error => {
    console.error('Error populating table:', error);
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  initializeFlatpickr();
  await populateDropdownValues(); // Wait for populateDropdownValues to complete
  fetchAndUpdateCounts();
});

// Check if the page is loaded from a refresh
/**$(document).ready(function() {
  if (performance.navigation.type === 1) {
      // Page is reloaded
      window.location.href = '/logout';  // Redirect to logout route
  }
});**/

//Login Page
function toggleDisplay(elementIdToShow, elementIdsToHide) {
  document.getElementById(elementIdToShow).style.display = 'block';

  for (const elementId of elementIdsToHide) {
    document.getElementById(elementId).style.display = 'none';
  }
}

function toggleSignIn() {
  toggleDisplay('login-box', ['reset-box', 'signup-box']);
}

function toggleSignUp() {
  toggleDisplay('signup-box', ['login-box']);
}

function toggleReset() {
  toggleDisplay('reset-box', ['login-box']);
}

function togglePassword(passwordFieldId) {
  const passwordInput = document.getElementById(passwordFieldId);
  const togglePasswordContainer = passwordInput.parentElement;
  const eyeIcon = togglePasswordContainer.querySelector(".toggle-password i");

  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  eyeIcon.classList.toggle("fa-eye");
  eyeIcon.classList.toggle("fa-eye-slash");
}

function validateSignupForm() {
  const signupEmail = document.getElementById("EmailAddress").value;
  const signupPassword = document.getElementById("signup-password").value;

  const emailRegex = /^[a-zA-Z0-9._-]+@reva\.edu\.in$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!emailRegex.test(signupEmail)) {
    alert("Invalid email address. Please use the example@reva.edu.in format.");
    return false;
  }

  if (!passwordRegex.test(signupPassword)) {
    alert("Password must be at least 8 characters long, contain at least one special character, one number, and include a capital letter.");
    return false;
  }

  return true;
}


window.addEventListener('load', function () {
  const welcomeText = "Welcome to Race Portal, ";
  document.getElementById("welcomeText").innerHTML = "";
  typeWriter(welcomeText, 0, fadeInUsername);
});


//Logs
function initializeLogging() {
  var activityLog = document.getElementById('activityLog');

  function logActivity(action, details) {
    var listItem = document.createElement('li');
    listItem.textContent = action + ": " + details;
    activityLog.appendChild(listItem);

    // Save log to local storage
    var logData = JSON.parse(localStorage.getItem('activityLog')) || [];
    logData.push({ action: action, details: details });
    localStorage.setItem('activityLog', JSON.stringify(logData));
  }

  function sendActivity(action, details) {
    // Simulating AJAX request to server
    // Replace this with actual AJAX request to your server
    setTimeout(function () {
      // Simulating success callback
      logActivity(action, details);
    }, 500); // Simulating a delay of 500 milliseconds
  }

  // Logging button clicks for course form
  document.getElementById('courseForm').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      var buttonText = event.target.textContent.trim();
      if (buttonText === "Add") {
        sendActivity("Course Added", "Course ID: " + document.getElementById('CourseID').value);
      } else if (buttonText === "Edit") {
        var courseId = event.target.dataset.courseId;
        sendActivity("Course Edited", "Course ID: " + courseId);
      } else if (buttonText === "Delete") {
        var courseId = event.target.dataset.courseId;
        sendActivity("Course Deleted", "Course ID: " + courseId);
      } else {
        sendActivity("Button Click", 'Course ' + buttonText);
      }
    }
  });

  // Logging button clicks for mentor form
  document.getElementById('mentorForm').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      var buttonText = event.target.textContent.trim();
      if (buttonText === "Add") {
        sendActivity("Mentor Added", "Mentor ID: " + document.getElementById('mentorId').value);
      } else if (buttonText === "Edit") {
        var mentorId = event.target.dataset.mentorId;
        sendActivity("Mentor Edited", "Mentor ID: " + mentorId);
      } else if (buttonText === "Delete") {
        var mentorId = event.target.dataset.mentorId;
        sendActivity("Mentor Deleted", "Mentor ID: " + mentorId);
      } else {
        sendActivity("Button Click", 'Mentor ' + buttonText);
      }
    }
  });

  // Logging button clicks for Batch form
  document.getElementById('BatchForm').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      var buttonText = event.target.textContent.trim();
      if (buttonText === "Add") {
        sendActivity("Batch Added", "Batch ID: " + document.getElementById('BatchID').value);
      } else if (buttonText === "Edit") {
        var batchId = event.target.dataset.batchId;
        sendActivity("Batch Edited", "Batch ID: " + batchId);
      } else if (buttonText === "Delete") {
        var batchId = event.target.dataset.batchId;
        sendActivity("Batch Deleted", "Batch ID: " + batchId);
      } else {
        sendActivity("Button Click", 'Batch ' + buttonText);
      }
    }
  });

  // Logging button clicks for Program form
  document.getElementById('ProgramForm').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      var buttonText = event.target.textContent.trim();
      if (buttonText === "Add") {
        sendActivity("Program Added", "Program ID: " + document.getElementById('ProgramID').value);
      } else if (buttonText === "Edit") {
        var programId = event.target.dataset.programId;
        sendActivity("Program Edited", "Program ID: " + programId);
      } else if (buttonText === "Delete") {
        var programId = event.target.dataset.programId;
        sendActivity("Program Deleted", "Program ID: " + programId);
      } else {
        sendActivity("Button Click", 'Program ' + buttonText);
      }
    }
  });

  // Logging button clicks for schedule form
  document.getElementById('scheduleForm').addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
      var buttonText = event.target.textContent.trim();
      if (buttonText === "Schedule") {
        sendActivity("Schedule Added", "Module Name: " + document.getElementById('CourseName11').value);
      } else if (buttonText === "View Schedule") {
        sendActivity("View Schedule", "Clicked");
      } else {
        sendActivity("Button Click", 'Schedule ' + buttonText);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initializeLogging);


//Quick Guide
function toggleQuickGuide() {
  var popupContainer = document.getElementById("popupContainer");
  var video = popupContainer.querySelector("video");
  if (popupContainer.style.display === "block") {
    popupContainer.style.display = "none";
    video.pause(); // Pause the video when closing the popup
  } else {
    popupContainer.style.display = "block";
    video.play(); // Play the video when opening the popup
  }
}

function closePopup() {
  var popupContainer = document.getElementById("popupContainer");
  var video = popupContainer.querySelector("video");
  popupContainer.style.display = "none";
  video.pause(); // Pause the video when closing the popup
}

// Function to open profile popup
function openProfilePopup() {
  closeAllBoxes();
  closeChangePasswordPopup();
  closeUploadBox();
  closeUserManagement();
  var overlay = document.getElementById('overlay');
  var popup = document.getElementById('profileBox');

  overlay.style.display = 'block';
  popup.style.display = 'block';
  // Hide the dashboard-container
  document.querySelector('.dashboard-container').style.display = 'none';

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

  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
}

// Function to fetch batch options from the backend and populate checkboxes
function populateBatchOptions() {
  fetch('/batch-options')
    .then(response => response.json())
    .then(data => {
      // Sort the batches alphabetically
      data.sort();

      const batchSelection = document.getElementById('batchSelection');
      batchSelection.innerHTML = ''; // Clear previous options

      // Calculate the number of columns
      const numColumns = 3;
      const numRows = Math.ceil(data.length / numColumns);

      // Create a container for each row of checkboxes and labels
      for (let i = 0; i < numRows; i++) {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row-container');
        batchSelection.appendChild(rowContainer);

        // Create checkboxes and labels for each batch
        for (let j = 0; j < numColumns; j++) {
          const index = i * numColumns + j;
          if (index < data.length) {
            const option = data[index];

            // Create checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `batch${option}`;
            checkbox.name = `batch${option}`;
            checkbox.value = option;

            // Create label
            const label = document.createElement('label');
            label.htmlFor = `batch${option}`;
            label.appendChild(document.createTextNode(option));

            // Append checkbox and label to row container
            const checkboxLabelContainer = document.createElement('div');
            checkboxLabelContainer.classList.add('checkbox-label-container');
            checkboxLabelContainer.appendChild(checkbox);
            checkboxLabelContainer.appendChild(label);
            rowContainer.appendChild(checkboxLabelContainer);
          }
        }
      }

      // Add "Select All" option
      const selectAllCheckbox = document.createElement('input');
      selectAllCheckbox.type = 'checkbox';
      selectAllCheckbox.id = 'selectAllBatches';
      selectAllCheckbox.addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('#batchSelection input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
          checkbox.checked = this.checked;
        });
      });
      const selectAllLabel = document.createElement('label');
      selectAllLabel.htmlFor = 'selectAllBatches';
      selectAllLabel.appendChild(document.createTextNode('Select All'));

      // Append "Select All" checkbox and label
      batchSelection.prepend(selectAllLabel);
      batchSelection.prepend(selectAllCheckbox);
    })
    .catch(error => console.error('Error fetching batch options:', error));
}

function clearRescheduleForm() {
  // Get the form element
  const form = document.getElementById('rescheduleForm');

  // Reset the form fields
  form.reset();
}


// Call the function to populate batch options when the page loads
document.addEventListener('DOMContentLoaded', populateBatchOptions);
function validateReScheduleForm() {
  // Check if any batch is selected
  var batchSelection = document.querySelectorAll('#batchSelection input[type="checkbox"]:checked');
  if (batchSelection.length === 0) {
    showToastMessage('error', 'Please select at least one batch.');
    return false; // Prevent form submission
  }

  // Populate selected batch values
  var selectedBatches = [];
  batchSelection.forEach(function (checkbox) {
    selectedBatches.push(checkbox.value);
  });
  document.getElementById('selectedBatches').value = JSON.stringify(selectedBatches);

  // Populate count by weeks value
  var countByWeeks = document.getElementById('count').value;
  document.getElementById('countByWeeks').value = countByWeeks;

  // Populate date value
  var rescheduleDate = document.getElementById('dateReschedule').value;
  document.getElementById('rescheduleDate').value = rescheduleDate;

  // Check if count is valid (optional)

  // Check if date is today and a Saturday
  var selectedDate = new Date(rescheduleDate);
  console.log('selectdate:', selectedDate);
  var today = new Date();
  console.log('today:', today);
  var isSaturday = selectedDate.getDay() === 6;
  console.log('issaturday:', isSaturday);

  if (selectedDate < today || !isSaturday) {
    showToastMessage('error', 'Please select a Saturday from today.');
    return false;
  }
  // Show confirmation alert before rescheduling using SweetAlert
  Swal.fire({
    title: 'Are you sure?',
    text: 'Are you sure you want to reschedule?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, reschedule it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Call reschedule function if user confirms
      reschedule();
    }
  });
}

function reschedule() {
  // Fetch request to submit form data
  fetch('/ReSchedule', {
    method: 'POST',
    body: new FormData(document.getElementById('rescheduleForm'))
  })
    .then(response => {
      if (response.ok) {
        // Display success dialog using SweetAlert
        Swal.fire(
          'Success!',
          'Reschedule successful!',
          'success'
        );

        // Clear the form
        clearRescheduleForm();
      } else {
        // Show failure alert
        showToastMessage('error', 'Failed to reschedule. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error rescheduling:', error);
      // Show failure alert
      showToastMessage('error', 'Failed to reschedule. Please try again later.');
    });
}

// Function to open change password popup
function openChangePasswordPopup() {
  closeAllBoxes();
  closeProfilePopup();
  closeUploadBox();
  closeUserManagement();
  var overlay = document.getElementById('overlay');
  var popup = document.getElementById('changePasswordBox');

  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Hide the dashboard-container
  document.querySelector('.dashboard-container').style.display = 'none';

  // Add event listener to close change password popup when overlay is clicked
  overlay.addEventListener('click', closeChangePasswordPopup);

  // Event listener for change password form submission
  document.getElementById('edit-profile-forms').addEventListener('submit', function (e) {
    var currentPassword = document.getElementById('Password').value;
    var newPassword = document.getElementById('NewPassword').value;

    if (currentPassword === newPassword) {
      e.preventDefault(); // Prevent the form submission
      showToastMessage('error', "Current and new passwords cannot be the same.");
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

  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
}

document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  console.log('Sign In logic here');
});

document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  console.log('Sign Up logic here');
});

function typeWriter(text, i, callback) {
  const welcomeTextElement = document.getElementById("welcomeText");

  if (i < text.length) {
    welcomeTextElement.innerHTML += text.charAt(i);
    i++;
    setTimeout(function () {
      typeWriter(text, i, callback);
    }, 40);
  } else if (typeof callback === "function") {
    setTimeout(callback, 5);
  }
}

function fadeInUsername() {
  const usernameElement = document.getElementById("username");
  usernameElement.style.display = "inline";
  usernameElement.style.animation = "fadeIn 1s ease-in-out forwards";
}

