import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { materialReducer } from './View/Material/reducers';
import { mobileReducer } from './View/Mobile/reducers';
import { forumReducer } from './View/Forum/reducers';

const rootReducer = combineReducers({
  material: materialReducer,
  mobile: mobileReducer,
  forum: forumReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

export default store;