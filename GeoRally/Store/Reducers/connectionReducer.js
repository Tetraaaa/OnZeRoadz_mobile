let initialState = {
    connected:false,
    lastConnectedUser:null
}

function connectionReducer(state = initialState, action) {
    let nextState;
    switch(action.type) {
        case 'LOGIN':
            nextState = {
                ...state,
                connected:true,
                lastConnectedUser:action.value
            }
            return nextState;
        case 'LOGOUT':
            return initialState;
        default:
            return state;
    }
}

export default connectionReducer;