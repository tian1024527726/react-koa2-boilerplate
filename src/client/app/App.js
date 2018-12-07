import React, { Component } from 'react'
import './app.scss'
import '../styles/index.scss'

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() { }
  componentWillReceiveProps(nextProps) { }
  componentWillUnmount() { }
  render() {
    return (
      <div id='app-container'>
        {this.props.children}
      </div>
    )
  }
}

export default App;
