from flask import Flask, render_template, request, redirect, url_for, flash, session ,jsonify
from datetime import timedelta,datetime, timezone
import psycopg2
from flask_mail import Mail, Message
from psycopg2.extras import DictCursor
from dotenv import load_dotenv
import secrets
import string
import os
import hashlib


app = Flask(__name__, static_url_path='/static')
app.secret_key = 'password'  # Add a secret key

# Database connection details
DB_HOST = 'ep-steep-meadow-a1gz0jau.ap-southeast-1.aws.neon.tech'
DB_PORT = '5432'
DB_NAME = 'raceproject'
DB_USER = 'tenzinnamsey611'
DB_PASSWORD = 'oYGLpCWT1DK8'




# Replace 'your_username', 'your_password', 'your_database', and 'your_host' with your PostgreSQL credentials

conn = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER ,
        password=DB_PASSWORD)


conn1 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
cursor1 = conn1.cursor()

# Load environment variables from .env file
load_dotenv()

# Outlook configuration
app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.environ.get('OUTLOOK_EMAIL')  # Use environment variable
app.config['MAIL_PASSWORD'] = os.environ.get('OUTLOOK_PASSWORD')  # Use environment variable

mail = Mail(app)  # Create an instance of the Mail class

def caesar_cipher(text, shift):
    encrypted_text = ''
    for char in text:
        if char.isalpha():
            # Determine if character is uppercase or lowercase
            if char.isupper():
                # Shift uppercase letters
                encrypted_text += chr((ord(char) - 65 + shift) % 26 + 65)
            else:
                # Shift lowercase letters
                encrypted_text += chr((ord(char) - 97 + shift) % 26 + 97)
        else:
            # Keep non-alphabetic characters unchanged
            encrypted_text += char
    return encrypted_text

def caesar_decipher(text, shift):
    return caesar_cipher(text, -shift)

# Example usage
plaintext = "Hello, World!"
shift = 3
encrypted_text = caesar_cipher(plaintext, shift)
print("Encrypted:", encrypted_text)

decrypted_text = caesar_decipher(encrypted_text, shift)
print("Decrypted:", decrypted_text)


# Set the permanent session lifetime (you can adjust this value)
app.permanent_session_lifetime = timedelta(minutes=30)
@app.before_request
def before_request():
    session.permanent = True
    session.modified = True

    # Check if the session has expired
    if 'last_activity' in session:
        time_since_last_activity = datetime.now(timezone.utc) - session['last_activity']
        if time_since_last_activity > app.permanent_session_lifetime:
            session.pop('username', None)  # Remove the username from the session
            flash('Session expired. Please log in again.', 'info')
            return redirect(url_for('index'))

    # Update the last activity timestamp
    session['last_activity'] = datetime.now(timezone.utc)

@app.route('/')
def index():
    return render_template('login.html')

def hash_string(input_string):
    # Encode the input string to bytes
    input_bytes = input_string.encode('utf-8')

    # Create a SHA-256 hash object
    sha256_hash = hashlib.sha256()

    # Update the hash object with the input bytes
    sha256_hash.update(input_bytes)

    # Get the hexadecimal representation of the hash
    hashed_string = sha256_hash.hexdigest()

    return hashed_string

@app.route('/login', methods=['POST', 'GET'])
def login():
    username9 = ""  # Initialize username9 with an empty string
    
    if request.method == 'POST':
        username9 = request.form['username']
        username = caesar_cipher(username9, shift)
        print(username)
        passwordbf1 = request.form['password']
        password = hash_string(passwordbf1)

        # Perform MySQL query to check if the username exists
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM login WHERE username = %s", (username,))
        user = cursor.fetchone()
        print(user)
        cursor.close()

        if user:
            # Username exists, now check the password
            if user[-1] == password:
                session['username'] = caesar_decipher(user[-2], shift) # Store the username in the session
                session['FirstName'] = caesar_decipher(user[1], shift)
                session['LastName'] = caesar_decipher(user[2], shift)
                session['EmailAddress'] = caesar_decipher(user[3], shift)  
                flash('Login successful', 'success')
                return redirect(url_for('index1'))  # Redirect to index1.html on successful login
            else:
                flash('Invalid password. Please try again.', 'error')
        else:
            flash('The entered username does not exist. Please try again or register for an account.', 'error')

    return render_template('login.html', username=username9)



@app.route('/LandingPage')
def index1():
    if 'username' in session:
        username = session['username']
        return render_template('LandingPage.html', username=username)
    else:
        flash('You need to login first', 'error')
        return redirect(url_for('login'))

