$(() => {
    // init
let settings;
var lS = window.localStorage;
const DATAVERSION = 0.2, VERSION = '1.0.0 dev';
    if(! window.localStorage){
        // 警告用户当前浏览器(模式)不支持存储
        info("浏览器不支持存储", 'error');
    }else{
        if (lS['settings'] === undefined) { //如果没存储过设置则初始化存储设置
            lS['settings'] = `{"pmyc":0,"buttonSize":100,"OFBlur": true,"bgBlur":100,"OFAudio":true,"gameAudio":100,"uiAudio":100,"touchAudio":100,"OFDyfz":true,"OFFcApzsq":true,"OFEffect":true,"OFAutoPlay":false,"proportion":"16:9"}`;
            info('设置数据已初始化', 'info');
        };
        if (lS['version'] === undefined || lS['version'] < DATAVERSION) {
            lS['version'] = DATAVERSION;
            lS['settings'] = `{"pmyc":0,"buttonSize":100,"OFBlur": true,"bgBlur":100,"OFAudio":true,"gameAudio":100,"uiAudio":100,"touchAudio":100,"OFDyfz":true,"OFFcApzsq":true,"OFEffect":true,"OFAutoPlay":false,"proportion":"16:9"}`;
            info('设置数据结构已更新', 'info');
        }
        // 将数据由json格式转为变量
        settings = JSON.parse(lS['settings']);
    }
    // main
    $('.set-range input').each((index, element) => {
        element.value = settings[element.parentNode.id];
        element.onchange = () => {
            settings[element.parentNode.id] = Number(element.value);
            lS.settings = JSON.stringify(settings);
        };
        element.parentNode.children[1].onclick = () => {
            element.value = Number(element.value) - Number(element.step);
            settings[element.parentNode.id] = Number(element.value);
            lS.settings = JSON.stringify(settings);
        };
        element.parentNode.children[3].onclick = () => {
            element.value = Number(element.value) + Number(element.step);
            settings[element.parentNode.id] = Number(element.value);
            lS.settings = JSON.stringify(settings);
        };
    });
    $('.set-check input').each((index, element) => {
        element.checked = settings[element.parentNode.id];
        element.onchange = () => {
            if (element.parentNode.id == 'OFAutoPlay' && element.checked) {
                var key = prompt(utf8to16(atob('5byA5ZCv5q2k5Yqf6IO96ZyA6KaB5a+G6ZKl')) + '\n' + utf8to16(atob('5a+G6ZKlOg==')));
                if (key != null && key.length == 15) {
                    key = btoa(key);
                    if (key.length == 20) {
                        key = key.slice(4, 8) + key.slice(16, 20) + key.slice(0, 4) + key.slice(8, 16);
                        key = key.slice(0, 12) + key.slice(14, 16) + key.slice(12, 14) + key.slice(16, 20);
                        if (atob(key) === 'IU'+ atob('c2w=') + 'ay' + atob(atob('UXc9PQ==')) + 'anVTtoP') {
                            settings[element.parentNode.id] = element.checked;
                            lS.settings = JSON.stringify(settings);
                        } else {
                            info(utf8to16(atob('5a+G6ZKl6ZSZ6K+v')), 'error');
                        }
                    } else {
                        info(utf8to16(atob('5a+G6ZKl6ZSZ6K+v')), 'error');
                    }
                } else {
                    info(utf8to16(atob('5a+G6ZKl6ZSZ6K+v')), 'error');
                }
            } else {
                settings[element.parentNode.id] = element.checked;
                lS.settings = JSON.stringify(settings);
            }
            element.checked = settings[element.parentNode.id];
        };
    });
    $('.set-upload input').each((index, element) => {
        element.onchange = () => {
            if (!element.value) {
                info('未选择文件', 'error');
                return;
            }
            info('请确保文件数据正确性,以免发生错误', 'warning');
            info('如果出现错误请初始化数据', 'warning');
            let file = element.files[0];
            var reader = new FileReader();
            reader.onload = (e) => {
                fileData = e.target.result;
                fileData = fileData.slice(fileData.indexOf('base64,') + 7, fileData.length);
                fileData = utf8to16(atob(fileData));
                switch (element.parentNode.id) {
                    case 'uploadSettings':
                        lS.settings = fileData;
                        settings = JSON.parse(lS.settings);
                        settings.OFAutoPlay = false;
                        lS.settings = JSON.stringify(settings);
                        break;
                }
            }
            reader.readAsDataURL(file);
        };
    });
    $('.set-button button').each((index, element) => {
        element.onclick = () => {
            switch (element.parentNode.id) {
                case 'initSettings':
                    lS['settings'] = `{"pmyc":0,"buttonSize":100,"OFBlur": true,"bgBlur":100,"OFAudio":true,"gameAudio":100,"uiAudio":100,"touchAudio":100,"OFDyfz":true,"OFFcApzsq":true,"OFEffect":true,"OFAutoPlay":false,"listProportion":"16:9"}`;
                    settings = JSON.parse(lS.settings);
                    info('设置数据已初始化,刷新后生效', 'info');
                    break;
            }
        };
    });
    $('.set-radio input').each((index, element) => {
        if (settings[element.parentNode.parentNode.parentNode.id] == element.value) {
            element.checked = true;
        }
        element.onchange = () => {
            console.log(element.value);
            settings[element.parentNode.parentNode.parentNode.id] = element.value;
            lS.settings = JSON.stringify(settings);
        };
    });
});