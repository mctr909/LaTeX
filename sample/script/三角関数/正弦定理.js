/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
const TEXT_COLOR = Color.BLACK;
const AUX_COLOR = Color.GREEN;

let gDrawer = new Drawer("disp", 400, 400);

let gO = new vec(UNIT * 0.0, UNIT * 0.7);
let gA = new vec(UNIT * -0.9, UNIT * -0.6);
let gB = new vec(UNIT * 0.8, UNIT * -0.3);
let gPoDrag = false;
let gPaDrag = false;
let gPbDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (!gPaDrag && !gPbDrag && distance(gDrawer.cursor, gO) <= 10) {
            gPoDrag = true;
        } else if (!gPoDrag && !gPbDrag && distance(gDrawer.cursor, gA) <= 10) {
            gPaDrag = true;
        } else if (!gPoDrag && !gPaDrag && distance(gDrawer.cursor, gB) <= 10) {
            gPbDrag = true;
        }
    } else {
        gPoDrag = false;
        gPaDrag = false;
        gPbDrag = false;
    }

    if (gPoDrag) {
        gDrawer.cursor.copy(gO);
    }
    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gB);
    }

    let ao = new vec();
    let ab = new vec();
    let bo = new vec();
    gO.sub(gA, ao);
    gB.sub(gA, ab);
    gO.sub(gB, bo);
    let angleA = ao.arg - ab.arg;
    if (2*Math.PI < angleA) {
        angleA -= 2*Math.PI;
    }
    if (angleA < 0) {
        angleA += 2*Math.PI;
    }
    let angleB = Math.PI - (bo.arg - ab.arg);
    if (2*Math.PI < angleB) {
        angleB -= 2*Math.PI;
    }
    if (angleB < 0) {
        angleB += 2*Math.PI;
    }
    let angleC = Math.PI - (angleA + angleB);
    if (2*Math.PI < angleC) {
        angleC -= 2*Math.PI;
    }
    if (angleC < 0) {
        angleC += 4*Math.PI;
    }

    let obL2 = ab.X*ab.X + ab.Y*ab.Y;
    let k = (ab.X * ao.X + ab.Y*ao.Y) / obL2;
    let c = new vec(ab.X * k + gA.X, ab.Y * k + gA.Y);

    gDrawer.drawArc(gA, 20, ab.arg, angleA + ab.arg, Color.BLACK, 3);
    gDrawer.drawArc(gB, 20, ab.arg - Math.PI - angleB, ab.arg - Math.PI, Color.BLACK, 3);
    gDrawer.drawArc(gO, 20, ao.arg - Math.PI, bo.arg - Math.PI, Color.BLACK, 3);

    gDrawer.drawLine(gA, gO);
    gDrawer.drawLine(gA, gB);
    gDrawer.drawLine(gB, gO);
    gDrawer.fillCircle(gO, 5);
    gDrawer.fillCircle(gB, 5);
    gDrawer.fillCircle(gA, 5);

    gDrawer.drawStringH(gA, gB, "α", 24, TEXT_COLOR, new vec(27,4,0));
    gDrawer.drawStringH(gA, gB, "β", 24, TEXT_COLOR, new vec(-27,4,1));
    gDrawer.drawStringV(c, gO, "θ", 24, TEXT_COLOR, new vec(0,-32,1));
    gDrawer.drawStringH(gA, gB, "A", 24, TEXT_COLOR, new vec(-13,-8,0));
    gDrawer.drawStringH(gA, gB, "B", 24, TEXT_COLOR, new vec(12,-8,1));
    gDrawer.drawStringV(c, gO, "O", 24, TEXT_COLOR, new vec(0,12,1));
    gDrawer.drawStringH(gA, gO, "a", 24, TEXT_COLOR, new vec(0,4,0.5));
    gDrawer.drawStringV(gB, gO, "b", 24, TEXT_COLOR, new vec(8,0,0.5));
    gDrawer.drawStringH(gA, gB, "c", 24, TEXT_COLOR, new vec(0,-15,0.5));

    let ta = ao.abs / UNIT;
    let tb = bo.abs / UNIT;
    let tc = ab.abs / UNIT;
    document.getElementById("lblA").innerHTML = round1d(ta);
    document.getElementById("lblB").innerHTML = round1d(tb);
    document.getElementById("lblC").innerHTML = round1d(tc);
    document.getElementById("lblAlpha").innerHTML
        = toFrac(angleA / Math.PI, "π", false)
        + "(" + round1d(angleA, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblBeta").innerHTML
        = toFrac(angleB / Math.PI, "π", false)
        + "(" + round1d(angleB, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblTheta").innerHTML
        = toFrac(angleC / Math.PI, "π", false)
        + "(" + round1d(angleC, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblSAlpha").innerHTML = round1d(Math.sin(angleA));
    document.getElementById("lblSBeta").innerHTML = round1d(Math.sin(angleB));
    document.getElementById("lblSTheta").innerHTML = round1d(Math.sin(angleC));
    requestNextAnimationFrame(main);
}
