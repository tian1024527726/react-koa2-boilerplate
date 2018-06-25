import { IS_LOADED } from './constants'


const triggerLoaded = (data = {}, callback) => dispatch => {
  dispatch({
    type: IS_LOADED,
    data: { loaded: data.loaded }
  })
}



export { triggerLoaded };
