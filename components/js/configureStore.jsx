import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export default function configureStore(initialState) {
  let createStoreWithMiddleware;


  createStoreWithMiddleware = compose(
    applyMiddleware(
      thunk
    )
  )(createStore);

  const store = createStoreWithMiddleware(rootReducer, initialState);

  return store;
}
