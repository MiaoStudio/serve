import tools from '../utils/tools'
import { message } from 'antd';
import { browserHistory } from 'react-router'



export const returnContentsState = contents => ({
  type: 'request_contentsAll',
  contents
})

export const returnContentState = content => ({
  type: 'request_content',
  content
})
export const addContentsState = contents1 => ({
  type: 'add_contents',
  contents1
})

export const returnCurrentIdState = currentId => ({
  type: 'return_current_id',
  currentId
})
export const returnResultsState = results => ({
  type: 'updateResultsState',
  results
})

export const fetchListAll = () => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/list',
       method: 'GET',
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    return dispatch(returnContentsState(xhr.response.results))
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const updateItemAction = (obj) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/update',
       method: 'POST',
       data:JSON.stringify(obj),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    if(!xhr.response){
      return message.error('请求错误')
    }
    if(xhr.response.success){
        message.success('操作成功')
        return dispatch(returnResultsState(xhr.response.results))
    }else{
      message.error(xhr.response.msg)
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const fetchListById = (id) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/list?id='+id,
       method: 'GET',
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    if(!xhr.response){
      return message.error('请求错误')
    }
    if(xhr.response.results){
        // dispatch(returnContentState(xhr.response.results||{}))
        return dispatch(returnContentState(xhr.response.results||{}))
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const creatItems = (obj) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/new',
       method: 'POST',
       data:JSON.stringify(obj),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    if(!xhr.response){
      return message.error('请求错误')
    }
    let contentsList = getState().code.contentsList
    //fuck你妹的 ！！！在action中传过来的时候就把state改变掉了，这个时候一定要穿一个新的！
    //真他娘的日狗！！咋写！每次都这样？？还是我写法有问题吖啊啊啊啊啊啊啊
    let fuck = contentsList.slice(0) //数组的深拷贝

    if(xhr.response.results){
        fuck.push(xhr.response.results)
        // console.log(fuck);
        return dispatch(addContentsState(fuck))
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const deleteArticleAction = (id) => (dispatch, getState) => {

  tools.ajax({
       url: '/api/article/del',
       method: 'POST',
       data:JSON.stringify({_id:id,type:'file'}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    if(!xhr.response){
      return message.error('请求错误')
    }
    let contentsList = getState().code.contentsList
    // //fuck你妹的 ！！！在action中传过来的时候就把state改变掉了，这个时候一定要穿一个新的！
    // //真他娘的日狗！！咋写！每次都这样？？还是我写法有问题吖啊啊啊啊啊啊啊
    let fuck = []

    if(xhr.response.success){
        message.success('删除成功')
        contentsList.map(function(item){
          if(item._id != id){
            fuck.push(item)
          }
        })
        return dispatch(addContentsState(fuck))
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
  .then(function(){
    browserHistory.push('/mydesk/list/')
  })
}
export const deleteItemAction = (id,type) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/delete',
       method: 'POST',
       data:JSON.stringify({_id:id,type:type}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    if(!xhr.response){
      return message.error('请求错误')
    }
    let contentsList = getState().code.contentsList
    // //fuck你妹的 ！！！在action中传过来的时候就把state改变掉了，这个时候一定要穿一个新的！
    // //真他娘的日狗！！咋写！每次都这样？？还是我写法有问题吖啊啊啊啊啊啊啊
    let fuck = []

    if(xhr.response.success){
        message.success('删除成功')
        contentsList.map(function(item){
          if(item._id != id){
            fuck.push(item)
          }
        })
        return dispatch(addContentsState(fuck))
    }
  },
  function (e) {
    // console.log(JSON.stringify(e))
  })
}


export const renameItemsAction = (id,name) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/article/update',
       method: 'POST',
       data:JSON.stringify({_id:id,title:name}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    if(!xhr.response){
      return message.error('请求错误')
    }
    let contentsList = getState().code.contentsList
    // //fuck你妹的 ！！！在action中传过来的时候就把state改变掉了，这个时候一定要穿一个新的！
    // //真他娘的日狗！！咋写！每次都这样？？还是我写法有问题吖啊啊啊啊啊啊啊

    if(xhr.response.success){
        message.success(xhr.response.msg)
        contentsList.map(function(item){
          if(item._id === id){
            item.title = name
          }
        })
        let fuck = contentsList.slice(0) //数组的深拷贝
        return dispatch(addContentsState(fuck))
    }
    else{
      message.error(xhr.response.msg)
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
