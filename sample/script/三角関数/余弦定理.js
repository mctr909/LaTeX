/// <reference path="../math.js" />
/// <reference path="../drawer.js" />
const UNIT = 200;
const A_COLOR = Drawer.GREEN;
const B_COLOR = Drawer.BLUE;
const C_COLOR = Drawer.RED;
const O_COLOR = Drawer.BLACK;

let gDrawer = new Drawer("disp", 600, 600);

let gPa = new vec(UNIT * 1.0, UNIT * 0.0);
let gPb = new vec(UNIT * 1.0, UNIT * 1.0);
let gPo = new vec(UNIT * 0.0, UNIT * 0.0);
let gPaDrag = false;
let gPbDrag = false;
let gPoDrag = false;

init();
requestNextAnimationFrame(main);

function init() {
    gDrawer.Offset = new vec(gDrawer.Width/2, gDrawer.Height/2);
}

function main() {
    gDrawer.clear();

    if (gDrawer.isDrag) {
        if (!gPbDrag && !gPoDrag && distance(gDrawer.cursor, gPa) <= 10) {
            gPaDrag = true;
        } else if (!gPaDrag && !gPoDrag && distance(gDrawer.cursor, gPb) <= 10) {
            gPbDrag = true;
        } else if (!gPaDrag && !gPbDrag && distance(gDrawer.cursor, gPo) <= 10) {
            gPoDrag = true;
        }
    } else {
        gPaDrag = false;
        gPbDrag = false;
        gPoDrag = false;
    }

    if (gPaDrag) {
        gDrawer.cursor.copy(gPa);
    }
    if (gPbDrag) {
        gDrawer.cursor.copy(gPb);
    }
    if (gPoDrag) {
        gDrawer.cursor.copy(gPo);
    }

    gDrawer.drawLine(gPo, gPa, A_COLOR, 2);
    gDrawer.drawLine(gPo, gPb, B_COLOR, 2);
    gDrawer.drawLine(gPa, gPb, C_COLOR, 2);
    gDrawer.fillCircle(gPa, 5, A_COLOR);
    gDrawer.fillCircle(gPb, 5, B_COLOR);
    gDrawer.fillCircle(gPo, 5, O_COLOR);

    let da = new vec();
    let db = new vec();
    let dc = new vec();
    midPos(gPo, gPa, 0.5, da);
    midPos(gPo, gPb, 0.5, db);
    midPos(gPa, gPb, 0.5, dc);
    da.Y += 6;
    db.Y += 6;
    dc.Y += 6;
    gDrawer.drawStringC(da, "a", 24);
    gDrawer.drawStringC(db, "b", 24);
    gDrawer.drawStringC(dc, "c", 24);

    gPa.sub(gPo, da);
    gPb.sub(gPo, db);
    gPa.sub(gPb, dc);    
    let ta = da.abs / UNIT;
    let tb = db.abs / UNIT;
    let tc = dc.abs / UNIT;
    let tcos = (ta*ta + tb*tb - tc*tc) / (2*ta*tb);
    ta = parseInt(ta * 1000) / 1000;
    tb = parseInt(tb * 1000) / 1000;
    tc = parseInt(tc * 1000) / 1000;

    let dangle = db.arg - da.arg;
    if (2*Math.PI < dangle) {
        dangle -= 2*Math.PI;
    }
    if (dangle < 0) {
        dangle += 2*Math.PI;
    }
    gDrawer.drawArc(gPo, 20, da.arg, dangle + da.arg, B_COLOR, 2);

    document.getElementById("lblA").innerHTML = "a = " + ta;
    document.getElementById("lblB").innerHTML = "b = " + tb;
    document.getElementById("lblC").innerHTML = "c = " + tc;
    document.getElementById("lblTheta").innerHTML
        = "θ = " + parseInt(dangle * 180 / Math.PI * 10) / 10 + "°<br>"
        + "θ = " + parseInt(dangle / Math.PI * 100) / 100 + "π"
    document.getElementById("lblCos").innerHTML = "cosθ = " + parseInt(tcos * 1000) / 1000;
    requestNextAnimationFrame(main);
}
