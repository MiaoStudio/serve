import tools from '../utils/tools'
import { message ,Modal} from 'antd';
import { browserHistory } from 'react-router'
import { returnDocInfoState } from './docs'
const confirm = Modal.confirm;

export const retrunParentInfo = info => ({
  type: 'retrunParentInfo',
  info
})

export const retrunArticleInfo = article => ({
  type: 'retrunArticleInfo',
  article
})


export const returnAuthorityState = auth => ({
  type: 'request_authority',
  auth
})


export const updateParentInfo = (obj) => (dispatch, getState) => {
  dispatch(retrunParentInfo(obj))
  browserHistory.push('/doc/new')
}

export const getArticleInfo = (slurm,url) => (dispatch, getState) => {
  var articles = getState().docs.docInfo.article||[];
  var ArticleInfo = {};
  articles.map(function(item){
    if(item.slurm === slurm){
      ArticleInfo = item
    }
  });
  dispatch(retrunArticleInfo(ArticleInfo))
  browserHistory.push(url)
}
export const getArticleInfoFromEnd = (slurm) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/info',
       method: 'POST',
       data:JSON.stringify({slurm:slurm}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    // console.log(xhr);
    if(xhr.response.success){
      // console.log(xhr.response);
      dispatch(returnAuthorityState(xhr.response.authority))
      return dispatch(retrunArticleInfo(xhr.response.result))
    }
    message.error('查询失败')

  },
  function (e) {
    message.error('查询失败')
    console.log(JSON.stringify(e))
  })
}
export const updateArticleInfo = (obj) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/update',
       method: 'POST',
       data:JSON.stringify(obj),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    // console.log(xhr);
    if(xhr.response.success){
      //返回的是修改后的article
      //第一步要返回新的article，
      dispatch(retrunArticleInfo(xhr.response.result))
      //第二部要修改doc中的artciel信息
      var docInfo = getState().docs.docInfo;
      var articles = docInfo.article||[];
      var newArticles = [];
      articles.map(function(item){
        if(item._id == xhr.response.result._id){
          newArticles.push(xhr.response.result)
        }
        else{
          newArticles.push(item)
        }
      });
      docInfo.article = newArticles;
      dispatch(returnDocInfoState(JSON.parse(JSON.stringify(docInfo))));
      if(obj.status){
        browserHistory.push('/doc/'+docInfo.path+'/'+xhr.response.result.slurm)
        message.success('发布成功')
      }
      else{
        browserHistory.push('/doc/'+docInfo.path+'/'+xhr.response.result.slurm+'/edit')
        message.success('更新成功')
      }

      return
    }
    if(xhr.response.msg){
      return message.error(xhr.response.msg)
    }
    message.error('修改失败')

  },
  function (e) {
    message.error('修改失败')
    console.log(JSON.stringify(e))
  })
}
//删除文章；

export const deleteArticle = (obj) => (dispatch, getState) => {
  var _id = obj._id;
  confirm({
    title: '确认删除文档《'+obj.title+'》',
    content: '文档被删除之后将无法找回；如果开启目录，需要手动从目录中删除该节点。',
    onOk() {
      tools.ajax({
           url: '/api/article/del',
           method: 'POST',
           data:JSON.stringify({_id:_id}),
           headers:{'Content-Type':'application/json'},
           async: true,
           dataType:'json'
       })
      .then(function (xhr) {
         let docInfo = getState().docs.docInfo;
         docInfo = JSON.parse(JSON.stringify(docInfo))
         var articles = docInfo.article ||[];
         var newarticles = [];
         if(xhr.response.success){
           message.success('删除成功');
           //更新文档库内容
           articles.map(function(item){
             if(item._id != _id){
               newarticles.push(item)
             }
           })
           docInfo.article = newarticles
           console.log(docInfo);
           dispatch(returnDocInfoState(docInfo));
           return
         }
         message.error('创建失败')
      },
      function (e) {
        message.error('创建失败')
        console.log(JSON.stringify(e))
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });

}
