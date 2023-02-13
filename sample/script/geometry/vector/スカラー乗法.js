/// <reference path="../../math.js" />
/// <reference path="../../drawer.js" />

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

    let k = document.getElementById("rangeK").value * 0.1;
    let oka = new vec();
    gA.sub(gO, oka);
    oka.scale(oka, k);
    oka.add(gO, oka);
    let oa_k = new vec();
    gA.sub(gO, oa_k);
    oa_k.scale(oa_k, 1/k);
    oa_k.add(gO, oa_k);

    gDrawer.drawGrid(UNIT);

    gDrawer.drawCircleD(gO, UNIT*0.5, Drawer.GRAY);
    gDrawer.drawCircle(gO, UNIT, Drawer.GRAY);
    gDrawer.drawCircleD(gO, UNIT*1.5, Drawer.GRAY);
    gDrawer.drawCircle(gO, UNIT*2, Drawer.GRAY);

    gDrawer.drawArrow(gO, oka, Drawer.BLUE, 2);
    gDrawer.drawArrow(gO, oa_k, Drawer.RED, 2);
    gDrawer.drawArrow(gO, gA, Drawer.GREEN, 2);

    gDrawer.drawString(gA, "a", 20);

    let oa = new vec();
    gA.sub(gO, oa);
    oka.sub(gO, oka);
    oa_k.sub(gO, oa_k);

    document.getElementById("dispK").innerHTML = round1d(k);
    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispAn").innerHTML = round2d(oka, 1/UNIT);
    document.getElementById("dispAk").innerHTML = round2d(oa_k, 1/UNIT);

    requestNextAnimationFrame(main);
}
