document.addEventListener('DOMContentLoaded', () => {
    const nfcSection = document.getElementById('nfc-section');
    const phoneSection = document.getElementById('phone-section');
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
        alert("NFC not supported by your system")
    }

   

 



});