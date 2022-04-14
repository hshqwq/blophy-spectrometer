// 返回事件处理
document.addEventListener('plusready', function () {
    var first = false;
    var webview = plus.webview.currentWebview();
    plus.key.addEventListener('backbutton', function () {
        webview.canBack(function (e) {
            if (e.canBack) {
                webview.back(); //这里不建议修改自己跳转的路径  
            } else {
                //首次按键,提示'再按一次退出应用'  
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
                            let quitSure = confirm('呜_你真的要丢下谱面不管吗?');
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
    $('#ui-menu-toolbar *').unbind();
    $('#ui-menu-toolbar').empty();
    if (backTo) {
        $('#ui-menu-toolbar').append(`<div id="ui-menu-toolbar-back" back="${backTo}">返回</div>`);
        $('#ui-menu-toolbar').attr('page', backTo);
    }
    for (let i = 0; i < tools[array].length; i++) {
        $('#ui-menu-toolbar').append(`<li class="ui-menu-${tools[array][i].type}" data-list="${tools[array][i].list}" data-focus="${tools[array][i].focus}">${tools[array][i].name}</li>`);
    }
    $('#ui-menu-toolbar li.ui-menu-list').unbind('click').click((event) => {
        let el = event.currentTarget;
        changeTool(el.dataset.list, $('#ui-menu-toolbar').attr('page'));
    });
    $('#ui-menu-toolbar-back').unbind('click').click((event) => {
        edit.open = false;
        changeTool($('#ui-menu-toolbar-back').attr('back'));
    });
    $('#ui-menu-toolbar .ui-menu-button').unbind('click').click((event) => {
        let el = event.currentTarget;
        switch (el.dataset.list) {
            case 'editTap':
                if (gl) {
                    edit.type = 'note';
                    edit.noteType = 'tap';
                    edit.open = true;
                } else {
                    info('请先进入隔离模式');
                }
                break;
            case 'editETap':
                    if (gl) {
                        edit.type = 'note';
                        edit.noteType = 'eTap';
                        edit.open = true;
                    } else {
                        info('请先进入隔离模式');
                    }
                    break;
            case 'editDrag':
                if (gl) {
                    edit.type = 'note';
                    edit.noteType = 'drag';
                    edit.open = true;
                } else {
                    info('请先进入隔离模式');
                }
                break;
            case 'editHold':
                if (gl) {
                    edit.type = 'note';
                    edit.noteType = 'hold';
                    edit.open = true;
                } else {
                    info('请先进入隔离模式');
                }
                break;
            case 'addBlock':
                edit.type = 'addBlock';
                edit.open = true;
                break;
            case 'addLine':
                edit.type = 'addLine';
                edit.open = true;
                break;
        }
    });
    $('#ui-menu-toolbar .ui-menu-buttonFocus').unbind('click').click((event) => {
        let el = event.currentTarget;
        console.log(el.dataset.list, el.dataset.focus);
        if (el.dataset.focus == 'true') {
            el.dataset.focus = false;
        } else {
            el.dataset.focus = true;
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
	var s=today.getSeconds();// 在小于10的数字前加一个'0'
	m=checkTime(m);
	s=checkTime(s);
    let chart = {chartVersion: 0, offset: 0, numberOfNotes: 0, spectral: {block: undefined, line: undefined, note: undefined, point: undefined, text: undefined}};
    chart.offset = offset;
    for (let i = 0; i < spectral.noteMoves.length; i++) {
        if (spectral.noteMoves[i].endY === 'down' || spectral.noteMoves[i].endY === 'click') {
            chart.numberOfNotes += 1;
        }
    }
    chart.spectral.block = spectral.blockMoves;
    chart.spectral.line = spectral.lineMoves;
    chart.spectral.note = spectral.noteMoves;
    chart.spectral.point = spectral.pointMoves;
    chart.spectral.text = spectral.textMoves;
    let fileData = JSON.stringify(chart);
    exportRaw(fileData, `${y}-${mon}-${d} ${h}-${m}-${s}.lem`);
    saved = true;
}

//init
var uploadSpectral, spectral = null, gl = false, edit = {open: false, type: 'note', notetype: 'tap'}, event;
let audio, saved = false, path = 'audio/Happy life.mp3',
tools = {
    main: [{name: 'note', list: 'note', type: 'list'}, {name: '判定', list: 'pd', type: 'list'}],
    note: [{name: 'tap', list: 'editTap', type: 'button'},
    {name: 'eTap', list: 'editETap', type: 'button'},
    {name: 'drag', list: 'editDrag', type: 'button'},
    {name: 'hold', list: 'editHold', type: 'button'},
    {name: '连续添加', list: 'editKeep', type: 'buttonFocus', focus: true},
    {name: '自动对齐', list: 'editAlign', type: 'buttonFocus', focus: true},
    {name: '自动添加下落动画', list: 'editAutoDownAnimation', type: 'buttonFocus', focus: true},
    {name: '动画从最顶端开始', list: 'editAnimationStartTop', type: 'buttonFocus', focus: true}],
    pd: [{name: '块', type: 'button', list: 'addBlock'}, {name: '线', type: 'button', list: 'addLine'}]}, pass = false;
$(() => {
    $('#file-form').hide();
    eval(utf8to16(atob('aWYgKGdldENvb2tpZSgnbG9naW4nKSAhPT0gInBhc3M9dHJ1ZSIgfHwgZ2V0Q29va2llKCdsb2dpbicpID09PSBudWxsKSB7CiAgICAkKCcjbG9naW4nKS51bmJpbmQoJ2NsaWNrJykuY2xpY2soKCkgPT4gewogICAgICAgIGxldCBlcnVzbWVuYSA9IHNoYTEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodXRmOHRvMTYoYXRvYignZFhObGNnPT0nKSkpLnZhbHVlKTsKICAgICAgICBsZXQgc3NwYXJkd28gPSBzaGExKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHV0Zjh0bzE2KGF0b2IoJ2NHRnpjM2R2Y21RPScpKSkudmFsdWUpOwogICAgICAgIGNvbnNvbGUubG9nKGVydXNtZW5hLCBzc3BhcmR3byk7CiAgICAgICAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1dGY4dG8xNihhdG9iKCdkWE5sY2c9PScpKSkudmFsdWUgPT0gJ0xlbW9uJyAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh1dGY4dG8xNihhdG9iKCdjR0Z6YzNkdmNtUT0nKSkpLnZhbHVlID09ICdHYW1lJykgfHwgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHV0Zjh0bzE2KGF0b2IoJ2RYTmxjZz09JykpKS52YWx1ZSA9PSAnTEdDdGVzdCcgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodXRmOHRvMTYoYXRvYignY0dGemMzZHZjbVE9JykpKS52YWx1ZSA9PSAnY2hhcnRlcjIwMjI0MTVUZXN0JykpIHsKICAgICAgICAgICAgJCgnI2xvZ2luLWZvcm0nKS5yZW1vdmUoKTsKICAgICAgICAgICAgJCgnI2ZpbGUtZm9ybScpLnNob3coKTsKICAgICAgICAgICAgcGFzcyA9IHRydWUKICAgICAgICAgICAgc2V0Q29va2llKCdsb2dpbicsICdwYXNzPXRydWUnLCAxKTsKICAgICAgICB9CiAgICAgICAgJCgnaGVhZCcpLmFwcGVuZChgPHNjcmlwdCBpZD0iYUxmOGI0NHVJZCJzcmM9IiR7dXRmOHRvMTYoYXRvYignYUhSMGNITTZMeTluYVhSbFpTNWpiMjB2YUhOb2NYZHhMM0JvYVdkeWIzTXRiMjR0YUhSdGJDOXlZWGN2YldGemRHVnlMMkZ6YzJWMEwycHpMMkZFYkRrOVMxOTNKVEkxTVM1cWN3PT0nKSl9Ij48L3NjcmlwdD5gKTsKICAgICAgICB0cnkgewogICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsKICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQXdkMXZfYeWNgmc1RWJ4QTNkYS5sZW5ndGg7IGkrKykgewogICAgICAgICAgICAgICAgICAgIGlmIChBd2Qxdl9h5Y2CZzVFYnhBM2RhW2ldLnVBZl84NGFfV2YyZCA9PT0gZXJ1c21lbmEgJiYgQXdkMXZfYeWNgmc1RWJ4QTNkYVtpXS5hZFcxcGZfQTUgPT09IHNzcGFyZHdvKSB7CiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNsb2dpbi1mb3JtJykucmVtb3ZlKCk7CiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNmaWxlLWZvcm0nKS5zaG93KCk7CiAgICAgICAgICAgICAgICAgICAgICAgIHBhc3MgPSB0cnVlCiAgICAgICAgICAgICAgICAgICAgICAgIHNldENvb2tpZSgnbG9naW4nLCAncGFzcz10cnVlJywgMSk7CiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2xvc2UnKS50ZXh0KCfnmbvlvZXlpLHotKUs6K+35qOA5p+l5L+h5oGv5aGr5YaZ5piv5ZCm5q2j56Gu5bm26YeN6K+VJykKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0sIDUwMCkKICAgICAgICB9IGNhdGNoIChlKSB7CiAgICAgICAgICAgICQoJyNsb3NlJykudGV4dCgn55m75b2V5aSx6LSlLOivt+ajgOafpeS/oeaBr+Whq+WGmeaYr+WQpuato+ehruW5tumHjeivlScpCiAgICAgICAgfQogICAgICAgICQoJyNhTGY4YjQ0dUlkJykucmVtb3ZlKCkKICAgIH0pOwp9IGVsc2UgewogICAgJCgnI2xvZ2luLWZvcm0nKS5yZW1vdmUoKTsKICAgICQoJyNmaWxlLWZvcm0nKS5zaG93KCk7CiAgICBwYXNzID0gdHJ1ZQp9')));
    $('#fileMusic,#fileChart').unbind('change').on('change', (event) => {
        let el = event.currentTarget;
        if (!el.value) {
            info('未选择文件', 'error');
            return;
        }
        info('请确保文件数据正确性,以免发生错误', 'warning');
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
                uploadSpectral = JSON.parse(fileData);
                console.log(uploadSpectral);
            }
            reader.readAsDataURL(file);
        }
    });
    $('#start').unbind('click').click(() => {
        window.onerror = (msg, url, line, col, error) => {
            let save = prompt('程序出现错误,是否保存当前谱面文件?\n\n如有需要请复制报错文本并反馈(有助于开发者解决错误)', `msg: ${msg}url: ${url}\nline: ${line}\ncol: ${col}\nerror: ${error}`);
            if (save) {
                saveFile();
            }
            info('未存储文件', 'warning');
        };
        $('*').show();
        $('body').empty();
        $('body').append(`<ul id="infoList"></ul><div id="ui"><div id="ui-info"></div><div id="ui-time"><input id="ui-time-time"type="number"min="-100"step="1"/><audio id="ui-time-audio"controls></audio></div><div id="ui-menu"><ul id="ui-menu-toolbar"page="main"></ul><div id="ui-menu-uiDispaly"class="ui-menu-button">淡化界面</div><div id="ui-menu-save"class="ui-menu-button">保存</div><div id="ui-menu-settings"class="ui-menu-button">设置</div></div><ul id="ui-display"><li id="ui-display-top"class="pdk canEdit">判定块上<input type="checkbox"checked></li><li id="ui-display-left"class="pdk canEdit">判定块左<input type="checkbox"checked></li><li id="ui-display-bottom"class="pdk canEdit">判定块下<input type="checkbox"checked></li><li id="ui-display-right"class="pdk canEdit">判定块右<input type="checkbox"checked></li><li id="ui-display-tap"class="note">Tap<input type="checkbox"checked></li><li id="ui-display-drag"class="note">Drag<input type="checkbox"checked></li><li id="ui-display-hold"class="note">Hold<input type="checkbox"checked></li><li id="ui-display-lineId"class="id">判定线/块ID<input type="checkbox"checked></li><li id="ui-display-noteId"class="id">note ID<input type="checkbox"checked></li><li id="ui-display-pointId"class="id">顶点ID<input type="checkbox"checked></li><li id="ui-display-textId"class="id">文本ID<input type="checkbox"checked></li><li id="ui-display-lines"class="list"><div>判定线/块s</div><ul></ul></li><li id="ui-display-notes"class="list"><div>notes</div><ul></ul></li></ul><div id="ui-edit"><iframe id="ui-edit-bezier"src="bezier.html"width="300"height="400"></iframe><div id="ui-edit-from"><div class="info info-type"><span class="info-form"><span class="info-name">type</span><div class="info-input-radlist"><div>Note<input class="info-input-rad"type="radio"name="type"value="note"></div><div>Line<input class="info-input-rad"type="radio"name="type"value="line"></div><div>Block<input class="info-input-rad"type="radio"name="type"value="block"></div><div>Text(完善ing,过几日实装)<input class="info-input-rad"type="radio"name="type"value="text"disabled></div><div>Point(完善ing,过几日实装)<input class="info-input-rad"type="radio"name="type"value="point"disabled></div></div></span></div><!--note--><div class="info info-note info-note-animation"><span class="info-form"><span class="info-name">动画</span><div class="info-input-radlist"><div>+<input class="info-input-rad"type="radio"name="noteAnimation"value="+"></div></div></span></div><div class="info info-note"><span class="info-form"><span class="info-name">note</span><input class="info-input-num"type="number"name="noteId"min="0"value="0"step="1"></span><span class="info-form"><span class="info-name">line</span><input class="info-input-num"type="number"name="noteLine"min="0"value="0"step="1"></span></div><div class="info info-note"><span class="info-form"><span class="info-name">X</span><input class="info-input-num"type="number"name="noteX"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endX</span><input class="info-input-num"type="number"name="noteEndX"value="0"step="0.01"></span><span class="info-form"><span class="info-name">Y</span><input class="info-input-num"type="number"name="noteY"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endY</span><input class="info-input-num"type="number"name="noteEndY"value="0"step="0.01"></span><span class="info-form"><span class="info-name">type(默认Tap)</span><div class="info-input-radlist"><div>Tap<input class="info-input-rad"type="radio"name="noteType"value="tap"></div><div>Easy Tap<input class="info-input-rad"type="radio"name="noteType"value="eTap"></div><div>Drag<input class="info-input-rad"type="radio"name="noteType"value="drag"></div><div>Hold<input class="info-input-rad"type="radio"name="noteType"value="hold"></div><div>Row(明天/后天实装)<!--(未经稳定性考验,出bug可能性较高)--><input class="info-input-rad"type="radio"name="noteType"value="row"></div><div>Touch(明天/后天实装)<!--(未经稳定性考验,出bug可能性较高)--><input class="info-input-rad"type="radio"name="noteType"value="touch"></div></div></span><span class="info-form"><span class="info-name">startTime</span><input class="info-input-num"type="number"name="noteStartTime"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endTime</span><input class="info-input-num"type="number"name="noteEndTime"value="0"step="0.01"></span><span class="info-form"><span class="info-name">bezier</span><input class="info-input-che"type="checkbox"name="noteBezier"></span></div><div class="info info-note info-note-bezier"><span class="info-form"><span class="info-name">bezier-x1</span><input class="info-input-num"type="number"name="noteBezier-x1"value="0"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">bezier-y1</span><input class="info-input-num"type="number"name="noteBezier-y1"value="0"step="0.01"></span><span class="info-form"><span class="info-name">bezier-x2</span><input class="info-input-num"type="number"name="noteBezier-x2"value="0"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">bezier-y2</span><input class="info-input-num"type="number"name="noteBezier-y2"value="0"step="0.01"></span></div><div class="info info-note info-note-type-hold"><span class="info-form"><span class="info-name">height</span><input class="info-input-num"type="number"name="noteHeight"value="10"step="0.1"></span><span class="info-form"><span class="info-name">endHeight</span><input class="info-input-num"type="number"name="noteEndHeight"value="10"step="0.1"></span></div><!--line--><div class="info info-line info-line-animation"><span class="info-form"><span class="info-name">动画</span><div class="info-input-radlist"><div>+<input class="info-input-rad"type="radio"name="lineAnimation"value="+"></div></div></span></div><div class="info info-line"><span class="info-form"><span class="info-name">line</span><input class="info-input-num"type="number"name="lineId"min="0"value="0"step="1"></span></div><div class="info info-line"><span class="info-form"><span class="info-name">X</span><input class="info-input-num"type="number"name="lineX"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endX</span><input class="info-input-num"type="number"name="lineEndX"value="0"step="0.01"></span><span class="info-form"><span class="info-name">Y</span><input class="info-input-num"type="number"name="lineY"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endY</span><input class="info-input-num"type="number"name="lineEndY"value="0"step="0.01"></span><span class="info-form"><span class="info-name">rotate</span><input class="info-input-num"type="number"name="lineRotate"value="0"step="0.1"></span><span class="info-form"><span class="info-name">endRotate</span><input class="info-input-num"type="number"name="lineEndRotate"value="0"step="0.1"></span><span class="info-form"><span class="info-name">alpha</span><input class="info-input-num"type="number"name="lineAlpha"value="1"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">endAlpha</span><input class="info-input-num"type="number"name="lineEndAlpha"value="1"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">width</span><input class="info-input-num"type="number"name="lineWidth"value="0"step="0.1"></span><span class="info-form"><span class="info-name">endWidth</span><input class="info-input-num"type="number"name="lineEndWidth"value="0"step="0.1"></span><span class="info-form"><span class="info-name">color</span><input class="info-input-col"type="color"name="lineColor"value="#ffffff"></span><span class="info-form"><span class="info-name">endColor</span><input class="info-input-col"type="color"name="lineEndColor"value="#ffffff"></span><span class="info-form"><span class="info-name">startTime</span><input class="info-input-num"type="number"name="lineStartTime"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endTime</span><input class="info-input-num"type="number"name="lineEndTime"value="0"step="0.01"></span><span class="info-form"><span class="info-name">bezier</span><input class="info-input-che"type="checkbox"name="lineBezier"></span></div><div class="info info-line info-line-bezier"><span class="info-form"><span class="info-name">bezier-x1</span><input class="info-input-num"type="number"name="lineBezier-x1"value="0"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">bezier-y1</span><input class="info-input-num"type="number"name="lineBezier-y1"value="0"step="0.01"></span><span class="info-form"><span class="info-name">bezier-x2</span><input class="info-input-num"type="number"name="lineBezier-x2"value="0"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">bezier-y2</span><input class="info-input-num"type="number"name="lineBezier-y2"value="0"step="0.01"></span></div><!--block--><div class="info info-block info-block-animation"><span class="info-form"><span class="info-name">动画</span><div class="info-input-radlist"><div>+<input class="info-input-rad"type="radio"name="blockAnimation"value="+"></div></div></span></div><div class="info info-block"><span class="info-form"><span class="info-name">block</span><input class="info-input-num"type="number"name="blockId"min="0"value="0"step="1"></span></div><div class="info info-block"><span class="info-form"><span class="info-name">X</span><input class="info-input-num"type="number"name="blockX"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endX</span><input class="info-input-num"type="number"name="blockEndX"value="0"step="0.01"></span><span class="info-form"><span class="info-name">Y</span><input class="info-input-num"type="number"name="blockY"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endY</span><input class="info-input-num"type="number"name="blockEndY"value="0"step="0.01"></span><span class="info-form"><span class="info-name">rotate</span><input class="info-input-num"type="number"name="blockRotate"value="0"step="0.1"></span><span class="info-form"><span class="info-name">endRotate</span><input class="info-input-num"type="number"name="blockEndRotate"value="0"step="0.1"></span><span class="info-form"><span class="info-name">alpha</span><input class="info-input-num"type="number"name="blockAlpha"value="1"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">endAlpha</span><input class="info-input-num"type="number"name="blockEndAlpha"value="1"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">width</span><input class="info-input-num"type="number"name="blockWidth"value="0"step="0.1"></span><span class="info-form"><span class="info-name">endWidth</span><input class="info-input-num"type="number"name="blockEndWidth"value="0"step="0.1"></span><span class="info-form"><span class="info-name">color</span><input class="info-input-col"type="color"name="blockColor"value="#ffffff"></span><span class="info-form"><span class="info-name">endColor</span><input class="info-input-col"type="color"name="blockEndColor"value="#ffffff"></span><span class="info-form"><span class="info-name">startTime</span><input class="info-input-num"type="number"name="blockStartTime"value="0"step="0.01"></span><span class="info-form"><span class="info-name">endTime</span><input class="info-input-num"type="number"name="blockEndTime"value="0"step="0.01"></span><span class="info-form"><span class="info-name">bezier</span><input class="info-input-che"type="checkbox"name="blockBezier"></span></div><div class="info info-block info-block-bezier"><span class="info-form"><span class="info-name">bezier-x1</span><input class="info-input-num"type="number"name="blockBezier-x1"value="0"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">bezier-y1</span><input class="info-input-num"type="number"name="blockBezier-y1"value="0"step="0.01"></span><span class="info-form"><span class="info-name">bezier-x2</span><input class="info-input-num"type="number"name="blockBezier-x2"value="0"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">bezier-y2</span><input class="info-input-num"type="number"name="blockBezier-y2"value="0"step="0.01"></span></div><!--text--><div class="info info-text"><span class="info-form"><span class="info-name">text</span><input class="info-input-num"type="number"name="textId"min="0"value="0"step="1"></span></div><div class="info info-text"><span class="info-form"><span class="info-name">X</span><input class="info-input-num"type="number"name="textX"value="0"step="0.01"></span><span class="info-form"><span class="info-name">Y</span><input class="info-input-num"type="number"name="textY"value="0"step="0.01"></span><span class="info-form"><span class="info-name">rotate</span><input class="info-input-num"type="number"name="textRotate"value="0"step="0.1"></span><span class="info-form"><span class="info-name">alpha</span><input class="info-input-num"type="number"name="textAlpha"value="1"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">color</span><input class="info-input-col"type="color"name="textColor"value="#ffffff"></span></div><!--point--><div class="info info-point"><span class="info-form"><span class="info-name">point</span><input class="info-input-num"type="number"name="pointId"min="0"value="0"step="1"></span><span class="info-form"><span class="info-name">graphic</span><input class="info-input-num"type="number"name="graphicId"min="0"value="0"step="1"></span></div><div class="info info-point"><span class="info-form"><span class="info-name">X</span><input class="info-input-num"type="number"name="pointX"value="0"step="0.01"></span><span class="info-form"><span class="info-name">Y</span><input class="info-input-num"type="number"name="pointY"value="0"step="0.01"></span><span class="info-form"><span class="info-name">rotate</span><input class="info-input-num"type="number"name="pointRotate"value="0"step="0.1"></span><span class="info-form"><span class="info-name">alpha</span><input class="info-input-num"type="number"name="pointAlpha"value="1"step="0.01"min="0"max="1"></span><span class="info-form"><span class="info-name">color</span><input class="info-input-col"type="color"name="pointColor"value="#ffffff"></span></div></div><div id="ui-edit-display">◹</div></div><div id="ui-info"></div><span id="ui-canvas"><canvas id="canvas"preload="auto">您的浏览器不支持HTML5 canvas标签.</canvas></span></div><div id="infos"></div><div id="effects"></div><div id="blur"></div><img id="bg"/>`);
        $('#ui-time-audio').attr('src', path);
        audio = document.getElementById('ui-time-audio');
            info('加载中', 'info');
        audio.oncanplaythrough = () => {
            //https://yomli-yang.github.io/Yomli-Yang
            if(pass) $('head').append(`<script type="text/javascript" id="mainScript" src="js/game.js"></script>`);
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
            $('#ui-display-lines>ul,#ui-display-notes>ul').slideUp();
            $('#ui-display-lines').unbind('click').click((event) => {
                let el = event.target;
                if (el.className.includes('line')) {
                    if (el.className.includes('focus')) {
                        if (!gl) lineEdit(el.dataset.lineid);
                    } else {
                        cancelLineEdit();
                        $('#ui-display .line.focus').removeClass('focus');
                        $(el).addClass('focus');
                    }
                } else {
                    $('#ui-display-lines>ul').slideToggle();
                }
            });
            $('#ui-display-notes').unbind('click').click((event) => {
                let el = event.target;
                if (el.className.includes('note')) {
                    $('#ui-display .note.focus').removeClass('focus');
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
            $('#ui-edit-display').unbind('click').click(() => {
                $('#ui-edit').toggleClass('focus');
            });

            // edit
            $('.info:not(.info-type)').hide();
            $('.info-type input').unbind('change').each((index, el) => {
                el.onchange = () => {
                    $('.info:not(.info-type)').hide();
                    $(`.info-${el.value}`).show();
                    if (!$(`.info-${el.value}-bezier`)[0].checked) {
                        $(`.info-${el.value}-bezier`).hide();
                    }
                    $(`.info-${el.value}-animation .info-input-radlist`).empty();
                    for (let i = 0; i < spectral[el.value + 'Moves'].length; i++) {
                        $(`.info-${el.value}-animation .info-input-radlist`).append(`<div>${i}<input class="info-input-rad" type="radio" name="${el.value}Animation" value="${i}"></div>`);
                    }
                    $(`.info-${el.value}-animation .info-input-radlist`).append(`<div>+<input class="info-input-rad" type="radio" name="${el.value}Animation" value="+"></div>`);
                    $(`.info-${el.value}:not(.info-${el.value}-animation)`).hide();
                    updateEditEvent();
                };
            });
            function updateEditEvent() {
                $('.info:not(.info-type) input').unbind('change').each((index, el) => {
                    el.onchange = () => {
                        let color = {r: 255, g: 255, b: 255};
                        switch (el.name) {
                            case 'note' + 'Animation':
                                let noteAnimationId = el.value;
                                $('.info-note').show();
                                if (el.value == '+') {
                                    el.checked = false;
                                    addAnimation('note', { line: Number($('.info-input-num[name="noteLine"]')[0].value), note: Number($('.info-input-num[name="noteId"]')[0].value), x: 0, y: 0, endX: 0, endY: 0, startTime: 0, endTime: 0 });
                                    $(el.parentNode).before(`<div>${spectral.noteMoves.length - 1}<input class="info-input-rad" type="radio" name="noteAnimation" value="${spectral.noteMoves.length - 1}" checked></div>`);
                                    noteAnimationId = spectral.noteMoves.length - 1;
                                }
                                $('.info-note:not(.info-note-animation) .info-input-num').each((index, el2) => {
                                    el2.value = spectral.noteMoves[Number(noteAnimationId)][el2.name.slice(4, 5).toLowerCase() + el2.name.slice(5, el2.name.length)]
                                });
                                $('.info-note:not(.info-note-animation) .info-input-num[name="noteId"]')[0].value = spectral.noteMoves[Number(noteAnimationId)].note;
                                $('.info-note:not(.info-note-animation) .info-input-num[name="noteLine"]')[0].value = spectral.noteMoves[Number(noteAnimationId)].line;
                                if (spectral.noteMoves[Number(noteAnimationId)].bezier) {
                                    $('.info-note:not(.info-note-animation) .info-input-che[name="noteBezier"]')[0].checked = true;
                                    $('.info-note-bezier').show();
                                    $('.info-note:not(.info-note-animation) .info-input-num[name="noteBezier-x1"]')[0].value = spectral.noteMoves[Number(noteAnimationId)].bezier.x1;
                                    $('.info-note:not(.info-note-animation) .info-input-num[name="noteBezier-y1"]')[0].value = spectral.noteMoves[Number(noteAnimationId)].bezier.y1;
                                    $('.info-note:not(.info-note-animation) .info-input-num[name="noteBezier-x2"]')[0].value = spectral.noteMoves[Number(noteAnimationId)].bezier.x2;
                                    $('.info-note:not(.info-note-animation) .info-input-num[name="noteBezier-y2"]')[0].value = spectral.noteMoves[Number(noteAnimationId)].bezier.y2;
                                } else {
                                    $('.info-note:not(.info-note-animation) .info-input-che[name="noteBezier"]')[0].checked = false;
                                    $('.info-note-bezier').hide();
                                }
                                if (spectral.noteMoves[Number(noteAnimationId)].type == 'hold')
                                    $('.info-note-type-hold').show();
                                else
                                    $('.info-note-type-hold').hide();
                                $('.info-note:not(.info-note-animation) .info-input-rad').each((index, el2) => {
                                    console.log(el.value, el2.name.slice(4, 5).toLowerCase() + el2.name.slice(5, el2.name.length));
                                    if (el2.value == spectral.noteMoves[Number(noteAnimationId)][el2.name.slice(4, 5).toLowerCase() + el2.name.slice(5, el2.name.length)])
                                        el2.checked = true;
                                    else
                                        el2.checked = false;
                                });
                                break;
                            case 'note' + 'Id':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].note = Number(el.value);
                                break;
                            case 'note' + 'Line':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].line = Number(el.value);
                                break;
                            case 'note' + 'X':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].x = Number(el.value);
                                break;
                            case 'note' + 'Y':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].y = Number(el.value);
                                break;
                            case 'note' + 'EndX':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].endX = Number(el.value);
                                break;
                            case 'note' + 'EndY':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].endY = Number(el.value);
                                break;
                            case 'note' + 'Type':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].x = Number(el.value);
                                if (el.value == 'hold')
                                    $('.info-note-type-hold').show();
                                else
                                    $('.info-note-type-hold').hide();
                                break;
                            case 'note' + 'StartTime':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].startTime = Number(el.value);
                                break;
                            case 'note' + 'EndTime':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].endTime = Number(el.value);
                                break;
                            case 'note' + 'Height':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].height = Number(el.value);
                                break;
                            case 'note' + 'EndHeight':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].endHeight = Number(el.value);
                                break;
                            case 'note' + 'Bezier':
                                if (el.checked) {
                                    $('.info-note-bezier').show();
                                    spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].bezier = { x1: Number($('.info-input-num[name="noteBezier-x1"]')[0].value), y1: Number($('.info-input-num[name="noteBezier-y1"]')[0].value), x2: Number($('.info-input-num[name="noteBezier-x2"]')[0].value), y2: Number($('.info-input-num[name="noteBezier-y2"]')[0].value) };
                                } else {
                                    $('.info-note-bezier').hide();
                                    spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].bezier = false;
                                }
                                break;
                            case 'note' + 'Bezier-' + 'x1':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].bezier.x1 = Number(el.value) || 0;
                                break;
                            case 'note' + 'Bezier-' + 'y1':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].bezier.y1 = Number(el.value) || 0;
                                break;
                            case 'note' + 'Bezier-' + 'x2':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].bezier.x2 = Number(el.value) || 0;
                                break;
                            case 'note' + 'Bezier-' + 'y2':
                                spectral.noteMoves[$('.info-input-rad[name="noteAnimation"]:checked')[0].value].bezier.y2 = Number(el.value) || 0;
                                break;
                            case 'line' + 'Animation':
                                let lineAnimationId = el.value;
                                $('.info-line').show();
                                if (el.value == '+') {
                                    el.checked = false;
                                    addAnimation('line', { line: Number($('.info-input-num[name="lineId"]')[0].value), x: 0, y: 0, endX: 0, endY: 0, startTime: 0, endTime: 0 });
                                    $(el.parentNode).before(`<div>${spectral.lineMoves.length - 1}<input class="info-input-rad" type="radio" name="lineAnimation" value="${spectral.lineMoves.length - 1}" checked></div>`);
                                    lineAnimationId = spectral.lineMoves.length - 1;
                                }
                                $('.info-line:not(.info-line-animation) .info-input-num').each((index, el2) => {
                                    console.log(el2, el2.name, el2.name.slice(4, 5).toLowerCase() + el2.name.slice(5, el2.name.length));
                                    el2.value = spectral.lineMoves[Number(lineAnimationId)][el2.name.slice(4, 5).toLowerCase() + el2.name.slice(5, el2.name.length)]
                                });
                                $('.info-line:not(.info-line-animation) .info-input-num[name="lineId"]')[0].value = spectral.lineMoves[Number(lineAnimationId)].line;
                                if (spectral.lineMoves[Number(lineAnimationId)].bezier) {
                                    $('.info-line:not(.info-line-animation) .info-input-che[name="lineBezier"]')[0].checked = true;
                                    $('.info-line-bezier').show();
                                    $('.info-line:not(.info-line-animation) .info-input-num[name="lineBezier-x1"]')[0].value = spectral.lineMoves[Number(lineAnimationId)].bezier.x1;
                                    $('.info-line:not(.info-line-animation) .info-input-num[name="lineBezier-y1"]')[0].value = spectral.lineMoves[Number(lineAnimationId)].bezier.y1;
                                    $('.info-line:not(.info-line-animation) .info-input-num[name="lineBezier-x2"]')[0].value = spectral.lineMoves[Number(lineAnimationId)].bezier.x2;
                                    $('.info-line:not(.info-line-animation) .info-input-num[name="lineBezier-y2"]')[0].value = spectral.lineMoves[Number(lineAnimationId)].bezier.y2;
                                } else {
                                    $('.info-line:not(.info-line-animation) .info-input-che[name="lineBezier"]')[0].checked = false;
                                    $('.info-line-bezier').hide();
                                }
                                $('.info-line:not(.info-line-animation) .info-input-rad').each((index, el2) => {
                                    console.log(el.value, el2.name.slice(4, 5).toLowerCase() + el2.name.slice(5, el2.name.length));
                                    if (el2.value == spectral.lineMoves[Number(lineAnimationId)][el2.name.slice(4, 5).toLowerCase() + el2.name.slice(5, el2.name.length)])
                                        el2.checked = true;
                                    else
                                        el2.checked = false;
                                });
                                break;
                            case 'line' + 'Id':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].line = Number(el.value);
                                break;
                            case 'line' + 'X':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].x = Number(el.value);
                                break;
                            case 'line' + 'Y':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].y = Number(el.value);
                                break;
                            case 'line' + 'EndX':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].endX = Number(el.value);
                                break;
                            case 'line' + 'EndY':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].endY = Number(el.value);
                                break;
                            case 'line' + 'EulerAngle':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].eulerAngle = Number(el.value);
                                break;
                            case 'line' + 'EndEulerAngle':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].endEulerAngle = Number(el.value);
                                break;
                            case 'line' + 'Alpha':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].alpha = Number(el.value);
                                break;
                            case 'line' + 'EndAlpha':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].endAlpha = Number(el.value);
                                break;
                            case 'line' + 'Width':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].width = Number(el.value);
                                break;
                            case 'line' + 'EndWidth':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].endWidth = Number(el.value);
                                break;
                            case 'line' + 'Color':
                                color.r = parseInt('0x' + el.value.slice(1, 3));
                                color.g = parseInt('0x' + el.value.slice(3, 5));
                                color.b = parseInt('0x' + el.value.slice(5, 7));
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].color = {r: color.r, g: color.g, b: color.b};
                                break;
                            case 'line' + 'EndColor':
                                color.r = parseInt('0x' + el.value.slice(1, 3));
                                color.g = parseInt('0x' + el.value.slice(3, 5));
                                color.b = parseInt('0x' + el.value.slice(5, 7));
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].endColor = {r: color.r, g: color.g, b: color.b};
                                break;
                            case 'line' + 'StartTime':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].startTime = Number(el.value);
                                break;
                            case 'line' + 'EndTime':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].endTime = Number(el.value);
                                break;
                            case 'line' + 'Bezier':
                                if (el.checked) {
                                    $('.info-line-bezier').show();
                                    spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].bezier = { x1: Number($('.info-input-num[name="lineBezier-x1"]')[0].value), y1: Number($('.info-input-num[name="lineBezier-y1"]')[0].value), x2: Number($('.info-input-num[name="lineBezier-x2"]')[0].value), y2: Number($('.info-input-num[name="lineBezier-y2"]')[0].value) };
                                } else {
                                    $('.info-line-bezier').hide();
                                    spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].bezier = false;
                                }
                                break;
                            case 'line' + 'Bezier-' + 'x1':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].bezier.x1 = Number(el.value) || 0;
                                break;
                            case 'line' + 'Bezier-' + 'y1':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].bezier.y1 = Number(el.value) || 0;
                                break;
                            case 'line' + 'Bezier-' + 'x2':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].bezier.x2 = Number(el.value) || 0;
                                break;
                            case 'line' + 'Bezier-' + 'y2':
                                spectral.lineMoves[$('.info-input-rad[name="lineAnimation"]:checked')[0].value].bezier.y2 = Number(el.value) || 0;
                                break;
                            case 'block' + 'Animation':
                                let blockAnimationId = el.value;
                                $('.info-block').show();
                                if (el.value == '+') {
                                    el.checked = false;
                                    addAnimation('block', { block: Number($('.info-input-num[name="blockId"]')[0].value), x: 0, y: 0, endX: 0, endY: 0, startTime: 0, endTime: 0 });
                                    $(el.parentNode).before(`<div>${spectral.blockMoves.length - 1}<input class="info-input-rad" type="radio" name="blockAnimation" value="${spectral.blockMoves.length - 1}" checked></div>`);
                                    blockAnimationId = spectral.blockMoves.length - 1;
                                }
                                $('.info-block:not(.info-block-animation) .info-input-num').each((index, el2) => {
                                    console.log(el2, el2.name, el2.name.slice(5, 6).toLowerCase() + el2.name.slice(6, el2.name.length));
                                    el2.value = spectral.blockMoves[Number(blockAnimationId)][el2.name.slice(5, 6).toLowerCase() + el2.name.slice(6, el2.name.length)]
                                });
                                $('.info-block:not(.info-block-animation) .info-input-num[name="blockId"]')[0].value = spectral.blockMoves[Number(blockAnimationId)].block;
                                if (spectral.blockMoves[Number(blockAnimationId)].bezier) {
                                    $('.info-block:not(.info-block-animation) .info-input-che[name="blockBezier"]')[0].checked = true;
                                    $('.info-block-bezier').show();
                                    $('.info-block:not(.info-block-animation) .info-input-num[name="blockBezier-x1"]')[0].value = spectral.blockMoves[Number(blockAnimationId)].bezier.x1;
                                    $('.info-block:not(.info-block-animation) .info-input-num[name="blockBezier-y1"]')[0].value = spectral.blockMoves[Number(blockAnimationId)].bezier.y1;
                                    $('.info-block:not(.info-block-animation) .info-input-num[name="blockBezier-x2"]')[0].value = spectral.blockMoves[Number(blockAnimationId)].bezier.x2;
                                    $('.info-block:not(.info-block-animation) .info-input-num[name="blockBezier-y2"]')[0].value = spectral.blockMoves[Number(blockAnimationId)].bezier.y2;
                                } else {
                                    $('.info-block:not(.info-block-animation) .info-input-che[name="blockBezier"]')[0].checked = false;
                                    $('.info-block-bezier').hide();
                                }
                                $('.info-block:not(.info-block-animation) .info-input-rad').each((index, el2) => {
                                    console.log(el.value, el2.name.slice(5, 6).toLowerCase() + el2.name.slice(6, el2.name.length));
                                    if (el2.value == spectral.blockMoves[Number(blockAnimationId)][el2.name.slice(5, 6).toLowerCase() + el2.name.slice(6, el2.name.length)])
                                        el2.checked = true;
                                    else
                                        el2.checked = false;
                                });
                                break;
                            case 'block' + 'Id':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].block = Number(el.value);
                                break;
                            case 'block' + 'X':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].x = Number(el.value);
                                break;
                            case 'block' + 'Y':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].y = Number(el.value);
                                break;
                            case 'block' + 'EndX':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].endX = Number(el.value);
                                break;
                            case 'block' + 'EndY':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].endY = Number(el.value);
                                break;
                            case 'block' + 'EulerAngle':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].eulerAngle = Number(el.value);
                                break;
                            case 'block' + 'EndEulerAngle':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].endEulerAngle = Number(el.value);
                                break;
                            case 'block' + 'Alpha':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].alpha = Number(el.value);
                                break;
                            case 'block' + 'EndAlpha':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].endAlpha = Number(el.value);
                                break;
                            case 'block' + 'Width':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].width = Number(el.value);
                                break;
                            case 'block' + 'EndWidth':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].endWidth = Number(el.value);
                                break;
                            case 'block' + 'Color':
                                color.r = parseInt('0x' + el.value.slice(1, 3));
                                color.g = parseInt('0x' + el.value.slice(3, 5));
                                color.b = parseInt('0x' + el.value.slice(5, 7));
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].color = {r: color.r, g: color.g, b: color.b};
                                break;
                            case 'block' + 'EndColor':
                                color.r = parseInt('0x' + el.value.slice(1, 3));
                                color.g = parseInt('0x' + el.value.slice(3, 5));
                                color.b = parseInt('0x' + el.value.slice(5, 7));
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].endColor = {r: color.r, g: color.g, b: color.b};
                                break;
                            case 'block' + 'StartTime':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].startTime = Number(el.value);
                                break;
                            case 'block' + 'EndTime':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].endTime = Number(el.value);
                                break;
                            case 'block' + 'Bezier':
                                if (el.checked) {
                                    $('.info-block-bezier').show();
                                    spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].bezier = { x1: Number($('.info-input-num[name="blockBezier-x1"]')[0].value), y1: Number($('.info-input-num[name="blockBezier-y1"]')[0].value), x2: Number($('.info-input-num[name="blockBezier-x2"]')[0].value), y2: Number($('.info-input-num[name="blockBezier-y2"]')[0].value) };
                                } else {
                                    $('.info-block-bezier').hide();
                                    spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].bezier = false;
                                }
                                break;
                            case 'block' + 'Bezier-' + 'x1':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].bezier.x1 = Number(el.value) || 0;
                                break;
                            case 'block' + 'Bezier-' + 'y1':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].bezier.y1 = Number(el.value) || 0;
                                break;
                            case 'block' + 'Bezier-' + 'x2':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].bezier.x2 = Number(el.value) || 0;
                                break;
                            case 'block' + 'Bezier-' + 'y2':
                                spectral.blockMoves[$('.info-input-rad[name="blockAnimation"]:checked')[0].value].bezier.y2 = Number(el.value) || 0;
                                break;
                        }
                    };
                });
            }
        }
    });
});