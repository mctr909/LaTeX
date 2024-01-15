/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const TEXT_COLOR = Color.BLACK;
const AXIZ_COLOR = Color.GRAY;
const LINE_COLOR = Color.GRAY37;
const CIRCLE_COLOR = Color.BLACK;
const RADIUS_COLOR = Color.GREEN;
const SIN_COLOR = Color.RED;
const COS_COLOR = Color.BLUE;

const WAVE_WIDTH = 280;
const WAVE_HEIGHT = 100;
const UNIT_RADIUS = 100;
const GAP = 30;

let gDrawerCycleC = new Drawer("dispCycleC",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT + GAP
);
let gDrawerCycleS = new Drawer("dispCycleS",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT + GAP
);
let gDrawerCycleT = new Drawer("dispCycleT",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT * 2 + GAP * 2
);
let gDrawerSymmetry = new Drawer("dispSymmetry",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 3 + GAP
);
let gDrawerPhase180 = new Drawer("dispPhase180",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 3 + GAP
);
let gDrawerSymmetry180 = new Drawer("dispSymmetry180",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 3 + GAP
);

let gAxisListC = [];
let gAxisListS = [];
let gAxisListT = [];
let gAxisListSymmetry = [];
let gLabelListC = [];
let gLabelListS = [];
let gLabelListT = [];
let gLineC = [];
let gLineS = [];
let gLineT = [];

let gTheta = Math.PI * 5 / 16;

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
    gDrawerCycleC.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP/2); {
        gAxisListC.push(new LineInfo(
            0, -WAVE_HEIGHT*1.1/2,
            0, WAVE_HEIGHT*1.1/2,
            1, AXIZ_COLOR
        ));
        gAxisListC.push(new LineInfo(
            -WAVE_WIDTH/2, 0,
            +WAVE_WIDTH/2, 0,
            1, AXIZ_COLOR
        ));
        gLabelListC.push({
            pos: new vec(WAVE_WIDTH/2+17, 4),
            text: "[θ]"
        });
        gLabelListC.push({
            pos: new vec(WAVE_WIDTH/2+23, -14),
            text: "[rad]"
        });
        let div = 8;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
            case 8:
                h = 12;
                gLabelListC.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            case 2:
            case 6:
                h = 5;
                gLabelListC.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            default:
                h = 5; break;
            }
            gAxisListC.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        for(let x=-WAVE_WIDTH*1.1/2; x<WAVE_WIDTH*1.1/2; x++) {
            let th = 8*Math.PI * x / WAVE_WIDTH;
            gLineC.push(new vec(x, Math.cos(th) * WAVE_HEIGHT/2));
        }
    }
    gDrawerCycleS.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP/2); {
        gAxisListS.push(new LineInfo(
            0, -WAVE_HEIGHT*1.1/2,
            0, WAVE_HEIGHT*1.1/2,
            1, AXIZ_COLOR
        ));
        gAxisListS.push(new LineInfo(
            -WAVE_WIDTH/2, 0,
            +WAVE_WIDTH/2, 0,
            1, AXIZ_COLOR
        ));
        gLabelListS.push({
            pos: new vec(WAVE_WIDTH/2+17, 4),
            text: "[θ]"
        });
        gLabelListS.push({
            pos: new vec(WAVE_WIDTH/2+23, -14),
            text: "[rad]"
        });
        let div = 8;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
            case 8:
                h = 12;
                gLabelListS.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            case 2:
            case 6:
                h = 5;
                gLabelListS.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            default:
                h = 5; break;
            }
            gAxisListS.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        for(let x=-WAVE_WIDTH*1.1/2; x<WAVE_WIDTH*1.1/2; x++) {
            let th = 8*Math.PI * x / WAVE_WIDTH;
            gLineS.push(new vec(x, Math.sin(th) * WAVE_HEIGHT/2));
        }
    }
    gDrawerCycleT.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT + GAP); {
        gAxisListT.push(new LineInfo(
            0, -WAVE_HEIGHT-GAP,
            0, WAVE_HEIGHT+GAP,
            1, AXIZ_COLOR
        ));
        gAxisListT.push(new LineInfo(
            -WAVE_WIDTH/2, 0,
            +WAVE_WIDTH/2, 0,
            1, AXIZ_COLOR
        ));
        gLabelListT.push({
            pos: new vec(WAVE_WIDTH/2+17, 4),
            text: "[θ]"
        });
        gLabelListT.push({
            pos: new vec(WAVE_WIDTH/2+23, -14),
            text: "[rad]"
        });
        let div = 4;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
                h = 12;
                gLabelListT.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            case 2:
                h = 5;
                gLabelListT.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            default:
                h = 5; break;
            }
            gAxisListT.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        let tanList = [];
        for(let x=-WAVE_WIDTH*1.1/2; x<WAVE_WIDTH*1.1/2; x++) {
            let th = 4*Math.PI * x / WAVE_WIDTH;
            let t = Math.tan(th);
            if (overflowTan(t)) {
                for (let i = 0; i < tanList.length; i++) {
                    gLineT.push(tanList[i]);
                }
                tanList = [];
            } else {
                tanList.push(new vec(x, t * WAVE_HEIGHT/4));
            }
        }
        for (let i = 0; i < tanList.length; i++) {
            gLineT.push(tanList[i]);
        }
    }
    gDrawerSymmetry.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS*1.5 + GAP/2); {
        gAxisListSymmetry.push(new LineInfo(
            0, -UNIT_RADIUS*1.1,
            0, UNIT_RADIUS*1.1,
            1, AXIZ_COLOR
        ));
        gAxisListSymmetry.push(new LineInfo(
            -UNIT_RADIUS*1.1, 0,
            +UNIT_RADIUS*1.1, 0,
            1, AXIZ_COLOR
        ));
        gAxisListSymmetry.push(new LineInfo(
            UNIT_RADIUS, -UNIT_RADIUS*2,
            UNIT_RADIUS, UNIT_RADIUS*2,
            1, CIRCLE_COLOR
        ));
    }
    gDrawerPhase180.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS*1.5 + GAP/2);
    gDrawerSymmetry180.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS*1.5 + GAP/2);
}

