import {combineReducers} from 'redux';
import bithumbTicker from './bithumb/bithumbTicker';
import bithumbOrderBook from './bithumb/bithumbOrderBook';
import bithumbTransactionHistory from './bithumb/bithumbTransactionHistory';

const rootReducer = combineReducers({
  bithumbTicker,
  bithumbOrderBook,
  bithumbTransactionHistory,
});

export default rootReducer;
