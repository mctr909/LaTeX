/// <reference path="../../../script/drawer.js" />
/// <reference path="../../../script/math.js" />

const AXIZ_COLOR = [0, 0, 0];
const MEASURE_COLOR = [167, 167, 167];
const COS_COLOR = [0, 0, 211];
const SIN_COLOR = [211, 0, 0];
const RADIUS = 50;
const WAVE_LENGTH = 400;
const WAVE_BEGIN = 20;

let MeasureList = [];
let LabelList = [];
let Cos2Line = [];
let Sin2Line = [];

let gDrawer1 = new Drawer("disp1", 500, 150);
let gDrawer2 = new Drawer("disp2", 500, 150);
let gDrawer3 = new Drawer("disp3", 500, 150);
init();

function init() {
    gDrawer1.Offset = new vec(20, gDrawer1.Height/2);
    gDrawer2.Offset = new vec(20, gDrawer2.Height/2);
    gDrawer3.Offset = new vec(20, gDrawer3.Height/2);

    MeasureList.push({
        a:new vec(-WAVE_BEGIN, 0),
        b:new vec(500, 0),
        color:AXIZ_COLOR
    });
    MeasureList.push({
        a:new vec(0, RADIUS),
        b:new vec(500, RADIUS),
        color:MEASURE_COLOR
    });
    MeasureList.push({
        a:new vec(0, -RADIUS),
        b:new vec(500, -RADIUS),
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
        if (deg % 90 == 0) {
            LabelList.push({
                pos: new vec(x-10, -30),
                text: deg + "°\n" + (deg / 180) + "π"
            });
        }
    }

    for(let x=WAVE_BEGIN; x<WAVE_BEGIN + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - WAVE_BEGIN) / WAVE_LENGTH;
        let c = Math.cos(th);
        let s = Math.sin(th);
        Cos2Line.push(new vec(x, c*c * RADIUS));
        Sin2Line.push(new vec(x, s*s * RADIUS));
    }

    requestNextAnimationFrame(main);
}

function main() {
    gDrawer1.clear();
    gDrawer2.clear();
    gDrawer3.clear();

    for (let i=0; i<MeasureList.length; i++) {
        gDrawer1.drawLine(MeasureList[i].a, MeasureList[i].b, MeasureList[i].color);
        gDrawer2.drawLine(MeasureList[i].a, MeasureList[i].b, MeasureList[i].color);
        gDrawer3.drawLine(MeasureList[i].a, MeasureList[i].b, MeasureList[i].color);
    }
    for (let i=0; i<LabelList.length; i++) {
        gDrawer1.drawString(LabelList[i].pos, LabelList[i].text, 16);
        gDrawer2.drawString(LabelList[i].pos, LabelList[i].text, 16);
        gDrawer3.drawString(LabelList[i].pos, LabelList[i].text, 16);
    }

    gDrawer1.drawPolyline(Cos2Line, COS_COLOR);
    gDrawer1.drawPolyline(Sin2Line, SIN_COLOR);
    gDrawer2.drawPolylineD(Sin2Line, SIN_COLOR);
    gDrawer2.drawPolyline(Cos2Line, COS_COLOR);
    gDrawer3.drawPolylineD(Cos2Line, COS_COLOR);
    gDrawer3.drawPolyline(Sin2Line, SIN_COLOR);

    requestNextAnimationFrame(main);
}
