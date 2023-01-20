/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 200;
const A_COLOR = Drawer.GREEN;
const B_COLOR = Drawer.BLUE;
const C_COLOR = Drawer.RED;
const O_COLOR = Drawer.BLACK;

let gDrawer = new Drawer("disp", 600, 600);

let gPa = new vec(UNIT * 1.0, UNIT * 0.0);
let gPb = new vec(UNIT * 1.0, UNIT * 1.0);
let gPo = new vec(UNIT * 0.0, UNIT * 0.0);
let gPaDrag = false;
let gPbDrag = false;
let gPoDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (!gPbDrag && !gPoDrag && distance(gDrawer.cursor, gPa) <= 10) {
            gPaDrag = true;
        } else if (!gPaDrag && !gPoDrag && distance(gDrawer.cursor, gPb) <= 10) {
            gPbDrag = true;
        } else if (!gPaDrag && !gPbDrag && distance(gDrawer.cursor, gPo) <= 10) {
            gPoDrag = true;
        }
    } else {
        gPaDrag = false;
        gPbDrag = false;
        gPoDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gPa);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gPb);
    }
    if (gPoDrag) {
        gDrawer.cursor.copy(gPo);
    }

    let da = new vec();
    let dr = new vec();
    let dc = new vec();
    gPa.sub(gPo, da);
    gPb.sub(gPo, dr);
    gPa.sub(gPb, dc);  
    let dangle = dr.arg - da.arg;
    if (2*Math.PI < dangle) {
        dangle -= 2*Math.PI;
    }
    if (dangle < 0) {
        dangle += 2*Math.PI;
    }

    gDrawer.drawCircle(gPo, dr.abs);
    gDrawer.drawArc(gPo, 20, da.arg, dangle + da.arg, B_COLOR, 2);
    gDrawer.drawLine(gPo, gPa, A_COLOR, 2);
    gDrawer.drawLine(gPo, gPb, B_COLOR, 2);
    gDrawer.drawLine(gPa, gPb, C_COLOR, 2);
    gDrawer.fillCircle(gPa, 5, A_COLOR);
    gDrawer.fillCircle(gPb, 5, B_COLOR);
    gDrawer.fillCircle(gPo, 5, O_COLOR);

    let lblA = new vec();
    let lblR = new vec();
    let lblO = new vec();
    midPos(gPo, gPa, 0.5, lblA);
    midPos(gPo, gPb, 0.5, lblR);
    midPos(gPa, gPb, 0.5, lblO);
    lblA.Y -= 15;
    lblR.Y -= 15;
    lblO.Y -= 15;
    gDrawer.drawString(lblA, "a", 24);
    gDrawer.drawString(lblR, "r", 24);
    gDrawer.drawString(lblO, "o", 24);
  
    let ta = da.abs / UNIT;
    let tr = dr.abs / UNIT;
    let to = dc.abs / UNIT;
    let tcos = (ta*ta + tr*tr - to*to) / (2*ta*tr);
    ta = parseInt(ta * 1000) / 1000;
    tr = parseInt(tr * 1000) / 1000;
    to = parseInt(to * 1000) / 1000;
    document.getElementById("lblA").innerHTML = ta;
    document.getElementById("lblR").innerHTML = tr;
    document.getElementById("lblO").innerHTML = to;
    document.getElementById("lblTheta").innerHTML
        = parseInt(dangle / Math.PI * 100) / 100 + "π"
        + "(" + parseInt(dangle * 180 / Math.PI * 10) / 10 + "°)";
    document.getElementById("lblCos").innerHTML = parseInt(tcos * 1000) / 1000;

    requestNextAnimationFrame(main);
}
