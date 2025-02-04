// ------------------------
// Vowel Space Synthesizer
// ------------------------
// Michael Proctor
// mike.i.proctor@gmail.com
// Created: 2022-08-27
// Updated: 2025-02-04
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
// Bulgarian: Sabev et al. (2023, 2024)
// Cardinal: Bladon & Fant (1978)
// Drehu: Torres et al. (2024)
// Dutch: Pols et al. (1973); Van Nierop et al. (1973)
// English Australian: Cox (2006)
// English RP: Deterding (1997)
// English USA: Hillenbrand et al. (1995)
// Japanese: Kasuya et al. (1968)
// Kamu: Harvey et al. (2024)
// Larrakia: Harvey et al. (2024)
// Russian: Fant (1971)
// Warlpiri: Tabain et al. (2020)
//

// --------------------
// vowel space geometry
// --------------------
const frontx1 = 50;
const frontx2 = 250;
const backx1  = 550;
const backx2  = 470;
const totx    = backx1 - frontx1;
const difx1   = frontx2 - frontx1;
const difx2   = backx1 - backx2;
const topy    = 50;
const boty    = 500;
const toty    = boty - topy;

let   calSpc  = true;          // display limits (Hz) of acoustic plane

// ------------------------------
// acoustic limits of vowel space
// ------------------------------
const  F1minM =  200;
const  F1maxM =  850;
const  F1difM = F1maxM-F1minM;
const  F1minF =  250;
const  F1maxF = 1050;
const  F1difF = F1maxF-F1minF;

const  dfF1F2 =   30;
const  F2minM =  500;
const  F2mn2M = F1maxM+dfF1F2;   // bottom rt M vspace
const  F2mx2M = 1800;            // bottom lf M vspace
const  F2maxM = 2600;
const  F2df1M = F2mn2M-F2minM;
const  F2df2M = F2maxM-F2mx2M;
const  F2minF =  550;
const  F2mn2F = F1maxF+dfF1F2;   // bottom rt F vspace
const  F2mx2F = 2200;            // bottom lf F vspace
const  F2maxF = 3200;
const  F2df1F = F2mn2F-F2minF;
const  F2df2F = F2maxF-F2mx2F;

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
const lblSpkx = backx1 + 40;
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
const lblF0x  = lblSpkx;
const lblF0y  = lblSrcy + 30;
const srcF0x  = lblF0x + 30;
const srcF0y  = lblF0y + 12;
const lb2F0x  = lblF0x + 100;
const lb2F0y  = lblF0y;

// -----------------
// reference control
// -----------------
const lblRefx = lblSpkx;
const lblRefy = selSrcy + 120;
const selRefx = lblSpkx;
const selRefy = lblRefy + 12;
const fontRef = fontSpk;

// ---------------
// display params
// ---------------
const bgndCol = "#fdfdfd";
const fgndCol = "#E0F2F7";
const olinCol = "#88ccff";
const vrefCol = "#0088bb";
const vow2Col = "#0880a0";
const vselCol = "#001155";
const vse2Col = "#11ddee";
const lineWt  = 1;
const cursSz  = 22;
const cursSym = "+";
const cursCol = 10;
const cursWt  = 0;
const fontSz  = 16;
const fontWt  = 0;
const fontCol = 16;
const olaySz  = 19;
const olayWt  = 0;
const vselWt  = 0;
const vselSz  = 19;
const vcalSz  = 10;
const vcalWt  = 0;
const vcalCol = "#aaaaaa";

// -----------------------
// voice source parameters
// -----------------------
const F0_M   = 110;      // mean male F0 (Hillenbrand 1995: 130Hz)
const F0_F   = 220;      // mean female F0 (Hillenbrand 1995)
const F0_min =  50;      // minimum F0
const F0_max = 400;      // minimum F0
const F0_stp =  10;      // F0 selector increment
let   F0_Hz  = F0_M;     // source frequency
let   F0_Ha  = 0.80;     // vibrato source harmonicity
let   F0_MI  = 0.08;     // vibrato source modulation index

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
let F2mn2 = F2mn2M;
let F2mx2 = F2mx2M;
let F2max = F2maxM;

