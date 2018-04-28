import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import { Provider } from 'react-redux';
import appStore from './store';
import App from './App';

ReactDOM.render(
  <Provider store={appStore}>
    <Router>
      <Route component={App}>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
//registerServiceWorker();
