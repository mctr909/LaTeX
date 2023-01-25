/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 100;

let gDrawer = new Drawer("disp", 400, 400);

let ofsX = 0.0 * UNIT;
let ofsY = 0.0 * UNIT;
let radiusA = 1.0 * UNIT;
let radiusB = 1.0 * UNIT;
let gO = new vec(ofsX, ofsY);
let gA = new vec(radiusA*Math.cos(Math.PI*15/180) + ofsX, radiusA*Math.sin(Math.PI*15/180) + ofsY);
let gB = new vec(radiusB*Math.cos(Math.PI*240/180) + ofsX, radiusB*Math.sin(Math.PI*240/180) + ofsY);
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
        if (!gPbDrag && distance(gDrawer.cursor, gA) <= 10) {
            gPaDrag = true;
        } else if (!gPaDrag && distance(gDrawer.cursor, gB) <= 10) {
            gPbDrag = true;
        }
    } else {
        gPaDrag = false;
        gPbDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gB);
    }

    round(gA, gA, 2, UNIT, gO);
    round(gB, gB, 2, UNIT, gO);

    let ab = new vec();
    let mb = new vec();
    gA.sub(gB, ab);
    ab.add(gO, ab);
    gB.sub(gO, mb);
    gO.sub(mb, mb);

    gDrawer.drawLine(new vec(gO.X, UNIT*-2), new vec(gO.X, UNIT*2), Drawer.GRAY);
    gDrawer.drawLine(new vec(UNIT, UNIT*-2), new vec(UNIT, UNIT*2), Drawer.GRAY);
    gDrawer.drawLine(new vec(-UNIT, UNIT*-2), new vec(-UNIT, UNIT*2), Drawer.GRAY);
    gDrawer.drawLineD(new vec(UNIT*0.5, UNIT*-2), new vec(UNIT*0.5, UNIT*2), Drawer.GRAY);
    gDrawer.drawLineD(new vec(UNIT*-0.5, UNIT*-2), new vec(UNIT*-0.5, UNIT*2), Drawer.GRAY);
    gDrawer.drawLineD(new vec(UNIT*1.5, UNIT*-2), new vec(UNIT*1.5, UNIT*2), Drawer.GRAY);
    gDrawer.drawLineD(new vec(UNIT*-1.5, UNIT*-2), new vec(UNIT*-1.5, UNIT*2), Drawer.GRAY);
    gDrawer.drawLine(new vec(UNIT*-2, gO.Y), new vec(UNIT*2, gO.Y), Drawer.GRAY);
    gDrawer.drawLine(new vec(UNIT*-2, UNIT), new vec(UNIT*2, UNIT), Drawer.GRAY);
    gDrawer.drawLine(new vec(UNIT*-2, -UNIT), new vec(UNIT*2, -UNIT), Drawer.GRAY);
    gDrawer.drawLineD(new vec(UNIT*-2, UNIT*0.5), new vec(UNIT*2, UNIT*0.5), Drawer.GRAY);
    gDrawer.drawLineD(new vec(UNIT*-2, UNIT*-0.5), new vec(UNIT*2, UNIT*-0.5), Drawer.GRAY);
    gDrawer.drawLineD(new vec(UNIT*-2, UNIT*1.5), new vec(UNIT*2, UNIT*1.5), Drawer.GRAY);
    gDrawer.drawLineD(new vec(UNIT*-2, UNIT*-1.5), new vec(UNIT*2, UNIT*-1.5), Drawer.GRAY);
    gDrawer.drawCircleD(gO, UNIT*0.5, Drawer.GRAY);
    gDrawer.drawCircle(gO, UNIT, Drawer.GRAY);
    gDrawer.drawCircleD(gO, UNIT*1.5, Drawer.GRAY);
    gDrawer.drawCircle(gO, UNIT*2, Drawer.GRAY);

    gDrawer.drawArrow(gO, gA, Drawer.GREEN, 4);
    gDrawer.drawArrow(gO, gB, Drawer.BLUE, 4);
    gDrawer.drawArrowD(gA, ab, Drawer.BLUE, 2);
    gDrawer.drawArrowD(gO, mb, Drawer.BLUE, 2);
    gDrawer.drawArrowD(mb, ab, Drawer.GREEN, 2);

    gDrawer.fillCircle(gO, 2, Drawer.BLACK);
    gDrawer.fillCircle(mb, 2, Drawer.BLACK);
    gDrawer.fillCircle(gA, 4, Drawer.GREEN);
    gDrawer.fillCircle(gB, 4, Drawer.BLUE);
    gDrawer.fillCircle(ab, 4, Drawer.RED);
    gDrawer.drawString(gO, "O", 20);
    gDrawer.drawString(gA, "a", 20);
    gDrawer.drawString(gB, "b", 20);
    gDrawer.drawString(mb, "-b", 20);

    let oa = new vec();
    let ob = new vec();
    gA.sub(gO, oa);
    gB.sub(gO, ob);
    ab.sub(gO, ab);

    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(ob, 1/UNIT);
    document.getElementById("dispAB").innerHTML = round2d(ab, 1/UNIT);

    requestNextAnimationFrame(main);
}
