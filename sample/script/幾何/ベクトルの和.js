/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 100;

let gDrawer = new Drawer("disp", 500, 400);

let ofsX = -1.0 * UNIT;
let ofsY = 0.0 * UNIT;
let radiusA = 1.0 * UNIT;
let radiusB = 1.0 * UNIT;
let gO = new vec(ofsX, ofsY);
let gA = new vec(radiusA*Math.cos(Math.PI*15/180) + ofsX, radiusA*Math.sin(Math.PI*15/180) + ofsY);
let gB = new vec(radiusB*Math.cos(Math.PI*60/180) + ofsX, radiusB*Math.sin(Math.PI*60/180) + ofsY);
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
        } else if (!gPbDrag && !gPoDrag && distance(gDrawer.cursor, gA) <= 10) {
            gPaDrag = true;
        } else if (!gPaDrag && !gPoDrag && distance(gDrawer.cursor, gB) <= 10) {
            gPbDrag = true;
        }
    } else {
        gPoDrag = false;
        gPaDrag = false;
        gPbDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gB);
    }

    let oa = new vec();
    let ob = new vec();
    let ab = new vec();
    gA.sub(gO, oa);
    gB.sub(gO, ob);
    gA.add(gB, ab);
    ab.sub(gO, ab);

    gDrawer.drawCircle(gO, UNIT);
    gDrawer.drawLine(gO, gA, Drawer.GREEN, 3);
    gDrawer.drawLine(gO, gB, Drawer.BLUE, 3);
    gDrawer.drawLineD(gA, ab, Drawer.BLUE, 2);
    gDrawer.drawLineD(gB, ab, Drawer.GREEN, 2);
    gDrawer.fillCircle(gO, 3, Drawer.BLACK);
    gDrawer.fillCircle(gA, 4, Drawer.GREEN);
    gDrawer.fillCircle(gB, 4, Drawer.BLUE);
    gDrawer.fillCircle(ab, 4, Drawer.RED);
    gDrawer.drawString(gO, "O", 20);
    gDrawer.drawString(gA, "a", 20);
    gDrawer.drawString(gB, "b", 20);
    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(ob, 1/UNIT);
    document.getElementById("dispAB").innerHTML = round2d(new vec(ab.X - gO.X, ab.Y - gO.Y), 1/UNIT);

    requestNextAnimationFrame(main);
}
