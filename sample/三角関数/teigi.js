/// <reference path="../../script/drawer.js" />
/// <reference path="../../script/math.js" />
const AXIZ_COLOR = [0, 0, 0];
const MEASURE_COLOR = [167, 167, 167];
const COS_COLOR = [0, 0, 211];
const SIN_COLOR = [191, 0, 0];
const TAN_COLOR = [0, 191, 0];
const CIRCLE_COLOR = [0, 0, 0];
const CIRCLE_RADIUS = 80;
const WAVE_LENGTH = 360;
const WAVE_BEGIN = CIRCLE_RADIUS + 20;

let MeasureList = [];
let LabelList = [];
let SinLine = [];
let CosLine = [];
let TanLines = [];

let gDrawer = new Drawer("disp", 700, 800);
init();

function init() {
    gDrawer.Offset = new vec3(gDrawer.Width/4, 3 * gDrawer.Height/8);

    MeasureList.push({
        a:new vec3(-WAVE_BEGIN, 0),
        b:new vec3(500, 0),
        color:AXIZ_COLOR
    });
    MeasureList.push({
        a:new vec3(0, -500),
        b:new vec3(0, WAVE_BEGIN),
        color:AXIZ_COLOR
    });
    MeasureList.push({
        a:new vec3(CIRCLE_RADIUS, -500),
        b:new vec3(CIRCLE_RADIUS, 500),
        color:MEASURE_COLOR
    });
    MeasureList.push({
        a:new vec3(-CIRCLE_RADIUS, -500),
        b:new vec3(-CIRCLE_RADIUS, 0),
        color:MEASURE_COLOR
    });
    MeasureList.push({
        a:new vec3(0, CIRCLE_RADIUS),
        b:new vec3(500, CIRCLE_RADIUS),
        color:MEASURE_COLOR
    });
    MeasureList.push({
        a:new vec3(0, -CIRCLE_RADIUS),
        b:new vec3(500, -CIRCLE_RADIUS),
        color:MEASURE_COLOR
    });

    for (let deg=0; deg<=360; deg += 15) {
        let x = WAVE_BEGIN + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 15 : deg % 45 == 0 ? 10 : 5;
        MeasureList.push({
            a:new vec3(x, -h),
            b:new vec3(x, h),
            color:AXIZ_COLOR
        });
        MeasureList.push({
            a:new vec3(-h, -x),
            b:new vec3(h, -x),
            color:AXIZ_COLOR
        });
        if (deg % 90 == 0) {
            LabelList.push({
                pos: new vec3(x-5, -30),
                text: deg + "\n" + (deg / 180) + "π"
            });
            LabelList.push({
                pos: new vec3(20, -x-5),
                text: deg + "\n" + (deg / 180) + "π"
            });
        }
    }

    let tanList = [];
    for(let x=WAVE_BEGIN; x<WAVE_BEGIN + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - WAVE_BEGIN) / WAVE_LENGTH;
        CosLine.push(new vec3(Math.cos(th) * CIRCLE_RADIUS, -x));
        SinLine.push(new vec3(x, Math.sin(th) * CIRCLE_RADIUS));
        var t = Math.tan(th) * CIRCLE_RADIUS;
        if (t < -500 || t > 500) {
            if (0 < tanList.length) {
                TanLines.push(tanList);
                tanList = [];
            }
            continue;
        }
        tanList.push(new vec3(x, t));
    }
    if (0 < tanList.length) {
        TanLines.push(tanList);
    }
    requestNextAnimationFrame(main);
}

function main() {
    gDrawer.clear();

    for (let i=0; i<MeasureList.length; i++) {
        gDrawer.drawLine(MeasureList[i].a, MeasureList[i].b, MeasureList[i].color, 1);
    }
    for (let i=0; i<LabelList.length; i++) {
        gDrawer.drawString(LabelList[i].pos, LabelList[i].text, 16);
    }

    gDrawer.drawCircle(new vec3(), CIRCLE_RADIUS, CIRCLE_COLOR, 2);
    for (let i=0; i<TanLines.length; i++) {
        let tanLine = TanLines[i];
        gDrawer.drawPolyline(tanLine, TAN_COLOR);
    }
    gDrawer.drawPolyline(CosLine, COS_COLOR);
    gDrawer.drawPolyline(SinLine, SIN_COLOR);

    requestNextAnimationFrame(main);
}
