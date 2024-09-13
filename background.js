chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'saveData') {
        chrome.storage.local.set({ zendeskData: message.data }, () => {
            console.log('Zendesk-Daten wurden gespeichert!');
        });
    }
});

