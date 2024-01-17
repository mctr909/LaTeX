/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
let gDrawer = new Drawer("disp", 450, 400);

let gA = new vec(UNIT * -0.8, UNIT * -0.4);
let gB = new vec(UNIT * 0.7, UNIT * 0.0);
let gP = new vec(UNIT * 0.0, UNIT * 0.5);
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
        if (!gPbDrag && !gPpDrag && distance(gDrawer.cursor, gA) <= 24) {
            gPaDrag = true;
        } else if (!gPpDrag && !gPaDrag && distance(gDrawer.cursor, gB) <= 24) {
            gPbDrag = true;
        } else if (!gPbDrag && !gPaDrag && distance(gDrawer.cursor, gP) <= 24) {
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

    gDrawer.drawArrow(gA, gB, Color.BLACK, 3);
    gDrawer.drawLineD(gP, h, Color.BLACK, 2);
    gDrawer.drawArrow(gA, gP, Color.BLACK, 3);
    gDrawer.drawArrow(gA, h, Color.GREEN, 5);
    gDrawer.fillCircle(gA, 4);
    gDrawer.drawStringH(gA, gB, "A", 20, Color.BLACK, new vec(-12,-6,0));
    gDrawer.drawStringH(gA, gB, "B", 20, Color.BLACK, new vec(8,-6,1));
    gDrawer.drawStringV(h, gP, "P", 20, Color.BLACK, new vec(0,8,1));
    gDrawer.drawStringH(gA, h, "H", 20, Color.BLACK, new vec(0,-20,1));
    gDrawer.drawStringH(gA, h, "kAB", 20, Color.BLACK, new vec(0,4,0.5));

    document.getElementById("dispA").innerHTML = round2d(gA, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(gB, 1/UNIT);
    document.getElementById("dispP").innerHTML = round2d(gP, 1/UNIT);
    document.getElementById("dispH").innerHTML = round2d(h, 1/UNIT);
    document.getElementById("dispK").innerHTML = round1d(k);

    requestNextAnimationFrame(main);
}
