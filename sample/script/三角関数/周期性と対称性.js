/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const TEXT_COLOR = Color.BLACK;
const AXIZ_COLOR = Color.GRAY66;
const LINE_COLOR = Color.GRAY;
const CIRCLE_COLOR = Color.BLACK;
const RADIUS_COLOR = Color.GREEN;
const SIN_COLOR = Color.RED;
const COS_COLOR = Color.BLUE;

const WAVE_WIDTH = 220;
const WAVE_HEIGHT = 40;
const UNIT_RADIUS = 80;
const GAP = 30;

let gDrawerC = new Drawer("dispC",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT + GAP
);
let gDrawerS = new Drawer("dispS",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT + GAP
);
let gDrawerT = new Drawer("dispT",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT * 2 + GAP * 2
);
let gDrawerSymmetry = new Drawer("dispSymmetry",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 2 + GAP
);
let gDrawerPhase180 = new Drawer("dispPhase180",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 2 + GAP
);
let gDrawerSymmetry180 = new Drawer("dispSymmetry180",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 2 + GAP
);

let gAxisListC = [];
let gAxisListS = [];
let gAxisListT = [];
let gAxisListSymmetry = [];
let gLineC = [];
let gLineS = [];
let gLinesT = [];

let gTheta = Math.PI * 7 / 32;

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
    gDrawerC.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP*3/4); {
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
        gDrawerC.pushString(
            -WAVE_WIDTH/2-13, WAVE_HEIGHT/2+8,
            "cosθ",
            20, false
        );
        gDrawerC.pushString(WAVE_WIDTH/2+17, 4, "[θ]");
        gDrawerC.pushString(WAVE_WIDTH/2+23, -10, "[rad]");
        let div = 8;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
            case 8:
                h = 10;
                gDrawerC.pushString(x, -10, toFrac(v/2, "π", false));
                break;
            case 2:
            case 6:
                h = 5;
                gDrawerC.pushString(x, -10, toFrac(v/2, "π", false));
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
    gDrawerS.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP*3/4); {
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
        gDrawerS.pushString(
            -WAVE_WIDTH/2-13, WAVE_HEIGHT/2+8,
            "sinθ",
            20, false
        );
        gDrawerS.pushString(WAVE_WIDTH/2+17, 4, "[θ]");
        gDrawerS.pushString(WAVE_WIDTH/2+23, -10, "[rad]");
        let div = 8;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
            case 8:
                h = 10;
                gDrawerS.pushString(x, -10, toFrac(v/2, "π", false));
                break;
            case 2:
            case 6:
                h = 5;
                gDrawerS.pushString(x, -10, toFrac(v/2, "π", false));
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
    gDrawerT.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT + GAP); {
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
        gDrawerT.pushString(
            -WAVE_WIDTH/2-13, WAVE_HEIGHT+15,
            "tanθ",
            20, false
        );
        gDrawerT.pushString(WAVE_WIDTH/2+17, 4, "[θ]");
        gDrawerT.pushString(WAVE_WIDTH/2+23, -12, "[rad]");
        let div = 4;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
                h = 10;
                gDrawerT.pushString(x, -12, toFrac(v/2, "π", false));
                break;
            case 2:
                h = 5;
                gDrawerT.pushString(x, -12, toFrac(v/2, "π", false));
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
                if (0 < tanList.length) {
                    gLinesT.push(tanList);
                }
                tanList = [];
            } else {
                tanList.push(new vec(x, t * WAVE_HEIGHT/4));
            }
        }
        if (0 < tanList.length) {
            gLinesT.push(tanList);
        }
    }
    gDrawerSymmetry.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP*0.75); {
        gDrawerSymmetry.pushString(-UNIT_RADIUS-12, UNIT_RADIUS+8, "2nπ－θ", 18, false);
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
    gDrawerPhase180.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP*0.75); {
        gDrawerPhase180.pushString(-UNIT_RADIUS-12, UNIT_RADIUS+8, "θ+(2n+1)π", 18, false);
    }
    gDrawerSymmetry180.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP*0.75); {
        gDrawerSymmetry180.pushString(-UNIT_RADIUS-12, UNIT_RADIUS+8, "(2n+1)π－θ", 18, false);
    }
}

