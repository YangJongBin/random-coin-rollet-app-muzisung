import axios from 'axios';
import {handleActions} from 'redux-actions';

const BITHUMB_TRANSACTION_HISTORY_INFO = 'BITHUMB_TRANSACTION_HISTORY_INFO';
const BITHUMB_TRANSACTION_HISTORY_INFO_REQUEST =
  'BITHUMB_TRANSACTION_HISTORY_INFO_REQUEST';
const BITHUMB_TRANSACTION_HISTORY_INFO_SUCCESS =
  'BITHUMB_TRANSACTION_HISTORY_INFO_SUCCESS';
const BITHUMB_TRANSACTION_HISTORY_INFO_FAILURE =
  'BITHUMB_TRANSACTION_HISTORY_INFO_FAILURE';

const initStatus = {
  isLoading: true,
  isError: false,
  resInfo: {},
};

export const getBithumbCoinList = params => ({
  type: BITHUMB_TRANSACTION_HISTORY_INFO,
  payload: axios.get(
    `https://api.bithumb.com/public/transaction-history/${params.coinName}_${params.payment}`,
  ),
});

export default handleActions(
  {
    [BITHUMB_TRANSACTION_HISTORY_INFO_REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      isError: false,
    }),
    [BITHUMB_TRANSACTION_HISTORY_INFO_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      isError: false,
      transctionHistoryInfo: action.payload.data,
    }),
    [BITHUMB_TRANSACTION_HISTORY_INFO_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      isError: true,
    }),
  },
  initStatus,
);