@app.route('/index')
def index2():
    if 'username' in session:
        username = session['username']
        FirstName = session['FirstName']
        LastName = session['LastName']
        EmailAddress = session['EmailAddress']
        return render_template('index.html', username=username, FirstName=FirstName, LastName=LastName, EmailAddress=EmailAddress)
    else:
        flash('You need to login first', 'error')
        return redirect(url_for('login'))
    
@app.route('/signup', methods=['POST'])
def signup():
    if request.method == 'POST':
        first_name9 = request.form['FirstName']
        first_name = caesar_cipher(first_name9, shift)
        last_name9 = request.form['LastName']
        last_name = caesar_cipher(last_name9, shift)
        email9 = request.form['EmailAddress']
        email = caesar_cipher(email9, shift)
        username9 = request.form['username']
        username = caesar_cipher(username9, shift)
        passwordbf = request.form['password']
        password = hash_string(passwordbf)


        # Validate first_name (allow only alphabets)
        if not first_name9.isalpha():
            flash('First name should contain only alphabets.', 'error')
            return render_template('login.html')

        # Validate last_name (allow only alphabets)
        if not last_name9.isalpha():
            flash('Last name should contain only alphabets.', 'error')
            return render_template('login.html')

        # Perform MySQL query to check if username or email already exists
        cursor = conn.cursor()
        try:
            cursor.execute("""
                SELECT * FROM login WHERE username = %s OR email = %s""", (username, email))
            existing_user = cursor.fetchone()

            if existing_user:
                # Username or email already exists
                flash('Username or email already in use. Please choose a different one.', 'error')
                return render_template('login.html')

            # Perform MySQL query for user registration
            cursor.execute("""
                INSERT INTO login (first_name, last_name, email, username, password)
                VALUES (%s, %s, %s, %s, %s)""", (first_name, last_name, email, username, password))
            conn.commit()
            flash('Registration successful!', 'success')
            return render_template('login.html')
        #except Exception as e:
            # Handle database insertion error
            #flash('An error occurred during registration. Please try again.', 'error')
            #return render_template('login.html')
        finally:
            cursor.close()

    return render_template('login.html')


@app.route('/signup1', methods=['POST'])
def signup1():
    if request.method == 'POST':
        first_name9 = request.form['FirstName']
        first_name = caesar_cipher(first_name9, shift)
        last_name9 = request.form['LastName']
        last_name = caesar_cipher(last_name9, shift)
        email9 = request.form['EmailAddress']
        email = caesar_cipher(email9, shift)
        username9 = request.form['Username']
        username = caesar_cipher(username9, shift)
        currentuser9 = request.form['currentUsername']
        currentuser = caesar_cipher(currentuser9, shift)

        # Validate first_name (allow only alphabets)
        if not first_name9.isalpha():
            flash('First name should contain only alphabets.', 'error')
            return render_template('index.html')

        # Validate last_name (allow only alphabets)
        if not last_name9.isalpha():
            flash('Last name should contain only alphabets.', 'error')
            return render_template('index.html')

        # Perform MySQL query to check if username or email already exists
        cursor = conn.cursor()
        try:
            # Perform MySQL query for user registration
            cursor.execute("""
                           UPDATE login SET first_name=%s, last_name=%s, email=%s, username=%s WHERE username=%s
                """, (first_name, last_name, email, username, currentuser))
            conn.commit()
            session['username'] = username9  # Store the username in the session
            session['FirstName'] = first_name9
            session['LastName'] = last_name9
            session['EmailAddress'] = email9
            #flash('Edit successful! Login Again Please', 'success')
        except Exception as e:
            # Handle database insertion error
            #flash('An error occurred during registration. Please try again.', 'error')
            return render_template('index.html')
        finally:
            cursor.close()

        # Redirect to a specific page after successful update
        username1 = session['username']
        FirstName1 = session['FirstName']
        LastName1 = session['LastName']
        EmailAddress1 = session['EmailAddress']
        return render_template('index.html', username=username1, FirstName=FirstName1, LastName=LastName1, EmailAddress=EmailAddress1)

