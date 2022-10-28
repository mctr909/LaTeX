/// <reference path="math.js" />
/// <reference path="drawer.js" />

const AXIZ_COLOR = Drawer.BLACK;
const MEASURE_COLOR = Drawer.GRAY;
const COS_COLOR = Drawer.BLUE;
const SIN_COLOR = Drawer.RED;
const RADIUS = 100;
const WAVE_LENGTH = 360;
const WAVE_BEGIN = 10;

let gMeasureList = [];
let gLabelList = [];
let gCos2Line = [];
let gSin2Line = [];
let gCosLine = [];
let gSinLine = [];
let gCSLine = [];
let gSCLine = [];
let gTheta1 = Math.PI/6;
let gTheta2 = Math.PI/6;
let gTheta3 = Math.PI/6;
let gTheta4 = Math.PI/6;
let gTheta5 = Math.PI/6;
let gDrawer1 = new Drawer("disp1", WAVE_LENGTH + 80, RADIUS * 9 / 4);
let gDrawer2 = new Drawer("disp2", WAVE_LENGTH + 80, RADIUS * 9 / 4);
let gDrawer3 = new Drawer("disp3", WAVE_LENGTH + 80, 7 * RADIUS / 4);
let gDrawer4 = new Drawer("disp4", WAVE_LENGTH + 80, RADIUS * 9 / 4);
let gDrawer5 = new Drawer("disp5", WAVE_LENGTH + 80, RADIUS * 9 / 4);
gDrawer1.Offset = new vec(20, RADIUS+10);
gDrawer2.Offset = new vec(20, RADIUS+10);
gDrawer3.Offset = new vec(20, RADIUS+10);
gDrawer4.Offset = new vec(20, RADIUS+10);
gDrawer5.Offset = new vec(20, RADIUS+10);
init();

function init() {
    gMeasureList.push({
        a:new vec(-WAVE_BEGIN, 0),
        b:new vec(500, 0),
        color:AXIZ_COLOR
    });
    gMeasureList.push({
        a:new vec(0, RADIUS),
        b:new vec(500, RADIUS),
        color:MEASURE_COLOR
    });
    gMeasureList.push({
        a:new vec(0, -RADIUS),
        b:new vec(500, -RADIUS),
        color:MEASURE_COLOR
    });

    for (let deg=0; deg<=360; deg += 15) {
        let x = WAVE_BEGIN + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 15 : deg % 45 == 0 ? 10 : 5;
        gMeasureList.push({
            a:new vec(x, -h),
            b:new vec(x, h),
            color:AXIZ_COLOR
        });
        if (deg % 90 == 0) {
            gLabelList.push({
                pos: new vec(x-10, -30),
                text: deg + "°\n" + (deg / 180) + "π"
            });
        }
    }

    for(let x=WAVE_BEGIN; x<WAVE_BEGIN + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - WAVE_BEGIN) / WAVE_LENGTH;
        let c = Math.cos(th);
        let s = Math.sin(th);
        gCosLine.push(new vec(x, c * RADIUS));
        gSinLine.push(new vec(x, s * RADIUS));
        gCos2Line.push(new vec(x, c*c * RADIUS));
        gSin2Line.push(new vec(x, s*s * RADIUS));
        gCSLine.push(new vec(x, (c*c - s*s) * RADIUS));
        gSCLine.push(new vec(x, (s*s - c*c) * RADIUS));
    }

    requestNextAnimationFrame(main);
}

