let initialState = {
    circuits: [],
    myCircuits: []
}

function circuitsReducer(state = initialState, action)
{
    let nextState;
    switch (action.type)
    {
        case 'SET_CIRCUITS':
            nextState = {
                ...state,
                circuits: action.value
            }
            return nextState;
        case 'SET_MY_CIRCUITS':
            nextState = {
                ...state,
                myCircuits: action.value
            }
            return nextState;
        default:
            return state;
    }
}

export default circuitsReducer;