@app.route('/submit_form', methods=['POST'])
def submit_form():
    try:
        data = request.json

        # Insert data into the database
        query = "INSERT INTO Modules (ModuleID, moduleName, description) VALUES (%s, %s, %s)"
        values = (data['CourseID'], caesar_cipher(data['courseName'], shift), caesar_cipher(data['description'], shift))
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'message': 'Data inserted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/edit_course', methods=['POST'])
def edit_course():
    try:
        CourseID = request.json.get('CourseID')
        courseName9 = request.json.get('courseName')
        description9 = request.json.get('description')
        courseName = caesar_cipher(courseName9, shift)
        description = caesar_cipher(description9, shift)

        # Perform the necessary update in your database
        query = "UPDATE Modules SET ModuleName=%s, description=%s WHERE ModuleID=%s"
        values = (courseName, description, CourseID)
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'success': True, 'message': 'Module edited successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@app.route('/delete_course', methods=['POST'])
def delete_course():
    try:
        CourseID = request.json.get('CourseID')
        # Delete the course from the database
        query = "DELETE FROM Modules WHERE ModuleID = %s"
        values = (CourseID,)
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'success': True, 'message': 'Module deleted successfully'})
    except Exception as e:
        # Log the error for debugging
        print(f"Error deleting course: {e}")
        return jsonify({'success': False, 'message': str(e)})



@app.route('/show_courses', methods=['GET'])
def show_courses():
    try:
        # Fetch data from the database
        query = "SELECT * FROM Modules"
        cursor1.execute(query)
        data = cursor1.fetchall()

        # Prepare the data to be sent as JSON
        course_details = [{'CourseID':course[0], 'courseName': caesar_decipher(course[1], shift), 'description': caesar_decipher(course[2], shift)} for course in data]

        return jsonify(course_details)
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/course_table')
def course_table():
    return render_template('CourseTable.html')

    
@app.route('/submit_mentor_form', methods=['POST'])
def submit_mentor_form():
    try:
        data = request.json

        # Validate that all required fields are present in the request data
        required_fields = ['mentorId', 'mentorName', 'mentorRaceEmailAddress', 'mentorEmailAddress', 'mentorProfile', 'mentorWhatsapp']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Insert data into the database
        query = "INSERT INTO Mentors (mentorId, mentorName, mentorRaceEmailAddress, mentorEmailAddress, mentorProfile, mentorWhatsapp) VALUES (%s, %s, %s, %s, %s, %s)"
        values = (
            caesar_cipher(data['mentorId'], shift),
            caesar_cipher(data['mentorName'], shift),
            caesar_cipher(data['mentorRaceEmailAddress'], shift),
            caesar_cipher(data['mentorEmailAddress'], shift),
            caesar_cipher(data['mentorProfile'], shift),
            caesar_cipher(data['mentorWhatsapp'], shift)
        )

        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'message': 'Data inserted successfully'})
    except Exception as e:
        print("Error:", str(e))  # Log the error for debugging
        return jsonify({'error': str(e)})
    

@app.route('/show_mentors', methods=['GET'])
def show_Mentors():
    try:
        # Fetch data from the database
        query = "SELECT * FROM Mentors"
        cursor1.execute(query)
        data = cursor1.fetchall()

        # Prepare the data to be sent as JSON
        Mentor_details = [{'mentorId': course[0], 'mentorName': caesar_decipher(course[1], shift), 'mentorRaceEmailAddress': caesar_decipher(course[2], shift),'mentorEmailAddress': caesar_decipher(course[3], shift),'mentorProfile': caesar_decipher(course[4], shift),'mentorWhatsapp':caesar_decipher(course[5], shift)} for course in data]

        return jsonify(Mentor_details)
    except Exception as e:
        return jsonify({'error': str(e)})
    
@app.route('/mentor_table')
def Mentor_table():
    return render_template('MentorTable.html')
    

@app.route('/edit_mentor', methods=['POST'])
def edit_mentor():
    try:
        mentorId = request.json.get('mentorId')
        mentorName9 = request.json.get('mentorName')
        mentorName = caesar_cipher(mentorName9, shift)
        mentorRaceEmailAddress9 = request.json.get('mentorRaceEmailAddress')
        mentorRaceEmailAddress = caesar_cipher(mentorRaceEmailAddress9, shift)
        mentorEmailAddress9 = request.json.get('mentorEmailAddress')
        mentorEmailAddress = caesar_cipher(mentorEmailAddress9, shift)
        mentorProfile9 = request.json.get('mentorProfile')
        mentorProfile = caesar_cipher(mentorProfile9, shift)
        mentorWhatsapp9 = request.json.get('mentorWhatsapp')
        mentorWhatsapp = caesar_cipher(mentorWhatsapp9, shift)

        # Perform the necessary update in your database
        query = "UPDATE Mentors SET mentorName=%s, mentorRaceEmailAddress=%s, mentorEmailAddress=%s, mentorProfile=%s, mentorWhatsapp=%s WHERE mentorId=%s"
        values = (mentorName, mentorRaceEmailAddress, mentorEmailAddress, mentorProfile, mentorWhatsapp, mentorId)
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'success': True, 'message': 'Mentor edited successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@app.route('/delete_mentor', methods=['POST'])
def delete_mentor():
    try:
        mentorId = request.json.get('mentorId')
        # Delete the mentor from the database
        query = "DELETE FROM Mentors WHERE mentorId = %s"
        values = (mentorId,)
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'success': True, 'message': 'Mentor deleted successfully'})
    except Exception as e:
        # Log the error for debugging
        print(f"Error deleting mentor: {e}")
        return jsonify({'success': False, 'message': str(e)})


