/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Color.GRAY;
const LINE_COLOR = Color.GRAY66;

const WAVE_WIDTH = 250;
const WAVE_HEIGHT = 40;
const GAP = 30;

let gDrawerC = new Drawer("dispC",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT + GAP
);
let gDrawerS = new Drawer("dispS",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT + GAP
);
let gDrawerT = new Drawer("dispT",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT * 2 + GAP * 2
);

let gAxisListC = [];
let gAxisListS = [];
let gAxisListT = [];
let gLineC = [];
let gLineS = [];
let gLinesT = [];

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }
    gDrawerC.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP*3/4); {
        gAxisListC.push(new LineInfo(
            0, -WAVE_HEIGHT*1.1/2,
            0, WAVE_HEIGHT*1.1/2,
            1, AXIZ_COLOR
        ));
        gAxisListC.push(new LineInfo(
            -WAVE_WIDTH/2, 0,
            +WAVE_WIDTH/2, 0,
            1, AXIZ_COLOR
        ));
        gDrawerC.pushString(
            -WAVE_WIDTH/2-13, WAVE_HEIGHT/2+8,
            "cosθ",
            20, false
        );
        gDrawerC.pushString(WAVE_WIDTH/2+17, 4, "[θ]");
        gDrawerC.pushString(WAVE_WIDTH/2+23, -10, "[rad]");
        let div = 8;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
            case 8:
                h = 10;
                gDrawerC.pushString(x, -10, toFrac(v/2, "π", false));
                break;
            case 2:
            case 6:
                h = 5;
                gDrawerC.pushString(x, -10, toFrac(v/2, "π", false));
                break;
            default:
                h = 5; break;
            }
            gAxisListC.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        for(let x=-WAVE_WIDTH*1.1/2; x<WAVE_WIDTH*1.1/2; x++) {
            let th = 8*Math.PI * x / WAVE_WIDTH;
            gLineC.push(new vec(x, Math.cos(th) * WAVE_HEIGHT/2));
        }
    }
    gDrawerS.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP*3/4); {
        gAxisListS.push(new LineInfo(
            0, -WAVE_HEIGHT*1.1/2,
            0, WAVE_HEIGHT*1.1/2,
            1, AXIZ_COLOR
        ));
        gAxisListS.push(new LineInfo(
            -WAVE_WIDTH/2, 0,
            +WAVE_WIDTH/2, 0,
            1, AXIZ_COLOR
        ));
        gDrawerS.pushString(
            -WAVE_WIDTH/2-13, WAVE_HEIGHT/2+8,
            "sinθ",
            20, false
        );
        gDrawerS.pushString(WAVE_WIDTH/2+17, 4, "[θ]");
        gDrawerS.pushString(WAVE_WIDTH/2+23, -10, "[rad]");
        let div = 8;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
            case 8:
                h = 10;
                gDrawerS.pushString(x, -10, toFrac(v/2, "π", false));
                break;
            case 2:
            case 6:
                h = 5;
                gDrawerS.pushString(x, -10, toFrac(v/2, "π", false));
                break;
            default:
                h = 5; break;
            }
            gAxisListS.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        for(let x=-WAVE_WIDTH*1.1/2; x<WAVE_WIDTH*1.1/2; x++) {
            let th = 8*Math.PI * x / WAVE_WIDTH;
            gLineS.push(new vec(x, Math.sin(th) * WAVE_HEIGHT/2));
        }
    }
    gDrawerT.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT + GAP); {
        gAxisListT.push(new LineInfo(
            0, -WAVE_HEIGHT-GAP,
            0, WAVE_HEIGHT+GAP,
            1, AXIZ_COLOR
        ));
        gAxisListT.push(new LineInfo(
            -WAVE_WIDTH/2, 0,
            +WAVE_WIDTH/2, 0,
            1, AXIZ_COLOR
        ));
        gDrawerT.pushString(
            -WAVE_WIDTH/2-13, WAVE_HEIGHT+15,
            "tanθ",
            20, false
        );
        gDrawerT.pushString(WAVE_WIDTH/2+17, 4, "[θ]");
        gDrawerT.pushString(WAVE_WIDTH/2+23, -12, "[rad]");
        let div = 4;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
                h = 10;
                gDrawerT.pushString(x, -12, toFrac(v/2, "π", false));
                break;
            case 2:
                h = 5;
                gDrawerT.pushString(x, -12, toFrac(v/2, "π", false));
                break;
            default:
                h = 5; break;
            }
            gAxisListT.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        let tanList = [];
        for(let x=-WAVE_WIDTH*1.1/2; x<WAVE_WIDTH*1.1/2; x++) {
            let th = 4*Math.PI * x / WAVE_WIDTH;
            let t = Math.tan(th);
            if (overflowTan(t)) {
                if (0 < tanList.length) {
                    gLinesT.push(tanList);
                }
                tanList = [];
            } else {
                tanList.push(new vec(x, t * WAVE_HEIGHT/4));
            }
        }
        if (0 < tanList.length) {
            gLinesT.push(tanList);
        }
    }
}

function main() {
    gDrawerC.clear(); {
        for (let i=0; i<gAxisListC.length; i++) {
            gAxisListC[i].draw(gDrawerC);
        }
        gDrawerC.drawPolyline(gLineC, LINE_COLOR, 1);
        gDrawerC.drawStringList();
    }
    gDrawerS.clear(); {
        for (let i=0; i<gAxisListS.length; i++) {
            gAxisListS[i].draw(gDrawerS);
        }
        gDrawerS.drawPolyline(gLineS, LINE_COLOR, 1);
        gDrawerS.drawStringList();
    }
    gDrawerT.clear(); {
        for (let i=0; i<gAxisListT.length; i++) {
            gAxisListT[i].draw(gDrawerT);
        }
        for (let i=0; i<gLinesT.length; i++) {
            gDrawerT.drawPolyline(gLinesT[i], LINE_COLOR, 1);
        }
        gDrawerT.drawStringList();
    }

    requestNextAnimationFrame(main);
}

function overflowTan(v) {
    if (10 < v) {
        return true;
    }
    if (v < -10) {
        return true;
    }
    return false;
}
