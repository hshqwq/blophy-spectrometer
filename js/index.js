// 返回事件处理
document.addEventListener('plusready', function () {
    var first = false;
    var webview = plus.webview.currentWebview();
    plus.key.addEventListener('backbutton', function () {
        webview.canBack(function (e) {
            if (e.canBack) {
                webview.back(); //这里不建议修改自己跳转的路径  
            } else {
                //首次按键，提示‘再按一次退出应用’  
                if (!first) {
                    first = new Date().getTime(); //获取第一次点击的时间戳  
                    plus.nativeUI.toast("再按一次退出应用", {
                        duration: 'short'
                    }); //通过H5+ API 调用Android 上的toast 提示框  
                    setTimeout(function () {
                        first = false;
                    }, 1000);
                } else {
                    // 获取第二次点击的时间戳, 两次之差 小于 1000ms 说明1s点击了两次, 
                    if (new Date().getTime() - first < 1000) {
                        if (saved) {
                            plus.runtime.quit(); //退出应用
                        } else {
                            let quitSure = confirm('呜——你真的要丢下谱面不管吗?');
                            if (quitSure) {
                                plus.runtime.quit();
                            } else {
                                first = false;
                            }
                        }
                    }
                }
            }
        })
    });
});


function changeTool(array, backTo) {
    $('#ui-menu-toolbar').empty();
    if (backTo) {
        $('#ui-menu-toolbar').append(`<div id="ui-menu-toolbar-back" back="${backTo}">返回</div>`);
        $('#ui-menu-toolbar').attr('page', backTo);
    }
    for (let i = 0; i < tools[array].length; i++) {
        $('#ui-menu-toolbar').append(`<li class="ui-menu-${tools[array][i].type}" data-list="${tools[array][i].list}">${tools[array][i].name}</li>`);
    }
    $('#ui-menu-toolbar li.ui-menu-list').unbind('click').click((event) => {
        let el = event.currentTarget;
        console.log(el);
        changeTool(el.dataset.list, $('#ui-menu-toolbar').attr('page'));
    });
    $('#ui-menu-toolbar-back').unbind('click').click((event) => {
        changeTool($('#ui-menu-toolbar-back').attr('back'))
    });
    $('.ui-menu-button').unbind('click').click((event) => {
        let el = event.currentTarget;
        switch (el.dataset.list) {
            case 'editTap':

        }
    });
}

function saveFile(){
    function exportRaw(data, name) {
        let urlObject = window.URL || window.webkitURL || window;
        let export_blob = new Blob([data]);
        let save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        save_link.click();
    }
    function checkTime(i){
        if (i<10){
            i="0" + i;
        }
        return i;
    }
    var today=new Date();
    var y = today.getFullYear();
    var mon = today.getMonth();
    var d = today.getDate();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();// 在小于10的数字前加一个‘0’
	m=checkTime(m);
	s=checkTime(s);
    let fileData = JSON.stringify(spectral);
    exportRaw(fileData, `${y}-${mon}-${d} ${h}-${m}-${s}.lem`);
    saved = true;
}