@app.route('/submit_batch_form', methods=['POST'])
def submit_batch_form():
    try:
        data = request.json

        # Insert data into the database
        query = "INSERT INTO Batches (BatchID, batchName) VALUES (%s, %s)"
        values = (data['BatchID'], caesar_cipher(data['batchName'], shift))
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'message': 'Data inserted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/show_batches', methods=['GET'])
def show_batches():
    try:
        # Fetch data from the database
        query = "SELECT * FROM Batches"
        cursor1.execute(query)
        data = cursor1.fetchall()

        # Prepare the data to be sent as JSON
        batch_details = [{'BatchID': batch[0], 'batchName': caesar_decipher(batch[1], shift)} for batch in data]

        return jsonify(batch_details)
    except Exception as e:
        return jsonify({'error': str(e)})
        
@app.route('/batch_table')
def Batch_table():
    return render_template('BatchTable.html')
    
@app.route('/edit_batch', methods=['POST'])
def edit_batch():
    try:
        BatchID = request.json.get('BatchID')
        batchName9 = request.json.get('batchName')
        batchName = caesar_cipher(batchName9, shift)

        # Perform the necessary update in your database
        query = "UPDATE Batches SET batchName=%s WHERE BatchID=%s"
        values = (batchName, BatchID)
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'success': True, 'message': 'Batch edited successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@app.route('/delete_batch', methods=['POST'])
def delete_batch():
    try:
        BatchID = request.json.get('BatchID')
        # Delete the batch from the database
        query = "DELETE FROM Batches WHERE BatchID = %s"
        values = (BatchID,)
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'success': True, 'message': 'Batch deleted successfully'})
    except Exception as e:
        # Log the error for debugging
        print(f"Error deleting batch: {e}")
        return jsonify({'success': False, 'message': str(e)})


@app.route('/submit_program_form', methods=['POST'])
def submit_program_form():
    try:
        data = request.json

        # Insert data into the database
        query = "INSERT INTO Programs (ProgramID, programName) VALUES (%s, %s)"
        values = (data['ProgramID'], caesar_cipher(data['programName'], shift))
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'message': 'Data inserted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/show_programs', methods=['GET'])
def show_programs():
    try:
        # Fetch data from the database
        query = "SELECT * FROM Programs"
        cursor1.execute(query)
        data = cursor1.fetchall()

        # Prepare the data to be sent as JSON
        program_details = [{'ProgramID': program[0], 'programName': caesar_decipher(program[1], shift)} for program in data]

        return jsonify(program_details)
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/program_table')
def Program_table():
    return render_template('ProgramTable.html')

@app.route('/edit_program', methods=['POST'])
def edit_program():
    try:
        ProgramID = request.json.get('ProgramID')
        programName9 = request.json.get('programName')
        programName = caesar_cipher(programName9, shift)

        # Perform the necessary update in your database
        query = "UPDATE Programs SET programName=%s WHERE ProgramID=%s"
        values = (programName, ProgramID)
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'success': True, 'message': 'Program edited successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@app.route('/delete_program', methods=['POST'])
def delete_program():
    try:
        ProgramID = request.json.get('ProgramID')
        # Delete the program from the database
        query = "DELETE FROM Programs WHERE ProgramID = %s"
        values = (ProgramID,)
        cursor1.execute(query, values)
        conn1.commit()

        return jsonify({'success': True, 'message': 'Program deleted successfully'})
    except Exception as e:
        # Log the error for debugging
        print(f"Error deleting program: {e}")
        return jsonify({'success': False, 'message': str(e)})


@app.route('/Schedule', methods=['GET', 'POST'])
def Schedule1():
    if request.method == 'POST':
        print(request.form)
        CourseName = request.form.get('CourseName11')
        print(CourseName)
        MentorName = request.form.get('MentorName11')
        ProgramName = request.form.get('program11')
        BatchName = request.form.get('batch11')
        SDate = request.form.get('date')
        action = request.form.get('action')
        selected_date = datetime.strptime(SDate, '%Y-%m-%d')

        # Check if the selected date is before today
        if selected_date < datetime.now():
            error_message = "ERROR\n  Selected date must be today or later."
            return render_template('success.html', error_message=error_message)
        
        ScheduleS(CourseName, MentorName, ProgramName, BatchName, SDate)
        error_message = "Scheduled Successfully."
    return render_template('success.html', error_message=error_message)
        



