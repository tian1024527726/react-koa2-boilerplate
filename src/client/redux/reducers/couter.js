import * as types from '../constants';

const initialState = {
  countDown: 10,
};

const counter = (state = initialState, action)=>{
  let { type,data } = action;

  switch(type){
      case types.COUNTDOWN:
          return { countDown: --state.countDown };

      default:
          return state;
  }
};


export default counter;