//init
var spectral = null, gl = false;
let audio, saved = false, path = 'audio/Happy life.mp3', tools = {main: [{name: 'note', list: 'note', type: 'list'}, {name: '判定', list: 'pd', type: 'list'}], note: [{name: 'tap', list: 'editTap', type: 'button'}, {name: 'drag', list: 'editDrag', type: 'button'}, {name: 'hold', list: 'editHold', type: 'button'}], pd: [{name: '块', type: 'button'}, {name: '线', type: 'button'}]}, pass = false;
$(() => {
    $('#file-form').hide();
    eval(utf8to16(atob('aWYgKGdldENvb2tpZSgnbG9naW4nKSA9PT0gIiIgfHwgZ2V0Q29va2llKCdsb2dpbicpID09PSBudWxsKSB7CiAgICAgICAgJCgnI2xvZ2luJykudW5iaW5kKCdjbGljaycpLmNsaWNrKCgpID0+IHsKICAgICAgICAgICAgbGV0IGVydXNtZW5hID0gc2hhMShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1dGY4dG8xNihhdG9iKCdkWE5sY2c9PScpKSkudmFsdWUpOwogICAgICAgICAgICBsZXQgc3NwYXJkd28gPSBzaGExKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHV0Zjh0bzE2KGF0b2IoJ2NHRnpjM2R2Y21RPScpKSkudmFsdWUpOwogICAgICAgICAgICBjb25zb2xlLmxvZyhlcnVzbWVuYSwgc3NwYXJkd28pOwogICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodXRmOHRvMTYoYXRvYignZFhObGNnPT0nKSkpLnZhbHVlID09ICd0cnVlJyAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1dGY4dG8xNihhdG9iKCdjR0Z6YzNkdmNtUT0nKSkpLnZhbHVlID09ICdmYWxzZScpIHsKICAgICAgICAgICAgICAgICQoJyNsb2dpbi1mb3JtJykucmVtb3ZlKCk7CiAgICAgICAgICAgICAgICAkKCcjZmlsZS1mb3JtJykuc2hvdygpOwogICAgICAgICAgICAgICAgcGFzcyA9IHRydWUKICAgICAgICAgICAgICAgIHNldENvb2tpZSgnbG9naW4nLCAncGFzcz10cnVlJywgMSk7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgJCgnaGVhZCcpLmFwcGVuZChgPHNjcmlwdCBpZD0iYUxmOGI0NHVJZCJzcmM9IiR7dXRmOHRvMTYoYXRvYignYUhSMGNITTZMeTluYVhSbFpTNWpiMjB2YUhOb2NYZHhMM0JvYVdkeWIzTXRiMjR0YUhSdGJDOXlZWGN2YldGemRHVnlMMkZ6YzJWMEwycHpMMkZFYkRrOVMxOTNKVEkxTVM1cWN3PT0nKSl9Ij48L3NjcmlwdD5gKTsKICAgICAgICAgICAgdHJ5IHsKICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gewogICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQXdkMXZfYeWNgmc1RWJ4QTNkYS5sZW5ndGg7IGkrKykgewogICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXdkMXZfYeWNgmc1RWJ4QTNkYVtpXS51QWZfODRhX1dmMmQgPT09IGVydXNtZW5hICYmIEF3ZDF2X2HljYJnNUVieEEzZGFbaV0uYWRXMXBmX0E1ID09PSBzc3BhcmR3bykgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2xvZ2luLWZvcm0nKS5yZW1vdmUoKTsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmaWxlLWZvcm0nKS5zaG93KCk7CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzID0gdHJ1ZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q29va2llKCdsb2dpbicsICdwYXNzPXRydWUnLCAxKTsKICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNsb3NlJykudGV4dCgn55m75b2V5aSx6LSl77yM6K+35qOA5p+l5L+h5oGv5aGr5YaZ5piv5ZCm5q2j56Gu5bm26YeN6K+VJykKICAgICAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0sIDUwMCkKICAgICAgICAgICAgfSBjYXRjaCAoZSkgewogICAgICAgICAgICAgICAgJCgnI2xvc2UnKS50ZXh0KCfnmbvlvZXlpLHotKXvvIzor7fmo4Dmn6Xkv6Hmga/loavlhpnmmK/lkKbmraPnoa7lubbph43or5UnKQogICAgICAgICAgICB9CiAgICAgICAgICAgICQoJyNhTGY4YjQ0dUlkJykucmVtb3ZlKCkKICAgICAgICB9KTsKICAgIH0gZWxzZSB7CiAgICAgICAgJCgnI2xvZ2luLWZvcm0nKS5yZW1vdmUoKTsKICAgICAgICAkKCcjZmlsZS1mb3JtJykuc2hvdygpOwogICAgICAgIHBhc3MgPSB0cnVlCiAgICB9')));
    $('#fileMusic,#fileChart').unbind('change').on('change', (event) => {
        let el = event.currentTarget;
        if (!el.value) {
            info('未选择文件', 'error');
            return;
        }
        info('请确保文件数据正确性，以免发生错误', 'warning');
        info('如果出现错误请初始化数据', 'warning');
        let file = el.files[0];
        if (el.id == 'fileMusic') {
            path = URL.createObjectURL(file);
            $('#start').show();
        } else if (el.id == 'fileChart'){
            var reader = new FileReader();
            reader.onload = (e) => {
                let fileData = e.target.result;
                fileData = fileData.slice(fileData.indexOf('base64,') + 7, fileData.length);
                fileData = utf8to16(atob(fileData));
                spectral = JSON.parse(fileData);
                console.log(spectral);
            }
            reader.readAsDataURL(file);
        }
    });
    $('#start').unbind('click').click(() => {
        window.onerror = (msg, url, line, col, error) => {
            let save = prompt('程序出现错误，是否保存当前谱面文件？\n\n如有需要请复制报错文本并反馈（有助于开发者解决错误）', `msg: ${msg}url: ${url}\nline: ${line}\ncol: ${col}\nerror: ${error}`);
            if (save) {
                saveFile();
            }
        };
        $('body').empty();
        $('body').append(`<div id="ui"><div id="ui-time"><input id="ui-time-time"type="number"min="0"step="1"/><audio id="ui-time-audio"controls></audio></div><div id="ui-menu"><ul id="ui-menu-toolbar"page="main"></ul><div id="ui-menu-uiDispaly"class="ui-menu-button">淡化界面</div><div id="ui-menu-save"class="ui-menu-button">保存</div><div id="ui-menu-spectralText"class="ui-menu-button">谱面源码</div><div id="ui-menu-settings"class="ui-menu-button">设置</div></div><ul id="ui-display"><li id="ui-display-top"class="pdk canEdit">判定块上<input type="checkbox"checked></li><li id="ui-display-left"class="pdk canEdit">判定块左<input type="checkbox"checked></li><li id="ui-display-bottom"class="pdk canEdit">判定块下<input type="checkbox"checked></li><li id="ui-display-right"class="pdk canEdit">判定块右<input type="checkbox"checked></li><li id="ui-display-tap"class="note">Tap<input type="checkbox"checked></li><li id="ui-display-drag"class="note">Drag<input type="checkbox"checked></li><li id="ui-display-hold"class="note">Hold<input type="checkbox"checked></li><li id="ui-display-lineId"class="id">判定线/块ID<input type="checkbox"checked></li><li id="ui-display-noteId"class="id">noteID<input type="checkbox"checked></li><li id="ui-display-lines"class="list"><div>判定线/块s</div><ul></ul></li><li id="ui-display-notes"class="list"><div>notes</div><ul></ul></li></ul><div id="ui-edit"></div><div id="ui-info"></div><textarea id="ui-spectralText">如您看到此文本框，说明程序还在加载，请耐心等待</textarea><canvas id="canvas"preload="auto">您的浏览器不支持HTML5 canvas标签。</canvas></div><div id="infos"></div><div id="effects"></div><div id="blur"></div><img id="bg"/>`);
        $('#ui-time-audio').attr('src', path);
        audio = document.getElementById('ui-time-audio');
        audio.oncanplaythrough = () => {
            if(pass) $('head').append(`<script type="text/javascript" id="mainScript" src="https://yomli-yang.github.io/Yomli-Yang/game.js"></script>`);
            $('#ui-spectralText').hide();
            changeTool('main');
            $('#ui-menu-save').unbind('click').click(() => {
                saveFile();
            });
            $('#ui-display>li.canEdit').unbind('click').click((event) => {
                let el = event.currentTarget;
                $('#ui-display>li.canEdit').removeClass('focus')
                el.className += ' focus';
            });
            $('#ui-display>li.note>input,#ui-display>li.id>input').each((index, el) => {
                el.onchange = () => {
                    display[el.parentNode.id.slice(11, el.parentNode.id.length)] = el.checked;
                };
            });
            $('#ui-display-lines,#ui-display-notes>ul').slideUp();
            $('#ui-display-lines').unbind('click').click((event) => {
                let el = event.target;
                if (el.className.includes('line')) {
                    if (el.className.includes('focus')) {
                        lineEdit(el.dataset.lineid);
                    } else {
                        cancelLineEdit();
                        $('#ui-display *.focus').removeClass('focus');
                        $(el).addClass('focus');
                    }
                } else {
                    $('#ui-display-lines>ul').slideToggle();
                }
            });
            $('#ui-display-notes').unbind('click').click((event) => {
                let el = event.target;
                if (el.className.includes('note')) {
                    $('#ui-display *.focus').removeClass('focus');
                    $(el).addClass('focus');
                } else {
                    $('#ui-display-notes>ul').slideToggle();
                }
            });
            $('#ui-display>li.pdk>input').each((index, el) => {
                el.onchange = () => {
                    display.block[$(el.parentNode).index()] = el.checked;
                    console.log(el.parentNode.id.slice(11, el.parentNode.id.length), display);
                };
            });
            $('#ui-menu-spectralText').unbind('click').click(() => {
                $('#ui-spectralText').text(JSON.stringify(spectral));
                $('#ui-spectralText').toggle();
            });
            $('#ui-menu-spectralText').unbind('change').on('change', () => {
                spectral = JSON.parse($('#ui-spectralText').text());
            });
            $('#ui-time-time').unbind('focus').on('focus', () => {
                timeFocus = true;
            });
            $('#ui-time-time').unbind('blur').on('blur', () => {
                timeFocus = false;
            });
            $('#ui-time-time').unbind('change').on('change', () => {
                audio.currentTime = Number(document.getElementById('ui-time-time').value) / 100;
                document.getElementById('ui-time-time').value = audio.currentTime * 100;
            });
            $('#ui-menu-uiDispaly').unbind('click').click(() => {
                if ($('#ui>ul').css('opacity') == 1) {
                    $('#ui>div,#ui>ul').css('opacity', 0.1);
                } else {
                    $('#ui>div,#ui>ul').css('opacity', 1);
                }
            });
            $('#ui-menu-settings').unbind('click').click(() => {
                window.open('settings.html', '_blank');
            });
        }
    });
});