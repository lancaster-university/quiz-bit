import React, { Component } from 'react'

class VoteCounter extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="styled-box vote-box">
        <span>{this.props.votes}</span>
        <p>Votes In</p>
      </div>
    );
  }
}

export default VoteCounter
