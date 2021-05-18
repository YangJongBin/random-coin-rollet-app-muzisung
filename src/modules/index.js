import { combineReducers } from 'redux';
import bithumb from './bithumb';
import random from './random'

const rootReducer = combineReducers({
    bithumb,
    random
})

export default rootReducer;