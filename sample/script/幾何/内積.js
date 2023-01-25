/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 100;

let gDrawer = new Drawer("disp", 400, 400);

let ofsX = 0.0 * UNIT;
let ofsY = 0.0 * UNIT;
let radiusA = 1.0 * UNIT;
let radiusB = 1.5 * UNIT;
let gO = new vec(ofsX, ofsY);
let gA = new vec(radiusA*Math.cos(Math.PI*30/180) + ofsX, radiusA*Math.sin(Math.PI*30/180) + ofsY);
let gB = new vec(radiusB*Math.cos(Math.PI*150/180) + ofsX, radiusB*Math.sin(Math.PI*150/180) + ofsY);
let gPaDrag = false;
let gPbDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
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

    roundVec(gA, gA, 2, UNIT, gO);
    roundVec(gB, gB, 2, UNIT, gO);

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

    gDrawer.fillCircle(gO, 2, Drawer.BLACK);
    gDrawer.fillCircle(gA, 4, Drawer.GREEN);
    gDrawer.fillCircle(gB, 4, Drawer.BLUE);
    gDrawer.drawString(gO, "O", 20);
    gDrawer.drawString(gA, "a", 20);
    gDrawer.drawString(gB, "b", 20);

    let oa = new vec();
    let ob = new vec();
    gA.sub(gO, oa);
    gB.sub(gO, ob);

    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(ob, 1/UNIT);
    document.getElementById("dispAB").innerHTML = round1d(oa.X*ob.X + oa.Y*ob.Y, 1/UNIT/UNIT);

    requestNextAnimationFrame(main);
}