function main() {
    gDrawerC.clear(); {
        for (let i=0; i<gAxisListC.length; i++) {
            gAxisListC[i].draw(gDrawerC);
        }
        gDrawerC.drawPolyline(gLineC, LINE_COLOR, 1);
        gDrawerC.drawStringList();
    }
    gDrawerS.clear(); {
        for (let i=0; i<gAxisListS.length; i++) {
            gAxisListS[i].draw(gDrawerS);
        }
        gDrawerS.drawPolyline(gLineS, LINE_COLOR, 1);
        gDrawerS.drawStringList();
    }
    gDrawerT.clear(); {
        for (let i=0; i<gAxisListT.length; i++) {
            gAxisListT[i].draw(gDrawerT);
        }
        for (let i=0; i<gLinesT.length; i++) {
            gDrawerT.drawPolyline(gLinesT[i], LINE_COLOR, 1);
        }
        gDrawerT.drawStringList();
    }

    gDrawerSymmetry.clear(); {
        gDrawerSymmetry.drawStringList();
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerSymmetry);
        }

        if (gDrawerSymmetry.isDrag) {
            gTheta = Math.atan2(gDrawerSymmetry.cursor.Y, gDrawerSymmetry.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = vec.zero;
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let vp_t = new vec(UNIT_RADIUS, limitTan(Math.tan(gTheta)) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        let vpm = new vec(Math.cos(-gTheta) * UNIT_RADIUS, Math.sin(-gTheta) * UNIT_RADIUS);
        let vpm_t = new vec(UNIT_RADIUS, limitTan(Math.tan(-gTheta)) * UNIT_RADIUS);

        gDrawerSymmetry.drawCircle(vo, UNIT_RADIUS, CIRCLE_COLOR);
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
        gDrawerSymmetry.drawArc(vo, 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerSymmetry.drawArc(vo, 34, vpm.arg, 0, CIRCLE_COLOR, 2);

        let fA, fB;
        let rA, rB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = vec.unitXr;
        } else {
            fA = vp;
            fB = vec.unitX;
        }
        if (vpm.arg < 0) {
            rA = vec.unitX;
            rB = vpm;
        } else {
            rA = new vec(-vpm.X, -vpm.Y);
            rB = vec.unitXr;
        }
        gDrawerSymmetry.drawStringA(fA, vo, fB, "θ", 18, TEXT_COLOR, new vec(0, -7, 25));
        gDrawerSymmetry.drawStringA(rA, vo, rB, "-θ", 18, TEXT_COLOR, new vec(1, -7, 45));
    }
    gDrawerPhase180.clear(); {
        gDrawerPhase180.drawStringList();
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerPhase180);
        }

        if (gDrawerPhase180.isDrag) {
            gTheta = Math.atan2(gDrawerPhase180.cursor.Y, gDrawerPhase180.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = vec.zero;
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let vp_t = new vec(UNIT_RADIUS, limitTan(Math.tan(gTheta)) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        let theta = gTheta + Math.PI;
        let vp180 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vp180_t = new vec(UNIT_RADIUS, limitTan(Math.tan(theta)) * UNIT_RADIUS);
        let vp180_c = new vec(vp180.X, 0);

        gDrawerPhase180.drawCircle(vo, UNIT_RADIUS, CIRCLE_COLOR);
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
        gDrawerPhase180.drawArc(vo, 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerPhase180.drawArc(vo, 36, Math.PI, vp180.arg, CIRCLE_COLOR, 2);

        if (vp.arg < 0) {
            gDrawerPhase180.drawStringV(vp180, vp, "θ", 18, TEXT_COLOR, new vec(25, -3, 0.5));
        } else {
            gDrawerPhase180.drawStringA(vp, vo, vec.unitX, "θ", 18, TEXT_COLOR, new vec(-15, -7, 40));
        }
        if (vp180.arg < 0) {
            gDrawerPhase180.drawStringA(vp180, vo, vec.unitXr, "θ", 18, TEXT_COLOR, new vec(-17, -7, 60));
        } else {
            gDrawerPhase180.drawStringV(vp, vp180, "θ", 18, TEXT_COLOR, new vec(43, -3, 0.5));
        }
    }
    gDrawerSymmetry180.clear(); {
        gDrawerSymmetry180.drawStringList();
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerSymmetry180);
        }

        if (gDrawerSymmetry180.isDrag) {
            gTheta = Math.atan2(gDrawerSymmetry180.cursor.Y, gDrawerSymmetry180.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = vec.zero;
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let vp_t = new vec(UNIT_RADIUS, limitTan(Math.tan(gTheta)) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        let theta = Math.PI - gTheta;
        let vpm180 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vpm180_t = new vec(UNIT_RADIUS, limitTan(Math.tan(theta)) * UNIT_RADIUS);
        let vpm180_c = new vec(vpm180.X, 0);

        gDrawerSymmetry180.drawCircle(vo, UNIT_RADIUS, CIRCLE_COLOR);
        gDrawerSymmetry180.fillPolygon([vo, vpm180, vpm180_c], gDrawerSymmetry180.Offset, Color.GRAY75);
        gDrawerSymmetry180.drawLine(vo, vp_t, RADIUS_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vpm180_t, CIRCLE_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vp_c, COS_COLOR, 3);
        gDrawerSymmetry180.drawLine(vp_c, vp, SIN_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vp, RADIUS_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vpm180_c, COS_COLOR, 3);
        gDrawerSymmetry180.drawLine(vpm180_c, vpm180, SIN_COLOR, 3);
        gDrawerSymmetry180.drawLine(vo, vpm180, CIRCLE_COLOR, 3);
        gDrawerSymmetry180.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawerSymmetry180.fillCircle(vpm180, 4, CIRCLE_COLOR);
        gDrawerSymmetry180.fillCircle(vp_t, 4);
        gDrawerSymmetry180.fillCircle(vpm180_t, 4);
        gDrawerSymmetry180.drawArc(vo, 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerSymmetry180.drawArc(vo, 34, vpm180.arg, Math.PI, CIRCLE_COLOR, 2);

        let fA, fB;
        let rA, rB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = vec.unitXr;
        } else {
            fA = vp;
            fB = vec.unitX;
        }
        if (vpm180.arg < 0) {
            rA = vec.unitX;
            rB = new vec(-vpm180.X, -vpm180.Y);
        } else {
            rA = vpm180;
            rB = vec.unitXr;
        }
        gDrawerSymmetry180.drawStringA(fA, vo, fB, "θ", 18, TEXT_COLOR, new vec(0, -7, 25));
        gDrawerSymmetry180.drawStringA(rA, vo, rB, "-θ", 18, TEXT_COLOR, new vec(0, -7, -45));
    }

    requestNextAnimationFrame(main);
}

function overflowTan(v) {
    if (10 < v) {
        return true;
    }
    if (v < -10) {
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
