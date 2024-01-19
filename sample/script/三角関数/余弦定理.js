/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
const TEXT_COLOR = Color.BLACK;
const AUX_COLOR = Color.GREEN;

let gDrawer = new Drawer("disp", 400, 400);

let gA = new vec(UNIT * 0.0, UNIT * 0.7);
let gB = new vec(UNIT * 0.8, UNIT * -0.3);
let gO = new vec(UNIT * -0.9, UNIT * -0.6);
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
    gB.sub(gA, ba);
    let dangle = oa.arg - ob.arg;
    if (2*Math.PI < dangle) {
        dangle -= 2*Math.PI;
    }
    if (dangle < 0) {
        dangle += 2*Math.PI;
    }

    let obL2 = ob.X*ob.X + ob.Y*ob.Y;
    let k = (ob.X * oa.X + ob.Y*oa.Y) / obL2;
    let c = new vec(ob.X * k + gO.X, ob.Y * k + gO.Y);

    gDrawer.drawArc(gO, 20, ob.arg, dangle + ob.arg, Color.BLACK, 3);
    gDrawer.drawLine(gO, gA, Color.BLACK, 3);
    gDrawer.drawLine(gO, gB, Color.BLACK, 3);
    gDrawer.drawLine(gB, gA, Color.BLACK, 3);
    gDrawer.drawLine(gA, c);
    gDrawer.drawLine(gO, c, AUX_COLOR, 7);
    gDrawer.fillCircle(gA, 5);
    gDrawer.fillCircle(gB, 5);
    gDrawer.fillCircle(gO, 5);
    gDrawer.fillCircle(c, 5, AUX_COLOR);

    gDrawer.drawStringH(gO, gB, "θ", 20, TEXT_COLOR, new vec(25,4,0));
    gDrawer.drawStringH(gO, gB, "O", 24, TEXT_COLOR, new vec(-13,-8,0));
    gDrawer.drawStringH(gO, gB, "B", 24, TEXT_COLOR, new vec(12,-8,1));
    gDrawer.drawStringV(c, gA, "A", 24, TEXT_COLOR, new vec(0,12,1));
    gDrawer.drawStringV(c, gA, "H", 24, AUX_COLOR, new vec(0,12,0));
    gDrawer.drawStringH(gO, gA, "a", 24, TEXT_COLOR, new vec(0,4,0.5));
    gDrawer.drawStringH(gO, gB, "b", 24, TEXT_COLOR, new vec(0,-20,0.5));
    gDrawer.drawStringV(gB, gA, "o", 24, TEXT_COLOR, new vec(8,0,0.5));
    gDrawer.drawStringH(gO, c, "a cosθ", 20, AUX_COLOR, new vec(0,5,0.5));

    let ta = oa.abs / UNIT;
    let tb = ob.abs / UNIT;
    let to = ba.abs / UNIT;
    let tcos = (ta*ta + tb*tb - to*to) / (2*ta*tb);
    document.getElementById("lblA").innerHTML = round1d(ta);
    document.getElementById("lblB").innerHTML = round1d(tb);
    document.getElementById("lblO").innerHTML = round1d(to);
    document.getElementById("lblTheta").innerHTML
        = toFrac(dangle / Math.PI, "π", false)
        + "(" + round1d(dangle, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblCos").innerHTML = round1d(tcos);

    requestNextAnimationFrame(main);
}
