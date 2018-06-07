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


class BX_InsurerInfo extends React.Component {

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
        <div>投保人信息</div>
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
              addonBefore={'投保人姓名'}
              value={'李如一'}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<InputNumber
              addonBefore={'证件类型'}
              value={'身份证'}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={'证件号码'}
              type='tel'
              value={'430602198906091024'}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={'手机号'}
              type='tel'
              value={'18616731024'}
              rule={{regExp:/^\d+$/,msg:'请输入正确的手机号'}}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<Input
              addonBefore={'电子邮箱'}
              value={'430602198906091024'}
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
