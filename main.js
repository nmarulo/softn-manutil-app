const electron = require('electron');
const {app, BrowserWindow} = electron;
const path = require('path');
const url = require('url');
let window;

function initWindow() {
    window = new BrowserWindow({width: 1024, height: 800});
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }));
    // Quit when all windows are closed and no other one is listening to this.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin')
            app.quit();
    });
}

app.on('ready', initWindow);