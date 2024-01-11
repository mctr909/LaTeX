/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 50;
Drawer.CursorDiv = 5;
let gDrawerXY = new Drawer("dispXY", 210, 210);
let gDrawerZY = new Drawer("dispZY", 210, 210);
let gDrawerXZ = new Drawer("dispXZ", 210, 210);
let gDrawer = new Drawer("disp", 210, 210);

let ofsX = 0.0 * UNIT;
let ofsY = 0.0 * UNIT;
let radiusA = 1.0 * UNIT;
let gO = new vec(ofsX, ofsY);
let gA = new vec(radiusA*Math.cos(Math.PI*-45/180) + ofsX, radiusA*Math.sin(Math.PI*-45/180) + ofsY);
let gB = new vec(0, 0, UNIT);
let gXYPaDrag = false;
let gXYPbDrag = false;
let gZYPaDrag = false;
let gZYPbDrag = false;
let gXZPaDrag = false;
let gXZPbDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawerXY.Offset = new vec(gDrawerXY.Width/2, gDrawerXY.Height/2);
    gDrawerZY.Offset = new vec(gDrawerZY.Width/2, gDrawerZY.Height/2);
    gDrawerXZ.Offset = new vec(gDrawerXZ.Width/2, gDrawerXZ.Height/2);
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
}

function drawGrid(g) {
    g.drawGrid(UNIT);
    g.drawCircleD(gO, UNIT*0.5, Drawer.GRAY);
    g.drawCircle(gO, UNIT, Drawer.GRAY);
    g.drawCircleD(gO, UNIT*1.5, Drawer.GRAY);
    g.drawCircle(gO, UNIT*2, Drawer.GRAY);
}

