import { createAction, handleActions} from 'redux-actions';
import _ from 'lodash'

const RANDOM = 'RANDOM';
const initStatus = {
    randomNum : 0
}

// export const setRandomNumber = (list) => ({
//     type: RANDOM,
//     payload: _.random(100)
// })

export const setRandomNumber = createAction(RANDOM, length => ({length}));

// export const setRandomNumber = () => dispatch =>{
//     dispatch(randomNumberAction())
// }

export default handleActions(
    {
        [RANDOM] : (state, action) => ({
            ...state,
            loading: false,
            isError: false,
            randomNum: _.random(action.payload.length)
        })
    }, initStatus
)
