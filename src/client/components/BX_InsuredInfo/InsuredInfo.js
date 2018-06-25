import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import List from 'yzt-rui/lib/list';
import Input from 'yzt-rui/lib/input';
import Picker from 'yzt-rui/lib/picker';
import Icon from 'yzt-rui/lib/icon';
import Cell from 'yzt-rui/lib/cell';
import Label from 'yzt-rui/lib/label';

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

class BX_InsuredInfo extends React.Component {

  static defaultProps = {
    visible: true,
    data: [
      { title: '投保人姓名', value: '李如一' },
      { title: '证件类型', value: '身份证' },
      { title: '拼音/英文名', value: 'Li Yiru' }
    ]
  }
  constructor(props) {
    super(props);

    this.state = {
      wrapperVisible: props.visible,
      data: props.data
    }
  }
  onErrorMsgClick = () => {
    const { onErrorClick } = this.props;
    onErrorClick && onErrorClick();
  }
  rednerHeader = () => {
    const { wrapperVisible } = this.state;
    const { error } = this.props
    let rightWrapper;
    if (error) {
      rightWrapper = <div className='error_msg' onClick={this.onErrorMsgClick}>核保未通过,点击删除</div>
    } else {
      <div className='icon-arrow' onClick={() => { this.setState({ wrapperVisible: !this.state.wrapperVisible }) }}>
        <Icon size='s' type={wrapperVisible ? 'arrow-up' : 'arrow-down'} style={{ color: '#C7C7CC' }} />
      </div>
    }
    return (
      <div>
        <div>被投保人信息</div>
        {rightWrapper}
      </div>
    )
  }
  isOk = (data) => {
    const { onOk } = this.props;
    if (checkValueFn(data)) {
      onOk && onOk({ status: true, value: data });
    }
  }
  componentDidMount() {
    const { data } = this.state;
    this.isOk(data);
  }
  componentWillReceiveProps(nextProps) { }
  componentWillUnmount() { }
  renderContent = () => {
    const {
      className, visible, error, onErrorClick, type
    } = this.props;
    const {
      wrapperVisible, data
    } = this.state;

    if (type == 'primary') {
      return (
        <List
          header={this.rednerHeader()}
          style={{ height: wrapperVisible ? 'auto' : 0, overflow: 'hidden' }}
        >
          <ListItem
            renderItem={<DummyInput
              addonBefore={data[0].title}
              value={data[0].value}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={data[1].title}
              value={data[1].value}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={data[2].title}
              value={data[2].value}
              style={{ color: '#777777' }}
            />}
          />
        </List>
      )
    } else if (type == 'secondary') {
      const sexWrapper = <div style={{ width: '100%' }}>
        <Label nodeType='p' style={{ padding: '0 1.125rem .75rem 1.125rem' }} color='grey-dark' size='medium'>{data[1].title}</Label>
      </div>
      return (
        <List>
          <ListItem
            style={{ padding: '1rem 0 0 0' }}
            renderItem={sexWrapper}
          />
        </List>
      )
    }

  }
  render() {
    const { className, type } = this.props;

    const BX_InsuredInfo = classNames('BX_InsuredInfo', className, {
      ['is-primary']: type == 'primary',
      ['is-secondary']: type == 'secondary'
    })
    return (
      <div className={BX_InsuredInfo}>
        {this.renderContent()}
      </div>
    )
  }
}

BX_InsuredInfo.propTypes = {
  visible: PropTypes.bool,
  error: PropTypes.bool,
  clean: PropTypes.bool,
  onErrorClick: PropTypes.func,
  onCleanClick: PropTypes.func,
  onOk: PropTypes.func,
  Type: PropTypes.oneOf(['primary', 'secondary'])
}

export default BX_InsuredInfo;
