/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
const TEXT_COLOR = Color.BLACK;
const AUX_COLOR = Color.GREEN;

let gDrawer = new Drawer("disp", 400, 400);

let gA = new vec(UNIT * -0.9, UNIT * -0.6);
let gB = new vec(UNIT * 0.0, UNIT * 0.7);
let gG = new vec(UNIT * 0.8, UNIT * -0.3);
let gPaDrag = false;
let gPbDrag = false;
let gPgDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (!gPbDrag && !gPgDrag && distance(gDrawer.cursor, gA) <= 10) {
            gPaDrag = true;
        } else if (!gPaDrag && !gPgDrag && distance(gDrawer.cursor, gB) <= 10) {
            gPbDrag = true;
        } else if (!gPaDrag && !gPbDrag && distance(gDrawer.cursor, gG) <= 10) {
            gPgDrag = true;
        }
    } else {
        gPaDrag = false;
        gPbDrag = false;
        gPgDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gB);
    }
    if (gPgDrag) {
        gDrawer.cursor.copy(gG);
    }

    let ag = new vec();
    let ba = new vec();
    let gb = new vec();
    gG.sub(gA, ag);
    gA.sub(gB, ba);
    gB.sub(gG, gb);
    let abM = new vec((gA.X + gB.X)*0.5, (gA.Y + gB.Y)*0.5);
    let agM = new vec((gA.X + gG.X)*0.5, (gA.Y + gG.Y)*0.5);
    let gbM = new vec((gG.X + gB.X)*0.5, (gG.Y + gB.Y)*0.5);
    let abC = new vec(abM.X - ba.Y, abM.Y + ba.X);
    let agC = new vec(agM.X - ag.Y, agM.Y + ag.X);
    let gbC = new vec(gbM.X - gb.Y, gbM.Y + gb.X);
    gDrawer.drawLine(abM, abC, Color.GRAY75);
    gDrawer.drawLine(agM, agC, Color.GRAY75);
    gDrawer.drawLine(gbM, gbC, Color.GRAY75);

    let angleA = angleLimit(ba.arg - ag.arg - Math.PI);
    let angleG = angleLimit(ag.arg - gb.arg + Math.PI);
    let angleB = angleLimit(gb.arg - ba.arg - Math.PI);

    let agL2 = ag.X*ag.X + ag.Y*ag.Y;
    let k = (ag.X * ba.X + ag.Y*ba.Y) / agL2;
    let c = new vec(ag.X * k + gA.X, ag.Y * k + gA.Y);

    gDrawer.drawArc(gA, 20, ag.arg, ag.arg + angleA, Color.BLACK, 3);
    gDrawer.drawArc(gB, 20, ba.arg, ba.arg + angleB, Color.BLACK, 3);
    gDrawer.drawArc(gG, 20, ag.arg - angleG - Math.PI, ag.arg - Math.PI, Color.BLACK, 3);

    gDrawer.drawLine(gA, gB);
    gDrawer.drawLine(gA, gG);
    gDrawer.drawLine(gG, gB);
    gDrawer.fillCircle(gA, 5);
    gDrawer.fillCircle(gB, 5);
    gDrawer.fillCircle(gG, 5);

    gDrawer.drawStringH(gA, gG, "α", 24, TEXT_COLOR, new vec(28,2,0));
    gDrawer.drawStringH(gB, gA, "β", 24, TEXT_COLOR, new vec(27,4,0));
    gDrawer.drawStringH(gG, gB, "γ", 24, TEXT_COLOR, new vec(27,4,0));
    gDrawer.drawStringH(gA, gG, "A", 24, TEXT_COLOR, new vec(-13,-8,0));
    gDrawer.drawStringV(c, gB, "B", 24, TEXT_COLOR, new vec(0,12,1));
    gDrawer.drawStringH(gA, gG, "G", 24, TEXT_COLOR, new vec(12,-8,1));
    gDrawer.drawStringV(gG, gB, "a", 24, TEXT_COLOR, new vec(8,0,0.5));
    gDrawer.drawStringH(gA, gG, "b", 24, TEXT_COLOR, new vec(0,-15,0.5));
    gDrawer.drawStringH(gA, gB, "g", 24, TEXT_COLOR, new vec(0,4,0.5));

    let ta = gb.abs / UNIT;
    let tb = ag.abs / UNIT;
    let tg = ba.abs / UNIT;
    document.getElementById("lblA").innerHTML = round1d(ta);
    document.getElementById("lblB").innerHTML = round1d(tb);
    document.getElementById("lblG").innerHTML = round1d(tg);
    document.getElementById("lblAlpha").innerHTML
        = toFrac(angleA / Math.PI, "π", false)
        + "(" + round1d(angleA, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblBeta").innerHTML
        = toFrac(angleB / Math.PI, "π", false)
        + "(" + round1d(angleB, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblGamma").innerHTML
        = toFrac(angleG / Math.PI, "π", false)
        + "(" + round1d(angleG, 180 / Math.PI, 1) + "°)";
    document.getElementById("lblSAlpha").innerHTML = round1d(Math.sin(angleA));
    document.getElementById("lblSBeta").innerHTML = round1d(Math.sin(angleB));
    document.getElementById("lblSGamma").innerHTML = round1d(Math.sin(angleG));

    requestNextAnimationFrame(main);
}

function angleLimit(v) {
    let n = parseInt(v / (2*Math.PI));
    return v - 2*Math.PI*n;
}
