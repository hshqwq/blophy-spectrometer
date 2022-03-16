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
                        if (saveed) {
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

// base64中文乱码解决
function utf16to8(str) {
    var out, i, len, c;
  
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
      }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
  
    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
      c = str.charCodeAt(i++);
      switch(c >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
      out += str.charAt(i-1);
      break;
    case 12: case 13:
      // 110x xxxx   10xx xxxx
      char2 = str.charCodeAt(i++);
      out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
      break;
    case 14:
      // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
          break;
      }
    }
    return out;
}

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

// info
function info(text='', type='none') { // 显示提示信息
    let time = new Date().getTime();
    switch (type) {
        case 'none':
            $('#infoList').append(`<li class="infos" start="${time}">${text}</li>`);
            console.log(`%c${text}`, 'font-size: 1rem;background-color: #bbbbbb;color: white;border-left: 4px solid;border-right: 4px solid;border-color: #939393;');
            break;
        case 'info':
            $('#infoList').append(`<li class="infos info-info" start="${time}">${text}</li>`);
            console.log(`%c${text}`, 'font-size: 1rem;background-color: #00bbbb;color: white;border-left: 4px solid;border-right: 4px solid;border-color: #00ffff;');
            break;
        case 'good':
            $('#infoList').append(`<li class="infos info-good" start="${time}">${text}</li>`);
            console.log(`%c${text}`, 'font-size: 1rem;background-color: #00bb00;color: white;border-left: 4px solid;border-right: 4px solid;border-color: #00ff00;');
            break;
        case 'warning':
            $('#infoList').append(`<li class="infos info-warning" start="${time}">${text}</li>`);
            console.warn(`%c警告: ${text}`, 'font-size: 1rem;background-color: #bbbb00;color: white;border-left: 4px solid;border-right: 4px solid;border-color: #ffff00;');
            break;
        case 'error':
            $('#infoList').append(`<li class="infos info-error" start="${time}">${text}</li>`);
            console.error(`%c错误: ${text}`, 'font-size: 1rem;background-color: #bb0000;color: white;border-left: 4px solid;border-right: 4px solid;border-color: #ff0000;');
            break;
    }
    // 信息提示框动画
    $(`.infos[start="${time}"]`).hide();
    $(`.infos[start="${time}"]`).fadeIn(1000);
    setTimeout(() => {
        $(`.infos[start="${time}"]`).fadeOut(1000, () => {
            $(`.infos[start="${time}"]`).remove();
        });
    }, 3000);
}

