const calendarContainer = document.getElementById('calendar-container');
const calendarHeader = document.getElementById('calendar-header');
const currentMonthSpan = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const calendarGrid = document.getElementById('calendar-grid');
const bookingForm = document.getElementById('booking-form');
const cancelBookingButton = document.getElementById('cancel-booking');
const bookingDetailsForm = document.getElementById('booking-details');
const confirmationMessage = document.getElementById('confirmation-message');
const addExtraButton = document.getElementById('add-extra');
const extraPerson1 = document.getElementById('extra-person-1');
const extraPerson2 = document.getElementById('extra-person-2');


let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate;
let bookings = JSON.parse(localStorage.getItem('bookings')) || []; // Load or initialize bookings

function generateCalendar(month, year) {
    calendarGrid.innerHTML = '';

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const dayName = document.createElement('div');
        dayName.classList.add('day-name');
        dayName.textContent = day;
        calendarGrid.appendChild(dayName);
    });

    let dayCounter = 1;
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');

            const day = new Date(year, month, dayCounter);

            if (i === 0 && j < firstDay.getDay()) {
                dayDiv.textContent = '';
            } else if (dayCounter > lastDay.getDate()) {
                dayDiv.textContent = '';
            } else {
                dayDiv.textContent = dayCounter;
                if (day.getFullYear() === currentDate.getFullYear() && day.getMonth() === currentDate.getMonth() && day.getDate() === currentDate.getDate()) {
                    dayDiv.classList.add('current');
                }

                if (day < currentDate) {
                    dayDiv.classList.add('disabled');
                } else {
                    const bookingDate = new Date(year, month, dayCounter);
                    if (bookingDate.getDay() >= 1 && bookingDate.getDay() <= 3) {
                        const existingBooking = bookings.find(booking => new Date(booking.date).toDateString() === bookingDate.toDateString());
                        if (!existingBooking) {
                            const plusIcon = document.createElement('span');
                            plusIcon.classList.add('plus-icon');
                            plusIcon.textContent = '+';
                            dayDiv.appendChild(plusIcon);

                            dayDiv.addEventListener('click', () => {
                                if (!dayDiv.classList.contains('disabled') && dayDiv.querySelector('.plus-icon')) {
                                    selectedDate = bookingDate;
                                    bookingForm.style.display = 'block';
                                    bookingDetailsForm.reset();
                                    extraPerson1.style.display = 'none';
                                    extraPerson2.style.display = 'none';
                            
                                    // Display the selected date:
                                    const selectedDateDisplay = document.getElementById('selected-date-display');
                                    selectedDateDisplay.textContent = "Selected Date: " + selectedDate.toDateString(); // Or any format you prefer
                                }
                            });
                        }
                    }
                }
                dayCounter++;
            }
            calendarGrid.appendChild(dayDiv);
        }
    }

    currentMonthSpan.textContent = getMonthName(month) + ' ' + year;

    if (currentYear === currentDate.getFullYear() + 1 && currentMonth === 0) {
        nextMonthButton.disabled = true;
    } else if (currentYear === currentDate.getFullYear() && currentMonth === 11) {
        nextMonthButton.disabled = true;
    } else {
        nextMonthButton.disabled = false;
    }

    if (currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
        prevMonthButton.disabled = true;
    } else {
        prevMonthButton.disabled = false;
    }
}

function getMonthName(month) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
}

generateCalendar(currentMonth, currentYear);

nextMonthButton.addEventListener('click', () => {
    if (currentYear < currentDate.getFullYear() + 1) {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    }

    if (currentYear === currentDate.getFullYear() + 1 && currentMonth === 0) {
        nextMonthButton.disabled = true;
    } else if (currentYear === currentDate.getFullYear() && currentMonth === 11) {
        nextMonthButton.disabled = true;
    } else {
        nextMonthButton.disabled = false;
    }
});

prevMonthButton.addEventListener('click', () => {
    if (currentYear > currentDate.getFullYear() || (currentYear === currentDate.getFullYear() && currentMonth > currentDate.getMonth())) {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    }

    if (currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
        prevMonthButton.disabled = true;
    } else {
        prevMonthButton.disabled = false;
    }
});

cancelBookingButton.addEventListener('click', () => {
    bookingForm.style.display = 'none';
});



// time stamp for export
function getCurrentDateTime() {
    const now = new Date();
  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }


bookingDetailsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Basic form validation
    if (!bookingDetailsForm.checkValidity()) {
        bookingDetailsForm.reportValidity(); // Trigger browser's built-in validation
        return; // Stop submission if validation fails
    }

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const age = document.getElementById('age').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    const extraPeople = [];
    let extraPeopleValid = true;  // Flag for extra people validation

    if (extraPerson1.style.display === 'block') {
        const extraAge1 = document.getElementById('extra-age-1').value;
        const extraGender1 = document.querySelector('input[name="extra-gender-1"]:checked')?.value; //Optional chaining added

        if (!extraAge1 || !extraGender1) { //Check if the field is empty or not
            alert("Please fill in all details for Extra Person 1.");
            extraPeopleValid = false;
        } else {
            extraPeople.push({ age: extraAge1, gender: extraGender1 });
        }
    }
    if (extraPerson2.style.display === 'block') {
        const extraAge2 = document.getElementById('extra-age-2').value;
        const extraGender2 = document.querySelector('input[name="extra-gender-2"]:checked')?.value; //Optional chaining added
        if (!extraAge2 || !extraGender2) { //Check if the field is empty or not
            alert("Please fill in all details for Extra Person 2.");
            extraPeopleValid = false;
        } else {
            extraPeople.push({ age: extraAge2, gender: extraGender2 });
        }
    }

    if (!extraPeopleValid) {
        return; // Stop submission if extra people validation fails
    }


    const newBooking = {
        name: name,
        phone: phone,
        age: age,
        gender: gender,
        date: selectedDate.toDateString(),
        extraPeople: extraPeople
    };

    const existingBooking = bookings.find(booking => booking.phone === phone && new Date(booking.date) >= new Date());
    if (existingBooking) {
        alert("You already have a booking.");
        return;
    }

    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    bookingForm.style.display = 'none';
    confirmationMessage.style.display = 'block';
    generateCalendar(currentMonth, currentYear);
    setTimeout(() => {
        confirmationMessage.style.display = 'none';
    }, 3000);

    ExportDb()
});


addExtraButton.addEventListener('click', () => {
    if (extraPerson1.style.display === 'none') {
        extraPerson1.style.display = 'block';
    } else if (extraPerson2.style.display === 'none') {
        extraPerson2.style.display = 'block';
    }
});
// 
// Load or initialize bookings (already in the code above)


// Export the db as on booking db backup solution

function ExportDb() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingsJSON = JSON.stringify(bookings);

    const blob = new Blob([bookingsJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;


    const timestamp = getCurrentDateTime();


    a.download = 'bookings-'+timestamp+'.json'
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
}

