import update from 'react-addons-update'
import React, { Component } from 'react'
import ConnectionStatus from './ConnectionStatus'
import AppButton from './AppButton'
import ChartPage from './ChartPage'
import Question from './Question'
import VoteCounter from './VoteCounter'
import Serial from '../classes/Serial.js'
import { exportValuesToCsv } from '../voteChart'

class App extends Component {
  constructor() {
    super();
    this.state = {
      voting: false,                                    // is a vote current underway
      editing: false,                                   // whether we're currently in question+answer editing mode
      votes: 0,                                         // how many unique votes we've received
      mbConnected: false,                               // whether a valid Quizmaster micro:bit is connected
      page: "question",                                 // current app page
      question: "Your Question Here",
      answers: ["Answer 1", "Answer 2", "Answer 3..."],
      answerCounts: [0, 0, 0],
      voters: {},                                       // an object used to store the unique micro:bit serials and prevent duplicate voting
      questionId: -1
    }

    this.handlers = {
      editAnswer: (index, event) => {
        this.setState({
          answers: update(this.state.answers, {[index]: { $set: (event.target.value)}})
        })
      },
      delAnswer: (index, event) => {
        if (this.state.answers.length <= 2) //minimum of two answers
          return;
          this.setState({
            answers: update(this.state.answers, { $splice: [[index, 1]]})
          })
      },
      addAnswer: (index, event) => {
        if (this.state.answers.length >= 11) //maximum of 11 answers
          return;
        this.setState({
          answers: update(this.state.answers, { $push: ["???"]})
        })
      },
      editQuestion: (index, event) => {
        this.setState({
          question: event.target.value
        });
      }
    }
  }

  componentDidMount() {

    /* on App load we create a new serial connection manager that takes two callback functions:
    /*   1. called when a full message is received from the serial connection
    /*         data is an array of strings => [ command, quizID, questionID, serialNumber, answer ]
    /*   2. called when the microbit connection state changes
    /*         connected is a boolean representing the new (or current) connection state */

    window.serial = new Serial(
      (data) => {
        // handle any received answers whilst voting
        if (data[0] === "ans" && this.state.voting) {
          // ensure micro:bit serial hasn't already been seen this vote
          if (typeof this.state.voters[data[3]] === 'undefined') {
            var microbitId = data[3];
            var answerId = parseInt(data[4]);
            this.setState({
              votes: this.state.votes+1,
              voters: update(this.state.voters, {[microbitId]: { $set: true}}),
              answerCounts: update(this.state.answerCounts, {[answerId]: { $set: (this.state.answerCounts[parseInt(answerId)]+1)}})
            });
          }
          // always acknowledge a received answer, even if we've already logged it, as we can assume the sender didn't receive the first acknowledgement
          var cmd = "ack:" + data.join(":").substring(4) + ";";
          window.serial.write(cmd);
        }
      },
      (connected) => {
        this.setState({mbConnected: connected});
        if (!connected) {
          // cancel any current vote on loss of connection
          if (this.state.voting)
            this.toggleVote();
          setTimeout(function() {
            // repeatedly poll for a new micro:bit connection
            window.serial.reconnect(function() {});
          }, 1000);
        }
    });
  }

  setPage(page) {
    this.setState({
      page: page
    })
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing
    })
  }

  toggleVote() {
    let startingNewVote = !this.state.voting;
    this.setState({
      voting: !this.state.voting
    })

    if (startingNewVote) {
      // reset any vote-related state
      this.setState({
        questionId: this.state.questionId+1,
        votes: 0,
        voters: {},
        answerCounts: Array.apply(null, Array(this.state.answers.length)).map(function() { return 0 })
      }, function() {
          //AFTER the new state transaction finishes, start broadcasting set commands (the question) periodically
          window.serial.write("set:ABCD:" + this.state.questionId + ":" + this.state.answers.length + ";");
          window.sendTimer = setInterval(
            function() {
              window.serial.write("set:ABCD:" + this.state.questionId + ":" + this.state.answers.length + ";");
            }.bind(this), 3000
          );
      });
    }
    else {
      // stop broadcasting once a vote is stopped
      clearInterval(sendTimer);
    }
  }

  render() {
    var page, buttons;
    switch(this.state.page) {

      case "question":
        page =
          <Question
            edit={this.state.editing}
            title={this.state.question}
            answers={this.state.answers}
            handlers={this.handlers}
          />
        buttons =
          <div className="bottom-container">
            <VoteCounter votes={this.state.votes}/>
            <AppButton
              active={!this.state.editing}
              text="Show Results" classNames="animated"
              handleClick={this.setPage.bind(this, "results")}
            />
            <AppButton
              active={!this.state.voting}
              text={this.state.editing ? "Stop Editing" : "Edit Question"}
              classNames="animated"
              handleClick={this.toggleEdit.bind(this)}
            />
            <AppButton
              active={!this.state.editing && this.state.mbConnected}
              text={this.state.voting ? "Stop Vote" : "Start Vote"}
              handleClick={this.toggleVote.bind(this)}
              classNames={this.state.voting ? "stop-btn animated" : "start-btn animated"}
            />
          </div>
        break;

      case "results":
        page =
          <ChartPage title={this.state.question} answers={this.state.answers} votes={this.state.answerCounts}/>
        buttons =
          <div className="bottom-container">
            <AppButton
              active={!this.state.voting && (this.state.questionId > (-1))}
              text="Export"
              classNames="export-btn"
              handleClick={exportValuesToCsv.bind(null, this.state.question, this.state.answers, this.state.answerCounts)}
            />
            <AppButton
              active={true}
              text="Return"
              classNames=""
              handleClick={this.setPage.bind(this, "question")}
            />
          </div>
        break;

      default:
        page =
          <p>Failed to load page.</p>
        buttons = null
    }
    return (
      <div>
        <ConnectionStatus connected={this.state.mbConnected}/>
        <div className="wrapper">
          {page}
          {buttons}
        </div>
      </div>
    );
  }
}

export default App;
