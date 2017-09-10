import React from 'react'
import ReactDOM from 'react-dom';
import {Router, Route,browserHistory,Redirect,useRouterHistory} from 'react-router';
// import {createHashHistory,createBrowserHistory} from 'history';
import createBrowserHistory from 'history/createBrowserHistory'
import App from './containers/chat/App.jsx';
import Code from './containers/code/Index.jsx';
import Article from './containers/code/Article.jsx';
import Layout from './containers/Layout.jsx';
import OutLine from './containers/OutLine.jsx';
import Signin from './containers/Signin.jsx';
import SignUp from './containers/SignUp.jsx';
import Admin from './containers/control/Index.jsx';
import AdminUsers from './containers/control/Users.jsx';

import { createStore, applyMiddleware , combineReducers } from 'redux'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import configureStore from './configureStore.jsx';
const middleware = [ thunk ]

import './common/docs/style';

const appHistory = useRouterHistory(createBrowserHistory)({queryKey: false});
const store = createStore(
  combineReducers({
    ...reducer,
    routing: routerReducer,
  }),
  applyMiddleware(...middleware)
)
// const initialState = {};
// const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
    <Route path="/signin" component={Signin}/>
    <Route path="/signup" component={SignUp}/>
    <Route path="/admin" component={Admin}>
      <Route path="users" component={AdminUsers}/>
    </Route>
      <Route path="/" component={OutLine}>
        <Redirect from="/mydesk" to="/mydesk/list" />
        <Route path="/chat" component={App}/>
        <Route path="/mydesk" component={Layout} >

          <Route path="list/:id" component={Code}/>
          <Route path="list" component={Code}/>
        </Route>
        <Route path="/explore" component={Layout} >

        </Route>
        <Route path="/article/:id" component={Article}/>
        <Redirect from="/article" to="/mydesk/list" />
      </Route>
    </Router>
  </Provider>

),document.getElementById('react')
);
