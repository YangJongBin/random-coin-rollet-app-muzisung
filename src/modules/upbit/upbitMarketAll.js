import axios from 'axios';
import {handleActions} from 'redux-actions';
import _ from 'lodash';

const UPBIT_MARKET_ALL_LIST = 'UPBIT_MARKET_ALL_LIST';
const UPBIT_MARKET_ALL_LIST_REQUEST = 'UPBIT_MARKET_ALL_LIST_REQUEST';
const UPBIT_MARKET_ALL_LIST_SUCCESS = 'UPBIT_MARKET_ALL_LIST_SUCCESS';
const UPBIT_MARKET_ALL_LIST_FAILURE = 'UPBIT_MARKET_ALL_LIST_FAILURE';

const initStatus = {
  isLoading: true,
  isError: false,
  resInfo: {},
};

export const getUpbitMarketAllList = params => ({
  type: UPBIT_MARKET_ALL_LIST,
  payload: axios.get('https://api.upbit.com/v1/market/all?isDetails=true'),
});

export default handleActions(
  {
    [UPBIT_MARKET_ALL_LIST_REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      isError: false,
    }),
    [UPBIT_MARKET_ALL_LIST_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      isError: false,
      marketAllList: _.filter(action.payload.data, info => {
        return _.includes(info.market, 'KRW');
      }),
    }),
    [UPBIT_MARKET_ALL_LIST_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      isError: true,
    }),
  },
  initStatus,
);
