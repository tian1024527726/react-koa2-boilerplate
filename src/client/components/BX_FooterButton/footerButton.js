import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Button from 'yzt-rui/lib/button';
import Toast from 'yzt-rui/lib/toast';

class BX_FooterButton extends React.Component{

  static defaultProps = {
    defaultPrice: '120',
    disabled: false,
    text: '立即投保'
  }
  constructor(props){
    super(props)

    this.state = {
      price: props.price || props.defaultPrice,
      loading: false
    }
  }

  loading = () => {
    const { changeFunc } = this.props;
    this.setState({loading: true})
    changeFunc && changeFunc()
    .then(price => {this.setState({price: price,loading: false})})
    .catch(err => this.setState({price: '120起',loading: false}));
  }

  onButtonClick = (e) => {
    const { disabled, onClick } = this.props;
    const { loading } = this.state;
    if(disabled || loading){
      Toast.show('请等到试算结束',1)
      return ;
    }else{
      onClick && onClick(e)
    }
  }
  render(){
    const { price, loading } = this.state;
    const { text } = this.props;

    const BX_FooterButton = classNames('BX_FooterButton',{})
    const priceCls = classNames('price',{
      ['loading']:loading
    })
    return (
      <div className={BX_FooterButton}>
        <div>
          <span>保费(元)：</span>
          <span className={priceCls}>{!loading && price}</span>
        </div>
        <div>
          <Button
            size='fullwidth'
            type='primary'
            onClick={this.onButtonClick}
            className={'button_footer'}>{text}</Button>
        </div>
      </div>
    )
  }
}

BX_FooterButton.propTypes = {
  defaultPrice: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
  price: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.string,
  changeFunc: PropTypes.func
}

export default BX_FooterButton
