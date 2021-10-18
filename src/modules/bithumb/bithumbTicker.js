import axios from 'axios';
import {handleActions} from 'redux-actions';

const BITHUMB_TICKER_INFO = 'BITHUMB_TICKER_INFO';
const BITHUMB_TICKER_INFO_REQUEST = 'BITHUMB_TICKER_INFO_REQUEST';
const BITHUMB_TICKER_INFO_SUCCESS = 'BITHUMB_TICKER_INFO_SUCCESS';
const BITHUMB_TICKER_INFO_FAILURE = 'BITHUMB_TICKER_INFO_FAILURE';

const initStatus = {
  isLoading: true,
  isError: false,
  resInfo: {},
};

export const getBithumbTickerInfo = params => ({
  type: BITHUMB_TICKER_INFO,
  payload: axios.get(
    `https://api.bithumb.com/public/ticker/${params.coinName}_${params.payment}`,
  ),
});

export default handleActions(
  {
    [BITHUMB_TICKER_INFO_REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      isError: false,
    }),
    [BITHUMB_TICKER_INFO_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      isError: false,
      tickerInfo: action.payload.data,
    }),
    [BITHUMB_TICKER_INFO_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      isError: true,
    }),
  },
  initStatus,
);
