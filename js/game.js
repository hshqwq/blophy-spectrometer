Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
var display = {
    block: [
        true,
        true,
        true,
        true
    ],
    tap: true,
    drag: true,
    hold: true,
    lineId: true,
    noteId: true
},
spectral = {
    block: null,
    blockMoves: [
        {x: 0, y: 0, deg: 360, endDeg: 0, alpha: 0, endAlpha: 1, startT: 0, width: 3000, endWidth: 1500, endT: 800},
        {endY: 300, deg: 0, endDeg: -180, endX: 1200, endWidth: 1500, startT: 800, endT: 1600},
        {endY: 0, endDeg: -90, endX: 0, endWidth: 1500, startT: 1600, endT: 1800},
        {endY: 0, endDeg: 0, endX: 0, endWidth: 1500, startT: 1800, endT: 1850},
        {endDeg: 360, endAlpha: 0, startT: 1900, endWidth: 5000, endT: 2700}
    ],
    lines: [],
    lineMoves: [],
    notes: [],
    noteMoves: [
        {line: 0, note: 0, x: 0, y: 2000, endX: 0, endY: 'down', startT: 1200, endT: 1350},
        {line: 1, note: 1, x: -500, y: 2000, endX: 500, endY: 'down', startT: 1300, endT: 1450},
        {line: 0, note: 2, x: -500, y: 2000, endX: 500, endY: 'down', type: 'drag', startT: 1700, endT: 1800},
        {line: 1, note: 3, x: -500, y: 2000, endX: 500, endY: 'down', type: 'drag', startT: 1650, endT: 1750},
        {line: 0, note: 4, x: -500, y: 2000, endX: 500, endY: 'down', type: 'drag', startT: 1600, endT: 1700},
        {line: 3, note: 5, x: 0, y: 2000, endX: 0, endY: 'down', startT: 1200, endT: 1400},
        {line: 2, note: 6, x: 0, y: 2000, endX: 0, endY: 'down', startT: 1300, endT: 1450},
        {line: 2, note: 7, x: 0, y: 2000, endX: 0, endY: 'down', startT: 1600, endT: 1700},
    ],
},
audio, timeFocus = false;
function gaming() {
    function loadGame({music, bg = 'none', songName='?', author='unknown', tDfcy='EZ', dfcy='?'}) {
        audio = document.querySelector('#ui-time-audio');
        if (bg != 'none') {
            $('#bg').attr('src', '../' + bg);
            // $('#canvas').css('background-image', `url(../${bg})`);
        }
        // initCanvas
        if (settings.proportion == '16:9' || settings.proportion == undefined) {
            cvs.width = 4000;
            cvs.height = 2250;
            $('#canvas').css('max-width', $('body').height() / 9 * 16);
        } else {
            cvs.width = 3000;
            cvs.height = 2250;
            $('#canvas').css('max-width', $('body').height() / 4 * 3);
        }
        cvs = cvs.getContext('2d');
        cvs.transform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 1125);
        cvs.textAlign = 'center';
        cvs.textBaseline = 'bottom';
        cvs.font = '100px Phigros, Phigros cn, Tw Cen MT'
        cvs.save();
    }
    // init UI
    $('body>*').hide();
    $('#ui, #info, #bg, #blur').show();
    // init vars
    var cvs = document.getElementById('canvas');
    var lS = window.localStorage;
    var settings = JSON.parse(lS.settings);
    let time = -300, startTime = 0, lineColor = '#ffffff',
    imgs = {
        tap: new Image(),
        drag: new Image()
    }
    loadGame({music: 'audio/Happy Life.mp3', bg: 'img/icon/icon.jpg'});
    imgs.tap.src = 'img/ui/Tap2.png';
    imgs.drag.src = 'img/ui/drag.png';
    let gameLoad = false;
    audio.oncanplaythrough = () => {
        if (!gameLoad) {
            console.log('loaded');
            gameLoad = true;
            function distance(x, y, endX, endY){
                return Math.sqrt(Math.abs(x - endX) ** 2 + Math.abs(y - endY) ** 2);
            }
            function addLine(context, x, y, deg, width, alpha, notes) {
                $('#ui-display-lines>ul').append(`<li class="line canEdit" data-lineId="${spectral.lines.length}">line&nbsp;${spectral.lines.length}</li>`);
                spectral.lines.push(new line(context, x, y, deg, width, alpha));
            }
            function removeLine(from, to) {
                for (let i = from; i < to; i++) {  
                    $(`.line[data-lineId="${i}"]`).remove();
                }
                spectral.lines.remove(from, to);
            }
            function removeNote(from, to) {
                for (let i = from; i < to; i++) {  
                    $(`.note[data-noteId="${i}"]`).remove();
                }
                spectral.notes.remove(from, to);
            }
            function addNote(line, context, x, y, type, trueNote) {
                $('#ui-display-notes>ul').append(`<li class="note canEdit" data-noteId="${spectral.notes.length}">note&nbsp;${spectral.notes.length}</li>`);
                spectral.notes.push(new note(line, context, x, y, type, trueNote));
            }
            class line {
                constructor(context = cvs, x = 0, y = 0, deg = 0, width = 10000, alpha = 1) {
                    this.context = context;
                    this.x = x;
                    this.y = y;
                    this.deg = deg;
                    this.width = width;
                    this.alpha = alpha;
                }
                draw(id){
                    this.context.fillStyle = lineColor;
                    this.context.strokeColor = lineColor;
                    this.context.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + this.x, 1125 + this.y);
                    this.context.rotate(this.deg * Math.PI / 180);
                    this.context.globalAlpha = this.alpha;
                    this.context.fillRect(0 - this.width / 2, -4, this.width, 8);
                    if (display.lineId) {
                        this.context.fillText(String(id), 0, 0);
                        this.context.fill();
                    }
                    this.context.restore();
                }
                move({x = this.x, y = this.y, deg = this.deg, width = this.width, alpha = this.alpha, endX = 0, endY = 0, endDeg = 0, endWidth = 10000, endAlpha = 1, startT, endT} = {}) {
                    // console.log(x, y, deg, width, endX, endY, endDeg, endWidth, startT, endT);
                    if (time >= startT && time <= endT) {
                        let vx = (endX - x) / (endT - startT);
                        let vy = (endY - y) / (endT - startT);
                        let vdeg = (endDeg - deg) / (endT - startT);
                        let vwidth = (endWidth - width) / (endT - startT);
                        let valpha = (endAlpha - alpha) / (endT - startT);
                        this.x = x + (time - startT) * vx;
                        this.y = y + (time - startT) * vy;
                        this.deg = deg + (time - startT) * vdeg;
                        this.width = width + (time - startT) * vwidth;
                        this.alpha = alpha + (time - startT) * valpha;
                    }
                    if (time > endT) {
                        this.x = endX;
                        this.y = endY;
                        this.deg = endDeg;
                        this.width = endWidth;
                        this.alpha = endAlpha;
                        return true;
                    }
                    return false;
                }
            }
            class note {
                constructor(line = 0, context = cvs, x = 0, y = 5000, type = 'tap', trueNote = false) {
                    this.line = line;
                    this.context = context;
                    this.x = x;
                    this.y = y;
                    this.type = type;
                    this.over = false;
                }
                draw(id) {
                    let noteImg;
                    if (!this.over && display[this.type]) {
                        if (spectral.lines[this.line] === undefined) {
                            addLine();
                        }
                        switch(this.type) {
                            case 'tap':
                                noteImg = imgs.tap;
                                break;
                            case 'drag':
                                noteImg = imgs.drag;
                                break;
                        }
                        this.context.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + spectral.lines[this.line].x, 1125 + spectral.lines[this.line].y);
                        this.context.rotate(spectral.lines[this.line].deg * Math.PI / 180);
                        this.context.globalAlpha = 1;
                        this.context.drawImage(noteImg, this.x - 150, 0 - (this.y + 12.5), 300, 25);
                        if (display.noteId) {
                            this.context.globalAlpha = 1;
                            this.context.fillText(id, this.x, 0 - (this.y + 12.5));
                        }
                        this.context.restore();
                    }
                }
                move({line, x = this.x, y = this.y, endX = 0, endY = 0, startT, endT, type = 'tap'} = {}) {
                    // console.log(x, y, deg, width, endX, endY, endDeg, endWidth, startT, endT);
                    let deleteNote = false;
                    if (endY == 'down') {
                        endY = 0;
                        deleteNote = true;
                    }
                    if (line !== undefined) {
                        this.line = line;
                    }
                    switch(type) {
                        case 'tap':
                            this.type = 'tap';
                            break;
                        case 'drag':
                            this.type = 'drag';
                            break;
                    }
                    if (time < endT ) {
                        this.x = x;
                        this.y = y;
                        this.over = false;
                    }
                    if (time >= startT && time <= endT) {
                        let vx = (endX - x) / (endT - startT);
                        let vy = (endY - y) / (endT - startT);
                        this.x = x + (time - startT) * vx;
                        this.y = y + (time - startT) * vy;
                    }
                    if (time > endT || time < startT) {
                        this.x = endX;
                        this.y = endY;
                        if (deleteNote) {
                            this.over = true;
                        }
                        return true;
                    }
                    return false;
                }
            }
            class block {
                constructor(context = cvs, x = 0, y = 0, deg = 0, width = 1500, alpha = 1) {
                    this.context = context;
                    this.x = x;
                    this.y = y;
                    this.deg = deg;
                    this.width = width;
                    this.alpha = alpha;
                }
                transformBlock() {
                    for (let i = 0; i < 4; i++) {
                        spectral.lines[i].width = this.width;
                        spectral.lines[i].alpha = this.alpha;
                    }
                    spectral.lines[0].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * this.deg);
                    spectral.lines[0].y = this.y - this.width / 2 * Math.cos(Math.PI / 180 * (0 - this.deg));
                    spectral.lines[0].deg = this.deg + 180;
                    spectral.lines[1].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (this.deg - 90));
                    spectral.lines[1].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * (this.deg + 90));
                    spectral.lines[1].deg = this.deg + 90;
                    spectral.lines[2].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (0 - this.deg));
                    spectral.lines[2].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * this.deg);
                    spectral.lines[2].deg = this.deg;
                    spectral.lines[3].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (this.deg + 90));
                    spectral.lines[3].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * (this.deg - 90));
                    spectral.lines[3].deg = this.deg - 90;
                }
                move({x = this.x, y = this.y, deg = this.deg, width = this.width, alpha = this.alpha, endX = 0, endY = 0, endDeg = 0, endWidth = 10000, endAlpha = 1, startT, endT} = {}) {
                    // console.log(x, y, deg, width, endX, endY, endDeg, endWidth, startT, endT);
                    if (time >= startT && time <= endT) {
                        let vx = (endX - x) / (endT - startT);
                        let vy = (endY - y) / (endT - startT);
                        let vdeg = (endDeg - deg) / (endT - startT);
                        let vwidth = (endWidth - width) / (endT - startT);
                        let valpha = (endAlpha - alpha) / (endT - startT);
                        this.x = x + (time - startT) * vx;
                        this.y = y + (time - startT) * vy;
                        this.deg = deg + (time - startT) * vdeg;
                        this.width = width + (time - startT) * vwidth;
                        this.alpha = alpha + (time - startT) * valpha;

                    }
                    if (time > endT) {
                        this.x = endX;
                        this.y = endY;
                        this.deg = endDeg;
                        this.width = endWidth;
                        this.alpha = endAlpha;
                    }
                    this.transformBlock();
                }
            }
            class gameBoard {
                constructor() {
                    this.init();
                    this.process();
                }
                init() {
                    addNote(0, cvs, 0, 5000, 'tap', true);
                    for (let i = 0; i < 4; i++) {
                        addLine();
                    }
                    spectral.block = new block(cvs)
                }
                removeAll() {
                    removeLine(4, spectral.lines.length);
                    removeNote(0, spectral.notes.length);
                }
                // 动画循环（帧率）
                process(now){
                    //init time
                    if(!startTime){
                        startTime = now;
                    }
                    let seconds = (now - startTime) / 1000;
                    startTime = now;
                    if (seconds) {
                        time = audio.currentTime * 100;
                        if (!timeFocus) {
                            document.getElementById('ui-time-time').value = Math.floor(time);
                        }
                    }
                    cvs.clearRect(-10000, -10000, 20000, 20000);
                    for (let i = 0; i < spectral.blockMoves.length; i++) {
                        spectral.block.move({x: spectral.blockMoves[i].x, y: spectral.blockMoves[i].y, deg: spectral.blockMoves[i].deg, width: spectral.blockMoves[i].width, alpha: spectral.blockMoves[i].alpha, endX: spectral.blockMoves[i].endX, endY: spectral.blockMoves[i].endY, endDeg: spectral.blockMoves[i].endDeg, endWidth: spectral.blockMoves[i].endWidth, endAlpha: spectral.blockMoves[i].endAlpha, startT: spectral.blockMoves[i].startT, endT: spectral.blockMoves[i].endT});
                    }
                    for (let i = 0; i < spectral.lineMoves.length; i++) {
                        while (!spectral.lines[spectral.lineMoves[i].line]) {
                            addLine();
                        }
                        spectral.lines[spectral.lineMoves[i].line].move({x: spectral.lineMoves[i].x, y: spectral.lineMoves[i].y, deg: spectral.lineMoves[i].deg, width: spectral.lineMoves[i].width, alpha: spectral.lineMoves[i].alpha, endX: spectral.lineMoves[i].endX, endY: spectral.lineMoves[i].endY, endDeg: spectral.lineMoves[i].endDeg, endWidth: spectral.lineMoves[i].endWidth, endAlpha: spectral.lineMoves[i].endAlpha, startT: spectral.lineMoves[i].startT, endT: spectral.lineMoves[i].endT});
                    }
                    for (let i = 0; i < spectral.noteMoves.length; i++) {
                        while (!spectral.notes[spectral.noteMoves[i].note]) {
                            addNote(spectral.noteMoves[i].line, undefined, undefined, undefined, spectral.noteMoves[i].type);
                        }
                        spectral.notes[spectral.noteMoves[i].note].move({line: spectral.noteMoves[i].line, x: spectral.noteMoves[i].x, y: spectral.noteMoves[i].y, endX: spectral.noteMoves[i].endX, endY: spectral.noteMoves[i].endY, startT: spectral.noteMoves[i].startT, endT: spectral.noteMoves[i].endT, type: spectral.noteMoves[i].type});
                    }
                    for(var i = 0; i < 4;i++) {
                        if (display.block[i]) {
                            spectral.lines[i].draw(i);
                        }
                    }
                    for(var i = 4; i < spectral.lines.length; i++) {
                        spectral.lines[i].draw(i);
                    }
                    for(var i = 0; i < spectral.notes.length; i++) {
                        if (display.block[spectral.notes[i].line] || spectral.notes[i].line > 3) {
                            spectral.notes[i].draw(i);
                        }
                    }
                    // console.log('canvas refresh', now, startTime, seconds);
                    // 动画循环（帧率）
                    var gameLoop = window.requestAnimationFrame(this.process.bind(this));
                }
            }
            new gameBoard();
        }
    };
}
$(() => {
    gaming();
});