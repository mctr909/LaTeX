/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 100;

let gDrawer = new Drawer("disp", 400, 400);

let ofsX = 0.0 * UNIT;
let ofsY = 0.0 * UNIT;
let radiusA = 1.0 * UNIT;
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

    let k = document.getElementById("rangeK").value * 0.1;
    let oka = new vec();
    gA.sub(gO, oka);
    oka.scale(oka, k);
    oka.add(gO, oka);

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

    gDrawer.drawLine(gO, oka, Drawer.RED, 1);
    gDrawer.drawLine(gO, gA, Drawer.GREEN, 3);
    gDrawer.fillCircle(gO, 3, Drawer.BLACK);
    gDrawer.fillCircle(gA, 4, Drawer.GREEN);
    gDrawer.fillCircle(oka, 4, Drawer.RED);
    gDrawer.drawString(gO, "O", 20);
    gDrawer.drawString(gA, "a", 20);

    let oa = new vec();
    gA.sub(gO, oa);
    oka.sub(gO, oka);
    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispAn").innerHTML = round2d(oka, 1/UNIT);
    document.getElementById("dispK").innerHTML = round1d(k);

    requestNextAnimationFrame(main);
}
