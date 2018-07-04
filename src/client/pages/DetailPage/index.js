import React from 'react'
import classNames from 'classnames'
import { hashHistory } from 'react-router'
import Lable from 'yzt-rui/lib/label'
import Link from 'yzt-rui/lib/link'
import BX_DetailHeader from 'BX_DetailHeader'
import BX_InsurancePlan from 'BX_InsurancePlan'
import BX_InsuranceInfo from 'BX_InsuranceInfo'
import BX_InsuredInfo from 'BX_InsuredInfo'
import BX_FooterButton from 'BX_FooterButton'
import Loading from 'Loading';

import { } from '@client/utils'
import Inject from '../../redux/inject'
import './index.scss'

@Inject('detail')
class InsuranceDetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount() {
    window.scrollTo(0, 0);
  }
  componentDidMount() {
    const { detailAction, detail } = this.props;
    if (detail.loaded) {
      return;
    } else {
      Loading.show()
      let Pro1 = new Promise((resolve,reject) => setTimeout(resolve,3000))
      Promise.all([Pro1]).then(([Pro1]) => {
        Loading.hide()
        detailAction.triggerLoaded({loaded:true})
      })
    }
  }
  componentWillReceiveProps(nextProps) { }
  componentWillUnmount() { }
  calcPremuim = (data) => {
    const { detailAction } = this.props;
    return detailAction.calculatePremium({
      ...data,
      productCode: '201609092109'
    })
  }
  handleInsureBtn = () => {
    hashHistory.push('writeInsuranceinfopage')
  }
  renderDivider = () => {
    const dividerStyle = {
      width: '100%',
      height: '.625rem',
      backgroundColor: '#F5F5F5'
    }
    return (
      <div style={dividerStyle}></div>
    )
  }
  renderHeader = () => {
    const detail = this.props.detail.productDetail;
    const { productPicUrl, productName, supplierName, productSlogan, productIntroduction
    } = detail;
    let newProductIntroduction = [];
    newProductIntroduction[0] = productIntroduction.split('保险期限')[0];
    newProductIntroduction[1] = `保险期限${productIntroduction.split('保险期限')[1]}`;
    return (
      <BX_DetailHeader
        productPicUrl={productPicUrl}
        productName={productName}
        supplierName={supplierName}
        productIntroduction={newProductIntroduction}
      />
    )
  }
  renderInsurancePlan = () => {
    const data = this.props.detail.pkgdisplayDetail || [];

    return (
      <BX_InsurancePlan
        data={data}
      />
    )
  }
  renderInsuranceInfo = () => {
    const data = [
      { title: '选择旅游类型', value: '' },
      { title: '保障期限', value: '1年' },
      { title: '选择保障期限', value: '' },
      { title: '生效日期', value: '' },
    ];
    return (
      <BX_InsuranceInfo
        type='secondary'
        data={data}
        onOk={(val) => { console.log(val); }}
        visible={true}
        //minDate={}
        //maxDate={}
        guaranteeDateTime={15}
      />
    )
  }
  renderInsuredInfo = () => {
    const data = [
      { title: '被保人是投保人的', value: '' },
      { title: '性别', value: '' },
      { title: '被保人社保情况', value: '' }
    ]
    return (
      <BX_InsuredInfo
        type='secondary'
        data={data}
      />
    )
  }
  renderInsuranceDes = () => {
    return (
      <div className='insuranceDes'>
        <Lable color='grey-dark'>
          更多内容请查看
          <Link href='#'>《投保须知》</Link>
          <Link href='#'>《保险条款》</Link>
        </Lable>
      </div>
    )
  }
  renderInsuranceServer = () => {
    return (
      <div className='insuranceServer'>
        <div>
          <Lable color='grey-dark'>理赔流程</Lable>
        </div>
        <div>
          <Lable color='grey-dark'>常见问题</Lable>
        </div>
        <div>
          <Lable color='grey-dark'>客服电话</Lable>
        </div>
      </div>
    )
  }
  renderContent = () => {
    return (
      <div>
        {this.renderDivider()}
        {this.renderInsurancePlan()}
        {this.renderDivider()}
        {this.renderInsuranceInfo()}
        {this.renderDivider()}
        {this.renderInsuredInfo()}
        {this.renderDivider()}
        {this.renderInsuranceDes()}
        {this.renderDivider()}
        {this.renderInsuranceServer()}
        {this.renderDivider()}
      </div>
    )
  }
  renderFooter() {
    return (
      <BX_FooterButton
        ref={node => this.BX_FooterButton = node}
        price='120'
        changeFunc={this.calcPremuim}
        onClick={()=>{this.BX_FooterButton.loading()}}
      />
    )
  }
  render() {
    const { loginStatus, riskPopupVisible } = this.state;
    const { detail } = this.props;
    const InsuranceDetailPage = classNames('InsuranceDetailPage');
    if (!detail.loaded) {
      return null;
    }

    return (
      <div className={InsuranceDetailPage}>
        {this.renderHeader()}
        {this.renderContent()}
        {this.renderFooter()}
      </div>
    )
  }
}


export default InsuranceDetailPage
