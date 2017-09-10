import tools from '../utils/tools'
import { message } from 'antd';
import io from 'socket.io-client';
const socket = io.connect(window.location.origin);




export const returnMessagesState = messages => ({
  type: 'request_messagesAll',
  messages
})

export const returnPerNum = perNum => ({
  type: 'request_PerNum',
  perNum
})

export const returnUserInfoState = UserInfo => ({
  type: 'request_UserInfo',
  UserInfo
})


export const justReturnMessages = (arrays,array) => (dispatch, getState) => {
  // console.log('在actions中',arrays);
  //fuck你妹的 ！！！在action中传过来的时候就把state改变掉了，这个时候一定要穿一个新的！
  //真他娘的日狗！！咋写！每次都这样？？还是我写法有问题吖啊啊啊啊啊啊啊
  let fuck = arrays.slice(0) //数组的深拷贝
  fuck.push(array);
  return dispatch(returnMessagesState(fuck))
}


export const addPerNum = (num) => (dispatch, getState) => {
  num +=10
  // console.log(num);
  dispatch(returnPerNum(num))
  return dispatch(cbLimitMessages(num))
  //
}
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

export const cbAllMessages = () => (dispatch, getState) => {
  socket.on('message_all', (messages) => {
    let msg = messages || [] ;
    return dispatch(returnMessagesState(msg))
  });
}

export const cbLimitMessages = (num) => (dispatch, getState) => {
  socket.emit('apply message_all');
  socket.on('message_all', (messages) => {
    let msg = messages || [] ;

    return dispatch(returnMessagesState(msg.slice(-num)))
  });
}

export const updateAllMessages = userInfo => (dispatch, getState) => {
  // console.log('=================================');
  // console.log(getState());
  let app = getState()
  socket.emit('apply message_all');
  socket.on('message_all', (messages) => {
    let msg = messages || [] ;
    let fuck = msg.slice(0) //数组的深拷贝
    // console.log('msg',msg);

    fuck.map(function(item){
      var userinfo_old = item.userInfo;
      // console.log(userinfo_old._id === userInfo._id);
      if(userinfo_old._id === userInfo._id){
        /*
        这里有个问题：
        如果让 userinfo_old = userInfo的时候，
        userInfo不会复制到 item.userInfo，不会改变item中的userinfo值。
        */
        item.userInfo = userInfo
      }
    });
    // console.log('fuck',fuck);
    return dispatch(returnMessagesState(fuck.slice(-app.perNum)))
  });
}
