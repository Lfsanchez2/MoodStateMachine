/*************************************************************************
    Simple Mood State Machine
      By Luis Sanchez

    Overview - This project creates a simple state machine that represents
    moods and transitions between them. The center of the canvas will dis-
    play an image and title corresponding to the drawn mood. Below the im-
    age will be three transition states that will change the display image
    and background to a different mood out of a total of 8 moods. A trans-
    ition state is selected by cycling through the options with the left 
    or right arrow keys and selecting an option with 'enter', 'return', or
    'space'.
    ---------------------------------------------------------------------
    Notes: 
     (1) There are a total of 8 moods
     (2) Each mood has 3 transitional statements
     (3) Moods are read from a csv file which requires a specific format
     (4) If an array of mood objects could not be properly created or if 
     there is an invalid mood, an error message will be displayed.
    ---------------------------------------------------------------------
**************************************************************************/

// Global variable that defines the custom otf font used in this project.
var myFont;
// The SimpleStateManager object that contains the array of mood objects.
var simpleStateMachine;
// The index of the current selected transition that determines what state in the array to call next.
var selectedTransitionNum;
// The current mood image to display on the canvas.
var moodImage;
// The current mood selected from the state manager.
var currentState;
// The current array of transition statements corresponding to the currently active mood.
var currentTransitions = [];
// The current array of next states corresponding to the currently active mood/transitions.
var currentNextStates = [];

// Creates the SimpleStateManager object and loads the custom font for the project.
function preload() {
  simpleStateMachine = new SimpleStateManager("assets/MoodTransitions.csv");
  myFont = loadFont('assets/fonts/ManilaSansBld.otf');
}

/* 
  Starts the process of setting up the Simple State Machine through the setup method in the
  class that fills the array based on the given csv. A random starting mood is selected from
  the array and will only be displayed if it is a valid mood within the array.
*/
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

// Displays the UI and mood image. Will display an error if there is an invalid mood selected.
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
  // Forward one, overflow isn't necessary because of modulo operation below.
  if (keyCode === RIGHT_ARROW) {
    selectedTransitionNum++;
  }
  
  // Back one, if the index goes below 0, it will reset to the end of the array.
  if (keyCode === LEFT_ARROW ) {
    selectedTransitionNum--;
    if(selectedTransitionNum < 0) {
      selectedTransitionNum = currentTransitions.length-1;
    }
  }

  // Space or ENTER or RETURN will select a new mood that is mapped to the transition statement.
  if( key === ' ' || keyCode === RETURN || keyCode === ENTER ) {
    setNewState(currentNextStates[selectedTransitionNum % currentTransitions.length]);
  }
}

// Will select a new mood through the Simple State Machine, based on a given mood name.
function setNewState(stateName) {
  currentState = simpleStateMachine.getStateByName(stateName);
  // Check if the new mood actually exists.
  if(currentState != undefined) {
    // Updates the background color of the web page outside of the canvas.
    document.body.style.backgroundColor = currentState.backgroundColor;
    console.log("New State: "+currentState.state);
    moodImage = loadImage(currentState.image);
    currentTransitions = currentState.transitions;
    currentNextStates = currentState.nextStates;
  } 
  else {
    console.log("INVALID STATE!");
  }
}

/* Will draw the UI elements of the canvas: 
   (1) The name of the current mood
   (2) The corresponding mood drawing
   (3) The 3 transitional statements for each mood.
*/
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

  // These variables allow for even spacing of each transitional staement.
  let startingX,incrementX, boxWidth;
  let currentSelectionIndex = selectedTransitionNum % currentTransitions.length;

  // Changes the spacing in case there are less than 3 transitions.
  if(currentNextStates.length < 3) {
    boxWidth = 250;
    textSize(16);
    incrementX = boxWidth + 120;
    startingX = width/2 - 60 - boxWidth/2;
  } 
  else {
    boxWidth = 200;
    textSize(12);
    incrementX = boxWidth + 60;
    startingX = width/2 - 60 - boxWidth;
  }
  
  // Loop the transitional statements array to display all of the transition options.
  for(let i = 0; i < currentTransitions.length; i++) {
    // If the current index of the loop is equal to the index of the currently selected 
    // transition statement, it will be highlighted by a rectangle.
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
