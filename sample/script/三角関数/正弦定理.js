/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
const TEXT_COLOR = Color.BLACK;
const AUX_COLOR = Color.GREEN;

let gDrawer = new Drawer("disp", 400, 400);

let gA = new vec(UNIT * -0.6, UNIT * -0.6);
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
    let ab = new vec();
    let ba = new vec();
    let gb = new vec();
    gG.sub(gA, ag);
    gB.sub(gA, ab);
    gA.sub(gB, ba);
    gB.sub(gG, gb);

    let ag_h = new vec();
    let ba_h = new vec();
    let gb_h = new vec();
    ag.scale(0.5, ag_h);
    ba.scale(0.5, ba_h);
    gb.scale(0.5, gb_h);

    let gAG_h = new vec();
    let gBA_h = new vec();
    let gGB_h = new vec();
    ag_h.add(gA, gAG_h);
    ba_h.add(gB, gBA_h);
    gb_h.add(gG, gGB_h);

    let ao = new vec();
    let gO = new vec();
    {
        let a = ag.dot(ag);
        let b = ag.dot(ab);
        let c = ab.dot(ab);
        let m = (b*b - a*c)*2;
        let s = c*(b - a) / m;
        let t = a*(b - c) / m;

        let s_ag = new vec();
        let t_ag = new vec();
        ag.scale(s, s_ag);
        ab.scale(t, t_ag);
        s_ag.add(t_ag, ao);
        gO.add(ao, gO);
        gO.add(gA, gO);
    }

    let angleA = angleLimit(ba.arg - ag.arg - Math.PI);
    let angleB = angleLimit(gb.arg - ba.arg - Math.PI);
    let angleG = angleLimit(ag.arg - gb.arg + Math.PI);

    let s = Math.abs(Math.sin(ag.arg - ab.arg));
    let radius = s < 0.001 ? 0 : (0.5 * gb.abs / s);
    if (gDrawer.Width < radius) {
        radius = 0;
    }

    gDrawer.drawCircle(gO, radius);
    gDrawer.drawLine(gA, gO);
    gDrawer.drawLine(gB, gO);
    gDrawer.drawLine(gG, gO);
    gDrawer.drawLineD(gAG_h, gO, Color.GRAY66);
    gDrawer.drawLineD(gBA_h, gO, Color.GRAY66);
    gDrawer.drawLineD(gGB_h, gO, Color.GRAY66);
    gDrawer.fillCircle(gAG_h, 5);
    gDrawer.fillCircle(gBA_h, 5);
    gDrawer.fillCircle(gGB_h, 5);
    gDrawer.fillCircle(gO, 3);

    gDrawer.drawArc(gA, 20, ag.arg, ag.arg + angleA, Color.BLACK, 3);
    gDrawer.drawArc(gB, 20, ba.arg, ba.arg + angleB, Color.BLACK, 3);
    gDrawer.drawArc(gG, 20, ag.arg - angleG - Math.PI, ag.arg - Math.PI, Color.BLACK, 3);

    gDrawer.drawLine(gA, gB, Color.BLACK, 3);
    gDrawer.drawLine(gA, gG, Color.BLACK, 3);
    gDrawer.drawLine(gG, gB, Color.BLACK, 3);
    gDrawer.fillCircle(gA, 5);
    gDrawer.fillCircle(gB, 5);
    gDrawer.fillCircle(gG, 5);

    gDrawer.drawStringH(gA, gG, "α", 24, TEXT_COLOR, new vec(28,2,0));
    gDrawer.drawStringH(gB, gA, "β", 24, TEXT_COLOR, new vec(27,4,0));
    gDrawer.drawStringH(gG, gB, "γ", 24, TEXT_COLOR, new vec(27,4,0));
    gDrawer.drawStringH(gA, gO, "A", 24, TEXT_COLOR, new vec(-13,-8,0));
    gDrawer.drawStringV(gO, gB, "B", 24, TEXT_COLOR, new vec(0,12,1));
    gDrawer.drawStringH(gO, gG, "G", 24, TEXT_COLOR, new vec(15,-8,1));
    gDrawer.drawStringH(gA, gO, "O", 24, TEXT_COLOR, new vec(15,-8,1));
    gDrawer.drawStringV(gBA_h, gO, "L", 24, TEXT_COLOR, new vec(0,-18,0));
    gDrawer.drawStringV(gGB_h, gO, "M", 24, TEXT_COLOR, new vec(0,-16,0));
    gDrawer.drawStringV(gAG_h, gO, "N", 24, TEXT_COLOR, new vec(0,-16,0));

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
