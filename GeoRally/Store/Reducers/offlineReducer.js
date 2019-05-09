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
        case 'REMOVE_CIRCUIT':
            nextState = {
                ...state,
                circuits:state.circuits.filter(circuit => circuit.id !== action.value)
            }
            return nextState;
        case 'UPDATE_CIRCUIT':
            dc = state.circuits.filter((circuit) => circuit.id != action.value.id)
            nextState = {
                ...state,
                circuits:[...dc, action.value]
            }
            return nextState;
        case 'CHECK_UPDATE':
            dc = state.circuits.slice(0);
            dc.forEach(circuit => {
                action.value.forEach(id => {
                    if(circuit.id === id){
                        Object.assign(circuit, {needUpdate: true});
                    }
                })
            })
            nextState = {
                ...state,
                circuits: dc
            }
            return nextState;
        case 'UPDATE_PROGRESS':
            dc = state.circuits.slice(0);
            circuit = dc.find(circuit => circuit.id === action.value.id);
            Object.assign(circuit, {progress:action.value.progress})
            nextState ={
                ...state,
                circuits:dc
            }
            return nextState;
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
            return nextState;
        case 'REMOVE_PROGRESS':
            dc = state.circuits.slice(0);
            circuit = dc.find(circuit => circuit.id === action.value.id);
            circuit.progress = null;
            circuit.transits.forEach(transit => {
                if(transit.step)
                {
                    transit.step.questions.forEach(question => {
                        question.questionProgress = null;
                    })
                }
            });
            nextState ={
                ...state,
                circuits:dc
            }
            return nextState;
        default:
            return state;
    }
}

export default offlineReducer;