document.addEventListener('DOMContentLoaded', async () => {
    // Reusable function to show alerts
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

    // Function to clear spare parts display
    function clearSparePartsDisplay() {
        // Remove any existing spare part elements
        const existingElements = document.querySelectorAll('.spare-part-item, .sku-item');
        existingElements.forEach(element => element.remove());
    }

    // Function to display a spare part in the UI
    function displaySparePart(sparePart, index) {
        const sparePartDiv = document.createElement('div');
        sparePartDiv.className = 'input-wrapper hidden-input spare-part-item';
        sparePartDiv.innerHTML = `<input type="text" id="sparePart${index}" readonly placeholder="Spare Part ${index + 1}" value="${sparePart}">`;
        
        const skuDiv = document.createElement('div');
        skuDiv.className = 'input-wrapper hidden-input sku-item';
        skuDiv.innerHTML = `<input type="text" id="sku${index}" readonly placeholder="SKU ${index + 1}">`;
        
        // Insert after the chairModel input
        const chairModelDiv = document.getElementById('chairModel').parentElement;
        chairModelDiv.parentNode.insertBefore(sparePartDiv, chairModelDiv.nextSibling);
        chairModelDiv.parentNode.insertBefore(skuDiv, sparePartDiv.nextSibling);
    }

    // Function to find matching SKU based on chairModel and sparePart
    async function findMatchingSKU(chairModel, sparePart, index = 0) {
        const response = await fetch(chrome.runtime.getURL('data/spare_parts_sku.json'));
        const data = await response.json();

        // Search for the matching combination
        const combination = data.find(entry => entry.chairModel === chairModel && entry.sparePart === sparePart);

        const skuElement = index === 0 ? 
            document.getElementById('sku') || document.getElementById('sku0') : 
            document.getElementById(`sku${index}`);

        if (combination && skuElement) {
            skuElement.value = combination.sku;
            
            // Copy each found SKU to clipboard with delay for Win+V history
            setTimeout(() => {
                navigator.clipboard.writeText(combination.sku)
                    .then(() => {
                        console.log(`SKU ${index + 1} copied to clipboard: ${combination.sku}`);
                        if (index === 0) {
                            showAlert(`${combination.sku} copied to clipboard`, 'success');
                        }
                    })
                    .catch(() => {
                        if (index === 0) {
                            showAlert('Failed to copy SKU to clipboard', 'error');
                        }
                    });
            }, index * 500); // 500ms delay between each copy for clipboard history
            
            return combination.sku;
        } else if (skuElement) {
            skuElement.value = 'No match found';
            return null;
        }
    }

    // Function to extract and save user data (Name, Address, etc.)
    function extractUserData() {
        const bodyText = document.body.innerText;

        const nameRegex = /Name:\s*Mr\s*([\w]+)\s+([\w]+)/;
        const addressRegex = /Street:\s*([^\n]+)\n+House Number:\s*([^\n]+)/;
        const cityRegex = /City:\s*([^\n]+)/;
        const postalCodeRegex = /Post code:\s*([^\n]+)/;
        const emailRegex = /Email:\s*([^\n]+)/;
        const phoneRegex = /Phone:\s*([^\n]+)/;
        const batchRegex = /Batch:\s*([^\n]+)/;
        const chairModelRegex = /Chair:\s*([^\n]+)/;
        const countryRegex = /Country:\s*-?\s*([A-Z]{2})/;

        const nameMatches = bodyText.match(nameRegex);
        const addressMatches = bodyText.match(addressRegex);
        const cityMatches = bodyText.match(cityRegex);
        const postalCodeMatches = bodyText.match(postalCodeRegex);
        const emailMatches = bodyText.match(emailRegex);
        const phoneMatches = bodyText.match(phoneRegex);
        const batchMatches = bodyText.match(batchRegex);
        const chairModelMatches = bodyText.match(chairModelRegex);
        const countryMatches = bodyText.match(countryRegex);

        const ticketIdElement = document.querySelector('[data-test-id="header-tab-subtitle"] span');
        const ticketId = ticketIdElement ? ticketIdElement.innerText.trim() : null;

        if (nameMatches && addressMatches && cityMatches && postalCodeMatches && emailMatches && phoneMatches && ticketId) {
            // Process batch number - if empty or "nicht vorhanden", use "---"
            let batchNumber = "---";
            if (batchMatches && batchMatches[1].trim()) {
                const batchValue = batchMatches[1].trim().toLowerCase();
                if (batchValue !== "nicht vorhanden" && batchValue !== "") {
                    batchNumber = batchMatches[1].trim();
                }
            }

            // Process chair model - extract everything from "NBL-" onwards
            let mainItemSku = "";
            if (chairModelMatches && chairModelMatches[1].trim()) {
                const chairModel = chairModelMatches[1].trim();
                const nblIndex = chairModel.indexOf("NBL-");
                if (nblIndex !== -1) {
                    mainItemSku = chairModel.substring(nblIndex);
                }
            }

            return {
                vName: nameMatches[1],
                fName: nameMatches[2],
                address: addressMatches[1].trim() + " " + addressMatches[2].trim(),
                city: cityMatches[1].trim(),
                postalCode: postalCodeMatches[1].trim(),
                email: emailMatches[1].trim(),
                phone: phoneMatches[1].trim(),
                ticketID: ticketId + " z",
                batchNumber: batchNumber,
                mainItemSku: mainItemSku,
                country: countryMatches ? countryMatches[1].trim() : ""
            };
        } else {
            return null;
        }
    }

    // Event listener for the "Copy Data" button to extract chair model and spare parts
    document.getElementById('copy-data').addEventListener('click', async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const bodyText = document.body.innerText;

                const chairModelRegex = /Chair:\s*([^\n]+)/;
                
                // Extract multiple spare parts - everything after "Spare Parts Request" until "Files:" or end
                const sparePartsSection = bodyText.match(/Spare Parts Request\s*([\s\S]*?)(?=Files:|$)/);
                
                let spareParts = [];
                if (sparePartsSection && sparePartsSection[1]) {
                    // Split by newlines and filter out empty lines
                    const lines = sparePartsSection[1].split('\n')
                        .map(line => line.trim())
                        .filter(line => line && line !== '');
                    
                    spareParts = lines;
                }

                const chairModelMatches = bodyText.match(chairModelRegex);

                if (chairModelMatches && spareParts.length > 0) {
                    return {
                        chairModel: chairModelMatches[1].trim(),
                        spareParts: spareParts,
                    };
                } else {
                    return null;
                }
            },
        }, (results) => {
            if (results && results[0] && results[0].result) {
                const data = results[0].result;
                document.getElementById('chairModel').value = data.chairModel;
                
                // Clear previous spare parts display
                clearSparePartsDisplay();
                
                // Process multiple spare parts and collect results
                let foundSkus = [];
                const promises = data.spareParts.map(async (sparePart, index) => {
                    displaySparePart(sparePart, index);
                    const sku = await findMatchingSKU(data.chairModel, sparePart, index);
                    if (sku) {
                        foundSkus.push(sku);
                    }
                    return sku;
                });
                
                // Wait for all SKU searches to complete
                Promise.all(promises).then((results) => {
                    const successCount = results.filter(sku => sku !== null).length;
                    setTimeout(() => {
                        if (successCount > 1) {
                            showAlert(`${successCount} SKUs copied to Win+V clipboard history`, 'success');
                        } else if (successCount === 1) {
                            showAlert(`1 SKU copied to clipboard`, 'success');
                        } else {
                            showAlert(`${data.spareParts.length} spare part(s) extracted, no SKUs found`, 'error');
                        }
                    }, (data.spareParts.length - 1) * 500 + 100); // Wait for all clipboard operations
                });
            } else {
                showAlert('Failed to extract data. Please check the format.', 'error');
            }
        });
    });

    // Event listener for the "Copy Name" button to extract user data
    document.getElementById('copy-data').addEventListener('click', async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractUserData,
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

            if (document.getElementById('order_custom_field_batch_number')) {
                document.getElementById('order_custom_field_batch_number').value = data.batchNumber;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order_custom_field_main_item_sku')) {
                document.getElementById('order_custom_field_main_item_sku').value = data.mainItemSku;
            } else {
                isPartiallySuccessful = true;
            }

            if (document.getElementById('order-shipping_address_country_id') && data.country) {
                const countrySelect = document.getElementById('order-shipping_address_country_id');
                countrySelect.value = data.country;
                // Trigger change event to ensure any dependent fields are updated
                const event = new Event('change', { bubbles: true });
                countrySelect.dispatchEvent(event);
            } else {
                isPartiallySuccessful = true;
            }

            const shippingMethod = document.getElementById('s_method_external_cheapest');
            if (shippingMethod) {
                shippingMethod.click();
                const event = new Event('change', { bubbles: true });
                shippingMethod.dispatchEvent(event);
                showAlert('Data pasted successfully and shipping method selected!', 'success');
            } else {
                showAlert('Data pasted, but shipping method not found.', 'error');
            }

            if (isPartiallySuccessful) {
                showAlert('Paste partially successful', 'error');
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
                        func: pasteDataInForm,
                        args: [data]
                    });
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
                    showAlert('Phone number disguised', 'success');
                } else {
                    showAlert('Phone number restored', 'success');
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
