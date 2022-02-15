var myFont;
var simpleStateMachine;
var selectedTransitionNum;
var moodImage;
var currentState;
var currentTransitions = [];
var currentNextStates = [];


function preload() {
  simpleStateMachine = new SimpleStateManager("assets/MoodTransitions.csv");
  myFont = loadFont('assets/fonts/ManilaSansBld.otf');
}
function setup() {
  createCanvas(900, 620);
  imageMode(CENTER);
  textFont(myFont);
  selectedTransitionNum = 0;
  simpleStateMachine.setup();
  currentState = simpleStateMachine.getStartState();
  if(currentState != undefined) {
    document.body.style.backgroundColor = currentState.backgroundColor;
    moodImage = loadImage(currentState.image);
    currentTransitions = currentState.transitions;
    currentNextStates = currentState.nextStates;
    console.log("STARTING STATE: " + currentState.state);
    console.log(currentState);
  } else {
    console.log("The state machine is invalid!");
  }
  
}

function draw() {
  if(currentState === undefined) {
    background(0);
    fill("white");
    textAlign(CENTER);
    textSize(40);
    text("The state machine is invalid!\n Make sure an applicable csv is provided.", 
    width/2, height/2);
    noLoop();
  } else {
    background(currentState.backgroundColor);
    drawUI();
    image(moodImage, width/2, (height/2) - 30);
  }
}

function keyPressed() {
  // forward one
  if (keyCode === RIGHT_ARROW) {
    selectedTransitionNum++;
  }
  
  // back one
  if (keyCode === LEFT_ARROW ) {
    selectedTransitionNum--;
    if(selectedTransitionNum < 0) {
      selectedTransitionNum = currentTransitions.length-1;
    }
  }

  // Space or ENTER or RETURN will activate a sections
  if( key === ' ' || keyCode === RETURN || keyCode === ENTER ) {
    setNewState(currentNextStates[selectedTransitionNum % currentTransitions.length]);
  }
}

function setNewState(stateName) {
  currentState = simpleStateMachine.getStateByName(stateName);
  if(currentState != undefined) {
    document.body.style.backgroundColor = currentState.backgroundColor;
    console.log("New State: "+currentState.state);
    moodImage = loadImage(currentState.image);
    currentTransitions = currentState.transitions;
    currentNextStates = currentState.nextStates;
  } else {
    console.log("INVALID STATE!");
  }
}

function drawUI() {
  textAlign(CENTER);
  rectMode(CENTER);
  textSize(50);
  fill(0);
  stroke("white");
  strokeWeight(2);
  text(currentState.state.toUpperCase(), width/2, 60);
  noStroke();
  textWrap(WORD);
  let startingX,incrementX, boxWidth;
  let currentSelectionIndex = selectedTransitionNum % currentTransitions.length;
  if(currentNextStates.length < 3) {
    boxWidth = 250;
    textSize(16);
    incrementX = boxWidth + 120;
    startingX = width/2 - 60 - boxWidth/2;
  } else {
    boxWidth = 200;
    textSize(12);
    incrementX = boxWidth + 60;
    startingX = width/2 - 60 - boxWidth;
  }
  
  for(let i = 0; i < currentTransitions.length; i++) {
    if(i === currentSelectionIndex) { 
      fill(0);
      stroke("white");
      strokeWeight(3);
      rect(startingX, height-85, boxWidth, 90);
      noStroke();
    }
    fill("white");
    text(currentTransitions[i], startingX, height-70, boxWidth-80, 70);
    
    startingX += incrementX;
  }
}
