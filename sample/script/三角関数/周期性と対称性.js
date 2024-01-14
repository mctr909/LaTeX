/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const TEXT_COLOR = Drawer.BLACK;
const AXIZ_COLOR = Drawer.BLACK;
const LINE_COLOR = [95,95,95];
const CIRCLE_COLOR = Drawer.BLACK;
const RADIUS_COLOR = Drawer.BLACK;
const KNOB_COLOR = Drawer.GREEN;

const WAVE_WIDTH = 240;
const WAVE_HEIGHT = 100;
const UNIT_RADIUS = 100;
const GAP = 25;

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
let gLabelListC = [];
let gLabelListS = [];
let gLabelListT = [];
let gLineC = [];
let gLineS = [];
let gLineT = [];

let gSymmetryTheta = Math.PI / 3;
let gSymmetry180Theta = Math.PI / 3;

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
    gDrawerCycleC.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP * 0.75); {
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
        for(let x=-WAVE_WIDTH/2; x<WAVE_WIDTH/2; x++) {
            let th = 8*Math.PI * x / WAVE_WIDTH;
            gLineC.push(new vec(x, Math.cos(th) * WAVE_HEIGHT/2));
        }
    }
    gDrawerCycleS.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP * 0.75); {
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
        for(let x=-WAVE_WIDTH/2; x<WAVE_WIDTH/2; x++) {
            let th = 8*Math.PI * x / WAVE_WIDTH;
            gLineS.push(new vec(x, Math.sin(th) * WAVE_HEIGHT/2));
        }
    }
    gDrawerCycleT.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT + GAP); {
        gAxisListT.push(new LineInfo(
            0, -WAVE_HEIGHT*1.1,
            0, WAVE_HEIGHT*1.1,
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
        for(let x=-WAVE_WIDTH/2; x<WAVE_WIDTH/2; x++) {
            let th = 4*Math.PI * x / WAVE_WIDTH;
            let t = Math.tan(th);
            if (t < -100 || t > 100) {
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
    gDrawerSymmetry.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP/2); {
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
    }
    gDrawerSymmetry180.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP/2);
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
    }

    gDrawerSymmetry.clear(); {
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerSymmetry);
        }
        gDrawerSymmetry.drawCircle(new vec(), UNIT_RADIUS, CIRCLE_COLOR);

        if (gDrawerSymmetry.isDrag) {
            gSymmetryTheta = Math.atan2(gDrawerSymmetry.cursor.Y, gDrawerSymmetry.cursor.X);
            if (gSymmetryTheta < 0) {
                gSymmetryTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gSymmetryTheta / Math.PI);
            gSymmetryTheta = deg * Math.PI / 180;
        }

        let vo = new vec();
        let vp = new vec(Math.cos(gSymmetryTheta) * UNIT_RADIUS, Math.sin(gSymmetryTheta) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        let vpm = new vec(Math.cos(-gSymmetryTheta) * UNIT_RADIUS, Math.sin(-gSymmetryTheta) * UNIT_RADIUS);
        gDrawerSymmetry.drawLine(vo, vp_c, Drawer.BLUE, 1, 5);
        gDrawerSymmetry.drawLine(vp_c, vp, Drawer.RED, 1, 5);
        gDrawerSymmetry.drawLine(vo, vp, RADIUS_COLOR, 1, 5);
        gDrawerSymmetry.drawLineD(vp_c, vpm, Drawer.RED, 1, 2);
        gDrawerSymmetry.drawLineD(vo, vpm, RADIUS_COLOR, 1, 2);
        gDrawerSymmetry.fillCircle(vp, 7, KNOB_COLOR);
        gDrawerSymmetry.fillCircle(vpm, 5);
    }

    gDrawerSymmetry180.clear(); {
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerSymmetry180);
        }
        gDrawerSymmetry180.drawCircle(new vec(), UNIT_RADIUS, CIRCLE_COLOR);

        if (gDrawerSymmetry180.isDrag) {
            gSymmetry180Theta = Math.atan2(gDrawerSymmetry180.cursor.Y, gDrawerSymmetry180.cursor.X);
            if (gSymmetry180Theta < 0) {
                gSymmetry180Theta += 2*Math.PI;
            }
            let deg = parseInt(180 * gSymmetry180Theta / Math.PI);
            gSymmetry180Theta = deg * Math.PI / 180;
        }

        let vo = new vec();
        let vp = new vec(Math.cos(gSymmetry180Theta) * UNIT_RADIUS, Math.sin(gSymmetry180Theta) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        let theta = gSymmetry180Theta + Math.PI;
        let vp180 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vp180_c = new vec(vp180.X, 0);
        theta = -gSymmetry180Theta + Math.PI;
        let vpm = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vpm_c = new vec(vpm.X, 0);

        gDrawerSymmetry180.drawLine(vo, vp_c, Drawer.BLUE, 1, 5);
        gDrawerSymmetry180.drawLine(vp_c, vp, Drawer.RED, 1, 5);
        gDrawerSymmetry180.drawLine(vo, vp, RADIUS_COLOR, 1, 5);
        gDrawerSymmetry180.drawLine(vo, vp180_c, Drawer.BLUE, 1, 2);
        gDrawerSymmetry180.drawLine(vp180_c, vp180, Drawer.RED, 1, 2);
        gDrawerSymmetry180.drawLine(vo, vp180, RADIUS_COLOR, 1, 2);
        gDrawerSymmetry180.drawLineD(vpm_c, vpm, Drawer.RED, 1, 2);
        gDrawerSymmetry180.drawLineD(vo, vpm, RADIUS_COLOR, 1, 2);
        gDrawerSymmetry180.fillCircle(vp, 7, KNOB_COLOR);
        gDrawerSymmetry180.fillCircle(vp180, 7);
        gDrawerSymmetry180.fillCircle(vpm, 5);
    }

    requestNextAnimationFrame(main);
}