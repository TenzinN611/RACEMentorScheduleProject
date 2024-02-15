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


// Function to hide the preloader, show the content, and slide in the menu
function showContentAndMenu() {
  document.getElementById('preloader-overlay').style.display = 'none';
  document.getElementById('content').style.display = 'block';

  var menu = document.getElementById('menu');
  if (menu) {
    // Slide in the menu after preloader is complete
    menu.style.display = 'block';
  }
}

// Simulating the preloader completion with a timeout (you can replace this with your actual preloader logic)
setTimeout(showContentAndMenu, 2000); // Adjust the timeout as needed

//course
function openCourseBox() {
  closeAllBoxes();
  if (!courseBoxOpen) {
    courseBox.style.display = 'block';
    courseBoxOpen = true;
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
  if (!isValidSentenceCase1(description)) {
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
  if (!isValidSentenceCase1(description)) {
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
  // Validate that the text is in sentence case with one word immediately followed by another word
  const sentenceCaseRegex = /^[A-Z][a-z]*[A-Z][a-z]*$/;
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
}

//Mentor:
function openMentorBox() {
  closeAllBoxes();
  if (!mentorBoxOpen) {
    mentorBox.style.display = 'block';
    mentorBoxOpen = true;
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
  const sentenceCaseRegex = /^[A-Z][a-z]*(\s[A-Z][a-z]*)+$/;
  return sentenceCaseRegex.test(text);
}

function isValidSentenceCase1(text) {
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
}

//Batch
function openBatchBox() {
  closeAllBoxes();
  if (!BatchBoxOpen) {
    BatchBox.style.display = 'block';
    BatchBoxOpen = true;
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
}

//Program
function openProgramBox() {
  closeAllBoxes();
  if (!ProgramBoxOpen) {
    ProgramBox.style.display = 'block';
    ProgramBoxOpen = true;
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
}

//schedule
function openScheduleBox() {
  closeAllBoxes()
  if (!ScheduleBoxOpen) {
    document.getElementById('scheduleBox').style.display = 'block';
    ScheduleBoxOpen = true;
  }
}

function closeScheduleBox() {
  document.getElementById('scheduleBox').style.display = 'none';
  ScheduleBoxOpen = false; // Reset the flag when closing the schedule box
}

//close all boxes
function closeAllBoxes() {
  ['Course', 'Mentor', 'Batch', 'Program', 'Schedule'].forEach(box => {
    const closeFunction = window[`close${box}Box`];
    if (closeFunction) {
      closeFunction();
    }
  });
}



// Calendar functions
function openCalendar() {
  closeScheduleBox(); // Close schedule box when opening calendar
  populateTable();
  document.getElementById('calendarContainer').style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

const scheduleData = [];

async function populateTable() {
  try {
    depopulateTable();
    // Fetch mentor data
    const mentorsResponse = await fetch('/get_mentorss');
    const mentorsData = await mentorsResponse.json();
    console.log('Mentors Data received:', mentorsData);

    // Fetch batch names from the server
    const batchNamesResponse = await fetch('/get_batch_names');
    const batchNames = await batchNamesResponse.json();
    console.log('Batch Names received:', batchNames);

    // Fetch Saturdays for the current month
    const saturdayDates = await getSaturdaysInMonth();
    console.log('Saturdays received:', saturdayDates);

    // Clear existing scheduleData
    scheduleData.length = 0;

    // Populate scheduleData
    batchNames.forEach(batch => {
      const scheduleItem = { batch };
      saturdayDates.forEach((date, index) => {
        const mentorForWeek = mentorsData.find(mentor => mentor.BatchName === batch && mentor.Date === date);
        const combinedData = mentorForWeek ? `${mentorForWeek.MentorName} <br> ${date}` : 'Not Scheduled';
        scheduleItem[`cell${index + 1}`] = combinedData;
      });
      scheduleData.push(scheduleItem);
    });

    // Now populate the table with the updated dynamic scheduleData
    const table = document.getElementById('scheduleTable');
    const seenMentorNames = {};

    scheduleData.forEach((item, rowIndex) => {
      const row = table.insertRow();
      Object.values(item).forEach((value, columnIndex) => {
        const cell = row.insertCell();
        cell.innerHTML = value;

        // Add drag-and-drop functionality to each cell
        makeCellDraggable(cell);
        makeDropTarget(cell);

        if (columnIndex > 0) {
          const mentorName = value.split(' <br> ')[0];
          if (seenMentorNames[columnIndex]) {
            if (seenMentorNames[columnIndex].hasOwnProperty(mentorName) && mentorName != 'Not Scheduled') {
              cell.style.backgroundColor = 'red';
            }
          }
        }

        seenMentorNames[columnIndex] = seenMentorNames[columnIndex] || {};
        const mentorName = value.split(' <br> ')[0];
        seenMentorNames[columnIndex][mentorName] = true;

        cell.addEventListener('click', function (event) {
          const clickedRowIndex = rowIndex;
          const topCellData = value;
          const leftCellData = scheduleData[clickedRowIndex][Object.keys(scheduleData[0])[0]];
          const datePart = topCellData.split(' <br> ')[1];

          showPopup(datePart, leftCellData);

          console.log(`Clicked Cell: (${datePart},${leftCellData})`);
        });
      });
    });
  } catch (error) {
    console.error('Error populating table:', error);
  }
}

function depopulateTable() {
  try {
    const table = document.getElementById('scheduleTable');

    // Remove all rows from the table, starting from the second row
    for (let i = table.rows.length - 1; i > 1; i--) {
      table.deleteRow(i);
    }

    // Clear existing scheduleData
    scheduleData.length = 0;
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
    console.log("draggedColumnIndex: ",draggedColumnIndex);
    const droppedRowIndex = cell.parentNode.rowIndex;
    const currentCellData = cell.textContent || cell.innerText;
    console.log('current cell data: ', currentCellData);
    const topColumnValue = getTopColumnValue(cell);

    console.log('topcolumnvalue: ', topColumnValue);
    console.log('scheduleData: ', scheduleData);
    console.log('draggedRowIndex: ', draggedRowIndex);
    console.log('droppedRowIndex: ', droppedRowIndex);
    console.log('Array.isArray(scheduleData): ', Array.isArray(scheduleData));
    console.log('scheduleData[droppedRowIndex]: ', scheduleData[droppedRowIndex - 2]);

    if (currentCellData == 'Not Scheduled'){
    if (scheduleData && Array.isArray(scheduleData) && scheduleData[droppedRowIndex - 2] && (draggedRowIndex === droppedRowIndex)) {
      // Set the HTML content of the drop target cell
      cell.innerHTML = draggedData;

      // Extract information from the dragged cell
      const topCellData = draggedData;
      console.log('topcelldata: ', topCellData);

      // Extract the batch from the dropped row
      const batch = scheduleData[droppedRowIndex - 2].batch;
      console.log('batch: ', batch);

      // Extract the left cell data from the dropped row
      /*const leftCellData = scheduleData[droppedRowIndex - 2][`cell${cell.cellIndex + 1}`];
      console.log('leftcelldata: ', leftCellData);

      // Extract the top row data
      const topRowData = scheduleData[0][`cell${cell.cellIndex + 1}`];
      console.log('topRowdata: ', topRowData);*/

      // Extract the value of the dropped cell column using cellIndex
      const droppedCellColumnValue = cell.cellIndex-1;
      console.log('droppedCellColumnValue: ', droppedCellColumnValue);

      // Extract the date part from the dragged cell's content
      const datePart = topCellData.split(' <br> ')[1];
      console.log('date: ', datePart);

      const currentDate1 = new Date().toLocaleDateString();
      

      

      const mentor = topCellData.split(' <br> ')[0];
      console.log('mentor: ', mentor);
      console.log('datePart:',datePart);
      console.log('currentDate1:',currentDate1);

      const parts = currentDate1.split('/'); // Split the string into parts based on '/'
      const formattedDate = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
      console.log('formattedDate:',formattedDate);
      const cdate = formattedDate.toISOString().split('T')[0];
      console.log('cdate:',cdate);

      if (sat1[topColumnValue-1] < cdate){
        alert('Cannot Schedule as the Date is before today')
        populateTable();
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
  console.log('sat: ',sat);
  console.log('sat: ',sat[droppedCellColumnValue]);

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
}

//search calender
function searchCalendar() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("scheduleTable");
  tr = table.getElementsByTagName("tr");

  for (i = 1; i < tr.length; i++) {
      // Start from index 1 to skip the header row
      td = tr[i].getElementsByTagName("td")[0]; // Assuming Batch is in the first column

      if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = "";
          } else {
              tr[i].style.display = "none";
          }
      }
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
  
  const popupContainer = document.getElementById('PopupContainer');
  const scheduleItemElement = document.getElementById('scheduleItem');
  const overlayElement = document.getElementById('overlay');

  scheduleItemElement.style.display = 'block';
  overlayElement.style.display = 'block';

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
      closeButtonContainer.onclick = closePopup;
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
            <button style="background-color: orange; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 15px; font-family: 'Martain'; transition: background-color 0.3s ease, box-shadow 0.3s ease; margin-top: 10px;" onmouseover="this.style.backgroundColor='darkorange'" onmouseout="this.style.backgroundColor='orange'" onclick="saveChanges('${schedule.ScheduleID}', '${schedule.Name}', '${schedule.MentorName}', '${schedule.BatchName}', '${schedule.ProgramName}', '${schedule.SDate}' )"><i class="fas fa-save" style="margin-right: 5px;"></i> Save Changes</button>
            <button style="background-color: orange; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 15px; font-family: 'Martain'; transition: background-color 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.backgroundColor='darkorange'" onmouseout="this.style.backgroundColor='orange'" onclick="deleteSchedule('${schedule.ScheduleID}')"><i class="fas fa-trash-alt" style="margin-right: 5px;"></i> Delete</button>
          </div>
        `;
        createAndPopulateDropdown(scheduleItem, 'CourseName12', schedule.Name, data1.courses);
        createAndPopulateDropdown(scheduleItem, 'MentorName12', schedule.MentorName, data1.mentors);
        createAndPopulateDropdown(scheduleItem, 'batch12', schedule.BatchName, data1.batches);
        createAndPopulateDropdown(scheduleItem, 'program12', schedule.ProgramName, data1.programs);

        scheduleItemsContainer.appendChild(scheduleItem);
      });

      popupContainer.innerHTML = '';
      popupContainer.appendChild(scheduleItemsContainer);
      popupContainer.style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//popup calender for date
document.addEventListener('DOMContentLoaded', function () {
  flatpickr("#date", {
    dateFormat: "Y-m-d",
    enableTime: false,
    time_24hr: true,
  });
});

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
        closePopup();
      })
      .catch(error => console.error('Error:', error));
  } else {
    // User clicked "Cancel" in the confirmation prompt
    console.log('Deletion canceled.');
  }
}

function closePopup() {
  openCalendar();
  const popupContainer = document.getElementById('schedulePopup');
  popupContainer.style.display = 'none';
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
      populateDropdown($('#program11'), data.programs, 'Program');
      populateDropdown($('#batch11'), data.batches, 'Batch');
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

// Function to open profile popup
function openProfilePopup() {
  closeAllBoxes();
  closeChangePasswordPopup();
  var overlay = document.getElementById('overlay');
  var popup = document.getElementById('profileBox');

  overlay.style.display = 'block';
  popup.style.display = 'block';
}

// Function to close profile popup
function closeProfilePopup() {
  var overlay = document.getElementById('overlay');
  var popup = document.getElementById('profileBox');

  overlay.style.display = 'none';
  popup.style.display = 'none';
}

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

window.addEventListener('load', function() {
  const welcomeText = "Welcome to Race Portal, ";
  document.getElementById("welcomeText").innerHTML = "";
  typeWriter(welcomeText, 0, fadeInUsername);
});

// Function to open change password popup
function openChangePasswordPopup() {
  closeAllBoxes();
  closeProfilePopup();
  var overlay = document.getElementById('overlay');
  var popup = document.getElementById('changePasswordBox');

  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Event listener for change password form submission
  document.getElementById('edit-profile-forms').addEventListener('submit', function(e) {
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