let F3_Hz = 2500;
let F3_QF = 25;

let F4_Hz = 3500;
let F4_QF = 35;

let dF32m = 1000;        // F3-F2 (Hz), male
let dF32f = 1100;        // F3-F2 (Hz), female
let dF43m = 1200;        // F4-F3 (Hz), male
let dF43f = 1300;        // F4-F3 (Hz), female

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
  selSpk.changed(refreshSpk);
  //selSpk.changed(refreshOverlay);

  // glottal source selector
  selSrc = createSelect();
  selSrc.position(selSrcx, selSrcy);
  selSrc.option("voiced");
  selSrc.option("whisper");
  selSrc.option("vibrato");
  selSrc.changed(configureSrc);
  
  // glottal source frequency control
  srcL1 = createElement('p','F0:');
  srcL1.position(lblF0x, lblF0y);
  srcF0 = createInput(F0_Hz.toString(), 'number');
  srcF0.position(srcF0x, srcF0y);
  srcF0.size(wInpB, hInpB);
  srcF0.attribute('step', F0_stp);
  srcF0.attribute('min',  F0_min);
  srcF0.attribute('max',  F0_max);
  srcL2 = createElement('p','Hz');
  srcL2.position(lb2F0x, lb2F0y);
  
  // reference vowel overlay selector
  selRef = createSelect();
  selRef.position(selRefx, selRefy);
  selRef.option("none");
  selRef.option("Bulgarian");
  selRef.option("Cardinal");
  selRef.option("Drehu");
  selRef.option("Dutch");
  selRef.option("English Aus");
  selRef.option("English RP");
  selRef.option("English USA");
  selRef.option("Japanese");
  selRef.option("Kamu");
  selRef.option("Larrakia");
  selRef.option("Russian");
  selRef.option("Warlpiri");
  selRef.changed(refreshSpk);
  selRef.changed(refreshOverlay);
}

