import React from 'react'
import { hashHistory } from 'react-router'
import classNames from 'classnames'
import BX_InsuranceInfo from 'BX_InsuranceInfo'
import BX_InsurerInfo from 'BX_InsurerInfo'
import BX_InsuredInfo from 'BX_InsuredInfo'
import { } from '@client/utils'
import Inject from '../../redux/inject'
import './index.scss'

@Inject('home')
class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: true
    }
  }
  componentDidMount() {
    const actions = this.props.homeAction;

  }
  componentWillReceiveProps() { }
  componentWillUnmount() { }
  renderDivider() {
    const dividerStyle = {
      width: '100%',
      height: '.625rem',
      backgroundColor: '#F5F5F5'
    }
    return (
      <div style={dividerStyle}></div>
    )
  }
  renderInsuranceInfo = () => {
    const data = [
      { title: '保险名称', value: '百万私家车驾乘意外险' },
      { title: '套餐类型', value: '基础款' },
      { title: '保障期限', value: '15天' },
      { title: '生效日期', value: '' },
      { title: '保障期间', value: '' }
    ];
    return (
      <BX_InsuranceInfo
        data={data}
        onOk={(val) => { console.log(val) }}
        visible={true}
        //minDate={}
        //maxDate={}
        guaranteeDateTime={15}
      />
    )
  }
  renderInsurerInfo = () => {
    return (
      <BX_InsurerInfo/>
    )
  }
  renderInsuredInfo = () => {
    return (
      <BX_InsuredInfo/>
    )
  }
  render() {
    const { loaded } = this.state;
    const HomePage = classNames('HomePage');
    return (
      <div className={HomePage}>
        {this.renderInsuranceInfo()}
        {this.renderDivider()}
        {this.renderInsurerInfo()}
        {this.renderDivider()}
        {this.renderInsuredInfo()}
      </div>
    )
  }
}


export default HomePage
