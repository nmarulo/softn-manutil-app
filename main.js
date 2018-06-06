const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');
const url = require('url');

let window;

function initWindow() {
    window = new BrowserWindow({width: 800, height: 600});
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));

    // window.webContents.openDevTools();
}

app.on('ready', initWindow)