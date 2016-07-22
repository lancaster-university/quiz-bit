/* Simplify calls to chrome.notifications API */

export function notify(options) {
  chrome.notifications.create({
    type: options.type || "basic",
    iconUrl: options.iconUrl || "img/icon-128.png",
    title: options.title || "",
    message: options.message || ""
  });
}

/* Attempts to progamatically flash a given hex file to a micro:bit (takes a string path and callback)
 * callback(err)
 *   - err is a string describing an error or null
 *     NOTE: a null error does NOT guarantee a successful flashing but rather indicates that there was no network or file system errors during the write
 */
export function flashHexToMicrobit(path, callback) {
  asyncFileRequest(path, function(err, text) {
    if (err)
      callback(err);
    var fileName = path.slice(path.lastIndexOf('/'), path.lastIndexOf('.')) || "unknown";
    writeFile(text, {name: fileName}, callback);
  });
}

/* Grabs the text from a given document via an asynchronous http request
 * callback(err, text)
 *   - err is null or a string describing the error
 *   - text is a string or undefined
 */
function asyncFileRequest(url, callback) {
  var req = new XMLHttpRequest(callback);
  if (typeof req === "object") {
    req.onload = () => {
      if (req.readyState === 4 && req.status === 200) {
        callback.call(req, null, req.responseText);
      }
      else {
        callback.call(req, req.statusText, undefined);
      }
    }
    req.open("GET", url, true);
    req.send();
  }
}

/* Prompts the user to save data to a file on the local file system
 * parameters:
 *   - data: a string to be written
 *   - options: an optional object which can provide values for one or more of the following:
 *       -> name: a string used as the suggested name of the file to be written
 *       -> extensions: an array [] of valid extensions
 * callback(err)
 *   - err is null or an error object
 */
export function writeFile(data, options, callback) {
  if (typeof options !== "object")
    options = {}
  chrome.fileSystem.chooseEntry(
    {
      type: 'saveFile',
      suggestedName: options.name || "unknown",
      accepts: [
        {
          description: "",
          extensions: options.extensions || []
        }
      ],
      acceptsAllTypes: (((typeof options.extensions !== "undefined") && (options.extensions.length > 0)) ? false : true)
    },
    function(writableFileEntry) {
      if (chrome.runtime.lastError) {
        return callback(chrome.runtime.lastError);
      }
      writableFileEntry.createWriter(
        function(writer) {
          var truncated = false;
          var blob = new Blob([data]);
          writer.onerror = function(err) {
            return callback(err);
          };
          writer.onwriteend = function(e) {
            if (!truncated) {
              truncated = true;
              this.truncate(blob.size); // if the file already exists, erase any old data
              return callback(null);
            }
            notify({
              title: "Results Exported Succesfully",
              message: "Your results for '" + question + "' were exported succesfully"
            });
          };
          writer.write(blob);
        },
        function(err) {
          return callback(err);
        }
      );
    }
  );
}
