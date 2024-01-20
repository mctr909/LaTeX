/// <reference path="../math.js" />
/// <reference path="../drawer.js" />

const AXIZ_COLOR = Color.GRAY66;
const TEXT_COLOR = Color.BLACK;
const LINE_COLOR = Color.GRAY;
const RULER_COLOR = Color.BLACK;
const CIRCLE_COLOR = Color.BLACK;
const KNOB_COLOR = Color.GREEN;

const WAVE_WIDTH = 160;
const WAVE_HEIGHT = 250;
const GAP = 25;

let gDrawerC = new Drawer("dispC",
    WAVE_WIDTH * 2 + GAP * 2,
    WAVE_HEIGHT + GAP * 2
);
let gDrawerS = new Drawer("dispS",
    WAVE_WIDTH * 2 + GAP * 2,
    WAVE_HEIGHT + GAP * 2
);
let gDrawerT = new Drawer("dispT",
    WAVE_WIDTH * 4 + GAP * 4,
    WAVE_HEIGHT + GAP * 2
);
let gAxisListC = [];
let gAxisListS = [];
let gAxisListT = [];
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

    gDrawerC.Offset = new vec(0, WAVE_HEIGHT + GAP);
    gDrawerS.Offset = new vec(0, WAVE_HEIGHT + GAP);
    gDrawerT.Offset = new vec(0, WAVE_HEIGHT + GAP);

    {
        let ofsX = WAVE_WIDTH + GAP/2 + 2;
        let div = 10;
        gAxisListC.push(new LineInfo(
            ofsX, 0,
            ofsX, WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        gDrawerC.pushString(ofsX, WAVE_HEIGHT+17, "[θ]");
        gDrawerC.pushString(ofsX+25, WAVE_HEIGHT+17, "[rad]");
        gDrawerC.pushString(ofsX+WAVE_WIDTH+18, 4, "[x/r]");
        for (let deg=0; deg<=180; deg += 5) {
            let y = WAVE_HEIGHT * (180 - deg) / 180.0;
            let h = ((0 == deg % 45) ? 10 : (0 == deg % 15) ? 5 : 2.5);
            gAxisListC.push(new LineInfo(
                ofsX-h, y,
                ofsX+h, y,
                1, AXIZ_COLOR
            ));
            if (deg % 15 == 0) {
                gDrawerC.pushString(ofsX+25, y+3, toFrac(deg / 180, "π", false));
            }
        }
        gAxisListC.push(new LineInfo(
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
            gAxisListC.push(new LineInfo(
                ofsX+x, -h,
                ofsX+x, h,
                1, AXIZ_COLOR
            ));
            if(0 == Math.abs(v*2) % 10) {
                gDrawerC.pushString(ofsX+x, -15, v/div + "");
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * y / WAVE_HEIGHT;
            gLineC.push(new vec(ofsX-Math.cos(th) * WAVE_WIDTH, y));
        }
    }
    {
        let ofsX = WAVE_WIDTH + GAP/2 + 2;
        let div = 10;
        gAxisListS.push(new LineInfo(
            ofsX, 0,
            ofsX, WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        gDrawerS.pushString(ofsX, WAVE_HEIGHT+17, "[θ]");
        gDrawerS.pushString(ofsX+25, WAVE_HEIGHT+17, "[rad]");
        gDrawerS.pushString(ofsX+WAVE_WIDTH+18, 4, "[y/r]");
        for (let deg=-90; deg<=90; deg += 5) {
            let y = WAVE_HEIGHT * (deg + 90) / 180.0;
            let h = ((0 == deg % 45) ? 10 : (0 == deg % 15) ? 5 : 2.5);
            gAxisListS.push(new LineInfo(
                ofsX-h, y,
                ofsX+h, y,
                1, AXIZ_COLOR
            ));
            if (deg % 15 == 0) {
                gDrawerS.pushString(ofsX+25, y+3, toFrac(deg / 180, "π", false));
            }
        }
        gAxisListS.push(new LineInfo(
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
            gAxisListS.push(new LineInfo(
                ofsX+x, -h,
                ofsX+x, h,
                1, AXIZ_COLOR
            ));
            if(0 == Math.abs(v*2) % 10) {
                gDrawerS.pushString(ofsX+x, -15, v/div + "");
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * (y / WAVE_HEIGHT - 0.5);
            gLineS.push(new vec(ofsX+Math.sin(th) * WAVE_WIDTH, y));
        }
    }
    {
        let width = WAVE_WIDTH*2;
        let ofsX = width + GAP*2;
        let ofsY = 0;
        let amp = 10;
        let div = 10;
        gAxisListT.push(new LineInfo(
            ofsX, ofsY,
            ofsX, ofsY+WAVE_HEIGHT,
            1, AXIZ_COLOR
        ));
        gDrawerT.pushString(ofsX, ofsY+WAVE_HEIGHT+17, "[θ]");
        gDrawerT.pushString(ofsX+25, ofsY+WAVE_HEIGHT+17, "[rad]");
        gDrawerT.pushString(ofsX+width+18, ofsY+4, "[y/x]");
        for (let deg=-90; deg<=90; deg += 5) {
            let y = WAVE_HEIGHT * (deg + 90) / 180.0;
            let h = ((0 == deg % 45) ? 10 : (0 == deg % 15) ? 5 : 2.5);
            gAxisListT.push(new LineInfo(
                ofsX-h, ofsY+y,
                ofsX+h, ofsY+y,
                1, AXIZ_COLOR
            ));
            if (deg % 15 == 0) {
                gDrawerT.pushString(ofsX+25, ofsY+y+3, toFrac(deg / 180, "π", false));
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
            gAxisListT.push(new LineInfo(
                ofsX+x, ofsY-h,
                ofsX+x, ofsY+h,
                1, AXIZ_COLOR
            ));
            switch(Math.abs(v)%10) {
            case 0:
                gDrawerT.pushString(ofsX+x, ofsY-15, v*0.1 + "");
                break;
            }
        }
        for(let y=0; y<WAVE_HEIGHT; y++) {
            let th = Math.PI * (y / WAVE_HEIGHT + 0.5);
            let tan = Math.tan(th);
            if (-amp*1.2 <= tan && tan <= amp*1.2) {
                gLineT.push(new vec(ofsX + tan*width/amp, ofsY+y));
            }
        }
    }
}

function main() {
    gDrawerC.clear();
    for (let i=0; i<gAxisListC.length; i++) {
        gAxisListC[i].draw(gDrawerC);
    }
    gDrawerC.drawPolyline(gLineC, LINE_COLOR, 1);
    gDrawerC.drawStringList();

    gDrawerS.clear();
    for (let i=0; i<gAxisListS.length; i++) {
        gAxisListS[i].draw(gDrawerS);
    }
    gDrawerS.drawPolyline(gLineS, LINE_COLOR, 1);
    gDrawerS.drawStringList();

    gDrawerT.clear();
    for (let i=0; i<gAxisListT.length; i++) {
        gAxisListT[i].draw(gDrawerT);
    }
    gDrawerT.drawPolyline(gLineT, LINE_COLOR, 1);
    gDrawerT.drawStringList();

    requestNextAnimationFrame(main);
}