let initialState = {
    circuits:[]
}

function offlineReducer(state = initialState, action) {
    let nextState;
    switch(action.type) {
        case 'DOWNLOAD_CIRCUIT':
            nextState = {
                ...state,
                circuits:[...state.circuits, action.value]
            }
            return nextState;
        case 'UPDATE_PROGRESS':
            let dc = state.circuits.slice(0);
            let circuit = dc.find(circuit => circuit.id === action.value.id);
            dc = dc.filter(item => item.id !== action.value.id);
            let newCircuit = Object.assign({}, circuit, {progress:action.value.progress})
            dc = dc.concat(newCircuit);
            nextState ={
                ...state,
                circuits:dc
            }
        default:
            return state;
    }
}

export default offlineReducer;