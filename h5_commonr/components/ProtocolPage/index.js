import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { List, Cell } from 'yzt-rui';

class ProtocolPage extends React.Component {
  constructor(props){
    super(props);
  }

  renderDivide(){
    const divideStyle = {
      width: '100%',
      height: '.625rem',
      borderTop: '1px solid #E5E5E5'
    }
    return (
      <div style={divideStyle}></div>
    )
  }
  render() {
    const FF_Protocol = classNames('FF_Protocol');
    const divide = this.renderDivide();
    const dataSource = this.props.data || null;
    return (
      <div className={FF_Protocol}>
        {divide}
        <List
          renderItem={<Cell/>}
          dataSource={dataSource}
        />
      </div>
    )
  }
}

ProtocolPage.propTypes = {
  data: PropTypes.array
}


export default ProtocolPage;

