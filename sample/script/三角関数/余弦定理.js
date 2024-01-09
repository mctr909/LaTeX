/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
const R_COLOR = Drawer.GREEN;
const A_COLOR = Drawer.BLUE;
const O_COLOR = Drawer.RED;

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

    gDrawer.drawArc(gO, 20, da.arg, dangle + da.arg, Drawer.BLACK, 3);
    gDrawer.drawLine(gO, gA, A_COLOR, 1, 5);
    gDrawer.drawLine(gO, gB, R_COLOR, 1, 5);
    gDrawer.drawLine(gA, gB, O_COLOR, 1, 5);
    gDrawer.fillCircle(gA, 5, A_COLOR);
    gDrawer.fillCircle(gB, 5, R_COLOR);
    gDrawer.fillCircle(gO, 5);

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
        = toFrac(dangle / Math.PI, "π", false)
        + "(" + round1d(dangle, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblCos").innerHTML = round1d(tcos);

    requestNextAnimationFrame(main);
}
