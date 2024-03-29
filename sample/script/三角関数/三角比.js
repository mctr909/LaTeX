/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Color.GRAY66;
const RULER_COLOR = Color.GRAY;
const CIRCLE_COLOR = Color.BLACK;
const KNOB_COLOR = Color.GREEN;
const COS_COLOR = Color.BLUE;
const SIN_COLOR = Color.RED;
const TAN_COLOR = Color.BLACK;
const UNIT_RADIUS = 50;
const WAVE_WIDTH = 300;
const WAVE_HEIGHT = 240;
const GAP = 60;

/** @type{LineInfo[]} */
let gLineList = [];
/** @type{vec[]} */
let gRSinLine = [];
/** @type{vec[]} */
let gRCosLine = [];
/** @type{vec[]} */
let gRTanLines = [];

let gRadius = 2;
let gTheta = Math.PI / 4;

let gCircleRadius = UNIT_RADIUS * gRadius;
let gWaveHBegin = gCircleRadius + GAP;
let gWaveVBegin = gCircleRadius + GAP/4;

let gDrawer = new Drawer("disp",
    UNIT_RADIUS * 4 + GAP + WAVE_WIDTH + 60,
    UNIT_RADIUS * 4 + GAP + WAVE_HEIGHT + 140
);

document.getElementById("trbR").addEventListener("input", function(ev) {
    init();
});
document.getElementById("trbTh").addEventListener("input", function(ev) {
    gTheta = this.value * Math.PI / 180;
});

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }

    gLineList = [];
    gRSinLine = [];
    gRCosLine = [];
    gRTanLines = [];

    gRadius = document.getElementById("trbR").value / 10.0;
    gCircleRadius = UNIT_RADIUS * gRadius;
    gWaveHBegin = UNIT_RADIUS * 2 + GAP;

    gDrawer.Offset = new vec(gWaveHBegin - GAP + 5, gDrawer.Height / 3 + 50);
    gDrawer.clearStringList();

    gLineList.push(new LineInfo(
        -UNIT_RADIUS * 2 - 10, 0,
        gWaveHBegin + WAVE_WIDTH, 0,
        1, AXIZ_COLOR
    ));
    gLineList.push(new LineInfo(
        0, -gWaveVBegin - WAVE_HEIGHT,
        0, UNIT_RADIUS * 2 + 10,
        1, AXIZ_COLOR
    ));
    for (let deg=0; deg<=360; deg += 15) {
        let x = gWaveHBegin + WAVE_WIDTH * deg / 360.0;
        let y = -gWaveVBegin - WAVE_HEIGHT * deg / 360.0;
        let h = ((0 == deg % 45) ? 7 : 2.5);
        gLineList.push(new LineInfo(
            x, -h,
            x, h,
            1, AXIZ_COLOR
        ));
        gLineList.push(new LineInfo(
            -h, y,
            h, y,
            1, AXIZ_COLOR
        ));
        if (deg % 45 == 0) {
            gDrawer.pushString(x, -12, toFrac(deg / 180, "π", false));
            gDrawer.pushString(x+2, 18, toFrac(deg, "°"));
            gDrawer.pushString(24, y+3, toFrac(deg / 180, "π", false));
            gDrawer.pushString(-22, y+3, toFrac(deg, "°"));
        }
        if (deg == 360) {
            gDrawer.pushString(x+32, 18, "[deg]");
            gDrawer.pushString(x+25, 3, "[θ]");
            gDrawer.pushString(x+32, -12, "[rad]");
            gDrawer.pushString(-24, y-8, "[deg]");
            gDrawer.pushString(0, y-8, "[θ]");
            gDrawer.pushString(24, y-8, "[rad]");
        }
    }

    gLineList.push(new LineInfo(
        UNIT_RADIUS, -gDrawer.Height,
        UNIT_RADIUS, gDrawer.Height,
        1, AXIZ_COLOR, true
    ));
    gLineList.push(new LineInfo(
        gCircleRadius, -gDrawer.Height,
        gCircleRadius, gDrawer.Height,
        1, TAN_COLOR
    ));

    let advHeight = WAVE_HEIGHT/12;
    for(let y=gWaveVBegin - advHeight; y<gWaveVBegin + advHeight + WAVE_HEIGHT; y++) {
        let th = 2 * Math.PI * (y - gWaveVBegin) / WAVE_HEIGHT;
        gRCosLine.push(new vec(Math.cos(th) * gCircleRadius, -y));
    }
    let rTanList = [];
    let advWidth = WAVE_WIDTH/12;
    for(let x=gWaveHBegin - advWidth; x<gWaveHBegin + advWidth + WAVE_WIDTH; x++) {
        let th = 2 * Math.PI * (x - gWaveHBegin) / WAVE_WIDTH;
        gRSinLine.push(new vec(x, Math.sin(th) * gCircleRadius));
        let t = Math.tan(th);
        if (t < -20 || t > 20) {
            if (0 < rTanList.length) {
                gRTanLines.push(rTanList);
                rTanList = [];
            }
            continue;
        }
        rTanList.push(new vec(x, t * gCircleRadius));
    }
    if (0 < rTanList.length) {
        gRTanLines.push(rTanList);
    }
}

