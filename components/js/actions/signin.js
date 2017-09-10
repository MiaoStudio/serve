
import tools from '../utils/tools'
import { message } from 'antd';
export const returnState = reddit => ({
  type: 'signin',
  reddit
})

export const fetch = reddit => (dispatch, getState) => {
  // console.log('fetch',reddit);
   tools.ajax({
        url: '/user/signin',
        method: 'POST',
        data:JSON.stringify({user:reddit}),
        headers:{'Content-Type':'application/json'},
        async: true,
        dataType:'json'
    })
  .then(function (xhr) {
      // console.log(xhr);
      // console.log(xhr.response);
      let res = xhr.response;
      if(res.error){
          return message.error(res.msg)
      }
      if(res.success){
        message.success(res.msg);
        window.location.href = '/user/'+res.path
      }
   },
   function (e) {
     console.log(JSON.stringify(e))
   })
  return dispatch(returnState(reddit))
}
