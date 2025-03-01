document.addEventListener('DOMContentLoaded', () => {
    const nfcSection = document.getElementById('nfc-section');
    const phoneSection = document.getElementById('phone-section');
    const phoneNumberInput = document.getElementById('phone-number');
    const shareButton = document.getElementById('share-button');
    const visitingCardImage = document.getElementById('visiting-card-image');

    if ('NDEFReader' in window) {
        // NFC is supported
        try {
            const reader = new NDEFReader();
            reader.scan().then(() => {
                reader.onreading = event => {
                    const decoder = new TextDecoder();
                    for (const record of event.message.records) {
                        // Handle NFC data (e.g., redirect to URL)
                        console.log(`Record type: ${record.recordType}`);
                        console.log(`MIME type: ${record.mediaType}`);
                        console.log(`Record data: ${decoder.decode(record.data)}`);
                        //Example of redirecting to a url.
                        window.location.href = decoder.decode(record.data);
                    }
                };
            }).catch(error => {
                console.log(`Error scanning NFC tags: ${error}`);
                showPhoneInput();
            });
        } catch (error) {
            console.log(`Error reading NFC: ${error}`);
            showPhoneInput();
        }

    } else {
        // NFC is not supported
        showPhoneInput();
    }

    function showPhoneInput() {
        nfcSection.style.display = 'none';
        phoneSection.style.display = 'block';
    }

    shareButton.addEventListener('click', () => {
        const phoneNumber = phoneNumberInput.value;
        if (phoneNumber) {
            shareViaWhatsApp(phoneNumber);
        } else {
            alert('Please enter a phone number.');
        }
    });

    function shareViaWhatsApp(phoneNumber) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const image = visitingCardImage;

        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);

            canvas.toBlob(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Image = reader.result.split(',')[1];
                    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent('My Digital Visiting Card: ')}&image=${base64Image}`;
                    window.location.href = whatsappLink;
                };
                reader.readAsDataURL(blob);
            });
        };
        if (image.complete) {
            image.onload();
        }

    }
});