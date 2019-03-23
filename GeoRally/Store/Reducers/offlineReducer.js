


let initialState = {
    circuits:[]
}

function offlineReducer(state = initialState, action) {
    let nextState;
    let dc;
    let circuit;
    let newCircuit;
    switch(action.type) {
        case 'DOWNLOAD_CIRCUIT':
            nextState = {
                ...state,
                circuits:[...state.circuits, action.value]
            }
            return nextState;
        case 'UPDATE_PROGRESS':
            dc = state.circuits.slice(0);
            circuit = dc.find(circuit => circuit.id === action.value.id);
            dc = dc.filter(item => item.id !== action.value.id);
            newCircuit = Object.assign({}, circuit, {progress:action.value.progress})
            dc = dc.concat(newCircuit);
            nextState ={
                ...state,
                circuits:dc
            }
        case 'QUESTION_PROGRESS':
            dc = state.circuits.slice(0);
            circuit = dc.find(circuit => circuit.id === action.value.circuitId)
            let transit = circuit.transits.find(transit => transit.id === action.value.transitId);
            let question = transit.step.questions.find(question => question.id === action.value.questionId);
            Object.assign(question, {questionProgress:action.value.questionProgress})
            nextState ={
                ...state,
                circuits:dc
            }
        default:
            return state;
    }
}

export default offlineReducer;