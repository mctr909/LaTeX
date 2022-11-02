/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Drawer.BLACK;
const MEASURE_COLOR = Drawer.GRAY;
const COS_COLOR = Drawer.BLUE;
const SIN_COLOR = Drawer.RED;
const RADIUS = 128;
const WAVE_LENGTH = 360*2;
const WAVE_BEGIN = 5;

/** @type{Drawer[]} */
let gDrawer = [
    new Drawer("disp1", WAVE_LENGTH + 50, RADIUS * 9 / 4),
    new Drawer("disp2", WAVE_LENGTH + 50, RADIUS * 9 / 4)
];
let gTheta = Math.PI/6;
/** @type{LineInfo[]} */
let gLineList = [];
let gLabelList = [];
let gCos2Line = [];
let gSin2Line = [];
let gCSLine = [];
let gSCLine = [];

function init() {
    gDrawer[0].Offset = new vec(20, RADIUS+15);
    gDrawer[1].Offset = new vec(20, RADIUS+15);

    gLineList.push(new LineInfo(
        WAVE_BEGIN, 0,
        WAVE_LENGTH + WAVE_BEGIN, 0,
        1, AXIZ_COLOR
    ));

    for (let i=1; i<=20; i++) {
        let d = i/10;
        gLineList.push(new LineInfo(
            WAVE_BEGIN, RADIUS * d,
            WAVE_LENGTH + WAVE_BEGIN, RADIUS * d,
            0.75, MEASURE_COLOR,
            i%5!=0
        ));
        gLineList.push(new LineInfo(
            WAVE_BEGIN, -RADIUS * d,
            WAVE_LENGTH + WAVE_BEGIN, -RADIUS * d,
            0.75, MEASURE_COLOR,
            i%5!=0
        ));
    }

    for (let deg=0; deg<=360; deg += 15) {
        let x = WAVE_BEGIN + WAVE_LENGTH * deg / 360.0;
        let h = deg % 90 == 0 ? 15 : deg % 45 == 0 ? 10 : 5;
        gLineList.push(new LineInfo(
            x, -h,
            x, h,
            1, AXIZ_COLOR
        ));
        if (deg % 45 == 0) {
            gLabelList.push({
                pos: new vec(x, -20),
                text: toFrac(deg / 180, "π", false) + "\n" + deg + "°"
            });
        }
    }

    for(let x=WAVE_BEGIN; x<WAVE_BEGIN + WAVE_LENGTH; x++) {
        let th = 2 * Math.PI * (x - WAVE_BEGIN) / WAVE_LENGTH;
        let c = Math.cos(th);
        let s = Math.sin(th);
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

    gDrawer[0].drawPolyline(gCos2Line, COS_COLOR);
    gDrawer[0].drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer[0].drawPolyline(gCSLine, Drawer.ORANGE);
    gDrawer[1].drawPolyline(gCos2Line, COS_COLOR);
    gDrawer[1].drawPolyline(gSin2Line, SIN_COLOR);
    gDrawer[1].drawPolyline(gSCLine, Drawer.ORANGE);

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
        let pc = Math.cos(gTheta) * Math.cos(gTheta);
        let ps = Math.sin(gTheta) * Math.sin(gTheta);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        let vcs = new vec(px, (pc - ps) * RADIUS);
        d.drawLine(new vec(px, 0), vcs);
        d.drawLine(new vec(px, 0), vc);
        d.drawLine(new vec(px, 0), vs);
        d.fillCircle(vcs, 4, Drawer.ORANGE);
        d.fillCircle(vc, 4, COS_COLOR);
        d.fillCircle(vs, 4, SIN_COLOR);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp1a").innerHTML = dc;
        document.getElementById("lblDisp1b").innerHTML = ds;
        document.getElementById("lblDisp1c").innerHTML = parseInt(1000 * (dc - ds)) / 1000;
    }
    {
        let d = gDrawer[1];
        let px = gTheta * WAVE_LENGTH / Math.PI / 2 + WAVE_BEGIN;
        let pc = Math.cos(gTheta) * Math.cos(gTheta);
        let ps = Math.sin(gTheta) * Math.sin(gTheta);
        let vc = new vec(px, pc * RADIUS);
        let vs = new vec(px, ps * RADIUS);
        let vsc = new vec(px, (ps - pc) * RADIUS);
        d.drawLine(new vec(px, 0), vsc);
        d.drawLine(new vec(px, 0), vc);
        d.drawLine(new vec(px, 0), vs);
        d.fillCircle(vsc, 4, Drawer.ORANGE);
        d.fillCircle(vc, 4, COS_COLOR);
        d.fillCircle(vs, 4, SIN_COLOR);
        let dc = parseInt(1000 * pc + 0.5) / 1000;
        let ds = parseInt(1000 * ps + 0.5) / 1000;
        document.getElementById("lblDisp2a").innerHTML = ds;
        document.getElementById("lblDisp2b").innerHTML = dc;
        document.getElementById("lblDisp2c").innerHTML = parseInt(1000 * (ds - dc)) / 1000;
    }

    requestNextAnimationFrame(main);
}

init();