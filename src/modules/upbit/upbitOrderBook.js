import axios from 'axios';
import {handleActions} from 'redux-actions';

const UPBIT_ORDER_BOOK_LIST = 'UPBIT_ORDER_BOOK_LIST';
const UPBIT_ORDER_BOOK_LIST_REQUEST = 'UPBIT_ORDER_BOOK_LIST_REQUEST';
const UPBIT_ORDER_BOOK_LIST_SUCCESS = 'UPBIT_ORDER_BOOK_LIST_SUCCESS';
const UPBIT_ORDER_BOOK_LIST_FAILURE = 'UPBIT_ORDER_BOOK_LIST_FAILURE';

const initStatus = {
  isLoading: true,
  isError: false,
  resInfo: {},
};

export const getUpbitOrderBookList = params => ({
  type: UPBIT_ORDER_BOOK_LIST,
  payload: axios.get(
    `https://api.upbit.com/v1/orderbook?markets=${params.payment}-${params.coinName}`,
  ),
});

export default handleActions(
  {
    [UPBIT_ORDER_BOOK_LIST_REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      isError: false,
    }),
    [UPBIT_ORDER_BOOK_LIST_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      isError: false,
      orderBookList: action.payload.data,
    }),
    [UPBIT_ORDER_BOOK_LIST_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      isError: true,
    }),
  },
  initStatus,
);
