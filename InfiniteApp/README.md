# Infinite Scheduler
 This simple scheduler calendar app allows users to easily book appointments for future dates within the current year.  The intuitive calendar interface highlights the current day, disables past dates, and clearly marks available booking slots on Mondays, Tuesdays, and Wednesdays with a "+" icon.  Users can navigate through future months to select their desired booking date.  The booking process is streamlined, requiring only essential details such as name, phone number, age, and gender, with the option to add information for up to two additional people.  The app prevents duplicate bookings for the same phone number on the same date, ensuring a smooth and organized scheduling experience.  Bookings are stored locally in the browser, making them persistent across sessions.  A dedicated "Current Month Bookings" page provides a convenient overview of all appointments scheduled for the current month.

# Simple Scheduler Calendar App

This is a simple scheduler calendar application that allows users to book appointments for future dates within the current year.

## Features

*   **Calendar Display:** Displays the current year's calendar.
*   **Navigation:** Allows navigation only to future months of the current year.
*   **Current Day Highlighting:** Highlights the current day.
*   **Past Day Disabling:** Disables past days in the current month.
*   **Booking Availability:** Shows a "+" icon on available booking slots (Mondays, Tuesdays, and Wednesdays). Only one booking is allowed per day.
*   **Booking Restriction:** Allows only one active booking per phone number at a time (unless the previous booking date has passed).
*   **Booking Details:** Collects name, phone number, age, and gender.
*   **Extra People:** Allows booking for up to 2 additional people (including their age and gender).
*   **Duplicate Booking Check:** Prevents booking if an active booking exists for the given phone number (unless the previous booking date is in the past).
*   **Local Storage:** Bookings are stored locally in the user's browser using `localStorage`.
*   **Current Month Bookings View:** A separate page (`bookings.html`) displays all bookings for the current month.
*   **Form Validation:** All form fields are validated, including those for extra people.
*   **Selected Date Display:** The selected booking date is shown in the booking form.

## Technologies Used

*   HTML
*   CSS (with Material Design Lite for styling)
*   JavaScript
*   Database LocalStorage Api

## Setup

1.  Clone the repository: `git clone https://github.com/missionode/Infinite-Scheduler` (Replace with your repository URL)
2.  Open `index.html` in your web browser.

## How to Use

1.  Navigate through future months using the arrow buttons in the calendar header.
2.  Click on a "+" icon to open the booking form for that day.
3.  Fill in the required booking details.
4.  Add details for extra people if needed.
5.  Click "Submit" to confirm the booking.
6.  A confirmation message will appear briefly.
7.  To view current month's bookings, open `bookings.html`.

## Project Structure

├── index.html         // Main calendar page
├── bookings.html      // Current month bookings page
├── app.js          // JavaScript code
└── styles.css          // CSS styles

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Demo 

Main Calendar: https://missionode.github.io/Infinite-Scheduler/
Bookings Page: https://missionode.github.io/Infinite-Scheduler/bookings.html