/// <reference path="../../../script/drawer.js" />
/// <reference path="../../../script/math.js" />

const AXIZ_COLOR = Drawer.BLACK;
const MEASURE_COLOR = Drawer.BLACK;
const CIRCLE_COLOR = Drawer.GREEN;
const COS_COLOR = Drawer.BLUE;
const SIN_COLOR = Drawer.RED;
const TAN_COLOR = Drawer.ORANGE;
const UNIT_RADIUS = 75;
const WAVE_LENGTH = 360;
const GAP = 30;

/** @type{LineInfo[]} */
let gLineList = [];
let gLabelList = [];
/** @type{vec[]} */
let gSinLine = [];
/** @type{vec[]} */
let gCosLine = [];
/** @type{Array<vec[]>} */
let gTanLines = [];
let gRadius = 2.5;
let gTheta = Math.PI / 4;

let gCircleRadius = UNIT_RADIUS * gRadius;
let gWaveBegin = gCircleRadius + GAP;

let gDrawer = new Drawer("disp",
    gWaveBegin * 2 + WAVE_LENGTH + GAP,
    (WAVE_LENGTH + gCircleRadius + GAP) * 11/8 + 10
);

document.getElementById("trbR").addEventListener("input", function(ev) {
    init();
});

init();
requestNextAnimationFrame(main);

function init() {
    gLineList = [];
    gLabelList = [];
    gSinLine = [];
    gCosLine = [];
    gTanLines = [];

    gRadius = document.getElementById("trbR").value / 100.0;
    gCircleRadius = UNIT_RADIUS * gRadius;
    gWaveBegin = gCircleRadius + GAP;

    gDrawer.Offset = new vec(gWaveBegin, gDrawer.Height/4);

    gLineList.push(new LineInfo(
        -UNIT_RADIUS, 0,
        gWaveBegin + WAVE_LENGTH, 0,
        1, AXIZ_COLOR
    ));
    gLineList.push(new LineInfo(
        0, -gWaveBegin - WAVE_LENGTH,
        0, UNIT_RADIUS,
        1, AXIZ_COLOR
    ));
    for (let deg=0; deg<=360; deg += 15) {
        let x = gWaveBegin + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 15 : deg % 45 == 0 ? 10 : 5;
        gLineList.push(new LineInfo(
            x, -h,
            x, h,
            1, AXIZ_COLOR
        ));
        gLineList.push(new LineInfo(
            -h, -x,
            h, -x,
            1, AXIZ_COLOR
        ));
        if (deg % 90 == 0) {
            gLabelList.push({
                pos: new vec(x, -20),
                text: deg + "°\n" + (deg / 180) + "π",
                center: true
            });
            gLabelList.push({
                pos: new vec(17, -x+2),
                text: deg + "°\n" + (deg / 180) + "π",
                center: false
            });
        }
    }

    gLineList.push(new LineInfo(
        -UNIT_RADIUS, -gWaveBegin - WAVE_LENGTH,
        -UNIT_RADIUS, 0,
        1, MEASURE_COLOR,
        true
    ));
    gLineList.push(new LineInfo(
        0, UNIT_RADIUS,
        gWaveBegin + WAVE_LENGTH, UNIT_RADIUS,
        1, MEASURE_COLOR,
        true
    ));
    gLineList.push(new LineInfo(
        0, -UNIT_RADIUS,
        gWaveBegin + WAVE_LENGTH, -UNIT_RADIUS,
        1, MEASURE_COLOR,
        true
    ));
    gLineList.push(new LineInfo(
        UNIT_RADIUS, -gWaveBegin - WAVE_LENGTH,
        UNIT_RADIUS, gWaveBegin + WAVE_LENGTH,
        2, TAN_COLOR
    ));

    let tanList = [];
    for(let x=gWaveBegin; x<gWaveBegin + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - gWaveBegin) / WAVE_LENGTH;
        gCosLine.push(new vec(Math.cos(th) * gCircleRadius, -x));
        gSinLine.push(new vec(x, Math.sin(th) * gCircleRadius));
        var t = Math.tan(th) * UNIT_RADIUS;
        if (t < -10 * UNIT_RADIUS || t > 10 * UNIT_RADIUS) {
            if (0 < tanList.length) {
                gTanLines.push(tanList);
                tanList = [];
            }
            continue;
        }
        tanList.push(new vec(x, t));
    }
    if (0 < tanList.length) {
        gTanLines.push(tanList);
    }
}

