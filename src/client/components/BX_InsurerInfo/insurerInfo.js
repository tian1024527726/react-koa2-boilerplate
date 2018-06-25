import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import List from 'yzt-rui/lib/list';
import Input from 'yzt-rui/lib/input';
import Picker from 'yzt-rui/lib/picker';
import Icon from 'yzt-rui/lib/icon';
import Cell from 'yzt-rui/lib/cell';

const ListItem = List.Item;
const DatePicker = Picker.DatePicker;
const DummyInput = Input.Number;

import { } from '@client/utils';

const checkValueFn = (data = []) => {
  return data.every((item, index) => {
    if (item.rule) {
      return item.rule.regExp ? item.rule.regExp.test(item.value) : true;
    } else {
      return true;
    }
  })
}


class BX_InsurerInfo extends React.Component {

  static defaultProps = {
    visible: true,
    data: [
      { title: '投保人姓名', value: '李如一' },
      { title: '证件类型', value: '身份证' },
      { title: '证件号码', value: '430602196091024', rule: { regExp: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/, msg: '请输入正确的证件号码' } },
      { title: '手机号', value: '18616731024', rule: { regExp: /^1[3456789]\d{9}$/, msg: '请输入正确的手机号' } },
      { title: '电子邮箱', value: '12121@qq.com', rule: { regExp: /^[A-Za-z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, msg: '请输入正确的电子邮箱' } },
    ]
  }
  constructor(props) {
    super(props);

    this.state = {
      wrapperVisible: props.visible,
      data: props.data
    }
  }
  componentDidMount() {
    const { data } = this.state;
    this.isOk(data);
  }
  componentWillReceiveProps(nextProps) { }
  isOk = (data) => {
    const { onOk } = this.props;
    if (checkValueFn(data)) {
      onOk && onOk({ status: true, value: data });
    }
  }
  rednerHeader = () => {
    const { wrapperVisible } = this.state;
    return (
      <div>
        <div>投保人信息</div>
        <div className='icon-arrow' onClick={() => { this.setState({ wrapperVisible: !this.state.wrapperVisible }) }}>
          <Icon size='s' type={wrapperVisible ? 'arrow-up' : 'arrow-down'} style={{ color: '#C7C7CC' }} />
        </div>
      </div>
    )
  }
  render() {
    const {
      className, visible
    } = this.props;

    const {
      wrapperVisible, data
    } = this.state;
    const BX_InsurerInfo = classNames('BX_InsurerInfo', className, {
    })
    return (
      <div className={BX_InsurerInfo}>
        <List
          header={this.rednerHeader()}
          style={{ height: wrapperVisible ? 'auto' : 0, overflow: 'hidden' }}
        >
          <ListItem
            renderItem={<Input
              addonBefore={data[0].title}
              value={data[0].value}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<DummyInput
              addonBefore={data[1].title}
              value={data[1].value}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={data[2].title}
              type='tel'
              value={data[2].value}
              rule={data[2].rule}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={data[3].title}
              type='tel'
              value={data[3].value}
              rule={data[3].rule}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={data[4].title}
              value={data[4].value}
              rule={data[4].rule}
              style={{ color: '#777777' }}
            />}
          />
        </List>
      </div>
    )
  }
}

BX_InsurerInfo.propTypes = {
  visible: PropTypes.bool,
  onOk: PropTypes.func
}

export default BX_InsurerInfo;
