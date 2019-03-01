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
        default:
            return state;
    }
}

export default offlineReducer;