function main() {
    gDrawer.clear();

    for (let i=0; i<gLineList.length; i++) {
        gLineList[i].draw(gDrawer);
    }
    for (let i=0; i<gRTanLines.length; i++) {
        gDrawer.drawPolyline(gRTanLines[i], TAN_COLOR, 1);
    }
    gDrawer.drawPolyline(gRCosLine, COS_COLOR, 1);
    gDrawer.drawPolyline(gRSinLine, SIN_COLOR, 1);

    if (gDrawer.isDrag) {
        gTheta = Math.atan2(gDrawer.cursor.Y, gDrawer.cursor.X);
        if (gTheta < 0) {
            gTheta += 2*Math.PI;
        }
        let deg = parseInt(180 * gTheta / Math.PI);
        gTheta = deg * Math.PI / 180;
        document.getElementById("trbTh").value = deg;
    }

    let x = gWaveHBegin + gTheta * WAVE_WIDTH / Math.PI / 2;
    let y = -gWaveVBegin - gTheta * WAVE_HEIGHT / Math.PI / 2;
    let vx = new vec(x, 0);
    let vy = new vec(0, y);
    let vo = vec.zero;
    let vp = new vec(Math.cos(gTheta) * gCircleRadius, Math.sin(gTheta) * gCircleRadius);
    let vrt = new vec(gCircleRadius, gCircleRadius * Math.tan(gTheta));
    let vc = new vec(vp.X, 0);
    let wave_c = new vec(vp.X, y);
    let wave_s = new vec(x, vp.Y);
    let wave_t = new vec(x, vrt.Y);

    let angle = vp.arg;
    if (angle < 0) {
        angle += 2*Math.PI;
    }

    gDrawer.drawCircleD(vo, UNIT_RADIUS, AXIZ_COLOR);
    gDrawer.drawCircle(vo, gCircleRadius, CIRCLE_COLOR);

    gDrawer.drawLine(vx, wave_t, RULER_COLOR);
    gDrawer.drawLine(vy, wave_c, RULER_COLOR);
    gDrawer.drawLine(vx, wave_s, RULER_COLOR);
    gDrawer.drawLine(vrt, wave_t, TAN_COLOR);
    gDrawer.drawLine(vp, wave_c, COS_COLOR);
    gDrawer.drawLine(vp, wave_s, SIN_COLOR);
    gDrawer.drawLine(vo, vrt, TAN_COLOR, 5);
    gDrawer.drawLine(vo, vc, COS_COLOR, 5);
    gDrawer.drawLine(vc, vp, SIN_COLOR, 5);
    gDrawer.drawLine(vo, vp, KNOB_COLOR, 5);

    gDrawer.drawArc(vo, 20, 0, angle, KNOB_COLOR, 3);

    gDrawer.fillCircle(vp, 7, KNOB_COLOR);
    gDrawer.fillCircle(vrt, 5);
    gDrawer.fillCircle(wave_t, 2.5, TAN_COLOR);
    gDrawer.fillCircle(wave_c, 2.5, COS_COLOR);
    gDrawer.fillCircle(wave_s, 2.5, SIN_COLOR);

    gDrawer.drawStringList();

    gDrawer.drawStringXY(20, 4, "θ", 20);
    gDrawer.drawStringXY(vrt.X - 5, vrt.Y + 6, "T", 18);
    gDrawer.drawStringXY(vp.X - 5, vp.Y + 8, "P", 18);

    let signX = Math.cos(gTheta);
    let signY = Math.sin(gTheta);
    if (signX * signY < 0) {
        gDrawer.drawStringH(vp, vo, "r", 22, Color.BLACK, new vec(0, 7, 0.5));
    } else {
        gDrawer.drawStringH(vo, vp, "r", 22, Color.BLACK, new vec(0, 7, 0.5));
    }
    if (signX < 0) {
        if (signY < 0) {
            gDrawer.drawStringH(vc, vo, "x", 20, Color.BLACK, new vec(0,5,0.5));
            gDrawer.drawStringV(vp, vc, "y", 20, Color.BLACK, new vec(-10,3,0.5));
        } else {
            gDrawer.drawStringH(vc, vo, "x", 20, Color.BLACK, new vec(0,-15,0.5));
            gDrawer.drawStringV(vc, vp, "y", 20, Color.BLACK, new vec(-10,3,0.5));
        }
    } else {
        if (signY < 0) {
            gDrawer.drawStringH(vo, vc, "x", 20, Color.BLACK, new vec(0,5,0.5));
            gDrawer.drawStringV(vp, vc, "y", 20, Color.BLACK, new vec(10,3,0.5));
        } else {
            gDrawer.drawStringH(vo, vc, "x", 20, Color.BLACK, new vec(0,-15,0.5));
            gDrawer.drawStringV(vc, vp, "y", 20, Color.BLACK, new vec(10,3,0.5));
        }
    }

    gDrawer.drawStringXY(wave_t.X - 46, wave_t.Y + 3, "r tanθ", 16);
    gDrawer.drawStringXY(wave_c.X + 2, wave_c.Y - 11, "r cosθ", 16);
    gDrawer.drawStringXY(wave_s.X + 2, wave_s.Y + 3, "r sinθ", 16);

    let tan = round1d(Math.sin(gTheta) / Math.cos(gTheta), 1, 3);
    let deg = parseInt(gTheta*180/Math.PI+0.5);
    document.getElementById("lblTheta").innerHTML = toFrac(deg / 180, "π") + ("(" + deg + "°)");
    document.getElementById("lblR").innerHTML = gRadius;
    document.getElementById("lblX").innerHTML = round1d(Math.cos(gTheta) * gRadius, 1, 3);
    document.getElementById("lblY").innerHTML = round1d(Math.sin(gTheta) * gRadius, 1, 3);
    document.getElementById("lblCos").innerHTML = round1d(Math.cos(gTheta), 1, 3);
    document.getElementById("lblSin").innerHTML = round1d(Math.sin(gTheta), 1, 3);
    document.getElementById("lblTan").innerHTML = (tan < -1000 || 1000 < tan) ? "∞, -∞" : tan;

    requestNextAnimationFrame(main);
}
