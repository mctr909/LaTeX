/// <reference path="../../../script/drawer.js" />
/// <reference path="../../../script/math.js" />

const AXIZ_COLOR = Drawer.BLACK;
const MEASURE_COLOR = Drawer.BLACK;
const COS_COLOR = Drawer.BLUE;
const SIN_COLOR = Drawer.RED;
const RADIUS = 100;
const WAVE_LENGTH = 360;
const WAVE_BEGIN = 10;

/** @type{LineInfo[]} */
let gLineList = [];
let gLabelList = [];
let gCos2Line = [];
let gSin2Line = [];
let gCosLine = [];
let gSinLine = [];
let gCSLine = [];
let gSCLine = [];

let gTheta = [
    Math.PI/6,
    Math.PI/6,
    Math.PI/6,
    Math.PI/6,
    Math.PI/6
];
let gDrawer = [
    new Drawer("disp0", WAVE_LENGTH + 80, RADIUS * 9 / 4),
    new Drawer("disp1", WAVE_LENGTH + 80, RADIUS * 9 / 4),
    new Drawer("disp2", WAVE_LENGTH + 80, 7 * RADIUS / 4),
    new Drawer("disp3", WAVE_LENGTH + 80, RADIUS * 9 / 4),
    new Drawer("disp4", WAVE_LENGTH + 80, RADIUS * 9 / 4)
];

function init() {
    gLineList = [];
    gLabelList = [];
    gCos2Line = [];
    gSin2Line = [];
    gCosLine = [];
    gSinLine = [];
    gCSLine = [];
    gSCLine = [];

    for (let i=0; i<gDrawer.length; i++) {
        gDrawer[i].Offset = new vec(20, RADIUS+10);
    }

    gLineList.push(new LineInfo(
        -WAVE_BEGIN, 0,
        500, 0,
        1, AXIZ_COLOR
    ));
    for (let deg=0; deg<=360; deg += 15) {
        let x = WAVE_BEGIN + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 15 : deg % 45 == 0 ? 10 : 5;
        gLineList.push(new LineInfo(
            x, -h,
            x, h,
            1, AXIZ_COLOR
        ));
        if (deg % 90 == 0) {
            gLabelList.push({
                pos: new vec(x, -20),
                text: deg + "°\n" + (deg / 180) + "π"
            });
        }
    }

    gLineList.push(new LineInfo(
        0, RADIUS,
        500, RADIUS,
        1, MEASURE_COLOR,
        true
    ));
    gLineList.push(new LineInfo(
        0, -RADIUS,
        500, -RADIUS,
        1, MEASURE_COLOR,
        true
    ));

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
    for (let i=0; i<gDrawer.length; i++) {
        gDrawer[i].clear();
    }

    for (let id=0; id<gDrawer.length; id++) {
        for (let il=0; il<gLineList.length; il++) {
            gLineList[il].draw(gDrawer[id]);
        }
        for (let il=0; il<gLabelList.length; il++) {
            gDrawer[id].drawStringC(gLabelList[il].pos, gLabelList[il].text, 16);
        }
    }

    gDrawer[0].drawPolylineD(gCosLine);
    gDrawer[0].drawPolyline(gCos2Line, COS_COLOR);
    gDrawer[1].drawPolylineD(gSinLine);
    gDrawer[1].drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer[2].drawPolyline(gCos2Line, COS_COLOR);
    gDrawer[2].drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer[3].drawPolyline(gCos2Line, COS_COLOR);
    gDrawer[3].drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer[3].drawPolyline(gCSLine);
    gDrawer[4].drawPolyline(gCos2Line, COS_COLOR);
    gDrawer[4].drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer[4].drawPolyline(gSCLine);

    for (let id=0; id<gDrawer.length; id++) {
        if (!gDrawer[id].isDrag) {
            continue;
        }
        gTheta[id] = 2 * Math.PI * (gDrawer[id].cursor.X - WAVE_BEGIN) / WAVE_LENGTH;
        if (gTheta[id] < 0) {
            gTheta[id] = 0;
        }
        if (2 * Math.PI < gTheta[id]) {
            gTheta[id] = 2 * Math.PI;
        }
    }

    {
        let d = gDrawer[0];
        let px = gTheta[0] * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pv = Math.cos(gTheta[0]);
        let v1 = new vec(px, pv * RADIUS);
        let v2 = new vec(px, pv * pv * RADIUS);
        d.drawLine(new vec(px, 0), v1);
        d.drawLine(new vec(px, 0), v2);
        d.fillCircle(v1, 3);
        d.fillCircle(v2, 3, COS_COLOR);
        let dv = parseInt(1000 * pv + 0.5) / 1000;
        document.getElementById("lblDisp0").innerHTML
            = dv + " x " + dv + " = " + parseInt(1000 * dv * dv + 0.5) / 1000;
        ;
    }
    {
        let d = gDrawer[1];
        let px = gTheta[1] * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pv = Math.sin(gTheta[1]);
        let v1 = new vec(px, pv * RADIUS);
        let v2 = new vec(px, pv * pv * RADIUS);
        d.drawLine(new vec(px, 0), v1);
        d.drawLine(new vec(px, 0), v2);
        d.fillCircle(v1, 3);
        d.fillCircle(v2, 3, SIN_COLOR);
        let dv = parseInt(1000 * pv + 0.5) / 1000;
        document.getElementById("lblDisp1").innerHTML
            = dv + " x " + dv + " = " + parseInt(1000 * dv * dv + 0.5) / 1000;
        ;
    }
    {
        let d = gDrawer[2];
        let th = gTheta[2];
        let px = th * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(th) * Math.cos(th);
        let ps = Math.sin(th) * Math.sin(th);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        d.drawLine(new vec(px, 0), vc);
        d.drawLine(new vec(px, 0), vs);
        d.fillCircle(vc, 3, COS_COLOR);
        d.fillCircle(vs, 3, SIN_COLOR);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp2").innerHTML
            = dc + " + " + ds + " = " + parseInt(1000 * (dc + ds) + 0.5) / 1000;
        ;
    }
    {
        let d = gDrawer[3];
        let th = gTheta[3];
        let px = th * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(th) * Math.cos(th);
        let ps = Math.sin(th) * Math.sin(th);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        let vcs = new vec(px, (pc - ps) * RADIUS);
        d.drawLine(new vec(px, 0), vc);
        d.drawLine(new vec(px, 0), vs);
        d.drawLine(new vec(px, 0), vcs);
        d.fillCircle(vc, 3, COS_COLOR);
        d.fillCircle(vs, 3, SIN_COLOR);
        d.fillCircle(vcs, 3);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp3").innerHTML
            = dc + " - " + ds + " = " + parseInt(1000 * (dc - ds)) / 1000;
        ;
    }
    {
        let d = gDrawer[4];
        let th = gTheta[4];
        let px = th * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(th) * Math.cos(th);
        let ps = Math.sin(th) * Math.sin(th);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        let vsc = new vec(px, (ps - pc) * RADIUS);
        d.drawLine(new vec(px, 0), vc);
        d.drawLine(new vec(px, 0), vs);
        d.drawLine(new vec(px, 0), vsc);
        d.fillCircle(vc, 3, COS_COLOR);
        d.fillCircle(vs, 3, SIN_COLOR);
        d.fillCircle(vsc, 3);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp4").innerHTML
            = ds + " - " + dc + " = " + parseInt(1000 * (ds - dc)) / 1000;
        ;
    }

    requestNextAnimationFrame(main);
}

init();
