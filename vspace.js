//
// Vowel Space Synthesizer
// Michael Proctor
// mike.i.proctor@gmail.com
// 2022-08-27
//
// Inspired by:
// https://www.speech.kth.se/wavesurfer/formant/
// https://editor.p5js.org/golan/sketches/El9vQ13I1
//
//
// Web Audio framework: https://tonejs.github.io/
// Graphical framework: https://p5js.org/
//

// --------------------
// vowel space geometry
frontx1 = 100;
frontx2 = 250;
backx = 500;
totx = backx - frontx1;
difx = frontx2 - frontx1;
topy = 100;
boty = 500;
toty = boty - topy;
txty = 480;
txtdy = 20;
cursdx = 7;
cursdy = 7;
mouseOv = false;
overlay = "none";
oldx = 20;
oldy = 20;

// ---------------
// speaker control
lblSexx = backx + 25;
lblSexy = topy + 15;
selSexx = lblSexx;
selSexy = lblSexy + 10;
fontSex = 18;

// ---------------
// source control
lblSrcx = lblSexx;
lblSrcy = selSexy + 80;
selSrcx = lblSexx;
selSrcy = lblSrcy + 10;
fontSrc = fontSex;

// -----------------
// reference control
lblRefx = lblSexx;
lblRefy = selSrcy + 80;
selRefx = lblSexx;
selRefy = lblRefy + 10;
fontRef = fontSex;

// ---------------
// display params
bgndCol = 245;
fgndCol = 245;
lineCol = 10;
lineWt = 1;
cursSz = 22;
cursSym = "+";
cursCol = 10;
cursWt = 0;
fontSz = 16;
fontWt = 0;
fontCol = 16;
olaySz = 18;
olayWt = 0;

// ----------------------------------------
// initial acoustic parameters (Male schwa)
// (Fant 1960)
var F0_Hz = 100;

var F1_Hz = 500;
var F1_QF = 10;
var F1min = 250;
var F1max = 750;

var F2_Hz = 1500;
var F2_QF = 15;
var F2min = 500;
var F2max = 2500;

var F3_Hz = 2500;
var F3_QF = 25;

var F4_Hz = 3500;
var F4_QF = 35;

//================
function preload() {
  bpfF1 = new Tone.Filter({
    frequency: F1_Hz,
    type: "bandpass",
    Q: F1_QF,
  }).toDestination();

  bpfF2 = new Tone.Filter({
    frequency: F2_Hz,
    type: "bandpass",
    Q: F2_QF,
  }).toDestination();

  bpfF3 = new Tone.Filter({
    frequency: F3_Hz,
    type: "bandpass",
    Q: F3_QF,
  }).toDestination();

  bpfF4 = new Tone.Filter({
    frequency: F4_Hz,
    type: "bandpass",
    Q: F4_QF,
  }).toDestination();

  vowel = new Tone.Oscillator({
    type: "sawtooth",
    volume: 3,
  })
    .connect(bpfF1)
    .connect(bpfF2)
    .connect(bpfF3)
    .connect(bpfF4);

  whisp = new Tone.Noise({
    type: "white",
    volume: -20,
  })
    .connect(bpfF1)
    .connect(bpfF2)
    .connect(bpfF3)
    .connect(bpfF4);
}

//=============
function setup() {
  createCanvas(windowWidth, windowHeight);

  // speaker sex selector
  selSex = createSelect();
  selSex.position(selSexx, selSexy);
  selSex.option("male");
  selSex.option("female");
  selSex.changed(changeSex);

  // glottal source selector
  selSrc = createSelect();
  selSrc.position(selSrcx, selSrcy);
  selSrc.option("voiced");
  selSrc.option("whisper");
  selSrc.changed(changeSrc);

  // reference vowel overlay selector
  selRef = createSelect();
  selRef.position(selRefx, selRefy);
  selRef.option("none");
  selRef.option("cardinal");
  selRef.changed(changeRef);
  olayCol = color("rgb(8,128,160)");
}

//=============
function draw() {
  // fetch mouse position
  var x = mouseX;
  var y = mouseY;

  // erase old cursor, check location
  background(bgndCol);
  if (x > frontx1 && x < backx && y > topy && y < boty) {
    mouseOv = true;
  } else {
    mouseOv = false;
  }

  // refresh cursor
  if (mouseOv) {
    stroke(cursCol);
    strokeWeight(cursWt);
    fill(cursCol);
    textSize(cursSz);
    text(cursSym, x - cursdx, y + cursdy);
  }

  // refresh controls
  textSize(fontSex);
  text("Speaker", lblSexx, lblSexy);
  text("Source", lblSrcx, lblSrcy);
  text("Reference", lblRefx, lblRefy);

  // draw vowel quadrilateral
  noFill();
  stroke(lineCol);
  strokeWeight(lineWt);
  quad(frontx1, topy, frontx2, boty, backx, boty, backx, topy);

  // refresh vowel overlay
  if (overlay == "cardinal") {
    overlayCard();
  }

  // report formant frequencies at cursor position
  F1 = map(y, topy, boty, F1min, F1max);
  F2 = map(x, frontx1, backx, F2max, F2min);
  textSize(fontSz);
  strokeWeight(fontWt);
  fill(fontCol);
  txt1 = "F1 = " + str(round(F1)) + " Hz";
  txt2 = "F2 = " + str(round(F2)) + " Hz";
  text(txt1, frontx1, txty);
  text(txt2, frontx1, txty + txtdy);
}

//=====================
function mousePressed() {
  if (mouseOv) {
    bpfF1.frequency.value = F1;
    bpfF2.frequency.value = F2;
    vowel.frequency.value = F0_Hz;
    vowel.start();
    whisp.start();
  }
}

//======================
function mouseReleased() {
  vowel.stop();
  whisp.stop();
}

//==================
function changeSex() {
  if (selSex.value() == "male") {
    F0_Hz = 110;
    F1min = 250;
    F1max = 750;
    F2min = 500;
    F2max = 2500;
  } else if (selSex.value() == "female") {
    F0_Hz = 180;
    F1min = 300;
    F1max = 1100;
    F2min = 800;
    F2max = 3000;
  }
}

//==================
function changeSrc() {
  if (selSrc.value() == "voiced") {
    vowel.volume.value = 3;
    whisp.volume.value = -30;
  } else if (selSrc.value() == "whisper") {
    vowel.volume.value = -30;
    whisp.volume.value = -10;
  }
}

//==================
function changeRef() {
  if (selRef.value() == "cardinal") {
    overlay = "cardinal";
  } else {
    overlay = "none";
  }
}

//==================
function overlayCard() {
  textSize(olaySz);
  strokeWeight(olayWt);
  fill(olayCol);

  text("u", backx - oldx, topy + oldy);
  text("o", backx - oldx, topy + 0.33 * toty);
  text("ɔ", backx - oldx, topy + 0.67 * toty);
  text("ɒ", backx - oldx, boty - oldy);
  text("a", frontx2 + 0.2 * oldx, boty - oldy);
  text("ɛ", frontx1 + 0.67 * (difx + oldx), topy + 0.67 * toty);
  text("e", frontx1 + 0.33 * (difx + oldx), topy + 0.33 * toty);
  text("i", frontx1 + oldx, topy + oldy);
}
