import React, { Component } from 'react'
import { updateChart, runChart } from '../voteChart'

class ChartPage extends Component {

  constructor() {
    super();
    this.letterColours = [
      "#F08099",
      "#00AFD1",
      '#00D18F',
      "#FBC45B",
      "#CEA2FB",
      "#d8607b",
      "#80a7e0",
      "#4bc0c0",
      "#faa376",
      "#8875b0",
      "#f0b1d8"
    ];
  }

  componentDidMount() {
    runChart();
    updateChart(this.props.answers, this.props.votes, this.letterColours);
    window.chartTimer = setInterval(function() { updateChart(this.props.answers, this.props.votes, this.letterColours); }.bind(this), 2000);
  }

  componentWillUnmount() {
    clearInterval(window.chartTimer);
  }

  render() {
    return (
      <div className="vote-results">
        <h1 className="question-title">{this.props.title}</h1>
        <canvas className="voteResults"></canvas>
      </div>
    );
  }

}

ChartPage.propTypes = {
  title:    React.PropTypes.string.isRequired,
  answers:    React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  votes:      React.PropTypes.arrayOf(React.PropTypes.number).isRequired
}

export default ChartPage
