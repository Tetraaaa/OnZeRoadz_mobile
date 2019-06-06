let initialState = {
    circuits: [],
    myCircuits: [],
    favorites:[]
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
        case 'SET_FAVORITES':
            nextState = {
                ...state,
                favorites: action.value
            }
            return nextState;
        default:
            return state;
    }
}

export default circuitsReducer;