/// <reference path="../../../script/drawer.js" />
/// <reference path="../../../script/math.js" />

const AXIZ_COLOR = [0, 0, 0];
const CIRCLE_COLOR = [0, 0, 0];
const COS_COLOR = [0, 0, 211];
const SIN_COLOR = [211, 0, 0];
const TAN_COLOR = [0, 191, 0];
const UNIT_RADIUS = 75;
const WAVE_LENGTH = 360;
const GAP = 30;

let gMeasureList = [];
let gLabelList = [];
let gSinLine = [];
let gCosLine = [];
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
    gMeasureList = [];
    gLabelList = [];
    gSinLine = [];
    gCosLine = [];
    gTanLines = [];

    gRadius = document.getElementById("trbR").value / 100.0;
    gCircleRadius = UNIT_RADIUS * gRadius;
    gWaveBegin = gCircleRadius + GAP;

    gDrawer.Offset = new vec(gWaveBegin, gDrawer.Height/4);

    gMeasureList.push({
        a:new vec(-UNIT_RADIUS, -gWaveBegin - WAVE_LENGTH),
        b:new vec(-UNIT_RADIUS, 0),
        color:AXIZ_COLOR,
        dot: true
    });
    gMeasureList.push({
        a:new vec(0, UNIT_RADIUS),
        b:new vec(gWaveBegin + WAVE_LENGTH, UNIT_RADIUS),
        color:AXIZ_COLOR,
        dot: true
    });
    gMeasureList.push({
        a:new vec(0, -UNIT_RADIUS),
        b:new vec(gWaveBegin + WAVE_LENGTH, -UNIT_RADIUS),
        color:AXIZ_COLOR,
        dot: true
    });
    gMeasureList.push({
        a:new vec(-UNIT_RADIUS, 0),
        b:new vec(gWaveBegin + WAVE_LENGTH, 0),
        color:AXIZ_COLOR,
        dot: false
    });
    gMeasureList.push({
        a:new vec(0, -gWaveBegin - WAVE_LENGTH),
        b:new vec(0, UNIT_RADIUS),
        color:AXIZ_COLOR,
        dot: false
    });
    gMeasureList.push({
        a:new vec(UNIT_RADIUS, -gWaveBegin - WAVE_LENGTH),
        b:new vec(UNIT_RADIUS, gWaveBegin + WAVE_LENGTH),
        color:TAN_COLOR,
        dot: false
    });

    for (let deg=0; deg<=360; deg += 15) {
        let x = gWaveBegin + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 15 : deg % 45 == 0 ? 10 : 5;
        gMeasureList.push({
            a:new vec(x, -h),
            b:new vec(x, h),
            color:AXIZ_COLOR,
            dot: false
        });
        gMeasureList.push({
            a:new vec(-h, -x),
            b:new vec(h, -x),
            color:AXIZ_COLOR,
            dot: false
        });
        if (deg % 90 == 0) {
            gLabelList.push({
                pos: new vec(x-10, -30),
                text: deg + "°\n" + (deg / 180) + "π"
            });
            gLabelList.push({
                pos: new vec(20, -x+2),
                text: deg + "°\n" + (deg / 180) + "π"
            });
        }
    }

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

    for (let i=0; i<gMeasureList.length; i++) {
        if (gMeasureList[i].dot) {
            gDrawer.drawLineD(gMeasureList[i].a, gMeasureList[i].b, gMeasureList[i].color);
        } else {
            gDrawer.drawLine(gMeasureList[i].a, gMeasureList[i].b, gMeasureList[i].color);
        }
    }
    for (let i=0; i<gLabelList.length; i++) {
        gDrawer.drawString(gLabelList[i].pos, gLabelList[i].text, 16);
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

    let pr = new vec(Math.cos(gTheta) * gCircleRadius, Math.sin(gTheta) * gCircleRadius);
    let vt = new vec(UNIT_RADIUS, Math.tan(gTheta) * UNIT_RADIUS);
    let x = gWaveBegin + gTheta * WAVE_LENGTH / Math.PI / 2;
    let pv = new vec(0, -x);
    let ph = new vec(x, 0);
    let oc = new vec(pr.X, 0);
    let pc = new vec(pr.X, -x);
    let ps = new vec(x, pr.Y);
    let pt = new vec(x, vt.Y);
    let lblR = new vec(pr.X * 0.45 - 5, pr.Y * 0.45 + 5);
    let lblC = new vec(oc.X * 0.5 - 5, -13);
    let lblS = new vec(pr.X + 3, pr.Y * 0.5 - 6);

    gDrawer.drawLine(new vec(), pr, CIRCLE_COLOR, 2);
    gDrawer.drawLine(pv, pc);
    gDrawer.drawLine(ph, ps);
    gDrawer.drawLine(ph, pt);
    gDrawer.drawLineD(pr, pc, COS_COLOR, 2);
    gDrawer.drawLineD(pr, ps, SIN_COLOR, 2);
    gDrawer.drawLineD(vt, pt, TAN_COLOR, 2);
    gDrawer.drawLineD(new vec(), vt);
    gDrawer.drawLine(new vec(), oc, COS_COLOR, 2);
    gDrawer.drawLine(oc, pr, SIN_COLOR, 2);
    gDrawer.fillCircle(pr, 4);
    gDrawer.fillCircle(pc, 4, COS_COLOR);
    gDrawer.fillCircle(ps, 4, SIN_COLOR);
    gDrawer.fillCircle(vt, 4, TAN_COLOR);
    gDrawer.fillCircle(pt, 4, TAN_COLOR);

    gDrawer.drawString(lblR, "r", 20);
    gDrawer.drawString(lblC, "c", 20);
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
