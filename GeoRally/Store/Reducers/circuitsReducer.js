let initialState = {
    circuits:[]
}

function circuitsReducer(state = initialState, action) {
    let nextState;
    switch(action.type) {
        case 'SET_CIRCUITS':
            nextState = {
                ...state,
                circuits:action.value
            }
            return nextState;
        default:
            return state;
    }
}

export default circuitsReducer;