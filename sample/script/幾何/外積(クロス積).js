/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 50;
Drawer.CursorDiv = 5;
let gDrawerXY = new Drawer("dispXY", 210, 210);
let gDrawerZY = new Drawer("dispZY", 210, 210);
let gDrawerXZ = new Drawer("dispXZ", 210, 210);
let gDrawer = new Drawer("disp", 300, 300);

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
}

function drawGrid(g) {
    g.drawLine(new vec(gO.X, UNIT*-2), new vec(gO.X, UNIT*2), Drawer.GRAY);
    g.drawLine(new vec(UNIT, UNIT*-2), new vec(UNIT, UNIT*2), Drawer.GRAY);
    g.drawLine(new vec(-UNIT, UNIT*-2), new vec(-UNIT, UNIT*2), Drawer.GRAY);
    g.drawLineD(new vec(UNIT*0.5, UNIT*-2), new vec(UNIT*0.5, UNIT*2), Drawer.GRAY);
    g.drawLineD(new vec(UNIT*-0.5, UNIT*-2), new vec(UNIT*-0.5, UNIT*2), Drawer.GRAY);
    g.drawLineD(new vec(UNIT*1.5, UNIT*-2), new vec(UNIT*1.5, UNIT*2), Drawer.GRAY);
    g.drawLineD(new vec(UNIT*-1.5, UNIT*-2), new vec(UNIT*-1.5, UNIT*2), Drawer.GRAY);
    g.drawLine(new vec(UNIT*-2, gO.Y), new vec(UNIT*2, gO.Y), Drawer.GRAY);
    g.drawLine(new vec(UNIT*-2, UNIT), new vec(UNIT*2, UNIT), Drawer.GRAY);
    g.drawLine(new vec(UNIT*-2, -UNIT), new vec(UNIT*2, -UNIT), Drawer.GRAY);
    g.drawLineD(new vec(UNIT*-2, UNIT*0.5), new vec(UNIT*2, UNIT*0.5), Drawer.GRAY);
    g.drawLineD(new vec(UNIT*-2, UNIT*-0.5), new vec(UNIT*2, UNIT*-0.5), Drawer.GRAY);
    g.drawLineD(new vec(UNIT*-2, UNIT*1.5), new vec(UNIT*2, UNIT*1.5), Drawer.GRAY);
    g.drawLineD(new vec(UNIT*-2, UNIT*-1.5), new vec(UNIT*2, UNIT*-1.5), Drawer.GRAY);
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
    gDrawerXY.drawString(new vec(-UNIT*2,UNIT*1.66), "xy平面", 20);
    gDrawerZY.drawString(new vec(-UNIT*2,UNIT*1.66), "zy平面", 20);
    gDrawerXZ.drawString(new vec(-UNIT*2,UNIT*1.66), "xz平面", 20);
    gDrawer.drawString(new vec(-UNIT*2,UNIT*1.66), "透視投影", 20);

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
    gDrawerXY.drawLine(gO, gA, Drawer.GREEN, 3);
    gDrawerXY.drawLine(gO, gB, Drawer.BLUE, 3);
    gDrawerXY.drawLineD(gB, ab, Drawer.GREEN, 1);
    gDrawerXY.drawLineD(gA, ab, Drawer.BLUE, 1);
    gDrawerXY.drawLine(gO, oaxb, Drawer.BLACK, 1);

    gDrawerXY.fillCircle(gO, 3, Drawer.BLACK);
    gDrawerXY.fillCircle(gA, 4, Drawer.GREEN);
    gDrawerXY.fillCircle(gB, 4, Drawer.BLUE);
    gDrawerXY.fillCircle(ab, 2, Drawer.BLACK);
    gDrawerXY.fillCircle(oaxb, 4, Drawer.BLACK);

    gDrawerXY.drawString(gA, "a", 20);
    gDrawerXY.drawString(gB, "b", 20);

    /* ZY */
    gDrawerZY.drawLine(new vec(gO.Z, gO.Y), new vec(gA.Z, gA.Y), Drawer.GREEN, 3);
    gDrawerZY.drawLine(new vec(gO.Z, gO.Y), new vec(gB.Z, gB.Y), Drawer.BLUE, 3);
    gDrawerZY.drawLineD(new vec(gB.Z, gB.Y), new vec(ab.Z, ab.Y), Drawer.GREEN, 1);
    gDrawerZY.drawLineD(new vec(gA.Z, gA.Y), new vec(ab.Z, ab.Y), Drawer.BLUE, 1);
    gDrawerZY.drawLine(new vec(gO.Z, gO.Y), new vec(oaxb.Z, oaxb.Y), Drawer.BLACK, 1);

    gDrawerZY.fillCircle(new vec(gO.Z, gO.Y), 3, Drawer.BLACK);
    gDrawerZY.fillCircle(new vec(gA.Z, gA.Y), 4, Drawer.GREEN);
    gDrawerZY.fillCircle(new vec(gB.Z, gB.Y), 4, Drawer.BLUE);
    gDrawerZY.fillCircle(new vec(ab.Z, ab.Y), 2, Drawer.BLACK);
    gDrawerZY.fillCircle(new vec(oaxb.Z, oaxb.Y), 4, Drawer.BLACK);

    gDrawerZY.drawString(new vec(gA.Z, gA.Y), "a", 20);
    gDrawerZY.drawString(new vec(gB.Z, gB.Y), "b", 20);

    /* XZ */
    gDrawerXZ.drawLine(new vec(gO.X, gO.Z), new vec(gA.X, gA.Z), Drawer.GREEN, 3);
    gDrawerXZ.drawLine(new vec(gO.X, gO.Z), new vec(gB.X, gB.Z), Drawer.BLUE, 3);
    gDrawerXZ.drawLineD(new vec(gB.X, gB.Z), new vec(ab.X, ab.Z), Drawer.GREEN, 1);
    gDrawerXZ.drawLineD(new vec(gA.X, gA.Z), new vec(ab.X, ab.Z), Drawer.BLUE, 1);
    gDrawerXZ.drawLine(new vec(gO.X, gO.Z), new vec(oaxb.X, oaxb.Z), Drawer.BLACK, 1);

    gDrawerXZ.fillCircle(new vec(gO.X, gO.Z), 3, Drawer.BLACK);
    gDrawerXZ.fillCircle(new vec(gA.X, gA.Z), 4, Drawer.GREEN);
    gDrawerXZ.fillCircle(new vec(gB.X, gB.Z), 4, Drawer.BLUE);
    gDrawerXZ.fillCircle(new vec(ab.X, ab.Z), 2, Drawer.BLACK);
    gDrawerXZ.fillCircle(new vec(oaxb.X, oaxb.Z), 4, Drawer.BLACK);

    gDrawerXZ.drawString(new vec(gA.X, gA.Z), "a", 20);
    gDrawerXZ.drawString(new vec(gB.X, gB.Z), "b", 20);

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

    gDrawer.drawLine(to2d(gO), to2d(gA), Drawer.GREEN, 3, toAlpha(gA.Y, gA.Z));
    gDrawer.drawLine(to2d(gO), to2d(gB), Drawer.BLUE, 3, toAlpha(gB.Y, gB.Z));
    gDrawer.drawLine(to2d(gO), to2d(oaxb), Drawer.BLACK, 1, toAlpha(oaxb.Y, oaxb.Z));
    gDrawer.drawLineD(to2d(gB), to2d(ab), Drawer.GREEN, 1, toAlpha(ab.Y, ab.Z));
    gDrawer.drawLineD(to2d(gA), to2d(ab), Drawer.BLUE, 1, toAlpha(ab.Y, ab.Z));

    gDrawer.fillCircle(to2d(gO), 2, Drawer.BLACK);
    gDrawer.fillCircle(to2d(gA), 4, Drawer.GREEN, toAlpha(gA.Y, gA.Z));
    gDrawer.fillCircle(to2d(gB), 4, Drawer.BLUE, toAlpha(gB.Y, gB.Z));
    gDrawer.fillCircle(to2d(ab), 2, Drawer.BLACK, toAlpha(ab.Y, ab.Z));
    gDrawer.fillCircle(to2d(oaxb), 4, Drawer.BLACK, toAlpha(oaxb.Y, oaxb.Z));

    document.getElementById("dispA").innerHTML = round3d(oa, 1/UNIT);
    document.getElementById("dispB").innerHTML = round3d(ob, 1/UNIT);
    document.getElementById("dispAB").innerHTML = round3d(axb, 1/UNIT);

    requestNextAnimationFrame(main);
}
