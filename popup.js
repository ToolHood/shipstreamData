document.addEventListener('DOMContentLoaded', () => {

    // Funktion, um Daten in `chrome.storage.local` zu speichern
    function saveDataToStorage(data) {
        chrome.storage.local.set({ extractedData: data }, () => {
            console.log('Daten gespeichert: ', data);
        });
    }

    // Funktion, um Daten aus `chrome.storage.local` abzurufen
    function getDataFromStorage(callback) {
        chrome.storage.local.get('extractedData', (result) => {
            console.log('Gespeicherte Daten abgerufen: ', result.extractedData);
            callback(result.extractedData);
        });
    }

    // Eventlistener für den Button "Daten kopieren"
    document.getElementById('copy-name').addEventListener('click', async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
                const bodyText = document.body.innerText;

                const nameRegex = /Name:\s*Mr\s*([A-Za-z]+)\s+([A-Za-z]+)/;
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
            if (results && results[0].result) {
                const data = results[0].result;
                saveDataToStorage(data);
                console.log('Daten gespeichert:', data);
            }
        });
    });

    // Funktion, die die Daten in die entsprechenden Felder im Formular einfügt
    function pasteDataInForm(data) {
        if (data) {
            // Setze die zwischengespeicherten Daten in die entsprechenden Felder ein
            if (document.getElementById('order-shipping_address_firstname')) {
                document.getElementById('order-shipping_address_firstname').value = data.vName;
            }

            if (document.getElementById('order-shipping_address_lastname')) {
                document.getElementById('order-shipping_address_lastname').value = data.fName;
            }

            if (document.getElementById('order-shipping_address_street0')) {
                document.getElementById('order-shipping_address_street0').value = data.address;
            }

            if (document.getElementById('order-shipping_address_city')) {
                document.getElementById('order-shipping_address_city').value = data.city;
            }

            if (document.getElementById('order-shipping_address_postcode')) {
                document.getElementById('order-shipping_address_postcode').value = data.postalCode;
            }

            if (document.getElementById('order-shipping_address_email')) {
                document.getElementById('order-shipping_address_email').value = data.email;
            }

            if (document.getElementById('order-shipping_address_telephone')) {
                document.getElementById('order-shipping_address_telephone').value = data.phone;
            }

            if (document.getElementById('order-comment')) {
                document.getElementById('order-comment').value = data.ticketID;
            }

            // Automatisches Klicken auf die Versandmethode mit der ID 's_method_external_cheapest'
            const shippingMethod = document.getElementById('s_method_external_cheapest');
            if (shippingMethod) {
                shippingMethod.click();
            } else {
                console.log('Versandmethode "s_method_external_cheapest" nicht gefunden.');
            }
        }
    }

    // Eventlistener für den Paste-Button, um die zwischengespeicherten Daten im bestehenden Tab einzufügen
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
                }
            });
        } else {
            console.log("Kein passender Tab gefunden.");
        }
    });

    // Eventlistener für die Checkbox "Disguise Telephone"
    document.getElementById('disguise-phone').addEventListener('change', () => {
        const disguisePhoneCheckbox = document.getElementById('disguise-phone');

        getDataFromStorage((data) => {
            if (data) {
                // Wenn die Checkbox aktiviert ist, ersetze die Telefonnummer durch "0123456789"
                if (disguisePhoneCheckbox && disguisePhoneCheckbox.checked) {
                    data.phone = "0123456789";
                }
                // Speichern der neuen Telefonnummer in chrome.storage.local
                saveDataToStorage(data);

                // Aktualisiere das Telefonfeld im Formular, falls es existiert
                const telephoneField = document.getElementById('order-shipping_address_telephone');
                if (telephoneField) {
                    telephoneField.value = data.phone;
                } else {
                    console.log('Telefonnummer-Feld nicht gefunden.');
                }
            }
        });
    });

});
