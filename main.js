const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");

let mainWindow;

function makeWindow() {
  mainWindow = new BrowserWindow({width: 780, height: 780});

  mainWindow.setMenu(null);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }));

  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", makeWindow);

app.on("window-all-closed", function() {
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    makeWindow();
  }
});
