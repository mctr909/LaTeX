/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 200;
const A_COLOR = Drawer.GREEN;
const B_COLOR = Drawer.BLUE;
const C_COLOR = Drawer.RED;
const O_COLOR = Drawer.BLACK;

let gDrawer = new Drawer("disp", 450, 400);

let gA = new vec(UNIT * 0.5, UNIT * 0.0);
let gB = new vec(UNIT * 0.5, UNIT * 0.7);
let gO = new vec(UNIT * -0.3, UNIT * 0.0);
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
        if (!gPbDrag && !gPoDrag && distance(gDrawer.cursor, gA) <= 10) {
            gPaDrag = true;
        } else if (!gPaDrag && !gPoDrag && distance(gDrawer.cursor, gB) <= 10) {
            gPbDrag = true;
        } else if (!gPaDrag && !gPbDrag && distance(gDrawer.cursor, gO) <= 10) {
            gPoDrag = true;
        }
    } else {
        gPaDrag = false;
        gPbDrag = false;
        gPoDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gB);
    }
    if (gPoDrag) {
        gDrawer.cursor.copy(gO);
    }

    let da = new vec();
    let dr = new vec();
    let dc = new vec();
    gA.sub(gO, da);
    gB.sub(gO, dr);
    gA.sub(gB, dc);  
    let dangle = dr.arg - da.arg;
    if (2*Math.PI < dangle) {
        dangle -= 2*Math.PI;
    }
    if (dangle < 0) {
        dangle += 2*Math.PI;
    }

    gDrawer.drawArc(gO, 20, da.arg, dangle + da.arg, B_COLOR, 2);
    gDrawer.drawLine(gO, gA, A_COLOR, 2);
    gDrawer.drawLine(gO, gB, B_COLOR, 2);
    gDrawer.drawLine(gA, gB, C_COLOR, 2);
    gDrawer.fillCircle(gA, 5, A_COLOR);
    gDrawer.fillCircle(gB, 5, B_COLOR);
    gDrawer.fillCircle(gO, 5, O_COLOR);

    let lblA = new vec();
    let lblR = new vec();
    let lblO = new vec();
    midPos(gO, gA, 0.5, lblA);
    midPos(gO, gB, 0.5, lblR);
    midPos(gA, gB, 0.5, lblO);
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
    document.getElementById("lblA").innerHTML = round1d(ta);
    document.getElementById("lblR").innerHTML = round1d(tr);
    document.getElementById("lblO").innerHTML = round1d(to);
    document.getElementById("lblTheta").innerHTML
        = round1d(dangle, 1 / Math.PI, 2) + "π"
        + "(" + round1d(dangle, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblCos").innerHTML = round1d(tcos);

    requestNextAnimationFrame(main);
}
