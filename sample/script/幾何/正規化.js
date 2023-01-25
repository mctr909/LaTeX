/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 100;

let gDrawer = new Drawer("disp", 400, 400);

let ofsX = 0.0 * UNIT;
let ofsY = 0.0 * UNIT;
let radiusA = 1.5 * UNIT;
let gO = new vec(ofsX, ofsY);
let gA = new vec(radiusA*Math.cos(Math.PI*30/180) + ofsX, radiusA*Math.sin(Math.PI*30/180) + ofsY);
let gPaDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (distance(gDrawer.cursor, gA) <= 10) {
            gPaDrag = true;
        }
    } else {
        gPaDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }

    let ona = new vec();
    gA.sub(gO, ona);
    let r = ona.abs / UNIT;
    ona.scale(ona, 1/r);
    ona.add(gO, ona);

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
    gDrawer.drawArrow(gO, ona, Drawer.RED);
    gDrawer.fillCircle(gO, 3, Drawer.BLACK);
    gDrawer.fillCircle(gA, 4, Drawer.GREEN);
    gDrawer.fillCircle(ona, 4, Drawer.RED);
    gDrawer.drawString(gO, "O", 20);
    gDrawer.drawString(gA, "a", 20);

    let oa = new vec();
    gA.sub(gO, oa);
    ona.sub(gO, ona);
    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispAn").innerHTML = round1d(r);
    document.getElementById("dispAm").innerHTML = round2d(ona, 1/UNIT);

    requestNextAnimationFrame(main);
}
