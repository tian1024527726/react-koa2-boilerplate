import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import '../styles/index.scss'
import './style.scss'
// import BScroll from 'better-scroll'
// import Highcharts from 'highcharts'

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() { }
  componentWillReceiveProps(nextProps) { }
  render() {
    const { countDown } = this.props;
    return (
      <div id='app-container'>
        <header>
          <Link to='/'>Home</Link>
          <Link to='/One'>One</Link>
          <Link to='/Two'>Two</Link>
          <Link to='/Three'>Three</Link>
        </header>
        {this.props.children}
      </div>
    )
  }
}

const mapToState = (state) => {
  return {
    countDown: state.root.countDown
  }
};

export default connect(mapToState)(App);
