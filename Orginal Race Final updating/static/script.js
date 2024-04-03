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
let courseBoxOpen = false;
let mentorBoxOpen = false;
let BatchBoxOpen = false;
let ProgramBoxOpen = false;
let ScheduleBoxOpen = false;
let mentorDetailsVisible = false;

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

//course
function openCourseBox() {
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
  closeUserSignupBox();
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
    alert('Please fill in all fields before adding the course.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(CourseID)) {
    alert('Course ID should be a number. Special characters are not allowed.');
    resetField('CourseID');
    return;
  }

  // Validate courseName
  if (!isValidSentenceCase(courseName)) {
    alert('Course name should be in sentence case.');
    resetField('courseName');
    return;
  }

  // Validate description
  if (!isValidSentenceCase(description)) {
    alert('Description should be in sentence case.');
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
    .then(response => response.text())
    .then(data => {
      console.log(data);
      // Display an alert popup when the course is added successfully
      alert('Course added successfully!');
      resetForm();
    })
    .catch(error => {
      console.error('Error:', error);
      // Display an alert popup for errors if needed
      alert('Error adding course. Please try again.');
    });
}


// Editing
function EditCourseDetails() {
  const CourseID = document.getElementById('CourseID').value;
  const courseName = document.getElementById('courseName').value;
  const description = document.getElementById('description').value;

  // Validate fields
  if (!CourseID || !courseName || !description) {
    alert('Please fill in all fields before editing the course.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(CourseID)) {
    alert('Course ID should be a number. Special characters are not allowed.');
    resetField('CourseID');
    return;
  }

  // Validate courseName
  if (!isValidSentenceCase(courseName)) {
    alert('Course name should be in sentence case.');
    resetField('courseName');
    return;
  }

  // Validate description
  if (!isValidSentenceCase(description)) {
    alert('Description should be in sentence case.');
    resetField('description');
    return;
  }

  // Assuming you're using Fetch API for simplicity
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
        alert('Course edited successfully');
        // Reset the form
        resetForm();
      } else {
        alert('Error editing course: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Deleting
function DeleteCourseDetails() {
  const CourseID = document.getElementById('CourseID').value;

  // Validate fields
  if (!CourseID) {
    alert('Please enter the Course ID before deleting the course.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(CourseID)) {
    alert('Course ID should be a number. Special characters are not allowed.');
    resetForm();
    return;
  }

  // Ask for confirmation
  const userConfirmed = confirm('Are you sure you want to delete this course?');

  if (!userConfirmed) {
    return; // User canceled the operation
  }

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
        alert('Course deleted successfully');
        // Reset the form
        resetForm();
        // Additional logic or UI update as needed
      } else {
        alert('Error deleting course: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      alert('An error occurred while deleting the course. Please try again.');
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
  closeUserSignupBox();
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
    alert('Please fill in all fields before adding the mentor.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(mentorId)) {
    alert('Mentor ID should be a number. Special characters are not allowed.');
    resetMentorField('mentorId');
    return;
  }

  // Validate mentorName
  if (!isValidSentenceCase(mentorName)) {
    alert('Mentor name should be in sentence case.');
    resetMentorField('mentorName');
    return;
  }

  // Validate mentorRaceEmailAddress
  if (!isValidRevaEmail(mentorRaceEmailAddress)) {
    alert('Invalid Race email format. Please use the correct email format for Race. Example: example@reva.edu.in');
    resetMentorField('mentorRaceEmailAddress');
    return;
  }

  // Validate mentorEmailAddress
  if (!isValidGmailEmail(mentorEmailAddress)) {
    alert('Invalid Gmail email format. Please use the correct email format for Gmail.Example: example@gmail.com');
    resetMentorField('mentorEmailAddress');
    return;
  }

  // Validate mentorWhatsapp
  if (!isValidWhatsApp(mentorWhatsapp)) {
    alert('Phone number should be a 10-digit number.');
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
      // Display an alert popup when the mentor is saved successfully
      alert('Mentor Added successfully!');
      // Reset the form
      resetMentorForm();
    })
    .catch(error => {
      console.error('Error:', error);
      // Display an alert popup for errors if needed
      alert('Error adding mentor. Please try again.');
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
    alert('Please fill in all fields before editing the mentor.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(mentorId)) {
    alert('Mentor ID should be a number. Special characters are not allowed.');
    resetMentorField('mentorId');
    return;
  }

  // Validate mentorName
  if (!isValidSentenceCase(mentorName)) {
    alert('Mentor name should be in sentence case.');
    resetMentorField('mentorName');
    return;
  }

  // Validate mentorRaceEmailAddress
  if (!isValidRevaEmail(mentorRaceEmailAddress)) {
    alert('Invalid Race email format. Please use the correct email format for Race. Example: example@reva.edu.in');
    resetMentorField('mentorRaceEmailAddress');
    return;
  }

  // Validate mentorEmailAddress
  if (!isValidGmailEmail(mentorEmailAddress)) {
    alert('Invalid Gmail email format. Please use the correct email format for Gmail.Example: example@gmail.com');
    resetMentorField('mentorEmailAddress');
    return;
  }

  // Validate mentorWhatsapp
  if (!isValidWhatsApp(mentorWhatsapp)) {
    alert('Phone number should be a 10-digit number.');
    resetMentorField('mentorWhatsapp');
    return;
  }

  // Assuming you're using Fetch API for simplicity
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
        alert('Mentor edited successfully');
        // Reset the form
        resetMentorForm();
      } else {
        alert('Error editing mentor: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//Deleting
function DeleteMentorDetails() {
  const mentorId = document.getElementById('mentorId').value;

  // Validate fields
  if (!mentorId) {
    alert('Please enter the Mentor ID before deleting the mentor.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(mentorId)) {
    alert('Mentor ID should be a number. Special characters are not allowed.');
    resetMentorForm();
    return;
  }

  // Ask for confirmation
  const userConfirmed = confirm('Are you sure you want to delete this mentor?');

  if (!userConfirmed) {
    return; // User canceled the operation
  }

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
        alert('Mentor deleted successfully');
        // Reset the form
        resetMentorForm();
        // Additional logic or UI update as needed
      } else {
        alert('Error deleting mentor: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      alert('An error occurred while deleting the mentor. Please try again.');
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
  closeUserSignupBox();
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
    alert('Please fill in all fields before adding the batch.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(BatchID)) {
    alert('Batch ID should be a number. Special characters are not allowed.');
    resetBatchField('BatchID');
    return;
  }

  // Validate batchName
  if (!isValidSentenceCaseWithNumbers(batchName)) {
    alert('Batch name with batch number.');
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
      // Display an alert popup when the batch is saved successfully
      alert('Batch Added successfully!');
      // Reset the form
      resetBatchForm();
    })
    .catch(error => {
      console.error('Error:', error);
      // Display an alert popup for errors if needed
      alert('Error saving batch. Please try again.');
    });
}

//editing
function EditBatchDetails() {
  const BatchID = document.getElementById('BatchID').value;
  const batchName = document.getElementById('Batch_Name').value;

  // Validate fields
  if (!BatchID || !batchName) {
    alert('Please fill in all fields before editing the batch.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(BatchID)) {
    alert('Batch ID should be a number. Special characters are not allowed.');
    resetBatchField('BatchID');
    return;
  }

  // Validate batchName
  if (!isValidSentenceCaseWithNumbers(batchName)) {
    alert('Batch name should be in sentence case and with batch number.');
    resetBatchField('Batch_Name');
    return;
  }

  // Assuming you're using Fetch API for simplicity
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
        alert('Batch edited successfully');
        // Reset the form
        resetBatchForm();
      } else {
        alert('Error editing batch: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//deleting
function DeleteBatchDetails() {
  const BatchID = document.getElementById('BatchID').value;
  // Validate fields
  if (!BatchID) {
    alert('Please enter the Batch ID before deleting the batch.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(BatchID)) {
    alert('Batch ID should be a number. Special characters are not allowed.');
    resetBatchForm();
    return;
  }

  // Ask for confirmation
  const userConfirmed = confirm('Are you sure you want to delete this batch?');

  if (!userConfirmed) {
    return; // User canceled the operation
  }

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
        alert('Batch deleted successfully');
        // Reset the form
        resetBatchForm();
        // Additional logic or UI update as needed
      } else {
        alert('Error deleting Batch: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      alert('An error occurred while deleting the batch. Please try again.');
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
  closeUserSignupBox();
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
    alert('Please fill in all fields before adding the program.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(ProgramID)) {
    alert('Program ID should be a number. Special characters are not allowed.');
    resetProgramField('ProgramID')
    return;
  }

  // Validate programName
  if (!isValidSentenceCase(programName)) {
    alert('Program name should be in sentence case.');
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
      // Display an alert popup when the program is saved successfully
      alert('Program added successfully!');
      // Reset the form
      resetProgramForm();
    })
    .catch(error => {
      console.error('Error:', error);
      // Display an alert popup for errors if needed
      alert('Error saving program. Please try again.');
    });
}


//editing
function EditProgramDetails() {
  const ProgramID = document.getElementById('ProgramID').value;
  const programName = document.getElementById('Program_Name').value;

  // Validate fields
  if (!ProgramID || !programName) {
    alert('Please fill in all fields before editing the program.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(ProgramID)) {
    alert('Program ID should be a number. Special characters are not allowed.');
    resetProgramField('ProgramID')
    return;
  }

  // Validate programName
  if (!isValidSentenceCase(programName)) {
    alert('Program name should be in sentence case.');
    resetProgramField('Program_Name')
    return;
  }

  // Assuming you're using Fetch API for simplicity
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
        alert('Program edited successfully');
        // Reset the form
        resetProgramForm();
      } else {
        alert('Error editing program: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
//delete program
function DeleteProgramDetails() {
  const ProgramID = document.getElementById('ProgramID').value;

  // Validate fields
  if (!ProgramID) {
    alert('Please enter the Program ID before deleting the program.');
    return;
  }

  // Validate CourseID
  if (!isValidNumber(ProgramID)) {
    alert('Program ID should be a number. Special characters are not allowed.');
    resetProgramForm();
    return;
  }


  console.log('Deleting program with ID:', ProgramID);

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
        alert('Program deleted successfully');
        // Reset the form
        resetProgramForm();
        // Additional logic or UI update as needed
      } else {
        alert('Error deleting Program: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch Error:', error);
      alert('An error occurred while deleting the program. Please try again.');
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
  closeUserSignupBox();
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
  closeUserSignupBox();
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
      scheduleItem[`cell${index + 1}`] = `Week ${index + 1}`;
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
        const combinedData = mentorForWeek ? `${mentorForWeek.MentorName} :<br> ${mentorForWeek.ModuleName} <br> ${date}` : 'Not Scheduled';
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
        const cell = document.createElement('td');
        cell.innerHTML = value;

        // Set background color based on conditions
        if (value != 'Not Scheduled' && columnIndex > 0 && !/^Week \d+$/.test(value)) {
          cell.style.backgroundColor = 'lightgreen';
        }
        if (columnIndex == 0) {
          cell.style.backgroundColor = 'lightblue';
        }
        if (/^Week \d+$/.test(value)) {
          cell.style.backgroundColor = 'orange';
        }


        // Add drag-and-drop functionality to each cell
        makeCellDraggable(cell);
        makeDropTarget(cell);

        // Set background color based on seen mentor and module names
        if (columnIndex > 0) {
          const mentorModuleName = value.split(' :<br> ');
          if (mentorModuleName.length >= 2) { // Check if the split operation yielded at least two parts
            const mentorName = mentorModuleName[0];
            const moduleName1 = mentorModuleName[1];
            const moduleName = moduleName1.split(' <br> ')[0];
            if (seenMentorNames[columnIndex] && seenMentorNames[columnIndex].hasOwnProperty(mentorName) && seenmoduleNames[columnIndex] && seenmoduleNames[columnIndex].hasOwnProperty(moduleName) && mentorName != 'Not Scheduled' && mentorName != 'Exam') {
              cell.style.backgroundColor = 'orange';
            }
            else if (seenMentorNames[columnIndex] && seenMentorNames[columnIndex].hasOwnProperty(mentorName) && mentorName != 'Not Scheduled' && mentorName != 'Exam') {
              cell.style.backgroundColor = 'red';
            }
          }
        }

        if (value.split(' <br> ')[1] < formattedDate1) {
          cell.style.backgroundColor = 'lightgray';
        }

        // Track seen mentor names
        seenMentorNames[columnIndex] = seenMentorNames[columnIndex] || {};
        const mentorName = value.split(' :<br> ')[0];
        seenMentorNames[columnIndex][mentorName] = true;

        // Track seen module names
        seenmoduleNames[columnIndex] = seenmoduleNames[columnIndex] || {};
        const moduleName1 = value.split(' :<br> ')[1];
        if (moduleName1) { // Ensure moduleName1 exists before splitting it
          const moduleName = moduleName1.split(' <br> ')[0]; // Corrected splitting for moduleName
          seenmoduleNames[columnIndex][moduleName] = true;
        }



        // Attach event listener to non-'Not Scheduled' cells
        if (value !== 'Not Scheduled') {
          cell.addEventListener('click', function (event) {
            const clickedRowIndex = rowIndex;
            const topCellData = value;
            const leftCellData = scheduleData[clickedRowIndex][Object.keys(scheduleData[0])[0]];
            const datePart = topCellData.split(' :<br> ')[1].split(' <br> ')[1];
            console.log('leftcelldata: ', leftCellData);
            console.log('datePart:', datePart);

            showPopup(datePart, leftCellData);

            console.log(`Clicked Cell: (${datePart},${leftCellData})`);
          });
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
    const mentorsResponse1 = await fetch('/get_mentorss');
    const mentorsData1 = await mentorsResponse1.json();
    //console.log('Mentors Data received:', mentorsData1);

    // Fetch batch names from the server
    const batchNamesResponse1 = await fetch('/get_batch_names');
    const batchNames1 = await batchNamesResponse1.json();
    //console.log('Batch Names received:', batchNames1);

    // Fetch Saturdays for the current month
    const saturdayDates1 = await getSaturdaysInMonth();
    //console.log('Saturdays received:', saturdayDates1);

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

        // Extract the batch from the dropped row
        const batch = scheduleData[droppedRowIndex - 1].batch;
        console.log('batch: ', batch);

        // Extract the value of the dropped cell column using cellIndex
        const droppedCellColumnValue = cell.cellIndex - 1;
        console.log('droppedCellColumnValue: ', droppedCellColumnValue);

        // Extract the date part from the dragged cell's content
        const datePart = topCellData.split(' <br> ')[1];
        console.log('date: ', datePart);

        const currentDate1 = new Date().toLocaleDateString();


        const mentor = topCellData.split(' :<br> ')[0];
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
          alert('Cannot Schedule as the Date is before today')
        }
        else {
          dropcell11(datePart, batch, droppedCellColumnValue, mentor);
        }

        // Call your function with the extracted information

      } else {
        // Prevent dropping in a different row and display an alert
        alert('You can only drop in the same batch.');
      }
    }
    else {
      alert(" Sorry, this week is already scheduled with another mentor. Please choose a different week  ")
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
          <input type="date" id="scheduleDate12" name="scheduleDate12" placeholder="Select a date" required style="color: black; padding: 10px 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 15px; font-family: 'Martain'; transition: background-color 0.3s ease, box-shadow 0.3s ease;">
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

  console.log('courseNameElement', courseNameElement);

  const courseName = courseNameElement.value || ScheduleModule;
  const mentorName = mentorNameElement.value || ScheduleMentor;
  const batchName = batchNameElement.value || ScheduleBatch;
  const programName = programNameElement.value || ScheduleProgram;
  const scheduleDate = scheduleDateElement.value || ScheduleDate;

  console.log('courseName', courseName);

  // Display a confirmation prompt before saving changes
  const isConfirmed = window.confirm('Are you sure you want to save changes?');

  if (isConfirmed && ScheduleID && courseName !== '' && mentorName !== '' && batchName !== '' && programName !== '' && scheduleDate !== '') {
    // Prepare the data to be sent in the request body
    const data = {
      ScheduleID: ScheduleID,
      courseName: courseName,
      mentorName: mentorName,
      batchName: batchName,
      programName: programName,
      scheduleDate: scheduleDate,
    };

    // Perform an AJAX request or fetch to send the updated data to the server
    const url = '/update_schedule';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          /*throw new Error('Network response was not ok');*/
          alert('Error Changing Schedule, Cannot set this date. Date should be Equal or After today');
        }
        return response.json();
      })
      .then(updatedData => {

        if (updatedData.error) {
          // Display an alert for the error message
          alert('Error: ' + updatedData.error);
        } else {
          console.log('Schedule updated:', updatedData);

          // Update the HTML elements with the new values
          courseNameElement.innerText = updatedData.courseName;
          mentorNameElement.innerText = updatedData.mentorName;
          batchNameElement.innerText = updatedData.batchName;
          programNameElement.innerText = updatedData.programName;
          scheduleDateElement.innerText = updatedData.scheduleDate;

          // Display an alert message when the schedule is edited successfully

          alert('Schedule edited successfully');
          closePopup();
        }
      })
      .catch(error => console.error('Error:', error));
  } else if (!isConfirmed) {
    // User clicked "Cancel" in the confirmation prompt
    console.log('Changes not saved.');
  } else {
    console.error('Invalid parameters for update_schedule request');
    console.log('ScheduleID:', ScheduleID);
    console.log('courseName:', courseName);
    console.log('mentorName:', mentorName);
    console.log('batchName:', batchName);
    console.log('programName:', programName);
    console.log('scheduleDate:', scheduleDate);
  }
}

function deleteSchedule(scheduleID) {
  // Display a confirmation prompt before deleting the schedule
  const isConfirmed = window.confirm('Are you sure you want to delete this schedule?');

  if (isConfirmed) {
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

        // Display an alert message when the schedule is deleted successfully
        alert('Schedule deleted successfully');
        // Close the popup or perform any other necessary actions
        closePopups();
      })
      .catch(error => console.error('Error:', error));
  } else {
    // User clicked "Cancel" in the confirmation prompt
    console.log('Deletion canceled.');
  }
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
  closeUserSignupBox();
  // Show the user management div
  document.getElementById('userManagement').style.display = 'block';
  // Call function to populate user list
  populateUserList();
  document.querySelector('.dashboard-container').style.display = 'none';
}

// Function to populate user list
function populateUserList() {
  // User data
  var userListData = [
    { userId: 1, userName: "John Doe" },
    { userId: 2, userName: "Jane Smith" },
    { userId: 3, userName: "Alice Johnson" },
    { userId: 4, userName: "Bob Brown" },
    { userId: 5, userName: "Eva Martinez" },
    { userId: 6, userName: "Michael Lee" },
    { userId: 7, userName: "Sara Taylor" },
    { userId: 8, userName: "David Wilson" },
    { userId: 9, userName: "Emily Jones" },
    { userId: 10, userName: "Peter Davis" }
  ];

  // Function to populate user list dynamically
  var userListHTML = '';
  for (var i = 0; i < userListData.length; i++) {
    userListHTML += '<tr>';
    userListHTML += '<td>' + userListData[i].userName + '</td>';
    userListHTML += '<td class="roles-column">';
    userListHTML += '<select class="role-dropdown">';
    userListHTML += '<option value="" disabled selected>Select the role</option>'; // Placeholder
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

  // Event listener for edit button click
  $(document).on('click', '.edit-btn', function() {
    alert('User Role Edited Successfully');
  });

  // Event listener for delete button click
  $(document).on('click', '.delete-btn', function() {
    var userId = $(this).data('userid');
    // Alert popup for delete
    alert('Deleting user with ID: ' + userId);
  });

  // Search functionality
  $('#searchInputs').on('input', function() {
    var searchText = $(this).val().toLowerCase();
    $('#userList tr').each(function() {
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
  closeUserSignupBox();
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

//upload box
function openUploadBox() {
  closeAllBoxes();
  closeUserManagement();
  closeGetReportBox();
  closeUserSignupBox();
  document.getElementById('uploadBox').style.display = 'block';
  document.querySelector('.dashboard-container').style.display = 'none';
}

function closeUploadBox() {
  var uploadBox = document.getElementById('uploadBox');
  uploadBox.style.display = 'none';
  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
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
    alert('Please select a file to upload.');
    return;
  }

  // Check if the file is an Excel file
  if (!uploadedFile.name.endsWith('.xlsx') && !uploadedFile.name.endsWith('.xls')) {
    alert('Please upload an Excel file.');
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
        alert('The uploaded file is missing the following headers or misspelled: ' + missingHeaders.join(', '));
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
        alert('Please upload the file with all rows filled.');
        return;
      }

      // Send non-empty rows to Flask Python function
      if (nonEmptyRows.length > 0) {
        // Assuming you have a function sendDataToFlask() to send data to Flask
        sendDataToFlask(nonEmptyRows);
      } else {
        alert('No data to upload.');
      }

      // Display the modal at the top
      modal.style.display = "block";
      modal.style.top = "55%"; // Adjusting modal to appear at the top
    } catch (error) {
      console.error('Error converting Excel to HTML:', error);
      // Provide specific error messages based on the type of error
      if (error instanceof SyntaxError) {
        alert('Invalid Excel file format. Please ensure the file is in a valid Excel format.');
      } else if (error instanceof ReferenceError) {
        alert('Error processing Excel file. Please try again later or contact support.');
      } else {
        alert('Error converting Excel to HTML. Please try again.');
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
      alert('Data uploaded successfully!');
    } else if (response.status === 400) {
      alert('Failed to upload data. Please enter correct data or ensure date is after today.');
    } else {
      alert('Failed to upload data. Please try again later.');
    }
  })
  .catch(error => {
    console.error('Error uploading data:', error);
    alert('Failed to upload data. Please try again later.');
  });
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
  const emailRegex2 = /^[a-zA-Z0-9._-]+@race\.reva\.edu\.in$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!emailRegex.test(signupEmail) && !emailRegex2.test(signupEmail)) {
    alert("Invalid email address. Please use the example@reva.edu.in format.");
    return false;
  }

  if (!passwordRegex.test(signupPassword)) {
    alert("Password must be at least 8 characters long, contain at least one special character, one number, and include a capital letter.");
    return false;
  }

  return true;
}

/*user registraion*/
function togglePasswordS(passwordFieldId) {
  const passwordInput = document.getElementById(passwordFieldId);
  const container = passwordInput.parentElement;
  const eyeIcon = container.querySelector(".user-toggle-password i");

  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  eyeIcon.classList.toggle("fa-eye");
  eyeIcon.classList.toggle("fa-eye-slash");
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
  closeUserSignupBox();
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

// Function to open change password popup
function openChangePasswordPopup() {
  closeAllBoxes();
  closeProfilePopup();
  closeUploadBox();
  closeUserManagement();
  closeUserSignupBox();
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

  // Remove event listener to prevent unwanted closing
  overlay.removeEventListener('click', closeChangePasswordPopup);

  // Show the dashboard-container and reset its styles
  var dashboardContainer = document.querySelector('.dashboard-container');
  dashboardContainer.style.display = 'flex'; // Assuming it originally used flexbox
}

//user Registration
function openUserSignupBox() {
  closeAllBoxes();
  closeUploadBox();
  closeUserManagement();
  closeProfilePopup();
  closeChangePasswordPopup();
  document.getElementById("User-signup-box").style.display = "block";
  document.getElementById("user-signup-overlay").style.display = "block";
  // Hide the dashboard-container
  document.querySelector('.dashboard-container').style.display = 'none';
}

function closeUserSignupBox() {
  document.getElementById("User-signup-box").style.display = "none";
  document.getElementById("user-signup-overlay").style.display = "none";
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








