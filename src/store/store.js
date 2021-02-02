import { createStore } from 'redux';

const initialState = {"SET_DIALOG" : null, 'SET_ALL_DIALOGS': [], "ADD_CHAT" : null};

const store = createStore(reducer, initialState);


function reducer(state = store.getState(), action) {
    
    switch(action.type) {
        case "SET_DIALOG": {
            return { 
                dialog: action.dialog,
                allDialogs: [...state.allDialogs]
             };
        }
        case "READ_MESSAGE": {
            let indexDialog = -1;
            for (let i = 0; i < state.allDialogs.length; i++) {
                if (state.allDialogs[i]._id === action._id) {
                    indexDialog = i; 
                    break;
                }
            }
            for (let i = state.allDialogs[indexDialog].messaging.length - 1; i >= 0; i-- ) {
                if (state.allDialogs[indexDialog].messaging[i].status === "unread") {
                    state.allDialogs[indexDialog].messaging[i].status = "read"
                } else {
                    break;
                }
            }
            return { 
                dialog: state.dialog,
                allDialogs: [...state.allDialogs]
             };
        }
        case "START_ONLINE": {
            for (let i = 0; i < state.allDialogs.length; i++) {
                if (action.emails.indexOf(state.allDialogs[i].secondEmail) !== -1) {
                    state.allDialogs[i].isOnline = true;
                    break;
                }
            }
            
            return { 
                dialog: state.dialog,
                allDialogs: [...state.allDialogs]
             };
        }
        case "LEAVE_ONLINE": {
            for (let i = 0; i < state.allDialogs.length; i++) {
                if (state.allDialogs[i].secondEmail === action.email) {
                    state.allDialogs[i].isOnline = false;
                    break;
                }
            }
            console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
            return { 
                dialog: state.dialog,
                allDialogs: [...state.allDialogs]
             };
        }
        case "NEW_ONLINE": {
            for (let i = 0; i < state.allDialogs.length; i++) {
                if (state.allDialogs[i].secondEmail === action.email) {
                    state.allDialogs[i].isOnline = true;
                    break;
                }
            }
            
            return { 
                dialog: state.dialog,
                allDialogs: [...state.allDialogs]
             };
        }
        case "NEW_MESSAGE": {
            let indexDialog = -1;
            for (let i = 0; i < state.allDialogs.length; i++) {
                if (state.allDialogs[i]._id === action._id) {
                    indexDialog = i; 
                    break;
                }
            }
            let var1 = state.allDialogs[indexDialog].messaging
            console.log(var1)
            console.log("-------------")
            state.allDialogs[indexDialog].messaging.push(action.message)
            let var2 = state.allDialogs[indexDialog].messaging
            console.log(var2)
            return { 
                dialog: state.dialog,
                allDialogs: [...state.allDialogs]
             };
        }
        case "SET_ALL_DIALOGS": {
            return { allDialogs: action.allDialogs };
        } 
        case "ADD_CHAT": {
            return {
                dialog: action.dialog,
                allDialogs: [action.allDialogs, ...state.allDialogs]  
            }
        }
        default: return state;
    }
}

export default store;