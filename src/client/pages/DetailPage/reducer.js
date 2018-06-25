import * as types from './constants'
const initialState = {
  loaded: false,
  premiumInfo: '',
  productDetail: {
    productIntroduction: '承保年龄：30天-70周岁  保险期限：1年',
    productPicUrl: 'http://pa18-pweb.pingan.com/upload/chnapp/pc/uploads/img/product/2018/06/13/15288710929511.png',
    productName: '百万私家车驾乘意外险',
    supplierName: '平安保险'
  },
  pkgdisplayDetail: [],
  factorInfo: []
}


const insuranceDetail = (state = initialState, action) => {
  let { type, data } = action;
  let newstate;
  switch (type) {
    case types.INSURANCE_DETAIL:
      newstate = { ...state };
      newstate.productDetail = { ...newstate.productDetail, ...data.productDetail };
      return newstate;
    case types.PKGDISPLAY_DETAIL:
      newstate = { ...state };
      newstate.pkgdisplayDetail = data.pkgdisplayDetail;
      return newstate;
    case types.FACTOR_INFO:
      newstate = { ...state };
      newstate.factorInfo = data.factorInfo;
      return newstate;
    case types.PREMUIM_INFO:
      newstate = { ...state };
      newstate.premuimInfo = data.premuimInfo;
      return newstate;
    case types.IS_LOADED:
      newstate = { ...state };
      newstate.loaded = data.loaded;
      return newstate;
    default:
      return state;
  }
}

export default insuranceDetail;
