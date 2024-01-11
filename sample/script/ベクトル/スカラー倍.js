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

    gDrawer.drawGrid(UNIT);

    gDrawer.drawCircleD(gO, UNIT*0.5, Drawer.GRAY);
    gDrawer.drawCircle(gO, UNIT, Drawer.GRAY);
    gDrawer.drawCircleD(gO, UNIT*1.5, Drawer.GRAY);
    gDrawer.drawCircle(gO, UNIT*2, Drawer.GRAY);

    gDrawer.drawArrow(gO, oka, [191,191,191], 5);
    gDrawer.drawArrow(gO, gA, Drawer.BLACK, 2);

    gDrawer.drawStringH(gO, gA, "a", 20, [0,0,0], new vec(5,-4,1));
    if (k < 0) {
        gDrawer.drawStringH(oka, gO, "ka", 20, [0,0,0], new vec(-7,-4,0));
    } else {
        gDrawer.drawStringH(gO, oka, "ka", 20, [0,0,0], new vec(7,-4,1));
    }

    let oa = new vec();
    gA.sub(gO, oa);
    oka.sub(gO, oka);

    document.getElementById("dispK").innerHTML = round1d(k);
    document.getElementById("dispA").innerHTML = round2d(oa, 1/UNIT);
    document.getElementById("dispAn").innerHTML = round2d(oka, 1/UNIT);

    requestNextAnimationFrame(main);
}