function main() {
    gDrawerXY.clear();
    gDrawerZY.clear();
    gDrawerXZ.clear();
    gDrawer.clear();
    gDrawerXY.drawStringXY(-UNIT*2,UNIT*1.66, "xy平面", 20);
    gDrawerZY.drawStringXY(-UNIT*2,UNIT*1.66, "zy平面", 20);
    gDrawerXZ.drawStringXY(-UNIT*2,UNIT*1.66, "xz平面", 20);
    gDrawer.drawStringXY(-UNIT*2,UNIT*1.66, "透視投影", 20);

    var xyA = new vec(gA.X, gA.Y);
    var xyB = new vec(gB.X, gB.Y);
    if (gDrawerXY.isDrag) {
        if (!gXYPbDrag && distance(gDrawerXY.cursor, xyA) <= 10) {
            gXYPaDrag = true;
        } else if (!gXYPaDrag && distance(gDrawerXY.cursor, xyB) <= 10) {
            gXYPbDrag = true;
        }
    } else {
        gXYPaDrag = false;
        gXYPbDrag = false;
    }

    var zyA = new vec(gA.Z, gA.Y);
    var zyB = new vec(gB.Z, gB.Y);
    if (gDrawerZY.isDrag) {
        if (!gZYPbDrag && distance(gDrawerZY.cursor, zyA) <= 10) {
            gZYPaDrag = true;
        } else if (!gZYPaDrag && distance(gDrawerZY.cursor, zyB) <= 10) {
            gZYPbDrag = true;
        }
    } else {
        gZYPaDrag = false;
        gZYPbDrag = false;
    }

    var xzA = new vec(gA.X, gA.Z);
    var xzB = new vec(gB.X, gB.Z);
    if (gDrawerXZ.isDrag) {
        if (!gXZPbDrag && distance(gDrawerXZ.cursor, xzA) <= 10) {
            gXZPaDrag = true;
        } else if (!gXZPaDrag && distance(gDrawerXZ.cursor, xzB) <= 10) {
            gXZPbDrag = true;
        }
    } else {
        gXZPaDrag = false;
        gXZPbDrag = false;
    }

    if (gXYPaDrag) {
        gDrawerXY.cursor.copy(xyA);
        gA.X = xyA.X;
        gA.Y = xyA.Y;
    }
    if (gXYPbDrag) {
        gDrawerXY.cursor.copy(xyB);
        gB.X = xyB.X;
        gB.Y = xyB.Y;
    }
    if (gZYPaDrag) {
        gDrawerZY.cursor.copy(zyA);
        gA.Z = zyA.X;
        gA.Y = zyA.Y;
    }
    if (gZYPbDrag) {
        gDrawerZY.cursor.copy(zyB);
        gB.Z = zyB.X;
        gB.Y = zyB.Y;
    }
    if (gXZPaDrag) {
        gDrawerXZ.cursor.copy(xzA);
        gA.X = xzA.X;
        gA.Z = xzA.Y;
    }
    if (gXZPbDrag) {
        gDrawerXZ.cursor.copy(xzB);
        gB.X = xzB.X;
        gB.Z = xzB.Y;
    }

    roundVec(gA, gA, 2, UNIT, gO);
    roundVec(gB, gB, 2, UNIT, gO);

    drawGrid(gDrawerXY);
    drawGrid(gDrawerZY);
    drawGrid(gDrawerXZ);

    let oa = new vec();
    let ob = new vec();
    let ab = new vec();
    let axb = new vec();
    let oaxb = new vec();
    gA.sub(gO, oa);
    gB.sub(gO, ob);
    oa.add(ob, ab);
    ab.add(gO, ab);
    oa.cross(ob, axb);
    axb.scale(axb, 1/UNIT);
    axb.add(gO, oaxb);

    /* XY */
    gDrawerXY.drawArrow(gO, gA, Drawer.BLACK, 1, 2);
    gDrawerXY.drawArrow(gO, gB, Drawer.GREEN, 1, 2);
    gDrawerXY.drawArrow(gO, oaxb, Drawer.RED);
    gDrawerXY.drawLineD(gB, ab, Drawer.BLACK);
    gDrawerXY.drawLineD(gA, ab, Drawer.GREEN);

    gDrawerXY.drawStringH(gO, gA, "a", 20, [0,0,0], new vec(7,-4,1));
    gDrawerXY.drawStringH(gO, gB, "b", 20, [0,0,0], new vec(7,-4,1));

    /* ZY */
    gDrawerZY.drawArrowXY(gO.Z, gO.Y, gA.Z, gA.Y, Drawer.BLACK, 1, 2);
    gDrawerZY.drawArrowXY(gO.Z, gO.Y, gB.Z, gB.Y, Drawer.GREEN, 1, 2);
    gDrawerZY.drawArrowXY(gO.Z, gO.Y, oaxb.Z, oaxb.Y, Drawer.RED, 1, 1);
    gDrawerZY.drawLineXYD(gB.Z, gB.Y, ab.Z, ab.Y, Drawer.GREEN);
    gDrawerZY.drawLineXYD(gA.Z, gA.Y, ab.Z, ab.Y, Drawer.BLUE);

    gDrawerZY.drawStringH(gO, new vec(gA.Z, gA.Y), "a", 20, [0,0,0], new vec(7,-4,1));
    gDrawerZY.drawStringH(gO, new vec(gB.Z, gB.Y), "b", 20, [0,0,0], new vec(7,-4,1));

    /* XZ */
    gDrawerXZ.drawArrowXY(gO.X, gO.Z, gA.X, gA.Z, Drawer.BLACK, 1, 2);
    gDrawerXZ.drawArrowXY(gO.X, gO.Z, gB.X, gB.Z, Drawer.GREEN, 1, 2);
    gDrawerXZ.drawArrowXY(gO.X, gO.Z, oaxb.X, oaxb.Z, Drawer.RED, 1, 1);
    gDrawerXZ.drawLineXYD(gB.X, gB.Z, ab.X, ab.Z, Drawer.GREEN);
    gDrawerXZ.drawLineXYD(gA.X, gA.Z, ab.X, ab.Z, Drawer.BLACK);

    gDrawerXZ.drawStringH(gO, new vec(gA.X, gA.Z), "a", 20, [0,0,0], new vec(7,-4,1));
    gDrawerXZ.drawStringH(gO, new vec(gB.X, gB.Z), "b", 20, [0,0,0], new vec(7,-4,1));

    /* view */
    for(let r=-3.0; r<=3.0; r+=0.5) {
        let vx_a = to2d(new vec(UNIT*r, UNIT*-3, 0));
        let vx_b = to2d(new vec(UNIT*r, UNIT*3, 0));
        let vy_a = to2d(new vec(UNIT*-3, UNIT*r, 0));
        let vy_b = to2d(new vec(UNIT*3, UNIT*r, 0));
        if (0 < Math.abs(r - parseInt(r))) {
            gDrawer.drawLineD(vx_a, vx_b, Drawer.GRAY);
            gDrawer.drawLineD(vy_a, vy_b, Drawer.GRAY);
        } else {
            gDrawer.drawLine(vx_a, vx_b, Drawer.GRAY);
            gDrawer.drawLine(vy_a, vy_b, Drawer.GRAY);
        }
    }

    gDrawer.fillPolygon(
        [
            to2d(gO),
            to2d(gA),
            to2d(ab),
            to2d(gB)
        ],
        gDrawer.Offset,
        Drawer.GRAY,
        toAlpha((gA.Y+gB.Y+ab.Y) / 3, (gA.Z+gB.Z+ab.Z) / 3)
    );

    gDrawer.drawLine(to2d(gO), to2d(gA), Drawer.BLACK, toAlpha(gA.Y, gA.Z), 2);
    gDrawer.drawLine(to2d(gO), to2d(gB), Drawer.GREEN, toAlpha(gB.Y, gB.Z), 2);
    gDrawer.drawLine(to2d(gO), to2d(oaxb), Drawer.RED, toAlpha(oaxb.Y, oaxb.Z), 2);
    gDrawer.drawLineD(to2d(gB), to2d(ab), Drawer.BLACK, toAlpha(ab.Y, ab.Z), 2);
    gDrawer.drawLineD(to2d(gA), to2d(ab), Drawer.GREEN, toAlpha(ab.Y, ab.Z), 2);

    gDrawer.fillCircle(to2d(gA), 3, Drawer.BLACK, toAlpha(gA.Y, gA.Z));
    gDrawer.fillCircle(to2d(gB), 3, Drawer.GREEN, toAlpha(gB.Y, gB.Z));
    gDrawer.fillCircle(to2d(oaxb), 3, Drawer.RED, toAlpha(oaxb.Y, oaxb.Z));

    document.getElementById("dispA").innerHTML = round3d(oa, 1/UNIT);
    document.getElementById("dispB").innerHTML = round3d(ob, 1/UNIT);
    document.getElementById("dispAB").innerHTML = round3d(axb, 1/UNIT);

    requestNextAnimationFrame(main);
}
