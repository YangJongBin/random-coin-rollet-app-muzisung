import axios from 'axios';
import { handleActions} from 'redux-actions'

const BITHUMB_LIST = 'BITHUMB_LIST';
const BITHUMB_LIST_REQUEST = 'BITHUMB_LIST_REQUEST';
const BITHUMB_LIST_SUCCESS = 'BITHUMB_LIST_SUCCESS';
const BITHUMB_LIST_FAILURE = 'BITHUMB_LIST_FAILURE';

const initStatus = {
    isLoading: true,
    isError: false,
    resInfo : {}
}

export const getBithumbCoinList = () => ({
    type: BITHUMB_LIST,
    payload: axios.get('https://api.bithumb.com/public/ticker/all')
})

export default handleActions(
    {
        [BITHUMB_LIST_REQUEST] : (state, action) => ({
            ...state,
            loading: true,
            isError: false,
        }),
        [BITHUMB_LIST_SUCCESS] : (state, action) => ({
            ...state,
            loading: false,
            isError: false,
            resInfo: action.payload.data
        }),
        [BITHUMB_LIST_FAILURE] : (state, action) => ({
            ...state,
            loading: false,
            isError: true,
        })
    }, initStatus
)
