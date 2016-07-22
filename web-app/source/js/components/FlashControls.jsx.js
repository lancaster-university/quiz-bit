import React, { Component } from 'react'
import AppButton from './AppButton'
import { notify, flashHexToMicrobit } from '../utils'

class FlashControls extends Component {

  constructor(props) {
    super(props);
  }

  change(evt) {
    if (evt.target.value === "QUIZZER") {
      this.flash("../hex-files/Quizzer.hex");
    }
    else if (evt.target.value === "QUIZMASTER") {
      this.flash("../hex-files/QuizMaster.hex");
    }
    evt.target.value = "";
  }

  flash(url) {
    this.props.stateHandler(); // now flashing
    flashHexToMicrobit(url, (err) => {
      if (err && err.message !== "User cancelled") {
        err.iconUrl = "img/disconnected.svg";
        err.title = "Failed to Flash Micro:bit";
        notify(err);
      }
      this.props.stateHandler(); // finished flashing
    });
  }

  render() {
    return (
      <div className="flash-controls">
        <span className={"flash-indicator" + (this.props.flashing ? " blinking" : "")}></span>
        <select disabled={!this.props.canFlash} className="styled-box" onChange={this.change.bind(this)}>
          <option value="">Flash Micro:bit</option>
          <option value="QUIZZER">Quizzer</option>
          <option value="QUIZMASTER">Quiz Master</option>
        </select>
      </div>
    );
  }

}

FlashControls.propTypes = {
  canFlash: React.PropTypes.bool.isRequired,
  flashing: React.PropTypes.bool.isRequired,
  stateHandler: React.PropTypes.func.isRequired
}

export default FlashControls
