import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class Mask extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const maskCls = classNames('ym_mask');
    return (
      <div className={maskCls}>

      </div>
    )
  }
}

Mask.propTypes = {
  data: PropTypes.array
}


export default Mask;

