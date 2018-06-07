import * as types from './constants'
const initialState = {
  insuranceDetail: null
}


const insuranceDetail = (state = initialState, action) => {
  let { type, data } = action;
  switch (type) {
    case types.INSURANCE_DETAIL:
      return { ...state, ...data };
    default:
      return state;
  }
}

export default insuranceDetail;
