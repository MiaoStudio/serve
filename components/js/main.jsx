import React from 'react'
import ReactDOM from 'react-dom';
import {Router, Route,browserHistory,Redirect,useRouterHistory} from 'react-router';
// import {createHashHistory,createBrowserHistory} from 'history';
// import createBrowserHistory from 'history/createBrowserHistory'
import Code from './containers/code/Index.jsx';

import Article_view from './containers/article/View.jsx';
import Article_manage from './containers/article/Manage.jsx';

import Layout from './containers/Layout.jsx';
import OutLine from './containers/OutLine.jsx';
import Signin from './containers/Signin.jsx';
import SignUp from './containers/SignUp.jsx';
import Admin from './containers/control/Index.jsx';
import AdminUsers from './containers/control/Users.jsx';
import AdminClassify from './containers/control/Classify.jsx';

import Explore from './containers/explore/Index.jsx';
import Popular from './containers/explore/Popular.jsx';
import Classify from './containers/explore/Classify.jsx';
import ClassifySpecific from './containers/explore/ClassifySpecific.jsx';


import CreateDoc from './containers/createNew/Doc.jsx';
import CreateGroup from './containers/createNew/Group.jsx';
import GroupView from './containers/group/Index.jsx';
import GroupMember from './containers/group/Member.jsx';
import GroupSetting from './containers/group/Setting.jsx';
import SignerInfo from './containers/setting/SignerInfo.jsx';


//docs
import Docs from './containers/docs/Index.jsx';
import DocList from './containers/docs/List.jsx';
import DocSetting from './containers/docs/Settings.jsx';
import DocSettingAdvanced from './containers/docs/Settings_advanced.jsx';
import CatalogManage from './containers/docs/CatalogManage.jsx';

import { createStore, applyMiddleware , combineReducers } from 'redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import configureStore from './configureStore.jsx';
const middleware = [ thunk ]

import './common/docs/style';

// const appHistory = useRouterHistory(createBrowserHistory)({queryKey: false});

const store = createStore(
  combineReducers({
    ...reducer,
    routing: routerReducer,
  }),
  applyMiddleware(...middleware)
)
// const initialState = {};
// const store = configureStore(initialState);

class ErrorPage extends React.Component {
  componentDidMount(){
    // alert('asd')
    window.location.reload()
  }
  render(){
    return(
      <p>page not foundd</p>

    )
  }
}
const history = syncHistoryWithStore(browserHistory, store);
ReactDOM.render((
  <Provider store={store}>
    <Router history={history} >
    <Route path="/signin" component={Signin}/>
    <Route path="/signup" component={SignUp}/>
    <Redirect from="/" to="/explore/popular" />
    <Route path="/" component={OutLine}>
      <Redirect from="/explore" to="/explore/popular" />
      <Route path="/explore" component={Explore} >
        <Route path="popular" component={Popular}/>
        {/* <Route path="classify" component={Classify}>
          <Route path=":ename" component={ClassifySpecific}/>
        </Route> */}
        <Route path="classify/:ename" component={ClassifySpecific}/>
        <Route path="classify" component={Classify}/>
      </Route>
      <Redirect from="/admin" to="/admin/users" />
      <Route path="/admin" component={Admin}>
        <Route path="users" component={AdminUsers}/>
        <Route path="classify" component={AdminClassify}/>
      </Route>

      <Route path="/group" component={Layout}>
        <Redirect from="/group" to="/group/new" />
        <Route path="new" component={CreateGroup}/>
        <Route path=":path" component={GroupView}>
          <Route path="setting" component={GroupSetting}/>
          <Route path="member" component={GroupMember}/>
        </Route>
      </Route>


      <Route path="/user" component={Layout}>
        <Redirect from="/user" to="/explore" />
        <Route path=":email" component={Code}/>
      </Route>


      <Route path="/doc" component={Layout}>
        <Redirect from="/doc" to="/doc/new" />
        <Route path="new" component={CreateDoc}/>
        <Route path=":path" component={Docs}>
          <Route path="list" component={DocList}/>
          <Route path="toc" component={CatalogManage}/>
          <Route path="setting" component={DocSetting}>
            <Route path="advanced" component={DocSettingAdvanced}/>
          </Route>
          <Route path=":id" component={Article_view}/>
          <Route path=":id/edit" component={Article_manage}/>
        </Route>
      </Route>
      <Route path="/setting" component={SignerInfo}/>



    </Route>
    <Route path="*" component={ErrorPage}/>
    </Router>
  </Provider>

),document.getElementById('react')
);
