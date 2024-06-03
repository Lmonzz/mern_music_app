export const actionType = {
    SET_USER: "SET_USER",
}

const reducer = (state, action) => {
    console.log(action);

    //if the action is  set user set image 
    switch(action.type){
        case actionType.SET_USER:
            return {
                ...state,
                user: action.user,
            }

        default: 
            return state;
    }
};

export default reducer;