function main() {
    gDrawerCycleC.clear(); {
        for (let i=0; i<gAxisListC.length; i++) {
            gAxisListC[i].draw(gDrawerCycleC);
        }
        gDrawerCycleC.drawPolyline(gLineC, LINE_COLOR, 1);
        for (let i=0; i<gLabelListC.length; i++) {
            let lbl = gLabelListC[i];
            gDrawerCycleC.drawStringC(lbl.pos, lbl.text, 14, TEXT_COLOR);
        }
        gDrawerCycleC.drawStringXY(-WAVE_WIDTH/2, WAVE_HEIGHT/2-3, "cosθ", 24);
    }

    gDrawerCycleS.clear(); {
        for (let i=0; i<gAxisListS.length; i++) {
            gAxisListS[i].draw(gDrawerCycleS);
        }
        gDrawerCycleS.drawPolyline(gLineS, LINE_COLOR, 1);
        for (let i=0; i<gLabelListS.length; i++) {
            let lbl = gLabelListS[i];
            gDrawerCycleS.drawStringC(lbl.pos, lbl.text, 14, TEXT_COLOR);
        }
        gDrawerCycleS.drawStringXY(-WAVE_WIDTH/2, WAVE_HEIGHT/2-3, "sinθ", 24);
    }

    gDrawerCycleT.clear(); {
        for (let i=0; i<gAxisListT.length; i++) {
            gAxisListT[i].draw(gDrawerCycleT);
        }
        gDrawerCycleT.drawPolyline(gLineT, LINE_COLOR, 1);
        for (let i=0; i<gLabelListT.length; i++) {
            let lbl = gLabelListT[i];
            gDrawerCycleT.drawStringC(lbl.pos, lbl.text, 14, TEXT_COLOR);
        }
        gDrawerCycleT.drawStringXY(-WAVE_WIDTH/2, WAVE_HEIGHT+12, "tanθ", 24);
    }

    gDrawerSymmetry.clear(); {
        gDrawerSymmetry.drawStringXY(-UNIT_RADIUS-15, UNIT_RADIUS*1.5-5, "θ+2nπ", 24);
        gDrawerSymmetry.drawStringXY(-UNIT_RADIUS-15, UNIT_RADIUS*1.5-26, "2nπ－θ", 24);
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerSymmetry);
        }
        gDrawerSymmetry.drawCircle(new vec(), UNIT_RADIUS, CIRCLE_COLOR);

        if (gDrawerSymmetry.isDrag) {
            gTheta = Math.atan2(gDrawerSymmetry.cursor.Y, gDrawerSymmetry.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = new vec();
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let vp_t = new vec(UNIT_RADIUS, limitTan(Math.tan(gTheta)) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        let vpm = new vec(Math.cos(-gTheta) * UNIT_RADIUS, Math.sin(-gTheta) * UNIT_RADIUS);
        let vpm_t = new vec(UNIT_RADIUS, limitTan(Math.tan(-gTheta)) * UNIT_RADIUS);
        gDrawerSymmetry.fillPolygon([vo, vpm, vp_c], gDrawerSymmetry.Offset, Color.GRAY75);
        gDrawerSymmetry.drawLine(vo, vp_c, COS_COLOR, 3);
        gDrawerSymmetry.drawLine(vp_c, vp, SIN_COLOR, 3);
        gDrawerSymmetry.drawLine(vo, vp, RADIUS_COLOR, 3);
        gDrawerSymmetry.drawLine(vp_c, vpm, SIN_COLOR, 3);
        gDrawerSymmetry.drawLine(vo, vpm, CIRCLE_COLOR, 3);
        gDrawerSymmetry.drawLine(vo, vpm_t, CIRCLE_COLOR, 3);
        gDrawerSymmetry.drawLine(vo, vp_t, RADIUS_COLOR, 3);
        gDrawerSymmetry.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawerSymmetry.fillCircle(vpm, 4, CIRCLE_COLOR);
        gDrawerSymmetry.fillCircle(vp_t, 4);
        gDrawerSymmetry.fillCircle(vpm_t, 4);
        gDrawerSymmetry.drawArc(new vec(), 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerSymmetry.drawArc(new vec(), 34, vpm.arg, 0, CIRCLE_COLOR, 2);

        let fA, fB;
        let rA, rB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = new vec(-1);
        } else {
            fA = vp;
            fB = new vec(1);
        }
        if (vpm.arg < 0) {
            rA = new vec(1);
            rB = vpm;
        } else {
            rA = new vec(-vpm.X, -vpm.Y);
            rB = new vec(-1);
        }
        gDrawerSymmetry.drawStringA(fA, vo, fB, "θ", 20, TEXT_COLOR, new vec(0, -7, 25));
        gDrawerSymmetry.drawStringA(rA, vo, rB, "-θ", 20, TEXT_COLOR, new vec(0, -7, 45));
    }

    gDrawerPhase180.clear(); {
        gDrawerPhase180.drawStringXY(-UNIT_RADIUS-15, UNIT_RADIUS*1.5-5, "θ+(2n+1)π", 24);
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerPhase180);
        }
        gDrawerPhase180.drawCircle(new vec(), UNIT_RADIUS, CIRCLE_COLOR);

        if (gDrawerPhase180.isDrag) {
            gTheta = Math.atan2(gDrawerPhase180.cursor.Y, gDrawerPhase180.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = new vec();
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let vp_t = new vec(UNIT_RADIUS, limitTan(Math.tan(gTheta)) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        let theta = gTheta + Math.PI;
        let vp180 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vp180_t = new vec(UNIT_RADIUS, limitTan(Math.tan(theta)) * UNIT_RADIUS);
        let vp180_c = new vec(vp180.X, 0);
        gDrawerPhase180.fillPolygon([vo, vp180, vp180_c], gDrawerPhase180.Offset, Color.GRAY75);
        gDrawerPhase180.drawLine(vo, vp_c, COS_COLOR, 3);
        gDrawerPhase180.drawLine(vp_c, vp, SIN_COLOR, 3);
        gDrawerPhase180.drawLine(vo, vp, RADIUS_COLOR, 3);
        gDrawerPhase180.drawLine(vo, vp180_c, COS_COLOR, 3);
        gDrawerPhase180.drawLine(vp180_c, vp180, SIN_COLOR, 3);
        gDrawerPhase180.drawLine(vo, vp180, CIRCLE_COLOR, 3);
        gDrawerPhase180.drawLine(vo, vp180_t, CIRCLE_COLOR, 7);
        gDrawerPhase180.drawLine(vo, vp_t, RADIUS_COLOR, 3);
        gDrawerPhase180.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawerPhase180.fillCircle(vp180, 4, CIRCLE_COLOR);
        gDrawerPhase180.fillCircle(vp180_t, 4);
        gDrawerPhase180.drawArc(new vec(), 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerPhase180.drawArc(new vec(), 36, vp.arg, vp180.arg, CIRCLE_COLOR, 2);

        let fA, fB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = new vec(-1);
            gDrawerPhase180.drawStringV(vp180, vp, "θ", 20, TEXT_COLOR, new vec(25, -4, 0.5));
        } else {
            fA = vp;
            fB = new vec(1);
            gDrawerPhase180.drawStringA(fA, vo, fB, "θ", 20, TEXT_COLOR, new vec(-15, -8, 40));
        }
        gDrawerPhase180.drawStringH(vp180, vp, "π", 20, TEXT_COLOR, new vec(0, 40, 0.5));
    }

    gDrawerSymmetry180.clear(); {
        gDrawerSymmetry180.drawStringXY(-UNIT_RADIUS-15, UNIT_RADIUS*1.5-5, "(2n+1)π－θ", 24);
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerSymmetry180);
        }
        gDrawerSymmetry180.drawCircle(new vec(), UNIT_RADIUS, CIRCLE_COLOR);

        if (gDrawerSymmetry180.isDrag) {
            gTheta = Math.atan2(gDrawerSymmetry180.cursor.Y, gDrawerSymmetry180.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = new vec();
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let vp_t = new vec(UNIT_RADIUS, limitTan(Math.tan(gTheta)) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        let theta = -gTheta;
        let vpm = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        theta += Math.PI;
        let vpm180 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vpm180_t = new vec(UNIT_RADIUS, limitTan(Math.tan(theta)) * UNIT_RADIUS);
        let vpm180_c = new vec(vpm180.X, 0);
        gDrawerSymmetry180.fillPolygon([vo, vpm180, vpm180_c], gDrawerPhase180.Offset, Color.GRAY75);
        gDrawerSymmetry180.drawLine(vo, vp_t, RADIUS_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vpm180_t, CIRCLE_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vp_c, COS_COLOR, 3);
        gDrawerSymmetry180.drawLine(vp_c, vp, SIN_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vp, RADIUS_COLOR, 3);
        gDrawerSymmetry180.drawLineD(vo, vpm, CIRCLE_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vpm180_c, COS_COLOR, 3);
        gDrawerSymmetry180.drawLine(vpm180_c, vpm180, SIN_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vpm180, CIRCLE_COLOR, 3);
        gDrawerSymmetry180.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawerSymmetry180.fillCircle(vpm180, 4, CIRCLE_COLOR);
        gDrawerSymmetry180.fillCircle(vp_t, 4);
        gDrawerSymmetry180.fillCircle(vpm180_t, 4);
        gDrawerSymmetry180.drawArc(new vec(), 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerSymmetry180.drawArc(new vec(), 34, vpm.arg, 0, CIRCLE_COLOR, 2);
        gDrawerSymmetry180.drawArc(new vec(), 60, vpm.arg, vpm180.arg, CIRCLE_COLOR, 2);

        let fA, fB;
        let rA, rB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = new vec(-1);
        } else {
            fA = vp;
            fB = new vec(1);
        }
        if (vpm.arg < 0) {
            rA = new vec(1);
            rB = vpm;
        } else {
            rA = new vec(-vpm.X, -vpm.Y);
            rB = new vec(-1);
        }
        gDrawerSymmetry180.drawStringA(fA, vo, fB, "θ", 20, TEXT_COLOR, new vec(0, -7, 25));
        gDrawerSymmetry180.drawStringA(rA, vo, rB, "-θ", 20, TEXT_COLOR, new vec(0, -7, 45));
        gDrawerSymmetry180.drawStringH(vpm180, vpm, "π", 20, TEXT_COLOR, new vec(0, 62, 0.5));
    }

    requestNextAnimationFrame(main);
}

function overflowTan(v) {
    if (100 < v) {
        return true;
    }
    if (v < -100) {
        return true;
    }
    return false;
}
function limitTan(v) {
    if (100 < v) {
        return 100;
    }
    if (v < -100) {
        return -100;
    }
    return v;
}
