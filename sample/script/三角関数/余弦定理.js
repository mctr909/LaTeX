/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
const TEXT_COLOR = Drawer.BLACK;
const AUX_COLOR = Drawer.GREEN;

let gDrawer = new Drawer("disp", 450, 400);

let gA = new vec(UNIT * 0.8, UNIT * 0.2);
let gB = new vec(UNIT * -0.3, UNIT * 0.7);
let gO = new vec(UNIT * -0.8, UNIT * -0.2);
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

    let oa = new vec();
    let ob = new vec();
    let ba = new vec();
    gA.sub(gO, oa);
    gB.sub(gO, ob);
    gA.sub(gB, ba);  
    let dangle = ob.arg - oa.arg;
    if (2*Math.PI < dangle) {
        dangle -= 2*Math.PI;
    }
    if (dangle < 0) {
        dangle += 2*Math.PI;
    }

    let oaL2 = oa.X*oa.X + oa.Y*oa.Y;
    let k = (oa.X * ob.X + oa.Y*ob.Y) / oaL2;
    let c = new vec(oa.X * k + gO.X, oa.Y * k + gO.Y);

    gDrawer.drawArc(gO, 20, oa.arg, dangle + oa.arg, Drawer.BLACK, 3);
    gDrawer.drawLine(gO, gA);
    gDrawer.drawLine(gO, gB);
    gDrawer.drawLine(gA, gB);
    gDrawer.drawLineD(gB, c, AUX_COLOR);
    gDrawer.drawLine(gO, c, AUX_COLOR, 1, 5);
    gDrawer.fillCircle(gA, 5);
    gDrawer.fillCircle(gB, 5);
    gDrawer.fillCircle(gO, 5);
    gDrawer.fillCircle(c, 5, AUX_COLOR);

    gDrawer.drawStringH(gO, gA, "O", 24, TEXT_COLOR, new vec(-12,-8,0));
    gDrawer.drawStringH(gO, gA, "A", 24, TEXT_COLOR, new vec(12,-8,1));
    gDrawer.drawStringV(c, gB, "B", 24, TEXT_COLOR, new vec(0,12,1));
    gDrawer.drawStringH(gO, gB, "r", 24, TEXT_COLOR, new vec(0,4,0.5));
    gDrawer.drawStringH(gO, gA, "a", 24, TEXT_COLOR, new vec(0,-16,0.5));
    gDrawer.drawStringV(gA, gB, "o", 24, TEXT_COLOR, new vec(8,0,0.5));
    gDrawer.drawStringV(c, gB, "s", 24, AUX_COLOR, new vec(8,0,0.5));
    gDrawer.drawStringH(gO, c, "c", 24, AUX_COLOR, new vec(0,5,0.5));

    let ta = oa.abs / UNIT;
    let tr = ob.abs / UNIT;
    let to = ba.abs / UNIT;
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