def ScheduleS(CourseName, MentorName,ProgramName,BatchName,SDate):
    conn1 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
    cur = conn1.cursor()
    try:
    # Your logic for Method 1

        # Get CourseID
        cur.execute('SELECT ModuleID FROM Modules WHERE ModuleName = %s', (caesar_cipher(CourseName, shift),))
        cid = cur.fetchone()
        print(cid)

        # Get MentorID
        cur.execute('SELECT MentorID FROM Mentors WHERE MentorName = %s', (caesar_cipher(MentorName, shift),))
        mid = cur.fetchone()

        # Get ProgramID
        cur.execute('SELECT ProgramID FROM Programs WHERE ProgramName = %s', (caesar_cipher(ProgramName, shift),))
        pid = cur.fetchone()

        # Get BatchID
        cur.execute('SELECT BatchID FROM Batches WHERE BatchName = %s', (caesar_cipher(BatchName, shift),))
        bid = cur.fetchone()

        # Insert into ScheduleInformation
        cur.execute('INSERT INTO ScheduleInformation (ModuleID, MentorID, BatchID, ProgramID, ScheduleDate) VALUES (%s, %s, %s, %s, %s)',
                    (cid[0], mid[0], bid[0], pid[0], SDate))

        conn1.commit()
    except Exception:
        print("Something Wrong")
    finally:
        cur.close()
        conn1.close()
    return render_template('success.html')

def get_weeks_in_month(year, month):
    first_day_of_month = datetime(year, month, 1)
    next_month = first_day_of_month.replace(day=28) + timedelta(days=4)  # Move to the 1st day of next month
    last_day_of_month = next_month - timedelta(days=next_month.day)
    
    current_date = first_day_of_month
    weeks = []
    
    while current_date <= last_day_of_month:
        week_start = current_date
        week_end = min(current_date + timedelta(days=(6 - current_date.weekday())), last_day_of_month)
        weeks.append((week_start, week_end))
        current_date = week_end + timedelta(days=1)
    
    return weeks

@app.route('/get_saturdays_in_month')
def get_saturdays_in_month():
    now = datetime.now()
    month = now.month
    year = now.year

    first_day_of_month = datetime(year, month, 1)
    next_month = first_day_of_month.replace(day=28) + timedelta(days=4)  # Move to the 1st day of next month
    last_day_of_month = next_month - timedelta(days=next_month.day)

    current_date = first_day_of_month
    saturdays = []

    while current_date <= last_day_of_month:
        if current_date.weekday() == 5:  # Saturday has weekday() value 5
            saturdays.append(current_date)
        current_date += timedelta(days=1)

    saturday_dates = [str(saturday.date()) for saturday in saturdays]

    return jsonify({'saturdays': saturday_dates})


@app.route('/update_schedule', methods=['POST'])
def update_schedule():
    if request.method == 'POST':
        data = request.json  # Use request.json to get data from the request body

        schedule_id = data.get('ScheduleID')
        course_name = data.get('courseName')
        mentor_name = data.get('mentorName')
        program_name = data.get('programName')
        batch_name = data.get('batchName')
        schedule_date = data.get('scheduleDate')

        selected_date = datetime.strptime(schedule_date, '%Y-%m-%d')
        print(selected_date)
        print(datetime.now())

        # Check if the selected date is before today
        if selected_date < datetime.now():
            return jsonify({'error': 'Error. Date should be after or equal to current date'})
        else: 

            try:
                conn1 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
                cur = conn1.cursor()

                # Get CourseID
                cur.execute('SELECT ModuleID FROM Modules WHERE ModuleName = %s', (caesar_cipher(course_name, shift),))
                cid = cur.fetchone()

                # Get MentorID
                cur.execute('SELECT MentorID FROM Mentors WHERE MentorName = %s', (caesar_cipher(mentor_name, shift),))
                mid = cur.fetchone()

                # Get ProgramID
                cur.execute('SELECT ProgramID FROM Programs WHERE ProgramName = %s', (caesar_cipher(program_name, shift),))
                pid = cur.fetchone()

                # Get BatchID
                cur.execute('SELECT BatchID FROM Batches WHERE BatchName = %s', (caesar_cipher(batch_name, shift),))
                bid = cur.fetchone()

                # Update ScheduleInformation
                cur.execute('UPDATE ScheduleInformation SET ModuleID = %s, MentorID = %s, BatchID = %s, ProgramID = %s, ScheduleDate = %s WHERE ScheduleID = %s',
                            (cid[0], mid[0], bid[0], pid[0], schedule_date, schedule_id))

                conn1.commit()
            except Exception as e:
                print(f"Error: {e}")
                return jsonify({'error': 'Failed to update schedule'})
            finally:
                cur.close()
                conn1.close()

        return jsonify({'message': 'Schedule updated successfully'})


