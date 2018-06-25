import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Title from 'yzt-rui/lib/title'
import Label from 'yzt-rui/lib/label'

class BX_DetailHeader extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    const {
      productPicUrl, productName, supplierName, productIntroduction
    } = this.props;

    const BX_DetailHeader = classNames('BX_DetailHeader', {})
    return (
      <div className={BX_DetailHeader}>
        <div className='top' style={{ backgroundImage: `url(${productPicUrl})` }}>
          <div className='top_content'>
            <div>
              <Title size='3' color='white'>{productName}</Title>
              <Label color='white'>{`由${supplierName}承保`}</Label>
            </div>
            <div>
              {productIntroduction.map((item,index) => {
                return  item && <Label nodeType='p' color='white' key={index}>{item}</Label>
              })}
            </div>
          </div>
        </div>
        <div className='bottom'>
        </div>
      </div>
    )
  }
}

BX_DetailHeader.propTypes = {
  productPicUrl: PropTypes.string,
  productName: PropTypes.string,
  supplierName: PropTypes.string,
  productSlogan: PropTypes.string,
  productIntroduction: PropTypes.array
}

export default BX_DetailHeader
