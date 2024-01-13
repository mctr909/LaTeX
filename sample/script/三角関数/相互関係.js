/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = [191,191,191];
const TEXT_COLOR = Drawer.BLACK;
const LINE_COLOR = [95,95,95];
const RULER_COLOR = Drawer.BLACK;
const CIRCLE_COLOR = Drawer.BLACK;
const KNOB_COLOR = Drawer.GREEN;

const WAVE_WIDTH = 240;
const WAVE_HEIGHT = 100;
const GAP = 25;

let gDrawerCycleC = new Drawer("dispCycleC",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT + GAP
);
let gDrawerCycleS = new Drawer("dispCycleS",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT + GAP
);
let gDrawerCycleT = new Drawer("dispCycleT",
    WAVE_WIDTH + GAP * 2,
    WAVE_HEIGHT * 2 + GAP * 2
);

let gAxisListC = [];
let gAxisListS = [];
let gAxisListT = [];
let gLabelListC = [];
let gLabelListS = [];
let gLabelListT = [];
let gLineC = [];
let gLineS = [];
let gLineT = [];

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }

    gDrawerCycleC.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP/2);
    gDrawerCycleS.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT/2 + GAP/2);
    gDrawerCycleT.Offset = new vec(WAVE_WIDTH/2 + GAP/2, WAVE_HEIGHT + GAP);

    {
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
        gLabelListC.push({
            pos: new vec(WAVE_WIDTH/2+17, 4),
            text: "[θ]"
        });
        gLabelListC.push({
            pos: new vec(WAVE_WIDTH/2+23, -14),
            text: "[rad]"
        });
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
                gLabelListC.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            case 2:
            case 6:
                h = 3;
                gLabelListC.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            default:
                h = 3; break;
            }
            gAxisListC.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        for(let x=-WAVE_WIDTH/2; x<WAVE_WIDTH/2; x++) {
            let th = 8*Math.PI * x / WAVE_WIDTH;
            gLineC.push(new vec(x, Math.cos(th) * WAVE_HEIGHT/2));
        }
    }
    {
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
        gLabelListS.push({
            pos: new vec(WAVE_WIDTH/2+17, 4),
            text: "[θ]"
        });
        gLabelListS.push({
            pos: new vec(WAVE_WIDTH/2+23, -14),
            text: "[rad]"
        });
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
                gLabelListS.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            case 2:
            case 6:
                h = 3;
                gLabelListS.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            default:
                h = 3; break;
            }
            gAxisListS.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        for(let x=-WAVE_WIDTH/2; x<WAVE_WIDTH/2; x++) {
            let th = 8*Math.PI * x / WAVE_WIDTH;
            gLineS.push(new vec(x, Math.sin(th) * WAVE_HEIGHT/2));
        }
    }
    {
        gAxisListT.push(new LineInfo(
            0, -WAVE_HEIGHT*1.1,
            0, WAVE_HEIGHT*1.1,
            1, AXIZ_COLOR
        ));
        gAxisListT.push(new LineInfo(
            -WAVE_WIDTH/2, 0,
            +WAVE_WIDTH/2, 0,
            1, AXIZ_COLOR
        ));
        gLabelListT.push({
            pos: new vec(WAVE_WIDTH/2+17, 4),
            text: "[θ]"
        });
        gLabelListT.push({
            pos: new vec(WAVE_WIDTH/2+23, -14),
            text: "[rad]"
        });
        let div = 4;
        for(let v=-div; v<=div; v++) {
            let x = v * WAVE_WIDTH * 0.5 / div;
            let m = Math.abs(v);
            let h;
            switch (m) {
            case 0:
            case 4:
                h = 10;
                gLabelListT.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            case 2:
                h = 3;
                gLabelListT.push({
                    pos: new vec(x, -15),
                    text: toFrac(v/2, "π", false) + ""
                });
                break;
            default:
                h = 3; break;
            }
            gAxisListT.push(new LineInfo(
                x, -h,
                x, h,
                1, AXIZ_COLOR
            ));
        }
        let tanList = [];
        for(let x=-WAVE_WIDTH/2; x<WAVE_WIDTH/2; x++) {
            let th = 4*Math.PI * x / WAVE_WIDTH;
            let t = Math.tan(th);
            if (t < -100 || t > 100) {
                for (let i = 0; i < tanList.length; i++) {
                    gLineT.push(tanList[i]);
                }
                tanList = [];
            } else {
                tanList.push(new vec(x, t * WAVE_HEIGHT/4));
            }
        }
        for (let i = 0; i < tanList.length; i++) {
            gLineT.push(tanList[i]);
        }
    }
}

function main() {
    gDrawerCycleC.clear();
    for (let i=0; i<gAxisListC.length; i++) {
        gAxisListC[i].draw(gDrawerCycleC);
    }
    gDrawerCycleC.drawPolyline(gLineC, LINE_COLOR, 1);
    for (let i=0; i<gLabelListC.length; i++) {
        let lbl = gLabelListC[i];
        gDrawerCycleC.drawStringC(lbl.pos, lbl.text, 14);
    }

    gDrawerCycleS.clear();
    for (let i=0; i<gAxisListS.length; i++) {
        gAxisListS[i].draw(gDrawerCycleS);
    }
    gDrawerCycleS.drawPolyline(gLineS, LINE_COLOR, 1);
    for (let i=0; i<gLabelListS.length; i++) {
        let lbl = gLabelListS[i];
        gDrawerCycleS.drawStringC(lbl.pos, lbl.text, 14);
    }

    gDrawerCycleT.clear();
    for (let i=0; i<gAxisListT.length; i++) {
        gAxisListT[i].draw(gDrawerCycleT);
    }
    gDrawerCycleT.drawPolyline(gLineT, LINE_COLOR, 1);
    for (let i=0; i<gLabelListT.length; i++) {
        let lbl = gLabelListT[i];
        gDrawerCycleT.drawStringC(lbl.pos, lbl.text, 14);
    }

    requestNextAnimationFrame(main);
}