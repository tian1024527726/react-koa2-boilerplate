import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Tabs from 'yzt-rui/lib/tabs';
import Label from 'yzt-rui/lib/label';
import Link from 'yzt-rui/lib/link';

const TabPane = Tabs.Pane;

class BX_InsurancePlan extends React.Component {

  static defaultProps = {
    data: [
      {
        packageName: '基础款',
        coverageList: [{
          amountStruct: [{
            amount: "11000",
            conditionName: "99岁"
          },{
            amount: "11000",
            conditionName: "99岁"
          },{
            amount: "11000",
            conditionName: "99岁"
          }],
          coverageName: "无限责任",
          coverageDesc: "吴建成",
          coverageBrifeDesc: "无描述"
        }, {
          amountStruct: [{
            amount: "99999",
            conditionName: "3-19岁"
          }],
          coverageName: "333",
          coverageDesc: "",
          coverageBrifeDesc: ""
        }]
      }
    ],
    defaultactivekey: 0
  }

  constructor(props) {
    super(props);

    this.state = {
      activeKey: props.defaultactivekey || 0
    }
  }

  renderTabs = (data) => {
    const { activeKey } = this.state
    let TabsWrapper;
    if (data.length == 1) {
      TabsWrapper = <div className='title'>保障内容</div>
    } else if (data.length > 1) {
      TabsWrapper = <Tabs onChange={(k) => { console.log(k) }} type='filled' defaultactivekey={activeKey}>
        {data.map((item, index) =>
          <TabPane tab={<div><Label nodeType='p' size='medium'>{item.packageName}</Label></div>} key={index}></TabPane>
        )}
      </Tabs>
    }

    return TabsWrapper
  }

  renderContent = (data) => {
    const { activeKey } = this.state;
    if (data.length == 1) {
      const dataItem = data[activeKey];
      return (
        <div className='content'>
          <div className='little_msg'>
            {dataItem.coverageList.map((item, index) => {
              return (
                <div key={index}>
                  <div>
                    <Label color='grey-dark' nodeType='p'>{item.coverageName}</Label>
                  </div>
                  <div>
                    {item.amountStruct.map((item, index) => {
                      return (
                        <Label className='r_text' color='grey-dark' nodeType='p' key={index}>{`${item.conditionName},${item.amount}`}</Label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          <Label className='detail_msg' nodeType='p'>
            所有家庭成员公用保额。未成年人限乘已投保本产品的驾驶人的非运营车辆。简述文案最多支持三行，超出三行内容省略，详情点击下方链接新开页面查看。简述文案最多支持三行，超出三行内容省略，详情点击下方链接新开页面查看
          </Label>
          <Link className='more_msg' color='primary' href='#/insuranceliabilitypage'>
            查看保险责任详情
          </Link>
        </div>
      )
    }
  }

  render() {
    const {
      onMoreClick, data, ...restProps
    } = this.props;

    const BX_InsurancePlan = classNames('BX_InsurancePlan', {})
    return (
      <div className={BX_InsurancePlan}>
        {this.renderTabs(data)}
        {this.renderContent(data)}
      </div>
    )
  }
}

BX_InsurancePlan.propTypes = {
  data: PropTypes.array,
  onMoreClick: PropTypes.func
}

export default BX_InsurancePlan
