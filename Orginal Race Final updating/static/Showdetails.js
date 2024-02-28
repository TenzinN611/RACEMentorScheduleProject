// Function to hide the preloader and show the content
function showContent() {
    document.getElementById('preloader-overlay').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

// Simulating the preloader completion with a timeout (you can replace this with your actual preloader logic)
setTimeout(showContent, 2000); // Adjust the timeout as needed /* Hide content initially */

// Show Course details
function showCourseDetails() {
    fetch('/show_courses')
        .then(response => response.json())
        .then(data => {
            console.log('Course Data received:', data);

            // Store the course data in sessionStorage
            sessionStorage.setItem('courseData', JSON.stringify(data));

            // Open a new tab with course.html
            const newTab = window.open('/course_table');
            newTab.onload = function () {
                // Call a function to render the table using the stored data
                renderCourseTable();
            };
        })
        .catch(error => console.error('Error:', error));
}

// Call the function to show course details
//showCourseDetails();
//renderCourseTable
function renderCourseTable() {
    const storedData = sessionStorage.getItem('courseData');
    const data = storedData ? JSON.parse(storedData) : [];

    // Create an array to store the table rows
    const tableRows = data.map(course => `
        <tr>
          <td>${course.CourseID}</td>
          <td contenteditable="true" data-courseid="${course.CourseID}" data-field="courseName">${course.courseName}</td>
          <td contenteditable="true" data-courseid="${course.CourseID}" data-field="description">${course.description}</td>
          <td>
            <button class="btn btn-success" onclick="editCourse(${course.CourseID})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger" onclick="deleteCourse(${course.CourseID})"><i class="fas fa-trash-alt"></i></button>
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
    const courseNameElement = $(`#courseTable td[data-courseid="${courseID}"][data-field="courseName"]`);
    const descriptionElement = $(`#courseTable td[data-courseid="${courseID}"][data-field="description"]`);

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


    // Display a confirmation dialog before editing the course
    if (confirm('Are you sure you want to edit this course?')) {
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
                    alert('Course edited successfully');
                    // Update the table cell content after editing
                    courseNameElement.text(newCourseName);
                    descriptionElement.text(newDescription);
                    // Fetch and render the updated data without reloading the page
                    fetchAndUpdateTable();
                } else {
                    alert('Error editing course: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
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
    if (confirm('Are you sure you want to delete this course?')) {
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
                    alert('Course deleted successfully');
                    // Remove the table row in the current tab after deleting
                    $(`#courseTable tr[data-courseid="${courseID}"]`).remove();
                    // Reload the page with the updated table
                    fetchAndUpdateTable();
                } else {
                    alert('Error deleting course: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                alert('An error occurred while deleting the course. Please try again.');
            });
    }
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

            // Open a new tab with mentor_table.html
            const newTab = window.open('/mentor_table');
            newTab.onload = function () {
                // Call a function to render the mentor table using the stored data
                renderMentorTable();
            };
        })
        .catch(error => console.error('Error:', error));
}

// Call the function to show mentor details
//showMentorDetails();

// Function to render the mentor table
function renderMentorTable() {
    // Retrieve the mentor data from sessionStorage
    const storedData = sessionStorage.getItem('mentorData');
    const data = storedData ? JSON.parse(storedData) : [];

    // Create an array to store the table rows
    const tableRows = data.map(mentor => `
        <tr>
          <td>${mentor.mentorId}</td>
          <td contenteditable="true" data-mentorid="${mentor.mentorId}" data-field="mentorName">${mentor.mentorName}</td>
          <td contenteditable="true" data-mentorid="${mentor.mentorId}" data-field="mentorRaceEmailAddress">${mentor.mentorRaceEmailAddress}</td>
          <td contenteditable="true" data-mentorid="${mentor.mentorId}" data-field="mentorEmailAddress">${mentor.mentorEmailAddress}</td>
          <td contenteditable="true" data-mentorid="${mentor.mentorId}" data-field="mentorProfile">${mentor.mentorProfile}</td>
          <td contenteditable="true" data-mentorid="${mentor.mentorId}" data-field="mentorWhatsapp">${mentor.mentorWhatsapp}</td>
          <td>
            <button class="btn btn-success" onclick="editMentor(${mentor.mentorId})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-danger" onclick="deleteMentor(${mentor.mentorId})"><i class="fas fa-trash-alt"></i></button>
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
    const mentorNameElement = $(`#mentorTable td[data-mentorid="${mentorId}"][data-field="mentorName"]`);
    const raceEmailElement = $(`#mentorTable td[data-mentorid="${mentorId}"][data-field="mentorRaceEmailAddress"]`);
    const emailElement = $(`#mentorTable td[data-mentorid="${mentorId}"][data-field="mentorEmailAddress"]`);
    const profileElement = $(`#mentorTable td[data-mentorid="${mentorId}"][data-field="mentorProfile"]`);
    const whatsappElement = $(`#mentorTable td[data-mentorid="${mentorId}"][data-field="mentorWhatsapp"]`);

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
        alert('WhatsApp number should be 10 digits');
        return;
    }

    // Display a confirmation dialog before editing the mentor
    if (confirm('Are you sure you want to edit this mentor?')) {
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
                    alert('Mentor edited successfully');
                    // Update the table cell content after editing
                    mentorNameElement.text(newMentorName);
                    raceEmailElement.text(newRaceEmail);
                    emailElement.text(newEmail);
                    profileElement.text(newProfile);
                    whatsappElement.text(newWhatsapp);
                    // Fetch and render the updated data without reloading the page
                    fetchAndUpdateMentorTable();
                } else {
                    alert('Error editing mentor: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
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

// Function to delete a mentor
function deleteMentor(mentorId) {
    // Display a confirmation dialog before deleting the mentor
    if (confirm('Are you sure you want to delete this mentor?')) {
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
                    // Remove the table row in the current tab after deleting
                    $(`#mentorTable tr[data-mentorid="${mentorId}"]`).remove();
                    // Reload the page with the updated table
                    fetchAndUpdateMentorTable();
                } else {
                    alert('Error deleting mentor: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                alert('An error occurred while deleting the mentor. Please try again.');
            });
    }
}


// Function to show batch details
function showBatchDetails() {
    fetch('/show_batches')
        .then(response => response.json())
        .then(data => {
            console.log('Batch Data received:', data);

            // Store the batch data in sessionStorage
            sessionStorage.setItem('batchData', JSON.stringify(data));

            // Open a new tab with batch.html
            const newTab = window.open('/batch_table');
            newTab.onload = function () {
                // Call a function to render the table using the stored data
                renderBatchTable();
            };
        })
        .catch(error => console.error('Error:', error));
}

// Call the function to show batch details
//showBatchDetails();
function renderBatchTable() {
    // Retrieve the batch data from sessionStorage
    const storedData = sessionStorage.getItem('batchData');
    const data = storedData ? JSON.parse(storedData) : [];

    // Create an array to store the table rows
    const tableRows = data.map(batch => `
      <tr>
        <td>${batch.BatchID}</td>
        <td contenteditable="true" data-batchid="${batch.BatchID}" data-field="batchName">${batch.batchName}</td>
        <td>
          <button class="btn btn-success" onclick="editBatch(${batch.BatchID})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="deleteBatch(${batch.BatchID})"><i class="fas fa-trash-alt"></i></button>
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
    const batchNameElement = $(`#batchTable td[data-batchid="${batchID}"][data-field="batchName"]`);
    const newBatchName = batchNameElement.text();

    // Display a confirmation dialog before editing the batch
    if (confirm('Are you sure you want to edit this batch?')) {
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
                    alert('Batch edited successfully');
                    // Update the table cell content after editing
                    batchNameElement.text(newBatchName);
                    // Fetch and render the updated data without reloading the page
                    fetchAndUpdateBatchTable();
                } else {
                    alert('Error editing batch: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
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

// Function to delete batch
function deleteBatch(batchID) {
    // Display a confirmation dialog before deleting the batch
    if (confirm('Are you sure you want to delete this batch?')) {
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
                    alert('Batch deleted successfully');
                    // Remove the table row in the current tab after deleting
                    $(`#batchTable tr[data-batchid="${batchID}"]`).remove();
                    // Fetch and render the updated data without reloading the page
                    fetchAndUpdateBatchTable();
                } else {
                    alert('Error deleting batch: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                alert('An error occurred while deleting the batch. Please try again.');
            });
    }
}


//Show Program
function showProgramDetails() {
    fetch('/show_programs')
        .then(response => response.json())
        .then(data => {
            console.log('Program Data received:', data);

            // Store the program data in sessionStorage
            sessionStorage.setItem('programData', JSON.stringify(data));

            // Open a new tab with program.html
            const newTab = window.open('/program_table');
            newTab.onload = function () {
                // Call a function to render the table using the stored data
                renderProgramTable();
            };
        })
        .catch(error => console.error('Error:', error));
}

// Call the function to show program details
//showProgramDetails();

function renderProgramTable() {
    // Retrieve the program data from sessionStorage
    const storedData = sessionStorage.getItem('programData');
    const data = storedData ? JSON.parse(storedData) : [];

    // Create an array to store the table rows
    const tableRows = data.map(program => `
      <tr>
        <td>${program.ProgramID}</td>
        <td contenteditable="true" data-programid="${program.ProgramID}" data-field="programName">${program.programName}</td>
        <td>
          <button class="btn btn-success" onclick="editProgram(${program.ProgramID})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger" onclick="deleteProgram(${program.ProgramID})"><i class="fas fa-trash-alt"></i></button>
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
    const programNameElement = $(`#programTable td[data-programid="${programID}"][data-field="programName"]`);
    const newProgramName = programNameElement.text();

    // Display a confirmation dialog before editing the program
    if (confirm('Are you sure you want to edit this program?')) {
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
                    alert('Program edited successfully');
                    // Update the table cell content after editing
                    programNameElement.text(newProgramName);
                    // Fetch and render the updated data without reloading the page
                    fetchAndUpdateProgramTable();
                } else {
                    alert('Error editing program: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
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
    if (confirm('Are you sure you want to delete this program?')) {
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
                    alert('Program deleted successfully');
                    // Remove the table row in the current tab after deleting
                    $(`#programTable tr[data-programid="${programID}"]`).remove();
                    // Fetch and render the updated data without reloading the page
                    fetchAndUpdateProgramTable();
                } else {
                    alert('Error deleting program: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                alert('An error occurred while deleting the program. Please try again.');
            });
    }
}
