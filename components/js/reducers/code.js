
const code = (state = {
  currentId: undefined,
  contentsList:[],
  results:{},
}, action) => {
  switch (action.type) {
    case 'request_contentsAll':
      // console.log('*****',action.contents);
      return Object.assign({}, state, {
        contentsList: action.contents,
        results: {}
      });
    case 'add_contents':
      // console.log('jj88',action.contents1);
      return Object.assign({}, state, {
        contentsList: action.contents1,
      });
    case 'request_content':
      // console.log('jj88',action.contents1);
      return Object.assign({}, state, {
        contentsList: action.content.children||[],
        results: action.content
      });
    case 'updateResultsState':
      // console.log('jj88',action.contents1);
      return Object.assign({}, state, {
        results: action.results
      });
    case 'return_current_id':

      return Object.assign({}, state, {
        currentId: action.currentId
      });
    default:
      return state
  }
}


export default code
