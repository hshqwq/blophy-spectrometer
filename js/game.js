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
    eTap: true,
    drag: true,
    hold: true,
    lineId: true,
    noteId: true,
    pointId: true,
    textId: true,
    miss: false
},
timeFocus = false, gl = false, editLine = undefined, offset = 0, cvs = document.getElementById('canvas');;

function lineEdit(id = 0) {
    gl = true;
    editLine = id;
    info('已进入隔离模式', 'info');
}

function cancelLineEdit() {
    edit.open = false;
    gl = false;
    editLine = undefined;
}

function addAnimation(type, value){
    switch (type) {
        case 'line':
            spectral.lineMoves.push(value);
            break;
        case 'note':
            spectral.noteMoves.push(value);
            break;
        case 'block':
            spectral.blockMoves.push(value);
            break;
        case 'point':
            spectral.pointMoves.push(value);
            break;
        case 'text':
            spectral.textMoves.push(value);
            break;
    }
}

function gaming() {
    // init vars
    var lS = window.localStorage;
    let mouseX, mouseY;
    if (!lS.settings) {
        lS['settings'] = `{"pmyc":0,"buttonSize":100,"OFBlur": true,"bgBlur":100,"OFAudio":true,"gameAudio":100,"uiAudio":100,"touchAudio":100,"OFDyfz":true,"OFFcApzsq":true,"OFEffect":true,"OFAutoPlay":false,"listProportion":"16:9"}`;
    }
    var settings = JSON.parse(lS.settings);
    let time = -300, lastTime = 0, lineColor = '#ffffff',
    imgs = {
        tap: new Image(),
        drag: new Image(),
        hold: new Image(),
        eTap: new Image()
    }
    if (!uploadSpectral) {
        // spectral = {
        //     info: {title: 'unknown', author: 'unknown', chartAuthor: 'unknown', diffcultly: {type: 'UK', level: '.?'},},    
        //     block: null,blockMoves: [{x: 0, y: 0, eulerAngle: 0, endEulerAngle: 0, color: {r: 255, g: 255, b: 255}, endColor: {r: 255, g: 255, b: 255}, alpha: 0, endAlpha: 1, bezier: {x1: 0.75, y1: 1, x2: 0.75, y2: 1}, width: 15, endWidth: 15, startTime: 0, endTime: 0},],lines: [],lineMoves: [],notes: [],noteMoves: [],graphics: [],pointMoves: [],texts: [],textMoves: []}
        spectral = {
            info: {title: 'unknown', author: 'unknown', chartAuthor: 'unknown', diffcultly: {type: 'UK', level: '.?'},},    
            blocks: [],
            blockMoves: [
                {block: 0, x: 0, y: 0, eulerAngle: 360, endEulerAngle: 0, color: {r: 255, g: 0, b: 255}, endColor: {r: 0, g: 255, b: 0}, alpha: 0, endAlpha: 1, bezier: {x1: 0.75, y1: 1, x2: 0.75, y2: 1}, startTime: 0, width: 30, endWidth: 15, endTime: 800},
                {block: 0, endY: 3, eulerAngle: 0, endEulerAngle: -180, endX: 12, endWidth: 15, startTime: 800, endTime: 1600},
                {block: 0, endY: 0, endEulerAngle: -90, endX: 0, endWidth: 15, startTime: 1600, endTime: 1800},
                {block: 0, endY: 0, endEulerAngle: 0, endX: 0, endWidth: 15, startTime: 1800, endTime: 1850},
                {block: 0, endColor: {r: 255, g: 255, b: 0}, startTime: 1850, endTime: 1850},
                {block: 0, endEulerAngle: 360, endAlpha: 0, startTime: 1900, endWidth: 50, endTime: 2700},
                {block: 1, x: 0, y: 0, eulerAngle: 360, endEulerAngle: 0, color: {r: 255, g: 0, b: 255}, endColor: {r: 0, g: 255, b: 0}, alpha: 0, endAlpha: 1, bezier: {x1: 0.75, y1: 1, x2: 0.75, y2: 1}, startTime: 50, width: 30, endWidth: 15, endTime: 850},
                // {x: 0, y: 0, eulerAngle: 0, endEulerAngle: 0, color: {r: 255, g: 255, b: 255}, endColor: {r: 255, g: 255, b: 255}, alpha: 0, endAlpha: 1, bezier: {x1: 0.75, y1: 1, x2: 0.75, y2: 1}, width: 15, endWidth: 15, startTime: 0, endTime: 0}
            ],
            lines: [],
            lineMoves: [
                {line: 4, y: -6, endY: 6, bezier: {x1: 0, y1: 0, x2: 0, y2: 1}, startTime: 0, endTime: 500},
                {line: 4, color: {r: 255, g: 0, b: 0}, endColor: {r: 0, g: 255, b: 255}, bezier: {x1: 1, y1: 0, x2: 0, y2: 1}, startTime: 0, endTime: 500}
            ],
            notes: [],
            noteMoves: [
                {line: 0, note: 0, x: 0, y: 20, endX: 0, endY: 5, startTime: 1200, endTime: 1350},
                {line: 1, note: 1, x: -5, y: 20, endX: 5, endY: 'down', startTime: 1300, endTime: 1450},
                {line: 0, note: 2, x: -5, y: 20, endX: 5, endY: 'down', type: 'drag', startTime: 1700, endTime: 1800},
                {line: 1, note: 3, x: -5, y: 20, endX: 5, endY: 'down', type: 'hold', height: 150, endHeight: 100, startTime: 1650, endTime: 1750},
                {line: 0, note: 4, x: -5, y: 20, endX: 5, endY: 'down', type: 'eTap', startTime: 1600, endTime: 1700},
                {line: 3, note: 5, x: 0, y: 20, endX: 0, endY: 'down', startTime: 1200, endTime: 1400},
                {line: 2, note: 6, x: 0, y: 20, endX: 0, endY: 'down', startTime: 1300, endTime: 1450},
                {line: 2, note: 7, x: 0, y: 20, endX: 0, endY: 'down', startTime: 1600, endTime: 1700},
                {line: 4, note: 8, x: 0, y: 20, endX: 0, endY: 'down',bezier: {x1: 0, y1: 0, x2: 0, y2: 0.5} , startTime: 800, endTime: 1000},
                {line: 4, note: 9, x: 0, y: 0, endX: -15, endY: 0, startTime: 0, endTime: 100},
            ],
            graphics: [],
            pointMoves: [
                {graph: 0, point: 0, x: 0, endX: 10, startTime: 0, endTime: 600},
                {graph: 0, point: 1, x: 0, endX: -10, startTime: 0, endTime: 600},
                {graph: 0, point: 2, y: 0, endY: -10, bezier: {x1: 0.5, y1: 0.2, x2: 0, y2: 1.3}, startTime: 0, endTime: 600},
                {graph: 0, point: 3, y: 0, endY: 10, bezier: {x1: 0.5, y1: 0.2, x2: 0, y2: 1.3}, startTime: 600, endTime: 800},
                {graph: 0, point: 3, color: {r: 255, g: 255, b: 255}, endColor: {r: 60, g: 50, b: 100}, startTime: 600, endTime: 800},
                {graph: 1, point: 0, y: 0, endY: -6, x: 0, endX: 4, bezier: {x1: 0.5, y1: 0.2, x2: 0, y2: 1.3}, startTime: 0, endTime: 600},
                {graph: 1, point: 1, y: 0, endY: 3, bezier: {x1: 0, y1: 0.2, x2: 0, y2: 1.3}, startTime: 0, endTime: 600},
                {graph: 1, point: 2, y: 0, endY: 3, bezier: {x1: 0, y1: 0.2, x2: 0, y2: 1.3}, startTime: 0, endTime: 600},
                {graph: 1, point: 3, x: 0, endX: -6, y: 0, endY: 4, color: {r: 255, g: 255, b: 255}, endColor: {r: 60, g: 200, b: 250}, close: false, startTime: 0, endTime: 600},
                {graph: 1, point: 2, endY: -1, bezier: {x1: 0, y1: 0, x2: 0.5, y2: 0.75}, startTime: 500, endTime: 1000},
            ],
            texts: [],
            textMoves: [
                {textId: 0, alpha: 0, endAlpha: 1, text: 'Hello World!', font: '42px Phigros, Phigros cn, Tw Cen MT', startTime: 0, endTime: 200},
                {textId: 0, x: 0, endX: -12, eulerAngle: 0, endEulerAngle: 25, color: {r: 255, g: 255, b: 255}, endColor: {r: 255, g: 200, b: 200}, text: 'Hello World', font: '90px Phigros, Phigros cn, Tw Cen MT', bezier: {x1: 0, y1: 0, x2: 0.5, y2: 0.75}, startTime: 200, endTime: 400}
            ]
        }
    } else {
        offset = settings.pmyc = uploadSpectral.offset;
        lS.settings = JSON.stringify(settings);
        spectral = {blocks: [], blockMoves: [], lines: [], lineMoves: [], notes: [], noteMoves: [], graphics: [], pointMoves: [], texts: [], textMoves: []};
        spectral.blockMoves = uploadSpectral.spectral.blocks;
        spectral.lineMoves = uploadSpectral.spectral.line
        spectral.noteMoves = uploadSpectral.spectral.note;
        spectral.pointMoves = uploadSpectral.spectral.point;
        spectral.textMoves = uploadSpectral.spectral.text;
    }
    function loadGame({music, bg = 'none', songName='?', author='unknown', tDfcy='EZ', dfcy='?'}) {
        audio = document.querySelector('#ui-time-audio');
        if (bg != 'none') {
            $('#bg').attr('src', '../' + bg);
            // $('#canvas').css('background-image', `url(../${bg})`);
        }
        // init offset
        if (settings.pmyc) {
            offset = settings.pmyc;
        }
        // init canvas
        cvs.width = 1920;
        cvs.height = 1080;
        if (settings.listProportion == '16:9' || settings.proportion == undefined) {
            $('#canvas').css('width', $('body').height() * 0.9 / 9 * 16);
        } else {
            $('#canvas').css('width', $('body').height() * 0.9 / 3 * 4);
        }
        ctx = cvs.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 540);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '42px Phigros, Phigros cn, Tw Cen MT';
        ctx.save();
    }
    // init UI
    $('body>*').hide();
    $('#ui, #info, #bg, #blur, #infoList').show();
    loadGame({music: 'audio/Happy Life.mp3', bg: 'img/icon/icon.jpg'});
    imgs.tap.src = 'img/ui/tap.png';
    imgs.drag.src = 'img/ui/drag.png';
    imgs.hold.src = 'img/ui/hold.png';
    imgs.eTap.src = 'img/ui/eTap.png';
    let gameLoad = false;
    document.body.onresize = () => {
        if (settings.listProportion == '16:9' || settings.listProportion == undefined) {
            $('#canvas').css('width', $('body').height() * 0.8 / 9 * 16);
        } else {
            $('#canvas').css('width', $('body').height() * 0.8 / 3 * 4);
        }
    };
    window.onstorage = () => {
        settings = JSON.parse(lS.settings);
        if (settings.listProportion == '16:9' || settings.listProportion == undefined) {
            $('#canvas').css('width', $('body').height() * 0.8 / 9 * 16);
        } else {
            $('#canvas').css('width', $('body').height() * 0.8 / 3 * 4);
        }
        if (settings.pmyc) {
            offset = settings.pmyc;
        }
        info('设置已更新', 'info');
    };
    audio.oncanplaythrough = () => {
        if (!gameLoad) {
            gameLoad = true;
            function distance(x, y, endX, endY){
                return Math.sqrt(Math.abs(x - endX) ** 2 + Math.abs(y - endY) ** 2);
            }
            function addLine(x, y, eulerAngle, width, alpha, color) {
                $('#ui-display-lines>ul').append(`<li class="line canEdit" data-lineId="${spectral.lines.length}">line&nbsp;${spectral.lines.length}</li>`);
                spectral.lines.push(new line(x, y, eulerAngle, width, alpha, color));
            }
            function addText(x, y, eulerAngle, _text, alpha, color) {
                // $('#ui-display-lines>ul').append(`<li class="line canEdit" data-lineId="${spectral.lines.length}">line&nbsp;${spectral.lines.length}</li>`);
                spectral.texts.push(new text(x, y, eulerAngle, _text, alpha, color));
            }
            function addgraph() {
                spectral.graphics.push([]);
            }
            function addPoint(graph = 0, x, y, alpha, color, close) {
                while(!spectral.graphics[graph]) {
                    addgraph();
                }
                spectral.graphics[graph].push(new point(graph, x, y, alpha, color, close));
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
            function addNote(line, x, y, type, trueNote, height) {
                $('#ui-display-notes>ul').append(`<li class="note canEdit" data-noteId="${spectral.notes.length}">note&nbsp;${spectral.notes.length}</li>`);
                spectral.notes.push(new note(line, x, y, type, trueNote, height));
            }
            function addBlock(x, y, eulerAngle, width, alpha, color) {
                for (let i = 0;i < 4;i++){
                    addLine();
                }
                spectral.blocks.push(new block(spectral.lines.length - 4, x, y, eulerAngle, width, alpha, color));
            }
            class line {
                constructor(x = 0, y = 0, eulerAngle = 0, width = 800, alpha = 1, color = {r: 255, g: 255, b: 255}) {
                    this.x = x;
                    this.y = y;
                    this.eulerAngle = eulerAngle;
                    this.width = width;
                    this.alpha = alpha;
                    this.color = color;
                }
                draw(id){
                    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                    ctx.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                    if (gl) {
                        ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 3256);
                    } else {
                        ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + this.x * 42, 540 + this.y * 42);
                        ctx.rotate(this.eulerAngle * Math.PI / 180);
                        ctx.globalAlpha = this.alpha;
                    }
                    ctx.fillRect(0 - this.width * 21, -2, this.width * 42, 4);
                    if (display.lineId) {
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.font = '42px Phigros, Phigros cn, Tw Cen MT';
                        ctx.globalAlpha = 1;
                        ctx.fillText(String(id), 0, 0);
                    }
                    ctx.restore();
                }
                move({x = this.x, y = this.y, eulerAngle = this.eulerAngle, width = this.width, alpha = this.alpha, color = this.color, endX = this.x, endY = this.y, endEulerAngle = this.eulerAngle, endWidth = this.width, endAlpha = this.alpha, endColor = this.color, bezier = false, startTime, endTime} = {}) {
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.eulerAngle = eulerAngle;
                        this.width = width;
                        this.alpha = alpha;
                        this.color.r = color.r;
                        this.color.g = color.g;
                        this.color.b = color.b;
                    }
                    if (time >= startTime && time <= endTime) {
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (eulerAngle != endEulerAngle) {
                                let veulerAngle = (endEulerAngle - eulerAngle) / (endTime - startTime);
                                this.eulerAngle = eulerAngle + (time - startTime) * veulerAngle;
                            }
                            if (width != endWidth) {
                                let vwidth = (endWidth - width) / (endTime - startTime);
                                this.width = width + (time - startTime) * vwidth;
                            }
                            if (alpha != endAlpha) {
                                let valpha = (endAlpha - alpha) / (endTime - startTime);
                                this.alpha = alpha + (time - startTime) * valpha;
                            }
                            if (color.r != endColor.r) {
                                let vcolorR = (endColor.r - color.r) / (endTime - startTime);
                                this.color.r = color.r + (time - startTime) * vcolorR;
                            }
                            if (color.g != endColor.g) {
                                let vcolorG = (endColor.g - color.g) / (endTime - startTime);
                                this.color.g = color.g + (time - startTime) * vcolorG;
                            }
                            if (color.b != endColor.b) {
                                let vcolorB = (endColor.b - color.b) / (endTime - startTime);
                                this.color.b = color.b + (time - startTime) * vcolorB;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (eulerAngle != endEulerAngle) {
                                this.eulerAngle = eulerAngle + (endEulerAngle - eulerAngle) * BEZIER;
                            }
                            if (width != endWidth) {
                                this.width = width + (endWidth - width) * BEZIER;
                            }
                            if (alpha != endAlpha) {
                                this.alpha = alpha + (endAlpha - alpha) * BEZIER;
                            }
                            if (color.r != endColor.r) {
                                this.color.r = color.r + (endColor.r - color.r) * BEZIER;
                            }
                            if (color.g != endColor.g) {
                                this.color.g = color.g + (endColor.g - color.g) * BEZIER;
                            }
                            if (color.b != endColor.b) {
                                this.color.b = color.b + (endColor.b - color.b) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        this.eulerAngle = endEulerAngle;
                        this.width = endWidth;
                        this.alpha = endAlpha;
                        this.color.r = endColor.r;
                        this.color.g = endColor.g;
                        this.color.b = endColor.b;
                        return true;
                    }
                    return false;
                }
            }
            class note {
                constructor(line = 0, x = 0, y = 1100, type = 'tap', trueNote = false, height = 3) {
                    this.line = line;
                    this.x = x;
                    this.y = y;
                    this.type = type;
                    this.over = false;
                    this.height = height;
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
                            case 'hold':
                                noteImg = imgs.hold;
                                break;
                            case 'eTap':
                                noteImg = imgs.eTap;
                                break;
                        }
                        if (gl) {
                            if (this.line == editLine) {
                                ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 3258);
                                ctx.globalAlpha = 1;
                                if (this.type == 'hold') {
                                    ctx.drawImage(noteImg, this.x * 42 - 84, 0 - (this.y * 42 + this.height * 42 - 42), 168, this.height * 42);
                                } else {
                                    ctx.drawImage(noteImg, this.x * 42 - 84, 0 - (this.y * 42 + 95 - 42), 168, 42);
                                }
                                if (display.noteId) {
                                    ctx.globalAlpha = 1;
                                    ctx.fillText(id, this.x * 42, 0 - (this.y * 42 + 42));
                                }
                                ctx.restore();
                            }
                        } else {
                            ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + spectral.lines[this.line].x * 42, 540 + spectral.lines[this.line].y * 42);
                            ctx.rotate(spectral.lines[this.line].eulerAngle * Math.PI / 180);
                            ctx.globalAlpha = 1;
                            if (this.type == 'hold') {
                                ctx.drawImage(noteImg, this.x * 42 - 84, 0 - (this.y * 42 + this.height * 42), 168, this.height * 42);
                            } else {
                                ctx.drawImage(noteImg, this.x * 42 - 84, 0 - (this.y * 42 + 40), 168, 42);
                            }
                            if (display.noteId) {
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'bottom';
                                ctx.font = '42px Phigros, Phigros cn, Tw Cen MT';
                                ctx.globalAlpha = 1;
                                ctx.fillStyle = '#ffffff';
                                ctx.fillText(id, this.x * 42, 0 - (this.y * 42 + 25));
                            }
                            ctx.restore();
                        }
                    }
                }
                move({line, x = this.x, y = this.y, endX = this.x, endY = this.y, bezier=false, startTime, endTime, type = 'tap', height = this.height, endHeight = this.height} = {}) {
                    let deleteNote = false;
                    switch(type) {
                        case 'tap':
                            this.type = 'tap';
                            break;
                        case 'drag':
                            this.type = 'drag';
                            break;
                        case 'hold':
                            this.type = 'hold';
                            break;
                        case 'eTap':
                            this.type = 'eTap';
                            break;
                    }
                    if (endY == 'down') {
                        if (time <= endTime) {
                            endY = 0;
                        } else if ((this.y > -1.5 || (this.type == 'hold' && this.y > 0 - (endHeight) - 1.5)) && (display.miss || this.type == 'hold')) {
                            let vy =  Math.abs((0 - y) / (endTime - startTime));
                            y = 0;
                            x = endX;
                            startTime = endTime;
                            if (this.type == 'hold') {
                                height = endHeight;
                                endY = 0 - (height) - 1.5;
                            } else {
                                endY = -1.5;
                            }
                            endTime += Math.abs(endY) / vy;
                            bezier = false;
                        }
                        deleteNote = true;
                    }
                    if (line !== undefined) {
                        this.line = line;
                    }
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.over = false;
                    }
                    if (time < startTime) {
                        this.over = true;
                    }
                    if (time >= startTime && time <= endTime) {
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (this.type == 'hold' && height != endHeight) {
                                let vheight =  (endHeight - height) / (endTime - startTime);
                                this.height = height + (time - startTime) * vheight;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (this.type == 'hold' && height != endHeight) {
                                this.height = height + (endHeight - height) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        if (deleteNote) {
                            this.over = true;
                        }
                    }
                    return false;
                }
            }
            class block {
                constructor(start = 0, x = 0, y = 0, eulerAngle = 0, width = 1500, alpha = 1, color = {r: 255, g: 255, b: 255}) {
                    this.start = start;
                    this.x = x;
                    this.y = y;
                    this.eulerAngle = eulerAngle;
                    this.width = width;
                    this.alpha = alpha;
                    this.color = color;
                }
                transformBlock(start=0) {
                    for (let i = 0; i < 4; i++) {
                        spectral.lines[i + start].width = this.width;
                        spectral.lines[i + start].alpha = this.alpha;
                        spectral.lines[i + start].color = this.color;
                    }
                    spectral.lines[0 + start].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * this.eulerAngle);
                    spectral.lines[0 + start].y = this.y - this.width / 2 * Math.cos(Math.PI / 180 * (0 - this.eulerAngle));
                    spectral.lines[0 + start].eulerAngle = this.eulerAngle + 180;
                    spectral.lines[1 + start].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (this.eulerAngle - 90));
                    spectral.lines[1 + start].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * (this.eulerAngle + 90));
                    spectral.lines[1 + start].eulerAngle = this.eulerAngle + 90;
                    spectral.lines[2 + start].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (0 - this.eulerAngle));
                    spectral.lines[2 + start].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * this.eulerAngle);
                    spectral.lines[2 + start].eulerAngle = this.eulerAngle;
                    spectral.lines[3 + start].x = this.x + this.width / 2 * Math.sin(Math.PI / 180 * (this.eulerAngle + 90));
                    spectral.lines[3 + start].y = this.y + this.width / 2 * Math.cos(Math.PI / 180 * (this.eulerAngle - 90));
                    spectral.lines[3 + start].eulerAngle = this.eulerAngle - 90;
                }
                move({x = this.x, y = this.y, eulerAngle = this.eulerAngle, width = this.width, alpha = this.alpha, color = this.color, endX = this.x, endY = this.y, endEulerAngle = this.eulerAngle, endWidth = this.width, endAlpha = this.alpha, endColor = this.color, bezier=false, startTime, endTime} = {}) {
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.width = width;
                        this.alpha = alpha;
                        this.color.r = color.r;
                        this.color.g = color.g;
                        this.color.b = color.b;
                    }
                    if (time >= startTime && time <= endTime) {
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (eulerAngle != endEulerAngle) {
                                let veulerAngle = (endEulerAngle - eulerAngle) / (endTime - startTime);
                                this.eulerAngle = eulerAngle + (time - startTime) * veulerAngle;
                            }
                            if (width != endWidth) {
                                let vwidth = (endWidth - width) / (endTime - startTime);
                                this.width = width + (time - startTime) * vwidth;
                            }
                            if (alpha != endAlpha) {
                                let valpha = (endAlpha - alpha) / (endTime - startTime);
                                this.alpha = alpha + (time - startTime) * valpha;
                            }
                            if (color.r != endColor.r) {
                                console.log(this.color.r, color.r, endColor.r);
                                let vcolorR = (endColor.r - color.r) / (endTime - startTime);
                                this.color.r = color.r + (time - startTime) * vcolorR;
                            }
                            if (color.g != endColor.g) {
                                let vcolorG = (endColor.g - color.g) / (endTime - startTime);
                                this.color.g = color.g + (time - startTime) * vcolorG;
                            }
                            if (color.b != endColor.b) {
                                let vcolorB = (endColor.b - color.b) / (endTime - startTime);
                                this.color.b = color.b + (time - startTime) * vcolorB;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (eulerAngle != endEulerAngle) {
                                this.eulerAngle = eulerAngle + (endEulerAngle - eulerAngle) * BEZIER;
                            }
                            if (width != endWidth) {
                                this.width = width + (endWidth - width) * BEZIER;
                            }
                            if (alpha != endAlpha) {
                                this.alpha = alpha + (endAlpha - alpha) * BEZIER;
                            }
                            if (color.r != endColor.r) {
                                this.color.r = color.r + (endColor.r - color.r) * BEZIER;
                            }
                            if (color.g != endColor.g) {
                                this.color.g = color.g + (endColor.g - color.g) * BEZIER;
                            }
                            if (color.b != endColor.b) {
                                this.color.b = color.b + (endColor.b - color.b) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        this.eulerAngle = endEulerAngle;
                        this.width = endWidth;
                        this.alpha = endAlpha;
                        this.color.r = endColor.r;
                        this.color.g = endColor.g;
                        this.color.b = endColor.b;
                    }
                    this.transformBlock(this.start);
                }
            }
            class point {
                constructor(graph = 0 ,x = 0, y = 0, alpha = 1, color = {r: 255, g: 255, b: 255}, close = true) {
                    this.graph = graph;
                    this.x = x;
                    this.y = y;
                    this.alpha = alpha;
                    this.color = color;
                    this.close = close;
                }
                draw(id){
                    ctx.lineWidth = 4;
                    ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 540);
                    ctx.globalAlpha = this.alpha;
                    ctx.lineTo(this.x * 42, this.y * 42);
                    if (display.pointId) {
                        ctx.globalAlpha = 1;
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(String(id), this.x * 42, this.y * 42 + 42);
                    }
                    ctx.restore();
                }
                move({x = this.x, y = this.y, alpha = this.alpha, color = this.color, endX = this.x, endY = this.y, endAlpha = this.alpha, endColor = this.color, bezier = false, close = true, startTime, endTime} = {}) {
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.alpha = alpha;
                        this.color.r = color.r;
                        this.color.g = color.g;
                        this.color.b = color.b;
                    }
                    if (time >= startTime && time <= endTime) {
                        this.close = close;
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (alpha != endAlpha) {
                                let valpha = (endAlpha - alpha) / (endTime - startTime);
                                this.alpha = alpha + (time - startTime) * valpha;
                            }
                            if (color.r != endColor.r) {
                                let vcolorR = (endColor.r - color.r) / (endTime - startTime);
                                this.color.r = color.r + (time - startTime) * vcolorR;
                            }
                            if (color.g != endColor.g) {
                                let vcolorG = (endColor.g - color.g) / (endTime - startTime);
                                this.color.g = color.g + (time - startTime) * vcolorG;
                            }
                            if (color.b != endColor.b) {
                                let vcolorB = (endColor.b - color.b) / (endTime - startTime);
                                this.color.b = color.b + (time - startTime) * vcolorB;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (alpha != endAlpha) {
                                this.alpha = alpha + (endAlpha - alpha) * BEZIER;
                            }
                            if (color.r != endColor.r) {
                                this.color.r = color.r + (endColor.r - color.r) * BEZIER;
                            }
                            if (color.g != endColor.g) {
                                this.color.g = color.g + (endColor.g - color.g) * BEZIER;
                            }
                            if (color.b != endColor.b) {
                                this.color.b = color.b + (endColor.b - color.b) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        this.alpha = endAlpha;
                        this.close = close;
                        this.color.r = endColor.r;
                        this.color.g = endColor.g;
                        this.color.b = endColor.b;
                        return true;
                    }
                    return false;
                }
            }
            class text{
                constructor(x = 0, y = 0, eulerAngle = 0, text = '', font = '42px Phigros, Phigros cn, Tw Cen MT', alpha = 1, color = {r: 255, g: 255, b: 255}) {
                    this.x = x;
                    this.y = y;
                    this.eulerAngle = eulerAngle;
                    this.text = text;
                    this.font = font;
                    this.alpha = alpha;
                    this.color = color;
                }
                draw(id){
                    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                    ctx.strokeStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
                    ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2 + this.x * 42, 540 + this.y * 42);
                    ctx.rotate(this.eulerAngle * Math.PI / 180);
                    ctx.globalAlpha = this.alpha;
                    ctx.font = this.font;
                    ctx.fillText(this.text, 0, 0);
                    ctx.font = '42px Phigros, Phigros cn, Tw Cen MT';
                    if (display.textId) {
                        ctx.globalAlpha = 1;
                        ctx.fillText(String(id), 0, 42);
                    }
                    ctx.restore();
                }
                move({x = this.x, y = this.y, eulerAngle = this.eulerAngle, text = this.text, font = this.font, alpha = this.alpha, color = this.color, endX = this.x, endY = this.y, endEulerAngle = this.eulerAngle, endAlpha = this.alpha, endColor = this.color, bezier = false, startTime, endTime} = {}) {
                    if (time <= endTime) {
                        this.x = x;
                        this.y = y;
                        this.eulerAngle = eulerAngle;
                        this.alpha = alpha;
                        this.color.r = color.r;
                        this.color.g = color.g;
                        this.color.b = color.b;
                    }
                    if (time >= startTime && time <= endTime) {
                        this.text = text;
                        this.font = font;
                        if (!bezier) {
                            if (x != endX) {
                                let vx = (endX - x) / (endTime - startTime);
                                this.x = x + (time - startTime) * vx;
                            }
                            if (y != endY) {
                                let vy = (endY - y) / (endTime - startTime);
                                this.y = y + (time - startTime) * vy;
                            }
                            if (eulerAngle != endEulerAngle) {
                                let veulerAngle = (endEulerAngle - eulerAngle) / (endTime - startTime);
                                this.eulerAngle = eulerAngle + (time - startTime) * veulerAngle;
                            }
                            if (alpha != endAlpha) {
                                let valpha = (endAlpha - alpha) / (endTime - startTime);
                                this.alpha = alpha + (time - startTime) * valpha;
                            }
                            if (color.r != endColor.r) {
                                console.log(this.color.r, color.r, endColor.r);
                                let vcolorR = (endColor.r - color.r) / (endTime - startTime);
                                this.color.r = color.r + (time - startTime) * vcolorR;
                            }
                            if (color.g != endColor.g) {
                                let vcolorG = (endColor.g - color.g) / (endTime - startTime);
                                this.color.g = color.g + (time - startTime) * vcolorG;
                            }
                            if (color.b != endColor.b) {
                                let vcolorB = (endColor.b - color.b) / (endTime - startTime);
                                this.color.b = color.b + (time - startTime) * vcolorB;
                            }
                        } else {
                            const t = (time - startTime) / (endTime - startTime);
                            const BEZIER = (3 * ((1 - t) ** 2) * bezier.x1 * t + 3 * ((1 - t) ** 2) * bezier.x2 * t ** 2 + t ** 3);
                            if (x != endX) {
                                this.x = x + (endX - x) * BEZIER;
                            }
                            if (y != endY) {
                                this.y = y + (endY - y) * BEZIER;
                            }
                            if (eulerAngle != endEulerAngle) {
                                this.eulerAngle = eulerAngle + (endEulerAngle - eulerAngle) * BEZIER;
                            }
                            if (alpha != endAlpha) {
                                this.alpha = alpha + (endAlpha - alpha) * BEZIER;
                            }
                            if (color.r != endColor.r) {
                                this.color.r = color.r + (endColor.r - color.r) * BEZIER;
                            }
                            if (color.g != endColor.g) {
                                this.color.g = color.g + (endColor.g - color.g) * BEZIER;
                            }
                            if (color.b != endColor.b) {
                                this.color.b = color.b + (endColor.b - color.b) * BEZIER;
                            }
                        }
                    }
                    if (time > endTime) {
                        this.x = endX;
                        this.y = endY;
                        this.eulerAngle = endEulerAngle;
                        this.alpha = endAlpha;
                        this.text = text;
                        this.font = font;
                        this.color.r = endColor.r;
                        this.color.g = endColor.g;
                        this.color.b = endColor.b;
                        return true;
                    }
                    return false;
                }
            }
            class gameBoard {
                constructor() {
                    this.init();
                    this.process();
                }
                init() {
                    if (spectral == null) {
                        addBlock();
                    } else {
                        $('#ui-display-lines>ul').empty();
                        spectral.notes = [];
                        spectral.lines = [];
                        addBlock(0, 0, 0, 635, 1);
                    }
                }
                removeAll() {
                    removeLine(4, spectral.lines.length);
                    removeNote(0, spectral.notes.length);
                }
                // 动画循环(帧率)
                process(now){
                    //init time
                    if(!lastTime){
                        lastTime = now;
                    }
                    let seconds = (now - lastTime) / 1000;
                    lastTime = now;
                    if (seconds) {
                        time = audio.currentTime * 100 - offset;
                        if (!timeFocus) {
                            document.getElementById('ui-time-time').value = Math.floor(time + offset);
                        }
                    }
                    ctx.clearRect(-100000, -100000, 200000, 200000);
                    ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, $('#canvas').attr('height') / 2);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.font = '42px Phigros, Phigros cn, Tw Cen MT'
                    ctx.save();
                    for (let i = 0; i < spectral.textMoves.length; i++) {
                        while (!spectral.texts[spectral.textMoves[i].textId]) {
                            addText();
                        }
                        spectral.texts[spectral.textMoves[i].textId].move({x: spectral.textMoves[i].x, y: spectral.textMoves[i].y, eulerAngle: spectral.textMoves[i].eulerAngle, text: spectral.textMoves[i].text, font: spectral.textMoves[i].font, alpha: spectral.textMoves[i].alpha, color: spectral.textMoves[i].color, endX: spectral.textMoves[i].endX, endY: spectral.textMoves[i].endY, endEulerAngle: spectral.textMoves[i].endEulerAngle, endAlpha: spectral.textMoves[i].endAlpha, endColor: spectral.textMoves[i].endColor, bezier: spectral.textMoves[i].bezier, startTime: spectral.textMoves[i].startTime, endTime: spectral.textMoves[i].endTime});
                    }
                    for (let i = 0; i < spectral.lineMoves.length; i++) {
                        while (!spectral.lines[spectral.lineMoves[i].line]) {
                            addLine();
                        }
                        spectral.lines[spectral.lineMoves[i].line].move({x: spectral.lineMoves[i].x, y: spectral.lineMoves[i].y, eulerAngle: spectral.lineMoves[i].eulerAngle, width: spectral.lineMoves[i].width, alpha: spectral.lineMoves[i].alpha, color: spectral.lineMoves[i].color, endX: spectral.lineMoves[i].endX, endY: spectral.lineMoves[i].endY, endEulerAngle: spectral.lineMoves[i].endEulerAngle, endWidth: spectral.lineMoves[i].endWidth, endAlpha: spectral.lineMoves[i].endAlpha, endColor: spectral.lineMoves[i].endColor, bezier: spectral.lineMoves[i].bezier, startTime: spectral.lineMoves[i].startTime, endTime: spectral.lineMoves[i].endTime});
                    }
                    for (let i = 0; i < spectral.blockMoves.length; i++) {
                        while (!spectral.blocks[spectral.blockMoves[i].block]) {
                            addBlock();
                        }
                        spectral.blocks[spectral.blockMoves[i].block].move({x: spectral.blockMoves[i].x, y: spectral.blockMoves[i].y, eulerAngle: spectral.blockMoves[i].eulerAngle, width: spectral.blockMoves[i].width, alpha: spectral.blockMoves[i].alpha, color: spectral.blockMoves[i].color, endX: spectral.blockMoves[i].endX, endY: spectral.blockMoves[i].endY, endEulerAngle: spectral.blockMoves[i].endEulerAngle, endWidth: spectral.blockMoves[i].endWidth, endAlpha: spectral.blockMoves[i].endAlpha, endColor: spectral.blockMoves[i].endColor, bezier: spectral.blockMoves[i].bezier, startTime: spectral.blockMoves[i].startTime, endTime: spectral.blockMoves[i].endTime});
                    }
                    for (let i = 0; i < spectral.noteMoves.length; i++) {
                        while (!spectral.notes[spectral.noteMoves[i].note]) { //如果没有对应id的判定线,则添加
                            addNote(spectral.noteMoves[i].line, undefined, undefined, undefined, spectral.noteMoves[i].type);
                        }
                        spectral.notes[spectral.noteMoves[i].note].move({line: spectral.noteMoves[i].line, x: spectral.noteMoves[i].x, y: spectral.noteMoves[i].y, endX: spectral.noteMoves[i].endX, endY: spectral.noteMoves[i].endY, bezier: spectral.noteMoves[i].bezier, startTime: spectral.noteMoves[i].startTime, endTime: spectral.noteMoves[i].endTime, type: spectral.noteMoves[i].type, height: spectral.noteMoves[i].height, endHeight: spectral.noteMoves[i].endHeight});
                    }
                    for (let i = 0; i < spectral.pointMoves.length; i++) {
                        while(!spectral.graphics[spectral.pointMoves[i].graph]) {
                            addgraph();
                        }
                        while (!spectral.graphics[spectral.pointMoves[i].graph][spectral.pointMoves[i].point]) {
                            addPoint(spectral.pointMoves[i].graph);
                        }
                        spectral.graphics[spectral.pointMoves[i].graph][spectral.pointMoves[i].point].move({x: spectral.pointMoves[i].x, y: spectral.pointMoves[i].y, alpha: spectral.pointMoves[i].alpha, color: spectral.pointMoves[i].color, endX: spectral.pointMoves[i].endX, endY: spectral.pointMoves[i].endY, endAlpha: spectral.pointMoves[i].endAlpha, endColor: spectral.pointMoves[i].endColor, bezier: spectral.pointMoves[i].bezier, close: spectral.pointMoves[i].close, startTime: spectral.pointMoves[i].startTime, endTime: spectral.pointMoves[i].endTime});
                    }
                    if (gl) {
                        if (edit.open) {
                            if (settings.listProportion == '16:9' || settings.listProportion == undefined) {
                                $('#canvas').css('width', $('body').height() * 0.8 / 9 * 16);
                            } else {
                                $('#canvas').css('width', $('body').height() * 0.8 / 3 * 4);
                            }
                            $('#canvas').attr('height', 3300);
                            $('#canvas').css({'height': 'auto'});
                            display.miss = true;
                            if (edit.type == 'note') {
                                $('#canvas').unbind('mousemove').on('mousemove', (e) => {
                                    let rect = cvs.getBoundingClientRect();
                                    mouseX = Math.floor((e.clientX - rect.left) * (cvs.width / rect.width) - 960);
                                    mouseY = Math.floor(0 - ((e.clientY - rect.top) * (cvs.height / rect.height) - 3258));
                                    if ($('.ui-menu-buttonFocus[data-list="editAlign"]').attr('data-focus') == 'true') {
                                        mouseX = Math.round(mouseX / 42) * 42;
                                        mouseY = Math.round(mouseY / 21) * 21;
                                    }
                                    $('#canvas').unbind('mousemove');
                                });
                                let noteImg = imgs.tap;
                                switch(edit.noteType) {
                                    case 'tap':
                                        noteImg = imgs.tap;
                                        break;
                                    case 'drag':
                                        noteImg = imgs.drag;
                                        break;
                                    case 'hold':
                                        noteImg = imgs.hold;
                                        break;
                                    case 'eTap':
                                        noteImg = imgs.eTap;
                                        break;
                                }
                                ctx.setTransform(1, 0, 0, 1, 960, 3258);
                                ctx.globalAlpha = 0.8;
                                if (edit.noteType == 'hold') {
                                    ctx.drawImage(noteImg, mouseX - 84, 0 - (mouseY + 126 - 42), 168, 126);
                                } else {
                                    ctx.drawImage(noteImg, mouseX - 84, 0 - (mouseY + 95 - 42), 168, 42);
                                }
                                $('#canvas').unbind('click').click(() => {
                                    if ($('.ui-menu-buttonFocus[data-list="editAnimationStartTop"]').attr('data-focus') == 'true') {
                                        mouseY = 3300;
                                    }
                                    editLine = Number(editLine);
                                    addNote(editLine, mouseX / 42, mouseY / 42, edit.noteType);
                                    if ($('.ui-menu-buttonFocus[data-list="editAutoDownAnimation"]').attr('data-focus') == 'true') {
                                        if($('.ui-menu-buttonFocus[data-list="editAnimationStartTop"]').attr('data-focus') == 'true') {
                                            addAnimation('note', {line:editLine,note: spectral.notes.length - 1,x: mouseX / 42,y: mouseY / 42,endX: mouseX / 42, endY: 'down',type: edit.noteType,startTime: time - mouseY / 10 * 1,endTime: time});
                                        } else {
                                            addAnimation('note', {line:editLine,note: spectral.notes.length - 1,x: mouseX / 42,y: mouseY / 42,endX: mouseX / 42, endY: 'down',type: edit.noteType,startTime: time,endTime: time + mouseY / 10 * 1});
                                        }
                                        
                                    }
                                    if ($('.ui-menu-buttonFocus[data-list="editKeep"]').attr('data-focus') == 'false') {
                                        edit.open = false;
                                        $('#canvas').unbind('click');
                                    }
                                });
                            }
                        }
                        for(let i = 0;i < 3;i++){
                            ctx.globalAlpha = 1;
                            ctx.setTransform(1, 0, 0, 1, 0, 40);
                            ctx.fillStyle = '#00ccffdd';
                            if (i != 2) ctx.fillRect(0, 1080 * (i + 1), 1920, 7);
                            ctx.setTransform(1, 0, 0, 1, 0, 1080 * i + 40);
                            ctx.fillStyle = '#ffffffdd';
                            for(let j = 0;j < 5;j++){
                                ctx.fillRect(0, 1080 / 6 * (j + 1), 1920, 4);
                            }
                        }
                        spectral.lines[editLine].draw(editLine);
                    } else if(edit.open) {
                        if (edit.type == 'addBlock') {
                            addBlock(0, 0);
                            spectral.blockMoves.push({block: spectral.blocks.length - 1, x: 0, y: 0, eulerAngle: 0, width: 15, alpha: 1, endX: 0, endY: 0, endEulerAngle: 0, endWidth: 15, endAlpha: 1, startTime: 0, endTime: 0});
                            edit.open = false;
                        } else if (edit.type == 'addLine') {
                            addLine(0, 0);
                            edit.open = false;
                        }
                    } else {
                        display.miss = false;
                        if ($('#canvas').attr('height') != 1080) {
                            $('#canvas').attr('height', 1080);
                            if (settings.listProportion == '16:9' || settings.listProportion == undefined) {
                                $('#canvas').css('width', $('body').height() * 0.8 / 9 * 16);
                            } else {
                                $('#canvas').css('width', $('body').height() * 0.8 / 3 * 4);
                            }
                            $('#canvas').css({'height': '80%'});
                        }
                        for(var i = 0; i < spectral.graphics.length; i++) {
                            ctx.setTransform(1, 0, 0, 1, $('#canvas').attr('width') / 2, 540);
                            ctx.beginPath();
                            ctx.moveTo(spectral.graphics[i][0].x * 42, spectral.graphics[i][0].y * 42)
                            for (let j = 0; j < spectral.graphics[i].length; j++) {
                                spectral.graphics[i][j].draw(i + '-' + j);
                            }
                            ctx.fillStyle = `rgb(${spectral.graphics[i][spectral.graphics[i].length - 1].color.r}, ${spectral.graphics[i][spectral.graphics[i].length - 1].color.g}, ${spectral.graphics[i][spectral.graphics[i].length - 1].color.b})`;
                            ctx.strokeStyle = `rgb(${spectral.graphics[i][spectral.graphics[i].length - 1].color.r}, ${spectral.graphics[i][spectral.graphics[i].length - 1].color.g}, ${spectral.graphics[i][spectral.graphics[i].length - 1].color.b})`;
                            if (spectral.graphics[i][spectral.graphics[i].length - 1].close) {
                                ctx.closePath();
                            }
                            ctx.stroke();
                        }
                        for(var i = 0; i < spectral.texts.length; i++) {
                            spectral.texts[i].draw(i);
                        }
                        for(var i = 0; i < 4;i++) {
                            if (display.block[i]) {
                                spectral.lines[i].draw(i);
                            }
                        }
                        for(var i = 4; i < spectral.lines.length; i++) {
                            spectral.lines[i].draw(i);
                        }
                    }
                    for(var i = 0; i < spectral.notes.length; i++) {
                        if (display.block[spectral.notes[i].line] || spectral.notes[i].line > 3) {
                            spectral.notes[i].draw(i);
                        }
                    }
                    // console.log('canvas refresh', now, lastTime, seconds);
                    // 动画循环(帧率)
                    var gameLoop = window.requestAnimationFrame(this.process.bind(this));
                }
            }
            new gameBoard();
        }
    };
}
info('加载完毕, 请设置时间以开始运行', 'good');
gaming();
changeTool('main');