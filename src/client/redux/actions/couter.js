const counter = (param = {}) => dispatch => {
  return dispatch({type:'COUNTEDOWN'})
};

export default counter
