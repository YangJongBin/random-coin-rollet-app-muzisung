import axios from 'axios';
import {handleActions} from 'redux-actions';

const BITHUMB_ORDERBOOK_INFO = 'BITHUMB_ORDERBOOK_INFO';
const BITHUMB_ORDERBOOK_INFO_REQUEST = 'BITHUMB_ORDERBOOK_INFO_REQUEST';
const BITHUMB_ORDERBOOK_INFO_SUCCESS = 'BITHUMB_ORDERBOOK_INFO_SUCCESS';
const BITHUMB_ORDERBOOK_INFO_FAILURE = 'BITHUMB_ORDERBOOK_INFO_FAILURE';

const initStatus = {
  isLoading: true,
  isError: false,
  resInfo: {},
};

export const getBithumbOrderBookInfo = params => ({
  type: BITHUMB_ORDERBOOK_INFO,
  payload: axios.get(
    `https://api.bithumb.com/public/orderbook/${params.coinName}_${params.payment}`,
  ),
});

export default handleActions(
  {
    [BITHUMB_ORDERBOOK_INFO_REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      isError: false,
    }),
    [BITHUMB_ORDERBOOK_INFO_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      isError: false,
      orderBookInfo: action.payload.data,
    }),
    [BITHUMB_ORDERBOOK_INFO_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      isError: true,
    }),
  },
  initStatus,
);
