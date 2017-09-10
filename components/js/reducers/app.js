
var inititialState={
  messages: [],
  userInfo:{},
  perNum:10,
}

const app = (state = inititialState, action) => {
  // console.log(action);
  switch (action.type) {
    case 'request_messagesAll':
      return Object.assign({}, state, {
        messages: action.messages
      });
    case 'request_UserInfo':
      return Object.assign({}, state, {
        userInfo: action.UserInfo
      });
    case 'request_PerNum':
      return Object.assign({}, state, {
        perNum: action.perNum
      });
    default:
      return state
  }
}


export default app
