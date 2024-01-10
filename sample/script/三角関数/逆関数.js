/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = [191, 191, 191];
const TEXT_COLOR = Drawer.BLACK;
const LINE_COLOR = Drawer.GRAY;
const RULER_COLOR = Drawer.BLACK;
const CIRCLE_COLOR = Drawer.BLACK;
const KNOB_COLOR = Drawer.GREEN;

const WAVE_WIDTH = 150;
const WAVE_HEIGHT = 300;
const GAP = 25;

let gDrawer = new Drawer("disp",
    WAVE_WIDTH * 4 + GAP * 4.5,
    WAVE_HEIGHT * 2 + GAP * 5
);
let gLineList = [];
let gLabelList = [];
let gaCosLine = [];
let gaSinLine = [];
let gaTanLine = [];

init();
requestNextAnimationFrame(main);

function init() {
    let eb = document.getElementsByTagName("body");
    for (let item of eb) {
        item.style.overflow = "hidden";
    }

    gDrawer.Offset = new vec(0, WAVE_HEIGHT + GAP);

    {
        let ofsX = WAVE_WIDTH + GAP/2;
        let div = 10;
        gLineList.push(new LineInfo(
            ofsX, 0,
            ofsX, WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        gLabelList.push({
            pos: new vec(ofsX-40, WAVE_HEIGHT+10),
            text: "[deg]",
            center: false,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX, WAVE_HEIGHT+17),
            text: "[θ]",
            center: true,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX+8, WAVE_HEIGHT+10),
            text: "[rad]",
            center: false,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX+WAVE_WIDTH+15, 4),
            text: "[x/r]",
            center: true,
            color: TEXT_COLOR
        });
        for (let deg=0; deg<=180; deg += 15) {
            let y = WAVE_HEIGHT * (180 - deg) / 180.0;
            let h = ((0 == deg % 45) ? 7 : 2.5);
            gLineList.push(new LineInfo(
                ofsX-h, y,
                ofsX+h, y,
                1, AXIZ_COLOR
            ));
            if (deg % 45 == 0) {
                gLabelList.push({
                    pos: new vec(ofsX+12, y-4),
                    text: toFrac(deg / 180, "π", false),
                    center: false,
                    color: TEXT_COLOR
                });
                gLabelList.push({
                    pos: new vec(ofsX-36, y-4),
                    text: toFrac(deg),
                    center: false,
                    color: TEXT_COLOR
                });
            }
            if (deg == 360) {
                gLabelList.push({
                    pos: new vec(ofsX+8, y-16),
                    text: "[rad]",
                    center: false,
                    color: TEXT_COLOR
                });
                gLabelList.push({
                    pos: new vec(ofsX-36, y-16),
                    text: "[deg]",
                    center: false,
                    color: TEXT_COLOR
                });
            }
        }
        gLineList.push(new LineInfo(
            ofsX-WAVE_WIDTH, 0,
            ofsX+WAVE_WIDTH, 0,
            1, AXIZ_COLOR
        ));
        for(let v=-div; v<=div; v++) {
            let h;
            switch(Math.abs(v)%div) {
            case 0:
                h = 10.0; break;
            case 5:
                h = 5.0; break;
            default:
                h = 2.5; break;
            }
            let x = v * WAVE_WIDTH / div;
            gLineList.push(new LineInfo(
                ofsX+x, -h,
                ofsX+x, h,
                1, AXIZ_COLOR
            ));
            if(0 == Math.abs(v*2) % 10) {
                gLabelList.push({
                    pos: new vec(ofsX+x, -15),
                    text: v/div + "",
                    center: true,
                    color: TEXT_COLOR
                });
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * y / WAVE_HEIGHT;
            gaCosLine.push(new vec(ofsX-Math.cos(th) * WAVE_WIDTH, y));
        }
    }
    {
        let ofsX = WAVE_WIDTH*3 + GAP*3;
        let div = 10;
        gLineList.push(new LineInfo(
            ofsX, 0,
            ofsX, WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        gLabelList.push({
            pos: new vec(ofsX-40, WAVE_HEIGHT+10),
            text: "[deg]",
            center: false,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX, WAVE_HEIGHT+17),
            text: "[θ]",
            center: true,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX+8, WAVE_HEIGHT+10),
            text: "[rad]",
            center: false,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX+WAVE_WIDTH+15, 4),
            text: "[y/r]",
            center: true,
            color: TEXT_COLOR
        });
        for (let deg=-90; deg<=90; deg += 15) {
            let y = WAVE_HEIGHT * (deg + 90) / 180.0;
            let h = ((0 == deg % 45) ? 7 : 2.5);
            gLineList.push(new LineInfo(
                ofsX-h, y,
                ofsX+h, y,
                1, AXIZ_COLOR
            ));
            if (deg % 45 == 0) {
                gLabelList.push({
                    pos: new vec(ofsX+12, y-4),
                    text: toFrac(deg / 180, "π", false),
                    center: false,
                    color: TEXT_COLOR
                });
                gLabelList.push({
                    pos: new vec(ofsX-36, y-4),
                    text: toFrac(deg),
                    center: false,
                    color: TEXT_COLOR
                });
            }
            if (deg == 360) {
                gLabelList.push({
                    pos: new vec(ofsX+8, y-16),
                    text: "[rad]",
                    center: false,
                    color: AXIZ_COLOR
                });
                gLabelList.push({
                    pos: new vec(ofsX-36, y-16),
                    text: "[deg]",
                    center: false,
                    color: AXIZ_COLOR
                });
            }
        }
        gLineList.push(new LineInfo(
            ofsX-WAVE_WIDTH, 0,
            ofsX+WAVE_WIDTH, 0,
            1, AXIZ_COLOR
        ));
        for(let v=-div; v<=div; v++) {
            let h;
            switch(Math.abs(v)%div) {
            case 0:
                h = 10.0; break;
            case 5:
                h = 5.0; break;
            default:
                h = 2.5; break;
            }
            let x = v * WAVE_WIDTH / div;
            gLineList.push(new LineInfo(
                ofsX+x, -h,
                ofsX+x, h,
                1, AXIZ_COLOR
            ));
            if(0 == Math.abs(v*2) % 10) {
                gLabelList.push({
                    pos: new vec(ofsX+x, -15),
                    text: v/div + "",
                    center: true,
                    color: TEXT_COLOR
                });
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * (y / WAVE_HEIGHT - 0.5);
            gaSinLine.push(new vec(ofsX+Math.sin(th) * WAVE_WIDTH, y));
        }
    }
    {
        let width = WAVE_WIDTH*2;
        let ofsX = width + GAP/2;
        let ofsY = -WAVE_HEIGHT-GAP*3;
        let amp = 10;
        let div = 10;
        gLineList.push(new LineInfo(
            ofsX, ofsY,
            ofsX, ofsY+WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        gLabelList.push({
            pos: new vec(ofsX-40, ofsY+WAVE_HEIGHT+10),
            text: "[deg]",
            center: false,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX, ofsY+WAVE_HEIGHT+17),
            text: "[θ]",
            center: true,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX+8, ofsY+WAVE_HEIGHT+10),
            text: "[rad]",
            center: false,
            color: TEXT_COLOR
        });
        gLabelList.push({
            pos: new vec(ofsX+width+16, ofsY+4),
            text: "[y/x]",
            center: true,
            color: TEXT_COLOR
        });
        for (let deg=-90; deg<=90; deg += 15) {
            let y = WAVE_HEIGHT * (deg + 90) / 180.0;
            let h = ((0 == deg % 45) ? 7 : 2.5);
            gLineList.push(new LineInfo(
                ofsX-h, ofsY+y,
                ofsX+h, ofsY+y,
                1, AXIZ_COLOR
            ));
            if (deg % 45 == 0) {
                gLabelList.push({
                    pos: new vec(ofsX+12, ofsY+y-4),
                    text: toFrac(deg / 180, "π", false),
                    center: false,
                    color: TEXT_COLOR
                });
                gLabelList.push({
                    pos: new vec(ofsX-36, ofsY+y-4),
                    text: toFrac(deg),
                    center: false,
                    color: TEXT_COLOR
                });
            }
            if (deg == 360) {
                gLabelList.push({
                    pos: new vec(ofsX+8, ofsY+y-16),
                    text: "[rad]",
                    center: false,
                    color: TEXT_COLOR
                });
                gLabelList.push({
                    pos: new vec(ofsX-36, ofsY+y-16),
                    text: "[deg]",
                    center: false,
                    color: TEXT_COLOR
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
            let x = v * width / (amp * div);
            gLineList.push(new LineInfo(
                ofsX+x, ofsY-h,
                ofsX+x, ofsY+h,
                1, AXIZ_COLOR
            ));
            switch(Math.abs(v)%10) {
            case 0:
                gLabelList.push({
                    pos: new vec(ofsX+x, ofsY-15),
                    text: v*0.1 + "",
                    center: true,
                    color: TEXT_COLOR
                });
                break;
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * (y / WAVE_HEIGHT + 0.5);
            let tan = Math.tan(th);
            tan = Math.min(amp, Math.max(-amp, tan)) * (0==y ? -1 : 1);
            gaTanLine.push(new vec(ofsX + tan*width/amp, ofsY+y));
        }
    }
}

function main() {
    gDrawer.clear();
    for (let i=0; i<gLineList.length; i++) {
        gLineList[i].draw(gDrawer);
    }
    gDrawer.drawPolyline(gaCosLine, LINE_COLOR, 1);
    gDrawer.drawPolyline(gaSinLine, LINE_COLOR, 1);
    gDrawer.drawPolyline(gaTanLine, LINE_COLOR, 1);
    for (let i=0; i<gLabelList.length; i++) {
        let lbl = gLabelList[i];
        if (lbl.center) {
            gDrawer.drawStringC(lbl.pos, lbl.text, 14, lbl.color);
        } else {
            gDrawer.drawString(lbl.pos, lbl.text, 14, lbl.color);
        }
    }
    requestNextAnimationFrame(main);
}