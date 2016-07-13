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