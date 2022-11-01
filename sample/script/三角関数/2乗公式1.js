/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Drawer.BLACK;
const MEASURE_COLOR = Drawer.GRAY;
const COS_COLOR = Drawer.BLUE;
const SIN_COLOR = Drawer.RED;
const RADIUS = 100;
const WAVE_LENGTH = 360*2;
const WAVE_BEGIN = 5;

/** @type{Drawer[]} */
let gDrawer = [
    new Drawer("disp1", WAVE_LENGTH + 50, RADIUS * 9 / 4),
    new Drawer("disp2", WAVE_LENGTH + 50, RADIUS * 9 / 4),
    new Drawer("disp3", WAVE_LENGTH + 50, RADIUS * 9 / 4)
];
let gTheta = Math.PI/6;
/** @type{LineInfo[]} */
let gLineList = [];
let gLabelList = [];
let gCos2Line = [];
let gSin2Line = [];
let gCosLine = [];
let gSinLine = [];
let gCSLine = [];
let gSCLine = [];

function init() {
    for(let i=0; i<gDrawer.length; i++) {
        gDrawer[i].Offset = new vec(20, RADIUS+5);
    }

    gLineList.push(new LineInfo(
        WAVE_BEGIN, 0,
        WAVE_LENGTH + WAVE_BEGIN, 0,
        1, AXIZ_COLOR
    ));
    gLineList.push(new LineInfo(
        WAVE_BEGIN, RADIUS,
        WAVE_LENGTH + WAVE_BEGIN, RADIUS,
        1, MEASURE_COLOR
    ));
    gLineList.push(new LineInfo(
        WAVE_BEGIN, -RADIUS,
        WAVE_LENGTH + WAVE_BEGIN, -RADIUS,
        1, MEASURE_COLOR
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
    for(let i=0; i<gDrawer.length; i++) {
        gDrawer[i].clear();
    }
    for(let id=0; id<gDrawer.length; id++) {
        for (let il=0; il<gLineList.length; il++) {
            gLineList[il].draw(gDrawer[id]);
        }
        for (let il=0; il<gLabelList.length; il++) {
            gDrawer[id].drawStringC(gLabelList[il].pos, gLabelList[il].text, 16);
        }
    }

    gDrawer[0].drawPolyline(gCosLine);
    gDrawer[0].drawPolyline(gCos2Line, COS_COLOR);
    gDrawer[1].drawPolyline(gSinLine);
    gDrawer[1].drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer[2].drawPolyline(gCos2Line, COS_COLOR);
    gDrawer[2].drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer[2].drawLine(
        new vec(WAVE_BEGIN, RADIUS),
        new vec(WAVE_BEGIN + WAVE_LENGTH, RADIUS),
        Drawer.ORANGE
    );

    for(let id=0; id<gDrawer.length; id++) {
        if (!gDrawer[id].isDrag) {
            continue;
        }
        gTheta = 2 * Math.PI * (gDrawer[id].cursor.X - WAVE_BEGIN) / WAVE_LENGTH;
        if (gTheta < 0) {
            gTheta = 0;
        }
        if (2 * Math.PI < gTheta) {
            gTheta = 2 * Math.PI;
        }
    }

    {
        let d = gDrawer[0];
        let px = gTheta * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pv = Math.cos(gTheta);
        let v1 = new vec(px, pv * RADIUS);
        let v2 = new vec(px, pv * pv * RADIUS);
        d.drawLine(new vec(px, 0), v1);
        d.drawLine(new vec(px, 0), v2);
        d.fillCircle(v1, 3);
        d.fillCircle(v2, 3, COS_COLOR);
        let dv = parseInt(1000 * pv + Math.sign(pv) * 0.5) / 1000;
        let dv2 = parseInt(1000 * pv * pv + 0.5) / 1000;
        document.getElementById("lblDisp1a").innerHTML = dv + "・" + dv + " = ";
        document.getElementById("lblDisp1b").innerHTML = dv2;
    }
    {
        let d = gDrawer[1];
        let px = gTheta * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pv = Math.sin(gTheta);
        let v1 = new vec(px, pv * RADIUS);
        let v2 = new vec(px, pv * pv * RADIUS);
        d.drawLine(new vec(px, 0), v1);
        d.drawLine(new vec(px, 0), v2);
        d.fillCircle(v1, 3);
        d.fillCircle(v2, 3, SIN_COLOR);
        let dv = parseInt(1000 * pv + Math.sign(pv) * 0.5) / 1000;
        let dv2 = parseInt(1000 * pv * pv + 0.5) / 1000;
        document.getElementById("lblDisp2a").innerHTML = dv + "・" + dv + " = ";
        document.getElementById("lblDisp2b").innerHTML = dv2;
    }
    {
        let d = gDrawer[2];
        let px = gTheta * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(gTheta) * Math.cos(gTheta);
        let ps = Math.sin(gTheta) * Math.sin(gTheta);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        let vcs = new vec(px, (pc + ps) * RADIUS);
        d.drawLine(new vec(px, 0), vcs);
        d.drawLine(new vec(px, 0), vc);
        d.drawLine(new vec(px, 0), vs);
        d.fillCircle(vcs, 3, Drawer.ORANGE);
        d.fillCircle(vc, 3, COS_COLOR);
        d.fillCircle(vs, 3, SIN_COLOR);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp3a").innerHTML = dc;
        document.getElementById("lblDisp3b").innerHTML = ds;
        document.getElementById("lblDisp3c").innerHTML = parseInt(1000 * (dc + ds) + 0.5) / 1000;
    }

    requestNextAnimationFrame(main);
}

init();