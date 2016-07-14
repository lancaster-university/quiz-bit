/* Simplify calls to chrome.notifications API */

export function notify(options) {
  chrome.notifications.create({
    type: options.type || "basic",
    iconUrl: options.iconUrl || "img/icon-128.png",
    title: options.title || "",
    message: options.message || ""
  });
}
