/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 100;

let gDrawer = new Drawer("disp", 500, 400);

let ofsX = -1.0 * UNIT;
let ofsY = 0.0 * UNIT;
let radiusA = 1.0 * UNIT;
let gO = new vec(ofsX, ofsY);
let gA = new vec(radiusA*Math.cos(Math.PI*30/180) + ofsX, radiusA*Math.sin(Math.PI*30/180) + ofsY);
let gPoDrag = false;
let gPaDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (!gPaDrag && distance(gDrawer.cursor, gO) <= 10) {
            gPoDrag = true;
        } else if (!gPoDrag && distance(gDrawer.cursor, gA) <= 10) {
            gPaDrag = true;
        }
    } else {
        gPoDrag = false;
        gPaDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }

    let oa = new vec();
    gA.sub(gO, oa);

    gDrawer.drawCircle(gO, UNIT);
    gDrawer.drawLine(gO, gA, Drawer.GREEN, 3);

    gDrawer.fillCircle(gO, 3, Drawer.BLACK);
    gDrawer.fillCircle(gA, 4, Drawer.GREEN);
    gDrawer.drawString(gO, "O", 20);
    gDrawer.drawString(gA, "a", 20);

    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispAn").innerHTML = round1d(oa.abs, 1/UNIT);

    requestNextAnimationFrame(main);
}
