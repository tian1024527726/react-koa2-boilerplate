import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Toast from 'yzt-rui/lib/toast';

const LoadingIcon = <div className='Loading'>
  <div className="Loading-content">
    <div className="bounce1"></div>
    <div className="bounce2"></div>
    <div className="bounce3"></div>
  </div>
  <div className='Loading-mask'></div>
</div>

class Loading extends React.Component {
  constructor(props) {
    super(props)
  }

  static show = () => {
    Toast.loading(LoadingIcon)
    document.body.style.overflow = 'hidden';

  }

  static hide = () => {
    Toast.hide()
    document.body.style.overflow = '';
  }
}

export default Loading
