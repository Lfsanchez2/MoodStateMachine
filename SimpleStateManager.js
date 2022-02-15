class SimpleStateManager {
    constructor(statesFile) {
        this.statesTable = loadTable(statesFile, 'csv', 'header');
        this.statesArray = [];
        this.setImageFilenameCallback = null;
        this.setTransitionsCallback = null;
    }

    setup() {
        for( let i = 0; i < this.statesTable.getRowCount(); i++) {
            let stateName = this.statesTable.getString(i, 'Mood');
            let stateCheck = this.getStateByName(stateName);
            if(stateCheck === undefined) {
                this.statesArray.push({
                    state: stateName,
                    nextStates: [this.statesTable.getString(i, 'NextState')],
                    transitions: [this.statesTable.getString(i, 'Transition')],
                    image: this.statesTable.getString(i, 'Filename'),
                    backgroundColor: this.statesTable.getString(i, 'BackgroundColor')
                });
            } else {
                stateCheck.transitions.push(this.statesTable.getString(i, 'Transition')); 
                stateCheck.nextStates.push(this.statesTable.getString(i, 'NextState'));
            }
        }
        
    }

    getStateByName(stateName) {
        return this.statesArray.find(o => o.state === stateName)
    }

    getStartState() {
        var randomStartIndex = (Math.floor(Math.random() * (this.statesArray.length-1)));
        console.log("Random Starting Index: " + randomStartIndex);
        return this.statesArray[randomStartIndex];
    }
}
