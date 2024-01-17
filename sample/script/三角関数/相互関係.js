/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const TEXT_COLOR = Color.BLACK;
const AXIZ_COLOR = Color.GRAY66;
const LINE_COLOR = Color.GRAY33;
const CIRCLE_COLOR = Color.BLACK;
const RADIUS_COLOR = Color.GREEN;
const SIN_COLOR = Color.RED;
const COS_COLOR = Color.BLUE;

const UNIT_RADIUS = 70;
const GAP = 20;

let gDrawerP90F = new Drawer("dispP90F",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 2 + GAP * 1.5
);
let gDrawerN90F = new Drawer("dispN90F",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 2 + GAP * 1.5
);
let gDrawerP90R = new Drawer("dispP90R",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 2 + GAP * 1.5
);
let gDrawerN90R = new Drawer("dispN90R",
    UNIT_RADIUS * 2 + GAP,
    UNIT_RADIUS * 2 + GAP * 1.5
);
let gAxisListSymmetry = [];
let gTheta = Math.PI / 5;

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
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
    gDrawerP90F.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP);
    gDrawerN90F.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP);
    gDrawerP90R.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP);
    gDrawerN90R.Offset = new vec(UNIT_RADIUS + GAP/2, UNIT_RADIUS + GAP);
}

function main() {
    gDrawerP90F.clear(); {
        gDrawerP90F.drawStringXY(-UNIT_RADIUS-7, UNIT_RADIUS+2, "θ+π/2", 20);
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerP90F);
        }

        if (gDrawerP90F.isDrag) {
            gTheta = Math.atan2(gDrawerP90F.cursor.Y, gDrawerP90F.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = vec.zero;
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let theta = gTheta + Math.PI/2;
        let vp90 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vp90_c = new vec(vp90.X);
        let vp90_s = new vec(0, vp90.Y);

        gDrawerP90F.drawCircle(vo, UNIT_RADIUS, CIRCLE_COLOR);
        gDrawerP90F.fillPolygon([vo, vp90, vp90_s], gDrawerP90F.Offset, Color.GRAY75);
        gDrawerP90F.drawLineD(vo, vp90_s, COS_COLOR, 2);
        gDrawerP90F.drawLineD(vp90_s, vp90, SIN_COLOR, 2);
        gDrawerP90F.drawLine(vo, vp90_c, COS_COLOR, 3);
        gDrawerP90F.drawLine(vp90_c, vp90, SIN_COLOR, 3);
        gDrawerP90F.drawLine(vo, vp90, CIRCLE_COLOR, 3);
        gDrawerP90F.drawLine(vo, vp, RADIUS_COLOR, 2);
        gDrawerP90F.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawerP90F.fillCircle(vp90, 4, CIRCLE_COLOR);
        gDrawerP90F.drawArc(vo, 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerP90F.drawArc(vo, 34, Math.PI/2, vp90.arg, CIRCLE_COLOR, 3);

        let fA, fB;
        let rA, rB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = vec.unitXr;
        } else {
            fA = vp;
            fB = vec.unitX;
        }
        if (vp90.X < 0) {
            rA = vec.unitY;
            rB = vp90;
        } else {
            rA = new vec(-vp90.X, -vp90.Y);
            rB = vec.unitYr;
        }
        gDrawerP90F.drawStringA(fA, vo, fB, "θ", 18, TEXT_COLOR, new vec(0, -7, 25));
        gDrawerP90F.drawStringA(rA, vo, rB, "θ", 18, TEXT_COLOR, new vec(0, -7, 42));
    }
    gDrawerN90F.clear(); {
        gDrawerN90F.drawStringXY(-UNIT_RADIUS-7, UNIT_RADIUS+2, "θ－π/2", 20);
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerN90F);
        }

        if (gDrawerN90F.isDrag) {
            gTheta = Math.atan2(gDrawerN90F.cursor.Y, gDrawerN90F.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = vec.zero;
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let theta = gTheta - Math.PI/2;
        let vp90 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vp90_c = new vec(vp90.X);
        let vp90_s = new vec(0, vp90.Y);

        gDrawerN90F.drawCircle(vo, UNIT_RADIUS, CIRCLE_COLOR);
        gDrawerN90F.fillPolygon([vo, vp90, vp90_s], gDrawerN90F.Offset, Color.GRAY75);
        gDrawerN90F.drawLineD(vo, vp90_s, COS_COLOR, 2);
        gDrawerN90F.drawLineD(vp90_s, vp90, SIN_COLOR, 2);
        gDrawerN90F.drawLine(vo, vp90_c, COS_COLOR, 3);
        gDrawerN90F.drawLine(vp90_c, vp90, SIN_COLOR, 3);
        gDrawerN90F.drawLine(vo, vp90, CIRCLE_COLOR, 3);
        gDrawerN90F.drawLine(vo, vp, RADIUS_COLOR, 2);
        gDrawerN90F.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawerN90F.fillCircle(vp90, 4, CIRCLE_COLOR);
        gDrawerN90F.drawArc(vo, 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerN90F.drawArc(vo, 34, -Math.PI/2, vp90.arg, CIRCLE_COLOR, 3);

        let fA, fB;
        let rA, rB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = vec.unitXr;
        } else {
            fA = vp;
            fB = vec.unitX;
        }
        if (vp90.X < 0) {
            rA = vec.unitY;
            rB = new vec(-vp90.X, -vp90.Y);
        } else {
            rA = vp90;
            rB = vec.unitYr;
        }
        gDrawerN90F.drawStringA(fA, vo, fB, "θ", 18, TEXT_COLOR, new vec(0, -7, 25));
        gDrawerN90F.drawStringA(rA, vo, rB, "θ", 18, TEXT_COLOR, new vec(0, -7, 42));
    }
    gDrawerP90R.clear(); {
        gDrawerP90R.drawStringXY(-UNIT_RADIUS-7, UNIT_RADIUS+2, "π/2－θ", 20);
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerP90R);
        }

        if (gDrawerP90R.isDrag) {
            gTheta = Math.atan2(gDrawerP90R.cursor.Y, gDrawerP90R.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = vec.zero;
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let theta = Math.PI/2 - gTheta;
        let vpm90 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vpm90_c = new vec(vpm90.X);
        let vpm90_s = new vec(0, vpm90.Y);

        gDrawerP90R.drawCircle(vo, UNIT_RADIUS, CIRCLE_COLOR);
        gDrawerP90R.fillPolygon([vo, vpm90, vpm90_s], gDrawerP90R.Offset, Color.GRAY75);
        gDrawerP90R.drawLineD(vo, vpm90_s, COS_COLOR, 2);
        gDrawerP90R.drawLineD(vpm90_s, vpm90, SIN_COLOR, 2);
        gDrawerP90R.drawLine(vo, vpm90_c, COS_COLOR, 3);
        gDrawerP90R.drawLine(vpm90_c, vpm90, SIN_COLOR, 3);
        gDrawerP90R.drawLine(vo, vpm90, CIRCLE_COLOR, 3);
        gDrawerP90R.drawLine(vo, vp, RADIUS_COLOR, 2);
        gDrawerP90R.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawerP90R.fillCircle(vpm90, 4, CIRCLE_COLOR);
        gDrawerP90R.drawArc(vo, 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerP90R.drawArc(vo, 34, vpm90.arg, Math.PI/2, CIRCLE_COLOR, 3);

        let fA, fB;
        let rA, rB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = vec.unitXr;
        } else {
            fA = vp;
            fB = vec.unitX;
        }
        if (vpm90.X < 0) {
            rA = vec.unitYr;
            rB = new vec(-vpm90.X, -vpm90.Y);
        } else {
            rA = vpm90;
            rB = vec.unitY;
        }
        gDrawerP90R.drawStringA(fA, vo, fB, "θ", 18, TEXT_COLOR, new vec(0, -7, 25));
        gDrawerP90R.drawStringA(rA, vo, rB, "-θ", 18, TEXT_COLOR, new vec(0, -7, -45));
    }
    gDrawerN90R.clear(); {
        gDrawerN90R.drawStringXY(-UNIT_RADIUS-7, UNIT_RADIUS+2, "－π/2－θ", 20);
        for (let i=0; i<gAxisListSymmetry.length; i++) {
            gAxisListSymmetry[i].draw(gDrawerN90R);
        }

        if (gDrawerN90R.isDrag) {
            gTheta = Math.atan2(gDrawerN90R.cursor.Y, gDrawerN90R.cursor.X);
            if (gTheta < 0) {
                gTheta += 2*Math.PI;
            }
            let deg = parseInt(180 * gTheta / Math.PI);
            gTheta = deg * Math.PI / 180;
        }

        let vo = vec.zero;
        let vp = new vec(Math.cos(gTheta) * UNIT_RADIUS, Math.sin(gTheta) * UNIT_RADIUS);
        let theta = -Math.PI/2 - gTheta;
        let vpm90 = new vec(Math.cos(theta) * UNIT_RADIUS, Math.sin(theta) * UNIT_RADIUS);
        let vpm90_c = new vec(vpm90.X);
        let vpm90_s = new vec(0, vpm90.Y);

        gDrawerN90R.drawCircle(vo, UNIT_RADIUS, CIRCLE_COLOR);
        gDrawerN90R.fillPolygon([vo, vpm90, vpm90_s], gDrawerN90R.Offset, Color.GRAY75);
        gDrawerN90R.drawLineD(vo, vpm90_s, COS_COLOR, 2);
        gDrawerN90R.drawLineD(vpm90_s, vpm90, SIN_COLOR, 2);
        gDrawerN90R.drawLine(vo, vpm90_c, COS_COLOR, 3);
        gDrawerN90R.drawLine(vpm90_c, vpm90, SIN_COLOR, 3);
        gDrawerN90R.drawLine(vo, vpm90, CIRCLE_COLOR, 3);
        gDrawerN90R.drawLine(vo, vp, RADIUS_COLOR, 2);
        gDrawerN90R.fillCircle(vp, 7, RADIUS_COLOR);
        gDrawerN90R.fillCircle(vpm90, 4, CIRCLE_COLOR);
        gDrawerN90R.drawArc(vo, 18, 0, vp.arg, RADIUS_COLOR, 2);
        gDrawerN90R.drawArc(vo, 34, vpm90.arg, -Math.PI/2, CIRCLE_COLOR, 3);

        let fA, fB;
        let rA, rB;
        if (vp.arg < 0) {
            fA = new vec(-vp.X, -vp.Y);
            fB = vec.unitXr;
        } else {
            fA = vp;
            fB = vec.unitX;
        }
        if (vpm90.X < 0) {
            rA = vec.unitYr;
            rB = vpm90;
        } else {
            rA = new vec(-vpm90.X, -vpm90.Y);
            rB = vec.unitY;
        }
        gDrawerN90R.drawStringA(fA, vo, fB, "θ", 18, TEXT_COLOR, new vec(0, -7, 25));
        gDrawerN90R.drawStringA(rA, vo, rB, "-θ", 18, TEXT_COLOR, new vec(0, -7, -45));
    }
    requestNextAnimationFrame(main);
}