function main() {
    gDrawer.clear();

    for (let i=0; i<gLineList.length; i++) {
        gLineList[i].draw(gDrawer);
    }
    for (let i=0; i<gLabelList.length; i++) {
        let lbl = gLabelList[i];
        if (lbl.center) {
            gDrawer.drawStringC(lbl.pos, lbl.text, 16);
        } else {
            gDrawer.drawString(lbl.pos, lbl.text, 16);
        }
    }

    gDrawer.drawCircleD(new vec(), UNIT_RADIUS, CIRCLE_COLOR);
    gDrawer.drawCircle(new vec(), gCircleRadius, CIRCLE_COLOR, 2);

    for (let i=0; i<gTanLines.length; i++) {
        let tanLine = gTanLines[i];
        gDrawer.drawPolyline(tanLine, TAN_COLOR);
    }
    gDrawer.drawPolyline(gCosLine, COS_COLOR);
    gDrawer.drawPolyline(gSinLine, SIN_COLOR);

    if (gDrawer.isDrag) {
        gTheta = Math.atan2(gDrawer.cursor.Y, gDrawer.cursor.X);
        if (gTheta < 0) {
            gTheta += 2*Math.PI;
        }
    }

    let x = gWaveBegin + gTheta * WAVE_LENGTH / Math.PI / 2;
    let vx = new vec(x, 0);
    let vy = new vec(0, -x);
    let vp = new vec(Math.cos(gTheta) * gCircleRadius, Math.sin(gTheta) * gCircleRadius);
    let vt = new vec(UNIT_RADIUS, Math.tan(gTheta) * UNIT_RADIUS);
    let vc = new vec(vp.X, 0);
    let wave_c = new vec(vp.X, -x);
    let wave_s = new vec(x, vp.Y);
    let wave_t = new vec(x, vt.Y);
    gDrawer.drawLine(new vec(), vp, CIRCLE_COLOR, 2);
    gDrawer.drawLine(vy, wave_c);
    gDrawer.drawLine(vx, wave_s);
    gDrawer.drawLine(vx, wave_t);
    gDrawer.drawLineD(vp, wave_c, COS_COLOR, 2);
    gDrawer.drawLineD(vp, wave_s, SIN_COLOR, 2);
    gDrawer.drawLineD(vt, wave_t, TAN_COLOR, 2);
    gDrawer.drawLineD(new vec(), vt);
    gDrawer.drawLine(new vec(), vc, COS_COLOR, 2);
    gDrawer.drawLine(vc, vp, SIN_COLOR, 2);
    gDrawer.fillCircle(vp, 4);
    gDrawer.fillCircle(vt, 4, TAN_COLOR);
    gDrawer.fillCircle(wave_c, 4, COS_COLOR);
    gDrawer.fillCircle(wave_s, 4, SIN_COLOR);
    gDrawer.fillCircle(wave_t, 4, TAN_COLOR);

    let lblR = new vec(vp.X * 0.5 - 5, vp.Y * 0.5 + 5);
    let lblC = new vec(vc.X * 0.5, -5);
    let lblS = new vec(vp.X + 3, vp.Y * 0.5 - 6);
    gDrawer.drawString(lblR, "r", 20);
    gDrawer.drawStringC(lblC, "c", 20);
    gDrawer.drawString(lblS, "s", 20);

    let rad = parseInt(1000 * gTheta / Math.PI + 0.5) / 1000;
    let deg = parseInt(1800 * gTheta / Math.PI + 0.5) / 10;
    let tc = parseInt(1000 * Math.cos(gTheta) * gRadius + 0.5) / 1000;
    let ts = parseInt(1000 * Math.sin(gTheta) * gRadius + 0.5) / 1000;
    document.getElementById("lblDisp").innerHTML
        = "θ = " + rad + "π (" + deg + "°)<br>"
        + "r = " + gRadius + "<br>"
        + "c = " + tc + "<br>"
        + "s = " + ts + "<br>"
        + "cosθ = " + parseInt(1000 * Math.cos(gTheta) + 0.5) / 1000 + "<br>"
        + "sinθ = " + parseInt(1000 * Math.sin(gTheta) + 0.5) / 1000 + "<br>"
        + "tanθ = " + parseInt(1000 * Math.sin(gTheta) / Math.cos(gTheta) + 0.5) / 1000
    ;

    requestNextAnimationFrame(main);
}
