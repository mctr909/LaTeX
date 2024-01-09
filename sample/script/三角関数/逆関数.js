/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Drawer.GRAY;
const MEASURE_COLOR = Drawer.BLACK;
const RULER_COLOR = Drawer.GRAY;
const CIRCLE_COLOR = Drawer.BLACK;
const KNOB_COLOR = Drawer.GREEN;
const COS_COLOR = Drawer.BLUE;
const SIN_COLOR = Drawer.RED;
const TAN_COLOR = Drawer.BLACK;
const WAVE_WIDTH = 150;
const WAVE_HEIGHT = 300;
const GAP = 25;

let gDrawer = new Drawer("disp",
    WAVE_WIDTH * 4 + GAP * 3,
    WAVE_HEIGHT * 2 + GAP * 4
);

init();
function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }

    gDrawer.Offset = new vec(0, WAVE_HEIGHT + GAP);

    let lineList = [];
    let labelList = [];

    let aCosLine = [];
    {
        let ofsX = WAVE_WIDTH + GAP;
        let div = 10;
        lineList.push(new LineInfo(
            ofsX, 0,
            ofsX, WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        for (let deg=0; deg<=180; deg += 15) {
            let y = WAVE_HEIGHT * (180 - deg) / 180.0;
            let h = ((0 == deg % 45) ? 7 : 2.5);
            lineList.push(new LineInfo(
                ofsX-h, y,
                ofsX+h, y,
                1, AXIZ_COLOR
            ));
            if (deg % 45 == 0) {
                labelList.push({
                    pos: new vec(ofsX+12, y-4),
                    text: toFrac(deg / 180, "π", false),
                    center: false
                });
                labelList.push({
                    pos: new vec(ofsX-36, y-4),
                    text: toFrac(deg),
                    center: false
                });
            }
            if (deg == 360) {
                labelList.push({
                    pos: new vec(ofsX+8, y-16),
                    text: "[rad]",
                    center: false
                });
                labelList.push({
                    pos: new vec(ofsX-36, y-16),
                    text: "[deg]",
                    center: false
                });
            }
        }
        lineList.push(new LineInfo(
            ofsX-WAVE_WIDTH, 0,
            ofsX+WAVE_WIDTH, 0,
            1, AXIZ_COLOR
        ));
        for(let v=-div; v<=div; v++) {
            let h;
            if(0 == Math.abs(v)%div) {
                h = 10.0;
            } else {
                h = 2.5;
            }
            let x = v * WAVE_WIDTH / div;
            lineList.push(new LineInfo(
                ofsX+x, -h,
                ofsX+x, h,
                1, AXIZ_COLOR
            ));
            if(0 == Math.abs(v*2) % 10) {
                labelList.push({
                    pos: new vec(ofsX+x, -15),
                    text: v/div + "",
                    center: true
                });
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * y / WAVE_HEIGHT;
            aCosLine.push(new vec(ofsX-Math.cos(th) * WAVE_WIDTH, y));
        }
    }

    let aSinLine = [];
    {
        let ofsX = WAVE_WIDTH*3 + GAP*2;
        let div = 10;
        lineList.push(new LineInfo(
            ofsX, 0,
            ofsX, WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        for (let deg=-90; deg<=90; deg += 15) {
            let y = WAVE_HEIGHT * (deg + 90) / 180.0;
            let h = ((0 == deg % 45) ? 7 : 2.5);
            lineList.push(new LineInfo(
                ofsX-h, y,
                ofsX+h, y,
                1, AXIZ_COLOR
            ));
            if (deg % 45 == 0) {
                labelList.push({
                    pos: new vec(ofsX+12, y-4),
                    text: toFrac(deg / 180, "π", false),
                    center: false
                });
                labelList.push({
                    pos: new vec(ofsX-36, y-4),
                    text: toFrac(deg),
                    center: false
                });
            }
            if (deg == 360) {
                labelList.push({
                    pos: new vec(ofsX+8, y-16),
                    text: "[rad]",
                    center: false
                });
                labelList.push({
                    pos: new vec(ofsX-36, y-16),
                    text: "[deg]",
                    center: false
                });
            }
        }
        lineList.push(new LineInfo(
            ofsX-WAVE_WIDTH, 0,
            ofsX+WAVE_WIDTH, 0,
            1, AXIZ_COLOR
        ));
        for(let v=-div; v<=div; v++) {
            let h;
            if(0 == Math.abs(v)%div) {
                h = 10.0;
            } else {
                h = 2.5;
            }
            let x = v * WAVE_WIDTH / div;
            lineList.push(new LineInfo(
                ofsX+x, -h,
                ofsX+x, h,
                1, AXIZ_COLOR
            ));
            if(0 == Math.abs(v*2) % 10) {
                labelList.push({
                    pos: new vec(ofsX+x, -15),
                    text: v/div + "",
                    center: true
                });
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * (y / WAVE_HEIGHT - 0.5);
            aSinLine.push(new vec(ofsX+Math.sin(th) * WAVE_WIDTH, y));
        }
    }

    let aTanLine = [];
    {
        let ofsX = WAVE_WIDTH*2 + GAP;
        let ofsY = -WAVE_HEIGHT-GAP*2;
        let amp = 10;
        let div = 10;
        lineList.push(new LineInfo(
            ofsX, ofsY,
            ofsX, ofsY+WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        for (let deg=-90; deg<=90; deg += 15) {
            let y = WAVE_HEIGHT * (deg + 90) / 180.0;
            let h = ((0 == deg % 45) ? 7 : 2.5);
            lineList.push(new LineInfo(
                ofsX-h, ofsY+y,
                ofsX+h, ofsY+y,
                1, AXIZ_COLOR
            ));
            if (deg % 45 == 0) {
                labelList.push({
                    pos: new vec(ofsX+12, ofsY+y-4),
                    text: toFrac(deg / 180, "π", false),
                    center: false
                });
                labelList.push({
                    pos: new vec(ofsX-36, ofsY+y-4),
                    text: toFrac(deg),
                    center: false
                });
            }
            if (deg == 360) {
                labelList.push({
                    pos: new vec(ofsX+8, ofsY+y-16),
                    text: "[rad]",
                    center: false
                });
                labelList.push({
                    pos: new vec(ofsX-36, ofsY+y-16),
                    text: "[deg]",
                    center: false
                });
            }
        }
        for(let v=-amp*div; v<=amp*div; v++) {
            let h;
            switch(Math.abs(v)%div) {
            case 0:
                h = 10.0; break;
            case 5:
                h = 5.0; break;
            default:
                h = 2.5; break;
            }
            let x = v * WAVE_WIDTH * 2 / (amp * div);
            lineList.push(new LineInfo(
                ofsX+x, ofsY-h,
                ofsX+x, ofsY+h,
                1, AXIZ_COLOR
            ));
            switch(Math.abs(v)%10) {
            case 0:
                labelList.push({
                    pos: new vec(ofsX+x, ofsY-15),
                    text: v*0.1 + "",
                    center: true
                });
                break;
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * (y / WAVE_HEIGHT + 0.5);
            let tan = Math.tan(th);
            tan = Math.min(amp, Math.max(-amp, tan)) * (0==y ? -1 : 1);
            aTanLine.push(new vec(ofsX+ 2*tan*WAVE_WIDTH/amp, ofsY+y));
        }
    }

    for (let i=0; i<lineList.length; i++) {
        lineList[i].draw(gDrawer);
    }
    gDrawer.drawPolyline(aCosLine, COS_COLOR, 1);
    gDrawer.drawPolyline(aSinLine, SIN_COLOR, 1);
    gDrawer.drawPolyline(aTanLine, TAN_COLOR, 1);
    for (let i=0; i<labelList.length; i++) {
        let lbl = labelList[i];
        if (lbl.center) {
            gDrawer.drawStringC(lbl.pos, lbl.text, 14);
        } else {
            gDrawer.drawString(lbl.pos, lbl.text, 14);
        }
    }
}
