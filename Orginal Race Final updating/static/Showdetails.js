// Function to hide the preloader and show the content
function showContent() {
    document.getElementById('preloader-overlay').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

// Simulating the preloader completion with a timeout (you can replace this with your actual preloader logic)
setTimeout(showContent, 2000); // Adjust the timeout as needed /* Hide content initially */

// Function to escape HTML characters
function escapeHTML(text) {
    if (typeof text !== 'string') return text;

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

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


// Show Course details
function showCourseDetails() {
    fetch('/show_courses')
        .then(response => response.json())
        .then(data => {
            console.log('Course Data received:', data);

            // Store the course data in sessionStorage
            sessionStorage.setItem('courseData', JSON.stringify(data));

            // Navigate to course_table.html in the same tab
            window.location.href = '/course_table';

            // Alternatively, you can use:
            //window.location.replace('/course_table');
        })
        .catch(error => console.error('Error:', error));
}

//renderCourseTable
function renderCourseTable() {
    const storedData = sessionStorage.getItem('courseData');
    const data = storedData ? JSON.parse(storedData) : [];

    // Create an array to store the table rows
    const tableRows = data.map(course => `
        <tr>
          <td>${course.CourseID}</td>
          <td contenteditable="true" data-courseid="${escapeHTML(course.CourseID)}" data-field="courseName">${escapeHTML(course.courseName)}</td>
          <td contenteditable="true" data-courseid="${escapeHTML(course.CourseID)}" data-field="description">${escapeHTML(course.description)}</td>
          <td>
            <button class="btn btn-success" onclick="editCourse(${escapeHTML(course.CourseID)})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger" onclick="deleteCourse(${escapeHTML(course.CourseID)})"><i class="fas fa-trash-alt"></i></button>
          </td>
        </tr>`
    );

    // Add the table rows to the table in the new tab
    $('#courseTableBody').html(tableRows.join(''));

    // Initialize DataTables for the table with pagination
    $('#courseTable').DataTable({
        paging: true,
        pageLength: 5, // Display 5 rows per page
        lengthMenu: [5, 10, 25, 50], // Customize the length menu options
        // Add sorting options for each column
        columnDefs: [
            { orderable: true, targets: [0] }, // Course ID
            { orderable: false, targets: [1] }, // Course Name
            { orderable: false, targets: [2] }, // Description
            { orderable: false, targets: [3] }  // Actions
        ],
    });

    // Make only the specified table cells (courseName and description) editable using jQuery
    $('#courseTable td:not(:first-child):not(:last-child)').attr('contenteditable', 'true');
}

// Call the function to render the table when the page is loaded or reloaded
renderCourseTable();

// Function to handle course editing
function editCourse(courseID) {
    const courseNameElement = $(`#courseTable td[data-courseid="${escapeHTML(courseID)}"][data-field="courseName"]`);
    const descriptionElement = $(`#courseTable td[data-courseid="${escapeHTML(courseID)}"][data-field="description"]`);

    let newCourseName = courseNameElement.text();
    let newDescription = descriptionElement.text();

    // Validate and convert course name to sentence case
    if (newCourseName) {
        newCourseName = newCourseName.toLowerCase();
        newCourseName = newCourseName.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
    }

    // Validate and convert description to sentence case
    if (newDescription) {
        newDescription = newDescription.toLowerCase();
        newDescription = newDescription.replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
    }

    // Show Bootstrap modal
    $('#editCourseModal').modal('show');

    // Handle confirm button click
    $('#confirmEdit').on('click', function() {
        // Make API call to edit course
        fetch('/edit_course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                CourseID: courseID,
                courseName: newCourseName,
                description: newDescription,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToastMessage('success','Course edited successfully');
                // Update the table cell content after editing
                courseNameElement.text(newCourseName);
                descriptionElement.text(newDescription);
                // Fetch and render the updated data without reloading the page
                fetchAndUpdateTable();
            } else {
                showToastMessage('error','Error editing course: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        // Hide the modal after the action is performed
        $('#editCourseModal').modal('hide');
    });
}



// Function to fetch and update the table data
function fetchAndUpdateTable() {
    // Check if DataTable is already initialized on the table
    const isDataTableInitialized = $.fn.DataTable.isDataTable('#courseTable');

    fetch('/show_courses')
        .then(response => response.json())
        .then(data => {
            console.log('Course Data received:', data);

            // Store the course data in sessionStorage
            sessionStorage.setItem('courseData', JSON.stringify(data));

            // If DataTable is already initialized, destroy it before reinitializing
            if (isDataTableInitialized) {
                $('#courseTable').DataTable().destroy();
            }

            // Call a function to render the table using the stored data
            renderCourseTable();
        })
        .catch(error => console.error('Error:', error));
}

// Function to handle course deletion
function deleteCourse(courseID) {
    // Display a confirmation dialog before deleting the course
    $('#deleteCourseModal').modal('show'); // Open the delete confirmation modal
    
    // Handle delete confirmation
    $('#confirmDelete').off('click').on('click', function() {
        fetch('/delete_course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                CourseID: courseID,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.success) {
                showToastMessage('success', 'Course deleted successfully');
                // Remove the table row in the current tab after deleting
                $(`#courseTable tr[data-courseid="${escapeHTML(courseID)}"]`).remove();
                // Reload the page with the updated table
                fetchAndUpdateTable();
            } else {
                showToastMessage('error', 'Error deleting course: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showToastMessage('error', 'An error occurred while deleting the course. Please try again.');
        });
        
        $('#deleteCourseModal').modal('hide'); // Hide the delete confirmation modal after deletion
    });
}


// Function to show mentor details
function showMentorDetails() {
    // Fetch mentor details from the server
    fetch('/show_mentors')
        .then(response => response.json())
        .then(data => {
            console.log('Mentor Data received:', data);

            // Store the mentor data in sessionStorage
            sessionStorage.setItem('mentorData', JSON.stringify(data));

            // Navigate to mentor_table.html in the same tab
            window.location.href = '/mentor_table';

            // Alternatively, you can use:
            // window.location.replace('/mentor_table');
        })
        .catch(error => console.error('Error:', error));
}

// Function to render the mentor table
function renderMentorTable() {
    // Retrieve the mentor data from sessionStorage
    const storedData = sessionStorage.getItem('mentorData');
    const data = storedData ? JSON.parse(storedData) : [];

    // Create an array to store the table rows
    const tableRows = data.map(mentor => `
        <tr>
          <td>${mentor.mentorId}</td>
          <td contenteditable="true" data-mentorid="${escapeHTML(mentor.mentorId)}" data-field="mentorName">${escapeHTML(mentor.mentorName)}</td>
          <td contenteditable="true" data-mentorid="${escapeHTML(mentor.mentorId)}" data-field="mentorRaceEmailAddress">${escapeHTML(mentor.mentorRaceEmailAddress)}</td>
          <td contenteditable="true" data-mentorid="${escapeHTML(mentor.mentorId)}" data-field="mentorEmailAddress">${escapeHTML(mentor.mentorEmailAddress)}</td>
          <td contenteditable="true" data-mentorid="${escapeHTML(mentor.mentorId)}" data-field="mentorProfile">${escapeHTML(mentor.mentorProfile)}</td>
          <td contenteditable="true" data-mentorid="${escapeHTML(mentor.mentorId)}" data-field="mentorWhatsapp">${escapeHTML(mentor.mentorWhatsapp)}</td>
          <td>
            <button class="btn btn-success" onclick="editMentor(${escapeHTML(mentor.mentorId)})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger" onclick="deleteMentor(${escapeHTML(mentor.mentorId)})"><i class="fas fa-trash-alt"></i></button>
          </td>
        </tr>`
    );

    // Add the table rows to the table in the new tab
    $('#mentorTableBody').html(tableRows.join(''));

    // Initialize DataTables for the table with pagination
    $('#mentorTable').DataTable({
        paging: true,
        pageLength: 5, // Display 5 rows per page
        lengthMenu: [5, 10, 25, 50], // Customize the length menu options
        // Add sorting options for each column
        columnDefs: [
            { orderable: true, targets: [0] }, // Mentor ID
            { orderable: false, targets: [1] }, // Mentor Name
            { orderable: false, targets: [2] }, // Reva Email
            { orderable: false, targets: [3] }, // Email
            { orderable: false, targets: [4] }, // Profile
            { orderable: false, targets: [5] }  // Phone Number
        ],
    });

    // Make only the specified table cells (mentorName, mentorRaceEmailAddress, mentorEmailAddress, mentorProfile, mentorWhatsapp) editable using jQuery
    $('#mentorTable td:not(:first-child):not(:last-child)').attr('contenteditable', 'true');
}

// Call the function to render the table when the page is loaded or reloaded
renderMentorTable();


// Function to handle mentor editing
function editMentor(mentorId) {
    const mentorNameElement = $(`#mentorTable td[data-mentorid="${escapeHTML(mentorId)}"][data-field="mentorName"]`);
    const raceEmailElement = $(`#mentorTable td[data-mentorid="${escapeHTML(mentorId)}"][data-field="mentorRaceEmailAddress"]`);
    const emailElement = $(`#mentorTable td[data-mentorid="${escapeHTML(mentorId)}"][data-field="mentorEmailAddress"]`);
    const profileElement = $(`#mentorTable td[data-mentorid="${escapeHTML(mentorId)}"][data-field="mentorProfile"]`);
    const whatsappElement = $(`#mentorTable td[data-mentorid="${escapeHTML(mentorId)}"][data-field="mentorWhatsapp"]`);

    let newMentorName = mentorNameElement.text();
    let newRaceEmail = raceEmailElement.text();
    let newEmail = emailElement.text();
    let newProfile = profileElement.text();
    let newWhatsapp = whatsappElement.text();

    // Validate and convert mentor name to sentence case
    if (newMentorName) {
        newMentorName = newMentorName.toLowerCase();
        newMentorName = newMentorName.charAt(0).toUpperCase() + newMentorName.slice(1);
    }

    // Validate and convert race email to lowercase
    if (newRaceEmail) {
        newRaceEmail = newRaceEmail.toLowerCase();
    }

    // Validate and convert email to lowercase
    if (newEmail) {
        newEmail = newEmail.toLowerCase();
    }

    // Validate and convert profile to sentence case
    if (newProfile) {
        newProfile = newProfile.toLowerCase();
        newProfile = newProfile.charAt(0).toUpperCase() + newProfile.slice(1);
    }

    // Validate WhatsApp number to be 10 digits
    if (newWhatsapp && newWhatsapp.length !== 10) {
        showToastMessage('error','WhatsApp number should be 10 digits');
        return;
    }

    $('#editMentorModal').modal('show'); // Open the edit confirmation modal
    
    // Handle edit confirmation
    $('#confirmEditMentor').off('click').on('click', function() {
        fetch('/edit_mentor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mentorId: mentorId,
                mentorName: newMentorName,
                mentorRaceEmailAddress: newRaceEmail,
                mentorEmailAddress: newEmail,
                mentorProfile: newProfile,
                mentorWhatsapp: newWhatsapp,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToastMessage('success','Mentor edited successfully');
                // Update the table cell content after editing
                // Assuming you have elements like mentorNameElement, raceEmailElement, etc.
                mentorNameElement.text(newMentorName);
                raceEmailElement.text(newRaceEmail);
                emailElement.text(newEmail);
                profileElement.text(newProfile);
                whatsappElement.text(newWhatsapp);
                // Fetch and render the updated data without reloading the page
                fetchAndUpdateMentorTable();
            } else {
                showToastMessage('error','Error editing mentor: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
        $('#editMentorModal').modal('hide'); // Hide the edit confirmation modal after editing
    });
}

// Function to fetch and update the mentor table data
function fetchAndUpdateMentorTable() {
    // Check if DataTable is already initialized on the table
    const isDataTableInitialized = $.fn.DataTable.isDataTable('#mentorTable');

    fetch('/show_mentors')
        .then(response => response.json())
        .then(data => {
            console.log('Mentor Data received:', data);

            // Store the mentor data in sessionStorage
            sessionStorage.setItem('mentorData', JSON.stringify(data));

            // If DataTable is already initialized, destroy it before reinitializing
            if (isDataTableInitialized) {
                $('#mentorTable').DataTable().destroy();
            }

            // Call a function to render the table using the stored data
            renderMentorTable();
        })
        .catch(error => console.error('Error:', error));
}

// Function to handle mentor deletion
function deleteMentor(mentorId) {
    // Display a confirmation dialog before deleting the mentor
    $('#deleteMentorModal').modal('show'); // Open the delete confirmation modal
    
    // Handle delete confirmation
    $('#confirmDeleteMentor').off('click').on('click', function() {
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
                showToastMessage('success', 'Mentor deleted successfully');
                // Remove the table row in the current tab after deleting
                $(`#mentorTable tr[data-mentorid="${escapeHTML(mentorId)}"]`).remove();
                // Reload the page with the updated table
                fetchAndUpdateMentorTable();
            } else {
                showToastMessage('error', 'Error deleting mentor: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showToastMessage('error', 'An error occurred while deleting the mentor. Please try again.');
        });
        
        $('#deleteMentorModal').modal('hide'); // Hide the delete confirmation modal after deletion
    });
}


// Function to show batch details
function showBatchDetails() {
    fetch('/show_batches')
        .then(response => response.json())
        .then(data => {
            console.log('Batch Data received:', data);

            // Store the batch data in sessionStorage
            sessionStorage.setItem('batchData', JSON.stringify(data));

            // Navigate to batch_table.html in the same tab
            window.location.href = '/batch_table';

            // Alternatively, you can use:
            // window.location.replace('/batch_table');
        })
        .catch(error => console.error('Error:', error));
}

function renderBatchTable() {
    // Retrieve the batch data from sessionStorage
    const storedData = sessionStorage.getItem('batchData');
    const data = storedData ? JSON.parse(storedData) : [];

    // Create an array to store the table rows
    const tableRows = data.map(batch => `
      <tr>
        <td>${batch.BatchID}</td>
        <td contenteditable="true" data-batchid="${escapeHTML(batch.BatchID)}" data-field="batchName">${escapeHTML(batch.batchName)}</td>
        <td>
          <button class="btn btn-success" onclick="editBatch(${escapeHTML(batch.BatchID)})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="deleteBatch(${escapeHTML(batch.BatchID)})"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>`
    );

    // Add the table rows to the table in the new tab
    $('#batchTableBody').html(tableRows.join(''));

    // Initialize DataTables for the table with pagination
    $('#batchTable').DataTable({
        paging: true,
        pageLength: 5, // Display 5 rows per page (customize as needed)
        lengthMenu: [5, 10, 25, 50], // Customize the length menu options
        // Add sorting options for each column
        columnDefs: [
            { orderable: true, targets: [0] }, // Batch ID
            { orderable: false, targets: [1] }, // Batch Name
            { orderable: false, targets: [2] }  // Actions
        ],
    });

    // Make only the specified table cells (batchName) editable using jQuery
    $('#batchTable td:not(:first-child):not(:last-child)').attr('contenteditable', 'true');
}
// Call the function to render the table when the page is loaded or reloaded
renderBatchTable();

// Function to edit batch details
function editBatch(batchID) {
    const batchNameElement = $(`#batchTable td[data-batchid="${escapeHTML(batchID)}"][data-field="batchName"]`);
    const newBatchName = batchNameElement.text();

    $('#editBatchModal').modal('show'); // Open the edit confirmation modal
    
    // Handle edit confirmation
    $('#confirmEditBatch').off('click').on('click', function() {
        fetch('/edit_batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                BatchID: batchID,
                batchName: newBatchName,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToastMessage('success', 'Batch edited successfully');
                // Update the table cell content after editing
                batchNameElement.text(newBatchName);
                // Fetch and render the updated data without reloading the page
                fetchAndUpdateBatchTable();
            } else {
                showToastMessage('error', 'Error editing batch: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
        $('#editBatchModal').modal('hide'); // Hide the edit confirmation modal after editing
    });
}

// Function to fetch and update the batch table data
function fetchAndUpdateBatchTable() {
    // Check if DataTable is already initialized on the table
    const isDataTableInitialized = $.fn.DataTable.isDataTable('#batchTable');

    fetch('/show_batches')
        .then(response => response.json())
        .then(data => {
            console.log('Batch Data received:', data);

            // Store the batch data in sessionStorage
            sessionStorage.setItem('batchData', JSON.stringify(data));

            // If DataTable is already initialized, destroy it before reinitializing
            if (isDataTableInitialized) {
                $('#batchTable').DataTable().destroy();
            }

            // Call a function to render the table using the stored data
            renderBatchTable();
        })
        .catch(error => console.error('Error:', error));
}

// Function to handle batch deletion
function deleteBatch(batchID) {
    // Display a confirmation dialog before deleting the batch
    $('#deleteBatchModal').modal('show'); // Open the delete confirmation modal
    
    // Handle delete confirmation
    $('#confirmDeleteBatch').off('click').on('click', function() {
        fetch('/delete_batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                BatchID: batchID,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.success) {
                showToastMessage('success', 'Batch deleted successfully');
                // Remove the table row in the current tab after deleting
                $(`#batchTable tr[data-batchid="${escapeHTML(batchID)}"]`).remove();
                // Fetch and render the updated data without reloading the page
                fetchAndUpdateBatchTable();
            } else {
                showToastMessage('error', 'Error deleting batch: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showToastMessage('error', 'An error occurred while deleting the batch. Please try again.');
        });
        
        $('#deleteBatchModal').modal('hide'); // Hide the delete confirmation modal after deletion
    });
}


// Show Program
function showProgramDetails() {
    fetch('/show_programs')
        .then(response => response.json())
        .then(data => {
            console.log('Program Data received:', data);

            // Store the program data in sessionStorage
            sessionStorage.setItem('programData', JSON.stringify(data));

            // Navigate to program_table.html in the same tab
            window.location.href = '/program_table';

            // Alternatively, you can use:
            // window.location.replace('/program_table');
        })
        .catch(error => console.error('Error:', error));
}

function renderProgramTable() {
    // Retrieve the program data from sessionStorage
    const storedData = sessionStorage.getItem('programData');
    const data = storedData ? JSON.parse(storedData) : [];

    // Create an array to store the table rows
    const tableRows = data.map(program => `
      <tr>
        <td>${program.ProgramID}</td>
        <td contenteditable="true" data-programid="${escapeHTML(program.ProgramID)}" data-field="programName">${escapeHTML(program.programName)}</td>
        <td>
          <button class="btn btn-success" onclick="editProgram(${escapeHTML(program.ProgramID)})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="deleteProgram(${escapeHTML(program.ProgramID)})"><i class="fas fa-trash-alt"></i></button>
        </td>
      </tr>`
    );

    // Add the table rows to the table in the new tab
    $('#programTableBody').html(tableRows.join(''));

    // Initialize DataTables for the table with pagination
    $('#programTable').DataTable({
        paging: true,
        pageLength: 5, // Display 5 rows per page (customize as needed)
        lengthMenu: [5, 10, 25, 50], // Customize the length menu options
        // Add sorting options for each column
        columnDefs: [
            { orderable: true, targets: [0] }, // Program ID
            { orderable: false, targets: [1] }, // Program Name
            { orderable: false, targets: [2] }  // Actions
        ],
    });

    // Make only the specified table cells (programName) editable using jQuery
    $('#programTable td:not(:first-child):not(:last-child)').attr('contenteditable', 'true');
}
// Call the function to render the table when the page is loaded or reloaded
renderProgramTable();

//edit program
function editProgram(programID) {
    const programNameElement = $(`#programTable td[data-programid="${escapeHTML(programID)}"][data-field="programName"]`);
    const newProgramName = programNameElement.text();

    $('#editProgramModal').modal('show'); // Open the edit confirmation modal
    
    // Handle edit confirmation
    $('#confirmEditProgram').off('click').on('click', function() {
        fetch('/edit_program', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ProgramID: programID,
                programName: newProgramName,
                // Add any additional fields for editing as needed
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToastMessage('success', 'Program edited successfully');
                // Update the table cell content after editing
                programNameElement.text(newProgramName);
                // Fetch and render the updated data without reloading the page
                fetchAndUpdateProgramTable();
            } else {
                showToastMessage('error', 'Error editing program: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
        $('#editProgramModal').modal('hide'); // Hide the edit confirmation modal after editing
    });
}

// Function to fetch and update the program table data
function fetchAndUpdateProgramTable() {
    // Check if DataTable is already initialized on the table
    const isDataTableInitialized = $.fn.DataTable.isDataTable('#programTable');

    fetch('/show_programs')
        .then(response => response.json())
        .then(data => {
            console.log('Program Data received:', data);

            // Store the program data in sessionStorage
            sessionStorage.setItem('programData', JSON.stringify(data));

            // If DataTable is already initialized, destroy it before reinitializing
            if (isDataTableInitialized) {
                $('#programTable').DataTable().destroy();
            }

            // Call a function to render the table using the stored data
            renderProgramTable();
        })
        .catch(error => console.error('Error:', error));
}

// Function to delete program
function deleteProgram(programID) {
    // Display a confirmation dialog before deleting the program
    $('#deleteProgramModal').modal('show'); // Open the delete confirmation modal
    
    // Handle delete confirmation
    $('#confirmDeleteProgram').off('click').on('click', function() {
        fetch('/delete_program', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ProgramID: programID,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            if (data.success) {
                showToastMessage('success', 'Program deleted successfully');
                // Remove the table row in the current tab after deleting
                $(`#programTable tr[data-programid="${escapeHTML(programID)}"]`).remove();
                // Fetch and render the updated data without reloading the page
                fetchAndUpdateProgramTable();
            } else {
                showToastMessage('error', 'Error deleting program: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            showToastMessage('error', 'An error occurred while deleting the program. Please try again.');
        });
        
        $('#deleteProgramModal').modal('hide'); // Hide the delete confirmation modal after deletion
    });
}
