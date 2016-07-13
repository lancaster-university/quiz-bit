/*NB:
	Background.js has its own console window and will not output logs
	on the console for the main app.
	Click the "Inspect views: background page" under chrome://extensions/ for the app
*/

chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('index.html', {
		'outerBounds' : {
			'minWidth': 800, 
			'minHeight': 600,
			'width': 800,
			'height': 700
		}
	});
});

/*

const mbc = '/dev/cu.usbmodemFA132';
const mbt = '/dev/tty.usbmodemFA132';
const fake = '/dev/hgygfyfcgeyrf';

var portsList = [];

var expectedConnectionId;
var onConnect = function(connectionInfo) {
  //var connectionId = connectionInfo.connectionId;
  // Do whatever you need to do with the opened port.
  expectedConnectionId = connectionInfo.connectionId;
  //console.log(connectionInfo.bufferSize);
  console.log('onConnect ran!');
}


var onGetDevices = function(ports) {
  for (var i = 0; i < ports.length; i++) {
    console.log(ports[i].path + ' ' + ports[i].displayName);
    portsList.push(ports[i].path);
    if (i == 3)
    	console.log(ports[3]);
  }

}
chrome.serial.getDevices(onGetDevices);
chrome.serial.connect(mbt, {bitrate: 115200}, onConnect);



var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return decodeURIComponent(escape(encodedString));
};


var stringReceived = '';

var onReceiveCallback = function(info) {
	console.log(ab2str(info.data));

    if (info.connectionId == expectedConnectionId && info.data) {
      var str = convertArrayBufferToString(info.data);
      if (str.charAt(str.length-1) === '\n') {
        stringReceived += str.substring(0, str.length-1);
        onLineReceived(stringReceived);
        stringReceived = '';
      } else {
        stringReceived += str;
      }
    }
    console.log(stringReceived);

};

chrome.serial.onReceive.addListener(onReceiveCallback);
*/