//=============
function draw() {
  
  // fetch mouse position
  var x = mouseX;
  var y = mouseY;

  // erase old cursor, check location
  background(bgndCol);
  if (y > topy && y < boty) {
    frntquad  = frontx1 + ((y-topy)/toty)*difx1;
    backquad  = backx1  - ((y-topy)/toty)*difx2;
    if (x > frntquad && x < backquad) {
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
  text("Speaker",   lblSpkx, lblSpky);
  text("Source",    lblSrcx, lblSrcy);
  text("Reference", lblRefx, lblRefy);
  textAlign(LEFT);

  // draw vowel quadrilateral
  fill(fgndCol);
  stroke(olinCol);
  strokeWeight(lineWt);
  quad(frontx1, topy, frontx2, boty, backx2, boty, backx1, topy);

  // calibrate vowel quadrilateral
  if (calSpc) {
    textSize(vcalSz);
    strokeWeight(vcalWt);
    fill(vcalCol);
    text( str(F1min),  frontx1,    topy-5  );
    text( str(F2max),  frontx1-25, topy+13 );
    text( str(F1max),  frontx2,    boty+13 );
    text( str(F2mx2),  frontx2-34, boty-4  );
    text( str(F1max),  backx2-16,  boty+13 );
    text( str(F2mn2),  backx2+7,   boty-4  );
    text( str(F1min),  backx1-16,  topy-5  );
    text( str(F2min),  backx1+5,   topy+13 );
  }

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
        F1_Hz = vrefs[ix].F1;
        F2_Hz = vrefs[ix].F2;
        F3_Hz = vrefs[ix].F3;
        if (F3_Hz === undefined) {
          if (F2_Hz > 1500) {
            // back vowel F3 estimate (Nearey 1989)
            F3_Hz = 0.522*F1_Hz + 1.197*F2_Hz + 57;
          } else {
            // front vowel F3 estimate (Nearey 1989)
            F3_Hz = 0.787*F1_Hz - 0.365*F2_Hz + 2341;
          }
          console.log("F3 = " + str(F3_Hz) + "Hz");          
        }
        F4_Hz = vrefs[ix].F4;
        if (F4_Hz === undefined) {
          if (selSpk.value() == "male") {
            F4_Hz = F3_Hz + dF43m;          
          } else {
            F4_Hz = F3_Hz + dF43f;          
          }
        }
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
    F2_Hz = map(x, frontx1, backx1, F2max, F2min);
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
    configureSrc();
    F0_Hz = str(round(srcF0.value()));
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
function refreshSpk() {
  if (selSpk.value() == "male") {
    F0_Hz = F0_M;
    F1min = F1minM;
    F1max = F1maxM;
    F2min = F2minM;
    F2mn2 = F2mn2M;
    F2mx2 = F2mx2M;
    F2max = F2maxM;
  } else if (selSpk.value() == "female") {
    F0_Hz = F0_F;
    F1min = F1minF;
    F1max = F1maxF;
    F2min = F2minF;
    F2mn2 = F2mn2F;
    F2mx2 = F2mx2F;
    F2max = F2maxF;
  }
  srcF0.value(str(F0_Hz));
}

//==================
function configureSrc() {
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

  const dF1m = 25;
  const dF2m = 90;
  const dF1f = 1.3*dF1m;
  const dF2f = 1.3*dF2m;
  
  if (selRef.value() == "Cardinal") {
    if (selSpk.value() == "male") {
      // Bladon & Fant (1978) Table I-A-I
      vrefs = [];
      vrefs.push(new Vowel("i", F1minM+dF1m,       F2maxM-dF2m,            3070, 3590));
      vrefs.push(new Vowel("e", F1minM+1/3*F1difM, F2maxM-1/3*F2df2M-dF2m, 2720, 3790));
      vrefs.push(new Vowel("ɛ", F1minM+2/3*F1difM, F2maxM-2/3*F2df2M-dF2m, 2580, 3940));
      vrefs.push(new Vowel("a", F1maxM-dF1m,       F2mx2M-dF2m,            2460, 3710));
      vrefs.push(new Vowel("ɑ", F1maxM-dF1m,       F2mn2M+0.8*dF2m,        2770, 3650));
      vrefs.push(new Vowel("ɔ", F1minM+2/3*F1difM, F2minM+2/3*F2df1M+dF2m, 2640, 3310));
      vrefs.push(new Vowel("o", F1minM+1/3*F1difM, F2minM+1/3*F2df1M+dF2m, 2670, 3240));
      vrefs.push(new Vowel("u", F1minM+dF1m,       F2minM+dF2m,            2550, 3280));
    } else {
      vrefs = [];
      vrefs.push(new Vowel("i", F1minF+dF1f,       F2maxF-dF2f,            3170, 3690));
      vrefs.push(new Vowel("e", F1minF+1/3*F1difF, F2maxF-1/3*F2df2F-dF2f, 2820, 3890));
      vrefs.push(new Vowel("ɛ", F1minF+2/3*F1difF, F2maxF-2/3*F2df2F-dF2f, 2680, 4040));
      vrefs.push(new Vowel("a", F1maxF-dF1f,       F2mx2F-dF2f,            2560, 3810));
      vrefs.push(new Vowel("ɑ", F1maxF-dF1f,       F2mn2F,                 2870, 3750));
      vrefs.push(new Vowel("ɔ", F1minF+2/3*F1difF, F2minF+2/3*F2df1M+dF2f, 2740, 3410));
      vrefs.push(new Vowel("o", F1minF+1/3*F1difF, F2minF+1/3*F2df1M+dF2f, 2770, 3340));
      vrefs.push(new Vowel("u", F1minF+dF1f,       F2minF+dF2f,            2650, 3380));
    }
  
  } else if (selRef.value() == "Bulgarian") {
    if (selSpk.value() == "male") {
      // Sabev et al. (2023 Table 2; 2024 Table X)
      vrefs = [];
      vrefs.push(new Vowel("i",  319, 1848       ));
      vrefs.push(new Vowel("ɛ",  468, 1707       ));
      vrefs.push(new Vowel("a",  627, 1282       ));
      vrefs.push(new Vowel("ɔ",  494,  923       ));
      vrefs.push(new Vowel("u",  349,  999, 2354 ));
      vrefs.push(new Vowel("ɤ",  423, 1188, 2247 ));
    } else {
      vrefs = [];
      vrefs.push(new Vowel("i",  393, 2295       ));
      vrefs.push(new Vowel("ɛ",  573, 2121       ));
      vrefs.push(new Vowel("a",  847, 1593       ));
      vrefs.push(new Vowel("ɔ",  587, 1041       ));
      vrefs.push(new Vowel("u",  399, 1017, 2354 ));
      vrefs.push(new Vowel("ɤ",  486, 1361, 2247 ));
    }
    
  } else if (selRef.value() == "Drehu") {
    if (selSpk.value() == "male") {
      // Torres et al. (2024)
      vrefs = [];
      vrefs.push(new Vowel("i",  347, 2235, 2965 ));
      vrefs.push(new Vowel("e",  440, 2027, 2765 ));
      vrefs.push(new Vowel("ɛ",  549, 1925, 2828 ));
      vrefs.push(new Vowel("a",  668, 1386, 2517 ));
      vrefs.push(new Vowel("o",  464,  980, 2781 ));
      vrefs.push(new Vowel("u",  395, 1007, 2799 ));
      vrefs.push(new Vowel("ə",  490, 1315, 2785 ));
    } else {
      vrefs = [];
      vrefs.push(new Vowel("i",  343, 2519, 3267 ));
      vrefs.push(new Vowel("e",  439, 2381, 3105 ));
      vrefs.push(new Vowel("ɛ",  578, 2131, 3133 ));
      vrefs.push(new Vowel("a",  695, 1500, 2726 ));
      vrefs.push(new Vowel("o",  431, 1020, 2824 ));
      vrefs.push(new Vowel("u",  389,  966, 2795 ));
      vrefs.push(new Vowel("ə",  460, 1367, 2877 ));
    }
    
  } else if (selRef.value() == "Dutch") {
    if (selSpk.value() == "male") {
      // Pols et al. (1973)
      vrefs = [];
      vrefs.push(new Vowel("i",  294, 2208, 2766 ));
      vrefs.push(new Vowel("y",  305, 1730, 2208 ));
      vrefs.push(new Vowel("ɪ",  388, 2003, 2571 ));
      vrefs.push(new Vowel("e",  407, 2017, 2553 ));
      vrefs.push(new Vowel("ø",  443, 1497, 2260 ));
      vrefs.push(new Vowel("ɛ",  583, 1725, 2471 ));
      vrefs.push(new Vowel("œ",  438, 1498, 2354 ));
      vrefs.push(new Vowel("a",  795, 1301, 2565 ));
      vrefs.push(new Vowel("ɑ",  679, 1051, 2619 ));
      vrefs.push(new Vowel("ɔ",  523,  866, 2692 ));
      vrefs.push(new Vowel("o",  487,  911, 2481 ));
      vrefs.push(new Vowel("u",  339,  810, 2323 ));
    } else {
      // Van Nierop et al. (1973)
      vrefs = [];
      vrefs.push(new Vowel("i",  276, 2510, 3046 ));
      vrefs.push(new Vowel("y",  288, 1832, 2520 ));
      vrefs.push(new Vowel("ɪ",  465, 2262, 2840 ));
      vrefs.push(new Vowel("e",  471, 2352, 2895 ));
      vrefs.push(new Vowel("ø",  476, 1690, 2512 ));
      vrefs.push(new Vowel("ɛ",  669, 1905, 2788 ));
      vrefs.push(new Vowel("œ",  490, 1688, 2568 ));
      vrefs.push(new Vowel("a",  986, 1443, 2778 ));
      vrefs.push(new Vowel("ɑ",  762, 1117, 2752 ));
      vrefs.push(new Vowel("ɔ",  578,  933, 2852 ));
      vrefs.push(new Vowel("o",  505,  961, 2608 ));
      vrefs.push(new Vowel("u",  320,  842, 2746 ));
    }
    
  } else if (selRef.value() == "English Aus") {
    if (selSpk.value() == "male") {
      // Cox et al. (2014)
      vrefs = [];
      vrefs.push(new Vowel("iː", 304, 2349 ));
      vrefs.push(new Vowel("ɪ",  360, 2195 ));
      vrefs.push(new Vowel("e",  560, 1956 ));
      vrefs.push(new Vowel("æ",  776, 1633 ));
      vrefs.push(new Vowel("ɐ",  711, 1252 ));
      vrefs.push(new Vowel("ɐː", 728, 1204 ));
      vrefs.push(new Vowel("ɔ",  592,  944 ));
      vrefs.push(new Vowel("oː", 419,  704 ));
      vrefs.push(new Vowel("ʊ",  383,  901 ));
      vrefs.push(new Vowel("ʉː", 332, 1656 ));
      vrefs.push(new Vowel("ɜː", 503, 1468 ));
    } else {
      // Cox et al. (2014)
      vrefs = [];
      vrefs.push(new Vowel("iː", 367, 2900 ));
      vrefs.push(new Vowel("ɪ",  421, 2675 ));
      vrefs.push(new Vowel("e",  657, 2274 ));
      vrefs.push(new Vowel("æ", 1005, 1811 ));
      vrefs.push(new Vowel("ɐ",  924, 1476 ));
      vrefs.push(new Vowel("ɐː", 937, 1353 ));
      vrefs.push(new Vowel("ɔ",  724, 1122 ));
      vrefs.push(new Vowel("oː", 462,  837 ));
      vrefs.push(new Vowel("ʊ",  441, 1012 ));
      vrefs.push(new Vowel("ʉː", 402, 2011 ));
      vrefs.push(new Vowel("ɜː", 620, 1785 ));
    }

  } else if (selRef.value() == "English RP") {
    if (selSpk.value() == "male") {
      // Deterding (1997) Table 2
      vrefs = [];
      vrefs.push(new Vowel("iː", 280, 2249, 2765 ));
      vrefs.push(new Vowel("ɪ",  367, 1757, 2556 ));
      vrefs.push(new Vowel("e",  494, 1650, 2547 ));
      vrefs.push(new Vowel("æ",  690, 1550, 2463 ));
      vrefs.push(new Vowel("ʌ",  644, 1259, 2551 ));
      vrefs.push(new Vowel("ɑː", 646, 1155, 2490 ));
      vrefs.push(new Vowel("ɒ",  558, 1047, 2481 ));
      vrefs.push(new Vowel("ɔː", 415,  828, 2619 ));
      vrefs.push(new Vowel("ʊ",  379, 1173, 2445 ));
      vrefs.push(new Vowel("uː", 316, 1191, 2408 ));
      vrefs.push(new Vowel("ɜː", 478, 1436, 2488 ));
    } else {
      // Deterding (1997) Table 2
      vrefs = [];
      vrefs.push(new Vowel("iː", 303, 2654, 3203 ));
      vrefs.push(new Vowel("ɪ",  384, 2174, 2962 ));
      vrefs.push(new Vowel("e",  719, 2063, 2997 ));
      vrefs.push(new Vowel("æ", 1018, 1799, 2869 ));
      vrefs.push(new Vowel("ʌ",  914, 1459, 2831 ));
      vrefs.push(new Vowel("ɑː", 910, 1316, 2841 ));
      vrefs.push(new Vowel("ɒ",  751, 1215, 2790 ));
      vrefs.push(new Vowel("ɔː", 389,  888, 2796 ));
      vrefs.push(new Vowel("ʊ",  410, 1340, 2697 ));
      vrefs.push(new Vowel("uː", 328, 1437, 2674 ));
      vrefs.push(new Vowel("ɜː", 606, 1695, 2839 ));
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
    
  } else if (selRef.value() == "Japanese") {
    if (selSpk.value() == "male") {
      // Kasuya et al. (1968)
      vrefs = [];
      vrefs.push(new Vowel("i", 263, 2263, 3000       ));
      vrefs.push(new Vowel("e", 475, 1738, 2400       ));
      vrefs.push(new Vowel("ɑ", 775, 1163, 2713, 3400 ));
      vrefs.push(new Vowel("o", 550,  838, 2625       ));
      vrefs.push(new Vowel("u", 363, 1300, 2350       ));
    } else {
      // Kasuya et al. (1968)
      vrefs = [];
      vrefs.push(new Vowel("i", 325, 2725, 3475 ));
      vrefs.push(new Vowel("e", 483, 2317, 2983 ));
      vrefs.push(new Vowel("ɑ", 888, 1363, 3050 ));
      vrefs.push(new Vowel("o", 483,  925, 3000 ));
      vrefs.push(new Vowel("u", 375, 1675, 2688 ));
    }
    
  } else if (selRef.value() == "Kamu") {
      // Harvey et al. (2024)
      selSpk.value("female");
      refreshSpk();
      vrefs = [];
      vrefs.push(new Vowel("i", 486, 2225, 3026 ));
      vrefs.push(new Vowel("e", 653, 2017, 2802 ));
      vrefs.push(new Vowel("a", 761, 1448, 2913 ));
      vrefs.push(new Vowel("o", 641, 1160, 2970 ));
      vrefs.push(new Vowel("u", 547, 1105, 2837 ));
      vrefs.push(new Vowel("ɨ", 481, 1545, 3006 ));

  } else if (selRef.value() == "Larrakia") {
      // Harvey et al. (2024)
      selSpk.value("female");
      refreshSpk();
      vrefs = [];
      vrefs.push(new Vowel("i", 413, 1766, 2615 ));
      vrefs.push(new Vowel("e", 549, 1682, 2630 ));
      vrefs.push(new Vowel("a", 601, 1467, 2596 ));
      vrefs.push(new Vowel("o", 555, 1279, 2674 ));
      vrefs.push(new Vowel("u", 440, 1206, 2543 ));
      vrefs.push(new Vowel("ɨ", 425, 1527, 2601 ));
    
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
      vrefs.push(new Vowel("i", 350, 2850, 3675 ));
      vrefs.push(new Vowel("ɨ", 400, 2200, 2900 ));
      vrefs.push(new Vowel("e", 500, 2150, 2950 ));
      vrefs.push(new Vowel("ɑ", 950, 1430, 2375 ));
      vrefs.push(new Vowel("o", 600, 1050, 2500 ));
      vrefs.push(new Vowel("u", 350,  700, 2850 ));
    }
      
  } else if (selRef.value() == "Warlpiri") {
      // Tabain et al. (2020)
      selSpk.value("female");
      refreshSpk();
      vrefs = [];
      vrefs.push(new Vowel("i", 357, 2142, 2766, 3963 ));
      vrefs.push(new Vowel("a", 579, 1457, 2800, 3838 ));
      vrefs.push(new Vowel("u", 364, 1294, 2738, 3835 ));
  
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
    this.vx = map(this.F2, F2max, F2min, frontx1, backx1);
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