@app.route('/delete_schedule', methods=['POST'])
def delete_schedule():
    if request.method == 'POST':
        data = request.json  # Use request.json to get data from the request body

        schedule_id = data.get('ScheduleID')

        try:
            conn1 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
            cur = conn1.cursor()

            # Delete ScheduleInformation
            cur.execute('DELETE FROM ScheduleInformation WHERE ScheduleID = %s', (schedule_id,))

            conn1.commit()
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({'error': 'Failed to delete schedule'}), 500
        finally:
            cur.close()
            conn1.close()

        return jsonify({'message': 'Schedule deleted successfully'}), 200
    
@app.route('/get_counts', methods=['GET'])
def get_counts():
    try:
        conn2 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
        cursor2 = conn2.cursor()
        # Query database for counts
        cursor2.execute("SELECT COUNT(ModuleID) FROM Modules")
        module_count12 = cursor2.fetchone()[0]
        print(module_count12)

        cursor2.execute("SELECT COUNT(*) FROM Mentors")
        mentor_count = cursor2.fetchone()[0]

        cursor2.execute("SELECT COUNT(*) FROM Batches")
        batch_count = cursor2.fetchone()[0]

        cursor2.execute("SELECT COUNT(*) FROM Programs")
        program_count = cursor2.fetchone()[0]

        # Assume you have a query to get the count of scheduled items
        cursor2.execute("SELECT COUNT(*) FROM ScheduleInformation")
        scheduled_count = cursor2.fetchone()[0]

        # Return counts as JSON response
        return jsonify({
            'module_count': module_count12,
            'mentor_count': mentor_count,
            'batch_count': batch_count,
            'program_count': program_count,
            'scheduled_count': scheduled_count
        })
    except Exception as e:
        return jsonify({'error': str(e)})



@app.route('/get_batch_names')
def get_batch_names():
    try:
        conn4 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
        cursor4 = conn4.cursor()
        # Fetch data from the database
        query = """
            SELECT
                Batchname
            FROM
                batches
        """

        cursor4.execute(query)
        data = cursor4.fetchall()
        batch_names = [caesar_decipher(batch[0], shift) for batch in data]
        print(batch_names)
        return jsonify(batch_names)  # Return a JSON response directly as an array
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/show_schedule', methods=['GET'])
def show_schedule():
    td = request.args.get('td')
    print(td)
    print(type(td))
    ld = request.args.get('ld')
    print(ld)
    print(type(ld))
    now = datetime.now()
    current_month = now.month
    current_year = now.year

    weeks = get_weeks_in_month(current_year, current_month)
    print(weeks[0][0])

    conn2 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
    cursor2 = conn2.cursor()


    if(td.isalpha()):
        #get data from ld
        try:
        # Fetch data from the database
            query = """
        SELECT
            Modules.ModuleName AS ModuleName,
            Mentors.MentorName AS MentorName,
            Batches.BatchName AS BatchName,
            Programs.ProgramName AS ProgramName,
            ScheduleInformation.ScheduleDate AS Date,
            ScheduleInformation.ScheduleID as ScheduleID
        FROM
            ScheduleInformation
        JOIN
            Modules ON ScheduleInformation.ModuleID = Modules.ModuleID
        JOIN
            Mentors ON ScheduleInformation.MentorID = Mentors.MentorID
        JOIN
            Batches ON ScheduleInformation.BatchID = Batches.BatchID
        JOIN
            Programs ON ScheduleInformation.ProgramID = Programs.ProgramID
        WHERE Batches.BatchName = %s
        """
            values = ( caesar_cipher(ld, shift))

            cursor2.execute(query,values)
            data = cursor2.fetchall()
            print(data)

        # Prepare the data to be sent as JSON
            schedule_details = [
                {
                'Name': caesar_decipher(schedule[0], shift),
                'MentorName': caesar_decipher(schedule[1], shift),
                'BatchName': caesar_decipher(schedule[2], shift),
                'ProgramName': caesar_decipher(schedule[3], shift),
                'SDate': schedule[4].strftime("%a, %d %b %Y")
                }
                for schedule in data
            ]
            print(schedule_details)
            return jsonify(schedule_details)
        except Exception as e:
            return jsonify({'error': str(e)})
    else:
        #get data from week1 and ld
        try:
        # Fetch data from the database
            query = """
        SELECT
            Modules.ModuleName AS ModuleName,
            Mentors.MentorName AS MentorName,
            Batches.BatchName AS BatchName,
            Programs.ProgramName AS ProgramName,
            ScheduleInformation.ScheduleDate AS Date,
            ScheduleInformation.ScheduleID as ScheduleID
        FROM
            ScheduleInformation
        JOIN
            Modules ON ScheduleInformation.ModuleID = Modules.ModuleID
        JOIN
            Mentors ON ScheduleInformation.MentorID = Mentors.MentorID
        JOIN
            Batches ON ScheduleInformation.BatchID = Batches.BatchID
        JOIN
            Programs ON ScheduleInformation.ProgramID = Programs.ProgramID
        WHERE Batches.BatchName = %s AND ScheduleInformation.ScheduleDate = %s
        """
            values = ( caesar_cipher(ld, shift), caesar_cipher(td, shift))

            cursor2.execute(query,values)
            data = cursor2.fetchall()
            print(data)

        # Prepare the data to be sent as JSON
            schedule_details = [
                {
                'Name': caesar_decipher(schedule[0], shift),
                'MentorName': caesar_decipher(schedule[1], shift),
                'BatchName': caesar_decipher(schedule[2], shift),
                'ProgramName': caesar_decipher(schedule[3], shift),
                'SDate': schedule[4].strftime("%a, %d %b %Y"),
                'ScheduleID': schedule[5]
                }
                for schedule in data
            ]
            print(schedule_details)
            return jsonify(schedule_details)
        except Exception as e:
            return jsonify({'error': str(e)})
    


