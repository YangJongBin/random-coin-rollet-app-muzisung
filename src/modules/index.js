import {combineReducers} from 'redux';
import bithumbTicker from './bithumb/bithumbTicker';
import bithumbTickerAll from './bithumb/bithumbTickerAll';
import bithumbOrderBook from './bithumb/bithumbOrderBook';
import bithumbTransactionHistory from './bithumb/bithumbTransactionHistory';

import upbitCandles from './upbit/upbitCandles';
import upbitMarketAll from './upbit/upbitMarketAll';
import upbitOrderBook from './upbit/upbitOrderBook';
import upbitTicker from './upbit/upbitTicker';

const rootReducer = combineReducers({
  // bithumbTicker,
  // bithumbTickerAll,
  // bithumbOrderBook,
  // bithumbTransactionHistory,
  upbitCandles,
  upbitMarketAll,
  upbitOrderBook,
  upbitTicker,
});

export default rootReducer;
