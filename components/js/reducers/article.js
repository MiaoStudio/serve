
var inititialState={
  parentInfo:{},
  isAuthority:false,
  articleInfo:{},
}

const article = (state = inititialState, action) => {
  // console.log(action);
  switch (action.type) {
    case 'retrunParentInfo':
      return Object.assign({}, state, {
        parentInfo: action.info
      });
    case 'retrunArticleInfo':
      return Object.assign({}, state, {
        articleInfo: action.article
      });
    case 'request_authority':
      return Object.assign({}, state, {
        isAuthority: action.auth
      });
    default:
      return state
  }
}


export default article
