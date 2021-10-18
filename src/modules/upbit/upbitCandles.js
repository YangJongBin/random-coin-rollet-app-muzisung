import axios from 'axios';
import {handleActions} from 'redux-actions';

const UPBIT_CANDLES_LIST = 'UPBIT_CANDLES_LIST';
const UPBIT_CANDLES_LIST_REQUEST = 'UPBIT_CANDLES_LIST_REQUEST';
const UPBIT_CANDLES_LIST_SUCCESS = 'UPBIT_CANDLES_LIST_SUCCESS';
const UPBIT_CANDLES_LIST_FAILURE = 'UPBIT_CANDLES_LIST_FAILURE';

const initStatus = {
  isLoading: true,
  isError: false,
  candlesList: [],
};

export const getUpbitCandlesList = params => ({
  type: UPBIT_CANDLES_LIST,
  payload: axios.get(
    `https://api.upbit.com/v1/candles/${params.unit}/${params.minute}?market=${params.payment}-${params.coinName}&count=${params.count}`,
  ),
});

export default handleActions(
  {
    [UPBIT_CANDLES_LIST_REQUEST]: (state, action) => ({
      ...state,
      loading: true,
      isError: false,
    }),
    [UPBIT_CANDLES_LIST_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      isError: false,
      candlesList: action.payload.data,
    }),
    [UPBIT_CANDLES_LIST_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      isError: true,
    }),
  },
  initStatus,
);
