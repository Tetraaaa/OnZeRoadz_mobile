let initialState = {
    connected:false,
    lastConnectedUser:null,
    locale:"fr"
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
        case 'LANGUAGE':
            nextState = {
                ...state,
                locale:action.value
            }
            return nextState;
        default:
            return state;
    }
}

export default connectionReducer;