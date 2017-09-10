import tools from '../utils/tools'
import { message } from 'antd';
import { browserHistory } from 'react-router'
import { returnUserInfoState } from './app'
import {retrunArticleInfo} from './article'
import {returndeleteModalVisible} from './group'

export const returnDocInfoState = docInfo => ({
  type: 'request_doc',
  docInfo
})

export const returnAuthorityState = auth => ({
  type: 'request_authority',
  auth
})


export const getDocInfo = (path) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/doc/info',
       method: 'POST',
       data:JSON.stringify({path:path}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    // console.log(xhr);
    if(xhr.response.success){
      var docInfo = xhr.response.result;
      dispatch(returnDocInfoState(docInfo||{}));
      var login_user = getState().app.userInfo;
      var isAuthority;
      if(docInfo.path){
        if(docInfo.parentRef == "User"){
          isAuthority = login_user._id == docInfo.parentArray._id;
        }
        else{
          isAuthority = docInfo.parentArray.teamMember.map(item=>item._id).indexOf(login_user._id) != -1
        }
      }
      dispatch(returnAuthorityState(isAuthority));
    }
    else{
      browserHistory.push('/explore');
    }


  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const deleteDoc = (id) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/doc/delete',
       method: 'POST',
       data:JSON.stringify({values:{id:id}}),
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
export const updateDocInfo = (values) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/doc/update',
       method: 'POST',
       data:JSON.stringify({values:values,path:values.path}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
     if(xhr.response.success){
       message.success('更新成功')
       dispatch(returnDocInfoState(xhr.response.result||{}));
       return
     }
     message.error('更新失败')
  },
  function (e) {
    message.error('更新失败')
    console.log(JSON.stringify(e))
  })
}


//新建文章页面
export const createArticle = (obj) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/new',
       method: 'POST',
       data:JSON.stringify({doc_id:obj.doc_id}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
     let docInfo = getState().docs.docInfo;
     docInfo = JSON.parse(JSON.stringify(docInfo))
     if(xhr.response.success){
       message.success('创建成功');
       docInfo.article.push(xhr.response.result);
       //更新文档库内容
       dispatch(returnDocInfoState(docInfo));
       //更新当前最新文章问题
       dispatch(retrunArticleInfo(xhr.response.result));

       browserHistory.push('/doc/'+obj.path+'/'+xhr.response.result.slurm+'/edit');
       return
     }
     if(xhr.response.msg){
       return message.error(xhr.response.msg)
     }
     message.error('创建失败')
  },
  function (e) {
    message.error('创建失败')
    console.log(JSON.stringify(e))
  })
}
