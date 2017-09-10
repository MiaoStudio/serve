import tools from '../utils/tools'
import { message } from 'antd';
import { browserHistory } from 'react-router'

export const returnUserInfoState = UserInfo => ({
  type: 'request_UserInfo',
  UserInfo
})

export const returnMyDocumentsUserDataState = myDocumentsUserData => ({
  type: 'request_MyDocumentsUserData',
  myDocumentsUserData
})

export const updateUserInfo = () => (dispatch, getState) => {
  tools.ajax({
       url: '/api/userInfo',
       method: 'GET',
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    // console.log(xhr);
    return dispatch(returnUserInfoState(xhr.response.userInfo))
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}

export const getMyDocumentsUserData = (email) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/user/viewInfo',
       method: 'POST',
       data:JSON.stringify({email:email}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    // console.log(xhr);
    if(xhr.response.success){
      return dispatch(returnMyDocumentsUserDataState(xhr.response.userInfo))
    }
    else{
      message.error('无此用户')
      browserHistory.push('/user/'+xhr.response.userInfo.email)
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