@app.route('/fetch_dropdown_values', methods=['GET'])
def get_dropdown_values():
    try:
        data = fetch_dropdown_values1()
        return jsonify(data)
    except Exception as e:
        print(f"Error in get_dropdown_values: {e}")
        return jsonify(error=str(e))
    
@app.route('/drop_schedule', methods=['GET'])
def drop_schedule():
    datePart = request.args.get('datePart')
    print(datePart)
    print(type(datePart))
    batch = request.args.get('batch')
    print(batch)
    print(type(batch))
    newdate = request.args.get('newdate')
    print(newdate)
    print(type(newdate))
    mentor = request.args.get('mentor')
    print(mentor)
    print(type(mentor))
    now = datetime.now()
    selected_date = datetime.strptime(newdate, '%Y-%m-%d')
    print(selected_date)
    print(datetime.now())

        # Check if the selected date is before today
    try:

        conn2 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
        cursor2 = conn2.cursor()
        query = """
        SELECT
            BatchID
        FROM
            Batches
        WHERE BatchName = %s
        """
        values = (caesar_cipher(batch, shift),)

        cursor2.execute(query,values)
        bid = cursor2.fetchone()
        print(bid[0])
        print(type(bid))

        query1 = """
        SELECT
            MentorID
        FROM
            Mentors
        WHERE MentorName = %s
        """
        values1 = (caesar_cipher(mentor, shift),)

        cursor2.execute(query1,values1)
        mid = cursor2.fetchone()
        print(mid[0])

        query2 = """
        SELECT
            ScheduleID
        FROM
            ScheduleInformation
        WHERE MentorID = %s and BatchID = %s and ScheduleDate = %s
        """
        values2 = (mid[0],bid[0],datePart)

        cursor2.execute(query2,values2)
        sid = cursor2.fetchone()
        print(sid[0])

        query3 = """
        UPDATE
            ScheduleInformation
        SET 
            ScheduleDate = %s
        WHERE
            ScheduleID = %s
        """
        values3 = (newdate, sid[0])

        cursor2.execute(query3,values3)
        conn2.commit()
        schedule_details1 = [
        {
            'MentorName': newdate,
            'BatchName': newdate,
            'Date': newdate
        }
        ]
        return jsonify(schedule_details1)
    except Exception as e:
        return jsonify({'error': str(e)})
        
    

@app.route('/get_mentorss', methods=['GET'])
def get_mentorss():
    try:
        conn3 = psycopg2.connect(host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD)
        cursor3 = conn3.cursor()
        # Fetch data from the database
        query = """
        SELECT
            Modules.ModuleName AS ModuleName,
            Mentors.MentorName AS MentorName,
            Batches.BatchName AS BatchName,
            Programs.ProgramName AS ProgramName,
            ScheduleInformation.ScheduleDate AS Date
        FROM
            ScheduleInformation
        JOIN
            Modules ON ScheduleInformation.ModuleID = Modules.ModuleID
        JOIN
            Mentors ON ScheduleInformation.MentorID = Mentors.MentorID
        JOIN
            Batches ON ScheduleInformation.BatchID = Batches.BatchID
        JOIN
            Programs ON ScheduleInformation.ProgramID = Programs.ProgramID"""

        cursor3.execute(query)
        data = cursor3.fetchall()

        # Prepare the data to be sent as JSON
        schedule_details1 = [
            {
                'MentorName': caesar_decipher(schedule[1], shift),
                'BatchName': caesar_decipher(schedule[2], shift),
                'Date': format_date(schedule[4].strftime("%a, %d %b %Y"))
            }
            for schedule in data
        ]

        print(schedule_details1)

        return jsonify(schedule_details1)
    except Exception as e:
        print(f"Error in get_mentorss: {e}")
        return jsonify(error=str(e))

