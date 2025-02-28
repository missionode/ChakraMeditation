// settings_script.js
document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.getElementById('settingsForm');
    const nameInput = document.getElementById('name');
    const upiIdInput = document.getElementById('upiId');
    const rateInput = document.getElementById('rate');

    // Load settings from local storage
    const savedSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    nameInput.value = savedSettings.name || '';
    upiIdInput.value = savedSettings.upiId || '';
    rateInput.value = savedSettings.rate || '';

    settingsForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const upiId = upiIdInput.value.trim();

        // Basic validation
        if (!name) {
            alert('Please enter your name.');
            return;
        }
        if (!upiId) {
            alert('Please enter your UPI ID.');
            return;
        }
        const rate = parseFloat(rateInput.value.trim());

    if (isNaN(rate) || rate <= 0) {
        alert('Please enter a valid hourly rate.');
        return;
    }

    const userSettings = { name, upiId, rate };
    localStorage.setItem('userSettings', JSON.stringify(userSettings));

    alert('Settings saved successfully!');

    });
});