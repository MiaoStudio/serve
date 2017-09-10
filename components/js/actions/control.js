import tools from '../utils/tools'
import { message } from 'antd';
import { browserHistory } from 'react-router'




export const returnUser = users => ({
  type: 'request_usersAll',
  users
})


export const fetchAllUsers = () => (dispatch, getState) => {
  tools.ajax({
       url: '/api/admin/allusers',
       method: 'POST',
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    console.log(xhr);
    return dispatch(returnUser(xhr.response.result))
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
