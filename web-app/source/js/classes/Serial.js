function Serial(dataCallback, connectCallback) {

  var connected = false;                                  // whether or not a valid Quizmaster micro:bit is connected
  var CONNECTION_INFO = null;                             // holds the Chrome API serial connection info
  var serialBuffer = [];                                  // used to buffer data until we have a full commands
  chrome.serial.onReceive.addListener(onData);
  chrome.serial.onReceiveError.addListener(onError);

  /* Handles the buffering and parsing of any received data before passing it back to the main program */
  function onData(received)
  {
    var data = String.fromCharCode.apply(null, new Uint8Array(received.data));
    serialBuffer.push(data);
    // check if it's the end of the command
    if (data.lastIndexOf(";") > -1) {
      var response = serialBuffer.join("");
      var parsedResponse = response.split(/[;:]+/);
      parsedResponse.pop(); // remove the empty index
      if (!connected && parsedResponse[0] === "ack") {
        // only confirm a connection if the micro:bit acks the connect request ack
        // this means that only correctly flashed micro:bits can succesfully connect
        connected = true;
        connectCallback(connected);
      }
      dataCallback(parsedResponse);
      serialBuffer = [];
    }
  }

  /* Handles updating the connection state for common d/c errors */
  function onError(err) {
    if (!(err.error === "device_lost") && !(err.error === "disconnected") && !(err.error === "break") && !(err.error === "system_error"))
      throw new Error(err.error);
    connected = false;
    connectCallback(connected);
  }

  /* Convert given String to Uint8Array */
  function utf8ArrayBufFromStr(str)
  {
    var strUtf8 = unescape(encodeURIComponent(str));
    var arrayBuf = new Uint8Array(strUtf8.length);
    for (var i = 0; i < strUtf8.length; i++) {
      arrayBuf[i] = strUtf8.charCodeAt(i);
    }
    return arrayBuf;
  }

  /* Attempts to write given string to the connected serial device */
  function write(str)
  {
    if (CONNECTION_INFO)
    {
      console.log(str);
      chrome.serial.send(CONNECTION_INFO.connectionId, utf8ArrayBufFromStr(str).buffer, function(info) { });
    }
  }

  /* Checks the connected serial devices for common micro:bit display names, if one matches, the callback provides the relevant port object (else it provides null) */
  function getMicrobitPort(callback) {
    chrome.serial.getDevices(function(portList) {
      for (var i = 0; i < portList.length; i++) {
        var port = portList[i];
        if ((port.displayName == 'mbed Serial Port') || ((port.displayName == 'MBED CMSIS_DAP') && (port.path.indexOf("tty") >= 0))) { // for windows and os x
          return callback(port);
        }
      }
      callback(null);
    });
  }

  /* Attempts to automatically find and connect to a microbit connected to the computer via serial
  /*    Callback provides a connected boolean (whether or not the connection was succesful) */
  function connect(callback) {
    getMicrobitPort(function(port) {
      if (port) {
        chrome.serial.connect(port.path, {bitrate: 115200}, function(connectionInfo) {
          if (chrome.runtime.lastError) {
            CONNECTION_INFO = null;
            connected = false;
            connectCallback(connected);
            console.log(chrome.runtime.lastError.message);
            return callback(connected);
          }
          else {
            // wait for micro:bit's ack response to ensure it's flashed correctly before confirming connection
            CONNECTION_INFO = connectionInfo;
            write("ack;");
            setTimeout(function() {
              if (!connected) {
                // connected micro:bit isn't flashed with the correct program
                callback(false);
              }
              else {
                callback(true);
              }
            }, 5000);
          }
        });
      }
      else {
        // no micro:bit found
        connected = false;
        connectCallback(connected);
        callback(false);
      }
    });
  }

  // initial connection attempt
  connect(()=>{});

  // public methods
  return {
    "write": function(str)
    {
      write(str);
    },
    "isConnected": function() {
      return connected;
    },
    "reconnect": function(callback) {
      if (connected)
        return callback(true);
      connect(callback);
    }
  }

}

export default Serial
