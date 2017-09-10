
var inititialState={
  docInfo:{},
  isAuthority:false,
}

const docs = (state = inititialState, action) => {
  // console.log(action);
  switch (action.type) {
    case 'request_doc':
      return Object.assign({}, state, {
        docInfo: action.docInfo
      });
    case 'request_authority':
      return Object.assign({}, state, {
        isAuthority: action.auth
      });
    default:
      return state
  }
}


export default docs
