import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import List from 'yzt-rui/lib/list';
import Input from 'yzt-rui/lib/input';
import Picker from 'yzt-rui/lib/picker';
import Icon from 'yzt-rui/lib/icon';
import Label from 'yzt-rui/lib/label';
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
      effectiveDatePlaceholder: '请选择',
      effectiveDateValue: '',
      data: props.data,
      effectiveDateTime: new Date(),
      guaranteeDateValue: props.data[2].value,
      /*接受天数*/
      guaranteeDateTime: props.guaranteeDateTime,
      minDate: props.minDate,
      maxDate: props.maxDate
    }
  }
  componentDidMount() {
    const { data } = this.state;
    this.isOk(data);
  }
  componentWillReceiveProps(nextProps) { }

  getGuaranteePeriod = () => {
    const { effectiveDateTime, guaranteeDateTime } = this.state;
    let startDate, endDate;
    startDate = new Date(+ new Date(effectiveDateTime) + 24 * 60 * 60 * 1000);
    endDate = new Date(+ new Date(effectiveDateTime) + (guaranteeDateTime + 1) * 24 * 60 * 60 * 1000);
    return `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()} 00:00 至 ${endDate.getFullYear()}年${endDate.getMonth() + 1}月${endDate.getDate()} 24:00`
  }
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
        <div>保险信息</div>
        <div className='icon-arrow' onClick={() => { this.setState({ wrapperVisible: !this.state.wrapperVisible }) }}>
          <Icon size='s' type={wrapperVisible ? 'arrow-up' : 'arrow-down'} style={{ color: '#C7C7CC' }} />
        </div>
      </div>
    )
  }
  renderContent() {
    const {
      className, visible, onOk, type
    } = this.props;
    const {
      data, wrapperVisible, effectiveDateValue, effectiveDateTime,
      effectiveDatePlaceholder, guaranteeDateValue, minDate, maxDate
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
            renderItem={<DummyInput
              addonBefore={data[1].title}
              value={data[1].value}
              style={{ color: '#777777' }}
            />}
          />
          <ListItem
            renderItem={<DummyInput
              addonBefore={data[2].title}
              value={guaranteeDateValue}
              style={{ color: '#777777' }}
            />}
          />
          <DatePicker
            ref={node => this.dataPicker = node}
            title=''
            mode='date'
            minDate={minDate}
            maxDate={maxDate}
            currentDate={effectiveDateTime}
            cancelBtn={{ text: '取消', onPress: (res) => { } }}
            confirmBtn={{
              text: '确认', onPress: (res) => {
                const { data } = this.state;
                this.setState({
                  effectiveDateValue: res.value,
                  effectiveDateTime: res.time
                })
                let newData = [...data];
                newData[3].value = res.value;
                this.isOk(newData);
              }
            }}
          >
            <ListItem
              renderItem={<DummyInput
                className='effective-date-input'
                addonBefore={data[3].title}
                placeholder={effectiveDatePlaceholder}
                value={effectiveDateValue}
                suffix={<Icon type='arrow-right' size='s' style={{ color: '#C7C7CC' }} />}
              />}
              onClick={() => { this.dataPicker.show() }}
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
      )
    } else if (type == 'secondary') {
      return (
        <List>
          <ListItem
            renderItem={<DummyInput
              addonBefore={data[1].title}
              value={data[1].value}
              style={{ color: '#777777' }}
            />}
          />
          <DatePicker
            ref={node => this.dataPicker = node}
            title=''
            mode='date'
            minDate={minDate}
            maxDate={maxDate}
            currentDate={effectiveDateTime}
            cancelBtn={{ text: '取消', onPress: (res) => {  }}}
            confirmBtn={{
              text: '确认', onPress: (res) => {
                const { data } = this.state;
                this.setState({
                  effectiveDateValue: res.value,
                  effectiveDateTime: res.time
                })
                let newData = [...data];
                newData[3].value = res.value;
                this.isOk(newData);
              }
            }}
          >
            <ListItem
              renderItem={<DummyInput
                className='effective-date-input'
                addonBefore={data[3].title}
                placeholder={effectiveDatePlaceholder}
                value={effectiveDateValue}
                suffix={<Icon type='arrow-right' size='s' style={{ color: '#C7C7CC' }} />}
              />}
              onClick={() => { this.dataPicker.show()}}
            />
          </DatePicker>
        </List>
      )
    }
  }
  render() {
    const { className, type } = this.props;
    const BX_InsuranceInfo = classNames('BX_InsuranceInfo', className, {
      ['is-primary']: type == 'primary',
      ['is-secondary']: type == 'secondary'
    })

    return (
      <div className={BX_InsuranceInfo}>
        {this.renderContent()}
      </div>
    )
  }
}

BX_InsuranceInfo.propTypes = {
  visible: PropTypes.bool,
  data: PropTypes.array,
  guaranteeDateTime: PropTypes.number,
  type: PropTypes.oneOf(['primary', 'secondary']),
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  onOk: PropTypes.func
}

export default BX_InsuranceInfo;
