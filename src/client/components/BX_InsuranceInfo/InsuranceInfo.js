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


class BX_InsuranceInfo extends React.Component {

  static defaultProps = {
    visible: true,
    data: [
      { title: '保险名称', value: '百万私家车驾乘意外险' },
      { title: '套餐类型', value: '基础款' },
      { title: '保障期限', value: '7天' },
      { title: '生效日期', value: '' },
      { title: '保障期间', value: '' }
    ],
    guaranteeDateTime: 7,
    minDate: new Date('2010/6/20'),
    maxDate: new Date('2030/6/10')
  }
  constructor(props) {
    super(props);

    this.state = {
      wrapperVisible: props.visible,
      effectiveDatePickerVisible: false,
      effectiveDatePlaceholder: '请选择',
      effectiveDateValue: '',
      effectiveDateTime: new Date(),
      guaranteeDateValue: props.data[2].value,
      /*接受天数*/
      guaranteeDateTime: props.guaranteeDateTime,
      minDate: props.minDate,
      maxDate: props.maxDate
    }
  }

  rednerHeader = () => {
    const { wrapperVisible } = this.state;
    return (
      <div>
        <div>保险信息</div>
        <div className='icon-arrow' onClick={() => { this.setState({ wrapperVisible: !this.state.wrapperVisible }) }}>
          <Icon size='s' type={wrapperVisible ? 'arrow-up' : 'arrow-down'} style={{ color: '#C7C7CC' }} />
        </div>
      </div>
    )
  }

  getGuaranteePeriod = () => {
    const { effectiveDateTime, guaranteeDateTime } = this.state;
    let startDate, endDate;
    startDate = new Date(+ new Date(effectiveDateTime) + 24 * 60 * 60 * 1000);
    endDate = new Date(+ new Date(effectiveDateTime) + (guaranteeDateTime + 1) * 24 * 60 * 60 * 1000);
    return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()} 00:00 至 ${endDate.getFullYear()}年${endDate.getMonth() + 1}月${endDate.getDate()} 24:00`
  }

  componentWillReceiveProps(nextProps){

  }
  render() {
    const {
      className, visible, data, onOk, ...restProps
    } = this.props;

    const {
      wrapperVisible, effectiveDatePickerVisible, effectiveDateValue, effectiveDateTime,
      effectiveDatePlaceholder, guaranteeDateValue, minDate, maxDate
    } = this.state;
    const BX_InsuranceInfo = classNames('BX_InsuranceInfo', className, {
    })
    return (
      <div className={BX_InsuranceInfo}>
        <List
          header={this.rednerHeader()}
          style={{ height: wrapperVisible ? 'auto' : 0, overflow: 'hidden' }}
        >
          <ListItem
            renderItem={<InputNumber
              addonBefore={data[0].title}
              value={data[0].value}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<InputNumber
              addonBefore={data[1].title}
              value={data[1].value}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<InputNumber
              addonBefore={data[2].title}
              value={guaranteeDateValue}
              style={{ color: '#777777' }}
            />}
          />
          <DatePicker
            visible={effectiveDatePickerVisible}
            title=''
            mode='date'
            minDate={minDate}
            maxDate={maxDate}
            currentDate={effectiveDateTime}
            cancelBtn={{ text: '取消', onPress: (res) => { this.setState({ effectiveDatePickerVisible: false }) } }}
            confirmBtn={{
              text: '确认', onPress: (res) => {
                this.setState({
                  effectiveDatePickerVisible: false,
                  effectiveDateValue: res.value,
                  effectiveDateTime: res.time
                })
                onOk && onOk({status:true,value:res.value})
              }
            }}
          >
            <ListItem
              renderItem={<InputNumber
                className='effective-date-input'
                addonBefore={data[3].title}
                placeholder={effectiveDatePlaceholder}
                value={effectiveDateValue}
                suffix={<Icon type='arrow-right' size='s' style={{ color: '#C7C7CC' }} />}
                onClick={() => { this.setState({ effectiveDatePickerVisible: true }) }}
              />}
            />
          </DatePicker>
          {effectiveDateValue && <ListItem
            renderItem={<Cell
              title={data[4].title}
              type='secondary'
              className='guarantee-period'
              description={this.getGuaranteePeriod()}
            />}
          />}
        </List>
      </div>
    )
  }
}

BX_InsuranceInfo.propTypes = {
  visible: PropTypes.bool,
  data: PropTypes.array,
  guaranteeDateTime: PropTypes.number,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  onOk: PropTypes.func
}

export default BX_InsuranceInfo;
