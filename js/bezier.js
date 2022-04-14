$(()=>{
    var cvs = document.querySelector('#bezierCanvas');
    var ctx = cvs.getContext('2d');
    let x1 = 0.4, y1 = 0.1, x2 = 0.6, y2 = 0.9, mouseX = 0, mouseY = 0, isChange = false;
    function draw() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, 256, 256);
        ctx.setTransform(1, 0, 0, -1, 28, 228);
        ctx.strokeStyle = '#888888';
        ctx.fillStyle = '#c44fd8';
        ctx.lineCap = 'round';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 200);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(x1 * 200, y1 * 200, x2 * 200, y2 * 200, 200, 200);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.arc(200, 200, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1 * 200, y1 * 200);
        ctx.moveTo(200, 200);
        ctx.lineTo(x2 * 200, y2 * 200);
        ctx.strokeStyle = '#c44fd8';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x1 * 200, y1 * 200, 7, 0, 2 * Math.PI);
        ctx.arc(x2 * 200, y2 * 200, 7, 0, 2 * Math.PI);
        ctx.fill();
    }
    draw();
    cvs.onmousemove = (e) => {
        let rect = cvs.getBoundingClientRect();
        mouseX = Math.floor((e.clientX - rect.left) * (cvs.width / rect.width) - 28);
        mouseY = Math.floor(0 - (e.clientY - rect.top) * (cvs.height / rect.height) + 228);
        if (isChange == 1) {
            x1 = mouseX / 200;
            y1 = mouseY / 200;
            if (x1 < 0) x1 = 0;
            else if (x1 > 1) x1 = 1;
        } else if (isChange == 2) {
            x2 = mouseX / 200;
            y2 = mouseY / 200;
            if (x2 < 0) x2 = 0;
            else if (x2 > 1) x2 = 1;
        }
        x1 = Math.round(x1 * 100) / 100;
        y1 = Math.round(y1 * 100) / 100;
        x2 = Math.round(x2 * 100) / 100;
        y2 = Math.round(y2 * 100) / 100;
        document.getElementById('x1').value = x1;
        document.getElementById('y1').value = y1;
        document.getElementById('x2').value = x2;
        document.getElementById('y2').value = y2;
        draw();
    }
    cvs.onmousedown = (e) => {
        let rect = cvs.getBoundingClientRect();
        mouseX = Math.floor((e.clientX - rect.left) * (cvs.width / rect.width) - 28);
        mouseY = Math.floor(0 - (e.clientY - rect.top) * (cvs.height / rect.height) + 228);
        if (Math.abs(mouseX - x1 * 200) ** 2 + Math.abs(mouseY - y1 * 200) ** 2 <= 81) {
            isChange = 1;
        } else if (Math.abs(mouseX - x2 * 200) ** 2 + Math.abs(mouseY - y2 * 200) ** 2 <= 81) {
            isChange = 2;
        }
    }
    cvs.onmouseup = () => {
        isChange = false;
    }
    cvs.onmouseout = () => {
        isChange = false;
    }
    $('.cs').unbind('change').change(() => {
        x1 = document.getElementById('x1').value;
        y1 = document.getElementById('y1').value;
        x2 = document.getElementById('x2').value;
        y2 = document.getElementById('y2').value;
        draw();
    });
});