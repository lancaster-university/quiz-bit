import React, { Component } from 'react'
import Answer from './Answer'

class Question extends Component {

  constructor() {
    super();
  }

  render() {
    var answers = this.props.answers.map(function(ans, index) {
			return (
        <Answer
          edit={this.props.edit}
          canDelete={this.props.answers.length > 2}
          delHandler={this.props.handlers.delAnswer}
          editHandler={this.props.handlers.editAnswer}
          key={index}
          index={index}
          label={ans}
        />
      );
		}, this);
    return (
      <div className="question-box">
        <input
          readOnly={!this.props.edit}
          onChange={this.props.handlers.editQuestion.bind(null, this.props.index)}
          value={this.props.title}
          className="question-title animated"
        />
        <ul className={"answer-box" + (this.props.edit ? " edit" : "")}>
          {answers}
          { this.props.edit && this.props.answers.length < 11 ?
            <li onClick={this.props.handlers.addAnswer} className="styled-box answer add-answer animated">
              <div className="add-answer-symbol animated"></div>
            </li>
          : null }
        </ul>
      </div>
    );
  }

}

Question.propTypes = {
  edit:       React.PropTypes.bool.isRequired,
  title:      React.PropTypes.string.isRequired,
  answers:    React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  handlers:   React.PropTypes.objectOf(React.PropTypes.func).isRequired
}

export default Question
