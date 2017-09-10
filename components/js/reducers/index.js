import { combineReducers } from 'redux'
import app from './app'
import signin from './signin'
import code from './code'
import control from './control'



const rootReducer = {
  app,
  code,
  control,
  signin
}
// const rootReducer = combineReducers({
//     app,
//     code,
//     signin
// })
export default rootReducer
