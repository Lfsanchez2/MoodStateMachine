/*************************************************************************
    Simple State Manager
      By Luis Sanchez

    Overview - This class is in charge of creating a state machine structure.
    The state machine is built from a given csv file, it will read the file 
    and build an array of state objects. In this case, the states will be 
    moods, each with 5 elements to them: 
        (1) state - The name of the mood
        (2) nextStates - An array of the moods that this one transitions to
        (3) transitions - An array of the transitional statements to each
            mood in nextStates
        (4) image - The filepath of the mood drawing to display as an image
        (5) backgroundColor - The color of the canvas background
**************************************************************************/
class SimpleStateManager {
    // statesTable - The table that contains the csv data for creating the state machine.
    // statesArray - The array that contains the mood objects for the state machine.
    constructor(statesFile) {
        this.statesTable = loadTable(statesFile, 'csv', 'header');
        this.statesArray = [];
    }

    // Begins the process of
    setup() {
        for( let i = 0; i < this.statesTable.getRowCount(); i++) {
            let stateName = this.statesTable.getString(i, 'Mood');
            let stateCheck = this.getStateByName(stateName);
            // Will only add a *NEW* mood to the state machine.
            if(stateCheck === undefined) {
                this.statesArray.push({
                    state: stateName,
                    nextStates: [this.statesTable.getString(i, 'NextState')],
                    transitions: [this.statesTable.getString(i, 'Transition')],
                    image: this.statesTable.getString(i, 'Filename'),
                    backgroundColor: this.statesTable.getString(i, 'BackgroundColor')
                });
            } 
            // If a mood already exists in the array, the transition and nextStates array
            // will simply be updated with new elements.
            else {
                stateCheck.transitions.push(this.statesTable.getString(i, 'Transition')); 
                stateCheck.nextStates.push(this.statesTable.getString(i, 'NextState'));
            }
        }

        console.log("Mood States Loaded . . .");
        console.log(this.statesArray);
    }

    // Locates a mood in the state machine based on a given name, will return undefined if it
    // does not exist.
    getStateByName(stateName) {
        return this.statesArray.find(o => o.state === stateName)
    }

    // Randomly generates an index to select a random starting index to start the webpage with.
    getStartState() {
        var randomStartIndex = (Math.floor(Math.random() * (this.statesArray.length-1)));

        console.log("Random Starting Index: " + randomStartIndex);
        return this.statesArray[randomStartIndex];
    }
}
