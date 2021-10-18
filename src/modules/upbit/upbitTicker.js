import axios from 'axios';
import {handleActions} from 'redux-actions';

const UPBIT_TICKER_LIST = 'UPBIT_TICKER_LIST';
const UPBIT_TICKER_LIST_RQUEST = 'UPBIT_TICKER_LIST_RQUEST';
const UPBIT_TICKER_LIST_SUCCESS = 'UPBIT_TICKER_LIST_SUCCESS';
const UPBIT_TICKER_LIST_FILURE = 'UPBIT_TICKER_LIST_FILURE';

const initStatus = {
  isLoading: true,
  isError: false,
  tickerList: [],
};

export const getUpbitTickerList = params => ({
  type: UPBIT_TICKER_LIST,
  payload: axios.get(
    `https://api.upbit.com/v1/ticker?markets=${params.payment}-${params.coinName}`,
  ),
});

export default handleActions(
  {
    [UPBIT_TICKER_LIST_RQUEST]: (state, action) => ({
      ...state,
      loading: true,
      isError: false,
    }),
    [UPBIT_TICKER_LIST_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      isError: false,
      tickerList: action.payload.data,
    }),
    [UPBIT_TICKER_LIST_FILURE]: (state, action) => ({
      ...state,
      loading: false,
      isError: true,
    }),
  },
  initStatus,
);
