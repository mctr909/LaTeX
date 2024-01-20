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
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
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

    roundVec(gA, gA, 2, UNIT, gO);

    let ona = new vec();
    gA.sub(gO, ona);
    let r = ona.abs / UNIT;
    ona.scale(1/r, ona);
    ona.add(gO, ona);

    gDrawer.drawGrid(UNIT);

    gDrawer.drawCircleD(gO, UNIT*0.5, Color.GRAY);
    gDrawer.drawCircle(gO, UNIT, Color.GRAY);
    gDrawer.drawCircleD(gO, UNIT*1.5, Color.GRAY);
    gDrawer.drawCircle(gO, UNIT*2, Color.GRAY);

    gDrawer.drawArrow(gO, ona, Color.GREEN, 7);
    gDrawer.drawArrow(gO, gA, Color.BLACK, 2);

    gDrawer.drawStringH(gO, gA, "a", 20, Color.BLACK, new vec(5,-4,1));

    let oa = new vec();
    gA.sub(gO, oa);
    ona.sub(gO, ona);
    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispAn").innerHTML = round1d(r);
    document.getElementById("dispAm").innerHTML = round2d(ona, 1/UNIT);

    requestNextAnimationFrame(main);
}
