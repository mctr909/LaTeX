/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
let gDrawer = new Drawer("disp", 450, 400);

let gA = new vec(UNIT * -0.8, UNIT * 0.0);
let gB = new vec(UNIT * 0.6, UNIT * -0.5);
let gC = new vec(UNIT * 0.5, UNIT * 0.5);
let gPaDrag = false;
let gPbDrag = false;
let gPcDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (!gPbDrag && !gPcDrag && distance(gDrawer.cursor, gA) <= 16) {
            gPaDrag = true;
        } else if (!gPcDrag && !gPaDrag && distance(gDrawer.cursor, gB) <= 16) {
            gPbDrag = true;
        } else if (!gPbDrag && !gPaDrag && distance(gDrawer.cursor, gC) <= 16) {
            gPcDrag = true;
        }
    } else {
        gPaDrag = false;
        gPbDrag = false;
        gPcDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gA);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gB);
    }
    if (gPcDrag) {
        gDrawer.cursor.copy(gC);
    }

    let ab = new vec();
    let ac = new vec();
    let ao = new vec();
    {
        gB.sub(gA, ab);
        gC.sub(gA, ac);

        let ab_ab = ab.dot(ab);
        let ac_ac = ac.dot(ac);
        let ab_ac = ab.dot(ac);
        // LO|AB: ab_ab*s + ab_ac*t = ab_ab/2
        // MO|AC: ab_ac*s + ac_ac*t = ac_ac/2
        let m = 2*ab_ac*ab_ac - 2*ab_ab*ac_ac;
        let s = -ac_ac * (ab_ab - ab_ac) / m;
        let t = ab_ab * (ab_ac - ac_ac) / m;

        // AO = s*AB + t*AC
        let s_ab = new vec();
        let t_ac = new vec();
        ab.scale(s_ab, s);
        ac.scale(t_ac, t);
        s_ab.add(t_ac, ao);
    }

    let bc = new vec(gC.X - gB.X, gC.Y - gB.Y);
    let s = Math.abs(Math.sin(ac.arg - ab.arg));
    let radius = s < 0.001 ? 0 : (0.5 * bc.abs / s);
    if (gDrawer.Width < radius) {
        radius = 0;
    }

    let ab_h = new vec(ab.X/2, ab.Y/2);
    let ac_h = new vec(ac.X/2, ac.Y/2);

    let dispO = new vec();
    ao.add(gA, dispO);

    let dispAB_h = new vec();
    let dispAC_h = new vec();
    ab_h.add(gA, dispAB_h);
    ac_h.add(gA, dispAC_h);

    let dispAB_h_AO = new vec();
    let dispAC_h_AO = new vec();
    dispO.sub(dispAB_h, dispAB_h_AO);
    dispO.sub(dispAC_h, dispAC_h_AO);
    dispAB_h_AO.normalize(dispAB_h_AO, dispAB_h_AO.abs + 30);
    dispAC_h_AO.normalize(dispAC_h_AO, dispAC_h_AO.abs + 30);
    dispAB_h_AO.add(dispAB_h, dispAB_h_AO);
    dispAC_h_AO.add(dispAC_h, dispAC_h_AO);

    gDrawer.drawArrow(gA, gB, Color.BLACK, 3);
    gDrawer.drawArrow(gA, gC, Color.BLACK, 3);
    gDrawer.drawLineD(dispAB_h, dispAB_h_AO);
    gDrawer.drawLineD(dispAC_h, dispAC_h_AO);
    gDrawer.fillCircle(dispO, 4);
    gDrawer.drawCircle(dispO, radius);

    gDrawer.fillCircle(gA, 4, Color.BLACK);
    gDrawer.fillCircle(dispAB_h, 4, Color.BLACK);
    gDrawer.fillCircle(dispAC_h, 4, Color.BLACK);
    gDrawer.drawStringXY(dispO.X + 5, dispO.Y - 6, "O", 20, Color.BLACK);
    gDrawer.drawStringH(gA, gB, "A", 20, Color.BLACK, new vec(-12,-6,0));
    gDrawer.drawStringH(gA, gB, "B", 20, Color.BLACK, new vec(12,-6,1));
    gDrawer.drawStringH(gA, gC, "C", 20, Color.BLACK, new vec(0,12,1));
    gDrawer.drawStringH(gA, dispAB_h, "L", 20, Color.BLACK, new vec(10,-20,1));
    gDrawer.drawStringH(gA, dispAC_h, "M", 20, Color.BLACK, new vec(12,6,1));

    document.getElementById("dispA").innerHTML = round2d(gA, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(gB, 1/UNIT);
    document.getElementById("dispC").innerHTML = round2d(gC, 1/UNIT);

    requestNextAnimationFrame(main);
}
