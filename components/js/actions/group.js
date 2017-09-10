import tools from '../utils/tools'
import { message } from 'antd';
import { browserHistory } from 'react-router'
import { returnUserInfoState } from './app'

export const returnGroupInfoState = groupInfo => ({
  type: 'request_group',
  groupInfo
})
export const returndeleteModalVisible = visible => ({
  type: 'returnDeleteModalVisible',
  visible
})
export const returnAuthorityState = auth => ({
  type: 'request_authority',
  auth
})


export const getGroupInfo = (path) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/group/info',
       method: 'POST',
       data:JSON.stringify({path:path}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    if(xhr.response.success){
      var groupInfo = xhr.response.result;
      dispatch(returnGroupInfoState(groupInfo));
      var login_user = getState().app.userInfo;
      var isAuthority;
      if(groupInfo._id){
        //第一步取出temamember中的_id,组成数组，在判断是否存在当前登录者_id；
        // console.log(this.props.docInfo.parentArray.teamMember.map(item=>item._id));
        // console.log(this.props.userInfo._id);
        // console.log(this.props.docInfo.parentArray.teamMember.map(item=>item._id).indexOf(this.props.userInfo._id));
        isAuthority = groupInfo.teamMember.map(item=>item._id).indexOf(login_user._id) != -1
      }
      dispatch(returnAuthorityState(isAuthority));
    }

  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const deleteGroup = (id) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/group/delete',
       method: 'POST',
       data:JSON.stringify({_id:id}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {

    if(xhr.response.success){
      message.success('删除成功')
      dispatch(returndeleteModalVisible(false));
      browserHistory.push('/explore');
      return
    }
    message.error('删除失败')
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const updateGroupInfo = (values) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/group/update',
       method: 'POST',
       data:JSON.stringify({values:values}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
     console.log(xhr.response.success);
     if(xhr.response.success){
       message.success('更新成功')
       dispatch(returnGroupInfoState(xhr.response.teamer))
       dispatch(returnUserInfoState(xhr.response.userInfo));
       return
     }
      message.error('更新失败')
  },
  function (e) {
    message.error('更新失败')
    console.log(JSON.stringify(e))
  })
}
