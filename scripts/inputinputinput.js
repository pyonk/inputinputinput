chrome.storage.local.get({[location.hostname]: {}}, function(result) {
    Object.keys(result[location.hostname]).forEach(function(key) {
        if (location.href.match(new RegExp(key.replace('*', '([^\/]*)')))) {
            const config = result[location.hostname][key];
            for (const [selector, option] of Object.entries(config)) {
                switch (option.type) {
                    case 'date':
                    case 'input':
                        var targetElem = document.querySelector(selector);
                        if (targetElem && targetElem.value === '') {
                            targetElem.value = option.value;
                            targetElem.dispatchEvent(new Event('input'));
                        }
                        break;
                    case 'radio':
                        var targetElem = document.querySelector(`${selector}[value=${option.value}]`);
                        if (targetElem && !targetElem.checked) {
                            targetElem.checked = true;
                            targetElem.dispatchEvent(new Event('change'));
                        }
                        break;
                    case 'image':
                        var targetElem = document.querySelector(`${selector} option[value='${option.value}']`);
                        if (targetElem && !targetElem.selected) {
                            targetElem.selected = true;
                            document.querySelector(selector).dispatchEvent(new Event('change'));
                        }
                        break;
                    case 'select':
                        var targetElem = null;
                        if (option.random) {
                            const options = document.querySelectorAll(`${selector} option`);
                            targetElem = options[Math.floor(Math.random()*Math.floor(options.length-1))]
                        } else {
                            targetElem = document.querySelector(`${selector} option[value='${option.value}']`);
                        }
                        if (targetElem && !targetElem.selected) {
                            targetElem.selected = true;
                            document.querySelector(selector).dispatchEvent(new Event('change'));
                        }
                        break;
                }
            };
        }
    });
});
