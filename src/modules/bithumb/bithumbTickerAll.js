import axios from 'axios';
import {handleActions} from 'redux-actions';

const BITHUMB_TICKER_ALL_INFO = 'BITHUMB_TICKER_ALL_INFO';
const BITHUMB_TICKER_ALL_INFO_REQUEST = 'BITHUMB_TICKER_ALL_INFO_REQUEST';
const BITHUMB_TICKER_ALL_INFO_SUCCESS = 'BITHUMB_TICKER_ALL_INFO_SUCCESS';
const BITHUMB_TICKER_ALL_INFO_FAILURE = 'BITHUMB_TICKER_ALL_INFO_FAILURE';

const initStatus = {
  isLoading: true,
  isError: false,
  resInfo: {},
};

export const getBithumbTickerAllInfo = params => ({
  type: BITHUMB_TICKER_ALL_INFO,
  payload: axios.get(`https://api.bithumb.com/public/ticker/ALL`),
});

export default handleActions(
  {
    [BITHUMB_TICKER_ALL_INFO_REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      isError: false,
    }),
    [BITHUMB_TICKER_ALL_INFO_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      isError: false,
      tickerAllInfo: action.payload.data,
    }),
    [BITHUMB_TICKER_ALL_INFO_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      isError: true,
    }),
  },
  initStatus,
);
