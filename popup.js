document.getElementById('copy-name').addEventListener('click', async () => {
    // In das aktuelle Tab ein Skript einfügen, das den Namen und die Adresse extrahiert
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Führe das Skript aus, um die Daten auf der Seite zu extrahieren
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractAndSendData,
    }, (results) => {
        if (results && results[0].result) {
            const data = results[0].result;
            // Fülle die Textfelder im Popup mit dem extrahierten Vor- und Nachnamen sowie der Adresse
            document.getElementById('vName').value = data.vName;
            document.getElementById('fName').value = data.fName;
            document.getElementById('address').value = data.address;
        }
    });
});

// Funktion, die auf der Zendesk-Seite ausgeführt wird, um den Namen und die Adresse zu extrahieren
function extractAndSendData() {
    // Beispieltextfeld mit dem Muster
    const bodyText = document.body.innerText;

    // RegEx zum Extrahieren von Vorname, Nachname, Straßennamen und Hausnummer
    const nameRegex = /Name:\s*Mr\s*([A-Za-z]+)\s+([A-Za-z]+)/;
    const addressRegex = /Street:\s*([^\n]+)\n+House Number:\s*([^\n]+)/;

    const nameMatches = bodyText.match(nameRegex);
    const addressMatches = bodyText.match(addressRegex);

    if (nameMatches && addressMatches) {
        // Rückgabe von Vorname, Nachname und Adresse (Straßennamen + Hausnummer)
        return {
            vName: nameMatches[1],    // Vorname
            fName: nameMatches[2],    // Nachname
            address: addressMatches[1].trim() + " " + addressMatches[2].trim()  // Adresse (Straße + Hausnummer)
        };
    } else {
        return null; // Kein Match gefunden
    }
}
