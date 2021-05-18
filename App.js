import React, {Component} from 'react';
import {Provider} from 'react-redux';
import Page from './src/containers/Navi';
import store from './src/store';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Page />
      </Provider>
    );
  }
}
