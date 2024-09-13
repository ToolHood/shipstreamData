document.getElementById('copy-name').addEventListener('click', async () => {
    // In das aktuelle Tab ein Skript einfügen, das den Namen, die Adresse, Stadt, Postleitzahl und das Land extrahiert
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Führe das Skript aus, um die Daten auf der Seite zu extrahieren
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractAndSendData,
    }, (results) => {
        if (results && results[0].result) {
            const data = results[0].result;
            // Fülle die Textfelder im Popup mit den extrahierten Daten
            document.getElementById('vName').value = data.vName;
            document.getElementById('fName').value = data.fName;
            document.getElementById('address').value = data.address;
            document.getElementById('city').value = data.city;
            document.getElementById('postalCode').value = data.postalCode;
            document.getElementById('country').value = data.country;  // Hier wird der englische Name des Landes eingefügt
        }
    });
});

// Funktion, die auf der Zendesk-Seite ausgeführt wird, um Vorname, Nachname, Adresse, Stadt, Postleitzahl und Land zu extrahieren
function extractAndSendData() {
    // Beispieltextfeld mit dem Muster
    const bodyText = document.body.innerText;

    // RegEx zum Extrahieren von Vorname, Nachname, Adresse (Straße + Hausnummer), Stadt, Postleitzahl und Länderkürzel
    const nameRegex = /Name:\s*Mr\s*([A-Za-z]+)\s+([A-Za-z]+)/;
    const addressRegex = /Street:\s*([^\n]+)\n+House Number:\s*([^\n]+)/;
    const cityRegex = /City:\s*([^\n]+)/;
    const postalCodeRegex = /Post code:\s*([^\n]+)/;
    const countryRegex = /Country:\s*-\s*([A-Z]{2})/;

    const nameMatches = bodyText.match(nameRegex);
    const addressMatches = bodyText.match(addressRegex);
    const cityMatches = bodyText.match(cityRegex);
    const postalCodeMatches = bodyText.match(postalCodeRegex);
    const countryMatches = bodyText.match(countryRegex);

    // Map für Länderkürzel zu englischem Namen
    const countryMap = {
        "DE": "Germany",
        "FR": "France",
        "ES": "Spain",
        "IT": "Italy",
        // Weitere Ländercodes und Namen hier hinzufügen...
    };

    if (nameMatches && addressMatches && cityMatches && postalCodeMatches && countryMatches) {
        const countryCode = countryMatches[1].trim();
        const countryName = countryMap[countryCode] || countryCode;  // Falls kein Match in der Map, zeige das Kürzel

        // Rückgabe von Vorname, Nachname, Adresse (Straßennamen + Hausnummer), Stadt, Postleitzahl und Land
        return {
            vName: nameMatches[1],    // Vorname
            fName: nameMatches[2],    // Nachname
            address: addressMatches[1].trim() + " " + addressMatches[2].trim(),  // Adresse (Straße + Hausnummer)
            city: cityMatches[1].trim(),   // Stadt
            postalCode: postalCodeMatches[1].trim(),   // Postleitzahl
            country: countryName   // Englischer Name des Landes
        };
    } else {
        return null; // Kein Match gefunden
    }
}
