/// <reference path="../../../script/drawer.js" />
/// <reference path="../../../script/math.js" />

const AXIZ_COLOR = [0, 0, 0];
const MEASURE_COLOR = [167, 167, 167];
const COS_COLOR = [0, 0, 211];
const SIN_COLOR = [211, 0, 0];
const TAN_COLOR = [0, 191, 0];
const CIRCLE_COLOR = [0, 0, 0];
const CIRCLE_RADIUS = 100;
const WAVE_LENGTH = 360;
const WAVE_BEGIN = CIRCLE_RADIUS + 30;

let gMeasureList = [];
let gLabelList = [];
let gSinLine = [];
let gCosLine = [];
let gTanLines = [];
let gTheta = Math.PI / 4;

let gDrawer = new Drawer("disp", 700, 800);
init();

function init() {
    gDrawer.Offset = new vec(WAVE_BEGIN, gDrawer.Height*3/8);

    gMeasureList.push({
        a:new vec(-CIRCLE_RADIUS, -500),
        b:new vec(-CIRCLE_RADIUS, 0),
        color:MEASURE_COLOR
    });
    gMeasureList.push({
        a:new vec(0, CIRCLE_RADIUS),
        b:new vec(500, CIRCLE_RADIUS),
        color:MEASURE_COLOR
    });
    gMeasureList.push({
        a:new vec(0, -CIRCLE_RADIUS),
        b:new vec(500, -CIRCLE_RADIUS),
        color:MEASURE_COLOR
    });
    gMeasureList.push({
        a:new vec(-WAVE_BEGIN, 0),
        b:new vec(500, 0),
        color:AXIZ_COLOR
    });
    gMeasureList.push({
        a:new vec(0, -500),
        b:new vec(0, WAVE_BEGIN),
        color:AXIZ_COLOR
    });
    gMeasureList.push({
        a:new vec(CIRCLE_RADIUS, -500),
        b:new vec(CIRCLE_RADIUS, 500),
        color:AXIZ_COLOR
    });

    for (let deg=0; deg<=360; deg += 15) {
        let x = WAVE_BEGIN + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 15 : deg % 45 == 0 ? 10 : 5;
        gMeasureList.push({
            a:new vec(x, -h),
            b:new vec(x, h),
            color:AXIZ_COLOR
        });
        gMeasureList.push({
            a:new vec(-h, -x),
            b:new vec(h, -x),
            color:AXIZ_COLOR
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
    for(let x=WAVE_BEGIN; x<WAVE_BEGIN + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - WAVE_BEGIN) / WAVE_LENGTH;
        gCosLine.push(new vec(Math.cos(th) * CIRCLE_RADIUS, -x));
        gSinLine.push(new vec(x, Math.sin(th) * CIRCLE_RADIUS));
        var t = Math.tan(th) * CIRCLE_RADIUS;
        if (t < -500 || t > 500) {
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
    requestNextAnimationFrame(main);
}

function main() {
    gDrawer.clear();

    for (let i=0; i<gMeasureList.length; i++) {
        gDrawer.drawLine(gMeasureList[i].a, gMeasureList[i].b, gMeasureList[i].color);
    }
    for (let i=0; i<gLabelList.length; i++) {
        gDrawer.drawString(gLabelList[i].pos, gLabelList[i].text, 16);
    }

    gDrawer.drawCircle(new vec(), CIRCLE_RADIUS, CIRCLE_COLOR, 2);

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

    let pr = new vec(Math.cos(gTheta) * CIRCLE_RADIUS, Math.sin(gTheta) * CIRCLE_RADIUS);
    let vt = new vec(CIRCLE_RADIUS, Math.tan(gTheta) * CIRCLE_RADIUS);
    let x = WAVE_BEGIN + gTheta * WAVE_LENGTH / Math.PI / 2;
    let pv = new vec(0, -x);
    let ph = new vec(x, 0);
    let oc = new vec(pr.X, 0);
    let pc = new vec(pr.X, -x);
    let ps = new vec(x, pr.Y);
    let pt = new vec(x, vt.Y);
    let hpr = new vec(pr.X * 0.45 - 5, pr.Y * 0.45 + 5);
    let hpc = new vec(oc.X * 0.45, -20);
    let hps = new vec(pr.X, pr.Y * 0.45 - 5);

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

    let rad = parseInt(1000 * gTheta / Math.PI + 0.5) / 1000;
    let deg = parseInt(1800 * gTheta / Math.PI + 0.5) / 10;
    gDrawer.drawString(new vec(5, 2), deg + "°\n" + rad + "π", 16);
    gDrawer.drawString(hpr, "r", 24);
    gDrawer.drawString(hpc, "c", 24);
    gDrawer.drawString(hps, "s", 24);

    requestNextAnimationFrame(main);
}
