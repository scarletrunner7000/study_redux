import React from 'react';
import ReactDOM from 'react-dom';
import CalculatorContainer from './containers/CalculatorContainer';

import { createStore } from 'redux';
import todoApp from './reducers/reducers';


let store = createStore(todoApp);

ReactDOM.render(
  <CalculatorContainer />,
  document.getElementById('root')
);

