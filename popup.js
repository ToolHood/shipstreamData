document.addEventListener('DOMContentLoaded', () => {
    // Show alert messages
    function showAlert(message, type) {
        const alertDiv = document.getElementById('alert');
        alertDiv.innerText = message;
        alertDiv.style.display = 'block';
        alertDiv.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336'; 
        setTimeout(() => {
            alertDiv.style.display = 'none';
        }, 3000);
    }

    // Save Zendesk data to chrome.storage
    function saveZendeskData(data) {
        chrome.storage.local.set({ zendeskData: data }, () => {
            console.log('Zendesk data saved:', data);
        });
    }

    // Save SKU data to chrome.storage and copy to clipboard
    function saveSKUData(data) {
        chrome.storage.local.set({ skuData: data }, () => {
            console.log('SKU data saved:', data);
            // Copy the SKU to the clipboard
            navigator.clipboard.writeText(data.sku).then(() => {
                showAlert(`SKU copied to clipboard: ${data.sku}`, 'success');
            }).catch(err => {
                showAlert('Failed to copy SKU to clipboard', 'error');
                console.error('Clipboard copy error:', err);
            });
        });
    }

    // Load SKU from the JSON file based on chairModel and sparePart
    async function findMatchingSKU(chairModel, sparePart) {
        try {
            const response = await fetch(chrome.runtime.getURL('data/spare_parts_sku.json'));
            const skuData = await response.json();

            // Search for the matching combination of chairModel and sparePart
            const matchingSKU = skuData.find(entry => entry.chairModel === chairModel && entry.sparePart === sparePart);

            if (matchingSKU) {
                return matchingSKU.sku; // Return the matching SKU
            } else {
                throw new Error('No matching SKU found.');
            }
        } catch (error) {
            console.error('Error finding SKU:', error);
            return null;
        }
    }

    // Copy both Zendesk and SKU data
    document.getElementById('copy-name').addEventListener('click', async () => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Extract Zendesk data
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const bodyText = document.body.innerText;

                // Regex for extracting Zendesk data
                const nameRegex = /Name:\s*Mr\s*([\w]+)\s+([\w]+)/;
                const emailRegex = /Email:\s*([^\n]+)/;
                const phoneRegex = /Phone:\s*([^\n]+)/;
                const countryRegex = /Country:\s*-\s*([A-Z]{2})/;

                const nameMatches = bodyText.match(nameRegex);
                const emailMatches = bodyText.match(emailRegex);
                const phoneMatches = bodyText.match(phoneRegex);
                const countryMatches = bodyText.match(countryRegex);

                if (nameMatches && emailMatches && phoneMatches && countryMatches) {
                    return {
                        vName: nameMatches[1],
                        fName: nameMatches[2],
                        email: emailMatches[1].trim(),
                        phone: phoneMatches[1].trim(),
                        country: countryMatches[1].trim()
                    };
                } else {
                    return null;
                }
            },
        }, async (zendeskResults) => {
            if (zendeskResults && zendeskResults[0] && zendeskResults[0].result) {
                const zendeskData = zendeskResults[0].result;
                saveZendeskData(zendeskData);
                showAlert('Zendesk data copied!', 'success');

                // Now, automatically extract SKU data after Zendesk data is copied
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        const bodyText = document.body.innerText;

                        // Extract SKU from chair model and spare part
                        const chairModelRegex = /Chair:\s*([^\n]+)/;
                        const sparePartRegex = /Spare Parts Request\s*([^\n]+)/;

                        const chairModelMatches = bodyText.match(chairModelRegex);
                        const sparePartMatches = bodyText.match(sparePartRegex);

                        if (chairModelMatches && sparePartMatches) {
                            return {
                                chairModel: chairModelMatches[1].trim(),
                                sparePart: sparePartMatches[1].trim(),
                            };
                        } else {
                            return null;
                        }
                    },
                }, async (skuResults) => {
                    if (skuResults && skuResults[0] && skuResults[0].result) {
                        const skuData = skuResults[0].result;
                        // Find the matching SKU in the JSON file
                        const matchingSKU = await findMatchingSKU(skuData.chairModel, skuData.sparePart);

                        if (matchingSKU) {
                            skuData.sku = matchingSKU; // Set the correct SKU from the JSON
                            saveSKUData(skuData); // Save SKU and copy to clipboard
                        } else {
                            showAlert('No matching SKU found.', 'error');
                        }
                    } else {
                        showAlert('Failed to extract SKU data.', 'error');
                    }
                });
            } else {
                showAlert('Failed to extract Zendesk data.', 'error');
            }
        });
    });

    // Paste data
    document.getElementById('paste-data').addEventListener('click', () => {
        chrome.storage.local.get(['zendeskData', 'skuData'], (result) => {
            const zendeskData = result.zendeskData;
            const skuData = result.skuData;
            if (zendeskData && skuData) {
                // Paste logic for both Zendesk and SKU data (adapt based on your specific form fields)
                showAlert('Data pasted successfully!', 'success');
            } else {
                showAlert('No data to paste.', 'error');
            }
        });
    });
});
