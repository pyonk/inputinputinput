window.addEventListener('load', function() {
    const optionField = document.querySelector('#option');
    setOption(optionField);
    document.querySelector('#optionSubmit').addEventListener('click', function() {
        const optionString = optionField.value;
        chrome.runtime.sendMessage(JSON.parse(optionString), function(res) {
            if (res.success) {
                torst('設定しました');
            }
        })
    });
});

function setOption(target) {
    return new Promise((resolve, _) => {
        chrome.storage.local.get('options', function(res) {
            target.value = JSON.stringify(res, null, 2);
            resolve(res);
        });
    });
}

function torst(message) {
    const torst = document.createElement('div');
    torst.classList.add('torst');
    torst.innerHTML = `<span>${message}</span>`;
    const timeout = setTimeout(() => inactive(torst) ,3000)
    torst.addEventListener('click', () => {
        inactive(torst);
        clearTimeout(timeout);

    });
    document.body.appendChild(torst);
}

function inactive(torst) {
    torst.classList.add('inactive');
    setTimeout(() => {
        document.body.removeChild(torst);
    }, 500)
}
