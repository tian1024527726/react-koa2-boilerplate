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
const InputNumber = Input.Number;

import { } from '@client/utils';


class BX_InsuredInfo extends React.Component {

  static defaultProps = {
    visible: true
  }
  constructor(props) {
    super(props);

    this.state = {
      wrapperVisible: props.visible
    }
  }

  rednerHeader = () => {
    const { wrapperVisible } = this.state;
    return (
      <div>
        <div>被投保人信息</div>
        <div className='icon-arrow' onClick={() => { this.setState({ wrapperVisible: !this.state.wrapperVisible }) }}>
          <Icon size='s' type={wrapperVisible ? 'arrow-up' : 'arrow-down'} style={{ color: '#C7C7CC' }} />
        </div>
      </div>
    )
  }

  componentWillReceiveProps(nextProps) {

  }
  render() {
    const {
      className, visible, data, ...restProps
    } = this.props;

    const {
      wrapperVisible
    } = this.state;
    const BX_InsuredInfo = classNames('BX_InsuredInfo', className, {
    })
    return (
      <div className={BX_InsuredInfo}>
        <List
          header={this.rednerHeader()}
          style={{ height: wrapperVisible ? 'auto' : 0, overflow: 'hidden' }}
        >
          <ListItem
            renderItem={<InputNumber
              addonBefore={'是投保人的'}
              value={'本人'}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={'被保人姓名'}
              value={'李忆如'}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={'拼音/英文名'}
              value={'Li Yiru'}
              style={{ color: '#777777' }}
            />}
          />
        </List>
      </div>
    )
  }
}

BX_InsuredInfo.propTypes = {
  visible: PropTypes.bool,
  onOk: PropTypes.func
}

export default BX_InsuredInfo;
