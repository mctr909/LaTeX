/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Drawer.BLACK;
const MEASURE_COLOR = Drawer.BLACK;
const RULER_COLOR = Drawer.GRAY;
const CIRCLE_COLOR = Drawer.BLACK;
const KNOB_COLOR = Drawer.GREEN;
const COS_COLOR = Drawer.BLUE;
const SIN_COLOR = Drawer.RED;
const TAN_COLOR = Drawer.BLACK;
const UNIT_RADIUS = 60;
const WAVE_LENGTH = 240;
const GAP = 40;

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
        -gCircleRadius - 10, 0,
        gWaveBegin + WAVE_LENGTH, 0,
        0.5, AXIZ_COLOR
    ));
    gLineList.push(new LineInfo(
        0, -gWaveBegin - WAVE_LENGTH,
        0, gCircleRadius + 10,
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
        UNIT_RADIUS, -gDrawer.Height,
        UNIT_RADIUS, gDrawer.Height,
        0.5, TAN_COLOR, true
    ));
    gLineList.push(new LineInfo(
        gCircleRadius, -gDrawer.Height,
        gCircleRadius, gDrawer.Height,
        1, TAN_COLOR
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
        tanList.push(new vec(x, t * UNIT_RADIUS));
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
    gDrawer.drawCircleD(new vec(), UNIT_RADIUS, CIRCLE_COLOR, 0.5);
    gDrawer.drawCircle(new vec(), gCircleRadius, CIRCLE_COLOR);

    for (let i=0; i<gTanLines.length; i++) {
        let tanLine = gTanLines[i];
        gDrawer.drawPolyline(tanLine, TAN_COLOR, 1);
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
    let vo = new vec();
    let vp = new vec(Math.cos(gTheta) * gCircleRadius, Math.sin(gTheta) * gCircleRadius);
    let vt = new vec(UNIT_RADIUS, UNIT_RADIUS * Math.tan(gTheta));
    let vrt = new vec(gCircleRadius, gCircleRadius * Math.tan(gTheta));
    let vc = new vec(vp.X, 0);
    let wave_c = new vec(vp.X, -x);
    let wave_s = new vec(x, vp.Y);
    let wave_t = new vec(x, vt.Y);

    let dangle = vp.arg;
    if (dangle < 0) {
        dangle += 2*Math.PI;
    }
    gDrawer.drawArc(new vec(), 18, 0, dangle, CIRCLE_COLOR, 3);

    gDrawer.drawLine(vx, wave_t, RULER_COLOR);
    gDrawer.drawLine(vy, wave_c, RULER_COLOR);
    gDrawer.drawLine(vx, wave_s, RULER_COLOR);
    gDrawer.drawLine(vt, wave_t, TAN_COLOR);
    gDrawer.drawLine(vp, wave_c, COS_COLOR);
    gDrawer.drawLine(vp, wave_s, SIN_COLOR);
    gDrawer.drawLine(vo, vrt, TAN_COLOR, 1);
    gDrawer.drawLine(vo, vt, TAN_COLOR, 1);
    gDrawer.drawLine(vo, vc, COS_COLOR, 1, 4);
    gDrawer.drawLine(vc, vp, SIN_COLOR, 1, 4);
    gDrawer.drawLine(vo, vp, KNOB_COLOR, 1, 4);
    gDrawer.fillCircle(vrt, 3, TAN_COLOR);
    gDrawer.fillCircle(vt, 5, TAN_COLOR);
    gDrawer.fillCircle(vp, 5, KNOB_COLOR);
    gDrawer.fillCircle(wave_t, 3, TAN_COLOR);
    gDrawer.fillCircle(wave_c, 3, COS_COLOR);
    gDrawer.fillCircle(wave_s, 3, SIN_COLOR);

    for (let i=0; i<gLabelList.length; i++) {
        let lbl = gLabelList[i];
        if (lbl.center) {
            gDrawer.drawStringC(lbl.pos, lbl.text, 14);
        } else {
            gDrawer.drawString(lbl.pos, lbl.text, 14);
        }
    }

    let lblrT = new vec(vrt.X - 12, vrt.Y + 6);
    let lblT = new vec(vt.X - 6, vt.Y + 6);
    let lblP = new vec(vp.X - 6, vp.Y + 6);
    let lblR = new vec(vp.X * 0.5 - 5, vp.Y * 0.5 + 5);
    let lblX = new vec(vc.X * 0.5, -5);
    let lblY = new vec(vp.X + 3, vp.Y * 0.5 - 3);
    let lblRT = new vec(wave_t.X - 40, wave_t.Y + 3);
    let lblRC = new vec(wave_c.X + 2, wave_c.Y - 11);
    let lblRS = new vec(wave_s.X - 44, wave_s.Y + 3);
    gDrawer.drawStringXY(17, 3, "θ", 18);
    gDrawer.drawString(lblrT, "rT", 18);
    gDrawer.drawString(lblT, "T", 18);
    gDrawer.drawString(lblP, "P", 18);
    gDrawer.drawString(lblR, "r", 20);
    gDrawer.drawStringC(lblX, "x", 20);
    gDrawer.drawString(lblY, "y", 20);
    gDrawer.drawString(lblRT, "tanθ", 18);
    gDrawer.drawString(lblRC, "r cosθ", 18);
    gDrawer.drawString(lblRS, "r sinθ", 18);

    var tan = round1d(Math.sin(gTheta) / Math.cos(gTheta), 1, 3);
    document.getElementById("lblR").innerHTML = gRadius;
    document.getElementById("lblX").innerHTML = round1d(Math.cos(gTheta) * gRadius, 1, 3);
    document.getElementById("lblY").innerHTML = round1d(Math.sin(gTheta) * gRadius, 1, 3);
    document.getElementById("lblCos").innerHTML = round1d(Math.cos(gTheta), 1, 3);
    document.getElementById("lblSin").innerHTML = round1d(Math.sin(gTheta), 1, 3);
    document.getElementById("lblTan").innerHTML = 1000 < tan ? "∞" : (tan < -1000 ? "-∞" : tan);

    requestNextAnimationFrame(main);
}
