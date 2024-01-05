/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Drawer.BLACK;
const MEASURE_COLOR = Drawer.BLACK;
const CIRCLE_COLOR = Drawer.BLACK;
const COS_COLOR = Drawer.BLACK;
const SIN_COLOR = Drawer.BLACK;
const TAN_COLOR = Drawer.BLACK;
const UNIT_RADIUS = 80;
const WAVE_LENGTH = 240;
const GAP = 50;

/** @type{LineInfo[]} */
let gLineList = [];
let gLabelList = [];
/** @type{vec[]} */
let gRSinLine = [];
/** @type{vec[]} */
let gRCosLine = [];
/** @type{Array<vec[]>} */
let gTanLines = [];
let gRadius = 2;
let gTheta = Math.PI / 4;

let gCircleRadius = UNIT_RADIUS * gRadius;
let gWaveBegin = gCircleRadius + GAP;

let gDrawer = new Drawer("disp",
    gWaveBegin * 2 + WAVE_LENGTH,
    (WAVE_LENGTH + gCircleRadius + GAP) * 1.5 + 40
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
    gTanLines = [];

    gRadius = document.getElementById("trbR").value / 4.0;
    gCircleRadius = UNIT_RADIUS * gRadius;
    gWaveBegin = UNIT_RADIUS * 2 + GAP;

    gDrawer.Offset = new vec(gWaveBegin - GAP + 5, gDrawer.Height / 4 + 40);

    gLineList.push(new LineInfo(
        -gCircleRadius, 0,
        gWaveBegin + WAVE_LENGTH, 0,
        0.5, AXIZ_COLOR
    ));
    gLineList.push(new LineInfo(
        0, -gWaveBegin - WAVE_LENGTH,
        0, gCircleRadius,
        0.5, AXIZ_COLOR
    ));
    for (let deg=0; deg<=360; deg += 15) {
        let x = gWaveBegin + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 11 : deg % 45 == 0 ? 7 : 3;
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
                pos: new vec(x, -18),
                text: toFrac(deg / 180, "") + "\n" + deg,
                center: true
            });
            gLabelList.push({
                pos: new vec(15, -x+2),
                text: toFrac(deg / 180, "") + "\n" + deg,
                center: false
            });
        }
        if (deg == 360) {
            gLabelList.push({
                pos: new vec(x+30, -18),
                text: "[π]\n[°]",
                center: true
            });
            gLabelList.push({
                pos: new vec(15, -x-30),
                text: "[π]\n[°]",
                center: false
            });
        }
    }

    gLineList.push(new LineInfo(
        gCircleRadius, -gDrawer.Height,
        gCircleRadius, gDrawer.Height,
        1, TAN_COLOR, true
    ));

    let tanList = [];
    for(let x=gWaveBegin; x<gWaveBegin + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - gWaveBegin) / WAVE_LENGTH;
        gRCosLine.push(new vec(Math.cos(th) * gCircleRadius, -x));
        gRSinLine.push(new vec(x, Math.sin(th) * gCircleRadius));
        var t = Math.tan(th);
        if (t < -20 || t > 20) {
            if (0 < tanList.length) {
                gTanLines.push(tanList);
                tanList = [];
            }
            continue;
        }
        tanList.push(new vec(x, t * gCircleRadius));
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
            gDrawer.drawStringC(lbl.pos, lbl.text, 14);
        } else {
            gDrawer.drawString(lbl.pos, lbl.text, 14);
        }
    }

    gDrawer.drawCircle(new vec(), gCircleRadius, CIRCLE_COLOR, 0.5);

    for (let i=0; i<gTanLines.length; i++) {
        let tanLine = gTanLines[i];
        gDrawer.drawPolylineD(tanLine, TAN_COLOR, 1);
    }
    gDrawer.drawPolyline(gRCosLine, COS_COLOR, 0.5);
    gDrawer.drawPolyline(gRSinLine, SIN_COLOR, 0.5);

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
    let vt = new vec(gCircleRadius, Math.tan(gTheta) * gCircleRadius);
    let vc = new vec(vp.X, 0);
    let wave_c = new vec(vp.X, -x);
    let wave_s = new vec(x, vp.Y);
    let wave_t = new vec(x, vt.Y);

    let dangle = vp.arg;
    if (dangle < 0) {
        dangle += 2*Math.PI;
    }
    gDrawer.drawArc(new vec(), 18, 0, dangle, CIRCLE_COLOR, 3);

    gDrawer.drawLine(vy, wave_c);
    gDrawer.drawLine(vx, wave_s);
    gDrawer.drawLine(vx, wave_t);
    gDrawer.drawLine(vp, wave_c, COS_COLOR, 0.5);
    gDrawer.drawLine(vp, wave_s, SIN_COLOR, 0.5);
    gDrawer.drawLine(vt, wave_t, TAN_COLOR, 0.5);
    gDrawer.drawLine(vzero, vt, TAN_COLOR, 1);
    gDrawer.drawLine(vzero, vc, COS_COLOR, 1, 4);
    gDrawer.drawLine(vc, vp, SIN_COLOR, 1, 4);
    gDrawer.drawLine(vzero, vp, CIRCLE_COLOR, 1, 4);
    gDrawer.fillCircle(vp, 5, CIRCLE_COLOR);
    gDrawer.fillCircle(vt, 5, TAN_COLOR);
    gDrawer.fillCircle(wave_c, 3, COS_COLOR);
    gDrawer.fillCircle(wave_s, 3, SIN_COLOR);
    gDrawer.fillCircle(wave_t, 3, TAN_COLOR);

    let lblP = new vec(vp.X - 6, vp.Y + 6);
    let lblT = new vec(gCircleRadius - 6, wave_t.Y + 6);
    let lblR = new vec(vp.X * 0.5 - 5, vp.Y * 0.5 + 5);
    let lblX = new vec(vc.X * 0.5, -5);
    let lblY = new vec(vp.X + 3, vp.Y * 0.5 - 3);
    let lblRC = new vec(wave_c.X + 2, wave_c.Y - 11);
    let lblRS = new vec(wave_s.X - 54, wave_s.Y + 3);
    let lblRT = new vec(wave_t.X - 56, wave_t.Y + 3);
    gDrawer.drawStringXY(17, 3, "θ", 20);
    gDrawer.drawString(lblP, "P", 20);
    gDrawer.drawString(lblT, "T", 20);
    gDrawer.drawString(lblR, "r", 24);
    gDrawer.drawStringC(lblX, "x", 24);
    gDrawer.drawString(lblY, "y", 24);
    gDrawer.drawString(lblRC, "r cosθ", 20);
    gDrawer.drawString(lblRS, "r sinθ", 20);
    gDrawer.drawString(lblRT, "r tanθ", 20);

    var tan = round1d(Math.sin(gTheta) / Math.cos(gTheta), 1, 3);
    document.getElementById("lblR").innerHTML = gRadius;
    document.getElementById("lblX").innerHTML = round1d(Math.cos(gTheta) * gRadius, 1, 3);
    document.getElementById("lblY").innerHTML = round1d(Math.sin(gTheta) * gRadius, 1, 3);
    document.getElementById("lblCos").innerHTML = round1d(Math.cos(gTheta), 1, 3);
    document.getElementById("lblSin").innerHTML = round1d(Math.sin(gTheta), 1, 3);
    document.getElementById("lblTan").innerHTML = 1000 < tan ? "∞" : (tan < -1000 ? "-∞" : tan);

    requestNextAnimationFrame(main);
}
