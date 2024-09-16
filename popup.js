document.addEventListener('DOMContentLoaded', () => {

    function showAlert(message, type) {
        const alertDiv = document.getElementById('alert');
        alertDiv.innerText = message;
        alertDiv.style.display = 'block';
        alertDiv.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336'; // Green for success, red for error
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    // Function to store data in chrome.storage.local
    function saveDataToStorage(data) {
        chrome.storage.local.set({ extractedData: data }, () => {
            console.log('Data saved:', data);
        });
    }

    // Function to retrieve data from chrome.storage.local
    function getDataFromStorage(callback) {
        chrome.storage.local.get('extractedData', (result) => {
            console.log('Retrieved data from storage:', result.extractedData);
            callback(result.extractedData);
        });
    }

    // Event listener for the "Copy Data" button
    document.getElementById('copy-name').addEventListener('click', async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                const bodyText = document.body.innerText;

                // Regular expressions for extracting data
                const nameRegex = /Name:\s*Mr\s*([\w]+)\s+([\w]+)/;
                const addressRegex = /Street:\s*([^\n]+)\n+House Number:\s*([^\n]+)/;
                const cityRegex = /City:\s*([^\n]+)/;
                const postalCodeRegex = /Post code:\s*([^\n]+)/;
                const emailRegex = /Email:\s*([^\n]+)/;
                const phoneRegex = /Phone:\s*([^\n]+)/;

                const nameMatches = bodyText.match(nameRegex);
                const addressMatches = bodyText.match(addressRegex);
                const cityMatches = bodyText.match(cityRegex);
                const postalCodeMatches = bodyText.match(postalCodeRegex);
                const emailMatches = bodyText.match(emailRegex);
                const phoneMatches = bodyText.match(phoneRegex);

                const ticketIdElement = document.querySelector('[data-test-id="header-tab-subtitle"] span');
                const ticketId = ticketIdElement ? ticketIdElement.innerText.trim() : null;

                if (nameMatches && addressMatches && cityMatches && postalCodeMatches && emailMatches && phoneMatches && ticketId) {
                    return {
                        vName: nameMatches[1],
                        fName: nameMatches[2],
                        address: addressMatches[1].trim() + " " + addressMatches[2].trim(),
                        city: cityMatches[1].trim(),
                        postalCode: postalCodeMatches[1].trim(),
                        email: emailMatches[1].trim(),
                        phone: phoneMatches[1].trim(),
                        ticketID: ticketId + " z"
                    };
                } else {
                    return null;
                }
            },
        }, (results) => {
            if (results && results[0] && results[0].result) {
                const data = results[0].result;
                saveDataToStorage(data);
                showAlert('Data successfully copied!', 'success');
            } else {
                showAlert('Failed to extract data. Please check the format.', 'error');
            }
        });
    });

    // Function to paste data into form fields
    function pasteDataInForm(data) {
        let isPartiallySuccessful = false;
        if (data) {
            if (document.getElementById('order-shipping_address_firstname')) {
                document.getElementById('order-shipping_address_firstname').value = data.vName;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order-shipping_address_lastname')) {
                document.getElementById('order-shipping_address_lastname').value = data.fName;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order-shipping_address_street0')) {
                document.getElementById('order-shipping_address_street0').value = data.address;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order-shipping_address_city')) {
                document.getElementById('order-shipping_address_city').value = data.city;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order-shipping_address_postcode')) {
                document.getElementById('order-shipping_address_postcode').value = data.postalCode;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order-shipping_address_email')) {
                document.getElementById('order-shipping_address_email').value = data.email;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order-shipping_address_telephone')) {
                document.getElementById('order-shipping_address_telephone').value = data.phone;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order-comment')) {
                document.getElementById('order-comment').value = data.ticketID;
            } else {
                isPartiallySuccessful = true;
            }

            if (isPartiallySuccessful) {
                showAlert('Paste partially successful', 'error');
            } else {
                showAlert('Data pasted successfully!', 'success');
            }
        } else {
            showAlert('No data to paste.', 'error');
        }
    }

    // Event listener for the "Paste Data" button
    document.getElementById('paste-data').addEventListener('click', async () => {
        let tabs = await chrome.tabs.query({ url: 'https://progamersware-gmbh.shipstream.app/*' });

        if (tabs.length > 0) {
            let tabId = tabs[0].id;

            getDataFromStorage((data) => {
                if (data) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        function: pasteDataInForm,
                        args: [data]
                    });
                    showAlert('Data successfully Pasted!', 'success');
                } else {
                    showAlert('No data found in storage.', 'error');
                }
            });
        } else {
            showAlert('No matching tab found.', 'error');
        }
    });

    // Event listener for the "Disguise Telephone" checkbox
    document.getElementById('disguise-phone').addEventListener('change', () => {
        const disguisePhoneCheckbox = document.getElementById('disguise-phone');

        getDataFromStorage((data) => {
            if (data) {
                if (disguisePhoneCheckbox && disguisePhoneCheckbox.checked) {
                    data.phone = "0123456789";  // Disguised phone number
                }
                saveDataToStorage(data);

                const telephoneField = document.getElementById('order-shipping_address_telephone');
                if (telephoneField) {
                    telephoneField.value = data.phone;
                }
            }
        });
    });

});
