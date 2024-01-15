/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
let gDrawer = new Drawer("disp", 450, 400);

let gA = new vec(UNIT * -0.8, UNIT * -0.4);
let gB = new vec(UNIT * 1.0, UNIT * 0.1);
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
    let h = new vec(ab.X * k + gA.X, ab.Y * k + gA.Y);

    gDrawer.drawLine(gA, gB, Color.GREEN, 3);
    gDrawer.drawLine(gP, h, Color.BLACK, 3);
    gDrawer.drawLineD(gA, gP, Color.BLUE, 3);
    gDrawer.drawLineD(gA, h, Color.BLACK, 3);
    gDrawer.fillCircle(gA, 6, Color.GREEN);
    gDrawer.fillCircle(gB, 6, Color.GREEN);
    gDrawer.fillCircle(gP, 6, Color.BLACK);
    gDrawer.fillCircle(h, 4, Color.BLACK);
    gDrawer.drawStringH(gA, gB, "A", 20, Color.BLACK, new vec(-12,-6,0));
    gDrawer.drawStringH(gA, gB, "B", 20, Color.BLACK, new vec(12,-6,1));
    gDrawer.drawStringV(h, gP, "P", 20, Color.BLACK, new vec(0,12,1));
    gDrawer.drawStringH(gA, h, "H", 20, Color.BLACK, new vec(0,-20,1));
    gDrawer.drawStringH(gA, h, "kAB", 20, Color.BLACK, new vec(0,4,0.5));

    document.getElementById("dispA").innerHTML = round2d(gA, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(gB, 1/UNIT);
    document.getElementById("dispP").innerHTML = round2d(gP, 1/UNIT);
    document.getElementById("dispH").innerHTML = round2d(h, 1/UNIT);
    document.getElementById("dispK").innerHTML = round1d(k);

    requestNextAnimationFrame(main);
}
