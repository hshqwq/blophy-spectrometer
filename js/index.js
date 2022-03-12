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

//init
let saveed = false, tools = {main: [{name: 'note', list: 'note', type: 'list'}, {name: '判定', list: 'pd', type: 'list'}], note: [{name: 'tap', list: 'editTap', type: 'button'}, {name: 'drag', list: 'editDrag', type: 'button'}, {name: 'hold', list: 'editHold', type: 'button'}], pd: [{name: '块', type: 'button'}, {name: '线', type: 'button'}]};
$(() => {
    $('#ui-spectralText').hide();
    changeTool('main');
    $('#ui-display>li.pdk:first-child').addClass('focus');
    $('#ui-display>li.pdk').unbind('click').click((event) => {
        let el = event.currentTarget;
        $('#ui-display>li.pdk').attr('class', '');
        el.className = 'pdk focus';
    });
    $('#ui-display>li.note>input').each((index, el) => {
        el.onchange = () => {
            display[el.parentNode.id.slice(11, el.parentNode.id.length)] = el.checked;
            console.log(el.parentNode.id.slice(11, el.parentNode.id.length), display);
        };
    });
    $('#ui-display>li.pdk>input').each((index, el) => {
        el.onchange = () => {
            display.block[$(el.parentNode).index()] = el.checked;
            console.log(el.parentNode.id.slice(11, el.parentNode.id.length), display);
        };
    });
    $('#ui-menu-spectralText').unbind('click').click(() => {
        console.log('click');
        $('#ui-spectralText').text(JSON.stringify(spectral));
        $('#ui-spectralText').toggle();
    });
});