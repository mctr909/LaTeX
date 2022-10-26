/// <reference path="../../../script/drawer.js" />
/// <reference path="../../../script/math.js" />

const AXIZ_COLOR = [0, 0, 0];
const MEASURE_COLOR = [167, 167, 167];
const COS_COLOR = [0, 0, 211];
const SIN_COLOR = [211, 0, 0];
const TAN_COLOR = [0, 191, 0];
const CIRCLE_COLOR = [0, 0, 0];
const CIRCLE_RADIUS = 150;
const WAVE_LENGTH = 300;
const WAVE_BEGIN = CIRCLE_RADIUS + 30;

let MeasureList = [];
let LabelList = [];
let SinLine = [];
let CosLine = [];
let TanLines = [];
let Theta = Math.PI / 4;

let gDrawer = new Drawer("disp", 700, 800);
init();

function init() {
    gDrawer.Offset = new vec(5*gDrawer.Width/16, gDrawer.Height*3/8);

    MeasureList.push({
        a:new vec(-WAVE_BEGIN, 0),
        b:new vec(500, 0),
        color:AXIZ_COLOR
    });
    MeasureList.push({
        a:new vec(0, -500),
        b:new vec(0, WAVE_BEGIN),
        color:AXIZ_COLOR
    });
    MeasureList.push({
        a:new vec(CIRCLE_RADIUS, -500),
        b:new vec(CIRCLE_RADIUS, 500),
        color:AXIZ_COLOR
    });
    MeasureList.push({
        a:new vec(-CIRCLE_RADIUS, -500),
        b:new vec(-CIRCLE_RADIUS, 0),
        color:MEASURE_COLOR
    });
    MeasureList.push({
        a:new vec(0, CIRCLE_RADIUS),
        b:new vec(500, CIRCLE_RADIUS),
        color:MEASURE_COLOR
    });
    MeasureList.push({
        a:new vec(0, -CIRCLE_RADIUS),
        b:new vec(500, -CIRCLE_RADIUS),
        color:MEASURE_COLOR
    });

    for (let deg=0; deg<=360; deg += 15) {
        let x = WAVE_BEGIN + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 15 : deg % 45 == 0 ? 10 : 5;
        MeasureList.push({
            a:new vec(x, -h),
            b:new vec(x, h),
            color:AXIZ_COLOR
        });
        MeasureList.push({
            a:new vec(-h, -x),
            b:new vec(h, -x),
            color:AXIZ_COLOR
        });
        if (deg % 90 == 0) {
            LabelList.push({
                pos: new vec(x-10, -30),
                text: deg + "°\n" + (deg / 180) + "π"
            });
            LabelList.push({
                pos: new vec(20, -x+2),
                text: deg + "°\n" + (deg / 180) + "π"
            });
        }
    }

    let tanList = [];
    for(let x=WAVE_BEGIN; x<WAVE_BEGIN + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - WAVE_BEGIN) / WAVE_LENGTH;
        CosLine.push(new vec(Math.cos(th) * CIRCLE_RADIUS, -x));
        SinLine.push(new vec(x, Math.sin(th) * CIRCLE_RADIUS));
        var t = Math.tan(th) * CIRCLE_RADIUS;
        if (t < -500 || t > 500) {
            if (0 < tanList.length) {
                TanLines.push(tanList);
                tanList = [];
            }
            continue;
        }
        tanList.push(new vec(x, t));
    }
    if (0 < tanList.length) {
        TanLines.push(tanList);
    }
    requestNextAnimationFrame(main);
}

function main() {
    gDrawer.clear();

    for (let i=0; i<MeasureList.length; i++) {
        gDrawer.drawLine(MeasureList[i].a, MeasureList[i].b, MeasureList[i].color);
    }
    for (let i=0; i<LabelList.length; i++) {
        gDrawer.drawString(LabelList[i].pos, LabelList[i].text, 16);
    }

    gDrawer.drawCircle(new vec(), CIRCLE_RADIUS, CIRCLE_COLOR, 2);

    for (let i=0; i<TanLines.length; i++) {
        let tanLine = TanLines[i];
        gDrawer.drawPolyline(tanLine, TAN_COLOR);
    }
    gDrawer.drawPolyline(CosLine, COS_COLOR);
    gDrawer.drawPolyline(SinLine, SIN_COLOR);

    if (gDrawer.isDrag) {
        Theta = Math.atan2(gDrawer.cursor.Y, gDrawer.cursor.X);
        if (Theta < 0) {
            Theta += 2*Math.PI;
        }
    }

    let pr = new vec(Math.cos(Theta) * CIRCLE_RADIUS, Math.sin(Theta) * CIRCLE_RADIUS);
    let vt = new vec(CIRCLE_RADIUS, Math.tan(Theta) * CIRCLE_RADIUS);
    let x = WAVE_BEGIN + Theta * WAVE_LENGTH / Math.PI / 2;
    let pv = new vec(0, -x);
    let ph = new vec(x, 0);
    let pc = new vec(pr.X, -x);
    let ps = new vec(x, pr.Y);
    let pt = new vec(x, vt.Y);
    gDrawer.drawLine(new vec(), pr, CIRCLE_COLOR, 2);
    gDrawer.drawLine(pv, pc);
    gDrawer.drawLine(ph, ps);
    gDrawer.drawLine(ph, pt);
    gDrawer.drawLineD(pr, pc, COS_COLOR, 2);
    gDrawer.drawLineD(pr, ps, SIN_COLOR, 2);
    gDrawer.drawLineD(vt, pt, TAN_COLOR, 2);
    gDrawer.drawLineD(new vec(), vt);
    gDrawer.fillCircle(pr, 4);
    gDrawer.fillCircle(pc, 4, COS_COLOR);
    gDrawer.fillCircle(ps, 4, SIN_COLOR);
    gDrawer.fillCircle(vt, 4, TAN_COLOR);
    gDrawer.fillCircle(pt, 4, TAN_COLOR);

    let rad = parseInt(1000 * Theta / Math.PI + 0.5) / 1000;
    let deg = parseInt(1800 * Theta / Math.PI + 0.5) / 10;
    gDrawer.drawString(new vec(5, 2), deg + "°\n" + rad + "π", 16);

    requestNextAnimationFrame(main);
}
