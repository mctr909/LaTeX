/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
let gDrawer = new Drawer("disp", 450, 400);

let gA = new vec(UNIT * 0.0, UNIT * 0.0);
let gB = new vec(UNIT * 1.0, UNIT * 0.25);
let gP = new vec(UNIT * 0.5, UNIT * 0.75);
let gPaDrag = false;
let gPbDrag = false;
let gPpDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (!gPbDrag && !gPpDrag && distance(gDrawer.cursor, gA) <= 10) {
            gPaDrag = true;
        } else if (!gPpDrag && !gPaDrag && distance(gDrawer.cursor, gB) <= 10) {
            gPbDrag = true;
        } else if (!gPbDrag && !gPaDrag && distance(gDrawer.cursor, gP) <= 10) {
            gPpDrag = true;
        }
    } else {
        gPaDrag = false;
        gPbDrag = false;
        gPpDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gB);
    }
    if (gPpDrag) {
        gDrawer.cursor.copy(gP);
    }

    let ab = new vec();
    let ap = new vec();
    gB.sub(gA, ab);
    gP.sub(gA, ap);
    let abL2 = ab.X*ab.X + ab.Y*ab.Y;
    let k = (ab.X * ap.X + ab.Y*ap.Y) / abL2;
    let q = new vec(ab.X * k + gA.X, ab.Y * k + gA.Y);
    let ak = new vec(ab.X * k*0.5 + gA.X, ab.Y * k*0.5 + gA.Y);

    gDrawer.drawLine(gA, gB, Drawer.GREEN, 1, 3);
    gDrawer.drawLineD(gA, gP, Drawer.BLUE, 1, 2);
    gDrawer.drawLineD(gP, q, Drawer.GRAY);
    gDrawer.drawLineD(gA, q, Drawer.BLACK);
    gDrawer.fillCircle(gA, 4, Drawer.BLACK);
    gDrawer.fillCircle(gB, 4, Drawer.GREEN);
    gDrawer.fillCircle(gP, 4, Drawer.BLUE);
    gDrawer.fillCircle(q, 3, Drawer.BLACK);
    gDrawer.drawString(gA, "A", 20);
    gDrawer.drawString(gB, "B", 20);
    gDrawer.drawString(gP, "P", 20);
    gDrawer.drawString(q, "Q", 20);
    gDrawer.drawStringC(ak, "k", 20);

    document.getElementById("dispA").innerHTML = round2d(gA, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(gB, 1/UNIT);
    document.getElementById("dispP").innerHTML = round2d(gP, 1/UNIT);
    document.getElementById("dispQ").innerHTML = round2d(q, 1/UNIT);
    document.getElementById("dispK").innerHTML = round1d(k);
    requestNextAnimationFrame(main);
}
