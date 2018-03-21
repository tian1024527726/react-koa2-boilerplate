import React, {PureComponent} from 'react'

import './style.scss'

class Result extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div id="result">
        result
      </div>
    );
  }
}

export default Result;
