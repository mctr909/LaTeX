/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 200;
const A_COLOR = Drawer.BLACK;
const B_COLOR = Drawer.GREEN;
const P_COLOR = Drawer.BLUE;
const Q_COLOR = Drawer.RED;

let gDrawer = new Drawer("disp", 600, 600);

let gPa = new vec(UNIT * 0.0, UNIT * 0.0);
let gPb = new vec(UNIT * 1.0, UNIT * 0.25);
let gPp = new vec(UNIT * 0.5, UNIT * 0.75);
let gPaDrag = false;
let gPbDrag = false;
let gPpDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (!gPbDrag && !gPpDrag && distance(gDrawer.cursor, gPa) <= 10) {
            gPaDrag = true;
        } else if (!gPpDrag && !gPaDrag && distance(gDrawer.cursor, gPb) <= 10) {
            gPbDrag = true;
        } else if (!gPbDrag && !gPaDrag && distance(gDrawer.cursor, gPp) <= 10) {
            gPpDrag = true;
        }
    } else {
        gPaDrag = false;
        gPbDrag = false;
        gPpDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gPa);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gPb);
    }
    if (gPpDrag) {
        gDrawer.cursor.copy(gPp);
    }

    let ab = new vec();
    let ap = new vec();
    gPb.sub(gPa, ab);
    gPp.sub(gPa, ap);
    let abL2 = ab.X*ab.X + ab.Y*ab.Y;
    let k = (ab.X * ap.X + ab.Y*ap.Y) / abL2;
    let q = new vec(ab.X * k + gPa.X, ab.Y * k + gPa.Y);
    let pk = new vec(ab.X * k*0.5 + gPa.X, ab.Y * k*0.5 + gPa.Y);

    gDrawer.drawLine(gPa, gPb, B_COLOR, 3);
    gDrawer.drawLineD(gPa, gPp, P_COLOR, 2);
    gDrawer.drawLineD(gPp, q, A_COLOR, 2);
    gDrawer.drawLineD(gPa, q, Q_COLOR, 2);
    gDrawer.fillCircle(gPa, 3, A_COLOR);
    gDrawer.fillCircle(gPb, 3, B_COLOR);
    gDrawer.fillCircle(gPp, 3, P_COLOR);
    gDrawer.fillCircle(q, 3, Q_COLOR);
    gDrawer.drawString(gPa, "A", 20);
    gDrawer.drawString(gPb, "B", 20);
    gDrawer.drawString(gPp, "P", 20);
    gDrawer.drawString(q, "Q", 20);
    gDrawer.drawStringC(pk, "k", 20);

    document.getElementById("dispA").innerHTML = round2d(gPa, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(gPb, 1/UNIT);
    document.getElementById("dispP").innerHTML = round2d(gPp, 1/UNIT);
    document.getElementById("dispQ").innerHTML = round2d(q, 1/UNIT);
    document.getElementById("dispK").innerHTML = round1d(k);
    requestNextAnimationFrame(main);
}