def format_date(input_string):
    # Parse the input string using strptime
    date_object = datetime.strptime(input_string, '%a, %d %b %Y')

    # Format the date as 'YYYY-MM-DD'
    formatted_date = date_object.strftime('%Y-%m-%d')

    return formatted_date
    
def fetch_dropdown_values1():
    try:

        # Fetch distinct Course names from the database
        cursor1.execute("SELECT DISTINCT ModuleName FROM Modules")
        courses = cursor1.fetchall()

        # Fetch distinct Mentor names from the database
        cursor1.execute("SELECT DISTINCT MentorName FROM Mentors")
        mentors = cursor1.fetchall()

        # Fetch Program names from the database
        cursor1.execute("SELECT ProgramName FROM Programs")
        programs = cursor1.fetchall()

        # Fetch Batch names from the database
        cursor1.execute("SELECT BatchName FROM Batches")
        batches = cursor1.fetchall()

        return {
            'courses': [caesar_decipher(course[0], shift) for course in courses],
            'mentors': [caesar_decipher(mentor[0], shift) for mentor in mentors],
            'programs':[caesar_decipher(program[0], shift) for program in programs],
            'batches': [caesar_decipher(batch[0], shift) for batch in batches],
        }
    except Exception as e:
        print(f"Error in fetch_dropdown_values: {e}")
        raise  # Re-raise the exception to be caught in the higher level

    finally:
        # Close the cursor and connection in the 'finally' block
        if 'cursor1' in locals() and cursor1:
            cursor1.close()
        if 'conn1' in locals() and conn1.is_connected():
            conn1.close()

@app.route('/changepassword', methods=['POST'])
def changepassword():
    if request.method == 'POST':
        cpasswordbf = request.form['Password']
        cpassword = hash_string(cpasswordbf)
        newpasswordbf = request.form['NewPassword']
        newpassword = hash_string(newpasswordbf)
        currentuser = request.form['currentUsername']

        cursor = conn.cursor()
        cursor.execute("SELECT * FROM login WHERE username = %s", (currentuser,))
        user = cursor.fetchone()

        if user and user[-1] == cpassword:
            # Update the password in the database
            cursor.execute("UPDATE login SET password = %s WHERE username = %s", (newpassword ,currentuser))
            conn.commit()
            cursor.close()

            flash('Password changed successfully! Please log in with your new password.', 'success')
            return render_template('login.html')
        else:
            flash('Invalid current password. Please try again.', 'error')
            cursor.close()
            return render_template('login.html')
    else:
        flash('Please Enter some value')
        return render_template('index.html')
    

def generate_random_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))

def send_password_reset_email(recipient, new_password):
    subject = 'Password Reset'
    body = f'Your new password is: {new_password}'

    message = Message(subject=subject, recipients=[recipient], body=body)
    mail.send(message)

@app.route('/reset_password', methods=['POST'])
def reset_password():
    if request.method == 'POST':
        reset_email = request.form['reset-email']

        # Validate the email address (add your own validation logic here)
        # For simplicity, you can check if the email exists in your database
        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute("SELECT * FROM login WHERE email = %s", (reset_email,))
        user = cursor.fetchone()
        cursor.close()

        if user:
            # Generate a random password
            new_passwordbf = generate_random_password()
            new_password = hash_string(new_passwordbf)

            # Update the user's password in the database
            cursor = conn.cursor()
            cursor.execute("UPDATE login SET password = %s WHERE email = %s", (new_password, reset_email))
            conn.commit()
            cursor.close()

            # Send the new password to the user's email
            send_password_reset_email(reset_email, new_passwordbf)

            flash('Password reset instructions sent to your email', 'success')
            return redirect(url_for('login'))
        else:
            flash('Invalid email address', 'error')
            return render_template('login.html')
    
@app.route('/logout')
def logout():
    session.pop('username', None)  # Remove the username from the session
    flash('Logout successful', 'success')  # Add a flash message
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)