function main() {
    gDrawer1.clear();
    gDrawer2.clear();
    gDrawer3.clear();
    gDrawer4.clear();
    gDrawer5.clear();

    for (let i=0; i<gMeasureList.length; i++) {
        gDrawer1.drawLine(gMeasureList[i].a, gMeasureList[i].b, gMeasureList[i].color);
        gDrawer2.drawLine(gMeasureList[i].a, gMeasureList[i].b, gMeasureList[i].color);
        gDrawer3.drawLine(gMeasureList[i].a, gMeasureList[i].b, gMeasureList[i].color);
        gDrawer4.drawLine(gMeasureList[i].a, gMeasureList[i].b, gMeasureList[i].color);
        gDrawer5.drawLine(gMeasureList[i].a, gMeasureList[i].b, gMeasureList[i].color);
    }
    for (let i=0; i<gLabelList.length; i++) {
        gDrawer1.drawString(gLabelList[i].pos, gLabelList[i].text, 16);
        gDrawer2.drawString(gLabelList[i].pos, gLabelList[i].text, 16);
        gDrawer3.drawString(gLabelList[i].pos, gLabelList[i].text, 16);
        gDrawer4.drawString(gLabelList[i].pos, gLabelList[i].text, 16);
        gDrawer5.drawString(gLabelList[i].pos, gLabelList[i].text, 16);
    }
    gDrawer1.drawPolylineD(gCosLine);
    gDrawer1.drawPolyline(gCos2Line, COS_COLOR);
    gDrawer2.drawPolylineD(gSinLine);
    gDrawer2.drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer3.drawPolyline(gCos2Line, COS_COLOR);
    gDrawer3.drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer4.drawPolyline(gCos2Line, COS_COLOR);
    gDrawer4.drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer4.drawPolyline(gCSLine);
    gDrawer5.drawPolyline(gCos2Line, COS_COLOR);
    gDrawer5.drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer5.drawPolyline(gSCLine);

    if (gDrawer1.isDrag) {
        gTheta1 = 2 * Math.PI * (gDrawer1.cursor.X - WAVE_BEGIN) / WAVE_LENGTH;
        if (gTheta1 < 0) {
            gTheta1 = 0;
        }
        if (2 * Math.PI < gTheta1) {
            gTheta1 = 2 * Math.PI;
        }
    }
    if (gDrawer2.isDrag) {
        gTheta2 = 2 * Math.PI * (gDrawer2.cursor.X - WAVE_BEGIN) / WAVE_LENGTH;
        if (gTheta2 < 0) {
            gTheta2 = 0;
        }
        if (2 * Math.PI < gTheta2) {
            gTheta2 = 2 * Math.PI;
        }
    }
    if (gDrawer3.isDrag) {
        gTheta3 = 2 * Math.PI * (gDrawer3.cursor.X - WAVE_BEGIN) / WAVE_LENGTH;
        if (gTheta3 < 0) {
            gTheta3 = 0;
        }
        if (2 * Math.PI < gTheta3) {
            gTheta3 = 2 * Math.PI;
        }
    }
    if (gDrawer4.isDrag) {
        gTheta4 = 2 * Math.PI * (gDrawer4.cursor.X - WAVE_BEGIN) / WAVE_LENGTH;
        if (gTheta4 < 0) {
            gTheta4 = 0;
        }
        if (2 * Math.PI < gTheta4) {
            gTheta4 = 2 * Math.PI;
        }
    }
    if (gDrawer5.isDrag) {
        gTheta5 = 2 * Math.PI * (gDrawer5.cursor.X - WAVE_BEGIN) / WAVE_LENGTH;
        if (gTheta5 < 0) {
            gTheta5 = 0;
        }
        if (2 * Math.PI < gTheta5) {
            gTheta5 = 2 * Math.PI;
        }
    }

    {
        let px = gTheta1 * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(gTheta1);
        let vc1 = new vec(px, pc * RADIUS);
        let vc2 = new vec(px, pc * pc * RADIUS);
        gDrawer1.drawLine(new vec(px, 0), vc1);
        gDrawer1.drawLine(new vec(px, 0), vc2);
        gDrawer1.fillCircle(vc1, 3);
        gDrawer1.fillCircle(vc2, 3, COS_COLOR);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        document.getElementById("lblDisp1").innerHTML
            = dc + " x " + dc + " = " + parseInt(1000 * dc * dc + 0.5) / 1000;
        ;
    }
    {
        let px = gTheta2 * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let ps = Math.sin(gTheta2);
        let vs1 = new vec(px, ps * RADIUS);
        let vs2 = new vec(px, ps * ps * RADIUS);
        gDrawer2.drawLine(new vec(px, 0), vs1);
        gDrawer2.drawLine(new vec(px, 0), vs2);
        gDrawer2.fillCircle(vs1, 3);
        gDrawer2.fillCircle(vs2, 3, SIN_COLOR);
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp2").innerHTML
            = ds + " x " + ds + " = " + parseInt(1000 * ds * ds + 0.5) / 1000;
        ;
    }
    {
        let px = gTheta3 * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(gTheta3) * Math.cos(gTheta3);
        let ps = Math.sin(gTheta3) * Math.sin(gTheta3);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        gDrawer3.drawLine(new vec(px, 0), vc);
        gDrawer3.drawLine(new vec(px, 0), vs);
        gDrawer3.fillCircle(vc, 3, COS_COLOR);
        gDrawer3.fillCircle(vs, 3, SIN_COLOR);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp3").innerHTML
            = dc + " + " + ds + " = " + parseInt(1000 * (dc + ds) + 0.5) / 1000;
        ;
    }
    {
        let px = gTheta4 * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(gTheta4) * Math.cos(gTheta4);
        let ps = Math.sin(gTheta4) * Math.sin(gTheta4);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        let vcs = new vec(px, (pc - ps) * RADIUS);
        gDrawer4.drawLine(new vec(px, 0), vc);
        gDrawer4.drawLine(new vec(px, 0), vs);
        gDrawer4.drawLine(new vec(px, 0), vcs);
        gDrawer4.fillCircle(vc, 3, COS_COLOR);
        gDrawer4.fillCircle(vs, 3, SIN_COLOR);
        gDrawer4.fillCircle(vcs, 3);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp4").innerHTML
            = dc + " - " + ds + " = " + parseInt(1000 * (dc - ds)) / 1000;
        ;
    }
    {
        let px = gTheta5 * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(gTheta5) * Math.cos(gTheta5);
        let ps = Math.sin(gTheta5) * Math.sin(gTheta5);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        let vsc = new vec(px, (ps - pc) * RADIUS);
        gDrawer5.drawLine(new vec(px, 0), vc);
        gDrawer5.drawLine(new vec(px, 0), vs);
        gDrawer5.drawLine(new vec(px, 0), vsc);
        gDrawer5.fillCircle(vc, 3, COS_COLOR);
        gDrawer5.fillCircle(vs, 3, SIN_COLOR);
        gDrawer5.fillCircle(vsc, 3);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp5").innerHTML
            = ds + " - " + dc + " = " + parseInt(1000 * (ds - dc)) / 1000;
        ;
    }

    requestNextAnimationFrame(main);
}
