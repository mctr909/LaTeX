/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Drawer.BLACK;
const MEASURE_COLOR = Drawer.BLACK;
const CIRCLE_COLOR = Drawer.GREEN;
const COS_COLOR = Drawer.BLUE;
const SIN_COLOR = Drawer.RED;
const TAN_COLOR = Drawer.ORANGE;
const UNIT_RADIUS = 75;
const WAVE_LENGTH = 360;
const GAP = 50;

/** @type{LineInfo[]} */
let gLineList = [];
let gLabelList = [];
/** @type{vec[]} */
let gRSinLine = [];
/** @type{vec[]} */
let gRCosLine = [];
/** @type{vec[]} */
let gSinLine = [];
/** @type{vec[]} */
let gCosLine = [];
/** @type{Array<vec[]>} */
let gTanLines = [];
let gRadius = 2;
let gTheta = Math.PI / 4;

let gCircleRadius = UNIT_RADIUS * gRadius;
let gWaveBegin = gCircleRadius + GAP;

let gDrawer = new Drawer("disp",
    gWaveBegin * 2 + WAVE_LENGTH + GAP,
    (WAVE_LENGTH + gCircleRadius + GAP) * 1.66 + 10
);

document.getElementById("trbR").addEventListener("input", function(ev) {
    init();
});

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }

    gLineList = [];
    gLabelList = [];
    gRSinLine = [];
    gRCosLine = [];
    gSinLine = [];
    gCosLine = [];
    gTanLines = [];

    gRadius = document.getElementById("trbR").value / 100.0;
    gCircleRadius = UNIT_RADIUS * gRadius;
    gWaveBegin = gCircleRadius + GAP;

    gDrawer.Offset = new vec(gWaveBegin, gDrawer.Height/4);

    gLineList.push(new LineInfo(
        -Math.max(UNIT_RADIUS, gCircleRadius), 0,
        gWaveBegin + WAVE_LENGTH, 0,
        0.5, AXIZ_COLOR
    ));
    gLineList.push(new LineInfo(
        0, -gWaveBegin - WAVE_LENGTH,
        0, Math.max(UNIT_RADIUS, gCircleRadius),
        0.5, AXIZ_COLOR
    ));
    gLineList.push(new LineInfo(
        0, gCircleRadius,
        gWaveBegin + WAVE_LENGTH, gCircleRadius,
        0.5, SIN_COLOR
    ));
    gLineList.push(new LineInfo(
        0, -gCircleRadius,
        gWaveBegin + WAVE_LENGTH, -gCircleRadius,
        0.5, SIN_COLOR
    ));
    gLineList.push(new LineInfo(
        gCircleRadius, -gWaveBegin - WAVE_LENGTH,
        gCircleRadius, 0,
        0.5, COS_COLOR
    ));
    gLineList.push(new LineInfo(
        -gCircleRadius, -gWaveBegin - WAVE_LENGTH,
        -gCircleRadius, 0,
        0.5, COS_COLOR
    ));
    for (let deg=0; deg<=360; deg += 15) {
        let x = gWaveBegin + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 13 : deg % 45 == 0 ? 7 : 3;
        gLineList.push(new LineInfo(
            x, -h,
            x, h,
            0.5, AXIZ_COLOR
        ));
        gLineList.push(new LineInfo(
            -h, -x,
            h, -x,
            0.5, AXIZ_COLOR
        ));
        if (deg % 45 == 0) {
            gLabelList.push({
                pos: new vec(x, -20),
                text: toFrac(deg / 180, "π", false) + "\n" + deg + "°",
                center: true
            });
            gLabelList.push({
                pos: new vec(17, -x+2),
                text: toFrac(deg / 180, "π", false) + "\n" + deg + "°",
                center: false
            });
        }
    }

    gLineList.push(new LineInfo(
        UNIT_RADIUS, -gWaveBegin - WAVE_LENGTH,
        UNIT_RADIUS, gWaveBegin + WAVE_LENGTH,
        1, TAN_COLOR
    ));

    let tanList = [];
    for(let x=gWaveBegin; x<gWaveBegin + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - gWaveBegin) / WAVE_LENGTH;
        gRCosLine.push(new vec(Math.cos(th) * gCircleRadius, -x));
        gRSinLine.push(new vec(x, Math.sin(th) * gCircleRadius));
        gCosLine.push(new vec(Math.cos(th) * UNIT_RADIUS, -x));
        gSinLine.push(new vec(x, Math.sin(th) * UNIT_RADIUS));
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

    gDrawer.drawCircleD(new vec(), UNIT_RADIUS, MEASURE_COLOR);
    gDrawer.drawCircle(new vec(), gCircleRadius, CIRCLE_COLOR);

    for (let i=0; i<gTanLines.length; i++) {
        let tanLine = gTanLines[i];
        gDrawer.drawPolyline(tanLine, TAN_COLOR, 0.5);
    }
    gDrawer.drawPolyline(gRCosLine, COS_COLOR, 0.5);
    gDrawer.drawPolyline(gRSinLine, SIN_COLOR, 0.5);
    gDrawer.drawPolylineD(gCosLine, COS_COLOR, 0.5);
    gDrawer.drawPolylineD(gSinLine, SIN_COLOR, 0.5);

    if (gDrawer.isDrag) {
        gTheta = Math.atan2(gDrawer.cursor.Y, gDrawer.cursor.X);
        if (gTheta < 0) {
            gTheta += 2*Math.PI;
        }
    }

    let x = gWaveBegin + gTheta * WAVE_LENGTH / Math.PI / 2;
    let vx = new vec(x, 0);
    let vy = new vec(0, -x);
    let vzero = new vec();
    let vp = new vec(Math.cos(gTheta) * gCircleRadius, Math.sin(gTheta) * gCircleRadius);
    let vt = new vec(UNIT_RADIUS, Math.tan(gTheta) * UNIT_RADIUS);
    let vc = new vec(vp.X, 0);
    let wave_c = new vec(vp.X, -x);
    let wave_s = new vec(x, vp.Y);
    let wave_t = new vec(x, vt.Y);
    gDrawer.drawLineV(vy, wave_c);
    gDrawer.drawLineV(vx, wave_s);
    gDrawer.drawLineV(vx, wave_t);
    gDrawer.drawLineVD(vp, wave_c, COS_COLOR);
    gDrawer.drawLineVD(vp, wave_s, SIN_COLOR);
    gDrawer.drawLineVD(vt, wave_t, TAN_COLOR);
    gDrawer.drawLineV(vzero, vt, TAN_COLOR, 1, 4);
    gDrawer.drawLineV(vzero, vc, COS_COLOR, 1, 4);
    gDrawer.drawLineV(vc, vp, SIN_COLOR, 1, 4);
    gDrawer.drawLineV(vzero, vp, CIRCLE_COLOR, 1, 4);
    gDrawer.fillCircle(vp, 5, CIRCLE_COLOR);
    gDrawer.fillCircle(vt, 5, TAN_COLOR);
    gDrawer.fillCircle(wave_c, 3, COS_COLOR);
    gDrawer.fillCircle(wave_s, 3, SIN_COLOR);
    gDrawer.fillCircle(wave_t, 3, TAN_COLOR);

    let dangle = vp.arg;
    if (dangle < 0) {
        dangle += 2*Math.PI;
    }
    gDrawer.drawArc(new vec(), 16, 0, dangle, CIRCLE_COLOR, 2);

    let lblR = new vec(vp.X * 0.5 - 5, vp.Y * 0.5 + 5);
    let lblC = new vec(vc.X * 0.5, -5);
    let lblS = new vec(vp.X + 3, vp.Y * 0.5 - 6);
    gDrawer.drawString(new vec(16,3), "θ", 20);
    gDrawer.drawString(lblR, "r", 24);
    gDrawer.drawStringC(lblC, "c", 24);
    gDrawer.drawString(lblS, "s", 24);

    var tan = round1d(Math.sin(gTheta) / Math.cos(gTheta), 1, 3);
    document.getElementById("lblR").innerHTML = gRadius;
    document.getElementById("lblC").innerHTML = round1d(Math.cos(gTheta) * gRadius, 1, 3);
    document.getElementById("lblS").innerHTML = round1d(Math.sin(gTheta) * gRadius, 1, 3);
    document.getElementById("lblCos").innerHTML = round1d(Math.cos(gTheta), 1, 3);
    document.getElementById("lblSin").innerHTML = round1d(Math.sin(gTheta), 1, 3);
    document.getElementById("lblTan").innerHTML = 1000 < tan ? "∞" : (tan < -1000 ? "-∞" : tan);

    requestNextAnimationFrame(main);
}
