import tools from '../utils/tools'
import { message , Modal} from 'antd';
import { browserHistory } from 'react-router'
const confirm = Modal.confirm;



export const returnUser = users => ({
  type: 'request_usersAll',
  users
})
export const returnClassify = classifies => ({
  type: 'request_classifies',
  classifies
})
export const returnVisible = visible => ({
  type: 'visibleState',
  visible
})

export const returnSpecificClass = specificClass => ({
  type: 'request_specificClass',
  specificClass
})
export const returnExceptPopular = exceptPopularData => ({
  type: 'request_exceptPopulars',
  exceptPopularData
})
export const fetchAllItems = (fix) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/admin/'+fix,
       method: 'POST',
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    console.log(xhr);
    if(xhr.response.success){
      if(fix == 'users'){
        return dispatch(returnUser(xhr.response.result))
      }
      if(fix == 'class'){
        return dispatch(returnClassify(xhr.response.result))
      }

    }

  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const deleteItem = (id,fix) => (dispatch, getState) => {
  var title = '确认删除该'+ (fix=='user'?"用户":"分类") +'？';
  var content = fix=='user'?"用户被删除后，其所有文档、文章以及拥有团队均会被删除。":"分类被删除之后将无法找回。"
  confirm({
    title: title,
    content: content,
    onOk() {
      tools.ajax({
           url: '/api/admin/delete'+fix,
           method: 'POST',
           data:JSON.stringify({_id:id}),
           headers:{'Content-Type':'application/json'},
           async: true,
           dataType:'json'
       })
      .then(function (xhr) {
        if(!xhr.response){
          return message.error('请求错误')
        }
        let usersList = getState().control.users
        let classifiesList = getState().control.classifies.slice(0);

        let fuck = []
        if(xhr.response.success){
            message.success('删除成功')
            if(fix == 'user'){
              usersList.map(function(item){
                if(item._id != id){
                  fuck.push(item)
                }
              })
              return dispatch(returnUser(fuck))
            }
            if(fix == 'class'){
              classifiesList.map(function(item){
                if(item._id != id){
                  fuck.push(item)
                }
              })
              return dispatch(returnClassify(fuck.slice(0)))
            }
        }
      },
      function (e) {
        console.log(JSON.stringify(e))
      })
    },
    onCancel() {
      console.log('Cancel');
    },
  });

}

export const updateItem = (obj,fix) => (dispatch, getState) => {

  tools.ajax({
       url: '/api/admin/update'+fix,
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
    let usersList = getState().control.users.slice(0)
    // //fuck你妹的 ！！！在action中传过来的时候就把state改变掉了，这个时候一定要穿一个新的！
    // //真他娘的日狗！！咋写！每次都这样？？还是我写法有问题吖啊啊啊啊啊啊啊
    // 2017-07-26 上述这些备注，很有问题，我也认识我到了我自己的错误，
    // 不应该写这种备注，真是幼稚，改正！记录着时刻提醒自己
    let classifiesList = getState().control.classifies.slice(0);
    //下面这个变量名称也显得程序员素质不高！！！
    let fuck = []
    if(xhr.response.success){
        dispatch(returnVisible(false))
        message.success(xhr.response.msg)


        if(fix == 'user'){
          usersList.map(function(item){
            if(item._id != obj._id){
              fuck.push(item)
            }
            else{
              fuck.push(xhr.response.result)
            }
          })
          return dispatch(returnUser(fuck.slice(0)))
        }
        if(fix == 'class'){
          classifiesList.map(function(item){
            if(item._id != obj._id){
              fuck.push(item)
            }
            else{
              fuck.push(xhr.response.result)
            }
          })
          return dispatch(returnClassify(fuck.slice(0)))
        }
    }
    else{
      message.error(xhr.response.msg)
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const addItem = (obj,fix) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/admin/add'+fix,
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
    let usersList = getState().control.users.slice(0);
    let classifiesList = getState().control.classifies.slice(0);
    if(xhr.response.success){
        message.success(xhr.response.msg)
        dispatch(returnVisible(false))
        if(fix == 'user'){
          usersList.push(xhr.response.result)
          return dispatch(returnUser(usersList))
        }
        if(fix == 'class'){
          classifiesList.push(xhr.response.result)
          return dispatch(returnClassify(classifiesList))
        }

    }
    else{
      message.error(xhr.response.msg)
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
export const addItemToClassify = (obj) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/admin/class/update',
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

    let classifiesList = getState().control.classifies.slice(0);
    if(xhr.response.success){
        message.success(xhr.response.msg)


    }
    else{
      message.error(xhr.response.msg)
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}


export const fetchSpecificClass = (en_name) => (dispatch, getState) => {
  tools.ajax({
       url: '/api/explore/specific',
       method: 'POST',
       data:JSON.stringify({en_name:en_name}),
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    console.log(xhr);
    if(xhr.response.success){
      return dispatch(returnSpecificClass(xhr.response.result))
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}

export const fetchExceptPopular = () => (dispatch, getState) => {
  tools.ajax({
       url: '/api/explore/exceptpopular',
       method: 'POST',
       headers:{'Content-Type':'application/json'},
       async: true,
       dataType:'json'
   })
  .then(function (xhr) {
    console.log(xhr);
    if(xhr.response.success){
      return dispatch(returnExceptPopular(xhr.response.result))
    }
  },
  function (e) {
    console.log(JSON.stringify(e))
  })
}
