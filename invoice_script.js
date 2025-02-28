// invoice_script.js
document.addEventListener('DOMContentLoaded', function() {
    const invoiceDate = document.getElementById('invoiceDate');
    const sessionDuration = document.getElementById('sessionDuration');
    const hourlyRateDisplay = document.getElementById('hourlyRate');
    const totalAmountDisplay = document.getElementById('totalAmount');
    const qrCodeDiv = document.getElementById('qrCode');
    const shareButton = document.getElementById('shareButton');

    // Get session duration from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const durationMilliseconds = parseInt(urlParams.get('duration'));

    if (isNaN(durationMilliseconds)) {
        alert('Invalid session duration or you are seing a demo.');
        return;
    }

    // Calculate duration in minutes and seconds
    const durationSeconds = Math.floor(durationMilliseconds / 1000);
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    sessionDuration.textContent = `${minutes} minutes ${seconds} seconds`;

    // Calculate hourly rate and total amount
    const userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    const hourlyRate = parseFloat(userSettings.rate) || 600; // Default to 600 if not set
    hourlyRateDisplay.textContent = hourlyRate;

    const durationHours = durationMilliseconds / (1000 * 60 * 60);
    const totalAmount = (durationHours * hourlyRate).toFixed(2);
    totalAmountDisplay.textContent = totalAmount;

    // Display current date
    const now = new Date();
    invoiceDate.textContent = now.toLocaleDateString();

    // Generate UPI QR code
    const upiId = userSettings.upiId || 'defaultUpiId'; //replace defaultUpiId
    const userName = userSettings.name || 'Default Name'; //replace default Name

    const upiString = `upi://pay?pa=${upiId}&pn=${userName}&am=${totalAmount}&cu=INR`;
    new QRCode(qrCodeDiv, {
        text: upiString,
        width: 128,
        height: 128,
    });

    // Share invoice
    shareButton.addEventListener('click', () => {

        const menu = document.getElementById('paymentConfirm');
        menu.classList.toggle('hidden');
        const homepage = document.getElementById('HideAthome');
        homepage.classList.toggle('hidden');
        const scanToPay = document.getElementById('scanToPay');
        scanToPay.innerText= "Invoice";

        html2canvas(document.body).then(canvas => {
            canvas.toBlob(blob => {
                const filesArray = [new File([blob], 'invoice.png', { type: 'image/png' })];
                if (navigator.canShare && navigator.canShare({ files: filesArray })) {
                    navigator.share({
                        files: filesArray,
                        title: 'Invoice',
                        text: 'Check out your invoice!',
                    });
                } else {
                    alert('Sharing is not supported on this browser.');
                }
                const homepage = document.getElementById('HideAthome');
                homepage.classList.toggle('hidden');
            });
        });
    });
});