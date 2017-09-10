
var inititialState={
  groupInfo:{},
  isAuthority:false,
  deleteModalVisible:false
}

const group = (state = inititialState, action) => {
  // console.log(action);
  switch (action.type) {
    case 'request_group':
      return Object.assign({}, state, {
        groupInfo: action.groupInfo
      });
    case 'returnDeleteModalVisible':
      return Object.assign({}, state, {
        deleteModalVisible: action.visible
      });
    case 'request_authority':
      return Object.assign({}, state, {
        isAuthority: action.auth
      });
    default:
      return state
  }
}


export default group
