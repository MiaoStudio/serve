
var inititialState={
  users: [],
  visible:false,
  classifies:[],
  specificClass:{},
  exceptPopularData:[],
}

const app = (state = inititialState, action) => {
  // console.log(action);
  switch (action.type) {
    case 'request_usersAll':
      return Object.assign({}, state, {
        users: action.users
      });
    case 'request_classifies':
      return Object.assign({}, state, {
        classifies: action.classifies
      });
    case 'visibleState':
      return Object.assign({}, state, {
        visible: action.visible
      });
    case 'request_specificClass':
      return Object.assign({}, state, {
        specificClass: action.specificClass
      });
    case 'request_exceptPopulars':
      return Object.assign({}, state, {
        exceptPopularData: action.exceptPopularData
      });
    default:
      return state
  }
}


export default app
