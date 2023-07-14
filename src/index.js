import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Play,
  Pause,
  Repeat,
  ArrowUpShort,
  ArrowDownShort,
} from "react-bootstrap-icons";
import "./style.css";

let mySeconds = 0;
let myMinutes = 25;
let countdownId;
let countdownRuns = false;
let mySession = true;
let myBreakLength = 5;
let mySessionLength = 25;
let isPaused = true;

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [inSession, setInSession] = useState(true);

  const incrementSession = () => {
    if (isPaused && mySession) {
      if (mySessionLength < 60) {
        myMinutes = mySessionLength + 1;
        mySeconds = 0;
        setMinutes(myMinutes);
        setSeconds(mySeconds);
        mySessionLength++;
        setSessionLength(mySessionLength);
      }
    } else if (!mySession) {
      if (mySessionLength < 60) {
        mySessionLength++;
        setSessionLength(mySessionLength);
      }
    }
  };
  function decrementSession() {
    if (isPaused && mySession) {
      if (mySessionLength > 1) {
        myMinutes = mySessionLength - 1;
        mySeconds = 0;
        setMinutes(myMinutes);
        setSeconds(mySeconds);
        mySessionLength--;
        setSessionLength(mySessionLength);
      }
    } else if (!mySession) {
      if (mySessionLength > 1) {
        mySessionLength--;
        setSessionLength(mySessionLength);
      }
    }
  }
  function incrementBreak() {
    if (isPaused && !mySession) {
      if (myBreakLength < 60) {
        myMinutes = myBreakLength + 1;
        mySeconds = 0;
        setMinutes(myMinutes);
        setSeconds(mySeconds);
        myBreakLength++;
        setBreakLength(myBreakLength);
      }
    } else if (mySession) {
      if (myBreakLength < 60) {
        myBreakLength++;
        setBreakLength(myBreakLength);
      }
    }
  }
  function decrementBreak() {
    if (isPaused && !mySession) {
      if (myBreakLength > 1) {
        myMinutes = myBreakLength - 1;
        mySeconds = 0;
        setMinutes(myMinutes);
        setSeconds(mySeconds);
        myBreakLength--;
        setBreakLength(myBreakLength);
      }
    } else if (mySession) {
      if (myBreakLength > 1) {
        myBreakLength--;
        setBreakLength(myBreakLength);
      }
    }
  }

  function startOver() {
    clearInterval(countdownId);
    countdownId = null;
    countdownRuns = false;
    myMinutes = mySession ? myBreakLength : mySessionLength;
    setMinutes(myMinutes);
    mySession = !mySession;
    setInSession(mySession);
    countdown();
  }

  async function countdown() {
    countdownRuns = !countdownRuns;

    if (countdownRuns) {
      isPaused = false;

      countdownId = setInterval(() => {
        if (mySeconds === 0) {
          if (myMinutes === 0) {
            document.getElementById("beep").play();
            startOver();
          } else {
            myMinutes--;
            mySeconds = 59;
            setSeconds(mySeconds);
            setMinutes(myMinutes);
          }
        } else {
          mySeconds--;
          setSeconds(mySeconds);
        }
      }, 100);
    } else {
      isPaused = true;

      clearInterval(countdownId);
      countdownId = null;
    }
  }

  function reset() {
    mySeconds = 0;
    setSeconds(0);
    myMinutes = 25;
    setMinutes(25);
    isPaused = true;

    clearInterval(countdownId);
    countdownId = null;
    countdownRuns = false;
    myBreakLength = 5;
    mySessionLength = 25;
    setSessionLength(25);
    setBreakLength(5);
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    mySession = true;
    setInSession(true);
  }

  return (
    <>
      <div className="content">
        <Settings
          sessionLength={sessionLength}
          breakLength={breakLength}
          onIncrementSessionClick={incrementSession}
          onDecrementSessionClick={decrementSession}
          onIncrementBreakClick={incrementBreak}
          onDecrementBreakClick={decrementBreak}
        ></Settings>
        <Display
          sessionLength={sessionLength}
          seconds={seconds}
          minutes={minutes}
          inSession={inSession}
        />
        <Controls onPlayClick={countdown} onResetClick={reset} />
        <audio
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          typeof="audio/wav"
          id="beep"
        />
      </div>
    </>
  );
}

function Settings(props) {
  return (
    <div>
      <Break
        breakLength={props.breakLength}
        onIncrementClick={props.onIncrementBreakClick}
        onDecrementClick={props.onDecrementBreakClick}
      />
      <Session
        sessionLength={props.sessionLength}
        onIncrementClick={props.onIncrementSessionClick}
        onDecrementClick={props.onDecrementSessionClick}
      />
    </div>
  );
}

function Break(props) {
  return (
    <div>
      <label id="break-label" htmlFor="break_controls">
        Break Length:
      </label>
      <div className="time_controls" id="break_controls">
        <button
          id="break-decrement"
          className="length_button"
          onClick={props.onDecrementClick}
        >
          <ArrowDownShort size={32} />
        </button>
        <p id="break-length">{props.breakLength}</p>
        <button
          id="break-increment"
          className="length_button"
          onClick={props.onIncrementClick}
        >
          <ArrowUpShort size={32} />
        </button>
      </div>
    </div>
  );
}

function Session(props) {
  return (
    <div>
      <label id="session-label" htmlFor="session_controls">
        Session Length:
      </label>
      <div className="time_controls" id="session_controls">
        <button
          id="session-decrement"
          className="length_button"
          onClick={props.onDecrementClick}
        >
          <ArrowDownShort size={32} />
        </button>
        <p id="session-length">{props.sessionLength}</p>
        <button
          id="session-increment"
          className="length_button"
          onClick={props.onIncrementClick}
        >
          <ArrowUpShort size={32} />
        </button>
      </div>
    </div>
  );
}

function Display({ seconds, minutes, inSession }) {
  return (
    <div className="display">
      <p id="timer-label">{inSession ? "Session" : "Break"}</p>
      <h1 id="time-left">
        {minutes.toString().length < 2
          ? "0" + minutes.toString()
          : minutes.toString()}
        :
        {seconds.toString().length < 2
          ? "0" + seconds.toString()
          : seconds.toString()}
      </h1>
    </div>
  );
}

function Controls({ onPlayClick, onResetClick }) {
  return (
    <div className="controls">
      <button id="start_stop" onClick={onPlayClick}>
        <Play size={32} />
        <Pause size={32} />
      </button>
      <button id="reset" onClick={onResetClick}>
        <Repeat size={32} />
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
