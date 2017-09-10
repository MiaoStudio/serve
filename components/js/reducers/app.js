
var inititialState={
  userInfo:{},
  myDocumentsUserData:{},
}

const app = (state = inititialState, action) => {
  // console.log(action);
  switch (action.type) {
    case 'request_UserInfo':
      return Object.assign({}, state, {
        userInfo: action.UserInfo
      });
    case 'request_MyDocumentsUserData':
      return Object.assign({}, state, {
        myDocumentsUserData: action.myDocumentsUserData
      });
    default:
      return state
  }
}


export default app
