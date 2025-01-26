// ------------------------
// Vowel Space Synthesizer
// ------------------------
// Michael Proctor
// mike.i.proctor@gmail.com
// Created: 2022-08-27
// Updated: 2025-01-26
//
// Inspired by:
// https://www.speech.kth.se/wavesurfer/formant/
// https://editor.p5js.org/golan/sketches/El9vQ13I1
//
// Web Audio framework: https://tonejs.github.io/
// Graphical framework: https://p5js.org/
//
//
// ----------------------------
// Formant frequency references:
// ----------------------------
// Cardinal: Bladon & Fant (1978)
// Dutch: Pols et al. (1973); Van Nierop et al. (1973)
// English Australian: Cox (2006)
// English RP: Deterding (1997)
// English USA: Hillenbrand et al. (1995)
// Japanese: Yazawa & Kondo (2019)
// Russian: Fant (1971)
//

// --------------------
// vowel space geometry
// --------------------
const frontx1 = 50;
const frontx2 = 225;
const backx = 500;
const totx = backx - frontx1;
const difx = frontx2 - frontx1;
const topy = 50;
const boty = 500;
const toty = boty - topy;

// ------------------------------
// acoustic limits of vowel space
// ------------------------------
const  F1minM =  210;
const  F1maxM =  830;
const  F1difM = F1maxM-F1minM;
const  F1minF =  230;
const  F1maxF = 1100;
const  F1difF = F1maxF-F1minF;

const  F2minM =  500;
const  F2mxMa = 1800;    // bottom left M vspace
const  F2maxM = 2600;
const  F2df1M = F2maxM-F2minM;
const  F2df2M = F2maxM-F2mxMa;
const  F2minF =  600;
const  F2mxFa = 2200;    // bottom left F vspace
const  F2maxF = 3200;
const  F2df1F = F2maxF-F2minF;
const  F2df2F = F2maxF-F2mxFa;

const  F3minM = 2200;
const  F3maxM = 3200;
const  F3minF = 2300;
const  F3maxF = 3700;

const  F4minM = 3100;
const  F4maxM = 4000;
const  F4minF = 3900;
const  F4maxF = 4700;

// ------------------------
// formant display settings
// ------------------------
const txtFy = 473;
const txtDB = 450;
const txtdy = 23;
const cursdx = 7;
const cursdy = 7;
const radSel = 15;    // reference vowel selection radius
let   mouseOv = false;

// ---------------
// filter control
// ---------------
const wInpB = 55;
const hInpB = 20;
const l1fmt = 50;
const l2fmt = l1fmt+30;
const l3fmt = l2fmt+wInpB+11;
const rhfmt = 30;
const t1fmt = 375;
const t2fmt = t1fmt+rhfmt;
const t3fmt = t2fmt+rhfmt;
const t4fmt = t3fmt+rhfmt;

// ---------------
// speaker control
// ---------------
const lblSpkx = backx + 25;
const lblSpky = topy + 15;
const selSpkx = lblSpkx;
const selSpky = lblSpky + 12;
const fontSpk = 18;

// ---------------
// source control
// ---------------
const lblSrcx = lblSpkx;
const lblSrcy = selSpky + 80;
const selSrcx = lblSpkx;
const selSrcy = lblSrcy + 12;
const fontSrc = fontSpk;

// -----------------
// reference control
// -----------------
const lblRefx = lblSpkx;
const lblRefy = selSrcy + 80;
const selRefx = lblSpkx;
const selRefy = lblRefy + 12;
const fontRef = fontSpk;

// ---------------
// display params
// ---------------
const bgndCol = 250;
const fgndCol = "#E0F2F7";
const olinCol = "#88ccff";
const vrefCol = "#0088bb";
const vow2Col = "#0880a0";
const vselCol = "#001155";
const vse2Col = "#11ddee";
const lineWt = 1;
const cursSz = 22;
const cursSym = "+";
const cursCol = 10;
const cursWt = 0;
const fontSz = 16;
const fontWt = 0;
const fontCol = 16;
const olaySz = 19;
const olayWt = 0;
const vselWt = 0;
const vselSz = 19;

