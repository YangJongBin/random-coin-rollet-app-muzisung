import {createStore, applyMiddleware} from 'redux';
import modules from './modules';
import {createLogger} from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import {createPromise} from 'redux-promise-middleware';

const logger = createLogger({
  timestamp: false,
  logErrors: false,
  predicate: false,
});
const customizedPromiseMiddleware = createPromise({
  promiseTypeSuffixes: ['REQUEST', 'SUCCESS', 'FAILURE'],
  typeDelimiter: '/',
});

export default createStore(
  modules,
  applyMiddleware(logger, ReduxThunk, customizedPromiseMiddleware),
);
