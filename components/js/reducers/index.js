import { combineReducers } from 'redux'
import app from './app'
import signin from './signin'
import code from './code'
import control from './control'
import group from './group'
import article from './article'
import docs from './docs'



const rootReducer = {
  app,
  code,
  control,
  group,
  docs,
  article,
  signin
}
// const rootReducer = combineReducers({
//     app,
//     code,
//     signin
// })
export default rootReducer
