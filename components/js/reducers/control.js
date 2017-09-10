
var inititialState={
  users: [],
}

const app = (state = inititialState, action) => {
  // console.log(action);
  switch (action.type) {
    case 'request_usersAll':
      return Object.assign({}, state, {
        users: action.users
      });
    default:
      return state
  }
}


export default app