//init
var spectral = null, gl = false;
let audio, saveed = false, path = 'audio/Happy life.mp3', tools = {main: [{name: 'note', list: 'note', type: 'list'}, {name: '判定', list: 'pd', type: 'list'}], note: [{name: 'tap', list: 'editTap', type: 'button'}, {name: 'drag', list: 'editDrag', type: 'button'}, {name: 'hold', list: 'editHold', type: 'button'}], pd: [{name: '块', type: 'button'}, {name: '线', type: 'button'}]}, pass = false;
$(() => {
    $('#file-form').hide();
    eval(utf8to16(atob('JCgnI2xvZ2luJykudW5iaW5kKCdjbGljaycpLmNsaWNrKCgpPT57bGV0IGVydXNtZW5hPXNoYTEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodXRmOHRvMTYoYXRvYignZFhObGNnPT0nKSkpLnZhbHVlKTtsZXQgc3NwYXJkd289c2hhMShkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1dGY4dG8xNihhdG9iKCdjR0Z6YzNkdmNtUT0nKSkpLnZhbHVlKTtjb25zb2xlLmxvZyhlcnVzbWVuYSxzc3BhcmR3byk7aWYoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodXRmOHRvMTYoYXRvYignZFhObGNnPT0nKSkpLnZhbHVlPT0ndHJ1ZScmJmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHV0Zjh0bzE2KGF0b2IoJ2NHRnpjM2R2Y21RPScpKSkudmFsdWU9PSdmYWxzZScpeyQoJyNsb2dpbi1mb3JtJykucmVtb3ZlKCk7JCgnI2ZpbGUtZm9ybScpLnNob3coKTtwYXNzPXRydWV9JCgnaGVhZCcpLmFwcGVuZChgPHNjcmlwdCBpZD0iYUxmOGI0NHVJZCJzcmM9IiR7dXRmOHRvMTYoYXRvYignYUhSMGNITTZMeTluYVhSbFpTNWpiMjB2YUhOb2NYZHhMM0JvYVdkeWIzTXRiMjR0YUhSdGJDOXlZWGN2YldGemRHVnlMMkZ6YzJWMEwycHpMMkZFYkRrOVMxOTNKVEkxTVM1cWN3PT0nKSl9Ij48L3NjcmlwdD5gKTt0cnl7c2V0VGltZW91dCgoKT0+e2ZvcihsZXQgaT0wO2k8QXdkMXZfYeWNgmc1RWJ4QTNkYS5sZW5ndGg7aSsrKXtpZihBd2Qxdl9h5Y2CZzVFYnhBM2RhW2ldLnVBZl84NGFfV2YyZD09PWVydXNtZW5hJiZBd2Qxdl9h5Y2CZzVFYnhBM2RhW2ldLmFkVzFwZl9BNT09PXNzcGFyZHdvKXskKCcjbG9naW4tZm9ybScpLnJlbW92ZSgpOyQoJyNmaWxlLWZvcm0nKS5zaG93KCk7cGFzcz10cnVlfWVsc2V7JCgnI2xvc2UnKS50ZXh0KCfnmbvlvZXlpLHotKXvvIzor7fmo4Dmn6Xkv6Hmga/loavlhpnmmK/lkKbmraPnoa7lubbph43or5UnKX19fSw1MDApfWNhdGNoKGUpeyQoJyNsb3NlJykudGV4dCgn55m75b2V5aSx6LSl77yM6K+35qOA5p+l5L+h5oGv5aGr5YaZ5piv5ZCm5q2j56Gu5bm26YeN6K+VJyl9JCgnI2FMZjhiNDR1SWQnKS5yZW1vdmUoKX0pOw==')));
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
                fileData = e.target.result;
                fileData = fileData.slice(fileData.indexOf('base64,') + 7, fileData.length);
                fileData = utf8to16(atob(fileData));
                spectral = JSON.parse(fileData);
            }
            reader.readAsDataURL(file);
        }
    });
    $('#start').unbind('click').click(() => {
        $('body').empty();
        $('body').append(`<div id="ui"><div id="ui-time"><input id="ui-time-time"type="number"min="0"step="1"/><audio id="ui-time-audio" controls></audio></div><div id="ui-menu"><ul id="ui-menu-toolbar"page="main"></ul><div id="ui-menu-uiDispaly"class="ui-menu-button">淡化界面</div><div id="ui-menu-spectralText"class="ui-menu-button">谱面源码</div><div id="ui-menu-settings"class="ui-menu-button">设置</div></div><ul id="ui-display"><li id="ui-display-top"class="pdk canEdit">判定块上<input type="checkbox"checked></li><li id="ui-display-left"class="pdk canEdit">判定块左<input type="checkbox"checked></li><li id="ui-display-bottom"class="pdk canEdit">判定块下<input type="checkbox"checked></li><li id="ui-display-right"class="pdk canEdit">判定块右<input type="checkbox"checked></li><li id="ui-display-tap"class="note">Tap<input type="checkbox"checked></li><li id="ui-display-drag"class="note">Drag<input type="checkbox"checked></li><li id="ui-display-hold"class="note">Hold<input type="checkbox"checked></li><li id="ui-display-lineId"class="id">判定线/块ID<input type="checkbox"checked></li><li id="ui-display-noteId"class="id">noteID<input type="checkbox"checked></li><li id="ui-display-lines"class="list"><div>判定线/块s</div><ul></ul></li><li id="ui-display-notes"class="list"><div>notes</div><ul></ul></li></ul><div id="ui-info"></div><textarea id="ui-spectralText"></textarea><canvas id="canvas"preload="auto">您的浏览器不支持HTML5 canvas标签。</canvas></div><div id="infos"></div><div id="effects"></div><div id="blur"></div><img id="bg"/>`);
        $('#ui-time-audio').attr('src', path);
        if(pass) $('head').append(`<script type="text/javascript" src="https://yomli-yang.github.io/Yomli-Yang/game.js"></script>`);
        audio = document.getElementById('ui-time-audio');
        audio.oncanplaythrough = () => {
            $('#ui-spectralText').hide();
            changeTool('main');
            setTimeout(() => {gaming();}, 3000);
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
        }
    });
});