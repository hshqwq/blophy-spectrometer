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

function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}