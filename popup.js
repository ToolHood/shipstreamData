document.getElementById('copy-data').addEventListener('click', async () => {
    // In das aktuelle Tab ein Skript einfügen, das die Daten extrahiert
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: extractZendeskData,
    });
});

// Funktion, die auf der Zendesk-Seite ausgeführt wird
function extractZendeskData() {
    // Hier kannst du die spezifischen Daten aus Zendesk extrahieren
    // Beispielsweise den Titel und die Beschreibung eines Tickets
    const ticketTitle = document.querySelector('.ticket-title-selector').innerText;
    const ticketDescription = document.querySelector('.ticket-description-selector').innerText;

    // Daten zurückgeben
    return {
        title: ticketTitle,
        description: ticketDescription,
    };
}

// Speichere die Daten in den local storage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "saveData") {
        chrome.storage.local.set({ zendeskData: message.data }, () => {
            console.log("Daten gespeichert!");
        });
    }
});
