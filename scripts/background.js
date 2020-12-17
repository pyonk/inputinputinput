chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    const options = message.options;
    saveOptions(options).then(function(options) {
        const savedOptions = {};
        options.forEach(function(option) {
            const url = new URL(option.targetUrl);
            const hostname = url.hostname;
            chrome.permissions.request({
                origins: [`${url.protocol}//${hostname}/*`]
            });
            if (!~Object.keys(savedOptions).indexOf(hostname)) savedOptions[hostname] = {};
            savedOptions[hostname] = Object.assign(savedOptions[hostname], {[option.targetUrl]: option.matches})
        });
        const settingList = [];
        for ([hostname, option] of Object.entries(savedOptions)) {
            settingList.push(setOptions(hostname));
        };
        Promise.all(settingList).then(() => {
            sendResponse({ success: true });
        });
    });
    return true;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === chrome.tabs.TabStatus.complete) {
        const url = new URL(tab.url);
        chrome.permissions.contains({origins: [`${url.protocol}//${url.hostname}/*`]}, function(result) {
            if (result) {
                chrome.tabs.executeScript(tabId, {
                    file: 'scripts/inputinputinput.js',
                    runAt: 'document_end',
                }, function() { console.log('input complete'); });
            }
        });
    }
});


function saveOptions(options) {
    return new Promise((resolve, _) => {
        chrome.storage.local.set({ options }, () => resolve(options));
    });
}

function setOptions(hostname) {
    return new Promise((resolve, _) => {
        chrome.storage.local.get({[hostname]: {}}, function(result) {
            const concatOptions = Object.assign(result[hostname], option);
            chrome.storage.local.set({[hostname]: concatOptions}, () => resolve());
        });
    });
}