// -----------------------
// voice source parameters
// -----------------------
const F0_M = 115;      // mean male F0 (Hillenbrand 1995: 130Hz)
const F0_F = 220;      // mean female F0 (Hillenbrand 1995)
let F0_Hz  = F0_M;     // source frequency
let F0_Ha  = 0.80;     // vibrato source harmonicity
let F0_MI  = 0.08;     // vibrato source modulation index

// ----------------------------------------
// initial acoustic parameters (Male schwa)
// (Fant 1960)
// ----------------------------------------
let F1_Hz = 500;
let F1_QF = 10;
let F1min = F1minM;
let F1max = F1maxM;

let F2_Hz = 1500;
let F2_QF = 15;
let F2min = F2minM;
let F2max = F2maxM;

let F3_Hz = 2500;
let F3_QF = 25;

let F4_Hz = 3500;
let F4_QF = 35;

var vrefs = [];


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

  vowel = new Tone.FMOscillator({
    type: "sawtooth",
    modulationType: "sine",
    harmonicity: F0_Ha,
    modulationIndex: F0_MI,
    frequency: F0_Hz,
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
  
  // formant specification controls
  fm1L1 = createElement('p','F1:');
  fm1L1.position(l1fmt, t1fmt);
  fmtF1 = createInput(F1_Hz.toString(), 'number');
  fmtF1.position(l2fmt, t1fmt+13);
  fmtF1.size(wInpB, hInpB);
  fmtF1.attribute('step', '10');
  fmtF1.attribute('min', str(F1minM));
  fmtF1.attribute('max', str(F1maxF));
  fm1L2 = createElement('p','Hz');
  fm1L2.position(l3fmt, t1fmt);

  fm2L1 = createElement('p','F2:');
  fm2L1.position(l1fmt, t2fmt);
  fmtF2 = createInput(F2_Hz.toString(), 'number');
  fmtF2.position(l2fmt, t2fmt+13);
  fmtF2.size(wInpB, hInpB);
  fmtF2.attribute('step', '10');
  fmtF2.attribute('min', str(F2minM));
  fmtF2.attribute('max', str(F2maxF));
  fm2L2 = createElement('p','Hz');
  fm2L2.position(l3fmt, t2fmt);

  fm3L1 = createElement('p','F3:');
  fm3L1.position(l1fmt, t3fmt);
  fmtF3 = createInput(F3_Hz.toString(), 'number');
  fmtF3.position(l2fmt, t3fmt+13);
  fmtF3.size(wInpB, hInpB);
  fmtF3.attribute('step', '10');
  fmtF3.attribute('min', str(F3minM));
  fmtF3.attribute('max', str(F3maxF));
  fm3L2 = createElement('p','Hz');
  fm3L2.position(l3fmt, t3fmt);

  fm4L1 = createElement('p','F4:');
  fm4L1.position(l1fmt, t4fmt);
  fmtF4 = createInput(F4_Hz.toString(), 'number');
  fmtF4.position(l2fmt, t4fmt+13);
  fmtF4.size(wInpB, hInpB);
  fmtF4.attribute('step', '10');
  fmtF4.attribute('min', str(F4minM));
  fmtF4.attribute('max', str(F4maxF));
  fm4L2 = createElement('p','Hz');
  fm4L2.position(l3fmt, t4fmt);
  
  // speaker Spk selector
  selSpk = createSelect();
  selSpk.position(selSpkx, selSpky);
  selSpk.option("male");
  selSpk.option("female");
  selSpk.changed(changeSpk);

  // glottal source selector
  selSrc = createSelect();
  selSrc.position(selSrcx, selSrcy);
  selSrc.option("voiced");
  selSrc.option("whisper");
  selSrc.option("vibrato");
  selSrc.changed(changeSrc);

  // reference vowel overlay selector
  selRef = createSelect();
  selRef.position(selRefx, selRefy);
  selRef.option("none");
  selRef.option("Cardinal");
  selRef.option("Dutch");
  selRef.option("English Aus");
  selRef.option("English RP");
  selRef.option("English USA");
  selRef.option("Japanese");
  selRef.option("Russian");
  selRef.changed(refreshOverlay);
}

//=============
function draw() {
  
  // fetch mouse position
  var x = mouseX;
  var y = mouseY;

  // erase old cursor, check location
  background(bgndCol);
  if (x < backx && y > topy && y < boty) {
    frontquad = frontx1 + ((y-topy)/toty)*difx
    if (x > frontquad) {
      mouseOv = true;
    } else {
      mouseOv = false;
    }
  } else {
    mouseOv = false;
  }

  // refresh controls
  textSize(fontSpk);
  strokeWeight(fontWt);
  fill(fontCol);
  text("Speaker", lblSpkx, lblSpky);
  text("Source", lblSrcx, lblSrcy);
  text("Reference", lblRefx, lblRefy);
  textAlign(LEFT);

  // draw vowel quadrilateral
  //noFill();
  fill(fgndCol);
  stroke(olinCol);
  strokeWeight(lineWt);
  quad(frontx1, topy, frontx2, boty, backx, boty, backx, topy);

  // refresh reference vowel display
  refreshOverlay();

  // refresh cursor
  if (mouseOv) {
    stroke(cursCol);
    strokeWeight(cursWt);
    fill(cursCol);
    textSize(cursSz);
    text(cursSym, x - cursdx, y + cursdy);
  }

  // locate closest vowel to cursor
  // select as reference if close enough (<radSel)
  if (mouseOv) {
    if (selRef.value() != "none") {
      let ix = findClosestV(x,y);
      d = dist(x,y, vrefs[ix].vx,vrefs[ix].vy);
      if (d < radSel) {
        vrefs[ix].highlight();
        F3_Hz = vrefs[ix].F3;
        F4_Hz = vrefs[ix].F4;
        fmtF1.value(str(round(F1_Hz)));
        fmtF2.value(str(round(F2_Hz)));
        fmtF3.value(str(round(F3_Hz)));
        fmtF4.value(str(round(F4_Hz)));
        txt = "Selected: [" + vrefs[ix].lb + "]";
        textSize(fontSz);
        text(txt, l1fmt, t1fmt);
      }
    }
  }

  // report formant frequencies at cursor position
  if (mouseOv) {
    F1_Hz = map(y, topy, boty, F1min, F1max);
    F2_Hz = map(x, frontx1, backx, F2max, F2min);
    textSize(fontSz);
    strokeWeight(fontWt);
    fill(fontCol);
    txt1 = "F1 = " + str(round(F1_Hz)) + " Hz";
    txt2 = "F2 = " + str(round(F2_Hz)) + " Hz";
    text(txt1, lblSpkx, txtFy);
    text(txt2, lblSpkx, txtFy + txtdy);
  }
}

//=====================
function mousePressed() {
  if (mouseOv) {
    changeSrc();
    fmtF1.value(str(round(F1_Hz)));
    fmtF2.value(str(round(F2_Hz)));
    F3_Hz = str(round(fmtF3.value()));
    F4_Hz = str(round(fmtF4.value()));
    bpfF1.frequency.value = F1_Hz;
    bpfF2.frequency.value = F2_Hz;
    bpfF3.frequency.value = F3_Hz;
    bpfF4.frequency.value = F4_Hz;
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
function changeSpk() {
  if (selSpk.value() == "male") {
    F0_Hz = F0_M;
    F1min = F1minM;
    F1max = F1maxM;
    F2min = F2minM;
    F2max = F2maxM;
  } else if (selSpk.value() == "female") {
    F0_Hz = F0_F;
    F1min = F1minF;
    F1max = F1maxF;
    F2min = F2minF;
    F2max = F2maxF;
  }
  refreshOverlay();
}

//==================
function changeSrc() {
  if (selSrc.value() == "voiced") {
    vowel.harmonicity.value = 1;
    vowel.modulationIndex.value = 0;
    vowel.volume.value = 3;
    whisp.volume.value = -18;
  } else if (selSrc.value() == "whisper") {
    vowel.volume.value = -40;
    whisp.volume.value = -12;
  } else if (selSrc.value() == "vibrato") {
    vowel.harmonicity.value = F0_Ha;
    vowel.modulationIndex.value = F0_MI;
    vowel.volume.value = 0;
    whisp.volume.value = -18;
  }
}

//=====================
function refreshOverlay() {

  const dF1m =  25;
  const dF2m = 100;
  const dF1f = 1.3*dF1m;
  const dF2f = 1.3*dF2m;
  
  if (selRef.value() == "Cardinal") {
    if (selSpk.value() == "male") {
      // Bladon & Fant (1978) Table I-A-I
      vrefs = [];
      vrefs.push(new Vowel("i", F1minM+dF1m,       F2maxM-dF2m,            3070, 3590));
      vrefs.push(new Vowel("e", F1minM+1/3*F1difM, F2maxM-1/3*F2df2M-dF2m, 2720, 3790));
      vrefs.push(new Vowel("ɛ", F1minM+2/3*F1difM, F2maxM-2/3*F2df2M-dF2m, 2580, 3940));
      vrefs.push(new Vowel("a", F1maxM-dF1m,       F2mxMa-dF2m,            2460, 3710));
      vrefs.push(new Vowel("ɑ", F1maxM-dF1m,       F2minM+dF2m,            2770, 3650));
      vrefs.push(new Vowel("ɔ", F1minM+2/3*F1difM, F2minM+dF2m,            2640, 3310));
      vrefs.push(new Vowel("o", F1minM+1/3*F1difM, F2minM+dF2m,            2670, 3240));
      vrefs.push(new Vowel("u", F1minM+dF1m,       F2minM+dF2m,            2550, 3280));
    } else {
      vrefs = [];
      vrefs.push(new Vowel("i", F1minF+dF1f,       F2maxF-dF2f,            3070, 3590));
      vrefs.push(new Vowel("e", F1minF+1/3*F1difF, F2maxF-1/3*F2df2F-dF2f, 2720, 3790));
      vrefs.push(new Vowel("ɛ", F1minF+2/3*F1difF, F2maxF-2/3*F2df2F-dF2f, 2580, 3940));
      vrefs.push(new Vowel("a", F1maxF-dF1f,       F2mxFa-dF2f,            2460, 3710));
      vrefs.push(new Vowel("ɑ", F1maxF-dF1f,       F2minF+dF2f,            2770, 3650));
      vrefs.push(new Vowel("ɔ", F1minF+2/3*F1difF, F2minF+dF2f,            2640, 3310));
      vrefs.push(new Vowel("o", F1minF+1/3*F1difF, F2minF+dF2f,            2670, 3240));
      vrefs.push(new Vowel("u", F1minF+dF1f,       F2minF+dF2f,            2550, 3280));
    }
    
  } else if (selRef.value() == "Dutch") {
    if (selSpk.value() == "male") {
      // Pols et al. (1973)
      // no F4 data: Bladon & Fant (1978) / Hillenbrand (1995) values used
      vrefs = [];
      vrefs.push(new Vowel("i",  294, 2208, 2766, 3590));
      vrefs.push(new Vowel("y",  305, 1730, 2208, 3257));
      vrefs.push(new Vowel("ɪ",  388, 2003, 2571, 3521));
      vrefs.push(new Vowel("e",  407, 2017, 2553, 3503));
      vrefs.push(new Vowel("ø",  443, 1497, 2260, 3200));
      vrefs.push(new Vowel("ɛ",  583, 1725, 2471, 3840));
      vrefs.push(new Vowel("œ",  438, 1498, 2354, 3286));
      vrefs.push(new Vowel("a",  795, 1301, 2565, 3624));
      vrefs.push(new Vowel("ɑ",  679, 1051, 2619, 3687));
      vrefs.push(new Vowel("ɔ",  523,  866, 2692, 3586));
      vrefs.push(new Vowel("o",  487,  911, 2481, 3384));
      vrefs.push(new Vowel("u",  339,  810, 2323, 3357));
    } else {
      // Van Nierop et al. (1973)
      // no F4 data: Bladon & Fant (1978) / Hillenbrand (1995) values used
      vrefs = [];
      vrefs.push(new Vowel("i",  276, 2510, 3046, 4100));
      vrefs.push(new Vowel("y",  288, 1832, 2520, 3557));
      vrefs.push(new Vowel("ɪ",  465, 2262, 2840, 3821));
      vrefs.push(new Vowel("e",  471, 2352, 2895, 3803));
      vrefs.push(new Vowel("ø",  476, 1690, 2512, 3500));
      vrefs.push(new Vowel("ɛ",  669, 1905, 2788, 4140));
      vrefs.push(new Vowel("œ",  490, 1688, 2568, 3586));
      vrefs.push(new Vowel("a",  986, 1443, 2778, 3824));
      vrefs.push(new Vowel("ɑ",  762, 1117, 2752, 3787));
      vrefs.push(new Vowel("ɔ",  578,  933, 2852, 3786));
      vrefs.push(new Vowel("o",  505,  961, 2608, 3584));
      vrefs.push(new Vowel("u",  320,  842, 2746, 3757));
    }
    
  } else if (selRef.value() == "English Aus") {
    if (selSpk.value() == "male") {
      // Cox et al. (2014)
      // no F3, F4 data: Bladon & Fant (1978) cardinal values used
      vrefs = [];
      vrefs.push(new Vowel("iː", 304, 2349, 3070, 3590));
      vrefs.push(new Vowel("ɪ",  360, 2195, 2720, 3790));
      vrefs.push(new Vowel("e",  560, 1956, 2580, 3940));
      vrefs.push(new Vowel("æ",  776, 1633, 2460, 3710));
      vrefs.push(new Vowel("ɐ",  711, 1252, 2770, 3650));
      vrefs.push(new Vowel("ɐː", 728, 1204, 2770, 3650));
      vrefs.push(new Vowel("ɔ",  592,  944, 2640, 3310));
      vrefs.push(new Vowel("oː", 419,  704, 2670, 3240));
      vrefs.push(new Vowel("ʊ",  383,  901, 2550, 3280));
      vrefs.push(new Vowel("ʉː", 332, 1656, 2230, 3200));
      vrefs.push(new Vowel("ɜː", 503, 1468, 2500, 3500));
    } else {
      // Cox et al. (2014)
      // no F3, F4 data: Bladon & Fant (1978) cardinal values used
      vrefs = [];
      vrefs.push(new Vowel("iː", 367, 2900, 3070, 3590));
      vrefs.push(new Vowel("ɪ",  421, 2675, 2720, 3790));
      vrefs.push(new Vowel("e",  657, 2274, 2580, 3940));
      vrefs.push(new Vowel("æ", 1005, 1811, 2460, 3710));
      vrefs.push(new Vowel("ɐ",  924, 1476, 2770, 3650));
      vrefs.push(new Vowel("ɐː", 937, 1353, 2770, 3650));
      vrefs.push(new Vowel("ɔ",  724, 1122, 2640, 3310));
      vrefs.push(new Vowel("oː", 462,  837, 2670, 3240));
      vrefs.push(new Vowel("ʊ",  441, 1012, 2550, 3280));
      vrefs.push(new Vowel("ʉː", 402, 2011, 2230, 3200));
      vrefs.push(new Vowel("ɜː", 620, 1785, 2500, 3500));
    }

  } else if (selRef.value() == "English RP") {
    if (selSpk.value() == "male") {
      // Deterding (1997) Table 2
      // no F4 data: Hillenbrand (1995) / Bladon & Fant (1978) values used
      vrefs = [];
      vrefs.push(new Vowel("iː", 280, 2249, 2765, 3657));
      vrefs.push(new Vowel("ɪ",  367, 1757, 2556, 3618));
      vrefs.push(new Vowel("e",  494, 1650, 2547, 3649));
      vrefs.push(new Vowel("æ",  690, 1550, 2463, 3624));
      vrefs.push(new Vowel("ʌ",  644, 1259, 2551, 3557));
      vrefs.push(new Vowel("ɑː", 646, 1155, 2490, 3687));
      vrefs.push(new Vowel("ɒ",  558, 1047, 2481, 3650));
      vrefs.push(new Vowel("ɔː", 415,  828, 2619, 3310));
      vrefs.push(new Vowel("ʊ",  379, 1173, 2445, 3280));
      vrefs.push(new Vowel("uː", 316, 1191, 2408, 3357));
      vrefs.push(new Vowel("ɜː", 478, 1436, 2488, 3500));
    } else {
      // Deterding (1997) Table 2
      vrefs = [];
      vrefs.push(new Vowel("iː", 303, 2654, 3203, 4352));
      vrefs.push(new Vowel("ɪ",  384, 2174, 2962, 4334));
      vrefs.push(new Vowel("e",  719, 2063, 2997, 4319));
      vrefs.push(new Vowel("æ", 1018, 1799, 2869, 4290));
      vrefs.push(new Vowel("ʌ",  914, 1459, 2831, 4092));
      vrefs.push(new Vowel("ɑː", 910, 1316, 2841, 4299));
      vrefs.push(new Vowel("ɒ",  751, 1215, 2790, 4299));
      vrefs.push(new Vowel("ɔː", 389,  888, 2796, 3923));
      vrefs.push(new Vowel("ʊ",  410, 1340, 2697, 4052));
      vrefs.push(new Vowel("uː", 328, 1437, 2674, 4115));
      vrefs.push(new Vowel("ɜː", 606, 1695, 2839, 3914));
    }
    
  } else if (selRef.value() == "English USA") {
    if (selSpk.value() == "male") {
      // Hillenbrand et al. (1995) Table V
      vrefs = [];
      vrefs.push(new Vowel("i", 342, 2322, 3000, 3657));
      vrefs.push(new Vowel("ɪ", 427, 2034, 2684, 3618));
      vrefs.push(new Vowel("e", 476, 2089, 2691, 3649));
      vrefs.push(new Vowel("ɛ", 580, 1799, 2605, 3677));
      vrefs.push(new Vowel("æ", 588, 1952, 2601, 3624));
      vrefs.push(new Vowel("ɑ", 768, 1333, 2522, 3687));
      vrefs.push(new Vowel("ɔ", 652,  997, 2538, 3486));
      vrefs.push(new Vowel("o", 497,  910, 2459, 3384));
      vrefs.push(new Vowel("ʊ", 469, 1122, 2434, 3400));
      vrefs.push(new Vowel("u", 378,  997, 2343, 3357));
      vrefs.push(new Vowel("ʌ", 623, 1200, 2550, 3557));
      vrefs.push(new Vowel("ɝ", 474, 1379, 1710, 3334));
    } else {
      // Hillenbrand et al. (1995) Table V
      vrefs = [];
      vrefs.push(new Vowel("i", 437, 2761, 3372, 4352));
      vrefs.push(new Vowel("ɪ", 483, 2365, 3053, 4334));
      vrefs.push(new Vowel("e", 536, 2530, 3047, 4319));
      vrefs.push(new Vowel("ɛ", 731, 2058, 2979, 4294));
      vrefs.push(new Vowel("æ", 669, 2349, 2972, 4290));
      vrefs.push(new Vowel("ɑ", 936, 1551, 2815, 4299));
      vrefs.push(new Vowel("ɔ", 781, 1136, 2824, 3923));
      vrefs.push(new Vowel("o", 555, 1035, 2828, 3927));
      vrefs.push(new Vowel("ʊ", 519, 1225, 2827, 4052));
      vrefs.push(new Vowel("u", 459, 1105, 2735, 4115));
      vrefs.push(new Vowel("ʌ", 753, 1426, 2933, 4092));
      vrefs.push(new Vowel("ɝ", 523, 1558, 1929, 3914));
    }
    
  } else if (selRef.value() == "Russian") {
    if (selSpk.value() == "male") {
      // Fant (1971) Table 2.31-1
      vrefs = [];
      vrefs.push(new Vowel("i", 240, 2250, 3200, 3570));
      vrefs.push(new Vowel("ɨ", 300, 1480, 2230, 3200));
      vrefs.push(new Vowel("e", 440, 1800, 2550, 3410));
      vrefs.push(new Vowel("ɑ", 700, 1080, 2600, 3550));
      vrefs.push(new Vowel("o", 535,  780, 2500, 3500));
      vrefs.push(new Vowel("u", 300,  625, 2500, 3400));
    } else {
      // Jones (1953); Holden & Nearey (1986)
      // no ɨ data: Bladon & Fant (1978) cardinal values used
      vrefs = [];
      vrefs.push(new Vowel("i", 350, 2850, 3675, 4625));
      vrefs.push(new Vowel("ɨ", 400, 2200, 2900, 4313));
      vrefs.push(new Vowel("e", 500, 2150, 2950, 4375));
      vrefs.push(new Vowel("ɑ", 950, 1430, 2375, 4263));
      vrefs.push(new Vowel("o", 600, 1050, 2500, 4025));
      vrefs.push(new Vowel("u", 350,  700, 2850, 4150));
    }
    
  } else if (selRef.value() == "Japanese") {
    if (selSpk.value() == "male") {
      // Yazawa & Kondo (2019) Table 3 long vowels
      // no F3-F4 data: Fant (1971) values used
      vrefs = [];
      vrefs.push(new Vowel("ii", 306, 2293, 3200, 3570));
      vrefs.push(new Vowel("ee", 460, 2043, 2550, 3410));
      vrefs.push(new Vowel("ɑɑ", 744, 1237, 2600, 3550));
      vrefs.push(new Vowel("oo", 455,  813, 2500, 3500));
      vrefs.push(new Vowel("uu", 352, 1442, 2500, 3400));
    } else {
      // Yazawa & Kondo (2019) Table 3 long vowels
      // no F3-F4 data: Fant (1971) values used
      vrefs = [];
      vrefs.push(new Vowel("ii", 355, 2794, 3675, 4625));
      vrefs.push(new Vowel("ee", 555, 2378, 2950, 4375));
      vrefs.push(new Vowel("ɑɑ", 889, 1474, 2375, 4263));
      vrefs.push(new Vowel("oo", 535,  996, 2500, 4025));
      vrefs.push(new Vowel("uu", 459, 1653, 2850, 4150));
    }
    
  } else {
      vrefs = [];
  }
  // plot all reference vowels
  for (i=0; i<vrefs.length; i++) {
    vrefs[i].plot();
  }
}

//===================
function findClosestV(x,y) {
  // calculate minimum distance to all vowels in overlay
  let dmin = totx+toty;
  let d, imin;
  for (i=0; i<vrefs.length; i++) {
    d = dist(x,y, vrefs[i].vx,vrefs[i].vy);
    if (d < dmin) {
      dmin = d;
      imin = i;
    }
  }
  // return index of closest vowel
  return imin;
}

//=========
class Vowel {
  constructor(label, F1, F2, F3, F4) {
    this.lb = label;
    this.F1 = F1;
    this.F2 = F2;
    this.F3 = F3;
    this.F4 = F4;
    this.vx = map(this.F2, F2max, F2min, frontx1, backx);
    this.vy = map(this.F1, F1min, F1max, topy, boty);
  }
  plot() {
    const dx = 5;
    textSize(olaySz);
    strokeWeight(olayWt);
    fill(vrefCol);
    text(this.lb, this.vx-dx, this.vy+dx);
    //ellipse(this.vx, this.vy, 4,4);
  }
  highlight() {
    const dx = 5;
    textSize(vselSz);
    strokeWeight(vselWt);
    fill(vselCol);
    text(this.lb, this.vx-dx, this.vy+dx);
    //ellipse(this.vx, this.vy, 4,4);
  }
}
