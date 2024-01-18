/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const UNIT = 200;
let gDrawer = new Drawer("disp", 450, 800);

let gA = new vec(UNIT * -0.8, UNIT * -0.2);
let gB = new vec(UNIT * 0.6, UNIT * -0.4);
let gC = new vec(UNIT * 0.5, UNIT * 0.6);
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
        if (!gPbDrag && !gPcDrag && distance(gDrawer.cursor, gA) <= 24) {
            gPaDrag = true;
        } else if (!gPcDrag && !gPaDrag && distance(gDrawer.cursor, gB) <= 24) {
            gPbDrag = true;
        } else if (!gPbDrag && !gPaDrag && distance(gDrawer.cursor, gC) <= 24) {
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

        // AO = sAB + tAC (ABとACによってAOを作るように設定)

        // LO・AB = 0
        // ∵LO⊥AB
        //        (AO - AL)・AB = 0 (LOの原点をAにそろえる)
        //               AO・AB = AL・AB
        //      (sAB + tAC)・AB = (AB/2)・AB
        // ① sAB・AB + tAB・AC = AB・AB/2

        // MO・AC = 0
        // ∵MO⊥AC
        //        (AO - AM)・AC = 0 (MOの原点をAにそろえる)
        //               AO・AC = AM・AC
        //      (sAB + tAC)・AC = (AC/2)・AC
        // ② sAB・AC + tAC・AC = AC・AC/2

        // a = AB・AB, b = AB・AC, c = AC・AC
        // ① as + bt = a/2
        // ② bs + ct = c/2
        // s = c(b - a) / 2(b^2 - ac)
        // t = a(b - c) / 2(b^2 - ac)

        let a = ab.dot(ab);
        let b = ab.dot(ac);
        let c = ac.dot(ac);
        let m = (b*b - a*c)*2;
        let s = c*(b - a) / m;
        let t = a*(b - c) / m;

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
    dispAB_h_AO.normalize(dispAB_h_AO, dispAB_h_AO.abs + 20);
    dispAC_h_AO.normalize(dispAC_h_AO, dispAC_h_AO.abs + 20);
    dispAB_h_AO.add(dispAB_h, dispAB_h_AO);
    dispAC_h_AO.add(dispAC_h, dispAC_h_AO);

    gDrawer.drawLineD(dispAB_h, dispAB_h_AO, Color.GRAY);
    gDrawer.drawLineD(dispAC_h, dispAC_h_AO, Color.GRAY);
    gDrawer.fillCircle(dispO, 3);
    gDrawer.drawCircle(dispO, radius);
    gDrawer.drawArrow(gA, gB, Color.BLACK, 3);
    gDrawer.drawArrow(gA, gC, Color.BLACK, 3);
    gDrawer.drawArrow(gA, dispO, Color.GRAY66, 3);

    gDrawer.fillCircle(gA, 5, Color.BLACK);
    gDrawer.fillCircle(dispAB_h, 5, Color.BLACK);
    gDrawer.fillCircle(dispAC_h, 5, Color.BLACK);
    gDrawer.drawStringXY(dispO.X+4, dispO.Y-6, "O", 20, Color.BLACK);
    gDrawer.drawStringH(gA, dispO, "A", 20, Color.BLACK, new vec(-15,-6,0));
    gDrawer.drawStringH(gA, gB, "B", 20, Color.BLACK, new vec(12,-6,1));
    gDrawer.drawStringH(gA, gC, "C", 20, Color.BLACK, new vec(12,-6,1));
    gDrawer.drawStringH(gA, dispAB_h, "L", 20, Color.BLACK, new vec(10,-20,1));
    gDrawer.drawStringH(gA, dispAC_h, "M", 20, Color.BLACK, new vec(12,6,1));

    document.getElementById("dispA").innerHTML = round2d(gA, 1/UNIT);
    document.getElementById("dispB").innerHTML = round2d(gB, 1/UNIT);
    document.getElementById("dispC").innerHTML = round2d(gC, 1/UNIT);

    requestNextAnimationFrame(main);
}
