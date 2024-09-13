document.getElementById('copy-name').addEventListener('click', async () => {
    // In das aktuelle Tab ein Skript einfügen, das den Namen extrahiert
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Führe das Skript aus, um den Namen auf der Seite zu extrahieren
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractAndSendName,
    }, (results) => {
        if (results && results[0].result) {
            const data = results[0].result;
            // Fülle die Textfelder im Popup mit dem extrahierten Vor- und Nachnamen
            document.getElementById('vName').value = data.vName;
            document.getElementById('fName').value = data.fName;
        }
    });
});

// Funktion, die auf der Zendesk-Seite ausgeführt wird, um den Namen zu extrahieren
function extractAndSendName() {
    // Beispieltextfeld mit dem Muster
    const bodyText = document.body.innerText;

    // RegEx zum Extrahieren von Vor- und Nachnamen
    const regex = /Name:\s*Mr\s*(\w+)\s*(\w+)/;
    
    const matches = bodyText.match(regex);

    if (matches) {
        // Rückgabe von Vor- und Nachnamen
        return {
            vName: matches[1], // Vorname
            fName: matches[2]  // Nachname
        };
    } else {
        return null; // Kein Match gefunden
    }
}
