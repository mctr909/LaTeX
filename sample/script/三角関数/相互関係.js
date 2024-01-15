/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const TEXT_COLOR = Color.BLACK;
const AXIZ_COLOR = Color.GRAY66;
const LINE_COLOR = Color.GRAY37;
const CIRCLE_COLOR = Color.BLACK;
const RADIUS_COLOR = Color.GREEN;
const SIN_COLOR = Color.RED;
const COS_COLOR = Color.BLUE;

const WAVE_WIDTH = 280;
const WAVE_HEIGHT = 100;
const UNIT_RADIUS = 100;
const GAP = 30;

let gDrawer = new Drawer("disp",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 2 + GAP
);
let gAxisListSymmetry = [];
let gTheta = Math.PI / 3;

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
    gDrawer.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP/2); {
        gAxisListSymmetry.push(new LineInfo(
            0, -UNIT_RADIUS*1.1,
            0, UNIT_RADIUS*1.1,
            1, AXIZ_COLOR
        ));
        gAxisListSymmetry.push(new LineInfo(
            -UNIT_RADIUS*1.1, 0,
            +UNIT_RADIUS*1.1, 0,
            1, AXIZ_COLOR
        ));
    }
}

function main() {
    gDrawer.clear(); {
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawer);
        }
        gDrawer.drawCircle(new vec(), UNIT_RADIUS, CIRCLE_COLOR);

        if (gDrawer.isDrag) {
            gTheta = Math.atan2(gDrawer.cursor.Y, gDrawer.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = new vec();
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let vp_c = new vec(vp.X, 0);
        gDrawer.drawLine(vo, vp_c, COS_COLOR, 3);
        gDrawer.drawLine(vp_c, vp, SIN_COLOR, 3);
        gDrawer.drawLine(vo, vp, RADIUS_COLOR, 3);
        gDrawer.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawer.drawArc(new vec(), 18, 0, vp.arg, RADIUS_COLOR, 2);

        let fA, fB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = new vec(-1);
        } else {
            fA = vp;
            fB = new vec(1);
        }
        gDrawer.drawStringA(fA, vo, fB, "θ", 20, TEXT_COLOR, new vec(0, -7, 25));
    }

    requestNextAnimationFrame(main);
}

function overflowTan(v) {
    if (100 < v) {
        return true;
    }
    if (v < -100) {
        return true;
    }
    return false;
}
function limitTan(v) {
    if (100 < v) {
        return 100;
    }
    if (v < -100) {
        return -100;
    }
    return v;
}
